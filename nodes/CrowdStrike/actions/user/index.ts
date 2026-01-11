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

	if (filters.email) {
		filterParts.push(`uid:'*${filters.email}*'`);
	}
	if (filters.firstName) {
		filterParts.push(`first_name:'*${filters.firstName}*'`);
	}
	if (filters.lastName) {
		filterParts.push(`last_name:'*${filters.lastName}*'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/users/queries/user-uuids-by-cid/v1',
			'/users/entities/users/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/users/queries/user-uuids-by-cid/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/users/entities/users/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function get(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const uuid = this.getNodeParameter('uuid', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/users/entities/users/v1',
		undefined,
		{ ids: uuid },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error(`User with UUID "${uuid}" not found`);
	}

	return response.resources[0];
}

export async function create(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const email = this.getNodeParameter('email', i) as string;
	const firstName = this.getNodeParameter('firstName', i) as string;
	const lastName = this.getNodeParameter('lastName', i) as string;

	const body: IDataObject = {
		uid: email,
		first_name: firstName,
		last_name: lastName,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/users/entities/users/v1',
		{ resources: [body] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to create user');
	}

	return response.resources[0];
}

export async function update(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const uuid = this.getNodeParameter('uuid', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

	const userData: IDataObject = { uuid };

	if (updateFields.firstName) {
		userData.first_name = updateFields.firstName;
	}
	if (updateFields.lastName) {
		userData.last_name = updateFields.lastName;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'PATCH',
		'/users/entities/users/v1',
		{ resources: [userData] },
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to update user');
	}

	return response.resources[0];
}

export async function deleteUser(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const uuid = this.getNodeParameter('uuid', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'DELETE',
		'/users/entities/users/v1',
		undefined,
		{ ids: uuid },
	);

	return response;
}

// Alias for delete operation since 'delete' is a reserved word
export { deleteUser as delete };

export async function getRoles(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const uuid = this.getNodeParameter('uuid', i) as string;

	// First get the user to get their roles
	const userResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/users/entities/users/v1',
		undefined,
		{ ids: uuid },
	);

	if (!userResponse.resources || userResponse.resources.length === 0) {
		throw new Error(`User with UUID "${uuid}" not found`);
	}

	const user = userResponse.resources[0] as IDataObject;
	const roleIds = (user.roles || []) as string[];

	if (!Array.isArray(roleIds) || roleIds.length === 0) {
		return [];
	}

	// Get role details
	const rolesResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/user-roles/entities/user-roles/v1',
		undefined,
		{ ids: roleIds },
	);

	return rolesResponse.resources || [];
}

export async function assignRole(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const uuid = this.getNodeParameter('uuid', i) as string;
	const roleId = this.getNodeParameter('roleId', i) as string;

	const body: IDataObject = {
		role_ids: [roleId],
		uuid,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/user-roles/entities/user-role-actions/v1',
		body,
		{ action: 'grant' },
	);

	return response;
}

export async function revokeRole(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const uuid = this.getNodeParameter('uuid', i) as string;
	const roleId = this.getNodeParameter('roleId', i) as string;

	const body: IDataObject = {
		role_ids: [roleId],
		uuid,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/user-roles/entities/user-role-actions/v1',
		body,
		{ action: 'revoke' },
	);

	return response;
}

// Get available roles
export async function getAvailableRoles(this: IExecuteFunctions, _i: number): Promise<IDataObject[]> {
	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/user-roles/queries/user-role-ids-by-cid/v1',
	);

	if (!response.resources || response.resources.length === 0) {
		return [];
	}

	const rolesResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/user-roles/entities/user-roles/v1',
		undefined,
		{ ids: response.resources },
	);

	return rolesResponse.resources || [];
}
