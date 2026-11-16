import { Resend } from 'resend';
import { siteConfig } from '@/lib/config';

export async function sendConfirmationEmail(params: {
  to: string; name: string; reference: string; roomName: string; date: string; startTime: string; endTime: string; guests: number; totalCents: number; manageToken: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;
  const resend = new Resend(apiKey);
  const manageUrl = `${siteConfig.url}/my-reservations?reference=${encodeURIComponent(params.reference)}&email=${encodeURIComponent(params.to)}&token=${encodeURIComponent(params.manageToken)}`;
  const total = (params.totalCents / 100).toFixed(2);
  await resend.emails.send({
    from,
    to: params.to,
    subject: `Your reservation is confirmed - ${params.reference}`,
    html: `<div style="font-family:Georgia,serif;color:#1F3D2B">
      <h2>Reservation Confirmation</h2>
      <p>Dear ${params.name},</p>
      <p>Thank you for choosing ${siteConfig.name}. Your private room reservation has been received.</p>
      <ul>
        <li><strong>Reference:</strong> ${params.reference}</li>
        <li><strong>Room:</strong> ${params.roomName}</li>
        <li><strong>Date:</strong> ${params.date}</li>
        <li><strong>Time:</strong> ${params.startTime} - ${params.endTime}</li>
        <li><strong>Guests:</strong> ${params.guests}</li>
        <li><strong>Total:</strong> EUR ${total}</li>
      </ul>
      <p>Manage your reservation: <a href="${manageUrl}">View / manage reservation</a></p>
      <p>We look forward to welcoming you.<br/>${siteConfig.name}</p>
    </div>`
  });
}