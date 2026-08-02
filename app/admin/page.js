import Link from 'next/link';
import { currentStaffRestaurant } from '@/lib/auth';
import { getTodayStats, listActiveOrders, listRecentOrders, listTables, getMenu } from '@/lib/db';
import { formatMoney } from '@/lib/money';
import { clearOrderHistory } from './actions';
import ClearHistoryButton from './ClearHistoryButton';

export const dynamic = 'force-dynamic';

/** Buckets orders by their created_at date (YYYY-MM-DD), newest day first. */
function groupByDay(orders) {
  const groups = new Map();
  for (const order of orders) {
    const day = String(order.created_at).slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(order);
  }
  return [...groups.entries()];
}

function formatDayHeader(day) {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(date, today)) return 'Сегодня';
  if (sameDay(date, yesterday)) return 'Вчера';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function AdminOverview() {
  const restaurant = await currentStaffRestaurant();
  const stats = getTodayStats(restaurant.id);
  const active = listActiveOrders(restaurant.id);
  const history = listRecentOrders(restaurant.id, 200);
  const historyByDay = groupByDay(history);
  const tables = listTables(restaurant.id);
  const menu = getMenu(restaurant.id, { includeUnavailable: true });

  const itemCount = menu.reduce((sum, category) => sum + category.items.length, 0);
  const soldOut = menu.reduce(
    (sum, category) => sum + category.items.filter((item) => !item.available).length,
    0
  );
  const money = (amount) => formatMoney(amount, restaurant);

  return (
    <main className="wrap" style={{ paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, marginBottom: 0 }}>Сегодня</h1>

      <div className="stat-row">
        <div className="card stat">
          <div className="k">Заказы сегодня</div>
          <div className="v">{stats.orders}</div>
        </div>
        <div className="card stat">
          <div className="k">Общая сумма</div>
          <div className="v">{money(stats.revenue)}</div>
        </div>
        <div className="card stat">
          <div className="k">В процессе приготовления</div>
          <div className="v">{active.length}</div>
        </div>
        <div className="card stat">
          <div className="k">Позиции</div>
          <div className="v">
            {itemCount}
            {soldOut > 0 && (
              <span className="tiny muted" style={{ fontWeight: 500 }}>
                {' '}
                · {soldOut} hidden
              </span>
            )}
          </div>
        </div>
      </div>

      {tables.length > 0 && itemCount > 0 && (
        <div className="card" style={{ padding: 18, marginBottom: 22 }}>
          <div className="spread" style={{ flexWrap: 'wrap' }}>
            <div>
              <strong>Готовы протестировать?</strong>
              <div className="tiny muted">
                Откройте меню заказов или сотрудников
              </div>
            </div>
            <div className="row">
              <Link className="btn sm" href={`/m/${restaurant.slug}/${tables[0].code}`}>
                Открыть "{tables[0].label}"
              </Link>
              <Link className="btn ghost sm" href="/admin/qr">
                Расспечатать QR-коды
              </Link>
            </div>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <>
          <h2 style={{ fontSize: 18 }}>Открыть сейчас</h2>
          <div className="card" style={{ overflowX: 'auto', marginBottom: 22 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Стол</th>
                  <th>Позиции</th>
                  <th>Цена</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {active.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.table_label}</td>
                    <td className="muted tiny">
                      {order.items.map((line) => `${line.qty}× ${line.name}`).join(', ')}
                    </td>
                    <td>{money(order.total)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="spread" style={{ alignItems: 'baseline' }}>
        <h2 style={{ fontSize: 18 }}>История заказов</h2>
        {history.length > 0 && <ClearHistoryButton action={clearOrderHistory} />}
      </div>

      {history.length === 0 && (
        <div className="card muted" style={{ padding: 18 }}>
          Нет обслуженных и отменных заказов.
        </div>
      )}

      {historyByDay.map(([day, orders]) => (
        <div key={day} style={{ marginBottom: 22 }}>
          <div className="tiny muted" style={{ margin: '10px 0 6px' }}>
            {formatDayHeader(day)} · {orders.length} order{orders.length === 1 ? '' : 's'}
          </div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Стол</th>
                  <th>Позиции</th>
                  <th>Цена</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.table_label}</td>
                    <td className="muted tiny">
                      {order.items.map((line) => `${line.qty}× ${line.name}`).join(', ')}
                    </td>
                    <td>{money(order.total)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </main>
  );
}
