'use client';
import { useState } from 'react';
import { siteConfig } from '@/lib/config';

export default function ContactClient() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setStatus(''); setError('');
    const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const json = await res.json();
    if (!res.ok) setError(json.error || 'Could not send message');
    else { setStatus('Thank you. Your message has been sent.'); setForm({name:'',email:'',phone:'',message:''}); }
  }
  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <div><label className="label">Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
      <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
      <div><label className="label">Telephone (optional)</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
      <div><label className="label">Message</label><textarea className="input min-h-32" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required /></div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status && <p className="text-sm text-green-800">{status}</p>}
      <button className="btn-primary" type="submit">Send message</button>
    </form>
  );
}