/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { router } from './actions/router';
import { displayLicenseNotice } from './transport';

import {
	hostOperations,
	hostFields,
} from './descriptions/HostDescription';
import {
	detectionOperations,
	detectionFields,
} from './descriptions/DetectionDescription';
import {
	incidentOperations,
	incidentFields,
} from './descriptions/IncidentDescription';
import {
	alertOperations,
	alertFields,
} from './descriptions/AlertDescription';
import {
	preventionPolicyOperations,
	preventionPolicyFields,
} from './descriptions/PreventionPolicyDescription';
import {
	iocOperations,
	iocFields,
} from './descriptions/IocDescription';
import {
	intelOperations,
	intelFields,
} from './descriptions/IntelDescription';
import {
	vulnerabilityOperations,
	vulnerabilityFields,
} from './descriptions/VulnerabilityDescription';
import {
	rtrOperations,
	rtrFields,
} from './descriptions/RtrDescription';
import {
	userOperations,
	userFields,
} from './descriptions/UserDescription';
import {
	hostGroupOperations,
	hostGroupFields,
} from './descriptions/HostGroupDescription';
import {
	quarantineOperations,
	quarantineFields,
} from './descriptions/QuarantineDescription';

// Display license notice on node load
displayLicenseNotice();

export class CrowdStrike implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CrowdStrike Falcon',
		name: 'crowdStrike',
		icon: 'file:crowdstrike.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with CrowdStrike Falcon API for endpoint detection, threat intelligence, and incident response',
		defaults: {
			name: 'CrowdStrike Falcon',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'crowdStrikeOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Alert',
						value: 'alert',
					},
					{
						name: 'Detection',
						value: 'detection',
					},
					{
						name: 'Host',
						value: 'host',
					},
					{
						name: 'Host Group',
						value: 'hostGroup',
					},
					{
						name: 'Incident',
						value: 'incident',
					},
					{
						name: 'Intel',
						value: 'intel',
					},
					{
						name: 'IOC',
						value: 'ioc',
					},
					{
						name: 'Prevention Policy',
						value: 'preventionPolicy',
					},
					{
						name: 'Quarantine',
						value: 'quarantine',
					},
					{
						name: 'Real Time Response',
						value: 'rtr',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Vulnerability',
						value: 'vulnerability',
					},
				],
				default: 'host',
			},
			// Host
			...hostOperations,
			...hostFields,
			// Detection
			...detectionOperations,
			...detectionFields,
			// Incident
			...incidentOperations,
			...incidentFields,
			// Alert
			...alertOperations,
			...alertFields,
			// Prevention Policy
			...preventionPolicyOperations,
			...preventionPolicyFields,
			// IOC
			...iocOperations,
			...iocFields,
			// Intel
			...intelOperations,
			...intelFields,
			// Vulnerability
			...vulnerabilityOperations,
			...vulnerabilityFields,
			// RTR
			...rtrOperations,
			...rtrFields,
			// User
			...userOperations,
			...userFields,
			// Host Group
			...hostGroupOperations,
			...hostGroupFields,
			// Quarantine
			...quarantineOperations,
			...quarantineFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		return router.call(this, items);
	}
}
