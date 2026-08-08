// UI-string translations for the guest-facing table menu.
//
// This translates static interface copy only (buttons, labels, checkout
// text). Item names, descriptions, and category names come straight from
// the database in whatever language the owner entered them — translating
// those needs extra per-language columns and is a separate piece of work.

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const SUPPORTED = new Set(LANGUAGES.map((l) => l.code));

export const STRINGS = {
  en: {
    cart: {
      reviewOrder: 'Review order',
      item_one: '{count} item',
      item_other: '{count} items',
      inclService: 'incl. {pct}% service',
    },
    sheet: {
      yourOrder: 'Your order',
      close: 'Close',
      subtotal: 'Subtotal',
      service: 'Service ({pct}%)',
      total: 'Total',
      noteLabel: 'Anything the kitchen should know?',
      notePlaceholder: 'No onions, extra bread…',
      payNote: 'You pay at the table as usual — this only sends the order to the staff.',
      sendOrder: 'Send order · {total}',
      sending: 'Sending…',
    },
    placed: {
      orderSent: 'Order #{id} sent',
      orderSomethingElse: 'Order something else',
    },
    status: {
      new: { label: 'Sent to the kitchen', hint: 'The staff have your order.' },
      preparing: { label: 'Being prepared', hint: 'Your food is on the stove.' },
      ready: { label: 'Ready', hint: 'Coming to your table now.' },
      served: { label: 'Served', hint: 'Enjoy your meal!' },
      cancelled: { label: 'Cancelled', hint: 'Please speak to a staff member.' },
    },
    a11y: {
      removeOne: 'Remove one {name}',
      addOne: 'Add one {name}',
      addItem: 'Add {name}',
    },
    orderType: {
      label: 'Order type',
      dineIn: 'Dine in',
      takeout: 'Takeout',
    },
    language: 'Language',
  },
  ru: {
    cart: {
      reviewOrder: 'Посмотреть заказ',
      item_one: '{count} блюдо',
      item_other: '{count} блюд(а)',
      inclService: 'включая сервис {pct}%',
    },
    sheet: {
      yourOrder: 'Ваш заказ',
      close: 'Закрыть',
      subtotal: 'Промежуточный итог',
      service: 'Сервис ({pct}%)',
      total: 'Итого',
      noteLabel: 'Что-то, что должна знать кухня?',
      notePlaceholder: 'Без лука, дополнительный хлеб…',
      payNote: 'Оплата производится за столом как обычно — это только отправляет заказ персоналу.',
      sendOrder: 'Отправить заказ · {total}',
      sending: 'Отправка…',
    },
    placed: {
      orderSent: 'Заказ №{id} отправлен',
      orderSomethingElse: 'Заказать ещё',
    },
    status: {
      new: { label: 'Отправлено на кухню', hint: 'Персонал получил ваш заказ.' },
      preparing: { label: 'Готовится', hint: 'Ваше блюдо готовится.' },
      ready: { label: 'Готово', hint: 'Уже несут к вашему столу.' },
      served: { label: 'Подано', hint: 'Приятного аппетита!' },
      cancelled: { label: 'Отменено', hint: 'Пожалуйста, обратитесь к персоналу.' },
    },
    a11y: {
      removeOne: 'Убрать одну порцию «{name}»',
      addOne: 'Добавить ещё одну порцию «{name}»',
      addItem: 'Добавить «{name}»',
    },
    orderType: {
      label: 'Тип заказа',
      dineIn: 'В зале',
      takeout: 'На вынос',
    },
    language: 'Язык',
  },
  uz: {
    cart: {
      reviewOrder: 'Buyurtmani ko‘rish',
      item_one: '{count} taom',
      item_other: '{count} taom',
      inclService: '{pct}% xizmat haqi bilan',
    },
    sheet: {
      yourOrder: 'Sizning buyurtmangiz',
      close: 'Yopish',
      subtotal: 'Oraliq summa',
      service: 'Xizmat haqi ({pct}%)',
      total: 'Jami',
      noteLabel: 'Oshxonaga aytadigan gapingiz bormi?',
      notePlaceholder: 'Piyozsiz, qo‘shimcha non…',
      payNote: 'To‘lovni odatdagidek stolda amalga oshirasiz — bu faqat buyurtmani xodimlarga yuboradi.',
      sendOrder: 'Buyurtmani yuborish · {total}',
      sending: 'Yuborilmoqda…',
    },
    placed: {
      orderSent: '№{id}-buyurtma yuborildi',
      orderSomethingElse: 'Yana buyurtma berish',
    },
    status: {
      new: { label: 'Oshxonaga yuborildi', hint: 'Xodimlar buyurtmangizni oldi.' },
      preparing: { label: 'Tayyorlanmoqda', hint: 'Taomingiz tayyorlanmoqda.' },
      ready: { label: 'Tayyor', hint: 'Hozir stolingizga olib kelinmoqda.' },
      served: { label: 'Berildi', hint: 'Yoqimli ishtaha!' },
      cancelled: { label: 'Bekor qilindi', hint: 'Iltimos, xodimlardan biriga murojaat qiling.' },
    },
    a11y: {
      removeOne: '«{name}»dan bittasini olib tashlash',
      addOne: '«{name}»dan yana bittasini qo‘shish',
      addItem: '«{name}»ni qo‘shish',
    },
    orderType: {
      label: 'Buyurtma turi',
      dineIn: 'Zalda',
      takeout: 'Olib ketish',
    },
    language: 'Til',
  },
  ko: {
    cart: {
      reviewOrder: '주문 확인',
      item_one: '{count}개',
      item_other: '{count}개',
      inclService: '서비스 요금 {pct}% 포함',
    },
    sheet: {
      yourOrder: '주문 내역',
      close: '닫기',
      subtotal: '소계',
      service: '서비스 요금 ({pct}%)',
      total: '합계',
      noteLabel: '주방에 전달할 요청사항이 있나요?',
      notePlaceholder: '양파 빼주세요, 빵 추가…',
      payNote: '결제는 평소처럼 테이블에서 진행됩니다 — 이 버튼은 주문을 직원에게 전달할 뿐입니다.',
      sendOrder: '주문 보내기 · {total}',
      sending: '전송 중…',
    },
    placed: {
      orderSent: '주문 #{id}이 전송되었습니다',
      orderSomethingElse: '추가 주문하기',
    },
    status: {
      new: { label: '주방으로 전달됨', hint: '직원이 주문을 확인했습니다.' },
      preparing: { label: '조리 중', hint: '음식이 조리되고 있습니다.' },
      ready: { label: '준비 완료', hint: '곧 테이블로 가져다드립니다.' },
      served: { label: '서빙 완료', hint: '맛있게 드세요!' },
      cancelled: { label: '취소됨', hint: '직원에게 문의해 주세요.' },
    },
    a11y: {
      removeOne: '{name} 1개 빼기',
      addOne: '{name} 1개 추가',
      addItem: '{name} 추가',
    },
    orderType: {
      label: '주문 방식',
      dineIn: '매장 식사',
      takeout: '포장',
    },
    language: '언어',
  },
  zh: {
    cart: {
      reviewOrder: '查看订单',
      item_one: '{count} 件',
      item_other: '{count} 件',
      inclService: '含 {pct}% 服务费',
    },
    sheet: {
      yourOrder: '您的订单',
      close: '关闭',
      subtotal: '小计',
      service: '服务费（{pct}%）',
      total: '总计',
      noteLabel: '有什么需要告诉厨房的吗？',
      notePlaceholder: '不要洋葱，加面包…',
      payNote: '照常在桌边付款——此按钮仅将订单发送给员工。',
      sendOrder: '发送订单 · {total}',
      sending: '发送中…',
    },
    placed: {
      orderSent: '订单 #{id} 已发送',
      orderSomethingElse: '再点一单',
    },
    status: {
      new: { label: '已发送到厨房', hint: '员工已收到您的订单。' },
      preparing: { label: '制作中', hint: '您的餐点正在制作。' },
      ready: { label: '已完成', hint: '正在为您送到桌边。' },
      served: { label: '已上菜', hint: '祝您用餐愉快！' },
      cancelled: { label: '已取消', hint: '请联系工作人员。' },
    },
    a11y: {
      removeOne: '减少一份{name}',
      addOne: '再加一份{name}',
      addItem: '添加{name}',
    },
    orderType: {
      label: '用餐方式',
      dineIn: '堂食',
      takeout: '外带',
    },
    language: '语言',
  },
};

/** Narrow any input (browser locale, saved value, etc.) to a supported code. */
export function normalizeLang(code) {
  if (!code) return 'en';
  const base = String(code).toLowerCase().split('-')[0];
  return SUPPORTED.has(base) ? base : 'en';
}

/**
 * Look up a dot-path (e.g. "sheet.close") in the given language, falling
 * back to English, then the key itself, and interpolate {vars}.
 * Use the "_one"/"_other" suffix convention for simple count pluralization,
 * e.g. t(lang, 'cart.item', { count }).
 */
export function t(lang, path, vars) {
  const dict = STRINGS[normalizeLang(lang)] ?? STRINGS.en;
  const lookup = (source, key) => key.split('.').reduce((obj, part) => obj?.[part], source);

  let key = path;
  if (vars && typeof vars.count === 'number') {
    key = `${path}_${vars.count === 1 ? 'one' : 'other'}`;
  }

  const template = lookup(dict, key) ?? lookup(STRINGS.en, key) ?? path;
  if (!vars) return template;

  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replaceAll(`{${k}}`, String(v)),
    template
  );
}
