/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CrowdStrikeOAuth2Api implements ICredentialType {
  name = 'crowdStrikeOAuth2Api';
  displayName = 'CrowdStrike Falcon API';
  documentationUrl = 'https://falcon.crowdstrike.com/documentation/46/crowdstrike-oauth2-based-apis';

  properties: INodeProperties[] = [
    {
      displayName: 'Cloud Region',
      name: 'cloud',
      type: 'options',
      default: 'US-1',
      options: [
        {
          name: 'US-1 (api.crowdstrike.com)',
          value: 'US-1',
        },
        {
          name: 'US-2 (api.us-2.crowdstrike.com)',
          value: 'US-2',
        },
        {
          name: 'EU-1 (api.eu-1.crowdstrike.com)',
          value: 'EU-1',
        },
        {
          name: 'US-GOV-1 (api.laggar.gcw.crowdstrike.com)',
          value: 'US-GOV-1',
        },
      ],
      description: 'The CrowdStrike cloud region where your instance is hosted',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'The OAuth2 Client ID from your CrowdStrike API Client',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'The OAuth2 Client Secret from your CrowdStrike API Client',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.cloud === "US-1" ? "https://api.crowdstrike.com" : $credentials.cloud === "US-2" ? "https://api.us-2.crowdstrike.com" : $credentials.cloud === "EU-1" ? "https://api.eu-1.crowdstrike.com" : "https://api.laggar.gcw.crowdstrike.com"}}',
      url: '/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'client_id={{$credentials.clientId}}&client_secret={{$credentials.clientSecret}}',
    },
  };
}
