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

	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.groupType) {
		filterParts.push(`group_type:'${filters.groupType}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/devices/queries/host-groups/v1',
			'/devices/entities/host-groups/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/devices/queries/host-groups/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/devices/entities/host-groups/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const groupId = this.getNodeParameter('groupId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/devices/entities/host-groups/v1',
		undefined,
		{ ids: groupId },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Host group with ID "${groupId}" not found`);
	}

	return response.resources[0];
}

export async function create(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const name = this.getNodeParameter('name', i) as string;
	const groupType = this.getNodeParameter('groupType', i) as string;
	const description = this.getNodeParameter('description', i, '') as string;
	const assignmentRule = this.getNodeParameter('assignmentRule', i, '') as string;

	const groupData: IDataObject = {
		name,
		group_type: groupType,
	};

	if (description) {
		groupData.description = description;
	}

	if (groupType === 'dynamic' && assignmentRule) {
		groupData.assignment_rule = assignmentRule;
	}

	const body: IDataObject = {
		resources: [groupData],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/host-groups/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to create host group');
	}

	return response.resources[0];
}

export async function update(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const groupId = this.getNodeParameter('groupId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

	const groupData: IDataObject = { id: groupId };

	if (updateFields.name) {
		groupData.name = updateFields.name;
	}
	if (updateFields.description) {
		groupData.description = updateFields.description;
	}
	if (updateFields.assignmentRule) {
		groupData.assignment_rule = updateFields.assignmentRule;
	}

	const body: IDataObject = {
		resources: [groupData],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/devices/entities/host-groups/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to update host group');
	}

	return response.resources[0];
}

export async function deleteGroup(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const groupId = this.getNodeParameter('groupId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'DELETE',
		'/devices/entities/host-groups/v1',
		undefined,
		{ ids: groupId },
	);

	return response;
}

// Alias for delete operation since 'delete' is a reserved word
export { deleteGroup as delete };

export async function getMembers(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const groupId = this.getNodeParameter('groupId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filter = `groups:'${groupId}'`;
	const qs: IDataObject = { filter };

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/devices/queries/devices/v1',
			'/devices/entities/devices/v2',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/devices/queries/devices/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/devices/v2',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function addMembers(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const groupId = this.getNodeParameter('groupId', i) as string;
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		action_parameters: [
			{
				name: 'filter',
				value: ids.map((id) => `device_id:'${id}'`).join(','),
			},
		],
		ids: [groupId],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/host-group-actions/v1',
		body,
		{ action_name: 'add-hosts' },
	);

	return response;
}

export async function removeMembers(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const groupId = this.getNodeParameter('groupId', i) as string;
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		action_parameters: [
			{
				name: 'filter',
				value: ids.map((id) => `device_id:'${id}'`).join(','),
			},
		],
		ids: [groupId],
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/host-group-actions/v1',
		body,
		{ action_name: 'remove-hosts' },
	);

	return response;
}
