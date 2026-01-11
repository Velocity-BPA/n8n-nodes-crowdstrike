/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const rtrOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['rtr'],
      },
    },
    options: [
      {
        name: 'Delete Session',
        value: 'deleteSession',
        description: 'Delete an RTR session',
        action: 'Delete RTR session',
      },
      {
        name: 'Execute Admin Command',
        value: 'executeAdminCommand',
        description: 'Execute an RTR admin command',
        action: 'Execute admin command',
      },
      {
        name: 'Execute Command',
        value: 'executeCommand',
        description: 'Execute an RTR command',
        action: 'Execute command',
      },
      {
        name: 'Get File',
        value: 'getFile',
        description: 'Get a file from a host',
        action: 'Get file from host',
      },
      {
        name: 'Get Files',
        value: 'getFiles',
        description: 'List files in an RTR session',
        action: 'List files in session',
      },
      {
        name: 'Get Queued Sessions',
        value: 'getQueuedSessions',
        description: 'Get queued RTR sessions',
        action: 'Get queued sessions',
      },
      {
        name: 'Init Session',
        value: 'initSession',
        description: 'Initialize an RTR session',
        action: 'Initialize RTR session',
      },
      {
        name: 'Put File',
        value: 'putFile',
        description: 'Put a file on a host',
        action: 'Put file on host',
      },
    ],
    default: 'initSession',
  },
];

export const rtrFields: INodeProperties[] = [
  // Device ID for initSession
  {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['initSession'],
      },
    },
    description: 'The device ID to connect to',
  },
  // Session ID for operations that require it
  {
    displayName: 'Session ID',
    name: 'sessionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['deleteSession', 'executeCommand', 'executeAdminCommand', 'getFiles', 'getFile', 'putFile'],
      },
    },
    description: 'The RTR session ID',
  },
  // Base command for execute operations
  {
    displayName: 'Base Command',
    name: 'baseCommand',
    type: 'options',
    required: true,
    options: [
      { name: 'cat', value: 'cat' },
      { name: 'cd', value: 'cd' },
      { name: 'clear', value: 'clear' },
      { name: 'cp', value: 'cp' },
      { name: 'csrutil', value: 'csrutil' },
      { name: 'env', value: 'env' },
      { name: 'eventlog', value: 'eventlog' },
      { name: 'filehash', value: 'filehash' },
      { name: 'getsid', value: 'getsid' },
      { name: 'history', value: 'history' },
      { name: 'ifconfig', value: 'ifconfig' },
      { name: 'ipconfig', value: 'ipconfig' },
      { name: 'kill', value: 'kill' },
      { name: 'ls', value: 'ls' },
      { name: 'map', value: 'map' },
      { name: 'memdump', value: 'memdump' },
      { name: 'mkdir', value: 'mkdir' },
      { name: 'mount', value: 'mount' },
      { name: 'mv', value: 'mv' },
      { name: 'netstat', value: 'netstat' },
      { name: 'ps', value: 'ps' },
      { name: 'pwd', value: 'pwd' },
      { name: 'reg', value: 'reg' },
      { name: 'restart', value: 'restart' },
      { name: 'rm', value: 'rm' },
      { name: 'runscript', value: 'runscript' },
      { name: 'shutdown', value: 'shutdown' },
      { name: 'umount', value: 'umount' },
      { name: 'update', value: 'update' },
      { name: 'users', value: 'users' },
      { name: 'xmemdump', value: 'xmemdump' },
      { name: 'zip', value: 'zip' },
    ],
    default: 'ls',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['executeCommand'],
      },
    },
    description: 'The base RTR command to execute',
  },
  // Admin base command
  {
    displayName: 'Admin Command',
    name: 'adminCommand',
    type: 'options',
    required: true,
    options: [
      { name: 'get', value: 'get' },
      { name: 'put', value: 'put' },
      { name: 'run', value: 'run' },
      { name: 'runscript', value: 'runscript' },
    ],
    default: 'run',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['executeAdminCommand'],
      },
    },
    description: 'The admin command to execute',
  },
  // Command arguments
  {
    displayName: 'Command Arguments',
    name: 'commandArgs',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['executeCommand', 'executeAdminCommand'],
      },
    },
    description: 'Arguments for the command (e.g., path for ls, filename for cat)',
  },
  // File path for getFile
  {
    displayName: 'File Path',
    name: 'filePath',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['getFile'],
      },
    },
    description: 'The full path to the file to retrieve',
  },
  // File name for putFile
  {
    displayName: 'File Name',
    name: 'fileName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['putFile'],
      },
    },
    description: 'The name of the file to upload (must be pre-uploaded to the CrowdStrike cloud)',
  },
  // Additional options for initSession
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['initSession'],
      },
    },
    options: [
      {
        displayName: 'Queue Offline',
        name: 'queueOffline',
        type: 'boolean',
        default: false,
        description: 'Whether to queue the session if the host is offline',
      },
      {
        displayName: 'Timeout',
        name: 'timeout',
        type: 'number',
        default: 30,
        typeOptions: {
          minValue: 1,
          maxValue: 600,
        },
        description: 'Session timeout in seconds',
      },
    ],
  },
  // Additional options for execute operations
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['executeCommand', 'executeAdminCommand'],
      },
    },
    options: [
      {
        displayName: 'Device ID',
        name: 'deviceId',
        type: 'string',
        default: '',
        description: 'Execute command on this device ID',
      },
      {
        displayName: 'Queue Offline',
        name: 'queueOffline',
        type: 'boolean',
        default: false,
        description: 'Whether to queue the command if the host is offline',
      },
    ],
  },
  // Return All toggle for getQueuedSessions
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['getQueuedSessions'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  // Limit for getQueuedSessions
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 1000,
    },
    displayOptions: {
      show: {
        resource: ['rtr'],
        operation: ['getQueuedSessions'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];
