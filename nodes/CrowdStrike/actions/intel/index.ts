/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	crowdStrikeApiRequest,
	crowdStrikeGetAllItems,
} from '../../transport';

export async function getIndicators(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.type) {
		filterParts.push(`type:'${filters.type}'`);
	}
	if (filters.maliciousConfidence) {
		filterParts.push(`malicious_confidence:'${filters.maliciousConfidence}'`);
	}
	if (filters.publishedDateAfter) {
		filterParts.push(`published_date:>='${filters.publishedDateAfter}'`);
	}
	if (filters.publishedDateBefore) {
		filterParts.push(`published_date:<='${filters.publishedDateBefore}'`);
	}
	if (filters.actors) {
		const actorArray = (filters.actors as string).split(',').map((a) => a.trim());
		for (const actor of actorArray) {
			filterParts.push(`actors:'${actor}'`);
		}
	}
	if (filters.malwareFamilies) {
		const malwareArray = (filters.malwareFamilies as string).split(',').map((m) => m.trim());
		for (const malware of malwareArray) {
			filterParts.push(`malware_families:'${malware}'`);
		}
	}
	if (filters.labels) {
		const labelArray = (filters.labels as string).split(',').map((l) => l.trim());
		for (const label of labelArray) {
			filterParts.push(`labels.name:'${label}'`);
		}
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/indicators/v1',
			'/intel/entities/indicators/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/indicators/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/intel/entities/indicators/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getActors(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.targetCountries) {
		const countryArray = (filters.targetCountries as string).split(',').map((c) => c.trim());
		for (const country of countryArray) {
			filterParts.push(`target_countries:'${country}'`);
		}
	}
	if (filters.targetIndustries) {
		const industryArray = (filters.targetIndustries as string).split(',').map((ind) => ind.trim());
		for (const industry of industryArray) {
			filterParts.push(`target_industries:'${industry}'`);
		}
	}
	if (filters.origins) {
		const originArray = (filters.origins as string).split(',').map((o) => o.trim());
		for (const origin of originArray) {
			filterParts.push(`origins:'${origin}'`);
		}
	}
	if (filters.active !== undefined) {
		filterParts.push(`active:${filters.active}`);
	}
	if (filters.firstActivityAfter) {
		filterParts.push(`first_activity_date:>='${filters.firstActivityAfter}'`);
	}
	if (filters.firstActivityBefore) {
		filterParts.push(`first_activity_date:<='${filters.firstActivityBefore}'`);
	}
	if (filters.lastActivityAfter) {
		filterParts.push(`last_activity_date:>='${filters.lastActivityAfter}'`);
	}
	if (filters.lastActivityBefore) {
		filterParts.push(`last_activity_date:<='${filters.lastActivityBefore}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/actors/v1',
			'/intel/entities/actors/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/actors/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/entities/actors/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getReports(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.type) {
		filterParts.push(`type:'${filters.type}'`);
	}
	if (filters.actors) {
		const actorArray = (filters.actors as string).split(',').map((a) => a.trim());
		for (const actor of actorArray) {
			filterParts.push(`actors.name:'${actor}'`);
		}
	}
	if (filters.targetCountries) {
		const countryArray = (filters.targetCountries as string).split(',').map((c) => c.trim());
		for (const country of countryArray) {
			filterParts.push(`target_countries:'${country}'`);
		}
	}
	if (filters.targetIndustries) {
		const industryArray = (filters.targetIndustries as string).split(',').map((ind) => ind.trim());
		for (const industry of industryArray) {
			filterParts.push(`target_industries:'${industry}'`);
		}
	}
	if (filters.createdAfter) {
		filterParts.push(`created_date:>='${filters.createdAfter}'`);
	}
	if (filters.createdBefore) {
		filterParts.push(`created_date:<='${filters.createdBefore}'`);
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/reports/v1',
			'/intel/entities/reports/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/reports/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/entities/reports/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getMalware(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.actors) {
		const actorArray = (filters.actors as string).split(',').map((a) => a.trim());
		for (const actor of actorArray) {
			filterParts.push(`actors:'${actor}'`);
		}
	}
	if (filters.capabilities) {
		const capabilityArray = (filters.capabilities as string).split(',').map((c) => c.trim());
		for (const capability of capabilityArray) {
			filterParts.push(`capability:'${capability}'`);
		}
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/malware/v1',
			'/intel/entities/malware/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/malware/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/entities/malware/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getVulnerabilities(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.cveId) {
		filterParts.push(`id:'${filters.cveId}'`);
	}
	if (filters.actors) {
		const actorArray = (filters.actors as string).split(',').map((a) => a.trim());
		for (const actor of actorArray) {
			filterParts.push(`actors:'${actor}'`);
		}
	}

	const qs: IDataObject = {};
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/vulnerabilities/v1',
			'/intel/entities/vulnerabilities/GET/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/vulnerabilities/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'POST',
		'/intel/entities/vulnerabilities/GET/v1',
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}

export async function getRules(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const ruleType = this.getNodeParameter('ruleType', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 100) as number;

	const filterParts: string[] = [];

	if (filters.name) {
		filterParts.push(`name:'*${filters.name}*'`);
	}
	if (filters.actors) {
		const actorArray = (filters.actors as string).split(',').map((a) => a.trim());
		for (const actor of actorArray) {
			filterParts.push(`actors:'${actor}'`);
		}
	}
	if (filters.malwareFamilies) {
		const malwareArray = (filters.malwareFamilies as string).split(',').map((m) => m.trim());
		for (const malware of malwareArray) {
			filterParts.push(`malware_families:'${malware}'`);
		}
	}

	const qs: IDataObject = { type: ruleType };
	if (filterParts.length > 0) {
		qs.filter = filterParts.join('+');
	}

	if (returnAll) {
		return crowdStrikeGetAllItems.call(
			this,
			'/intel/queries/rules/v1',
			'/intel/entities/rules/v1',
			qs,
		);
	}

	qs.limit = limit;
	const queryResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/queries/rules/v1',
		undefined,
		qs,
	);

	if (!queryResponse.resources || queryResponse.resources.length === 0) {
		return [];
	}

	const detailsResponse = await crowdStrikeApiRequest.call(
		this,
		'GET',
		'/intel/entities/rules/v1',
		undefined,
		{ ids: queryResponse.resources },
	);

	return detailsResponse.resources || [];
}
