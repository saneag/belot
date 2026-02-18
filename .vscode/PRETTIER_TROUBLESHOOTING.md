# Prettier Format On Save Troubleshooting

## Quick Checks

### 1. Check if Prettier Extension is Installed

- Open VSCode Extensions (Cmd+Shift+X / Ctrl+Shift+X)
- Search for "Prettier - Code formatter" by esbenp
- Make sure it's installed and enabled

### 2. Reload VSCode Window

- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type "Reload Window"
- Select "Developer: Reload Window"

### 3. Check Prettier Output

- View → Output (or `Cmd+Shift+U` / `Ctrl+Shift+U`)
- Select "Prettier" from the dropdown at the top right
- Look for any error messages

### 4. Test Manual Formatting

- Open a file (e.g., `apps/mobile/app/_layout.tsx`)
- Press `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac)
- Or: Right-click → "Format Document"
- If this works but format on save doesn't, there might be a setting conflict

### 5. Check File Association

- Open a TypeScript/JavaScript file
- Look at the bottom right of VSCode
- You should see the language mode (e.g., "TypeScript React")
- If it says "Plain Text", click it and select the correct language

## Common Issues & Solutions

### Issue 1: "prettier.requireConfig": true

This setting means Prettier will ONLY format if it finds a config file.

**Solution:** We have `prettier.config.js` in the root, so this should work. But if you want to format files outside the project, you can change it to `false`.

### Issue 2: Conflicting Formatters

Another extension might be intercepting the format on save.

**Check:**

1. Open Command Palette (`Cmd+Shift+P`)
2. Type "Format Document With..."
3. Select "Configure Default Formatter..."
4. Choose "Prettier - Code formatter"

### Issue 3: Files Not Being Watched

If you recently installed the plugin, VSCode might need a restart.

**Solution:** Completely quit and restart VSCode (not just reload window)

### Issue 4: Package Not Installed

The prettier plugins need to be installed in the project.

**Verify:**

```bash
cd /Users/agarstea/belot-v2
ls -la node_modules/@trivago/prettier-plugin-sort-imports
ls -la node_modules/prettier-plugin-tailwindcss
```

If not found, run:

```bash
pnpm install
```

### Issue 5: File in .prettierignore

Check if your file is being ignored.

**Solution:** Look at `.prettierignore` in the project root

## Test Format On Save

1. Open `apps/mobile/app/_layout.tsx`
2. Mess up the imports (put them in random order)
3. Add some extra spaces
4. Save the file (`Cmd+S` / `Ctrl+S`)
5. The imports should automatically sort and spacing should fix

## Manual Format Command

If format on save doesn't work, you can always format manually:

```bash
# Format a specific file
pnpm prettier --write apps/mobile/app/_layout.tsx

# Format all TypeScript/JavaScript files
pnpm prettier --write "**/*.{ts,tsx,js,jsx}"

# Format the entire mobile app
pnpm prettier --write "apps/mobile/**/*.{ts,tsx,js,jsx}"
```

## Debug Mode

I've enabled `"prettier.enableDebugLogs": true` in your settings.

To see debug logs:

1. View → Output
2. Select "Prettier" from dropdown
3. You'll see detailed logs about what Prettier is doing

## Still Not Working?

Try these steps in order:

1. ✅ Restart VSCode completely (Quit and reopen)
2. ✅ Check the Prettier output panel for errors
3. ✅ Verify the extension is installed and enabled
4. ✅ Try formatting manually with `Shift+Option+F` / `Shift+Alt+F`
5. ✅ Check if there are any error notifications in the bottom right
6. ✅ Make sure you're saving a file type that Prettier handles (.ts, .tsx, .js, .jsx)
