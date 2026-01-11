/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const quarantineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['quarantine'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a quarantined file',
				action: 'Delete a quarantined file',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get quarantined file details',
				action: 'Get quarantined file details',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Query all quarantined files',
				action: 'Get all quarantined files',
			},
			{
				name: 'Get by Host',
				value: 'getByHost',
				description: 'Get quarantined files for a specific host',
				action: 'Get quarantined files by host',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a file from quarantine',
				action: 'Release file from quarantine',
			},
		],
		default: 'getAll',
	},
];

export const quarantineFields: INodeProperties[] = [
	// ----------------------------------
	//         quarantine: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 5000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Date Range End',
				name: 'dateRangeEnd',
				type: 'dateTime',
				default: '',
				description: 'Filter quarantined files detected before this date',
			},
			{
				displayName: 'Date Range Start',
				name: 'dateRangeStart',
				type: 'dateTime',
				default: '',
				description: 'Filter quarantined files detected after this date',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: '',
				description: 'Filter by original filename',
			},
			{
				displayName: 'Hostname',
				name: 'hostname',
				type: 'string',
				default: '',
				description: 'Filter by source hostname',
			},
			{
				displayName: 'SHA256',
				name: 'sha256',
				type: 'string',
				default: '',
				description: 'Filter by file SHA256 hash',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{
						name: 'Deleted',
						value: 'deleted',
					},
					{
						name: 'Quarantined',
						value: 'quarantined',
					},
					{
						name: 'Released',
						value: 'released',
					},
				],
				default: 'quarantined',
				description: 'Filter by quarantine state',
			},
		],
	},

	// ----------------------------------
	//         quarantine: get
	// ----------------------------------
	{
		displayName: 'Quarantine ID',
		name: 'quarantineId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the quarantined file to retrieve',
	},

	// ----------------------------------
	//         quarantine: getByHost
	// ----------------------------------
	{
		displayName: 'Host ID',
		name: 'hostId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getByHost'],
			},
		},
		default: '',
		description: 'The device ID of the host to get quarantined files for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getByHost'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getByHost'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['getByHost'],
			},
		},
		options: [
			{
				displayName: 'Date Range End',
				name: 'dateRangeEnd',
				type: 'dateTime',
				default: '',
				description: 'Filter quarantined files detected before this date',
			},
			{
				displayName: 'Date Range Start',
				name: 'dateRangeStart',
				type: 'dateTime',
				default: '',
				description: 'Filter quarantined files detected after this date',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{
						name: 'Deleted',
						value: 'deleted',
					},
					{
						name: 'Quarantined',
						value: 'quarantined',
					},
					{
						name: 'Released',
						value: 'released',
					},
				],
				default: 'quarantined',
				description: 'Filter by quarantine state',
			},
		],
	},

	// ----------------------------------
	//         quarantine: release
	// ----------------------------------
	{
		displayName: 'Quarantine IDs',
		name: 'quarantineIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['release'],
			},
		},
		default: '',
		description: 'Comma-separated list of quarantine IDs to release',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['release'],
			},
		},
		default: '',
		description: 'Optional comment for the release action',
	},

	// ----------------------------------
	//         quarantine: delete
	// ----------------------------------
	{
		displayName: 'Quarantine IDs',
		name: 'quarantineIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Comma-separated list of quarantine IDs to delete',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['quarantine'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Optional comment for the delete action',
	},
];
