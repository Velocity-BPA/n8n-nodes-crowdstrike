/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const iocOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['ioc'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a custom IOC',
        action: 'Create an IOC',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a custom IOC',
        action: 'Delete an IOC',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get IOC by ID',
        action: 'Get an IOC',
      },
      {
        name: 'Get Bulk',
        value: 'getBulk',
        description: 'Get IOCs in bulk',
        action: 'Get IOCs in bulk',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all custom IOCs',
        action: 'Get many IOCs',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a custom IOC',
        action: 'Update an IOC',
      },
    ],
    default: 'getAll',
  },
];

export const iocFields: INodeProperties[] = [
  // IOC ID field
  {
    displayName: 'IOC ID',
    name: 'iocId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The unique IOC ID',
  },
  // IOC IDs for bulk get
  {
    displayName: 'IOC IDs',
    name: 'iocIds',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['getBulk'],
      },
    },
    description: 'Comma-separated list of IOC IDs',
  },
  // Type for create
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    required: true,
    options: [
      { name: 'SHA256 Hash', value: 'sha256' },
      { name: 'MD5 Hash', value: 'md5' },
      { name: 'Domain', value: 'domain' },
      { name: 'IPv4 Address', value: 'ipv4' },
      { name: 'IPv6 Address', value: 'ipv6' },
    ],
    default: 'sha256',
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['create'],
      },
    },
    description: 'The type of IOC',
  },
  // Value for create
  {
    displayName: 'Value',
    name: 'value',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['create'],
      },
    },
    description: 'The IOC value (hash, domain, or IP address)',
  },
  // Action for create
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    options: [
      { name: 'Detect', value: 'detect' },
      { name: 'Allow', value: 'allow' },
      { name: 'Prevent (No UI)', value: 'prevent_no_ui' },
      { name: 'Prevent', value: 'prevent' },
    ],
    default: 'detect',
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['create'],
      },
    },
    description: 'The action to take when the IOC is detected',
  },
  // Platforms for create
  {
    displayName: 'Platforms',
    name: 'platforms',
    type: 'multiOptions',
    required: true,
    options: [
      { name: 'Windows', value: 'windows' },
      { name: 'Mac', value: 'mac' },
      { name: 'Linux', value: 'linux' },
    ],
    default: ['windows'],
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['create'],
      },
    },
    description: 'The platforms the IOC applies to',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['getAll'],
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
        resource: ['ioc'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Additional fields for create
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['ioc'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Description of the IOC',
      },
      {
        displayName: 'Severity',
        name: 'severity',
        type: 'options',
        options: [
          { name: 'Informational', value: 'informational' },
          { name: 'Low', value: 'low' },
          { name: 'Medium', value: 'medium' },
          { name: 'High', value: 'high' },
          { name: 'Critical', value: 'critical' },
        ],
        default: 'medium',
        description: 'Severity level of the IOC',
      },
      {
        displayName: 'Source',
        name: 'source',
        type: 'string',
        default: '',
        description: 'Source of the IOC (e.g., threat intel feed name)',
      },
      {
        displayName: 'Expiration',
        name: 'expiration',
        type: 'dateTime',
        default: '',
        description: 'Expiration date for the IOC',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
      },
      {
        displayName: 'Applied Globally',
        name: 'appliedGlobally',
        type: 'boolean',
        default: true,
        description: 'Whether to apply the IOC globally',
      },
      {
        displayName: 'Host Groups',
        name: 'hostGroups',
        type: 'string',
        default: '',
        description: 'Comma-separated list of host group IDs (if not applied globally)',
      },
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        options: [
          { name: 'Detect', value: 'detect' },
          { name: 'Allow', value: 'allow' },
          { name: 'Prevent (No UI)', value: 'prevent_no_ui' },
          { name: 'Prevent', value: 'prevent' },
        ],
        default: '',
        displayOptions: {
          show: {
            '/operation': ['update'],
          },
        },
        description: 'Update the action for the IOC',
      },
      {
        displayName: 'Platforms',
        name: 'platforms',
        type: 'multiOptions',
        options: [
          { name: 'Windows', value: 'windows' },
          { name: 'Mac', value: 'mac' },
          { name: 'Linux', value: 'linux' },
        ],
        default: [],
        displayOptions: {
          show: {
            '/operation': ['update'],
          },
        },
        description: 'Update the platforms for the IOC',
      },
    ],
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
        resource: ['ioc'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'SHA256 Hash', value: 'sha256' },
          { name: 'MD5 Hash', value: 'md5' },
          { name: 'Domain', value: 'domain' },
          { name: 'IPv4 Address', value: 'ipv4' },
          { name: 'IPv6 Address', value: 'ipv6' },
        ],
        default: '',
        description: 'Filter by IOC type',
      },
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        options: [
          { name: 'Detect', value: 'detect' },
          { name: 'Allow', value: 'allow' },
          { name: 'Prevent (No UI)', value: 'prevent_no_ui' },
          { name: 'Prevent', value: 'prevent' },
        ],
        default: '',
        description: 'Filter by action',
      },
      {
        displayName: 'Severity',
        name: 'severity',
        type: 'options',
        options: [
          { name: 'Informational', value: 'informational' },
          { name: 'Low', value: 'low' },
          { name: 'Medium', value: 'medium' },
          { name: 'High', value: 'high' },
          { name: 'Critical', value: 'critical' },
        ],
        default: '',
        description: 'Filter by severity',
      },
      {
        displayName: 'Source',
        name: 'source',
        type: 'string',
        default: '',
        description: 'Filter by source',
      },
      {
        displayName: 'Value Pattern',
        name: 'value',
        type: 'string',
        default: '',
        description: 'Filter by value pattern',
      },
      {
        displayName: 'Created (After)',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter IOCs created after this time',
      },
      {
        displayName: 'Created (Before)',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter IOCs created before this time',
      },
    ],
  },
];
