export const metadata = { title: 'FAQ' };

const faqs = [
  ['How do I book a private dining room?', 'Choose a room on the Our Rooms page or go directly to Online Booking. Select your date, number of guests and an available time slot, then complete your details to receive a confirmation and unique booking reference.'],
  ['How is availability determined?', 'Availability is checked in real time against confirmed reservations in our database. Preparation and cleaning intervals are applied automatically to prevent overlapping bookings.'],
  ['Can I modify or cancel my reservation?', 'Yes. Use the My Reservations page with your booking reference, email and secure token from your confirmation email. You can request modifications or cancel according to our cancellation policy.'],
  ['Do you require a deposit?', 'Some rooms may offer an optional deposit. If selected and Stripe is configured, deposits are processed securely. Otherwise the reservation will be recorded with its deposit status clearly indicated.'],
  ['What if I have dietary requirements?', 'Please include dietary requirements or special requests in the booking form. Our team will do their best to accommodate them.'],
];

export default function FAQPage() {
  return (
    <section className="section">
      <div className="container-page max-w-4xl">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Frequently asked questions</h1>

        <div className="mt-10 space-y-4">
          {faqs.map(([q,a]) => (
            <details key={q} className="card p-6 group">
              <summary className="cursor-pointer list-none font-medium text-forest flex items-center justify-between">{q}<span className="text-champagne-700 group-open:rotate-45 transition">+</span></summary>
              <p className="mt-3 text-sm text-forest-700 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        <div id="cancellation" className="card mt-10 p-8 scroll-mt-28">
          <h2 className="font-serif text-3xl text-forest">Cancellation policy</h2>
          <ul className="mt-4 space-y-2 text-sm text-forest-700 list-disc pl-5">
            <li>Cancellations made more than 48 hours before the reservation time: no cancellation fee.</li>
            <li>Cancellations made within 48 hours: any deposit may be retained to cover preparation costs.</li>
            <li>No-shows may be charged according to the room terms. Please contact us as early as possible if your plans change.</li>
            <li>Modification requests are subject to availability and confirmation by the restaurant.</li>
          </ul>
        </div>

        <div id="privacy" className="card mt-6 p-8 scroll-mt-28">
          <h2 className="font-serif text-3xl text-forest">Privacy policy</h2>
          <p className="mt-4 text-sm text-forest-700 leading-relaxed">We collect only the information necessary to manage your reservation (name, contact details, reservation details and special requests). Data is processed securely, used solely for reservation management and customer communication, and retained only as long as necessary for legitimate business and legal purposes. You may request access or deletion of your personal data by contacting us. We follow GDPR-aligned privacy practices.</p>
        </div>

        <div id="terms" className="card mt-6 p-8 scroll-mt-28">
          <h2 className="font-serif text-3xl text-forest">Terms and conditions</h2>
          <ul className="mt-4 space-y-2 text-sm text-forest-700 list-disc pl-5">
            <li>Reservations are subject to availability and confirmation.</li>
            <li>Guest numbers must remain within the room capacity limits.</li>
            <li>Arrival and departure times must respect opening hours and allocated booking windows.</li>
            <li>Special requests are accommodated where possible but cannot be guaranteed.</li>
            <li>The restaurant reserves the right to refuse service in cases of misuse or policy violations.</li>
          </ul>
        </div>

        <div id="cookies" className="card mt-6 p-8 scroll-mt-28">
          <h2 className="font-serif text-3xl text-forest">Cookie consent</h2>
          <p className="mt-4 text-sm text-forest-700 leading-relaxed">This website uses essential cookies and local browser functionality required to operate the booking experience securely. Where non-essential cookies or analytics are introduced, consent will be requested in accordance with applicable regulations.</p>
        </div>
      </div>
    </section>
  );
}