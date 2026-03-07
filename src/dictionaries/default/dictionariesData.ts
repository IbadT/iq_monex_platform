export const currenciesData = [
  {
    symbol: '₽',
    code: 'RUB',
    name: {
      ru: 'Российский рубль',
      en: 'Russian Ruble',
      kz: 'Ресей рублі',
    },
  },
  {
    symbol: 'Br',
    code: 'BYN',
    name: {
      ru: 'Белорусский рубль',
      en: 'Belarusian Ruble',
      kz: 'Беларусь рублі',
    },
  },
  {
    symbol: '₸',
    code: 'KZT',
    name: {
      ru: 'Казахстанский тенге',
      en: 'Kazakhstani Tenge',
      kz: 'Қазақстан теңгесі',
    },
  },
  {
    symbol: '$',
    code: 'USD',
    name: {
      ru: 'Доллар США',
      en: 'US Dollar',
      kz: 'АҚШ доллары',
    },
  },
  {
    symbol: '€',
    code: 'EUR',
    name: {
      ru: 'Евро',
      en: 'Euro',
      kz: 'Еуро',
    },
  },
  {
    symbol: '¥',
    code: 'CNY',
    name: {
      ru: 'Китайский юань',
      en: 'Chinese Yuan',
      kz: 'Қытай юані',
    },
  },
];

export const unitMeasurementsData = [
  // Штучные
  { name: { ru: 'за штуку', en: 'per piece', kz: 'дана' } },
  { name: { ru: 'за единицу', en: 'per unit', kz: 'бірлік' } },
  { name: { ru: 'за комплект', en: 'per set', kz: 'жиынтық' } },
  { name: { ru: 'за набор', en: 'per kit', kz: 'жиынтық' } },
  { name: { ru: 'за упаковку', en: 'per package', kz: 'орама' } },
  { name: { ru: 'за коробку', en: 'per box', kz: 'қорап' } },
  { name: { ru: 'за паллету', en: 'per pallet', kz: 'паллет' } },
  { name: { ru: 'за контейнер', en: 'per container', kz: 'контейнер' } },
  { name: { ru: 'за партию', en: 'per batch', kz: 'партия' } },
  { name: { ru: 'за тираж', en: 'per print run', kz: 'тираж' } },
  { name: { ru: 'за экземпляр', en: 'per copy', kz: 'дана' } },
  { name: { ru: 'за лицензию', en: 'per license', kz: 'лицензия' } },
  { name: { ru: 'за билет', en: 'per ticket', kz: 'билет' } },
  { name: { ru: 'за место', en: 'per seat', kz: 'орын' } },
  { name: { ru: 'за слот', en: 'per slot', kz: 'слот' } },
  { name: { ru: 'за заказ', en: 'per order', kz: 'тапсырыс' } },

  // Весовые
  {
    name: {
      ru: 'за миллиграмм (мг)',
      en: 'per milligram (mg)',
      kz: 'миллиграмм',
    },
  },
  { name: { ru: 'за грамм (г)', en: 'per gram (g)', kz: 'грамм' } },
  {
    name: { ru: 'за килограмм (кг)', en: 'per kilogram (kg)', kz: 'килограмм' },
  },
  { name: { ru: 'за центнер', en: 'per centner', kz: 'центнер' } },
  { name: { ru: 'за тонну (т)', en: 'per ton (t)', kz: 'тонна' } },
  { name: { ru: 'за унцию (oz)', en: 'per ounce (oz)', kz: 'унция' } },
  {
    name: { ru: 'за тройскую унцию', en: 'per troy ounce', kz: 'троя унциясы' },
  },
  { name: { ru: 'за фунт (lb)', en: 'per pound (lb)', kz: 'фунт' } },

  // Объемные
  {
    name: {
      ru: 'за миллилитр (мл)',
      en: 'per milliliter (ml)',
      kz: 'миллилитр',
    },
  },
  { name: { ru: 'за литр (л)', en: 'per liter (l)', kz: 'литр' } },
  { name: { ru: 'за гектолитр', en: 'per hectoliter', kz: 'гектолитр' } },
  { name: { ru: 'за баррель', en: 'per barrel', kz: 'баррель' } },
  { name: { ru: 'за галлон', en: 'per gallon', kz: 'галлон' } },

  // Длина
  {
    name: {
      ru: 'за миллиметр (мм)',
      en: 'per millimeter (mm)',
      kz: 'миллиметр',
    },
  },
  {
    name: {
      ru: 'за сантиметр (см)',
      en: 'per centimeter (cm)',
      kz: 'сантиметр',
    },
  },
  { name: { ru: 'за метр (м)', en: 'per meter (m)', kz: 'метр' } },
  {
    name: {
      ru: 'за погонный метр',
      en: 'per linear meter',
      kz: 'жүгіртпе метр',
    },
  },
  {
    name: { ru: 'за километр (км)', en: 'per kilometer (km)', kz: 'километр' },
  },
  { name: { ru: 'за дюйм', en: 'per inch', kz: 'дюйм' } },
  { name: { ru: 'за фут', en: 'per foot', kz: 'фут' } },

  // Площадь
  {
    name: {
      ru: 'за квадратный метр (м²)',
      en: 'per square meter (m²)',
      kz: 'шаршы метр',
    },
  },
  { name: { ru: 'за гектар', en: 'per hectare', kz: 'гектар' } },
  { name: { ru: 'за акр', en: 'per acre', kz: 'акр' } },

  // Время
  { name: { ru: 'за минуту', en: 'per minute', kz: 'минут' } },
  { name: { ru: 'за час', en: 'per hour', kz: 'сағат' } },
  { name: { ru: 'за смену', en: 'per shift', kz: 'ауысым' } },
  { name: { ru: 'за день', en: 'per day', kz: 'күн' } },
  { name: { ru: 'за неделю', en: 'per week', kz: 'апта' } },
  { name: { ru: 'за месяц', en: 'per month', kz: 'ай' } },
  { name: { ru: 'за год', en: 'per year', kz: 'жыл' } },

  // Услуги
  { name: { ru: 'за сотрудника', en: 'per employee', kz: 'қызметкер' } },
  { name: { ru: 'за пользователя', en: 'per user', kz: 'пайдаланушы' } },
  { name: { ru: 'за подписчика', en: 'per subscriber', kz: 'жазылушы' } },
  { name: { ru: 'за запрос', en: 'per request', kz: 'сұраныс' } },
  { name: { ru: 'за транзакцию', en: 'per transaction', kz: 'транзакция' } },
  { name: { ru: 'за гигабайт', en: 'per gigabyte', kz: 'гигабайт' } },

  // Логистика
  { name: { ru: 'за километр', en: 'per kilometer', kz: 'километр' } },
  {
    name: {
      ru: 'за тонно-километр',
      en: 'per ton-kilometer',
      kz: 'тонна-километр',
    },
  },
  { name: { ru: 'за рейс', en: 'per trip', kz: 'рейс' } },
  { name: { ru: 'за доставку', en: 'per delivery', kz: 'жеткізу' } },
];
