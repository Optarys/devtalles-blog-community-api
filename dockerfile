# Etapa de build
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Etapa de producción
FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
# Ejecuta migraciones y luego inicia
CMD ["node", "dist/main.js"]