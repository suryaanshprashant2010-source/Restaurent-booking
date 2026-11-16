import { siteConfig } from '@/lib/config';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container-page max-w-4xl">
        <p className="eyebrow">About Us</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">A tradition of intimate hospitality</h1>
        <div className="mt-8 space-y-5 text-forest-700 leading-relaxed">
          <p>{siteConfig.name} was founded with a simple belief: the most memorable meals are shared in spaces that feel both private and welcoming. Nestled in the heart of Paris, our restaurant brings together seasonal French cuisine, thoughtful service and beautifully designed private dining rooms.</p>
          <p>Over the years, we have hosted family celebrations, business gatherings, weddings and quiet moments worth savouring. Each room is curated with its own character - from intimate salons to luminous galleries - so every occasion finds its perfect setting.</p>
          <p>Our culinary team works closely with guests to craft menus that honour local producers and dietary preferences, while our service team ensures every detail is handled with care. Whether you are planning an elegant dinner for four or a celebration for thirty, we look forward to welcoming you.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[['Seasonal Cuisine','Menus inspired by the finest local ingredients.'],['Private Spaces','Distinct rooms designed for comfort and elegance.'],['Dedicated Service','A team committed to every detail of your occasion.']].map(([t,d]) => (
            <div key={t} className="card p-6"><h2 className="font-serif text-2xl text-forest">{t}</h2><p className="mt-2 text-sm text-forest-700">{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}