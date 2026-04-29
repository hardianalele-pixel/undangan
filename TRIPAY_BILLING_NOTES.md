# Tripay Billing Notes

Fitur billing memakai closed payment Tripay.

## Flow
1. Setiap tenant mendapatkan `free_invitation_limit = 1`.
2. Saat tenant membuat undangan baru, server menghitung: `free_invitation_limit + paid_invitation_credits - used`.
3. Jika kuota habis, API create invitation mengembalikan HTTP 402 dengan kode `PAYMENT_REQUIRED`.
4. Halaman `/billing` membuat transaksi Tripay via `/api/billing/checkout`.
5. Callback Tripay `/api/billing/tripay/callback` memvalidasi `X-Callback-Signature` dengan HMAC SHA-256 dari raw body dan private key.
6. Jika status `PAID`, tenant mendapat tambahan kredit undangan.

## Environment
Lihat `.env.example` untuk credential Tripay.

## Catatan produksi
- Pastikan URL publik aplikasi bisa diakses Tripay untuk callback.
- Atur channel pembayaran aktif di dashboard Tripay.
- Gunakan `TRIPAY_MODE=production` untuk transaksi live.
