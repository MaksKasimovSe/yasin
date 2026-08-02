import Link from 'next/link';
import { getDefaultRestaurant, listTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Home() {
  const restaurant = getDefaultRestaurant();
  const tables = restaurant ? listTables(restaurant.id) : [];

  if (!restaurant) {
    return (
      <main className="wrap hero">
        <h1>No restaurant yet</h1>
        <p className="lede">
          Run <code>npm run seed</code> to create the demo restaurant, then reload this page.
        </p>
      </main>
    );
  }

  return (
    <main>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
      </style>
      <section className="wrap hero">
        <span className="logo">YASIN</span>
        <h1>Гости делают заказы прямо со стола. Кухня мгновенно их видит.</h1>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <Link className="btn" href={`/m/${restaurant.slug}/${tables[0]?.code ?? '1'}`}>
            Меню
          </Link>
          <Link className="btn ghost" href="/staff">
            Страница заказов
          </Link>
          <Link className="btn ghost" href="/admin">
            Админ панель
          </Link>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 56 }}>
        <div className="tiles">
          <div className="card tile">
            <div className="num">1</div>
            <h3>Гости сканируют QR code</h3>
            <p>
              QR-код открывает меню
            </p>
          </div>
          <div className="card tile">
            <div className="num">2</div>
            <h3>Они делают заказы со своего телефона.</h3>
            <p>
              Фотографии, описания и актуальные цены. 
              Товары, которые у вас закончились, скрываются одним касанием из панели управления владельца.
            </p>
          </div>
          <div className="card tile">
            <div className="num">3</div>
            <h3>Staff screen sounds an alert</h3>
            <p>
              Билет появляется на экране стойки в течение одной-двух секунд. 
              Персонал перемещает его на этап подготовки, заказ готов и подается.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <h2 style={{ fontSize: 21, marginBottom: 6 }}>Try it as a guest</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          Open a table on your phone and the staff screen on a laptop side by side — that
          side-by-side is the whole pitch.
        </p>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {tables.map((table) => (
            <Link key={table.id} className="btn ghost sm" href={`/m/${restaurant.slug}/${table.code}`}>
              {table.label}
            </Link>
          ))}
        </div>
      </section> 
    </main>
  );
}
