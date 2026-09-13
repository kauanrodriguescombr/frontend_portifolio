import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Se já estiver logado, vai direto pro painel
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Preencha o email e a senha.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Bem-vindo de volta, Kauan!');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Erro ao realizar login.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luz ambiente de fundo no estilo da marca */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Link de volta */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar ao Portfólio
      </Link>

      <div className="w-full max-w-md">
        {/* Card de Login com Glassmorphism */}
        <div className="certification-card p-8 sm:p-10 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Lock size={26} />
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl text-foreground tracking-wide mb-1">
              PAINEL ADMIN
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Acesse com suas credenciais para gerenciar projetos e certificados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kauanrodrigues.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3.5 mt-2 font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-muted-foreground mt-6">
          Portfólio v2 • Painel de Controle Exclusivo
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
