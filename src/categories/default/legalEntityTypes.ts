type LegalEntityTypeData = {
  code: string;
  name: string;
};

export type LegalEntityTypeInfo = {
  data: {
    ru: LegalEntityTypeData;
    en: LegalEntityTypeData;
    kz: LegalEntityTypeData;
  };
};

export const legalEntityTypes: LegalEntityTypeInfo[] = [
  {
    data: {
      ru: { code: 'Частное лицо', name: 'Частное лицо' },
      en: { code: 'Private person', name: 'Private person' },
      kz: { code: 'Жеке тұлға', name: 'Жеке тұлға' },
    },
  },
  {
    data: {
      ru: { code: 'ИП', name: 'Индивидуальный предприниматель' },
      en: { code: 'IE', name: 'Individual Entrepreneur' },
      kz: { code: 'ЖК', name: 'Жеке кәсіпкер' },
    },
  },
  {
    data: {
      ru: { code: 'ООО', name: 'Общество с ограниченной ответственностью' },
      en: { code: 'LLC', name: 'Limited Liability Company' },
      kz: { code: 'ЖШС', name: 'Жауапкершілігі шектеулі серіктестік' },
    },
  },
  {
    data: {
      ru: { code: 'ЗАО', name: 'Закрытое акционерное общество' },
      en: { code: 'CJSC', name: 'Closed Joint Stock Company' },
      kz: { code: 'ЖАҚ', name: 'Жабық акционерлік қоғам' },
    },
  },
  {
    data: {
      ru: { code: 'ПАО', name: 'Публичное акционерное общество' },
      en: { code: 'PJSC', name: 'Public Joint Stock Company' },
      kz: { code: 'ЖАҚ', name: 'Жария акционерлік қоғам' },
    },
  },
  {
    data: {
      ru: { code: 'АО', name: 'Акционерное общество' },
      en: { code: 'JSC', name: 'Joint Stock Company' },
      kz: { code: 'АҚ', name: 'Акционерлік қоғам' },
    },
  },
  {
    data: {
      ru: { code: 'ОАО', name: 'Открытое акционерное общество' },
      en: { code: 'OJSC', name: 'Open Joint Stock Company' },
      kz: { code: 'ААҚ', name: 'Ашық акционерлік қоғам' },
    },
  },
];
