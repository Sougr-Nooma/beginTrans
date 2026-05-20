/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode } from 'react';
import { Bus, User, Menu, X, ShieldCheck, Search, Bookmark, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NavbarProps {
  currentUser?: { name: string; email: string; phone?: string; role: 'CLIENT' | 'COMPANY' | 'ADMIN'; companyId?: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export function Navbar({ currentUser, onLogout, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigateTo = (view: string) => {
    window.dispatchEvent(new CustomEvent('change-view', { detail: view }));
    setIsOpen(false);
  };

  const isClient = currentUser?.role === 'CLIENT';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('SEARCH')}>
            <div className="bg-brand-red p-2 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              Faso<span className="text-brand-green">Bus</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('SEARCH')} className="text-sm font-semibold text-gray-600 hover:text-brand-red transition-colors">Rechercher</button>
            <button onClick={() => navigateTo('COMPANIES')} className="text-sm font-semibold text-gray-600 hover:text-brand-red transition-colors">Compagnies</button>
            <button onClick={() => navigateTo('MY_BOOKINGS')} className="text-sm font-semibold text-gray-600 hover:text-brand-red transition-colors">Mes Réservations</button>
            {!isClient && (
              <button onClick={() => navigateTo('ADMIN')} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3.5 py-1.5 rounded-full border border-dashed border-gray-200">
                <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
                {currentUser?.role === 'COMPANY' ? 'Dashboard Pro' : 'Admin'}
              </button>
            )}
            <button onClick={() => navigateTo('SUPPORT')} className="text-sm font-semibold text-gray-600 hover:text-brand-red transition-colors">Aide</button>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-black text-gray-950 max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {currentUser.role === 'CLIENT' ? 'Voyageur' : currentUser.role === 'COMPANY' ? 'Partenaire' : 'Admin'}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-brand-red hover:bg-brand-red/5 hover:text-brand-red rounded-full transition-colors border border-brand-red/10 uppercase tracking-wider"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-full transition-colors border border-gray-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Se connecter</span>
              </button>
            )}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <MobileNavLink onClick={() => navigateTo('SEARCH')} icon={<Search className="w-5 h-5"/>} label="Rechercher" />
              <MobileNavLink onClick={() => navigateTo('COMPANIES')} icon={<Bus className="w-5 h-5"/>} label="Compagnies" />
              <MobileNavLink onClick={() => navigateTo('MY_BOOKINGS')} icon={<Bookmark className="w-5 h-5"/>} label="Mes Réservations" />
              {!isClient && (
                <MobileNavLink onClick={() => navigateTo('ADMIN')} icon={<ShieldCheck className="w-5 h-5"/>} label="Administration / Gérer" highlight />
              )}
              <MobileNavLink onClick={() => navigateTo('SUPPORT')} icon={<HelpCircle className="w-5 h-5"/>} label="Aide & Support" />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{currentUser.role === 'CLIENT' ? 'Voyageur' : 'Partenaire'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full py-4 bg-red-50 text-brand-red font-bold rounded-2xl flex items-center justify-center gap-2 text-sm border border-red-100"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>Espace Voyageur</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MobileNavLink({ icon, label, onClick, highlight = false }: { icon: ReactNode, label: string, onClick: () => void, highlight?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${highlight ? 'bg-brand-red/5 text-brand-red' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <div className={highlight ? 'text-brand-red' : 'text-gray-400'}>{icon}</div>
      <span className="font-bold">{label}</span>
    </button>
  );
}
