/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	buildFilterQuery,
	validateDeviceId,
	validateDetectionId,
	validateSha256,
	validateMd5,
	validateIpAddress,
	formatTimestamp,
	parseTimestamp,
	getBaseUrl,
} from '../../nodes/CrowdStrike/transport';

describe('CrowdStrike Transport Utils', () => {
	describe('getBaseUrl', () => {
		it('should return US-1 URL by default', () => {
			expect(getBaseUrl('US-1')).toBe('https://api.crowdstrike.com');
		});

		it('should return US-2 URL', () => {
			expect(getBaseUrl('US-2')).toBe('https://api.us-2.crowdstrike.com');
		});

		it('should return EU-1 URL', () => {
			expect(getBaseUrl('EU-1')).toBe('https://api.eu-1.crowdstrike.com');
		});

		it('should return US-GOV-1 URL', () => {
			expect(getBaseUrl('US-GOV-1')).toBe('https://api.laggar.gcw.crowdstrike.com');
		});

		it('should default to US-1 for unknown cloud', () => {
			expect(getBaseUrl('unknown')).toBe('https://api.crowdstrike.com');
		});
	});

	describe('buildFilterQuery', () => {
		it('should build filter from simple strings', () => {
			const result = buildFilterQuery({
				hostname: 'test-host',
				status: 'normal',
			});
			expect(result).toBe("hostname:'test-host'+status:'normal'");
		});

		it('should handle array values', () => {
			const result = buildFilterQuery({
				tags: ['tag1', 'tag2'],
			});
			expect(result).toBe("tags:['tag1','tag2']");
		});

		it('should handle range queries', () => {
			const result = buildFilterQuery({
				severity: '>=3',
			});
			expect(result).toBe('severity:>=3');
		});

		it('should handle wildcard queries', () => {
			const result = buildFilterQuery({
				hostname: '*test*',
			});
			expect(result).toBe('hostname:*test*');
		});

		it('should skip null and empty values', () => {
			const result = buildFilterQuery({
				hostname: 'test',
				empty: '',
				nullValue: null,
			});
			expect(result).toBe("hostname:'test'");
		});

		it('should handle numeric values', () => {
			const result = buildFilterQuery({
				severity: 5,
			});
			expect(result).toBe('severity:5');
		});
	});

	describe('validateDeviceId', () => {
		it('should accept valid device ID', () => {
			expect(validateDeviceId('abcdef1234567890abcdef1234567890')).toBe(true);
		});

		it('should reject invalid device ID (too short)', () => {
			expect(validateDeviceId('abcdef123456')).toBe(false);
		});

		it('should reject invalid device ID (non-hex)', () => {
			expect(validateDeviceId('ghijkl1234567890abcdef1234567890')).toBe(false);
		});
	});

	describe('validateDetectionId', () => {
		it('should accept valid detection ID', () => {
			expect(validateDetectionId('ldt:abc123:456')).toBe(true);
		});

		it('should reject invalid detection ID', () => {
			expect(validateDetectionId('invalid-id')).toBe(false);
		});
	});

	describe('validateSha256', () => {
		it('should accept valid SHA256 hash', () => {
			const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
			expect(validateSha256(hash)).toBe(true);
		});

		it('should reject invalid SHA256 hash', () => {
			expect(validateSha256('invalid-hash')).toBe(false);
		});
	});

	describe('validateMd5', () => {
		it('should accept valid MD5 hash', () => {
			expect(validateMd5('d41d8cd98f00b204e9800998ecf8427e')).toBe(true);
		});

		it('should reject invalid MD5 hash', () => {
			expect(validateMd5('invalid-hash')).toBe(false);
		});
	});

	describe('validateIpAddress', () => {
		it('should accept valid IPv4 address', () => {
			expect(validateIpAddress('192.168.1.1')).toBe(true);
		});

		it('should accept valid IPv6 address', () => {
			expect(validateIpAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
		});

		it('should reject invalid IP address', () => {
			expect(validateIpAddress('not-an-ip')).toBe(false);
		});
	});

	describe('formatTimestamp', () => {
		it('should format Date object to ISO string', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			expect(formatTimestamp(date)).toBe('2024-01-15T12:00:00.000Z');
		});

		it('should format string date to ISO string', () => {
			expect(formatTimestamp('2024-01-15')).toMatch(/2024-01-15/);
		});
	});

	describe('parseTimestamp', () => {
		it('should parse ISO timestamp to Date', () => {
			const result = parseTimestamp('2024-01-15T12:00:00.000Z');
			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe('2024-01-15T12:00:00.000Z');
		});
	});
});
