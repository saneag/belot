FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11.9.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY apps/e2e/package.json apps/e2e/
COPY packages/api/package.json packages/api/
COPY packages/components/package.json packages/components/
COPY packages/constants/package.json packages/constants/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/hooks/package.json packages/hooks/
COPY packages/localizations/package.json packages/localizations/
COPY packages/store/package.json packages/store/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/
COPY packages/vitest-config/package.json packages/vitest-config/
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm --filter @belot/api build
RUN pnpm --filter @belot/web build

FROM node:24-bookworm-slim AS api
ENV NODE_ENV=production PORT=3001
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
USER node
EXPOSE 3001
CMD ["node", "dist/index.js"]

FROM nginx:stable-alpine AS web
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
