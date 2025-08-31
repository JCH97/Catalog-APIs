# Stage 1 — build
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — production runtime
FROM node:24-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["npm", "run", "start"]
