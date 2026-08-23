import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';
import { useRoute } from '../../hooks/useRoute';

export function LoginPage(): React.JSX.Element {
  const { login } = useAuth();
  const { navigate } = useRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Clinical workspace
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Sign in to continue to your workspace
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
        {/* Email */}
        <div className="space-y-2">
          <label
            className="block text-xs font-medium uppercase tracking-wider text-slate-400"
            htmlFor="login-email"
          >
            Email
          </label>
          <div className="group relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-brand-400" />
            <input
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand-500/20"
              id="login-email"
              placeholder="doctor@clinic.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              className="block text-xs font-medium uppercase tracking-wider text-slate-400"
              htmlFor="login-password"
            >
              Password
            </label>
          </div>
          <div className="group relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-brand-400" />
            <input
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand-500/20"
              id="login-password"
              placeholder="••••••••"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error !== null && (
          <div
            className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200"
            role="alert"
          >
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          className="group mt-2 w-full gap-2"
          loading={isLoading}
          size="lg"
          type="submit"
          variant="primary"
        >
          Sign in
          {!isLoading && (
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          )}
        </Button>
      </form>

      {/* Footer link */}
      <div className="mt-8 border-t border-white/5 pt-6 text-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <button
            className="font-medium text-brand-400 transition hover:text-brand-300"
            type="button"
            onClick={() => navigate('/register')}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}