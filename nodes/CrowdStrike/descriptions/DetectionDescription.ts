/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const detectionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['detection'],
      },
    },
    options: [
      {
        name: 'Add Comment',
        value: 'addComment',
        description: 'Add a comment to a detection',
        action: 'Add comment to detection',
      },
      {
        name: 'Assign to User',
        value: 'assignToUser',
        description: 'Assign a detection to a user',
        action: 'Assign detection to user',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get detection details by ID',
        action: 'Get a detection',
      },
      {
        name: 'Get Behaviors',
        value: 'getBehaviors',
        description: 'Get behaviors associated with a detection',
        action: 'Get detection behaviors',
      },
      {
        name: 'Get by Host',
        value: 'getByHost',
        description: 'Get detections for a specific host',
        action: 'Get detections by host',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Query all detections with filters',
        action: 'Get many detections',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update the status of a detection',
        action: 'Update detection status',
      },
    ],
    default: 'getAll',
  },
];

export const detectionFields: INodeProperties[] = [
  // Detection ID field
  {
    displayName: 'Detection ID',
    name: 'detectionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['get', 'updateStatus', 'assignToUser', 'addComment', 'getBehaviors'],
      },
    },
    description: 'The detection ID (format: ldt:device_id:behavior_id)',
  },
  // Host ID for getByHost
  {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['getByHost'],
      },
    },
    description: 'The device ID to get detections for',
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
      { name: 'True Positive', value: 'true_positive' },
      { name: 'False Positive', value: 'false_positive' },
      { name: 'Ignored', value: 'ignored' },
      { name: 'Closed', value: 'closed' },
    ],
    default: 'new',
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['updateStatus'],
      },
    },
    description: 'The new status for the detection',
  },
  // User UUID for assignment
  {
    displayName: 'User UUID',
    name: 'userUuid',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['assignToUser'],
      },
    },
    description: 'The UUID of the user to assign the detection to',
  },
  // Comment for addComment
  {
    displayName: 'Comment',
    name: 'comment',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['addComment'],
      },
    },
    description: 'The comment to add to the detection',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['detection'],
        operation: ['getAll', 'getByHost'],
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
        resource: ['detection'],
        operation: ['getAll', 'getByHost'],
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
        resource: ['detection'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'New', value: 'new' },
          { name: 'In Progress', value: 'in_progress' },
          { name: 'True Positive', value: 'true_positive' },
          { name: 'False Positive', value: 'false_positive' },
          { name: 'Ignored', value: 'ignored' },
          { name: 'Closed', value: 'closed' },
        ],
        default: '',
        description: 'Filter by detection status',
      },
      {
        displayName: 'Severity',
        name: 'severity',
        type: 'options',
        options: [
          { name: 'Critical', value: 'Critical' },
          { name: 'High', value: 'High' },
          { name: 'Medium', value: 'Medium' },
          { name: 'Low', value: 'Low' },
          { name: 'Informational', value: 'Informational' },
        ],
        default: '',
        description: 'Filter by severity level',
      },
      {
        displayName: 'Max Severity (Number)',
        name: 'maxSeverity',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 5,
        },
        default: undefined,
        description: 'Filter by maximum severity score (1-5)',
      },
      {
        displayName: 'Device ID',
        name: 'deviceId',
        type: 'string',
        default: '',
        description: 'Filter by specific device ID',
      },
      {
        displayName: 'Hostname',
        name: 'hostname',
        type: 'string',
        default: '',
        description: 'Filter by hostname',
      },
      {
        displayName: 'First Behavior (After)',
        name: 'firstBehaviorAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter detections with first behavior after this time',
      },
      {
        displayName: 'First Behavior (Before)',
        name: 'firstBehaviorBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter detections with first behavior before this time',
      },
      {
        displayName: 'Last Behavior (After)',
        name: 'lastBehaviorAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter detections with last behavior after this time',
      },
      {
        displayName: 'Last Behavior (Before)',
        name: 'lastBehaviorBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter detections with last behavior before this time',
      },
      {
        displayName: 'Assigned to UUID',
        name: 'assignedToUuid',
        type: 'string',
        default: '',
        description: 'Filter by assigned user UUID',
      },
      {
        displayName: 'Tactic',
        name: 'tactic',
        type: 'string',
        default: '',
        description: 'Filter by MITRE ATT&CK tactic',
      },
      {
        displayName: 'Technique',
        name: 'technique',
        type: 'string',
        default: '',
        description: 'Filter by MITRE ATT&CK technique',
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
        resource: ['detection'],
        operation: ['getAll', 'get', 'getByHost'],
      },
    },
    options: [
      {
        displayName: 'Sort Field',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'First Behavior', value: 'first_behavior' },
          { name: 'Last Behavior', value: 'last_behavior' },
          { name: 'Max Severity', value: 'max_severity' },
          { name: 'Status', value: 'status' },
        ],
        default: 'last_behavior',
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
