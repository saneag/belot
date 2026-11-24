FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11.9.0
COPY . .
RUN pnpm install --frozen-lockfile
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
