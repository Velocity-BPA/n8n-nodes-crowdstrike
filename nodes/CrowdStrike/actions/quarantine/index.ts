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
	if (filters.sha256) {
		filterParts.push(`sha256:'${filters.sha256}'`);
	}
	if (filters.filename) {
		filterParts.push(`paths.filename:'*${filters.filename}*'`);
	}
	if (filters.hostname) {
		filterParts.push(`hostname:'*${filters.hostname}*'`);
	}
	if (filters.dateRangeStart) {
		filterParts.push(`date_created:>='${filters.dateRangeStart}'`);
	}
	if (filters.dateRangeEnd) {
		filterParts.push(`date_created:<='${filters.dateRangeEnd}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/quarantine/queries/quarantined-files/v1',
			'/quarantine/entities/quarantined-files/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/quarantine/queries/quarantined-files/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/quarantine/entities/quarantined-files/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const quarantineId = this.getNodeParameter('quarantineId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/quarantine/entities/quarantined-files/GET/v1',
		{ ids: [quarantineId] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Quarantined file with ID "${quarantineId}" not found`);
	}

	return response.resources[0];
}

export async function getByHost(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const hostId = this.getNodeParameter('hostId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [`aid:'${hostId}'`];

	if (filters.state) {
		filterParts.push(`state:'${filters.state}'`);
	}
	if (filters.dateRangeStart) {
		filterParts.push(`date_created:>='${filters.dateRangeStart}'`);
	}
	if (filters.dateRangeEnd) {
		filterParts.push(`date_created:<='${filters.dateRangeEnd}'`);
	}

	const qs: IDataObject = { filter: filterParts.join('+') };

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/quarantine/queries/quarantined-files/v1',
			'/quarantine/entities/quarantined-files/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/quarantine/queries/quarantined-files/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/quarantine/entities/quarantined-files/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function release(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const quarantineIds = this.getNodeParameter('quarantineIds', i) as string;
	const comment = this.getNodeParameter('comment', i, '') as string;
	const ids = quarantineIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
	};

	if (comment) {
		body.comment = comment;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/quarantine/entities/quarantined-files/v1',
		body,
		{ action: 'release' },
	);

	return response;
}

export async function deleteFile(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const quarantineIds = this.getNodeParameter('quarantineIds', i) as string;
	const comment = this.getNodeParameter('comment', i, '') as string;
	const ids = quarantineIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		ids,
	};

	if (comment) {
		body.comment = comment;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/quarantine/entities/quarantined-files/v1',
		body,
		{ action: 'delete' },
	);

	return response;
}

// Alias for delete operation since 'delete' is a reserved word
export { deleteFile as delete };
