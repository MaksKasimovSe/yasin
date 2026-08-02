import { currentStaffRestaurant } from '@/lib/auth';
import { updateSettings } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const restaurant = await currentStaffRestaurant();

  return (
    <main className="wrap" style={{ paddingBottom: 60, maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, marginBottom: 0 }}>Настройки</h1>
      <p className="muted tiny" style={{ marginTop: 4, marginBottom: 24 }}>
        Изменение палитрыпозволит отображать клиентское меню в указанном цвете  
      </p>

      <form action={updateSettings} className="card" style={{ padding: 22 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="lbl" htmlFor="name">
            Название заведения
          </label>
          <input id="name" className="field" name="name" defaultValue={restaurant.name} required />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="lbl" htmlFor="tagline">
            Тэг
          </label>
          <input
            id="tagline"
            className="field"
            name="tagline"
            defaultValue={restaurant.tagline}
            placeholder="Shown under the name on the guest menu"
          />
        </div>

        <div className="row" style={{ marginBottom: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 130px' }}>
            <label className="lbl" htmlFor="accent">
              Цветовая палитра
            </label>
            <input
              id="accent"
              className="field"
              name="accent"
              type="color"
              defaultValue={restaurant.accent}
              style={{ height: 44, padding: 4 }}
            />
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label className="lbl" htmlFor="currencySymbol">
              Валюта
            </label>
            <input
              id="currencySymbol"
              className="field"
              name="currencySymbol"
              defaultValue={restaurant.currency_symbol}
            />
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label className="lbl" htmlFor="serviceCharge">
              Обслуживание (%)
            </label>
            <input
              id="serviceCharge"
              className="field"
              name="serviceCharge"
              type="number"
              min="0"
              max="100"
              step="0.5"
              defaultValue={restaurant.service_charge_pct}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="lbl" htmlFor="staffPin">
            Код сотрудников
          </label>
          <input
            id="staffPin"
            className="field"
            name="staffPin"
            inputMode="numeric"
            pattern="\d{4,8}"
            defaultValue={restaurant.staff_pin}
            style={{ maxWidth: 180 }}
          />
          <p className="tiny muted" style={{ marginBottom: 0 }}>
            от 4 до 8 цифр
          </p>
        </div>

        <button className="btn" type="submit">
          Сохранить
        </button>
      </form>
    </main>
  );
}
