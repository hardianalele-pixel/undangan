import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CreditCard, Crown, Layers3, Sparkles, UsersRound } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const features = [
  ['Builder premium', 'Susun hero, cerita, galeri, RSVP, gift, QR check-in, dan guestbook dari satu dashboard.'],
  ['Multitenant', 'Setiap agensi/workspace punya data undangan, tamu, dan pembayaran sendiri.'],
  ['1 undangan gratis', 'Coba penuh untuk undangan pertama. Undangan berikutnya bisa dibuka lewat Tripay.'],
];

export function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0f1218] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,229,0,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(0,71,171,0.30),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)]" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lathe-yellow text-lathe-ink shadow-lg shadow-yellow-500/20"><Sparkles className="h-5 w-5" /></span>
          <span>{APP_CONFIG.companyName}</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">Masuk</Link>
          <Link to="/login?mode=register" className="rounded-full bg-lathe-yellow px-4 py-2 font-bold text-lathe-ink hover:brightness-95">Mulai gratis</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur">
            <Crown className="h-4 w-4 text-lathe-yellow" /> Platform undangan digital agensi
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Landing elegan, undangan interaktif, pembayaran otomatis.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Bangun undangan premium untuk banyak klien dari satu sistem. Undangan pertama gratis, berikutnya aktif setelah pembayaran Tripay berhasil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login?mode=register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lathe-yellow px-6 py-4 font-black text-lathe-ink shadow-2xl shadow-yellow-500/20">
              Buat undangan gratis <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur hover:bg-white/15">
              Masuk dashboard
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {features.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <CheckCircle2 className="mb-4 h-5 w-5 text-lathe-yellow" />
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-lathe-yellow/20 blur-3xl" />
          <div className="relative rounded-[2.5rem] border border-white/14 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[2rem] bg-[#f8f4ec] p-5 text-lathe-ink shadow-2xl">
              <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-lathe-ink/40">Live campaign</p>
                  <h2 className="mt-1 font-serif text-3xl italic">Ayla & Raka</h2>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Published</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Stat icon={UsersRound} label="Tamu" value="428" />
                <Stat icon={CreditCard} label="Tripay" value="Paid" />
                <Stat icon={Layers3} label="Tenant" value="Agency A" />
                <Stat icon={Sparkles} label="Kuota" value="1 gratis" />
              </div>
              <div className="mt-4 overflow-hidden rounded-3xl bg-lathe-ink text-white">
                <div className="h-64 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900')] bg-cover bg-center p-6 flex flex-col justify-end">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">The Wedding Of</p>
                  <h3 className="font-serif text-5xl italic">Ayla & Raka</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return <div className="rounded-3xl bg-white p-4 shadow-sm"><Icon className="mb-4 h-5 w-5 text-lathe-secondary" /><p className="text-xs font-bold uppercase tracking-widest text-lathe-ink/40">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>;
}
