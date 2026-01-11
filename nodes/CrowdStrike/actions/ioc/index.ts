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

	if (filters.type) {
		filterParts.push(`type:'${filters.type}'`);
	}
	if (filters.value) {
		filterParts.push(`value:'${filters.value}'`);
	}
	if (filters.action) {
		filterParts.push(`action:'${filters.action}'`);
	}
	if (filters.severity) {
		filterParts.push(`severity:'${filters.severity}'`);
	}
	if (filters.source) {
		filterParts.push(`source:'*${filters.source}*'`);
	}
	if (filters.platforms) {
		const platformArray = (filters.platforms as string).split(',').map((p) => p.trim());
		for (const platform of platformArray) {
			filterParts.push(`platforms:'${platform}'`);
		}
	}
	if (filters.tags) {
		const tagsArray = (filters.tags as string).split(',').map((t) => t.trim());
		for (const tag of tagsArray) {
			filterParts.push(`tags:'${tag}'`);
		}
	}
	if (filters.expiredBefore) {
		filterParts.push(`expiration:<='${filters.expiredBefore}'`);
	}
	if (filters.expiredAfter) {
		filterParts.push(`expiration:>='${filters.expiredAfter}'`);
	}
	if (filters.createdAfter) {
		filterParts.push(`created_on:>='${filters.createdAfter}'`);
	}
	if (filters.createdBefore) {
		filterParts.push(`created_on:<='${filters.createdBefore}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/iocs/queries/indicators/v1',
			'/iocs/entities/indicators/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/iocs/queries/indicators/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/iocs/entities/indicators/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const iocId = this.getNodeParameter('iocId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/iocs/entities/indicators/v1',
		undefined,
		{ ids: iocId },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`IOC with ID "${iocId}" not found`);
	}

	return response.resources[0];
}

export async function create(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const type = this.getNodeParameter('type', i) as string;
	const value = this.getNodeParameter('value', i) as string;
	const action = this.getNodeParameter('action', i) as string;
	const platforms = this.getNodeParameter('platforms', i) as string[];
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const indicator: IDataObject = {
		type,
		value,
		action,
		platforms,
	};

	if (additionalFields.severity) {
		indicator.severity = additionalFields.severity;
	}
	if (additionalFields.description) {
		indicator.description = additionalFields.description;
	}
	if (additionalFields.source) {
		indicator.source = additionalFields.source;
	}
	if (additionalFields.expiration) {
		indicator.expiration = additionalFields.expiration;
	}
	if (additionalFields.tags) {
		indicator.tags = (additionalFields.tags as string).split(',').map((t) => t.trim());
	}
	if (additionalFields.appliedGlobally !== undefined) {
		indicator.applied_globally = additionalFields.appliedGlobally;
	}
	if (additionalFields.hostGroups) {
		indicator.host_groups = (additionalFields.hostGroups as string).split(',').map((g) => g.trim());
	}

	const body: IDataObject = {
		indicators: [indicator],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/iocs/entities/indicators/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to create IOC');
	}

	return response.resources[0];
}

export async function update(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const iocId = this.getNodeParameter('iocId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

	const indicator: IDataObject = { id: iocId };

	if (updateFields.action) {
		indicator.action = updateFields.action;
	}
	if (updateFields.severity) {
		indicator.severity = updateFields.severity;
	}
	if (updateFields.description) {
		indicator.description = updateFields.description;
	}
	if (updateFields.source) {
		indicator.source = updateFields.source;
	}
	if (updateFields.expiration) {
		indicator.expiration = updateFields.expiration;
	}
	if (updateFields.tags) {
		indicator.tags = (updateFields.tags as string).split(',').map((t) => t.trim());
	}
	if (updateFields.platforms) {
		indicator.platforms = updateFields.platforms;
	}
	if (updateFields.appliedGlobally !== undefined) {
		indicator.applied_globally = updateFields.appliedGlobally;
	}
	if (updateFields.hostGroups) {
		indicator.host_groups = (updateFields.hostGroups as string).split(',').map((g) => g.trim());
	}

	const body: IDataObject = {
		indicators: [indicator],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/iocs/entities/indicators/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to update IOC');
	}

	return response.resources[0];
}

export async function deleteIoc(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const iocIds = this.getNodeParameter('iocIds', i) as string;
	const ids = iocIds.split(',').map((id) => id.trim());

	const response = await crowdStrikeApiRequest.call(
		this,
		'DELETE',
		'/iocs/entities/indicators/v1',
		undefined,
		{ ids },
	);

	return response;
}

// Alias for delete operation since 'delete' is a reserved word
export { deleteIoc as delete };

export async function getBulk(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const iocIds = this.getNodeParameter('iocIds', i) as string;
	const ids = iocIds.split(',').map((id) => id.trim());

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/iocs/entities/indicators/v1',
		undefined,
		{ ids },
	);

	return response.resources || [];
}
