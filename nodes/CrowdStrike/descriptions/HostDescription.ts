/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const hostOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['host'],
      },
    },
    options: [
      {
        name: 'Contain',
        value: 'contain',
        description: 'Network contain a host',
        action: 'Contain a host',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get host details by device ID',
        action: 'Get a host',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Query all hosts with filters',
        action: 'Get many hosts',
      },
      {
        name: 'Get by Hostname',
        value: 'getByHostname',
        description: 'Find hosts by hostname',
        action: 'Get host by hostname',
      },
      {
        name: 'Get by IP',
        value: 'getByIp',
        description: 'Find hosts by IP address',
        action: 'Get host by IP',
      },
      {
        name: 'Get Online Status',
        value: 'getOnlineStatus',
        description: 'Check host online status',
        action: 'Get online status',
      },
      {
        name: 'Hide',
        value: 'hide',
        description: 'Hide a host from the console',
        action: 'Hide a host',
      },
      {
        name: 'Lift Containment',
        value: 'liftContainment',
        description: 'Lift network containment from a host',
        action: 'Lift containment',
      },
      {
        name: 'Unhide',
        value: 'unhide',
        description: 'Unhide a host',
        action: 'Unhide a host',
      },
      {
        name: 'Update Tags',
        value: 'updateTags',
        description: 'Update host tags',
        action: 'Update tags',
      },
    ],
    default: 'getAll',
  },
];

export const hostFields: INodeProperties[] = [
  // Device ID field for single operations
  {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['get', 'contain', 'liftContainment', 'hide', 'unhide', 'updateTags', 'getOnlineStatus'],
      },
    },
    description: 'The unique device ID of the host',
  },
  // Hostname field
  {
    displayName: 'Hostname',
    name: 'hostname',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getByHostname'],
      },
    },
    description: 'The hostname to search for (supports wildcards)',
  },
  // IP address field
  {
    displayName: 'IP Address',
    name: 'ipAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getByIp'],
      },
    },
    description: 'The IP address to search for (local or external)',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getAll', 'getByHostname', 'getByIp'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  // Limit
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 5000,
    },
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getAll', 'getByHostname', 'getByIp'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Tags for update operation
  {
    displayName: 'Tags',
    name: 'tags',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['updateTags'],
      },
    },
    description: 'Comma-separated list of tags to apply (e.g., "FalconGroupingTags/tag1,FalconGroupingTags/tag2")',
  },
  // Action for tags
  {
    displayName: 'Tag Action',
    name: 'tagAction',
    type: 'options',
    options: [
      { name: 'Add', value: 'add' },
      { name: 'Remove', value: 'remove' },
    ],
    default: 'add',
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['updateTags'],
      },
    },
    description: 'Whether to add or remove the specified tags',
  },
  // Filters for getAll
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Platform',
        name: 'platformName',
        type: 'options',
        options: [
          { name: 'Windows', value: 'Windows' },
          { name: 'Mac', value: 'Mac' },
          { name: 'Linux', value: 'Linux' },
        ],
        default: '',
        description: 'Filter by operating system platform',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Normal', value: 'normal' },
          { name: 'Containment Pending', value: 'containment_pending' },
          { name: 'Contained', value: 'contained' },
          { name: 'Lift Containment Pending', value: 'lift_containment_pending' },
        ],
        default: '',
        description: 'Filter by containment status',
      },
      {
        displayName: 'Product Type',
        name: 'productType',
        type: 'options',
        options: [
          { name: 'Workstation', value: '1' },
          { name: 'Server', value: '2' },
          { name: 'Domain Controller', value: '3' },
        ],
        default: '',
        description: 'Filter by product type',
      },
      {
        displayName: 'Last Seen (After)',
        name: 'lastSeenAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter hosts last seen after this time',
      },
      {
        displayName: 'Last Seen (Before)',
        name: 'lastSeenBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter hosts last seen before this time',
      },
      {
        displayName: 'First Seen (After)',
        name: 'firstSeenAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter hosts first seen after this time',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Filter by tags (comma-separated)',
      },
      {
        displayName: 'Hostname Pattern',
        name: 'hostname',
        type: 'string',
        default: '',
        description: 'Filter by hostname pattern (supports wildcards)',
      },
      {
        displayName: 'OS Version',
        name: 'osVersion',
        type: 'string',
        default: '',
        description: 'Filter by OS version',
      },
      {
        displayName: 'Agent Version',
        name: 'agentVersion',
        type: 'string',
        default: '',
        description: 'Filter by agent version',
      },
    ],
  },
  // Additional options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['host'],
        operation: ['getAll', 'get', 'getByHostname', 'getByIp'],
      },
    },
    options: [
      {
        displayName: 'Sort Field',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'Hostname', value: 'hostname' },
          { name: 'Last Seen', value: 'last_seen' },
          { name: 'First Seen', value: 'first_seen' },
          { name: 'Platform', value: 'platform_name' },
          { name: 'Status', value: 'status' },
        ],
        default: 'hostname',
        description: 'Field to sort results by',
      },
      {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'options',
        options: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' },
        ],
        default: 'asc',
        description: 'Sort order for results',
      },
    ],
  },
];
