'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatMoney } from '@/lib/money';
import { LANGUAGES, normalizeLang, t } from './i18n';

export default function MenuClient({ restaurant, table, menu }) {
  const storageKey = `qrmenu:cart:${restaurant.slug}:${table.code}`;
  const langStorageKey = 'qrmenu:lang';

  const [cart, setCart] = useState({});
  const [sheet, setSheet] = useState(null); // null | 'review' | 'placed'
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [activeCategory, setActiveCategory] = useState(menu[0]?.id ?? null);
  const [lang, setLang] = useState('en');
  const [orderType, setOrderType] = useState('dine_in'); // 'dine_in' | 'takeout'

  const sectionRefs = useRef({});
  const money = useCallback((amount) => formatMoney(amount, restaurant), [restaurant]);
  const tr = useCallback((path, vars) => t(lang, path, vars), [lang]);

  /* Pick up a saved language, or fall back to the browser's, on first load. */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(langStorageKey);
      setLang(normalizeLang(saved || navigator.language));
    } catch {
      /* private mode — default 'en' stands */
    }
  }, []);
  function getLocalized(field, obj, lang) {
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
  }
  function changeLang(next) {
    setLang(next);
    try {
      localStorage.setItem(langStorageKey, next);
    } catch {
      /* storage unavailable; selection still works for this visit */
    }
  }

  /* Restore an in-progress cart so a refresh mid-order isn't punishing. */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      /* private mode or corrupt value — start empty */
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      /* storage unavailable; cart still works in memory */
    }
  }, [cart, storageKey]);

  /* Highlight the category chip for whatever section is on screen. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveCategory(Number(visible.target.dataset.categoryId));
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [menu]);

  /* After ordering, follow the ticket so the guest sees it move along. */
  useEffect(() => {
    if (!placedOrder || ['served', 'cancelled'].includes(placedOrder.status)) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${placedOrder.id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setPlacedOrder((prev) => (prev ? { ...prev, status: data.order.status } : prev));
        }
      } catch {
        /* offline for a moment — next tick retries */
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [placedOrder]);

  const itemsById = useMemo(() => {
    const map = new Map();
    menu.forEach((category) => category.items.forEach((item) => map.set(item.id, item)));
    return map;
  }, [menu]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: itemsById.get(Number(id)), qty }))
        .filter((line) => line.item && line.qty > 0),
    [cart, itemsById]
  );

  const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);
  const serviceFee = Math.round((subtotal * restaurant.service_charge_pct) / 100);
  const total = subtotal + serviceFee;
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  function setQty(itemId, qty) {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[itemId];
      else next[itemId] = Math.min(99, qty);
      return next;
    });
  }

  function scrollToCategory(categoryId) {
    sectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function placeOrder() {
    setPlacing(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: restaurant.slug,
          tableCode: table.code,
          note,
          cart: lines.map((line) => ({ itemId: line.item.id, qty: line.qty })),
          orderType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send the order');

      setPlacedOrder({ id: data.orderId, total: data.total, status: 'new', orderType });
      setCart({});
      setNote('');
      setSheet('placed');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="menu-shell" style={{ '--accent': restaurant.accent }}>
      <header className="menu-head">
        <div className="wrap">
          <div className="spread" style={{ alignItems: 'flex-start' }}>
            <div>
              <h1>{restaurant.name}</h1>
              {restaurant.tagline && <div className="tagline">{restaurant.tagline}</div>}
            </div>
            <div className="row" style={{ alignItems: 'center', gap: 8 }}>
              <select
                aria-label={tr('language')}
                value={lang}
                onChange={(event) => changeLang(event.target.value)}
                style={{
                  border: '1px solid #56382D',
                  borderRadius: 999,
                  padding: '7px 12px',
                  background: '#56382D',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {LANGUAGES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.flag} {option.label}
                  </option>
                ))}
              </select>
              <span className="table-badge">{table.label}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="cat-nav" aria-label="Menu categories">
        <div className="cat-nav-inner">
          {menu.map((category) => (
            <button
              key={category.id}
              type="button"
              className="cat-chip"
              aria-current={activeCategory === category.id}
              onClick={() => scrollToCategory(category.id)}
            >
              {getLocalized("name", category, lang)}
            </button>
          ))}
        </div>
      </nav>

      <main className="wrap">
        {menu.map((category) => (
          <section
            key={category.id}
            ref={(node) => {
              sectionRefs.current[category.id] = node;
            }}
            data-category-id={category.id}
          >
            <h2 className="cat-title">{getLocalized("name", category, lang)}</h2>
            {category.items.map((item) => {
              const qty = cart[item.id] ?? 0;
              return (
                <article className="item" key={item.id}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt=""
                      width={76}
                      height={76}
                      style={{ width: 76, height: 76, borderRadius: 10, objectFit: 'cover', flex: 'none' }}
                    />
                  )}
                  <div className="grow">
                    <h4>{getLocalized("name", item, lang)}</h4>
                    {getLocalized("description", item, lang) && (
                      <p>{getLocalized("description", item, lang)}</p>
                    )}
                    <span className="price">{money(item.price)}</span>
                  </div>
                  <div style={{ flex: 'none' }}>
                    {qty > 0 ? (
                      <div className="qty">
                        <button type="button" onClick={() => setQty(item.id, qty - 1)} aria-label={tr('a11y.removeOne', { name: getLocalized("name", item, lang) })}>
                          −
                        </button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => setQty(item.id, qty + 1)} aria-label={tr('a11y.addOne', { name: getLocalized("name", item, lang) })}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => setQty(item.id, 1)}
                        aria-label={tr('a11y.addItem', { name: getLocalized("name", item, lang) })}
                      >
                        +
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        ))}

        <p className="muted tiny center" style={{ margin: '40px 0 0' }}>
          {table.label} · {restaurant.name}
        </p>
      </main>

      {count > 0 && sheet === null && (
        <div className="cart-bar">
          <div className="inner">
            <div className="grow">
              <div style={{ fontWeight: 700 }}>{money(total)}</div>
              <div className="tiny muted">
                {tr('cart.item', { count })}
                {serviceFee > 0 && ` · ${tr('cart.inclService', { pct: restaurant.service_charge_pct })}`}
              </div>
            </div>
            <button type="button" className="btn" onClick={() => setSheet('review')}>
              {tr('cart.reviewOrder')}
            </button>
          </div>
        </div>
      )}

      {sheet === 'review' && (
        <div
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Review order"
          onClick={(event) => event.target === event.currentTarget && setSheet(null)}
        >
          <div className="sheet">
            <div className="spread" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>{tr('sheet.yourOrder')}</h2>
              <button type="button" className="btn ghost sm" onClick={() => setSheet(null)}>
                {tr('sheet.close')}
              </button>
            </div>

            {lines.map((line) => (
              <div className="sheet-line" key={line.item.id}>
                <div className="row">
                  <div className="qty">
                    <button type="button" onClick={() => setQty(line.item.id, line.qty - 1)} aria-label={tr('a11y.removeOne', { name: getLocalized('name', line.item, lang) })}>
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button type="button" onClick={() => setQty(line.item.id, line.qty + 1)} aria-label={tr('a11y.addOne', { name: getLocalized('name', line.item, lang) })}>
                      +
                    </button>
                  </div>
                  <span>{getLocalized('name', line.item, lang)}</span>
                </div>
                <strong>{money(line.item.price * line.qty)}</strong>
              </div>
            ))}

            {serviceFee > 0 && (
              <>
                <div className="sheet-line muted">
                  <span>{tr('sheet.subtotal')}</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="sheet-line muted">
                  <span>{tr('sheet.service', { pct: restaurant.service_charge_pct })}</span>
                  <span>{money(serviceFee)}</span>
                </div>
              </>
            )}

            <div className="sheet-line sheet-total">
              <span>{tr('sheet.total')}</span>
              <span>{money(total)}</span>
            </div>

            <div style={{ margin: '16px 0' }}>
              <label className="lbl">{tr('orderType.label')}</label>
              <div className="row" style={{ gap: 8 }}>
                {['dine_in', 'takeout'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={orderType === type ? 'btn sm' : 'btn ghost sm'}
                    aria-pressed={orderType === type}
                    onClick={() => setOrderType(type)}
                    style={{ flex: 1 }}
                  >
                    {tr(type === 'dine_in' ? 'orderType.dineIn' : 'orderType.takeout')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ margin: '16px 0' }}>
              <label className="lbl" htmlFor="order-note">
                {tr('sheet.noteLabel')}
              </label>
              <textarea
                id="order-note"
                className="field"
                rows={2}
                maxLength={400}
                placeholder={tr('sheet.notePlaceholder')}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            {error && <p className="err">{error}</p>}

            <button
              type="button"
              className="btn block"
              disabled={placing || lines.length === 0}
              onClick={placeOrder}
            >
              {placing ? tr('sheet.sending') : tr('sheet.sendOrder', { total: money(total) })}
            </button>
            <p className="tiny muted center" style={{ marginBottom: 0 }}>
              {tr('sheet.payNote')}
            </p>
          </div>
        </div>
      )}

      {sheet === 'placed' && placedOrder && (
        <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label="Order sent">
          <div className="sheet center">
            <div className="success-mark">✓</div>
            <h2 style={{ marginBottom: 4 }}>{tr('placed.orderSent', { id: placedOrder.id })}</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              {tr(placedOrder.orderType === 'takeout' ? 'orderType.takeout' : 'orderType.dineIn')} · {table.label} · {money(placedOrder.total)}
            </p>

            <div className="card" style={{ padding: 16, margin: '18px 0', textAlign: 'left' }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>
                {tr(`status.${placedOrder.status}.label`)}
              </div>
              <div className="tiny muted">{tr(`status.${placedOrder.status}.hint`)}</div>
            </div>

            <button type="button" className="btn block ghost" onClick={() => setSheet(null)}>
              {tr('placed.orderSomethingElse')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
