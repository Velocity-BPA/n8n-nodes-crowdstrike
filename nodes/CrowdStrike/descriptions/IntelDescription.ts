/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const intelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['intel'],
      },
    },
    options: [
      {
        name: 'Get Actors',
        value: 'getActors',
        description: 'Query threat actors',
        action: 'Get threat actors',
      },
      {
        name: 'Get Indicators',
        value: 'getIndicators',
        description: 'Query threat indicators',
        action: 'Get threat indicators',
      },
      {
        name: 'Get Malware',
        value: 'getMalware',
        description: 'Query malware families',
        action: 'Get malware families',
      },
      {
        name: 'Get Reports',
        value: 'getReports',
        description: 'Query intel reports',
        action: 'Get intel reports',
      },
      {
        name: 'Get Rules',
        value: 'getRules',
        description: 'Get intel rules',
        action: 'Get intel rules',
      },
      {
        name: 'Get Vulnerabilities',
        value: 'getVulnerabilities',
        description: 'Query vulnerabilities from threat intel',
        action: 'Get vulnerabilities',
      },
    ],
    default: 'getIndicators',
  },
];

export const intelFields: INodeProperties[] = [
  // Indicator ID for single get
  {
    displayName: 'Indicator ID',
    name: 'indicatorId',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getIndicators'],
      },
    },
    description: 'Get a specific indicator by ID (leave empty to query)',
  },
  // Actor ID for single get
  {
    displayName: 'Actor ID',
    name: 'actorId',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getActors'],
      },
    },
    description: 'Get a specific actor by ID (leave empty to query)',
  },
  // Report ID for single get
  {
    displayName: 'Report ID',
    name: 'reportId',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getReports'],
      },
    },
    description: 'Get a specific report by ID (leave empty to query)',
  },
  // Rule type for rules
  {
    displayName: 'Rule Type',
    name: 'ruleType',
    type: 'options',
    required: true,
    options: [
      { name: 'YARA', value: 'yara-master' },
      { name: 'Snort', value: 'snort-suricata-master' },
      { name: 'Common (Snort & YARA)', value: 'common-event-format' },
    ],
    default: 'yara-master',
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getRules'],
      },
    },
    description: 'The type of rules to retrieve',
  },
  // Return All toggle
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getIndicators', 'getActors', 'getReports', 'getMalware', 'getVulnerabilities'],
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
        resource: ['intel'],
        operation: ['getIndicators', 'getActors', 'getReports', 'getMalware', 'getVulnerabilities'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  // Filters for indicators
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getIndicators'],
      },
    },
    options: [
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'MD5 Hash', value: 'hash_md5' },
          { name: 'SHA256 Hash', value: 'hash_sha256' },
          { name: 'Domain', value: 'domain' },
          { name: 'IP Address', value: 'ip_address' },
          { name: 'URL', value: 'url' },
        ],
        default: '',
        description: 'Filter by indicator type',
      },
      {
        displayName: 'Malicious Confidence',
        name: 'maliciousConfidence',
        type: 'options',
        options: [
          { name: 'High', value: 'high' },
          { name: 'Medium', value: 'medium' },
          { name: 'Low', value: 'low' },
          { name: 'Unverified', value: 'unverified' },
        ],
        default: '',
        description: 'Filter by malicious confidence',
      },
      {
        displayName: 'Published (After)',
        name: 'publishedAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter indicators published after this time',
      },
      {
        displayName: 'Published (Before)',
        name: 'publishedBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter indicators published before this time',
      },
      {
        displayName: 'Actors',
        name: 'actors',
        type: 'string',
        default: '',
        description: 'Filter by associated actors (comma-separated)',
      },
      {
        displayName: 'Malware Families',
        name: 'malwareFamilies',
        type: 'string',
        default: '',
        description: 'Filter by malware families (comma-separated)',
      },
    ],
  },
  // Filters for actors
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getActors'],
      },
    },
    options: [
      {
        displayName: 'Name Pattern',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by actor name pattern',
      },
      {
        displayName: 'Target Countries',
        name: 'targetCountries',
        type: 'string',
        default: '',
        description: 'Filter by target countries (comma-separated, e.g., "US,UK,DE")',
      },
      {
        displayName: 'Target Industries',
        name: 'targetIndustries',
        type: 'string',
        default: '',
        description: 'Filter by target industries (comma-separated)',
      },
      {
        displayName: 'Origin',
        name: 'origins',
        type: 'string',
        default: '',
        description: 'Filter by actor origin countries (comma-separated)',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
      {
        displayName: 'First Activity (After)',
        name: 'firstActivityAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter actors with first activity after this time',
      },
      {
        displayName: 'Last Activity (After)',
        name: 'lastActivityAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter actors with last activity after this time',
      },
    ],
  },
  // Filters for reports
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getReports'],
      },
    },
    options: [
      {
        displayName: 'Name Pattern',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by report name pattern',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Intelligence Report', value: 'intelligence_report' },
          { name: 'Periodic Report', value: 'periodic_report' },
          { name: 'Tipper', value: 'tipper' },
          { name: 'Notice', value: 'notice' },
        ],
        default: '',
        description: 'Filter by report type',
      },
      {
        displayName: 'Created (After)',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter reports created after this time',
      },
      {
        displayName: 'Created (Before)',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter reports created before this time',
      },
      {
        displayName: 'Actors',
        name: 'actors',
        type: 'string',
        default: '',
        description: 'Filter by associated actors (comma-separated)',
      },
      {
        displayName: 'Target Countries',
        name: 'targetCountries',
        type: 'string',
        default: '',
        description: 'Filter by target countries (comma-separated)',
      },
      {
        displayName: 'Target Industries',
        name: 'targetIndustries',
        type: 'string',
        default: '',
        description: 'Filter by target industries (comma-separated)',
      },
    ],
  },
  // Filters for malware
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getMalware'],
      },
    },
    options: [
      {
        displayName: 'Name Pattern',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by malware family name pattern',
      },
      {
        displayName: 'Capability',
        name: 'capability',
        type: 'string',
        default: '',
        description: 'Filter by malware capability',
      },
    ],
  },
  // Filters for vulnerabilities
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['intel'],
        operation: ['getVulnerabilities'],
      },
    },
    options: [
      {
        displayName: 'CVE ID',
        name: 'cveId',
        type: 'string',
        default: '',
        description: 'Filter by CVE ID (e.g., CVE-2021-44228)',
      },
    ],
  },
];
