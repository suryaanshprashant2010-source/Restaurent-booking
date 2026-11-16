'use client';
import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/lib/config';

const links = [
  { href: '/rooms', label: 'Our Rooms' },
  { href: '/booking', label: 'Book Online' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/my-reservations', label: 'My Reservations' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-forest/10 bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-wide text-forest">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-forest-700 transition hover:text-champagne-700">
              {l.label}
            </Link>
          ))}
          <Link href="/booking" className="btn-primary">Reserve a Room</Link>
        </nav>
        <button className="lg:hidden rounded-md border border-forest/20 px-3 py-2 text-sm" onClick={() => setOpen(v=>!v)} aria-label="Toggle menu">Menu</button>
      </div>
      {open && (
        <div className="border-t border-forest/10 bg-ivory lg:hidden">
          <div className="container-page flex flex-col py-4">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="py-2 text-forest-700" onClick={()=>setOpen(false)}>{l.label}</Link>
            ))}
            <Link href="/booking" className="btn-primary mt-2" onClick={()=>setOpen(false)}>Reserve a Room</Link>
          </div>
        </div>
      )}
    </header>
  );
}