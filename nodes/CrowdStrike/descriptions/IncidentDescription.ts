/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const incidentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['incident'],
      },
    },
    options: [
      {
        name: 'Add Tag',
        value: 'addTag',
        description: 'Add a tag to an incident',
        action: 'Add tag to incident',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get incident details by ID',
        action: 'Get an incident',
      },
      {
        name: 'Get Behaviors',
        value: 'getBehaviors',
        description: 'Get behaviors associated with an incident',
        action: 'Get incident behaviors',
      },
      {
        name: 'Get Hosts',
        value: 'getHosts',
        description: 'Get hosts involved in an incident',
        action: 'Get incident hosts',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Query all incidents with filters',
        action: 'Get many incidents',
      },
      {
        name: 'Perform Action',
        value: 'performAction',
        description: 'Perform an action on an incident',
        action: 'Perform action on incident',
      },
      {
        name: 'Remove Tag',
        value: 'removeTag',
        description: 'Remove a tag from an incident',
        action: 'Remove tag from incident',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update the status of an incident',
        action: 'Update incident status',
      },
    ],
    default: 'getAll',
  },
];

export const incidentFields: INodeProperties[] = [
  // Incident ID field
  {
    displayName: 'Incident ID',
    name: 'incidentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['incident'],
        operation: ['get', 'updateStatus', 'performAction', 'getBehaviors', 'getHosts', 'addTag', 'removeTag'],
      },
    },
    description: 'The unique incident ID',
  },
  // Status for update
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    required: true,
    options: [
      { name: 'New', value: 'new' },
      { name: 'In Progress', value: 'in_progress' },
      { name: 'Closed', value: 'closed' },
      { name: 'Reopened', value: 'reopened' },
    ],
    default: 'new',
    displayOptions: {
      show: {
        resource: ['incident'],
        operation: ['updateStatus'],
      },
    },
    description: 'The new status for the incident',
  },
  // Action for performAction
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    options: [
      { name: 'Add Comment', value: 'add_comment' },
      { name: 'Assign to User', value: 'update_assigned_to_v2' },
      { name: 'Update Name', value: 'update_name' },
      { name: 'Update Description', value: 'update_description' },
      { name: 'Update Status', value: 'update_status' },
    ],
    default: 'add_comment',
    displayOptions: {
      show: {
        resource: ['incident'],
        operation: ['performAction'],
      },
    },
    description: 'The action to perform on the incident',
  },
  // Action value
  {
    displayName: 'Value',
    name: 'actionValue',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['incident'],
        operation: ['performAction'],
      },
    },
    description: 'The value for the action (comment text, user UUID, name, etc.)',
  },
  // Tag for add/remove
  {
    displayName: 'Tag',
    name: 'tag',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['incident'],
        operation: ['addTag', 'removeTag'],
      },
    },
    description: 'The tag to add or remove',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['incident'],
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
        resource: ['incident'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
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
        resource: ['incident'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Open', value: 'open' },
          { name: 'Closed', value: 'closed' },
        ],
        default: '',
        description: 'Filter by incident state',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'New', value: '20' },
          { name: 'Reopened', value: '25' },
          { name: 'In Progress', value: '30' },
          { name: 'Closed', value: '40' },
        ],
        default: '',
        description: 'Filter by incident status code',
      },
      {
        displayName: 'Severity (Min)',
        name: 'severityMin',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: undefined,
        description: 'Filter by minimum severity score',
      },
      {
        displayName: 'Severity (Max)',
        name: 'severityMax',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: undefined,
        description: 'Filter by maximum severity score',
      },
      {
        displayName: 'Assigned to UUID',
        name: 'assignedToUuid',
        type: 'string',
        default: '',
        description: 'Filter by assigned user UUID',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Filter by tags (comma-separated)',
      },
      {
        displayName: 'Start Time (After)',
        name: 'startTimeAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter incidents starting after this time',
      },
      {
        displayName: 'Start Time (Before)',
        name: 'startTimeBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter incidents starting before this time',
      },
      {
        displayName: 'End Time (After)',
        name: 'endTimeAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter incidents ending after this time',
      },
      {
        displayName: 'End Time (Before)',
        name: 'endTimeBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter incidents ending before this time',
      },
      {
        displayName: 'Host ID',
        name: 'hostId',
        type: 'string',
        default: '',
        description: 'Filter by involved host ID',
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
        resource: ['incident'],
        operation: ['getAll', 'get'],
      },
    },
    options: [
      {
        displayName: 'Sort Field',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'Start Time', value: 'start' },
          { name: 'End Time', value: 'end' },
          { name: 'Severity', value: 'fine_score' },
          { name: 'State', value: 'state' },
        ],
        default: 'start',
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
        default: 'desc',
        description: 'Sort order for results',
      },
    ],
  },
];
