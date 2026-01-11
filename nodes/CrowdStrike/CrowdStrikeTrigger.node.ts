/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { crowdStrikeApiRequest, displayLicenseNotice } from './transport';

// Display license notice on node load
displayLicenseNotice();

async function pollDetections(
	context: IPollFunctions,
	lastPollTime: string | undefined,
	filters: IDataObject,
): Promise<IDataObject[]> {
	const filterParts: string[] = [];

	if (lastPollTime) {
		filterParts.push(`created_timestamp:>'${lastPollTime}'`);
	}
	if (filters.hostname) {
		filterParts.push(`device.hostname:'*${filters.hostname}*'`);
	}
	if (filters.minSeverity) {
		const severityMap: { [key: string]: number } = {
			informational: 1,
			low: 2,
			medium: 3,
			high: 4,
			critical: 5,
		};
		filterParts.push(`max_severity:>=${severityMap[filters.minSeverity as string] || 1}`);
	}
	if (filters.platform) {
		filterParts.push(`device.platform_name:'${filters.platform}'`);
	}

	const qs: IDataObject = {
		sort: 'created_timestamp|asc',
		limit: 100,
	};

	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	const queryResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/detects/queries/detects/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		context,
		'POST',
		'/detects/entities/summaries/GET/v1',
		{ ids: queryResponse.resources },
	);

	return (detailsResponse.resources || []) as IDataObject[];
}

async function pollIncidents(
	context: IPollFunctions,
	lastPollTime: string | undefined,
	filters: IDataObject,
	criticalOnly: boolean,
): Promise<IDataObject[]> {
	const filterParts: string[] = [];

	if (lastPollTime) {
		filterParts.push(`start:>'${lastPollTime}'`);
	}
	if (criticalOnly) {
		filterParts.push('fine_score:>=80');
	} else if (filters.minSeverity) {
		const severityMap: { [key: string]: number } = {
			informational: 0,
			low: 20,
			medium: 40,
			high: 60,
			critical: 80,
		};
		filterParts.push(`fine_score:>=${severityMap[filters.minSeverity as string] || 0}`);
	}

	const qs: IDataObject = {
		sort: 'start.asc',
		limit: 100,
	};

	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	const queryResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/incidents/queries/incidents/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		context,
		'POST',
		'/incidents/entities/incidents/GET/v1',
		{ ids: queryResponse.resources },
	);

	return (detailsResponse.resources || []) as IDataObject[];
}

async function pollAlerts(
	context: IPollFunctions,
	lastPollTime: string | undefined,
	filters: IDataObject,
): Promise<IDataObject[]> {
	const filterParts: string[] = [];

	if (lastPollTime) {
		filterParts.push(`created_timestamp:>'${lastPollTime}'`);
	}
	if (filters.minSeverity) {
		filterParts.push(`severity:'${filters.minSeverity}'`);
	}

	const qs: IDataObject = {
		sort: 'created_timestamp|asc',
		limit: 100,
	};

	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	const queryResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/alerts/queries/alerts/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		context,
		'POST',
		'/alerts/entities/alerts/v2',
		{ composite_ids: queryResponse.resources },
	);

	return (detailsResponse.resources || []) as IDataObject[];
}

async function pollVulnerabilities(
	context: IPollFunctions,
	lastPollTime: string | undefined,
	filters: IDataObject,
): Promise<IDataObject[]> {
	const filterParts: string[] = [];

	if (lastPollTime) {
		filterParts.push(`created_timestamp:>'${lastPollTime}'`);
	}
	if (filters.hostname) {
		filterParts.push(`host_info.hostname:'*${filters.hostname}*'`);
	}
	if (filters.minSeverity) {
		filterParts.push(`cve.severity:'${filters.minSeverity}'`);
	}

	const qs: IDataObject = {
		sort: 'created_timestamp|asc',
		limit: 100,
	};

	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	const queryResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/spotlight/queries/vulnerabilities/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/spotlight/entities/vulnerabilities/v2',
		undefined,
		{ ids: queryResponse.resources },
	);

	return (detailsResponse.resources || []) as IDataObject[];
}

async function pollContainedHosts(
	context: IPollFunctions,
	lastPollTime: string | undefined,
	filters: IDataObject,
): Promise<IDataObject[]> {
	const filterParts: string[] = ["status:'contained'"];

	if (lastPollTime) {
		filterParts.push(`modified_timestamp:>'${lastPollTime}'`);
	}
	if (filters.hostname) {
		filterParts.push(`hostname:'*${filters.hostname}*'`);
	}
	if (filters.platform) {
		filterParts.push(`platform_name:'${filters.platform}'`);
	}

	const qs: IDataObject = {
		filter: filterParts.join('+'),
		sort: 'modified_timestamp|asc',
		limit: 100,
	};

	const queryResponse = await crowdStrikeApiRequest.call(
		context,
		'GET',
		'/devices/queries/devices/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		context,
		'POST',
		'/devices/entities/devices/v2',
		{ ids: queryResponse.resources },
	);

	return (detailsResponse.resources || []) as IDataObject[];
}

export class CrowdStrikeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CrowdStrike Falcon Trigger',
		name: 'crowdStrikeTrigger',
		icon: 'file:crowdstrike.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on CrowdStrike Falcon events',
		defaults: {
			name: 'CrowdStrike Falcon Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'crowdStrikeOAuth2Api',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'newDetection',
				options: [
					{
						name: 'New Alert',
						value: 'newAlert',
						description: 'Triggers when a new alert is created',
					},
					{
						name: 'New Detection',
						value: 'newDetection',
						description: 'Triggers when a new detection is created',
					},
					{
						name: 'New Incident',
						value: 'newIncident',
						description: 'Triggers when a new incident is created',
					},
					{
						name: 'New Vulnerability',
						value: 'newVulnerability',
						description: 'Triggers when a new vulnerability is discovered',
					},
					{
						name: 'Critical Incident',
						value: 'criticalIncident',
						description: 'Triggers when a critical severity incident is created',
					},
					{
						name: 'Host Contained',
						value: 'hostContained',
						description: 'Triggers when a host is network contained',
					},
				],
			},
			{
				displayName: 'Additional Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Hostname',
						name: 'hostname',
						type: 'string',
						default: '',
						description: 'Filter by hostname pattern',
					},
					{
						displayName: 'Min Severity',
						name: 'minSeverity',
						type: 'options',
						options: [
							{ name: 'Informational', value: 'informational' },
							{ name: 'Low', value: 'low' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'High', value: 'high' },
							{ name: 'Critical', value: 'critical' },
						],
						default: 'low',
						description: 'Minimum severity to trigger on',
					},
					{
						displayName: 'Platform',
						name: 'platform',
						type: 'options',
						options: [
							{ name: 'Windows', value: 'Windows' },
							{ name: 'Mac', value: 'Mac' },
							{ name: 'Linux', value: 'Linux' },
						],
						default: '',
						description: 'Filter by platform',
					},
				],
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as string;
		const filters = this.getNodeParameter('filters', {}) as IDataObject;
		const webhookData = this.getWorkflowStaticData('node');

		// Get last poll timestamp
		const lastPollTime = webhookData.lastPollTime as string | undefined;
		const currentTime = new Date().toISOString();

		try {
			let results: IDataObject[] = [];

			switch (event) {
				case 'newDetection':
					results = await pollDetections(this, lastPollTime, filters);
					break;
				case 'newIncident':
					results = await pollIncidents(this, lastPollTime, filters, false);
					break;
				case 'criticalIncident':
					results = await pollIncidents(this, lastPollTime, filters, true);
					break;
				case 'newAlert':
					results = await pollAlerts(this, lastPollTime, filters);
					break;
				case 'newVulnerability':
					results = await pollVulnerabilities(this, lastPollTime, filters);
					break;
				case 'hostContained':
					results = await pollContainedHosts(this, lastPollTime, filters);
					break;
				default:
					throw new NodeOperationError(this.getNode(), `Unknown event type: ${event}`);
			}

			// Update last poll time
			webhookData.lastPollTime = currentTime;

			if (results.length === 0) {
				return null;
			}

			return [results.map((item) => ({ json: item }))];
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error as Error);
		}
	}
}
