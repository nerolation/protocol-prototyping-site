# Protocol Prototyping Team Website (archived)

The Protocol Prototyping team at the Ethereum Foundation no longer exists, and this
site is no longer maintained.

`prototyping.ethereum.foundation` now serves a single page that redirects to
<https://blog.ethereum.org/2026/06/23/ef-structure>.

The previous version of the site — the work aggregator, team listing, and the
`TEAM_MEMBERS.txt` / `work.json` tooling — remains available in this repository's
git history (see the commits before this one).

## Deployment

`npm run build` copies `index.html` into `dist/` along with `.nojekyll` and the
`CNAME` file. The `Build and Deploy` GitHub Actions workflow runs on every push to
`main` and publishes `dist/` to the `gh-pages` branch.
