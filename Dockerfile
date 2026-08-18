FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY server.js ./

EXPOSE 80
ENV PORT=80
ENV CONFIG_FILE=/app/config.json

CMD ["node", "server.js"]
