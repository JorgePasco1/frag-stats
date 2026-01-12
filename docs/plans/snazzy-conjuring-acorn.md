# Obsync Codebase Analysis

## Project Overview

**obsync** is a TypeScript/Bun CLI tool for synchronizing Obsidian vaults across devices and storage backends. The project is at **Phase 2 completion** with full local sync and watch mode implemented.

## Architecture Summary

```
src/
├── cli.ts                    # Entry point (Commander.js)
├── cli/
│   ├── commands/             # sync.ts, init.ts, status.ts
│   ├── prompts/              # Interactive UI (fileBrowser, vaultSelector, conflictPrompt)
│   └── ui/                   # colors, output, spinner, table
├── config/index.ts           # ConfigManager - .obsync.json handling
├── storage/index.ts          # StorageAdapter interface + LocalStorageAdapter
├── sync/
│   ├── index.ts              # SyncEngine - main orchestrator
│   ├── types.ts              # Type definitions
│   ├── changeDetector.ts     # Three-way merge change detection
│   ├── conflictResolver.ts   # Conflict resolution strategies
│   ├── manifest.ts           # ManifestManager - .obsync/sync-manifest.json
│   ├── watcher.ts            # FileWatcher + BatchFileWatcher (chokidar)
│   ├── watchMode.ts          # WatchModeSync - continuous sync
│   └── directoryLister.ts    # Non-vault directory listing
├── vault/index.ts            # ObsidianVault - vault operations
└── utils/index.ts            # Utilities (hashing, path sanitization)
```

## CLI Commands

| Command | Description | Key Options |
|---------|-------------|-------------|
| `sync` | Synchronize vault | `--source`, `--destination`, `--conflict`, `--dry-run`, `--watch`, `--remote` |
| `init` | Initialize config | `--path` |
| `status` | Show vault status | `--path` |

## Key Components

### SyncEngine (`src/sync/index.ts`)
- Main orchestrator for sync operations
- Flow: validate vault → load manifests → list files → detect changes → resolve conflicts → apply changes → update manifests

### ChangeDetector (`src/sync/changeDetector.ts`)
- Three-way merge algorithm comparing source, destination, and base (manifest) states
- Change types: `added`, `modified`, `deleted`, `conflict`

### ConflictResolver (`src/sync/conflictResolver.ts`)
- Strategies: `source`, `destination`, `newest`, `skip`

### StorageAdapter (`src/storage/index.ts`)
- Interface: `read()`, `write()`, `delete()`, `list()`, `exists()`
- `LocalStorageAdapter` fully implemented
- Designed for future S3/FTP/WebDAV adapters

### ObsidianVault (`src/vault/index.ts`)
- Validates `.obsidian` directory exists
- Lists files with include/exclude pattern filtering (picomatch)
- Default excludes: `.obsidian/**`, `.trash/**`, `.git/**`, `.obsync/**`

### ConfigManager (`src/config/index.ts`)
- Manages `.obsync.json` configuration
- Default strategy: incremental, conflict resolution: newest

### ManifestManager (`src/sync/manifest.ts`)
- Tracks sync state in `.obsync/sync-manifest.json`
- Stores file hash, size, mtime for each synced file

### WatchModeSync (`src/sync/watchMode.ts`)
- Continuous file watching with chokidar
- Debouncing and batching of changes
- States: `idle`, `watching`, `syncing`, `error`, `stopped`

## Key Types

```typescript
interface SyncOptions {
  source: string;
  destination: string;
  strategy?: 'incremental' | 'full';
  conflictResolution?: ConflictStrategy;
  dryRun?: boolean;
  remoteMode?: boolean;
}

interface SyncResult {
  filesAdded: number;
  filesUpdated: number;
  filesDeleted: number;
  conflicts: FileChange[];
  errors: string[];
  skipped: string[];
}

interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted' | 'conflict';
  sourceState?: FileState | null;
  destinationState?: FileState | null;
  baseState?: FileState | null;
}
```

## Testing

- **Framework**: Vitest
- **Coverage**: 165+ tests across unit and integration
- **Unit tests**: `tests/unit/` - config, manifest, storage, utils, vault, watcher, watchMode
- **Integration tests**: `tests/integration/` - sync.test.ts, watchMode.test.ts
- **Fixtures**: `tests/fixtures/sample-vault/`

## Dependencies

- **commander** - CLI framework
- **chokidar** - File watching
- **picomatch** - Glob patterns
- **@inquirer/prompts** - Interactive prompts
- **ora** - Spinners
- **picocolors** - Colors
- **uuid** - UUID generation

## Development Commands

```bash
bun install          # Install dependencies
bun run dev          # Development mode
bun run build        # Compile TypeScript
bun test             # Run all tests
bun run lint         # Lint code
bun run format       # Format code
```

## Project Status

- **Phase 1 (Local Sync)**: ✅ Complete
- **Phase 2 (Watch Mode)**: ✅ Complete
- **Phase 3 (Cloud Storage)**: 🔲 Planned

---

## Cloud Sync Research (Google Drive)

### Existing Solutions

| Solution | Type | Pros | Cons |
|----------|------|------|------|
| **Official Obsidian Sync** | Paid ($4-8/mo) | Seamless, E2E encrypted, reliable | Cost |
| **OGD Sync Plugin** | Free plugin | Works on iOS/Win/Mac, auto conflict resolution | Not E2E encrypted, community-maintained |
| **obsidian-gdrive-sync** | Free plugin | Simple, GitHub-hosted | Limited features |
| **Google Drive Desktop + Autosync** | Manual | Uses existing Google Drive | Conflict issues, mobile requires extra apps |
| **LiveSync (CouchDB)** | Self-hosted | Full control, real-time | Requires server setup |
| **Remotely Save** | Free plugin | Works with S3/Dropbox/WebDAV | Configuration required |
| **Syncthing** | Free/P2P | No cloud, direct device sync | No mobile iOS support |
| **Git + GitHub** | Free | Version control, secure | Technical, no real-time sync |

### Google Drive Challenges

1. **Conflict handling** - Files can revert to older versions when edited on multiple devices
2. **Mobile complexity** - iOS doesn't sync well with cloud providers; Android needs third-party apps (Autosync, FolderSync)
3. **No E2E encryption** - Files are readable by Google
4. **Sync latency** - Not real-time like Obsidian Sync

### Is Building Google Drive Adapter Worth It?

**Arguments FOR:**
- Many users already have Google Drive (15GB free)
- Existing plugins (OGD Sync) prove demand exists
- Could differentiate with better conflict resolution (obsync already has three-way merge)
- obsync's architecture already supports pluggable storage adapters

**Arguments AGAINST:**
- OGD Sync plugin already exists and is actively maintained
- Google Drive API has rate limits and OAuth complexity
- Mobile sync still requires workarounds
- LiveSync with CouchDB is more robust for real-time sync

### Recommendation

Building a Google Drive adapter makes sense if:
1. You want better conflict resolution than existing plugins (obsync's three-way merge is superior)
2. You prefer a CLI tool over Obsidian plugins
3. You want to sync to non-Obsidian locations (obsync's remote mode)

Consider alternatives like:
- **S3-compatible storage** (Cloudflare R2, Backblaze B2) - simpler API, cheaper
- **WebDAV** - works with many providers including some self-hosted options

---

## Implementation Notes

- ESM modules with `.js` extensions in imports
- Strict TypeScript configuration
- Strategy pattern for storage backends
- Three-way merge for change detection
- Configuration-driven behavior via `.obsync.json`
