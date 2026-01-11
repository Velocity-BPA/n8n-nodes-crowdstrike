/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { crowdStrikeApiRequest } from '../../transport';

export async function initSession(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceId = this.getNodeParameter('deviceId', i) as string;
	const options = this.getNodeParameter('options', i, {}) as IDataObject;

	const body: IDataObject = {
		device_id: deviceId,
	};

	if (options.queueOffline !== undefined) {
		body.queue_offline = options.queueOffline;
	}
	if (options.timeout) {
		body.timeout = options.timeout;
	}
	if (options.existingBatchId) {
		body.existing_batch_id = options.existingBatchId;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/entities/sessions/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to initialize RTR session');
	}

	return response.resources[0];
}

export async function deleteSession(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const sessionId = this.getNodeParameter('sessionId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'DELETE',
		'/real-time-response/entities/sessions/v1',
		undefined,
		{ session_id: sessionId },
	);

	return response;
}

export async function executeCommand(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const sessionId = this.getNodeParameter('sessionId', i) as string;
	const baseCommand = this.getNodeParameter('baseCommand', i) as string;
	const commandString = this.getNodeParameter('commandString', i) as string;

	const body: IDataObject = {
		session_id: sessionId,
		base_command: baseCommand,
		command_string: commandString,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/entities/command/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to execute RTR command');
	}

	return response.resources[0];
}

export async function executeAdminCommand(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const sessionId = this.getNodeParameter('sessionId', i) as string;
	const baseCommand = this.getNodeParameter('baseCommand', i) as string;
	const commandString = this.getNodeParameter('commandString', i) as string;

	const body: IDataObject = {
		session_id: sessionId,
		base_command: baseCommand,
		command_string: commandString,
	};

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/entities/admin-command/v1',
		body,
	);

	if (!response.resources || response.resources.length === 0) {
		throw new Error('Failed to execute RTR admin command');
	}

	return response.resources[0];
}

export async function getQueuedSessions(this: IExecuteFunctions, _i: number): Promise<IDataObject[]> {
	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/real-time-response/queries/sessions/v1',
	);

	if (!response.resources || response.resources.length === 0) {
		return [];
	}

	// Get session details
	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/entities/queued-sessions/GET/v1',
		{ ids: response.resources },
	);

	return detailsResponse.resources || [];
}

export async function getFiles(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const sessionId = this.getNodeParameter('sessionId', i) as string;

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/real-time-response/entities/file/v2',
		undefined,
		{ session_id: sessionId },
	);

	return response.resources || [];
}

export async function getFile(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const sessionId = this.getNodeParameter('sessionId', i) as string;
	const sha256 = this.getNodeParameter('sha256', i) as string;
	const filename = this.getNodeParameter('filename', i, '') as string;

	const qs: IDataObject = {
		session_id: sessionId,
		sha256,
	};

	if (filename) {
		qs.filename = filename;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/real-time-response/entities/extracted-file-contents/v1',
		undefined,
		qs,
	);

	return response;
}

export async function putFile(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const description = this.getNodeParameter('description', i) as string;
	const name = this.getNodeParameter('name', i) as string;
	const content = this.getNodeParameter('content', i) as string;
	const comments = this.getNodeParameter('comments', i, '') as string;

	const body: IDataObject = {
		description,
		name,
		content: Buffer.from(content).toString('base64'),
	};

	if (comments) {
		body.comments_for_audit_log = comments;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/entities/put-files/v1',
		body,
	);

	return response;
}

// Batch operations for multiple hosts
export async function initBatchSession(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const deviceIds = this.getNodeParameter('deviceIds', i) as string;
	const options = this.getNodeParameter('options', i, {}) as IDataObject;
	const ids = deviceIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		host_ids: ids,
	};

	if (options.queueOffline !== undefined) {
		body.queue_offline = options.queueOffline;
	}
	if (options.timeout) {
		body.timeout = options.timeout;
	}
	if (options.existingBatchId) {
		body.existing_batch_id = options.existingBatchId;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/combined/batch-init-session/v1',
		body,
	);

	return response;
}

export async function executeBatchCommand(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const batchId = this.getNodeParameter('batchId', i) as string;
	const baseCommand = this.getNodeParameter('baseCommand', i) as string;
	const commandString = this.getNodeParameter('commandString', i) as string;
	const options = this.getNodeParameter('options', i, {}) as IDataObject;

	const body: IDataObject = {
		batch_id: batchId,
		base_command: baseCommand,
		command_string: commandString,
	};

	if (options.hostTimeout) {
		body.host_timeout_duration = `${options.hostTimeout}s`;
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/combined/batch-command/v1',
		body,
	);

	return response;
}

export async function refreshBatchSession(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const batchId = this.getNodeParameter('batchId', i) as string;
	const options = this.getNodeParameter('options', i, {}) as IDataObject;

	const body: IDataObject = {
		batch_id: batchId,
	};

	if (options.hostsToRemove) {
		body.hosts_to_remove = (options.hostsToRemove as string).split(',').map((id) => id.trim());
	}

	const response = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/real-time-response/combined/batch-refresh-session/v1',
		body,
	);

	return response;
}
