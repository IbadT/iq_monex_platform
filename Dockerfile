# ─────────────────────────────────────────────────────────────
# Этап 1: Сборка (builder)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем конфиги
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальной код
COPY . .

# Генерация Prisma клиента
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

# Сборка приложения
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Этап 2: Продакшн
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Только production зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем скомпилированный код
COPY --from=builder /app/dist ./dist

# TODO: можно убрать для продакшена
COPY test-performance.ts ./

COPY scripts ./


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
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Аргументы для сборки
# ARG DATABASE_URL

# # Копируем конфиги
# COPY package*.json ./
# COPY tsconfig*.json ./
# COPY nest-cli.json ./

# # Устанавливаем зависимости
# RUN npm ci

# # Копируем остальной код
# COPY . .

# # Генерация Prisma клиента
# ENV DATABASE_URL=${DATABASE_URL}
# RUN npx prisma generate

# # Сборка приложения
# RUN npm run build

# # ─────────────────────────────────────────────────────────────
# # Этап 2: Продакшн
# # ─────────────────────────────────────────────────────────────
# FROM node:20-alpine AS production

# RUN apk add --no-cache dumb-init

# WORKDIR /app

# ENV NODE_ENV=production
# ENV PORT=3000

# # Только production зависимости
# COPY package*.json ./
# RUN npm ci --only=production && npm cache clean --force

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
# CMD ["node", "dist/src/main.js"]