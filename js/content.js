window.WEDDING_CONTENT = {
  couple: {
    groom: "Ахмед",
    bride: "Динара",
    separator: " & "
  },

  wedding: {
    // Формат: ГГГГ-ММ-ДДTЧЧ:ММ:СС
    dateTime: "2026-08-22T16:00:00",
    coverDate: "22 · 08 · 2026",
    day: "22",
    monthYear: "Августа 2026"
  },

  cover: {
    label: "Свадебное приглашение",
    buttonText: "Открыть приглашение"
  },

  invitation: {
    eyebrow: "Дорогие родные и близкие",
    title: "Приглашаем вас",
    text: `Совсем скоро в нашей жизни наступит особенный день — день, когда мы станем одной семьёй.

Мы будем счастливы разделить этот момент с дорогими для нас людьми и от всей души хотим видеть вас на нашем празднике.`,
    personalizedPrefix: "Будем особенно рады видеть вас,"
  },

  schedule: [
    {
      time: "16:00",
      title: "Сбор гостей",
      description: "Встречаемся, знакомимся и настраиваемся на праздничный вечер."
    },
    {
      time: "16:00",
      title: "Начало торжества",
      description: "Самый важный момент нашего дня, который мы хотим разделить с вами."
    },
    {
      time: "17:00",
      title: "Праздничный банкет",
      description: "Ужин, тёплые слова и радость встречи с близкими."
    }
  ],

  location: {
    name: 'Кафе «Беспокойный»',
    address: "Средняя Елюзань, ул. Складская, 30",
    routeUrl: "https://yandex.ru/maps/-/CTBPUW3G",

    // Замените на реальные координаты.
    latitude: 53.029236,
    longitude: 45.952815,

    zoom: 16,
    popupText: 'Кафе «Беспокойный»<br>Средняя Елюзань, ул. Складская, 30'
  },

  form: {
    // Вставьте сюда URL развернутого Google Apps Script, который заканчивается на /exec
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbz4Gkd_QIyYq--8NIKuPo-Gkwdc22dHSrYQRGHucoetfjSeFGr7ihZtbjP4lH18XmU3uQ/exec",

    description: "Пожалуйста, заполните анкету, чтобы мы могли подготовиться к встрече.",
    note: "Ответ будет записан в Google Таблицу организаторов.",
    successMessage: "Спасибо! Мы получили ваш ответ.",
    errorMessage: "Не удалось отправить ответ. Проверьте соединение и попробуйте ещё раз.",
    demoMessage: "Ссылка Google Apps Script пока не добавлена в js/content.js."
  },

  footer: {
    text: "С любовью ждём встречи с вами"
  },

  personalization: {
    // Пример ссылки: index.html?guest=Ильдар
    queryParameter: "guest"
  }
};
