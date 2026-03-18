# ─────────────────────────────────────────────────────────────
# Этап 1: Сборка (builder)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Prisma generate НЕ требует реальной БД, только для валидации схемы
# Используем фейковый URL для генерации клиента
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iq_monex_dev"

# Генерация Prisma клиента (только код, не подключение к БД)
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

# Копируем скомпилированный код и Prisma клиент из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Копируем схему для миграций (если нужно)
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]