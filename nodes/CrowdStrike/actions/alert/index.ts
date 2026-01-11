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

	if (filters.severity) {
		filterParts.push(`severity:'${filters.severity}'`);
	}
	if (filters.status) {
		filterParts.push(`status:'${filters.status}'`);
	}
	if (filters.type) {
		filterParts.push(`type:'${filters.type}'`);
	}
	if (filters.product) {
		filterParts.push(`product:'${filters.product}'`);
	}
	if (filters.tags) {
		const tagsArray = (filters.tags as string).split(',').map((t) => t.trim());
		for (const tag of tagsArray) {
			filterParts.push(`tags:'${tag}'`);
		}
	}
	if (filters.createdAfter) {
		filterParts.push(`created_timestamp:>='${filters.createdAfter}'`);
	}
	if (filters.createdBefore) {
		filterParts.push(`created_timestamp:<='${filters.createdBefore}'`);
	}
	if (filters.deviceId) {
		filterParts.push(`device.device_id:'${filters.deviceId}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/alerts/queries/alerts/v1',
			'/alerts/entities/alerts/v2',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/alerts/queries/alerts/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/alerts/entities/alerts/v2',
		{ composite_ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const alertId = this.getNodeParameter('alertId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/alerts/entities/alerts/v2',
		{ composite_ids: [alertId] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Alert with ID "${alertId}" not found`);
	}

	return response.resources[0];
}

export async function updateStatus(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const alertIds = this.getNodeParameter('alertIds', i) as string;
	const status = this.getNodeParameter('status', i) as string;
	const comment = this.getNodeParameter('comment', i, '') as string;
	const ids = alertIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		composite_ids: ids,
		action_parameters: [
			{
				name: 'update_status',
				value: status,
			},
		],
	};

	if (comment) {
		body.action_parameters = [
			...(body.action_parameters as IDataObject[]),
			{
				name: 'append_comment',
				value: comment,
			},
		];
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/alerts/entities/alerts/v3',
		body,
	);

	return response;
}

export async function getAggregate(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const aggregateField = this.getNodeParameter('aggregateField', i) as string;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

	const filterParts: string[] = [];

	if (filters.severity) {
		filterParts.push(`severity:'${filters.severity}'`);
	}
	if (filters.status) {
		filterParts.push(`status:'${filters.status}'`);
	}
	if (filters.type) {
		filterParts.push(`type:'${filters.type}'`);
	}
	if (filters.product) {
		filterParts.push(`product:'${filters.product}'`);
	}
	if (filters.createdAfter) {
		filterParts.push(`created_timestamp:>='${filters.createdAfter}'`);
	}
	if (filters.createdBefore) {
		filterParts.push(`created_timestamp:<='${filters.createdBefore}'`);
	}

	const body: IDataObject = {
		date_ranges: [],
		field: aggregateField,
		filter: filterParts.length > 0 ? filterParts.join('+') : undefined,
		name: aggregateField,
		size: 100,
		type: 'terms',
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/alerts/aggregates/alerts/v1',
		body,
	);

	return (response.resources || []) as IDataObject[];
}
