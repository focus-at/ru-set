(function(module){
  /*  private-anon-9fac48a8f-rusetwl.apiary-mock.com*/
  module.value('validationPatterns', {
    date: {
      pattern: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/
    },
    phone: {
      test: function(value){
        return /^(([78][0-9]{10})|([^78]{1}[0-9]{9,}))$/.test(value.replace(/[^0-9]/g, ''));
      },
      hint: 'Укажите номер телефона, например 89991234567'
    },
    email: {
      pattern: /^[-a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+)*@([-a-zA-Z0-9]{0,61})\.*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|рф|[a-zA-Z][a-zA-Z])$/
    },
    PR: { // Паспорт РФ
      test: function(value){
        return  /^([0-9]{4})([0-9]{6})$/.test(value.replace(/[^0-9]/g, ''));
      },
      hint: 'Укажите серию и номер, всего 10 цифр',
      name: /[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+/,
      nhint: 'Укажите имя, фамилию и отчество русскими буквами',
      image: 'st4_pop_pic_1.jpg',
      mask: '00 00 000000'
    },
    ZP: { // Загранпаспорт
      test: function(value){
        return  /^([0-9]{2})([0-9]{7})$/.test(value.replace(/[^0-9]/g, ''));
      },
      hint: 'Укажите серию и номер, всего 9 цифр',
      name: /[a-zA-Z\-]+[ ]+[a-zA-Z\-]+.*/,
      nhint: 'Укажите имя и фамилию английскими буквами',
      image: 'st4_pop_pic_4.jpg'
    },
    SR: { // Свидетельство о рождении
      test: function(value){
        return /^([IVXivx]{1,6}[а-яА-ЯёЁ]{2})([0-9]{6})$/.test(value.replace(/[^IVXivxа-яА-ЯёЁ0-9]/g, ''));
      },
      hint: 'Укажите серию и номер, римские цифры вводятся английскими буквами',
      name: /[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+/,
      nhint: 'Укажите имя, фамилию и отчество русскими буквами',
      image: 'st4_pop_pic_2.jpg'
    },
    VB: { // Военный билет
      test: function(value){
        return /^([а-яА-ЯёЁ]{2})([0-9]{7})$/.test(value.replace(/[^а-яА-ЯёЁ0-9]/g, ''));
      },
      hint: 'Укажите серию и номер, всего 7 цифр',
      name: /[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+[ ]+[а-яА-ЯёЁ\-]+/,
      nhint: 'Укажите имя, фамилию и отчество русскими буквами',
      image: 'st4_pop_pic_5.jpg'
    },
    PM: { // Паспорт моряка
      test: function(value){
        return /^([а-яА-ЯёЁ]{2})([0-9]{7})$/.test(value.replace(/[^а-яА-ЯёЁ0-9]/g, ''));
      },
      hint: 'Укажите серию и номер, всего 7 цифр',
      name: /[а-яА-ЯёЁa-zA-Z\-]+[ ]+[а-яА-ЯёЁa-zA-Z\-]+.*/,
      nhint: 'Укажите имя, фамилию и отчество русскими буквами',
      image: 'st4_pop_pic_6.jpg'
    },
    IP: { // Иностранный паспорт
      test: function(value){
        return /^(.+)$/.test(value);
      },
      hint: 'Укажите серию (если есть) и номер документа',
      name: /.+/,
      nhint: 'Укажите имя и фамилию'
    },
    ID: { // Иной документ
      test: function(value){
        return /^(.+)$/.test(value);
      },
      hint: 'Укажите серию (если есть) и номер документа',
      name: /.+/,
      nhint: 'Укажите имя и фамилию'
    }
  });

  module.value('countries', [
    {
    "name":"Австралия",
    "isoCode2":"AU"
    },
    {
    "name":"Французские Южные территории",
    "isoCode2":"AT"
    },
    {
    "name":"Азербайджан",
    "isoCode2":"AZ"
    },
    {
    "name":"Албания",
    "isoCode2":"AL"
    },
    {
    "name":"Афганистан",
    "isoCode2":"DZ"
    },
    {
    "name":"Ангилья",
    "isoCode2":"AI"
    },
    {
    "name":"Ангола",
    "isoCode2":"AO"
    },
    {
    "name":"Андорра",
    "isoCode2":"AD"
    },
    {
    "name":"Антигуа и Барбуда",
    "isoCode2":"AG"
    },
    {
    "name":"Антильские острова",
    "isoCode2":"AN"
    },
    {
    "name":"Аомынь",
    "isoCode2":"MO"
    },
    {
    "name":"Аргентина",
    "isoCode2":"AR"
    },
    {
    "name":"Армения",
    "isoCode2":"AM"
    },
    {
    "name":"Аруба",
    "isoCode2":"AW"
    },
    {
    "name":"Багамы",
    "isoCode2":"BS"
    },
    {
    "name":"Бангладеш",
    "isoCode2":"BD"
    },
    {
    "name":"Барбадос",
    "isoCode2":"BB"
    },
    {
    "name":"Бахрейн",
    "isoCode2":"BH"
    },
    {
    "name":"Белиз",
    "isoCode2":"BZ"
    },
    {
    "name":"Беларусь",
    "isoCode2":"BY"
    },
    {
    "name":"Бельгия",
    "isoCode2":"BE"
    },
    {
    "name":"Бенин",
    "isoCode2":"BM"
    },
    {
    "name":"Литва",
    "isoCode2":"DZA"
    },
    {
    "name":"Болгария",
    "isoCode2":"BG"
    },
    {
    "name":"Боливия",
    "isoCode2":"BO"
    },
    {
    "name":"Босния и Герцеговина",
    "isoCode2":"BA"
    },
    {
    "name":"Ботсвана",
    "isoCode2":"BW"
    },
    {
    "name":"Бразилия",
    "isoCode2":"BR"
    },
    {
    "name":"Британская территория в Индийском океане",
    "isoCode2":"IO"
    },
    {
    "name":"Бруней-Даруссалам",
    "isoCode2":"BN"
    },
    {
    "name":"Буве, остров",
    "isoCode2":"BV"
    },
    {
    "name":"Буркина-Фасо",
    "isoCode2":"BF"
    },
    {
    "name":"Бурунди",
    "isoCode2":"BI"
    },
    {
    "name":"Бутан",
    "isoCode2":"BT"
    },
    {
    "name":"Вануату",
    "isoCode2":"VU"
    },
    {
    "name":"Ватикан",
    "isoCode2":"VA"
    },
    {
    "name":"Великобритания",
    "isoCode2":"GB"
    },
    {
    "name":"Венгрия",
    "isoCode2":"HU"
    },
    {
    "name":"Венесуэла",
    "isoCode2":"VE"
    },
    {
    "name":"Виргинские острова (Британские)",
    "isoCode2":"VG"
    },
    {
    "name":"Виргинские острова (США)",
    "isoCode2":"VI"
    },
    {
    "name":"Восточное Самоа",
    "isoCode2":"AS"
    },
    {
    "name":"Восточный Тимор",
    "isoCode2":"TP"
    },
    {
    "name":"Вьетнам",
    "isoCode2":"VN"
    },
    {
    "name":"Габон",
    "isoCode2":"GA"
    },
    {
    "name":"Гаити",
    "isoCode2":"HT"
    },
    {
    "name":"Гуам",
    "isoCode2":"GU"
    },
    {
    "name":"Гамбия",
    "isoCode2":"GH"
    },
    {
    "name":"Гваделупа",
    "isoCode2":"GP"
    },
    {
    "name":"Гватемала",
    "isoCode2":"GT"
    },
    {
    "name":"Гвиана Французская",
    "isoCode2":"GF"
    },
    {
    "name":"Гвинея",
    "isoCode2":"GN"
    },
    {
    "name":"Гвинея-Бисау",
    "isoCode2":"GW"
    },
    {
    "name":"Германия",
    "isoCode2":"DE"
    },
    {
    "name":"Гибралтар",
    "isoCode2":"GI"
    },
    {
    "name":"Гондурас",
    "isoCode2":"HN"
    },
    {
    "name":"Сянган (Гонгонг)",
    "isoCode2":"HK"
    },
    {
    "name":"Гренада",
    "isoCode2":"GD"
    },
    {
    "name":"Гренландия",
    "isoCode2":"GL"
    },
    {
    "name":"Греция",
    "isoCode2":"GR"
    },
    {
    "name":"Грузия",
    "isoCode2":"GE"
    },
    {
    "name":"Дания",
    "isoCode2":"DK"
    },
    {
    "name":"Джибути",
    "isoCode2":"DJ"
    },
    {
    "name":"Доминика",
    "isoCode2":"DM"
    },
    {
    "name":"Доминиканская Республика",
    "isoCode2":"DO"
    },
    {
    "name":"Египет",
    "isoCode2":"EG"
    },
    {
    "name":"Замбия",
    "isoCode2":"ZM"
    },
    {
    "name":"Западная Сахара",
    "isoCode2":"EH"
    },
    {
    "name":"Зимбабве",
    "isoCode2":"ZW"
    },
    {
    "name":"Израиль",
    "isoCode2":"IL"
    },
    {
    "name":"Индия",
    "isoCode2":"IN"
    },
    {
    "name":"Индонезия",
    "isoCode2":"ID"
    },
    {
    "name":"Иордания",
    "isoCode2":"JO"
    },
    {
    "name":"Ирак",
    "isoCode2":"IQ"
    },
    {
    "name":"Иран",
    "isoCode2":"IR"
    },
    {
    "name":"Ирландия",
    "isoCode2":"IE"
    },
    {
    "name":"Исландия",
    "isoCode2":"IS"
    },
    {
    "name":"Испания",
    "isoCode2":"ES"
    },
    {
    "name":"Италия",
    "isoCode2":"IT"
    },
    {
    "name":"Кабо-Верде",
    "isoCode2":"CV"
    },
    {
    "name":"Казахстан",
    "isoCode2":"KZ"
    },
    {
    "name":"Кайман, острова",
    "isoCode2":"KY"
    },
    {
    "name":"Камбоджа",
    "isoCode2":"KH"
    },
    {
    "name":"Камерун",
    "isoCode2":"CM"
    },
    {
    "name":"Канада",
    "isoCode2":"CA"
    },
    {
    "name":"Катар",
    "isoCode2":"QA"
    },
    {
    "name":"Кения",
    "isoCode2":"KE"
    },
    {
    "name":"Кипр",
    "isoCode2":"CY"
    },
    {
    "name":"Кирибати",
    "isoCode2":"KI"
    },
    {
    "name":"Китай",
    "isoCode2":"CN"
    },
    {
    "name":"Кокосовые (Килинг) острова",
    "isoCode2":"CC"
    },
    {
    "name":"Колумбия",
    "isoCode2":"CO"
    },
    {
    "name":"Коморы",
    "isoCode2":"KM"
    },
    {
    "name":"Конго (Браззавиль)",
    "isoCode2":"CG"
    },
    {
    "name":"Конго (Киншаса)",
    "isoCode2":"CD"
    },
    {
    "name":"Корейская Народно-Демократическая Республика",
    "isoCode2":"KP"
    },
    {
    "name":"Корея, Республика",
    "isoCode2":"KR"
    },
    {
    "name":"Коста-Рика",
    "isoCode2":"CR"
    },
    {
    "name":"Кот-д’Ивуар",
    "isoCode2":"CI"
    },
    {
    "name":"Куба",
    "isoCode2":"CU"
    },
    {
    "name":"Кувейт",
    "isoCode2":"KW"
    },
    {
    "name":"Кука, острова",
    "isoCode2":"CK"
    },
    {
    "name":"Кыргызстан",
    "isoCode2":"KG"
    },
    {
    "name":"Лаос",
    "isoCode2":"LA"
    },
    {
    "name":"Латвия",
    "isoCode2":"LV"
    },
    {
    "name":"Лесото",
    "isoCode2":"LS"
    },
    {
    "name":"Либерия",
    "isoCode2":"LR"
    },
    {
    "name":"Ливан",
    "isoCode2":"LB"
    },
    {
    "name":"Ливия",
    "isoCode2":"LT"
    },
    {
    "name":"Лихтенштейн",
    "isoCode2":"LI"
    },
    {
    "name":"Люксембург",
    "isoCode2":"LU"
    },
    {
    "name":"Маврикий",
    "isoCode2":"MU"
    },
    {
    "name":"Мавритания",
    "isoCode2":"MR"
    },
    {
    "name":"Мадагаскар",
    "isoCode2":"MG"
    },
    {
    "name":"Македония",
    "isoCode2":"MK"
    },
    {
    "name":"Малави",
    "isoCode2":"MW"
    },
    {
    "name":"Малайзия",
    "isoCode2":"MY"
    },
    {
    "name":"Мали",
    "isoCode2":"ML"
    },
    {
    "name":"Мальдивы",
    "isoCode2":"MV"
    },
    {
    "name":"Маоре",
    "isoCode2":"YT"
    },
    {
    "name":"Марокко",
    "isoCode2":"MA"
    },
    {
    "name":"Мартиника",
    "isoCode2":"MQ"
    },
    {
    "name":"Маршалловы острова",
    "isoCode2":"MH"
    },
    {
    "name":"Мексика",
    "isoCode2":"MX"
    },
    {
    "name":"Мелкие отдалённые острова США",
    "isoCode2":"UM"
    },
    {
    "name":"Микронезия",
    "isoCode2":"FM"
    },
    {
    "name":"Мозамбик",
    "isoCode2":"MZ"
    },
    {
    "name":"Молдова",
    "isoCode2":"MD"
    },
    {
    "name":"Монако",
    "isoCode2":"MC"
    },
    {
    "name":"Монголия",
    "isoCode2":"MN"
    },
    {
    "name":"Монтсеррат",
    "isoCode2":"MS"
    },
    {
    "name":"Мьянма",
    "isoCode2":"MM"
    },
    {
    "name":"Намибия",
    "isoCode2":"NA"
    },
    {
    "name":"Науру",
    "isoCode2":"NR"
    },
    {
    "name":"Непал",
    "isoCode2":"NP"
    },
    {
    "name":"Нигер",
    "isoCode2":"NE"
    },
    {
    "name":"Нигерия",
    "isoCode2":"NG"
    },
    {
    "name":"Нидерланды",
    "isoCode2":"NL"
    },
    {
    "name":"Никарагуа",
    "isoCode2":"NI"
    },
    {
    "name":"Ниуэ",
    "isoCode2":"NU"
    },
    {
    "name":"Новая Зеландия",
    "isoCode2":"NZ"
    },
    {
    "name":"Новая Каледония",
    "isoCode2":"NC"
    },
    {
    "name":"Норвегия",
    "isoCode2":"NO"
    },
    {
    "name":"Норфолк",
    "isoCode2":"NF"
    },
    {
    "name":"Объединённые Арабские Эмираты",
    "isoCode2":"AE"
    },
    {
    "name":"Оман",
    "isoCode2":"OM"
    },
    {
    "name":"Пакистан",
    "isoCode2":"PK"
    },
    {
    "name":"Палау",
    "isoCode2":"PW"
    },
    {
    "name":"Панама",
    "isoCode2":"PA"
    },
    {
    "name":"Папуа-Новая Гвинея",
    "isoCode2":"PG"
    },
    {
    "name":"Парагвай",
    "isoCode2":"PY"
    },
    {
    "name":"Перу",
    "isoCode2":"PE"
    },
    {
    "name":"Питкэрн",
    "isoCode2":"PN"
    },
    {
    "name":"Польша",
    "isoCode2":"PL"
    },
    {
    "name":"Португалия",
    "isoCode2":"PT"
    },
    {
    "name":"Пуэрто-Рико",
    "isoCode2":"PR"
    },
    {
    "name":"Реюньон",
    "isoCode2":"RE"
    },
    {
    "name":"Рождества (Кристмас), остров",
    "isoCode2":"CX"
    },
    {
    "name":"РФ",
    "isoCode2":"RU"
    },
    {
    "name":"Руанда",
    "isoCode2":"RW"
    },
    {
    "name":"Румыния",
    "isoCode2":"RO"
    },
    {
    "name":"Сальвадор",
    "isoCode2":"SV"
    },
    {
    "name":"Самоа",
    "isoCode2":"WS"
    },
    {
    "name":"Сан-Марино",
    "isoCode2":"SM"
    },
    {
    "name":"Сан-Томе и Принсипи",
    "isoCode2":"ST"
    },
    {
    "name":"Саудовская Аравия",
    "isoCode2":"SA"
    },
    {
    "name":"Свазиленд",
    "isoCode2":"SZ"
    },
    {
    "name":"Свальбард (Шпицберген) и Ян-Майен",
    "isoCode2":"SJ"
    },
    {
    "name":"Святая Елена",
    "isoCode2":"SH"
    },
    {
    "name":"Северные Марианские острова",
    "isoCode2":"MP"
    },
    {
    "name":"Сейшелы",
    "isoCode2":"SC"
    },
    {
    "name":"Сен-Пьер и Микелон",
    "isoCode2":"PM"
    },
    {
    "name":"Сенегал",
    "isoCode2":"SN"
    },
    {
    "name":"Сент-Винсент и Гренадины",
    "isoCode2":"VC"
    },
    {
    "name":"Сент-Китс и Невис",
    "isoCode2":"KN"
    },
    {
    "name":"Сент-Люсия",
    "isoCode2":"LC"
    },
    {
    "name":"Сингапур",
    "isoCode2":"SG"
    },
    {
    "name":"Сирия",
    "isoCode2":"SY"
    },
    {
    "name":"Словакия",
    "isoCode2":"SK"
    },
    {
    "name":"Словения",
    "isoCode2":"SI"
    },
    {
    "name":"США",
    "isoCode2":"US"
    },
    {
    "name":"Сьерра-Леоне",
    "isoCode2":"SL"
    },
    {
    "name":"Сомали",
    "isoCode2":"SO"
    },
    {
    "name":"Судан",
    "isoCode2":"SD"
    },
    {
    "name":"Суринам",
    "isoCode2":"SR"
    },
    {
    "name":"Таджикистан",
    "isoCode2":"TJ"
    },
    {
    "name":"Таиланд",
    "isoCode2":"TH"
    },
    {
    "name":"Тайвань",
    "isoCode2":"TW"
    },
    {
    "name":"Танзания",
    "isoCode2":"TZ"
    },
    {
    "name":"Тёркс и Кайкос",
    "isoCode2":"TC"
    },
    {
    "name":"Того",
    "isoCode2":"TG"
    },
    {
    "name":"Токелау",
    "isoCode2":"TK"
    },
    {
    "name":"Тонга",
    "isoCode2":"TO"
    },
    {
    "name":"Тринидад и Тобаго",
    "isoCode2":"TT"
    },
    {
    "name":"Тувалу",
    "isoCode2":"TV"
    },
    {
    "name":"Тунис",
    "isoCode2":"TN"
    },
    {
    "name":"Туркменистан",
    "isoCode2":"TM"
    },
    {
    "name":"Турция",
    "isoCode2":"TR"
    },
    {
    "name":"Уганда",
    "isoCode2":"UG"
    },
    {
    "name":"Узбекистан",
    "isoCode2":"UZ"
    },
    {
    "name":"Украина",
    "isoCode2":"UA"
    },
    {
    "name":"Уоллис и Футуна",
    "isoCode2":"WF"
    },
    {
    "name":"Уругвай",
    "isoCode2":"UY"
    },
    {
    "name":"Фарерские острова",
    "isoCode2":"FO"
    },
    {
    "name":"Фиджи",
    "isoCode2":"FJ"
    },
    {
    "name":"Филиппины",
    "isoCode2":"PH"
    },
    {
    "name":"Финляндия",
    "isoCode2":"FI"
    },
    {
    "name":"Фолклендские (Мальвинские) острова",
    "isoCode2":"FK"
    },
    {
    "name":"Франция",
    "isoCode2":"FR"
    },
    {
    "name":"Франция, Метрополия",
    "isoCode2":"FX"
    },
    {
    "name":"Французская Полинезия",
    "isoCode2":"PF"
    },
    {
    "name":"Херд и Макдональд, острова",
    "isoCode2":"HM"
    },
    {
    "name":"Хорватия",
    "isoCode2":"HR"
    },
    {
    "name":"Центрально-Африканская Республика",
    "isoCode2":"CF"
    },
    {
    "name":"Чехия",
    "isoCode2":"CZ"
    },
    {
    "name":"Чили",
    "isoCode2":"CL"
    },
    {
    "name":"Швейцария",
    "isoCode2":"CH"
    },
    {
    "name":"Швеция",
    "isoCode2":"SE"
    },
    {
    "name":"Шри-Ланка",
    "isoCode2":"LK"
    },
    {
    "name":"Эквадор",
    "isoCode2":"EC"
    },
    {
    "name":"Экваториальная Гвинея",
    "isoCode2":"GQ"
    },
    {
    "name":"Эритрея",
    "isoCode2":"ER"
    },
    {
    "name":"Эстония",
    "isoCode2":"EE"
    },
    {
    "name":"Эфиопия",
    "isoCode2":"ET"
    },
    {
    "name":"Югославия",
    "isoCode2":"YU"
    },
    {
    "name":"Южная Георгия и Южные Сандвичевы острова",
    "isoCode2":"SS"
    },
    {
    "name":"Южно-Африканская Республика",
    "isoCode2":"ZA"
    },
    {
    "name":"Ямайка",
    "isoCode2":"JM"
    },
    {
    "name":"Япония",
    "isoCode2":"JP"
    }
  ]);
})(angular.module('app.values', []));
