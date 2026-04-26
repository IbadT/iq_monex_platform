# ─────────────────────────────────────────────────────────────
# Этап 1: Сборка (builder)
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Копируем конфиги
COPY package*.json ./
COPY bun.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# Копируем остальной код
COPY . .

# Генерация Prisma клиента
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN bun run prisma generate

# Сборка приложения
RUN bun run build

# Заменяем алиасы путей на относительные
RUN bun run tsc-alias

# ─────────────────────────────────────────────────────────────
# Этап 2: Продакшн
# ─────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS production

RUN apk add --no-cache dumb-init postgresql-client jq bash nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Только production зависимости
COPY package*.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile --production && bun pm cache rm

# Копируем скомпилированный код
COPY --from=builder /app/dist ./dist

# TODO: можно убрать для продакшена
COPY test-performance.ts ./

COPY src/scripts ./src/scripts
RUN chmod +x ./src/scripts/*.sh

# Создаем директорию для бэкапов
RUN mkdir -p ./backups


# Копируем Prisma клиент (только необходимые части)
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Копируем схему для миграций
COPY --from=builder /app/prisma ./prisma

# Копируем Prisma конфигурацию
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]


# # ─────────────────────────────────────────────────────────────
# # Этап 1: Сборка (builder)
# # ─────────────────────────────────────────────────────────────
# FROM oven/bun:1-alpine AS builder

# WORKDIR /app

# # Аргументы для сборки
# ARG DATABASE_URL

# # Копируем конфиги
# COPY package*.json ./
# COPY bun.lock ./
# COPY tsconfig*.json ./
# COPY nest-cli.json ./

# # Устанавливаем зависимости
# RUN bun install --frozen-lockfile

# # Копируем остальной код
# COPY . .

# # Генерация Prisma клиента
# ENV DATABASE_URL=${DATABASE_URL}
# RUN bun run prisma generate

# # Сборка приложения
# RUN bun run build

# # ─────────────────────────────────────────────────────────────
# # Этап 2: Продакшн
# # ─────────────────────────────────────────────────────────────
# FROM oven/bun:1-alpine AS production

# RUN apk add --no-cache dumb-init

# WORKDIR /app

# ENV NODE_ENV=production
# ENV PORT=3000

# # Только production зависимости
# COPY package*.json ./
# COPY bun.lock ./
# RUN bun install --frozen-lockfile --production && bun pm cache rm

# # Копируем скомпилированный код
# COPY --from=builder /app/dist ./dist

# # TODO: можно убрать для продакшена
# COPY test-performance.ts ./

# COPY scripts ./


# # Копируем Prisma клиент (только необходимые части)
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# # Копируем схему для миграций
# COPY --from=builder /app/prisma ./prisma

# # Копируем Prisma конфигурацию
# COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# EXPOSE 3000

# ENTRYPOINT ["dumb-init", "--"]
# CMD ["bun", "dist/src/main.js"]