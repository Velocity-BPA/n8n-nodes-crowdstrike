/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IPollFunctions,
  IRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import {
  CLOUD_URLS,
  type ICrowdStrikeApiResponse,
  type ICrowdStrikeCredentials,
  type ICrowdStrikeTokenResponse,
} from '../types/CrowdStrikeTypes';

interface ITokenCache {
  token: string;
  expires: number;
  cloud: string;
}

let tokenCache: ITokenCache | null = null;

/**
 * Display licensing notice on first load
 */
let licenseNoticeDisplayed = false;
export function displayLicenseNotice(): void {
  if (!licenseNoticeDisplayed) {
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
    licenseNoticeDisplayed = true;
  }
}

/**
 * Get the base URL for the specified cloud region
 */
export function getBaseUrl(cloud: string): string {
  return CLOUD_URLS[cloud] || CLOUD_URLS['US-1'];
}

/**
 * Get OAuth2 access token with caching
 */
export async function getAccessToken(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
): Promise<string> {
  const credentials = (await this.getCredentials(
    'crowdStrikeOAuth2Api',
  )) as ICrowdStrikeCredentials;
  const cloud = credentials.cloud || 'US-1';

  // Check cache - token is valid and for the same cloud
  if (tokenCache && tokenCache.expires > Date.now() && tokenCache.cloud === cloud) {
    return tokenCache.token;
  }

  const baseUrl = getBaseUrl(cloud);

  const options: IRequestOptions = {
    method: 'POST',
    uri: `${baseUrl}/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    form: {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
    },
    json: true,
  };

  try {
    const response = (await this.helpers.request(options)) as ICrowdStrikeTokenResponse;

    tokenCache = {
      token: response.access_token,
      expires: Date.now() + (response.expires_in - 60) * 1000,
      cloud,
    };

    return response.access_token;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: 'Failed to obtain access token from CrowdStrike',
    });
  }
}

/**
 * Clear the token cache (useful for testing or when credentials change)
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

/**
 * Make an authenticated request to the CrowdStrike API
 */
export async function crowdStrikeApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<ICrowdStrikeApiResponse> {
  const credentials = (await this.getCredentials(
    'crowdStrikeOAuth2Api',
  )) as ICrowdStrikeCredentials;
  const accessToken = await getAccessToken.call(this);
  const baseUrl = getBaseUrl(credentials.cloud || 'US-1');

  const options: IRequestOptions = {
    method,
    uri: `${baseUrl}${endpoint}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = (await this.helpers.request(options)) as ICrowdStrikeApiResponse;

    // Check for errors in response
    if (response.errors && response.errors.length > 0) {
      const error = response.errors[0];
      throw new NodeApiError(this.getNode(), { error } as JsonObject, {
        message: error.message || 'CrowdStrike API error',
        httpCode: String(error.code),
      });
    }

    return response;
  } catch (error) {
    // Handle rate limiting
    if ((error as IDataObject).statusCode === 429) {
      const errorResponse = (error as IDataObject).response as IDataObject | undefined;
      const headers = errorResponse?.headers as IDataObject | undefined;
      const retryAfter = headers?.['x-ratelimit-retryafter'] || 5;
      throw new NodeApiError(this.getNode(), error as JsonObject, {
        message: `Rate limited. Retry after ${retryAfter} seconds`,
        httpCode: '429',
      });
    }

    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make a paginated request and collect all results
 */
export async function crowdStrikeApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  limit = 500,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let offset = 0;

  query = query || {};
  query.limit = limit;

  do {
    query.offset = offset;
    const response = await crowdStrikeApiRequest.call(this, method, endpoint, body, query);

    const resources = response.resources || [];
    returnData.push(...(resources as IDataObject[]));

    if (resources.length < limit) {
      break;
    }

    offset += limit;
  } while (true);

  return returnData;
}

/**
 * Two-step query pattern: Get IDs first, then fetch details
 */
export async function crowdStrikeGetAllItems(
  this: IExecuteFunctions,
  queryEndpoint: string,
  detailsEndpoint: string,
  queryParams?: IDataObject,
  idsKey = 'ids',
  batchSize = 500,
  returnAll = false,
  maxResults = 100,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let offset = 0;
  const limit = Math.min(batchSize, returnAll ? batchSize : maxResults);

  const qs: IDataObject = queryParams || {};
  qs.limit = limit;

  do {
    qs.offset = offset;

    // Step 1: Query for IDs
    const queryResponse = await crowdStrikeApiRequest.call(this, 'GET', queryEndpoint, undefined, qs);

    const resourceIds = queryResponse.resources || [];
    if (resourceIds.length === 0) {
      break;
    }

    // Step 2: Get details for IDs (batch if needed)
    // Query endpoints return string IDs, not objects
    const ids = resourceIds.map((id) => String(id));
    const batches: string[][] = [];
    for (let i = 0; i < ids.length; i += 100) {
      batches.push(ids.slice(i, i + 100));
    }

    for (const batch of batches) {
      const detailsResponse = await crowdStrikeApiRequest.call(
        this,
        'POST',
        detailsEndpoint,
        { [idsKey]: batch },
      );

      if (detailsResponse.resources) {
        returnData.push(...(detailsResponse.resources as IDataObject[]));
      }

      if (!returnAll && returnData.length >= maxResults) {
        return returnData.slice(0, maxResults);
      }
    }

    if (resourceIds.length < limit) {
      break;
    }

    offset += limit;

    if (!returnAll && returnData.length >= maxResults) {
      break;
    }
  } while (true);

  return returnAll ? returnData : returnData.slice(0, maxResults);
}

/**
 * Execute an action on a resource
 */
export async function crowdStrikePerformAction(
  this: IExecuteFunctions,
  endpoint: string,
  actionName: string,
  ids: string[],
  additionalParams?: IDataObject,
): Promise<ICrowdStrikeApiResponse> {
  const body: IDataObject = {
    action_parameters: [{ name: 'action', value: actionName }],
    ids,
  };

  if (additionalParams) {
    for (const [key, value] of Object.entries(additionalParams)) {
      (body.action_parameters as IDataObject[]).push({ name: key, value });
    }
  }

  return crowdStrikeApiRequest.call(this, 'POST', endpoint, body);
}

/**
 * Build filter query string from parameters
 */
export function buildFilterQuery(filters: IDataObject): string {
  const filterParts: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filterParts.push(`${key}:[${value.map((v) => `'${v}'`).join(',')}]`);
        }
      } else if (typeof value === 'string') {
        // Check if it's a range query
        if (value.includes('>=') || value.includes('<=') || value.includes('>') || value.includes('<')) {
          filterParts.push(`${key}:${value}`);
        } else if (value.includes('*')) {
          filterParts.push(`${key}:${value}`);
        } else {
          filterParts.push(`${key}:'${value}'`);
        }
      } else {
        filterParts.push(`${key}:${value}`);
      }
    }
  }

  return filterParts.join('+');
}

/**
 * Handle errors with retry logic
 */
export async function crowdStrikeApiRequestWithRetry(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  maxRetries = 3,
): Promise<ICrowdStrikeApiResponse> {
  let lastError: Error | null = null;
  let retryDelay = 1000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await crowdStrikeApiRequest.call(this, method, endpoint, body, query);
    } catch (error) {
      lastError = error as Error;

      // Check if it's a retryable error (429 or 5xx)
      const statusCode = (error as IDataObject).httpCode;
      if (statusCode !== '429' && (!statusCode || parseInt(statusCode as string) < 500)) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}

/**
 * Validate device ID format
 */
export function validateDeviceId(deviceId: string): boolean {
  // CrowdStrike device IDs are 32-character lowercase hex strings
  return /^[a-f0-9]{32}$/i.test(deviceId);
}

/**
 * Validate detection ID format
 */
export function validateDetectionId(detectionId: string): boolean {
  // Detection IDs follow the format: ldt:xxx:xxx
  return /^ldt:[a-f0-9]+:[0-9]+$/i.test(detectionId);
}

/**
 * Validate SHA256 hash format
 */
export function validateSha256(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash);
}

/**
 * Validate MD5 hash format
 */
export function validateMd5(hash: string): boolean {
  return /^[a-f0-9]{32}$/i.test(hash);
}

/**
 * Validate IP address format (IPv4 or IPv6)
 */
export function validateIpAddress(ip: string): boolean {
  // Simple IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // Simple IPv6 validation
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Format timestamp for CrowdStrike API (ISO 8601)
 */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Parse CrowdStrike timestamp to Date
 */
export function parseTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}

/**
 * Simplify response by extracting resources
 */
export function simplifyResponse(
  response: ICrowdStrikeApiResponse,
  includeMetadata = false,
): IDataObject[] | IDataObject {
  const resources = response.resources || [];

  if (includeMetadata && response.meta) {
    return {
      resources,
      metadata: response.meta,
    };
  }

  return resources as IDataObject[];
}
