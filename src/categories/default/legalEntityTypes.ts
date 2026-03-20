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
      ru: { code: 'ООО', name: 'Общество с ограниченной ответственностью' },
      en: { code: 'LLC', name: 'Limited Liability Company' },
      kz: { code: 'ЖШС', name: 'Жауапкершілігі шектеулі серіктестік' },
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
      ru: { code: 'ПАО', name: 'Публичное акционерное общество' },
      en: { code: 'PJSC', name: 'Public Joint Stock Company' },
      kz: { code: 'ЖАҚ', name: 'Жария акционерлік қоғам' },
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
      ru: { code: 'ГУП', name: 'Государственное унитарное предприятие' },
      en: { code: 'SUE', name: 'State Unitary Enterprise' },
      kz: { code: 'МУК', name: 'Мемлекеттік унитарлық кәсіпорын' },
    },
  },
  {
    data: {
      ru: { code: 'МУП', name: 'Муниципальное унитарное предприятие' },
      en: { code: 'MUE', name: 'Municipal Unitary Enterprise' },
      kz: { code: 'КУК', name: 'Коммуналдық унитарлық кәсіпорын' },
    },
  },
  {
    data: {
      ru: { code: 'НКО', name: 'Некоммерческая организация' },
      en: { code: 'NPO', name: 'Non-Profit Organization' },
      kz: { code: 'КО', name: 'Коммерциялық емес ұйым' },
    },
  },
  {
    data: {
      ru: { code: 'АНО', name: 'Автономная некоммерческая организация' },
      en: { code: 'ANO', name: 'Autonomous Non-Profit Organization' },
      kz: { code: 'АКО', name: 'Автономиялық коммерциялық емес ұйым' },
    },
  },
  {
    data: {
      ru: { code: 'Фонд', name: 'Фонд' },
      en: { code: 'Foundation', name: 'Foundation' },
      kz: { code: 'Қор', name: 'Қор' },
    },
  },
  {
    data: {
      ru: { code: 'Учреждение', name: 'Учреждение' },
      en: { code: 'Institution', name: 'Institution' },
      kz: { code: 'Мекеме', name: 'Мекеме' },
    },
  },
  {
    data: {
      ru: { code: 'Религиозная организация', name: 'Религиозная организация' },
      en: { code: 'Religious', name: 'Religious Organization' },
      kz: { code: 'Діни ұйым', name: 'Діни ұйым' },
    },
  },
  {
    data: {
      ru: { code: 'КА', name: 'Коллегия адвокатов' },
      en: { code: 'BA', name: 'Bar Association' },
      kz: { code: 'АК', name: 'Адвокаттар алқасы' },
    },
  },
  {
    data: {
      ru: { code: 'НП', name: 'Нотариальная палата' },
      en: { code: 'NC', name: 'Notarial Chamber' },
      kz: { code: 'НП', name: 'Нотариалдық палата' },
    },
  },
  {
    data: {
      ru: { code: 'ТСН', name: 'Товарищество собственников недвижимости' },
      en: { code: 'HOA', name: 'Homeowners Association' },
      kz: { code: 'МС', name: 'Мүлік иелерінің серіктестігі' },
    },
  },
  {
    data: {
      ru: { code: 'СНТ', name: 'Садоводческое некоммерческое товарищество' },
      en: { code: 'GNT', name: 'Gardening Non-Profit Partnership' },
      kz: { code: 'БС', name: 'Бағбаншылық серіктестік' },
    },
  },
];
