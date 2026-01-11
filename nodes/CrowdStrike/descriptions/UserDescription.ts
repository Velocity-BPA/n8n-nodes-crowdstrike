/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Assign Role',
        value: 'assignRole',
        description: 'Assign a role to a user',
        action: 'Assign role to user',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new user',
        action: 'Create a user',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a user',
        action: 'Delete a user',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get user by UUID',
        action: 'Get a user',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all users',
        action: 'Get many users',
      },
      {
        name: 'Get Roles',
        value: 'getRoles',
        description: 'Get roles for a user',
        action: 'Get user roles',
      },
      {
        name: 'Revoke Role',
        value: 'revokeRole',
        description: 'Revoke a role from a user',
        action: 'Revoke role from user',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a user',
        action: 'Update a user',
      },
    ],
    default: 'getAll',
  },
];

export const userFields: INodeProperties[] = [
  // User UUID field
  {
    displayName: 'User UUID',
    name: 'userUuid',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'update', 'delete', 'getRoles', 'assignRole', 'revokeRole'],
      },
    },
    description: 'The unique user UUID',
  },
  // Email for create
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'user@example.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'The email address for the new user',
  },
  // Role ID for assign/revoke
  {
    displayName: 'Role ID',
    name: 'roleId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['assignRole', 'revokeRole'],
      },
    },
    description: 'The role ID to assign or revoke',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user'],
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
      maxValue: 500,
    },
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'User\'s first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'User\'s last name',
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
        resource: ['user'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Email Pattern',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email pattern',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'Filter by first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Filter by last name',
      },
    ],
  },
];
