import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Building2, ArrowLeft, Mail, Phone, Lock, CheckCircle2, Info, ArrowRight, Bus } from 'lucide-react';
import { BusCompany } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  registerClient,
  loginClient,
  registerCompany,
  loginCompany,
} from '../../services/api';

interface AuthGatewayProps {
  onClose: () => void;
  existingCompanies?: BusCompany[];
}

export function AuthGateway({ onClose, existingCompanies = [] }: AuthGatewayProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'COMPANY' | null>(null);
  const [clientMode, setClientMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const [companyMode, setCompanyMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [companyForm, setCompanyForm] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    description: '',
    address: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAuthSuccess = (token: string, user: Parameters<typeof login>[1]) => {
    login(token, user);
    if (user.role === 'COMPANY') {
      navigate('/dashboard-compagnie');
    } else {
      navigate('/dashboard-client');
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      if (clientMode === 'REGISTER') {
        if (!clientForm.firstName || !clientForm.lastName || !clientForm.phone || !clientForm.email || !clientForm.password) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires.');
          return;
        }

        const res = await registerClient({
          firstName: clientForm.firstName,
          lastName: clientForm.lastName,
          email: clientForm.email,
          phone: clientForm.phone,
          password: clientForm.password,
        });

        setSuccessMessage('Compte créé avec succès !');
        setTimeout(() => handleAuthSuccess(res.token, res.user), 400);
      } else {
        if (!clientForm.email || !clientForm.password) {
          setErrorMessage('Veuillez renseigner votre email et mot de passe.');
          return;
        }

        const res = await loginClient({
          email: clientForm.email,
          password: clientForm.password,
        });

        handleAuthSuccess(res.token, res.user);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de connexion client.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      if (companyMode === 'REGISTER') {
        if (!companyForm.id || !companyForm.name || !companyForm.phone || !companyForm.email || !companyForm.password) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires pour déclarer la compagnie.');
          return;
        }

        const res = await registerCompany({
          id: companyForm.id.toLowerCase(),
          name: companyForm.name,
          email: companyForm.email,
          phone: companyForm.phone,
          password: companyForm.password,
          description: companyForm.description,
          address: companyForm.address,
        });

        setSuccessMessage('Félicitations, votre compagnie est enregistrée !');
        setTimeout(() => handleAuthSuccess(res.token, res.user), 400);
      } else {
        if (!companyForm.id || !companyForm.password) {
          setErrorMessage('Veuillez entrer votre ID compagnie et mot de passe.');
          return;
        }

        const res = await loginCompany({
          id: companyForm.id.toLowerCase(),
          password: companyForm.password,
        });

        handleAuthSuccess(res.token, res.user);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de connexion compagnie.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100/50"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-green" />

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {selectedRole === null ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex p-3 bg-brand-red/10 text-brand-red rounded-full mb-2">
                    <Bus className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-gray-900">Bienvenue sur FasoBus</h2>
                  <p className="text-gray-500 font-medium max-w-md mx-auto">
                    Sélectionnez votre profil d&apos;authentification
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setSelectedRole('CLIENT');
                      setClientMode('LOGIN');
                    }}
                    className="p-8 bg-gray-50 hover:bg-white text-left rounded-3xl border border-gray-100 hover:border-brand-red shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-[230px]"
                  >
                    <div className="bg-brand-red/10 text-brand-red p-4 rounded-2xl w-14 h-14 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">ESPACE CLIENT</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-2">Rechercher, réserver, gérer vos billets.</p>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setSelectedRole('COMPANY');
                      setCompanyMode('LOGIN');
                    }}
                    className="p-8 bg-gray-50 hover:bg-white text-left rounded-3xl border border-gray-100 hover:border-brand-green shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-[230px]"
                  >
                    <div className="bg-brand-green/10 text-brand-green p-4 rounded-2xl w-14 h-14 flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">ESPACE COMPAGNIES</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-2">Gérer flottes et réservations.</p>
                    </div>
                  </motion.button>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 py-2 px-6 bg-gray-100 rounded-full"
                  >
                    Continuer en tant que visiteur
                  </button>
                </div>
              </motion.div>
            ) : selectedRole === 'CLIENT' ? (
              <motion.div key="client-form" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <span className="text-[10px] font-black text-brand-red bg-brand-red/10 px-3 py-1 rounded-full uppercase">Voyageur</span>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-display font-bold">{clientMode === 'LOGIN' ? 'Connexion Voyageur' : 'Créer un compte Client'}</h3>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl flex gap-3 text-sm text-brand-red font-semibold">
                    <Info className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex gap-3 text-sm text-brand-green font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleClientSubmit} className="space-y-6">
                  {clientMode === 'REGISTER' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" required placeholder="Prénom" value={clientForm.firstName} onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                      <input type="text" required placeholder="Nom" value={clientForm.lastName} onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" required placeholder="Email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                  </div>
                  {clientMode === 'REGISTER' && (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" required placeholder="Téléphone" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                    </div>
                  )}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" required placeholder="Mot de passe" value={clientForm.password} onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })} className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-red disabled:opacity-50 flex items-center justify-center gap-2">
                    <span>{submitting ? 'Chargement…' : clientMode === 'LOGIN' ? 'Se connecter' : 'Créer mon compte'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                  {clientMode === 'LOGIN' ? 'Nouveau ?' : 'Déjà inscrit ?'}
                  <button type="button" onClick={() => setClientMode(clientMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="ml-1 text-brand-red font-extrabold hover:underline">
                    {clientMode === 'LOGIN' ? 'Créer un compte' : 'Se connecter'}
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="company-form" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <span className="text-[10px] font-black text-brand-green bg-brand-green/10 px-3 py-1 rounded-full uppercase">Compagnie</span>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-display font-bold">{companyMode === 'LOGIN' ? 'Connexion Partenaire' : 'Déclarer ma Compagnie'}</h3>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl flex gap-3 text-sm text-brand-red font-semibold">
                    <Info className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex gap-3 text-sm text-brand-green font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" required placeholder="ID compagnie (ex: tsr)" value={companyForm.id} onChange={(e) => setCompanyForm({ ...companyForm, id: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm uppercase" />
                    {companyMode === 'REGISTER' ? (
                      <input type="text" required placeholder="Nom compagnie" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                    ) : (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="password" required placeholder="Mot de passe" value={companyForm.password} onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })} className="w-full pl-11 pr-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                      </div>
                    )}
                  </div>
                  {companyMode === 'REGISTER' && (
                    <>
                      <input type="email" required placeholder="Email pro" value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                      <input type="tel" required placeholder="Téléphone" value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                      <input type="password" required placeholder="Mot de passe" value={companyForm.password} onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-sm" />
                    </>
                  )}
                  <button type="submit" disabled={submitting} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-brand-green disabled:opacity-50 flex items-center justify-center gap-2">
                    <span>{submitting ? 'Chargement…' : companyMode === 'LOGIN' ? 'Se connecter' : 'Soumettre'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                  <button type="button" onClick={() => setCompanyMode(companyMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="text-brand-green font-extrabold hover:underline">
                    {companyMode === 'LOGIN' ? 'Enregistrer ma compagnie' : 'Accéder à la connexion'}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
