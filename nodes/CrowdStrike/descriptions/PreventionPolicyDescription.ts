/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const preventionPolicyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
      },
    },
    options: [
      {
        name: 'Add Members',
        value: 'addMembers',
        description: 'Add hosts to a policy',
        action: 'Add members to policy',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new prevention policy',
        action: 'Create a policy',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a prevention policy',
        action: 'Delete a policy',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get policy details by ID',
        action: 'Get a policy',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all prevention policies',
        action: 'Get many policies',
      },
      {
        name: 'Get Members',
        value: 'getMembers',
        description: 'Get hosts assigned to a policy',
        action: 'Get policy members',
      },
      {
        name: 'Remove Members',
        value: 'removeMembers',
        description: 'Remove hosts from a policy',
        action: 'Remove members from policy',
      },
      {
        name: 'Set Enabled',
        value: 'setEnabled',
        description: 'Enable or disable a policy',
        action: 'Set policy enabled',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a prevention policy',
        action: 'Update a policy',
      },
    ],
    default: 'getAll',
  },
];

export const preventionPolicyFields: INodeProperties[] = [
  // Policy ID field
  {
    displayName: 'Policy ID',
    name: 'policyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['get', 'update', 'delete', 'getMembers', 'addMembers', 'removeMembers', 'setEnabled'],
      },
    },
    description: 'The unique policy ID',
  },
  // Name for create/update
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['create'],
      },
    },
    description: 'The name for the policy',
  },
  // Platform for create
  {
    displayName: 'Platform',
    name: 'platformName',
    type: 'options',
    required: true,
    options: [
      { name: 'Windows', value: 'Windows' },
      { name: 'Mac', value: 'Mac' },
      { name: 'Linux', value: 'Linux' },
    ],
    default: 'Windows',
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['create'],
      },
    },
    description: 'The platform for the policy',
  },
  // Enabled status
  {
    displayName: 'Enabled',
    name: 'enabled',
    type: 'boolean',
    required: true,
    default: true,
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['setEnabled'],
      },
    },
    description: 'Whether to enable or disable the policy',
  },
  // Device IDs for add/remove members
  {
    displayName: 'Device IDs',
    name: 'deviceIds',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['addMembers', 'removeMembers'],
      },
    },
    description: 'Comma-separated list of device IDs',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
        operation: ['getAll', 'getMembers'],
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
        resource: ['preventionPolicy'],
        operation: ['getAll', 'getMembers'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Additional fields for create/update
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['preventionPolicy'],
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
        description: 'Description of the policy',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            '/operation': ['update'],
          },
        },
        description: 'New name for the policy',
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
        resource: ['preventionPolicy'],
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
        description: 'Filter by platform',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Filter by enabled status',
      },
      {
        displayName: 'Name Pattern',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by name pattern (supports wildcards)',
      },
    ],
  },
];
