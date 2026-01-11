/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const hostGroupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['hostGroup'],
      },
    },
    options: [
      {
        name: 'Add Members',
        value: 'addMembers',
        description: 'Add hosts to a group',
        action: 'Add members to group',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new host group',
        action: 'Create a host group',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a host group',
        action: 'Delete a host group',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get host group by ID',
        action: 'Get a host group',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all host groups',
        action: 'Get many host groups',
      },
      {
        name: 'Get Members',
        value: 'getMembers',
        description: 'Get hosts in a group',
        action: 'Get group members',
      },
      {
        name: 'Remove Members',
        value: 'removeMembers',
        description: 'Remove hosts from a group',
        action: 'Remove members from group',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a host group',
        action: 'Update a host group',
      },
    ],
    default: 'getAll',
  },
];

export const hostGroupFields: INodeProperties[] = [
  // Group ID field
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['hostGroup'],
        operation: ['get', 'update', 'delete', 'getMembers', 'addMembers', 'removeMembers'],
      },
    },
    description: 'The unique host group ID',
  },
  // Name for create
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['hostGroup'],
        operation: ['create'],
      },
    },
    description: 'The name for the host group',
  },
  // Group type for create
  {
    displayName: 'Group Type',
    name: 'groupType',
    type: 'options',
    required: true,
    options: [
      { name: 'Static', value: 'static' },
      { name: 'Dynamic', value: 'dynamic' },
    ],
    default: 'static',
    displayOptions: {
      show: {
        resource: ['hostGroup'],
        operation: ['create'],
      },
    },
    description: 'The type of host group',
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
        resource: ['hostGroup'],
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
        resource: ['hostGroup'],
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
        resource: ['hostGroup'],
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
        resource: ['hostGroup'],
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
        description: 'Description of the host group',
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
        description: 'New name for the host group',
      },
      {
        displayName: 'Assignment Rule',
        name: 'assignmentRule',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        displayOptions: {
          show: {
            '/groupType': ['dynamic'],
          },
        },
        description: 'FQL query for dynamic group assignment (e.g., "platform_name:\'Windows\'+hostname:*DC*")',
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
        resource: ['hostGroup'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Name Pattern',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by name pattern (supports wildcards)',
      },
      {
        displayName: 'Group Type',
        name: 'groupType',
        type: 'options',
        options: [
          { name: 'Static', value: 'static' },
          { name: 'Dynamic', value: 'dynamic' },
        ],
        default: '',
        description: 'Filter by group type',
      },
    ],
  },
];
