import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Lock, UserPlus } from 'lucide-react';
import { authAPI, setAuthState } from '../utils/api';

export function Login() {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result: any;
            if (mode === 'register') {
                result = await authAPI.register(email, password, name);
            } else {
                result = await authAPI.login(email, password);
            }
            setAuthState(result.token, result.user);
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-lathe-surface flex items-center justify-center p-4 font-sans text-lathe-ink">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-lathe-ink text-lathe-surface rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{APP_CONFIG.companyName}</h1>
                    <p className="text-lathe-ink/60 mt-2">
                        {mode === 'login' ? 'Masuk ke dashboard agensi' : 'Buat akun agensi baru'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="lathe-border p-6 bg-white space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Agensi</label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama Anda atau Agensi"
                                required
                                className="w-full"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@contoh.com"
                            required
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Kata Sandi</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan kata sandi"
                            required
                            className="w-full"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full lathe-signal border-lathe-ink text-lathe-ink hover:bg-lathe-yellow/90"
                    >
                        {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
                    </Button>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                            className="text-sm text-lathe-ink/60 hover:text-lathe-ink underline"
                        >
                            {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
