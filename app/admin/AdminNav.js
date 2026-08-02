'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/admin', 'Обзор'],
  ['/admin/menu', 'Меню'],
  ['/admin/tables', 'Столы'],
  ['/admin/qr', 'QR-коды'],
  ['/admin/settings', 'Настройки'],
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
          {label}
        </Link>
      ))}
    </>
  );
}
