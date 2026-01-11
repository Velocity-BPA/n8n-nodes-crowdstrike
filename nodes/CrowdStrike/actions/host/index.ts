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
	crowdStrikePerformAction,
} from '../../transport';

export async function getAll(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.platformName) {
		filterParts.push(`platform_name:'${filters.platformName}'`);
	}
	if (filters.status) {
		filterParts.push(`status:'${filters.status}'`);
	}
	if (filters.productType) {
		filterParts.push(`product_type_desc:'${filters.productType}'`);
	}
	if (filters.hostname) {
		filterParts.push(`hostname:'*${filters.hostname}*'`);
	}
	if (filters.osVersion) {
		filterParts.push(`os_version:'*${filters.osVersion}*'`);
	}
	if (filters.agentVersion) {
		filterParts.push(`agent_version:'${filters.agentVersion}'`);
	}
	if (filters.tags) {
		const tagsArray = (filters.tags as string).split(',').map((t) => t.trim());
		for (const tag of tagsArray) {
			filterParts.push(`tags:'${tag}'`);
		}
	}
	if (filters.lastSeenAfter) {
		filterParts.push(`last_seen:>='${filters.lastSeenAfter}'`);
	}
	if (filters.lastSeenBefore) {
		filterParts.push(`last_seen:<='${filters.lastSeenBefore}'`);
	}
	if (filters.firstSeenAfter) {
		filterParts.push(`first_seen:>='${filters.firstSeenAfter}'`);
	}
	if (filters.firstSeenBefore) {
		filterParts.push(`first_seen:<='${filters.firstSeenBefore}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

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

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceId = this.getNodeParameter('deviceId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/devices/v2',
		{ ids: [deviceId] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`Host with ID "${deviceId}" not found`);
	}

	return response.resources[0];
}

export async function getByHostname(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const hostname = this.getNodeParameter('hostname', i) as string;
	const exactMatch = this.getNodeParameter('exactMatch', i, false) as boolean;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filter = exactMatch
		? `hostname:'${hostname}'`
		: `hostname:'*${hostname}*'`;

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

export async function getByIp(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const ipAddress = this.getNodeParameter('ipAddress', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filter = `local_ip:'${ipAddress}',external_ip:'${ipAddress}'`;

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

export async function contain(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const response = await crowdStrikePerformAction.call(
		this,
		'/devices/entities/devices-actions/v2',
		'contain',
		ids,
	);

	return response;
}

export async function liftContainment(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const response = await crowdStrikePerformAction.call(
		this,
		'/devices/entities/devices-actions/v2',
		'lift_containment',
		ids,
	);

	return response;
}

export async function hide(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const response = await crowdStrikePerformAction.call(
		this,
		'/devices/entities/devices-actions/v2',
		'hide_host',
		ids,
	);

	return response;
}

export async function unhide(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const response = await crowdStrikePerformAction.call(
		this,
		'/devices/entities/devices-actions/v2',
		'unhide_host',
		ids,
	);

	return response;
}

export async function updateTags(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const tagsToAdd = this.getNodeParameter('tagsToAdd', i, '') as string;
	const tagsToRemove = this.getNodeParameter('tagsToRemove', i, '') as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = { device_ids: ids };

	if (tagsToAdd) {
		body.tags = tagsToAdd.split(',').map((t) => `FalconGroupingTags/${t.trim()}`);
	}

	const qs: IDataObject = { action_name: 'add_tag' };

	if (tagsToRemove) {
		body.tags = tagsToRemove.split(',').map((t) => `FalconGroupingTags/${t.trim()}`);
		qs.action_name = 'remove_tag';
	}

	if (tagsToAdd && tagsToRemove) {
		// Need to do both operations
		const addBody: IDataObject = {
			device_ids: ids,
			tags: tagsToAdd.split(',').map((t) => `FalconGroupingTags/${t.trim()}`),
		};

		await crowdStrikeApiRequest.call(
			this,
			'PATCH',
			'/devices/entities/devices/tags/v1',
			addBody,
			{ action_name: 'add_tag' },
		);

		const removeBody: IDataObject = {
			device_ids: ids,
			tags: tagsToRemove.split(',').map((t) => `FalconGroupingTags/${t.trim()}`),
		};

		return crowdStrikeApiRequest.call(
			this,
			'PATCH',
			'/devices/entities/devices/tags/v1',
			removeBody,
			{ action_name: 'remove_tag' },
		);
	}

	return crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/devices/entities/devices/tags/v1',
		body,
		qs,
	);
}

export async function getOnlineStatus(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/devices/entities/online-state/v1',
		{ ids },
	);

	return response.resources || [];
}
