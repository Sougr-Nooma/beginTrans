/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ amount, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'done'>('method');
  const [method, setMethod] = useState<'ORANGE' | 'MOOV' | 'CARD' | null>(null);

  const handlePay = (m: 'ORANGE' | 'MOOV' | 'CARD') => {
    setMethod(m);
    setStep('processing');
    setTimeout(() => {
      setStep('done');
      setTimeout(onSuccess, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-black text-gray-900">Paiement</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 'method' && (
              <motion.div key="methods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="bg-gray-900 p-8 rounded-[2rem] text-white space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">Montant à payer</p>
                  <p className="text-4xl font-display font-black text-brand-yellow tracking-tight">{formatPrice(amount)}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handlePay('ORANGE')}
                    className="p-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20"
                  >
                    <span className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5" />
                      Orange Money
                    </span>
                    <CheckCircle2 className="w-5 h-5 opacity-40" />
                  </button>
                  <button 
                    onClick={() => handlePay('MOOV')}
                    className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/20"
                  >
                    <span className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5" />
                      Moov Money
                    </span>
                    <CheckCircle2 className="w-5 h-5 opacity-40" />
                  </button>
                  <button 
                    onClick={() => handlePay('CARD')}
                    className="p-5 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl font-bold flex items-center justify-between hover:border-brand-red transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-brand-red" />
                      Carte Bancaire
                    </span>
                    <CheckCircle2 className="w-5 h-5 opacity-20" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  Transactions sécurisées
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                   <div className="absolute inset-0 border-4 border-brand-red/10 rounded-full" />
                   <div className="absolute inset-0 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Validation en cours...</h3>
                  <p className="text-sm text-gray-500">Veuillez valider l'opération sur votre téléphone.</p>
                </div>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 className="w-12 h-12 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Paiement Réussi !</h3>
                  <p className="text-sm text-gray-500">Redirection vers votre billet...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
