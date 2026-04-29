import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Plus, ShieldCheck } from 'lucide-react';
import { billingAPI } from '../utils/api';

export function Billing() {
  const [usage, setUsage] = useState<any>(null);
  const [method, setMethod] = useState('QRIS2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { billingAPI.usage().then(setUsage).catch((e) => setError(e.message)); }, []);

  const checkout = async () => {
    setLoading(true); setError('');
    try {
      const res: any = await billingAPI.checkout({ method, credits: 1 });
      const url = res.payment?.checkout_url || res.payment?.pay_url || res.payment?.payment_url;
      if (url) window.location.href = url;
      else setUsage(await billingAPI.usage());
    } catch (e: any) { setError(e.message || 'Gagal membuat pembayaran'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-lathe-surface p-6 text-lathe-ink">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-lathe-ink/60 hover:text-lathe-ink"><ArrowLeft className="h-4 w-4" /> Kembali ke dashboard</Link>
        <section className="overflow-hidden rounded-[2rem] border border-lathe-ink/10 bg-white shadow-xl">
          <div className="bg-lathe-ink p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-lathe-yellow">Billing</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Tambah kuota undangan</h1>
            <p className="mt-3 max-w-2xl text-white/65">Setiap tenant mendapat 1 undangan gratis. Tambahan undangan akan aktif otomatis setelah callback Tripay berstatus PAID.</p>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-3xl bg-lathe-surface p-6">
              <h2 className="text-xl font-black">Pemakaian saat ini</h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Metric label="Terpakai" value={usage ? usage.used : '...'} />
                <Metric label="Sisa kuota" value={usage ? usage.remaining : '...'} />
                <Metric label="Gratis" value={usage ? usage.free_limit : '...'} />
                <Metric label="Kredit berbayar" value={usage ? usage.paid_credits : '...'} />
              </div>
              {usage?.pending_payment && (
                <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  Ada pembayaran tertunda senilai Rp{Number(usage.pending_payment.amount).toLocaleString('id-ID')}.
                  {usage.pending_payment.payment_url && <a className="ml-1 font-bold underline" href={usage.pending_payment.payment_url}>Lanjut bayar</a>}
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-lathe-ink/10 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lathe-yellow"><CreditCard className="h-6 w-6" /></div>
              <h2 className="text-xl font-black">Beli 1 undangan</h2>
              <p className="mt-2 text-sm leading-6 text-lathe-ink/60">Harga per undangan: <b>Rp{Number(usage?.invite_price || 49000).toLocaleString('id-ID')}</b></p>
              <label className="mt-5 block text-sm font-bold">Metode Tripay</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-2 w-full rounded-2xl border border-lathe-ink/15 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lathe-yellow/30">
                <option value="QRIS2">QRIS</option>
                <option value="BRIVA">BRI VA</option>
                <option value="BNIVA">BNI VA</option>
                <option value="MANDIRIVA">Mandiri VA</option>
                <option value="PERMATAVA">Permata VA</option>
                <option value="DANA">DANA</option>
                <option value="SHOPEEPAY">ShopeePay</option>
              </select>
              {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button onClick={checkout} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lathe-ink px-5 py-4 font-black text-white disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />} Bayar via Tripay
              </button>
              <p className="mt-4 flex items-center gap-2 text-xs text-lathe-ink/50"><ShieldCheck className="h-4 w-4" /> Signature dan callback divalidasi di server.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-lathe-ink/40">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}
