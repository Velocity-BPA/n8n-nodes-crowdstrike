/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	crowdStrikeApiRequest,
	crowdStrikeGetAllItems,
} from '../../transport';

export async function getAll(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.state) {
		filterParts.push(`state:'${filters.state}'`);
	}
	if (filters.status) {
		filterParts.push(`status:${filters.status}`);
	}
	if (filters.minSeverity) {
		filterParts.push(`fine_score:>=${filters.minSeverity}`);
	}
	if (filters.maxSeverity) {
		filterParts.push(`fine_score:<=${filters.maxSeverity}`);
	}
	if (filters.assignedToUuid) {
		filterParts.push(`assigned_to:'${filters.assignedToUuid}'`);
	}
	if (filters.tags) {
		const tagsArray = (filters.tags as string).split(',').map((t) => t.trim());
		for (const tag of tagsArray) {
			filterParts.push(`tags:'${tag}'`);
		}
	}
	if (filters.startTimeAfter) {
		filterParts.push(`start:>='${filters.startTimeAfter}'`);
	}
	if (filters.startTimeBefore) {
		filterParts.push(`start:<='${filters.startTimeBefore}'`);
	}
	if (filters.endTimeAfter) {
		filterParts.push(`end:>='${filters.endTimeAfter}'`);
	}
	if (filters.endTimeBefore) {
		filterParts.push(`end:<='${filters.endTimeBefore}'`);
	}
	if (filters.hostId) {
		filterParts.push(`host_ids:'${filters.hostId}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/incidents/queries/incidents/v1',
			'/incidents/entities/incidents/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/incidents/queries/incidents/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incidents/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const incidentId = this.getNodeParameter('incidentId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incidents/GET/v1',
		{ ids: [incidentId] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Incident with ID "${incidentId}" not found`);
	}

	return response.resources[0];
}

export async function performAction(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const incidentIds = this.getNodeParameter('incidentIds', i) as string;
	const action = this.getNodeParameter('action', i) as string;
	const value = this.getNodeParameter('value', i, '') as string;
	const ids = incidentIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
		action_parameters: [
			{
				name: action,
				value: value || action,
			},
		],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incident-actions/v1',
		body,
	);

	return response;
}

export async function updateStatus(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const incidentIds = this.getNodeParameter('incidentIds', i) as string;
	const status = this.getNodeParameter('status', i) as string;
	const ids = incidentIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
		action_parameters: [
			{
				name: 'update_status',
				value: status,
			},
		],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incident-actions/v1',
		body,
	);

	return response;
}

export async function getBehaviors(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const incidentId = this.getNodeParameter('incidentId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filter = `incident_id:'${incidentId}'`;
	const qs: IDataObject = { filter };

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/incidents/queries/behaviors/v1',
			'/incidents/entities/behaviors/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/incidents/queries/behaviors/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/behaviors/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getHosts(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const incidentId = this.getNodeParameter('incidentId', i) as string;

	// Get incident to extract host IDs
	const incidentResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incidents/GET/v1',
		{ ids: [incidentId] },
	);

	if (!incidentResponse.resources || incidentResponse.resources.length === 0) {
		throw new Error(`Incident with ID "${incidentId}" not found`);
	}

	const incident = incidentResponse.resources[0] as IDataObject;
	const hostIds = (incident.hosts || []) as IDataObject[];

	if (!Array.isArray(hostIds) || hostIds.length === 0) {
		return [];
	}

	// Fetch host details
	const hostResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/devices/v2',
		{ ids: hostIds.map((h: IDataObject) => (h.device_id as string) || String(h)) },
	);

	return hostResponse.resources || [];
}

export async function addTag(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const incidentIds = this.getNodeParameter('incidentIds', i) as string;
	const tags = this.getNodeParameter('tags', i) as string;
	const ids = incidentIds.split(',').map((id) => id.trim());
	const tagArray = tags.split(',').map((t) => t.trim());

	const body: IDataObject = {
		ids,
		action_parameters: [
			{
				name: 'add_tag',
				value: tagArray.join(','),
			},
		],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incident-actions/v1',
		body,
	);

	return response;
}

export async function removeTag(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const incidentIds = this.getNodeParameter('incidentIds', i) as string;
	const tags = this.getNodeParameter('tags', i) as string;
	const ids = incidentIds.split(',').map((id) => id.trim());
	const tagArray = tags.split(',').map((t) => t.trim());

	const body: IDataObject = {
		ids,
		action_parameters: [
			{
				name: 'delete_tag',
				value: tagArray.join(','),
			},
		],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/incidents/entities/incident-actions/v1',
		body,
	);

	return response;
}
