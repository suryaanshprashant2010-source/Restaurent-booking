export const metadata = { title: 'Gallery' };

const images = [
  { title: 'Forest Chamber', caption: 'Signature private dining with garden views' },
  { title: 'The Ivy Salon', caption: 'Intimate setting for refined gatherings' },
  { title: 'Champagne Gallery', caption: 'Luminous space for celebrations' },
  { title: 'Seasonal Cuisine', caption: 'Artfully presented dishes' },
  { title: 'Table Details', caption: 'Handcrafted tableware and florals' },
  { title: 'Evening Ambience', caption: 'Warm lighting for memorable evenings' },
];

export default function GalleryPage() {
  return (
    <section className="section">
      <div className="container-page">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Restaurant and room photography</h1>
        <p className="mt-4 max-w-2xl text-forest-700">A glimpse into our private dining rooms, cuisine and atmosphere.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <figure key={img.title} className="card overflow-hidden">
              <div className={`bg-gradient-to-br ${i%3===0?'from-forest-300 to-champagne-200':i%3===1?'from-champagne-200 to-ivory-300':'from-ivory-300 to-forest-200'} h-64`} aria-label={img.title} />
              <figcaption className="p-5">
                <div className="font-serif text-xl text-forest">{img.title}</div>
                <div className="mt-1 text-sm text-forest-700">{img.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}