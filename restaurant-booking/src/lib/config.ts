export const siteConfig = {
  name: process.env.RESTAURANT_NAME || 'Maison Verte',
  description: 'Refined private dining rooms for celebrations, business dinners and intimate gatherings.',
  email: process.env.RESTAURANT_EMAIL || 'reservations@maisonverte.example',
  phone: process.env.RESTAURANT_PHONE || '+33 1 23 45 67 89',
  address: process.env.RESTAURANT_ADDRESS || '12 Rue des Jardins, 75008 Paris, France',
  openingHour: process.env.OPENING_HOUR || '12:00',
  closingHour: process.env.CLOSING_HOUR || '23:00',
  slotMinutes: Number(process.env.SLOT_MINUTES || 30),
  mapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps?q=Paris&output=embed',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};
