/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface ICrowdStrikeCredentials {
  clientId: string;
  clientSecret: string;
  cloud: 'US-1' | 'US-2' | 'EU-1' | 'US-GOV-1';
}

export interface ICrowdStrikeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ICrowdStrikeApiResponse extends IDataObject {
  meta?: {
    query_time?: number;
    pagination?: {
      total?: number;
      offset?: number;
      limit?: number;
    };
    powered_by?: string;
    trace_id?: string;
  };
  resources?: IDataObject[];
  errors?: ICrowdStrikeError[];
}

export interface ICrowdStrikeError extends IDataObject {
  code: number;
  message: string;
  id?: string;
}

export interface IHost {
  device_id: string;
  cid: string;
  agent_local_time?: string;
  agent_version?: string;
  bios_manufacturer?: string;
  bios_version?: string;
  config_id_base?: string;
  config_id_build?: string;
  config_id_platform?: string;
  external_ip?: string;
  hostname?: string;
  first_seen?: string;
  last_seen?: string;
  local_ip?: string;
  mac_address?: string;
  machine_domain?: string;
  major_version?: string;
  minor_version?: string;
  os_version?: string;
  ou?: string[];
  platform_id?: string;
  platform_name?: string;
  product_type?: string;
  product_type_desc?: string;
  status?: string;
  system_manufacturer?: string;
  system_product_name?: string;
  tags?: string[];
  modified_timestamp?: string;
  meta?: IDataObject;
  policies?: IHostPolicy[];
}

export interface IHostPolicy {
  policy_type: string;
  policy_id: string;
  applied: boolean;
  settings_hash?: string;
  assigned_date?: string;
  applied_date?: string;
}

export interface IDetection {
  detection_id: string;
  cid: string;
  device_id: string;
  hostname?: string;
  max_severity?: number;
  max_severity_displayname?: string;
  max_confidence?: number;
  status?: string;
  created_timestamp?: string;
  first_behavior?: string;
  last_behavior?: string;
  assigned_to_uid?: string;
  assigned_to_name?: string;
  behaviors?: IBehavior[];
  hostinfo?: IDataObject;
  quarantined_files?: IDataObject[];
}

export interface IBehavior {
  behavior_id: string;
  filename?: string;
  filepath?: string;
  timestamp?: string;
  severity?: number;
  confidence?: number;
  ioc_type?: string;
  ioc_value?: string;
  ioc_source?: string;
  tactic?: string;
  tactic_id?: string;
  technique?: string;
  technique_id?: string;
  pattern_disposition?: number;
  pattern_disposition_details?: IDataObject;
  cmdline?: string;
  sha256?: string;
  md5?: string;
  user_name?: string;
  user_id?: string;
  triggering_process_graph_id?: string;
  parent_details?: IDataObject;
}

export interface IIncident {
  incident_id: string;
  cid: string;
  host_ids?: string[];
  hosts?: IDataObject[];
  created?: string;
  start?: string;
  end?: string;
  state?: string;
  status?: number;
  name?: string;
  description?: string;
  tags?: string[];
  fine_score?: number;
  assigned_to?: string;
  assigned_to_name?: string;
  users?: string[];
  lm_host_ids?: string[];
  modified_timestamp?: string;
  objectives?: string[];
  tactics?: string[];
  techniques?: string[];
}

export interface IAlert {
  id: string;
  cid: string;
  composite_id?: string;
  product?: string;
  type?: string;
  severity?: number;
  confidence?: number;
  created_timestamp?: string;
  updated_timestamp?: string;
  status?: string;
  description?: string;
  tags?: string[];
  assigned_to_uid?: string;
  assigned_to_name?: string;
}

export interface IPreventionPolicy {
  id: string;
  cid: string;
  name: string;
  description?: string;
  platform_name?: string;
  enabled: boolean;
  created_by?: string;
  created_timestamp?: string;
  modified_by?: string;
  modified_timestamp?: string;
  groups?: IDataObject[];
  prevention_settings?: IDataObject[];
  ioa_rule_groups?: IDataObject[];
}

export interface IIoc {
  id: string;
  type: string;
  value: string;
  source?: string;
  action?: string;
  severity?: string;
  description?: string;
  metadata?: IDataObject;
  platforms?: string[];
  tags?: string[];
  expiration?: string;
  created_on?: string;
  modified_on?: string;
  created_by?: string;
  modified_by?: string;
  applied_globally?: boolean;
  host_groups?: string[];
  mobile_action?: string;
}

export interface IThreatIndicator {
  id: string;
  indicator?: string;
  type?: string;
  malicious_confidence?: string;
  published_date?: string;
  last_updated?: string;
  labels?: IDataObject[];
  actors?: string[];
  reports?: string[];
  malware_families?: string[];
  kill_chains?: string[];
  targets?: IDataObject[];
  relations?: IDataObject[];
}

export interface IThreatActor {
  id: string;
  name?: string;
  short_description?: string;
  description?: string;
  known_as?: string[];
  first_activity_date?: string;
  last_activity_date?: string;
  active?: boolean;
  region?: string;
  capability?: IDataObject;
  kill_chain?: IDataObject[];
  motivations?: IDataObject[];
  objectives?: IDataObject[];
  origins?: IDataObject[];
  target_countries?: IDataObject[];
  target_industries?: IDataObject[];
  url?: string;
  slug?: string;
}

export interface IVulnerability {
  id: string;
  cid: string;
  aid?: string;
  cve?: ICve;
  host_info?: IDataObject;
  remediation?: IDataObject;
  status?: string;
  created_timestamp?: string;
  updated_timestamp?: string;
  suppression_info?: IDataObject;
  apps?: IDataObject[];
}

export interface ICve {
  id: string;
  base_score?: number;
  severity?: string;
  exploit_status?: number;
  exprt_rating?: string;
  description?: string;
  published_date?: string;
  references?: string[];
  vector?: string;
  spotlight_published_date?: string;
}

export interface IRtrSession {
  session_id: string;
  aid?: string;
  scripts?: string[];
  existing_aid_sessions?: number;
  pwd?: string;
  offline_queued?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IRtrCommand {
  session_id: string;
  base_command?: string;
  command_string?: string;
  cloud_request_id?: string;
  complete?: boolean;
  stderr?: string;
  stdout?: string;
  task_id?: string;
  offline_queued?: boolean;
  errors?: IDataObject[];
}

export interface IUser {
  uuid: string;
  cid?: string;
  uid?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  customer?: string;
  roles?: string[];
}

export interface IHostGroup {
  id: string;
  cid: string;
  name: string;
  description?: string;
  group_type?: string;
  assignment_rule?: string;
  created_by?: string;
  created_timestamp?: string;
  modified_by?: string;
  modified_timestamp?: string;
}

export interface IQuarantinedFile {
  id: string;
  cid: string;
  aid?: string;
  sha256?: string;
  filename?: string;
  paths?: string[];
  state?: string;
  hostname?: string;
  username?: string;
  date_updated?: string;
  date_created?: string;
}

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

export type HostOperation =
  | 'getAll'
  | 'get'
  | 'getByHostname'
  | 'getByIp'
  | 'contain'
  | 'liftContainment'
  | 'hide'
  | 'unhide'
  | 'updateTags'
  | 'getOnlineStatus';

export type DetectionOperation =
  | 'getAll'
  | 'get'
  | 'getByHost'
  | 'updateStatus'
  | 'assignToUser'
  | 'addComment'
  | 'getBehaviors';

export type IncidentOperation =
  | 'getAll'
  | 'get'
  | 'performAction'
  | 'updateStatus'
  | 'getBehaviors'
  | 'getHosts'
  | 'addTag'
  | 'removeTag';

export type AlertOperation = 'getAll' | 'get' | 'updateStatus' | 'getAggregate';

export type PreventionPolicyOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'getMembers'
  | 'addMembers'
  | 'removeMembers'
  | 'setEnabled';

export type IocOperation = 'getAll' | 'get' | 'create' | 'update' | 'delete' | 'getBulk';

export type IntelOperation =
  | 'getIndicators'
  | 'getActors'
  | 'getReports'
  | 'getMalware'
  | 'getVulnerabilities'
  | 'getRules';

export type VulnerabilityOperation =
  | 'getAll'
  | 'get'
  | 'getByHost'
  | 'getByCve'
  | 'getRemediations';

export type RtrOperation =
  | 'initSession'
  | 'deleteSession'
  | 'executeCommand'
  | 'executeAdminCommand'
  | 'getQueuedSessions'
  | 'getFiles'
  | 'getFile'
  | 'putFile';

export type UserOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'getRoles'
  | 'assignRole'
  | 'revokeRole';

export type HostGroupOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'getMembers'
  | 'addMembers'
  | 'removeMembers';

export type QuarantineOperation = 'getAll' | 'get' | 'getByHost' | 'release' | 'delete';

export const CLOUD_URLS: Record<string, string> = {
  'US-1': 'https://api.crowdstrike.com',
  'US-2': 'https://api.us-2.crowdstrike.com',
  'EU-1': 'https://api.eu-1.crowdstrike.com',
  'US-GOV-1': 'https://api.laggar.gcw.crowdstrike.com',
};

export const SEVERITY_OPTIONS = [
  { name: 'Critical', value: 'critical' },
  { name: 'High', value: 'high' },
  { name: 'Medium', value: 'medium' },
  { name: 'Low', value: 'low' },
  { name: 'Informational', value: 'informational' },
];

export const PLATFORM_OPTIONS = [
  { name: 'Windows', value: 'Windows' },
  { name: 'Mac', value: 'Mac' },
  { name: 'Linux', value: 'Linux' },
];

export const STATUS_OPTIONS = [
  { name: 'New', value: 'new' },
  { name: 'In Progress', value: 'in_progress' },
  { name: 'True Positive', value: 'true_positive' },
  { name: 'False Positive', value: 'false_positive' },
  { name: 'Ignored', value: 'ignored' },
  { name: 'Closed', value: 'closed' },
];

export const IOC_TYPES = [
  { name: 'SHA256 Hash', value: 'sha256' },
  { name: 'MD5 Hash', value: 'md5' },
  { name: 'Domain', value: 'domain' },
  { name: 'IPv4 Address', value: 'ipv4' },
  { name: 'IPv6 Address', value: 'ipv6' },
];

export const IOC_ACTIONS = [
  { name: 'Detect', value: 'detect' },
  { name: 'Allow', value: 'allow' },
  { name: 'Prevent (No UI)', value: 'prevent_no_ui' },
  { name: 'Prevent', value: 'prevent' },
];
