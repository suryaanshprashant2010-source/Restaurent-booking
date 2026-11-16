import { siteConfig } from '@/lib/config';
import ContactClient from '@/components/ContactClient';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-page">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Get in touch</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-2xl">Restaurant details</h2>
              <p className="mt-3 text-forest-700"><strong>Address:</strong> {siteConfig.address}</p>
              <p className="mt-2 text-forest-700"><strong>Telephone:</strong> {siteConfig.phone}</p>
              <p className="mt-2 text-forest-700"><strong>Email:</strong> {siteConfig.email}</p>
              <p className="mt-2 text-forest-700"><strong>Opening hours:</strong> {siteConfig.openingHour} - {siteConfig.closingHour}</p>
            </div>
            <ContactClient />
          </div>
          <div className="card overflow-hidden min-h-[420px]">
            <iframe title="Google Maps" src={siteConfig.mapsEmbedUrl} className="h-full min-h-[420px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}