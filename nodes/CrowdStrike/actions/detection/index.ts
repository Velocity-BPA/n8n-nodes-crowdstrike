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

	if (filters.status) {
		filterParts.push(`status:'${filters.status}'`);
	}
	if (filters.severity) {
		filterParts.push(`severity:'${filters.severity}'`);
	}
	if (filters.maxSeverity) {
		filterParts.push(`max_severity:>=${filters.maxSeverity}`);
	}
	if (filters.deviceId) {
		filterParts.push(`device.device_id:'${filters.deviceId}'`);
	}
	if (filters.hostname) {
		filterParts.push(`device.hostname:'*${filters.hostname}*'`);
	}
	if (filters.assignedToUuid) {
		filterParts.push(`assigned_to_uuid:'${filters.assignedToUuid}'`);
	}
	if (filters.tactic) {
		filterParts.push(`behaviors.tactic:'${filters.tactic}'`);
	}
	if (filters.technique) {
		filterParts.push(`behaviors.technique:'${filters.technique}'`);
	}
	if (filters.firstBehaviorAfter) {
		filterParts.push(`first_behavior:>='${filters.firstBehaviorAfter}'`);
	}
	if (filters.firstBehaviorBefore) {
		filterParts.push(`first_behavior:<='${filters.firstBehaviorBefore}'`);
	}
	if (filters.lastBehaviorAfter) {
		filterParts.push(`last_behavior:>='${filters.lastBehaviorAfter}'`);
	}
	if (filters.lastBehaviorBefore) {
		filterParts.push(`last_behavior:<='${filters.lastBehaviorBefore}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/detects/queries/detects/v1',
			'/detects/entities/summaries/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/detects/queries/detects/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/detects/entities/summaries/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const detectionId = this.getNodeParameter('detectionId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/detects/entities/summaries/GET/v1',
		{ ids: [detectionId] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Detection with ID "${detectionId}" not found`);
	}

	return response.resources[0];
}

export async function getByHost(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const deviceId = this.getNodeParameter('deviceId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filter = `device.device_id:'${deviceId}'`;
	const qs: IDataObject = { filter };

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/detects/queries/detects/v1',
			'/detects/entities/summaries/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/detects/queries/detects/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/detects/entities/summaries/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function updateStatus(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const detectionIds = this.getNodeParameter('detectionIds', i) as string;
	const status = this.getNodeParameter('status', i) as string;
	const comment = this.getNodeParameter('comment', i, '') as string;
	const ids = detectionIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
		status,
	};

	if (comment) {
		body.comment = comment;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/detects/entities/detects/v2',
		body,
	);

	return response;
}

export async function assignToUser(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const detectionIds = this.getNodeParameter('detectionIds', i) as string;
	const assignedToUuid = this.getNodeParameter('assignedToUuid', i) as string;
	const comment = this.getNodeParameter('comment', i, '') as string;
	const ids = detectionIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
		assigned_to_uuid: assignedToUuid,
	};

	if (comment) {
		body.comment = comment;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/detects/entities/detects/v2',
		body,
	);

	return response;
}

export async function addComment(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const detectionIds = this.getNodeParameter('detectionIds', i) as string;
	const comment = this.getNodeParameter('comment', i) as string;
	const ids = detectionIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
		comment,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/detects/entities/detects/v2',
		body,
	);

	return response;
}

export async function getBehaviors(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const detectionId = this.getNodeParameter('detectionId', i) as string;

	// First get the detection to extract behavior IDs
	const detectionResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/detects/entities/summaries/GET/v1',
		{ ids: [detectionId] },
	);

	if (!detectionResponse.resources || detectionResponse.resources.length === 0) {
		throw new Error(`Detection with ID "${detectionId}" not found`);
	}

	const detection = detectionResponse.resources[0] as IDataObject;
	const behaviors = (detection.behaviors || []) as IDataObject[];

	return behaviors;
}
