# Protocol Prototyping Team Website

A static website that aggregates and displays work from the Protocol Prototyping team at the Ethereum Foundation.

## Setup

1. **Join the team**: Submit a PR adding your GitHub username to `TEAM_MEMBERS.txt`

2. **Enable GitHub Pages**: 
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

3. **Repository structure for team members**: Each team member should have a repository named `prototyping_work` with a `work.json` file containing an array of work items:

```json
[
  {
    "title": "EIP-4844 Implementation Analysis",
    "description": "Deep dive into blob transaction implementation and its impact on L2 scaling",
    "label": "DL",
    "url": "https://github.com/username/eip4844-analysis"
  }
]
```

Valid labels: `CL` (Consensus Layer), `EL` (Execution Layer), `MEV-Boost`, `DL` (Data Layer)

## Deployment

The site automatically:
- Deploys daily at 00:00 UTC
- Deploys on pushes to main
- Can be manually triggered via GitHub Actions

## Local Development

```bash
# Team members are read from TEAM_MEMBERS.txt
# Fetch data and build
npm run fetch-and-build

# View the built site in dist/
```