import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-forest text-ivory">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl">{siteConfig.name}</h3>
          <p className="mt-3 max-w-md text-sm text-ivory/80">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-ivory/80">{siteConfig.address}</p>
          <p className="text-sm text-ivory/80">{siteConfig.phone} · {siteConfig.email}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-champagne-300">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-ivory/80">
            <li><Link href="/rooms" className="hover:text-white">Our Rooms</Link></li>
            <li><Link href="/booking" className="hover:text-white">Online Booking</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-champagne-300">Policies</h4>
          <ul className="mt-3 space-y-2 text-sm text-ivory/80">
            <li><Link href="/faq#cancellation" className="hover:text-white">Cancellation Policy</Link></li>
            <li><Link href="/faq#privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/faq#terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><span className="text-ivory/70">Cookies: essential cookies used for bookings</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-ivory/60">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
    </footer>
  );
}