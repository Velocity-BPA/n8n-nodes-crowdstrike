/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const alertOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['alert'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get alert details by ID',
        action: 'Get an alert',
      },
      {
        name: 'Get Aggregate',
        value: 'getAggregate',
        description: 'Get alert aggregates',
        action: 'Get alert aggregates',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Query all alerts with filters',
        action: 'Get many alerts',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update alert status',
        action: 'Update alert status',
      },
    ],
    default: 'getAll',
  },
];

export const alertFields: INodeProperties[] = [
  // Alert ID field
  {
    displayName: 'Alert ID',
    name: 'alertId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['alert'],
        operation: ['get', 'updateStatus'],
      },
    },
    description: 'The composite alert ID',
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
        resource: ['alert'],
        operation: ['updateStatus'],
      },
    },
    description: 'The new status for the alert',
  },
  // Aggregation field
  {
    displayName: 'Aggregate Field',
    name: 'aggregateField',
    type: 'options',
    required: true,
    options: [
      { name: 'Severity', value: 'severity' },
      { name: 'Status', value: 'status' },
      { name: 'Type', value: 'type' },
      { name: 'Product', value: 'product' },
      { name: 'Tactic', value: 'tactic' },
      { name: 'Technique', value: 'technique' },
    ],
    default: 'severity',
    displayOptions: {
      show: {
        resource: ['alert'],
        operation: ['getAggregate'],
      },
    },
    description: 'The field to aggregate by',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['alert'],
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
        resource: ['alert'],
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
        resource: ['alert'],
        operation: ['getAll', 'getAggregate'],
      },
    },
    options: [
      {
        displayName: 'Severity',
        name: 'severity',
        type: 'options',
        options: [
          { name: 'Critical', value: 'critical' },
          { name: 'High', value: 'high' },
          { name: 'Medium', value: 'medium' },
          { name: 'Low', value: 'low' },
          { name: 'Informational', value: 'informational' },
        ],
        default: '',
        description: 'Filter by severity level',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'New', value: 'new' },
          { name: 'In Progress', value: 'in_progress' },
          { name: 'Closed', value: 'closed' },
          { name: 'Reopened', value: 'reopened' },
        ],
        default: '',
        description: 'Filter by alert status',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Detection', value: 'detection' },
          { name: 'Incident', value: 'incident' },
        ],
        default: '',
        description: 'Filter by alert type',
      },
      {
        displayName: 'Product',
        name: 'product',
        type: 'options',
        options: [
          { name: 'Endpoint Protection', value: 'epp' },
          { name: 'Mobile', value: 'mobile' },
          { name: 'Identity Protection', value: 'idp' },
          { name: 'Firewall', value: 'fw' },
        ],
        default: '',
        description: 'Filter by product',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Filter by tags (comma-separated)',
      },
      {
        displayName: 'Created (After)',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter alerts created after this time',
      },
      {
        displayName: 'Created (Before)',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter alerts created before this time',
      },
      {
        displayName: 'Device ID',
        name: 'deviceId',
        type: 'string',
        default: '',
        description: 'Filter by device ID',
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
        resource: ['alert'],
        operation: ['getAll', 'get'],
      },
    },
    options: [
      {
        displayName: 'Sort Field',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'Created Time', value: 'created_timestamp' },
          { name: 'Updated Time', value: 'updated_timestamp' },
          { name: 'Severity', value: 'severity' },
        ],
        default: 'created_timestamp',
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
