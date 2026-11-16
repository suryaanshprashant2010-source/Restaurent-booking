import { differenceInMinutes, format, parse } from 'date-fns';
import crypto from 'crypto';

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number): string {
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return ${hh}:;
}

export function generateReference(): string {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return MV--;
}

export function generateManageToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function calculateTotalCents(base: number, perGuest: number, guests: number): number {
  return base + perGuest * guests;
}

export function isWithinOpeningHours(start: string, end: string, opening: string, closing: string): boolean {
  return timeToMinutes(start) >= timeToMinutes(opening) && timeToMinutes(end) <= timeToMinutes(closing) && timeToMinutes(end) > timeToMinutes(start);
}

export function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function buildSlots(opening: string, closing: string, step: number): string[] {
  const slots: string[] = [];
  for (let m = timeToMinutes(opening); m <= timeToMinutes(closing) - step; m += step) {
    slots.push(minutesToTime(m));
  }
  return slots;
}
