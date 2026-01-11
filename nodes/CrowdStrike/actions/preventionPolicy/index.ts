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

	if (filters.platform) {
		filterParts.push(`platform_name:'${filters.platform}'`);
	}
	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.enabled !== undefined) {
		filterParts.push(`enabled:${filters.enabled}`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/policy/queries/prevention/v1',
			'/policy/entities/prevention/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/policy/queries/prevention/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/policy/entities/prevention/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/policy/entities/prevention/v1',
		undefined,
		{ ids: policyId },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Prevention policy with ID "${policyId}" not found`);
	}

	return response.resources[0];
}

export async function create(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const name = this.getNodeParameter('name', i) as string;
	const platform = this.getNodeParameter('platform', i) as string;
	const description = this.getNodeParameter('description', i, '') as string;

	const body: IDataObject = {
		resources: [
			{
				name,
				platform_name: platform,
				description,
			},
		],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/policy/entities/prevention/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to create prevention policy');
	}

	return response.resources[0];
}

export async function update(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

	const policyData: IDataObject = { id: policyId };

	if (updateFields.name) {
		policyData.name = updateFields.name;
	}
	if (updateFields.description) {
		policyData.description = updateFields.description;
	}
	if (updateFields.settings) {
		policyData.settings = updateFields.settings;
	}

	const body: IDataObject = {
		resources: [policyData],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/policy/entities/prevention/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to update prevention policy');
	}

	return response.resources[0];
}

export async function deletePolicy(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'DELETE',
		'/policy/entities/prevention/v1',
		undefined,
		{ ids: policyId },
	);

	return response;
}

// Alias for delete operation since 'delete' is a reserved word
export { deletePolicy as delete };

export async function getMembers(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const policyId = this.getNodeParameter('policyId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const qs: IDataObject = { id: policyId };

	if (!returnAll) {
		qs.limit = limit;
	}

	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/policy/queries/prevention-members/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const deviceResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/devices/v2',
		{ ids: queryResponse.resources },
	);

	return deviceResponse.resources || [];
}

export async function addMembers(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		action_parameters: [
			{
				name: 'group_id',
				value: policyId,
			},
		],
		ids,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/policy/entities/prevention-actions/v1',
		body,
		{ action_name: 'add-host-group-members' },
	);

	return response;
}

export async function removeMembers(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		action_parameters: [
			{
				name: 'group_id',
				value: policyId,
			},
		],
		ids,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/policy/entities/prevention-actions/v1',
		body,
		{ action_name: 'remove-host-group-members' },
	);

	return response;
}

export async function setEnabled(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const policyId = this.getNodeParameter('policyId', i) as string;
	const enabled = this.getNodeParameter('enabled', i) as boolean;

	const actionName = enabled ? 'enable' : 'disable';

	const body: IDataObject = {
		ids: [policyId],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/policy/entities/prevention-actions/v1',
		body,
		{ action_name: actionName },
	);

	return response;
}
