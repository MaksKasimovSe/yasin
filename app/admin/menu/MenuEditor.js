'use client';

import { useState, useTransition } from 'react';
import {
  addCategory,
  addItem,
  deleteCategory,
  deleteItem,
  toggleItem,
  updateCategory,
  updateItem,
} from '../actions';

/** Stored minor units → the string an owner expects to see in the input. */
function priceValue(price, restaurant) {
  const decimals = restaurant.currency_decimals ?? 0;
  return decimals > 0 ? (price / 10 ** decimals).toFixed(decimals) : String(price);
}

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: 'Oʻzbekcha' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
];

function AvailabilitySwitch({ item }) {
  const [available, setAvailable] = useState(Boolean(item.available));
  const [, startTransition] = useTransition();

  return (
    <label className="switch" title={available ? 'Showing on the menu' : 'Hidden from guests'}>
      <input
        type="checkbox"
        checked={available}
        onChange={(event) => {
          const next = event.target.checked;
          setAvailable(next);
          startTransition(() => toggleItem(item.id, next));
        }}
      />
      <span className="track" />
    </label>
  );
}

function ItemRow({ item, restaurant }) {
  const formId = `item-form-${item.id}`;
  return (
    <>
      <tr style={{ opacity: item.available ? 1 : 0.55 }}>
        <td style={{ width: 52 }}>
          <AvailabilitySwitch item={item} />
        </td>
        <td colSpan={4} style={{ padding: 0 }}>
          <form id={formId} action={updateItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="imageUrl" value={item.image_url} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 0' }}>
              <input
                className="editable"
                name="name"
                defaultValue={item.name}
                aria-label="Item name"
                style={{ flex: '2 1 180px', fontWeight: 600 }}
              />
              <input
                className="editable"
                name="description"
                defaultValue={item.description}
                placeholder="Short description"
                aria-label="Description"
                style={{ flex: '3 1 220px' }}
              />
              <input
                className="editable"
                name="price"
                defaultValue={priceValue(item.price, restaurant)}
                inputMode="decimal"
                aria-label="Price"
                style={{ flex: '0 0 110px', textAlign: 'right' }}
              />
              <button className="btn ghost sm" type="submit">
                Сохранить
              </button>
            </div>
          </form>
        </td>
        <td style={{ width: 44 }}>
          <form action={deleteItem}>
            <input type="hidden" name="id" value={item.id} />
            <button className="btn ghost sm" type="submit" aria-label={`Удалить ${item.name}`}>
              ✕
            </button>
          </form>
        </td>
      </tr>
      <tr style={{ opacity: item.available ? 1 : 0.55 }}>
        <td colSpan={6} style={{ padding: '0 0 8px', border: 0 }}>
          <details>
            <summary className="tiny muted" style={{ cursor: 'pointer', padding: '2px 0' }}>
              🌐 Переводы (5 языков)
            </summary>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 8,
                padding: '8px 0 4px',
              }}
            >
              {LANGS.map((lang) => (
                <div key={lang.code} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="tiny muted">{lang.label}</label>
                  <input
                    className="field"
                    form={formId}
                    name={`name_${lang.code}`}
                    defaultValue={item[`name_${lang.code}`] || ''}
                    placeholder={`Название (${lang.label})`}
                    aria-label={`Item name (${lang.label})`}
                  />
                  <input
                    className="field"
                    form={formId}
                    name={`description_${lang.code}`}
                    defaultValue={item[`description_${lang.code}`] || ''}
                    placeholder={`Описание (${lang.label})`}
                    aria-label={`Description (${lang.label})`}
                  />
                </div>
              ))}
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}

export default function MenuEditor({ restaurant, menu }) {
  return (
    <main className="wrap" style={{ paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 0 }}>Меню</h1>
      <p className="muted tiny" style={{ marginTop: 4, marginBottom: 24 }}>
        Вненсенные изменения будут отображаться в режиме реального времени
      </p>

      {menu.length === 0 && (
        <div className="empty" style={{ marginBottom: 24 }}>
          No categories yet. Add your first one below — for example “Main dishes”.
        </div>
      )}

      {menu.map((category) => {
        const catFormId = `category-form-${category.id}`;
        return (
        <section key={category.id} style={{ marginBottom: 30 }}>
          <div className="spread" style={{ marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>
                {category.name}{' '}
                <span className="tiny muted" style={{ fontWeight: 400 }}>
                  · {category.items.length} items
                </span>
              </h2>
              <details>
                <summary className="tiny muted" style={{ cursor: 'pointer', padding: '4px 0' }}>
                  🌐 Название на других языках
                </summary>
                <form
                  id={catFormId}
                  action={updateCategory}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 8,
                    padding: '8px 0 4px',
                    alignItems: 'end',
                  }}
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="name" value={category.name} />
                  {LANGS.map((lang) => (
                    <div key={lang.code} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label className="tiny muted">{lang.label}</label>
                      <input
                        className="field"
                        name={`name_${lang.code}`}
                        defaultValue={category[`name_${lang.code}`] || ''}
                        placeholder={`Категория (${lang.label})`}
                        aria-label={`Category name (${lang.label})`}
                      />
                    </div>
                  ))}
                  <button className="btn ghost sm" type="submit" form={catFormId}>
                    Сохранить переводы
                  </button>
                </form>
              </details>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={category.id} />
              <button className="btn ghost sm" type="submit">
                Удалить категорию
              </button>
            </form>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <tbody>
                {category.items.map((item) => (
                  <ItemRow key={item.id} item={item} restaurant={restaurant} />
                ))}

                <tr>
                  <td colSpan={6} style={{ background: 'var(--surface-2)' }}>
                    <form action={addItem} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input type="hidden" name="categoryId" value={category.id} />
                      <input
                        className="field"
                        name="name"
                        placeholder="Наименование"
                        required
                        style={{ flex: '2 1 180px' }}
                      />
                      <input
                        className="field"
                        name="description"
                        placeholder="Описание (опционально)"
                        style={{ flex: '3 1 220px' }}
                      />
                      <input
                        className="field"
                        name="price"
                        placeholder={`Цена (${restaurant.currency_symbol})`}
                        inputMode="decimal"
                        required
                        style={{ flex: '0 0 140px' }}
                      />
                      <button className="btn sm" type="submit">
                        Добавить
                      </button>
                    </form>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        );
      })}

      <div className="card" style={{ padding: 18 }}>
        <form action={addCategory} className="row">
          <input
            className="field grow"
            name="name"
            placeholder="Новая категория"
            required
          />
          <button className="btn" type="submit">
            Добавить категорию
          </button>
        </form>
      </div>
    </main>
  );
}