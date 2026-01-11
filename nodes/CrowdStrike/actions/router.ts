/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as host from './host';
import * as detection from './detection';
import * as incident from './incident';
import * as alert from './alert';
import * as preventionPolicy from './preventionPolicy';
import * as ioc from './ioc';
import * as intel from './intel';
import * as vulnerability from './vulnerability';
import * as rtr from './rtr';
import * as user from './user';
import * as hostGroup from './hostGroup';
import * as quarantine from './quarantine';

export type CrowdStrikeResource =
	| 'host'
	| 'detection'
	| 'incident'
	| 'alert'
	| 'preventionPolicy'
	| 'ioc'
	| 'intel'
	| 'vulnerability'
	| 'rtr'
	| 'user'
	| 'hostGroup'
	| 'quarantine';

export async function router(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[][]> {
	const returnData: INodeExecutionData[] = [];
	const resource = this.getNodeParameter('resource', 0) as CrowdStrikeResource;
	const operation = this.getNodeParameter('operation', 0) as string;

	const crowdStrikeResources: Record<
		CrowdStrikeResource,
		{ [key: string]: (this: IExecuteFunctions, i: number) => Promise<IDataObject | IDataObject[]> }
	> = {
		host,
		detection,
		incident,
		alert,
		preventionPolicy,
		ioc,
		intel,
		vulnerability,
		rtr,
		user,
		hostGroup,
		quarantine,
	};

	for (let i = 0; i < items.length; i++) {
		try {
			const resourceModule = crowdStrikeResources[resource];

			if (!resourceModule) {
				throw new NodeOperationError(
					this.getNode(),
					`Resource "${resource}" is not supported`,
					{ itemIndex: i },
				);
			}

			const operationFunction = resourceModule[operation];

			if (!operationFunction) {
				throw new NodeOperationError(
					this.getNode(),
					`Operation "${operation}" is not supported for resource "${resource}"`,
					{ itemIndex: i },
				);
			}

			const responseData = await operationFunction.call(this, i);

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
