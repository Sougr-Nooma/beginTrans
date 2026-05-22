/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Info,
  ArrowRight,
  Bus,
} from 'lucide-react';
import { BusCompany } from '../../types';

interface AuthGatewayDoubleProps {
  onLogin: (user: {
    name: string;
    email: string;
    phone?: string;
    role: 'CLIENT' | 'COMPANY' | 'ADMIN';
    companyId?: string;
  }) => void;
  onClose: () => void;
  existingCompanies: BusCompany[];
  onAddCompany: (company: BusCompany) => void;
}

export function AuthGatewayDouble({
  onLogin,
  onClose,
  existingCompanies,
  onAddCompany,
}: AuthGatewayDoubleProps) {
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

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (clientMode === 'REGISTER') {
      if (!clientForm.firstName || !clientForm.lastName || !clientForm.phone || !clientForm.email || !clientForm.password) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setSuccessMessage('Compte créé avec succès ! Authentification en cours...');
      setTimeout(() => {
        onLogin({
          name: `${clientForm.firstName} ${clientForm.lastName}`,
          email: clientForm.email,
          phone: clientForm.phone,
          role: 'CLIENT',
        });
      }, 600);
    } else {
      if (!clientForm.email || !clientForm.password) {
        setErrorMessage('Veuillez renseigner votre email et mot de passe.');
        return;
      }
      onLogin({
        name: clientForm.email.split('@')[0],
        email: clientForm.email,
        role: 'CLIENT',
      });
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (companyMode === 'REGISTER') {
      if (!companyForm.id || !companyForm.name || !companyForm.phone || !companyForm.email || !companyForm.password) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires pour déclarer la compagnie.');
        return;
      }

      const idExists = existingCompanies.some((c) => c.id.toLowerCase() === companyForm.id.toLowerCase());
      if (idExists) {
        setErrorMessage(`Identifiant de compagnie "${companyForm.id}" déjà utilisé par un autre partenaire.`);
        return;
      }

      const newCompany: BusCompany = {
        id: companyForm.id.toLowerCase(),
        name: companyForm.name,
        logo:
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=200',
        rating: 4.5,
        description: companyForm.description || 'Compagnie partenaire de FasoBus. Services de qualité.',
        phone: companyForm.phone,
        email: companyForm.email,
        address: companyForm.address || 'Ouagadougou, Burkina Faso',
      };

      onAddCompany(newCompany);
      setSuccessMessage('Félicitations, votre compagnie est maintenant enregistrée !');

      setTimeout(() => {
        onLogin({
          name: companyForm.name,
          email: companyForm.email,
          phone: companyForm.phone,
          role: 'COMPANY',
          companyId: companyForm.id.toLowerCase(),
        });
      }, 800);
    } else {
      if (!companyForm.id || !companyForm.password) {
        setErrorMessage('Veuillez entrer votre ID compagnie et mot de passe.');
        return;
      }

      const found = existingCompanies.find((c) => c.id.toLowerCase() === companyForm.id.toLowerCase());
      if (!found) {
        setErrorMessage(`Aucune compagnie trouvée avec l'ID "${companyForm.id}".`);
        return;
      }

      onLogin({
        name: found.name,
        email: found.email || 'contact@compagnie.bf',
        phone: found.phone || '',
        role: 'COMPANY',
        companyId: found.id,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
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
                  <p className="text-gray-500 font-medium max-w-md mx-auto">Sélectionnez votre profil pour commencer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <motion.button
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setSelectedRole('CLIENT');
                      setClientMode('LOGIN');
                    }}
                    className="p-8 bg-gray-50 hover:bg-white text-left rounded-3xl border border-gray-100 hover:border-brand-red shadow-sm hover:shadow-xl hover:shadow-brand-red/5 transition-all group flex flex-col justify-between h-[230px]"
                  >
                    <div className="bg-brand-red/10 text-brand-red p-4 rounded-2xl group-hover:bg-brand-red group-hover:text-white transition-colors w-14 h-14 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">ESPACE CLIENT</h3>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        Pour rechercher des bus, acheter vos billets et gérer votre historique.
                      </p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setSelectedRole('COMPANY');
                      setCompanyMode('LOGIN');
                    }}
                    className="p-8 bg-gray-50 hover:bg-white text-left rounded-3xl border border-gray-100 hover:border-brand-green shadow-sm hover:shadow-xl hover:shadow-brand-green/5 transition-all group flex flex-col justify-between h-[230px]"
                  >
                    <div className="bg-brand-green/10 text-brand-green p-4 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-colors w-14 h-14 flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">ESPACE COMPAGNIES</h3>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        Pour gérer vos flottes, ajouter des programmations et suivre vos réservations.
                      </p>
                    </div>
                  </motion.button>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors py-2 px-6 bg-gray-100 rounded-full"
                  >
                    Continuer en tant que visiteur
                  </button>
                </div>
              </motion.div>
            ) : selectedRole === 'CLIENT' ? (
              <motion.div
                key="client-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-950 uppercase tracking-wider transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <span className="text-[10px] font-black text-brand-red bg-brand-red/10 px-3 py-1 rounded-full uppercase tracking-wider">Voyageur</span>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                    {clientMode === 'LOGIN' ? 'Connexion Voyageur' : 'Créer un compte Client'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {clientMode === 'LOGIN' ? 'Prêt à voyager ? Connectez-vous' : 'Inscrivez-vous pour conserver l’accès à vos billets'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl flex items-center gap-3 text-sm text-brand-red font-semibold">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center gap-3 text-sm text-brand-green font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleClientSubmit} className="space-y-6">
                  {clientMode === 'REGISTER' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                        <input
                          type="text"
                          required
                          value={clientForm.firstName}
                          onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                          placeholder="Ex: Ahmed"
                          className="w-full px-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-red/20 outline-none rounded-2xl font-bold text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                        <input
                          type="text"
                          required
                          value={clientForm.lastName}
                          onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                          placeholder="Ex: Sawadogo"
                          className="w-full px-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-red/20 outline-none rounded-2xl font-bold text-sm transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        placeholder="Ex: ahmed@domaine.bf"
                        className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-red/20 outline-none rounded-2xl font-bold text-sm transition-all"
                      />
                    </div>
                  </div>

                  {clientMode === 'REGISTER' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone Mobile Money</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={clientForm.phone}
                          onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                          placeholder="Ex: +226 70 00 00 00"
                          className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-red/20 outline-none rounded-2xl font-bold text-sm transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={clientForm.password}
                        onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-red/20 outline-none rounded-2xl font-bold text-sm transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-brand-red transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>{clientMode === 'LOGIN' ? 'Se connecter' : 'Créer mon compte'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-500">
                    {clientMode === 'LOGIN' ? 'Nouveau sur FasoBus ?' : 'Vous avez déjà un compte ?'}
                    <button
                      onClick={() => setClientMode(clientMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                      className="ml-1 text-brand-red font-extrabold hover:underline"
                    >
                      {clientMode === 'LOGIN' ? 'Créer un compte client' : 'Se connecter'}
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="company-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-950 uppercase tracking-wider transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <span className="text-[10px] font-black text-brand-green bg-brand-green/10 px-3 py-1 rounded-full uppercase tracking-wider">Compagnie</span>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                    {companyMode === 'LOGIN' ? 'Connexion Partenaire' : 'Déclarer ma Compagnie'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {companyMode === 'LOGIN'
                      ? 'Accédez aux outils d’administration de votre compagnie.'
                      : 'Rejoignez FasoBus pour booster vos réservations.'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl flex items-center gap-3 text-sm text-brand-red font-semibold">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center gap-3 text-sm text-brand-green font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID Unique Compagnie</label>
                        <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded uppercase">Requis</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={companyForm.id}
                        onChange={(e) => setCompanyForm({ ...companyForm, id: e.target.value })}
                        placeholder="Ex: tsr, elitis"
                        className="w-full px-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all uppercase"
                      />
                    </div>

                    {companyMode === 'REGISTER' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nom de la Compagnie</label>
                        <input
                          type="text"
                          required
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          placeholder="Ex: TSR Transport"
                          className="w-full px-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe partenaire</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            required
                            value={companyForm.password}
                            onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {companyMode === 'REGISTER' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Téléphonique</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={companyForm.phone}
                              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                              placeholder="Ex: +226 25 30 00 00"
                              className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse Email Professionnelle</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={companyForm.email}
                              onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                              placeholder="Ex: dircorporate@compagnie.bf"
                              className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Brève description (facultatif)</label>
                        <textarea
                          value={companyForm.description}
                          onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                          placeholder="Ex: TSR, leader du transport au Burkina..."
                          rows={2}
                          className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse physique / Siège social</label>
                          <input
                            type="text"
                            value={companyForm.address}
                            onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                            placeholder="Ex: Secteur 15, Ouagadougou"
                            className="w-full px-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Définir un mot de passe</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="password"
                              required
                              value={companyForm.password}
                              onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                              placeholder="••••••••"
                              className="w-full pl-11 pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-transparent focus:border-brand-green/20 outline-none rounded-2xl font-bold text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-brand-green transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>{companyMode === 'LOGIN' ? 'Se connecter' : 'Soumettre la création'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-500">
                    {companyMode === 'LOGIN' ? 'Votre compagnie n’est pas encore partenaire ?' : 'Vous avez déjà un compte ?'}
                    <button
                      onClick={() => setCompanyMode(companyMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                      className="ml-1 text-brand-green font-extrabold hover:underline"
                    >
                      {companyMode === 'LOGIN' ? 'Enregistrer ma compagnie' : 'Accéder à la connexion'}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

