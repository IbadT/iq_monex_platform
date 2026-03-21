import { TariffCode } from "../enums/tariff-code.enum";

export const tariffData = [
    {
        code: TariffCode.BASE,
        name: "Базавая подписка",
        description: "Базовая подписка с 100 слотами",
        baseSlots: 100,
        baseDays: 30,
        maxTotalDays: 365,
        isExtendable: true,
        price: 500.0,
        currencyCode: "RUB",
        isActive: true,
    },
    {
        code: TariffCode.ADDITIONAL_PACKAGE,
        name: "Дополнительный слот",
        description: "Дополнительный слот для размещения лота",
        baseSlots: 100,
        baseDays: 30,
        maxTotalDays: 365,
        isExtendable: true,
        price: 500.0,
        currencyCode: "RUB",
        isActive: true,
    }
]