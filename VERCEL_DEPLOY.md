# Cara deploy ke Vercel

1. Extract ZIP ini.
2. Upload semua isi folder ke GitHub.
3. Import repository di Vercel.
4. Pakai setting:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
5. Tambahkan Environment Variables:

```env
JWT_SECRET=isi_random_panjang
NODE_ENV=production
```

Untuk Tripay:

```env
TRIPAY_API_KEY=xxx
TRIPAY_PRIVATE_KEY=xxx
TRIPAY_MERCHANT_CODE=xxx
TRIPAY_CALLBACK_URL=https://DOMAIN-VERCEL-KAMU.vercel.app/api/billing/tripay/callback
```

Catatan: patch ini membuat Express API jalan di Vercel lewat api/index.ts dan vercel.json. SQLite memakai /tmp di Vercel, jadi data bisa hilang saat cold start/redeploy. Untuk production sungguhan, pindahkan database ke Supabase/Neon/Postgres.
