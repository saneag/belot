# Home server deployment

Belot runs its Express API and Vite web app in Docker. PostgreSQL runs on the
Ubuntu host. The API uses its own database and login; MongoDB is no longer used.
The initial deployment intentionally starts with empty databases.

## Deploy updates

Push code to the deployed branch (`dev`), then run on the server:

```bash
~/bin/start-belot
```

This refuses tracked local edits, pulls with `--ff-only`, builds before replacing
containers, applies the idempotent schema at API startup, waits for health, and
prints the public website and mobile API addresses. It keeps the current tunnel
when possible. The stable wrapper calls the script in the checkout, so script
updates are picked up on the next deployment.

The server checkout is `/home/alex/belot`. Private `.env` contains `DATABASE_URL`,
`WEB_PORT`, `CORS_ORIGIN`, and the tunnel's port. Never commit it.
The private database settings are in
`~/.config/home-apps/belot/databases.json`. Production credentials stay on the
server. The development URL is also retained there for configuring other devices.

Production uses `belot-prod`, owned by `belot_prod`, reachable from the existing
`home-apps` Docker network. Development uses `belot-dev`, owned by `belot_dev`,
reachable from the LAN and localhost. Neither role has administrative privileges.
No shadow database or migration role with CREATEDB is required.

The web port starts at 5008 and binds only to loopback. Nginx forwards `/api/`
to the unique `belot-api` network alias. Database ports are not published by
Compose. Containers restart at boot; the temporary tunnel needs the launcher
after a reboot.

## Android builds

Both Android workflows read `deploy/mobile-api-url.txt` and embed that URL as
`EXPO_PUBLIC_API_BASE_URL`. The EAS workflow also writes a build environment file
so the remote builder receives it. The API runs on the server; the APK contains
the address used to connect to it.

When the tunnel URL changes, update that file to the printed mobile API address,
commit, push, and rebuild the APK. Installed APKs retain their previous address.
A domain and named tunnel can later provide a stable address; change the file
once more and rebuild then. No domain is required for the temporary deployment.
The workflows are configured here; deployment does not trigger an Android build.

## Checks and logs

```bash
cd ~/belot
sudo docker compose ps
sudo docker compose logs --tail=100 api web
sudo journalctl -u belot-tunnel --no-pager -n 50
cat .public-url
```

The public API health endpoint is `/api/health`; game listing is `/api/games`.
Belot's existing API has no account authentication, including feature-toggle
updates. The dev-tools password in an APK is public build configuration, not API
authorization.

Keep PostgreSQL backups outside the checkout, with private file permissions:

```bash
umask 077
sudo -u postgres pg_dump belot-prod > "$HOME/belot-prod-$(date +%Y%m%d-%H%M%S).sql"
```

## Development and tests

Set `DATABASE_URL` in `apps/api/.env` to a development PostgreSQL database.
Set `VITE_API_URL=http://127.0.0.1:3001` for a separately running local web app.
Production web defaults to its own origin plus `/api`.

API E2E tests require `TEST_DATABASE_URL` pointing to a dedicated test database.
The harness creates and removes an isolated schema for each run. CI provides a
PostgreSQL service. The initial schema is applied automatically before listening;
future schema changes must preserve existing records.
