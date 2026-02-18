# Gluestack-UI Component Installation

This directory contains scripts to help with gluestack-ui component installation in a pnpm monorepo.

## Problem

The `gluestack-ui` CLI has a bug where it uses `npm` internally, even when configured to use `pnpm`. This causes errors with pnpm's `workspace:*` protocol.

## Solution

We've created a wrapper script that:

1. Temporarily modifies `package.json` to work around the `workspace:*` issue
2. Runs the gluestack-ui CLI
3. If the CLI fails (due to npm issues), automatically copies component files from the gluestack cache
4. Installs dependencies with pnpm
5. Formats the component with prettier
6. Restores the original package.json

## Usage

### Option 1: Using the npm script (Recommended)

```bash
cd apps/mobile
pnpm add-component <component-name>
```

### Option 2: Direct script execution

```bash
cd apps/mobile
node scripts/gluestack-add.js <component-name>
```

## Examples

```bash
# Add a button component
pnpm add-component button

# Add an input component
pnpm add-component input

# Add a modal component
pnpm add-component modal

# Add a select component
pnpm add-component select
```

## Available Components

See all available components at: https://gluestack.io/ui/docs/components/all-components

Common components:

- `button` - Button with variants
- `input` - Text input field
- `textarea` - Multiline text input
- `select` - Dropdown select
- `checkbox` - Checkbox input
- `radio` - Radio button
- `switch` - Toggle switch
- `slider` - Range slider
- `modal` - Modal dialog
- `alert-dialog` - Alert dialog
- `popover` - Popover component
- `tooltip` - Tooltip component
- `menu` - Menu/dropdown menu
- `toast` - Toast notifications
- `spinner` - Loading spinner
- `progress` - Progress bar
- `avatar` - Avatar component
- `badge` - Badge component
- `card` - Card container
- `divider` - Divider line
- `accordion` - Accordion/collapsible
- `tabs` - Tab navigation

## How It Works

### When CLI Succeeds

1. Script temporarily replaces `workspace:*` with `*` in package.json
2. Runs the gluestack-ui CLI
3. CLI downloads and installs the component
4. Script restores the original package.json
5. Formats the component with prettier

### When CLI Fails (Fallback)

1. Script detects CLI failure
2. Looks for component in gluestack cache (`~/.gluestack/cache/`)
3. Copies component files from cache to your project
4. Runs `pnpm install` to install any new dependencies
5. Formats the component with prettier
6. Component is ready to use!

## What to Expect

- ✅ You may see npm warnings/errors during the CLI run - **this is normal**
- ✅ The script will automatically handle failures and copy files from cache
- ✅ Component will be automatically formatted with prettier
- ✅ Final message: "✨ Done! Your component is ready to use."

## Troubleshooting

### Script fails with permission error

```bash
chmod +x scripts/gluestack-add.js
```

### Component not found in cache

The gluestack CLI needs to run at least once to populate the cache. Try:

```bash
pnpm dlx gluestack-ui add <component-name>
```

Even if it fails, it should download the component to cache, then run the script again.

### Dependencies not installing

Run manually:

```bash
pnpm install
```

### Component has TypeScript errors

The script automatically formats with prettier, but you may need to fix import paths or API usage. Check the component documentation at https://gluestack.io/ui/docs/components/
