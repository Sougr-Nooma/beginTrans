import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin } from '../../services/api';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      if (!email || !password) {
        setErrorMessage('Email et mot de passe requis.');
        return;
      }

      const res = await loginAdmin({ email, password });
      login(res.token, res.user);
      navigate('/admin-dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de connexion admin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100/50"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-green" />

        <div className="p-8 md:p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-3 bg-brand-red/10 text-brand-red rounded-full mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-display font-black text-gray-900">Administration</h2>
            <p className="text-gray-500 font-medium text-sm">Accès réservé aux administrateurs FasoBus</p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl flex gap-3 text-sm text-brand-red font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                 type="email"
                required
                placeholder="Email administrateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Connexion…' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
