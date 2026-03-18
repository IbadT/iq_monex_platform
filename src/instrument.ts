import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/nestjs";

const configService = new ConfigService();

Sentry.init({
    dsn: configService.get<string>("SENTRY_DSN"),
    sendDefaultPii: true,
})