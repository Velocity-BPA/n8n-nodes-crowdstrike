# n8n-nodes-crowdstrike

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for CrowdStrike Falcon, the industry-leading endpoint detection and response (EDR) platform. This node enables workflow automation for threat detection, incident response, host management, vulnerability assessment, and threat intelligence through CrowdStrike's OAuth2-based REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![CrowdStrike](https://img.shields.io/badge/CrowdStrike-Falcon-red)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)

## Features

- **12 Resource Categories** covering all major CrowdStrike Falcon capabilities
- **80+ Operations** for comprehensive security automation
- **Multi-Cloud Support** for US-1, US-2, EU-1, and US-GOV-1 regions
- **OAuth2 Authentication** with automatic token management
- **Trigger Node** for real-time event-driven workflows
- **Complete Type Safety** with TypeScript definitions

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-crowdstrike`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-crowdstrike
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-crowdstrike.git
cd n8n-nodes-crowdstrike

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-crowdstrike

# Restart n8n
```

## Credentials Setup

### Creating CrowdStrike API Credentials

1. Log into the **CrowdStrike Falcon Console**
2. Navigate to **Support** > **API Clients and Keys**
3. Click **Add new API Client**
4. Configure the following:
   - **Client Name**: A descriptive name (e.g., "n8n Integration")
   - **API Scopes**: Select the required scopes for your operations:
     - Hosts: `Read`, `Write`
     - Detections: `Read`, `Write`
     - Incidents: `Read`, `Write`
     - Alerts: `Read`, `Write`
     - Prevention Policies: `Read`, `Write`
     - IOCs: `Read`, `Write`
     - Intel: `Read`
     - Spotlight: `Read`
     - Real Time Response: `Read`, `Write`, `Admin`
     - User Management: `Read`, `Write`
     - Host Group: `Read`, `Write`
5. Save the **Client ID** and **Client Secret**

### Configuring in n8n

| Property | Description |
|----------|-------------|
| **Cloud Region** | Select your CrowdStrike cloud: US-1, US-2, EU-1, or US-GOV-1 |
| **Client ID** | Your 32-character API Client ID |
| **Client Secret** | Your 40-character API Client Secret |

## Resources & Operations

### Hosts (Devices)
Manage endpoint hosts in your CrowdStrike environment.

| Operation | Description |
|-----------|-------------|
| Get All | Query all hosts with filters |
| Get | Get host details by device ID |
| Get by Hostname | Find hosts by hostname pattern |
| Get by IP | Find hosts by IP address |
| Contain | Network contain a host |
| Lift Containment | Remove network containment |
| Hide | Hide a host from the console |
| Unhide | Unhide a host |
| Update Tags | Add or remove tags |
| Get Online Status | Check host online status |

### Detections
Work with threat detections and behaviors.

| Operation | Description |
|-----------|-------------|
| Get All | Query all detections |
| Get | Get detection details |
| Get by Host | Get detections for a specific host |
| Update Status | Update detection status |
| Assign to User | Assign detection to a user |
| Add Comment | Add a comment to detection |
| Get Behaviors | Get behaviors in detection |

### Incidents
Manage security incidents.

| Operation | Description |
|-----------|-------------|
| Get All | Query all incidents |
| Get | Get incident details |
| Perform Action | Execute action on incident |
| Update Status | Update incident status |
| Get Behaviors | Get behaviors in incident |
| Get Hosts | Get hosts involved in incident |
| Add Tag | Add tag to incident |
| Remove Tag | Remove tag from incident |

### Alerts
Work with security alerts.

| Operation | Description |
|-----------|-------------|
| Get All | Query all alerts |
| Get | Get alert details |
| Update Status | Update alert status |
| Get Aggregate | Get alert aggregations |

### Prevention Policies
Manage endpoint prevention policies.

| Operation | Description |
|-----------|-------------|
| Get All | List all prevention policies |
| Get | Get policy details |
| Create | Create new policy |
| Update | Update policy |
| Delete | Delete policy |
| Get Members | Get hosts assigned to policy |
| Add Members | Add hosts to policy |
| Remove Members | Remove hosts from policy |
| Set Enabled | Enable or disable policy |

### IOCs (Indicators of Compromise)
Manage custom threat indicators.

| Operation | Description |
|-----------|-------------|
| Get All | List all custom IOCs |
| Get | Get IOC by ID |
| Create | Create custom IOC |
| Update | Update IOC |
| Delete | Delete IOC |
| Get Bulk | Get multiple IOCs |

### Intel (Threat Intelligence)
Access CrowdStrike threat intelligence.

| Operation | Description |
|-----------|-------------|
| Get Indicators | Query threat indicators |
| Get Actors | Query threat actors |
| Get Reports | Query intel reports |
| Get Malware | Query malware families |
| Get Vulnerabilities | Query vulnerabilities |
| Get Rules | Get intel rules (YARA, Snort) |

### Vulnerabilities (Spotlight)
Vulnerability management operations.

| Operation | Description |
|-----------|-------------|
| Get All | Query all vulnerabilities |
| Get | Get vulnerability details |
| Get by Host | Get vulnerabilities for host |
| Get by CVE | Get hosts affected by CVE |
| Get Remediations | Get remediation actions |

### Real Time Response (RTR)
Execute commands on hosts in real-time.

| Operation | Description |
|-----------|-------------|
| Init Session | Initialize RTR session |
| Delete Session | Close RTR session |
| Execute Command | Run basic RTR command |
| Execute Admin Command | Run admin RTR command |
| Get Queued Sessions | List queued sessions |
| Get Files | List files in session |
| Get File | Download file from host |
| Put File | Upload file to host |

### User Management
Manage CrowdStrike users and roles.

| Operation | Description |
|-----------|-------------|
| Get All | List all users |
| Get | Get user by UUID |
| Create | Create new user |
| Update | Update user |
| Delete | Delete user |
| Get Roles | Get user roles |
| Assign Role | Assign role to user |
| Revoke Role | Revoke role from user |

### Host Groups
Manage host groupings.

| Operation | Description |
|-----------|-------------|
| Get All | List all host groups |
| Get | Get host group by ID |
| Create | Create host group |
| Update | Update host group |
| Delete | Delete host group |
| Get Members | Get hosts in group |
| Add Members | Add hosts to group |
| Remove Members | Remove hosts from group |

### Quarantine
Manage quarantined files.

| Operation | Description |
|-----------|-------------|
| Get All | Query quarantined files |
| Get | Get quarantined file details |
| Get by Host | Get quarantined files for host |
| Release | Release file from quarantine |
| Delete | Delete quarantined file |

## Trigger Node

The CrowdStrike Falcon Trigger node polls for new security events:

| Event | Description |
|-------|-------------|
| New Detection | Triggers on new detections |
| New Incident | Triggers on new incidents |
| Critical Incident | Triggers on critical severity incidents |
| New Alert | Triggers on new alerts |
| New Vulnerability | Triggers on new vulnerabilities |
| Host Contained | Triggers when a host is contained |

### Trigger Filters

- **Hostname**: Filter by hostname pattern
- **Min Severity**: Minimum severity threshold
- **Platform**: Filter by Windows, Mac, or Linux

## Usage Examples

### Example 1: Auto-Contain High Severity Hosts

```json
{
  "name": "Auto-Contain High Severity",
  "nodes": [
    {
      "type": "n8n-nodes-crowdstrike.crowdStrikeTrigger",
      "parameters": {
        "event": "newDetection",
        "filters": {
          "minSeverity": "critical"
        }
      }
    },
    {
      "type": "n8n-nodes-crowdstrike.crowdStrike",
      "parameters": {
        "resource": "host",
        "operation": "contain",
        "deviceIds": "={{$json.device_id}}"
      }
    }
  ]
}
```

### Example 2: Enrich Detection with Host Info

```json
{
  "name": "Detection Enrichment",
  "nodes": [
    {
      "type": "n8n-nodes-crowdstrike.crowdStrike",
      "parameters": {
        "resource": "detection",
        "operation": "getAll",
        "filters": {
          "status": "new"
        }
      }
    },
    {
      "type": "n8n-nodes-crowdstrike.crowdStrike",
      "parameters": {
        "resource": "host",
        "operation": "get",
        "deviceId": "={{$json.device.device_id}}"
      }
    }
  ]
}
```

## CrowdStrike Concepts

### Device ID
A 32-character hexadecimal string uniquely identifying each endpoint sensor.

### Detection ID
Format: `ldt:<device_id>:<detection_number>` - uniquely identifies a detection.

### Severity Levels
- **Critical** (5): Immediate threat requiring urgent action
- **High** (4): Significant threat requiring prompt attention
- **Medium** (3): Potential threat requiring investigation
- **Low** (2): Minor concern for review
- **Informational** (1): Activity for awareness

### FQL (Falcon Query Language)
CrowdStrike uses FQL for filtering. The node automatically builds FQL queries from your filter selections.

## Cloud Regions

| Region | Base URL | Description |
|--------|----------|-------------|
| US-1 | api.crowdstrike.com | US commercial (default) |
| US-2 | api.us-2.crowdstrike.com | US commercial secondary |
| EU-1 | api.eu-1.crowdstrike.com | European Union |
| US-GOV-1 | api.laggar.gcw.crowdstrike.com | US Government Cloud |

## Error Handling

The node handles common CrowdStrike API errors:

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check parameter values |
| 401 | Unauthorized | Verify credentials |
| 403 | Forbidden | Check API scope permissions |
| 404 | Not Found | Verify resource ID exists |
| 429 | Rate Limited | Reduce request frequency |

## Security Best Practices

1. **Least Privilege**: Grant only necessary API scopes
2. **Secret Management**: Store credentials securely in n8n
3. **Audit Logging**: Monitor API usage in CrowdStrike
4. **Token Rotation**: Regularly rotate API credentials
5. **Network Security**: Use private endpoints when available

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

- **Documentation**: [CrowdStrike API Docs](https://falcon.crowdstrike.com/documentation/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-crowdstrike/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [CrowdStrike](https://www.crowdstrike.com/) for the Falcon platform
- [n8n](https://n8n.io/) for the workflow automation platform
- Community contributors
