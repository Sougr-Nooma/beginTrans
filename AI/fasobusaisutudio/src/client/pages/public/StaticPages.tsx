/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Info, HelpCircle, Briefcase, Tag, MapPin, Phone, Mail, ChevronRight, Bus, ShieldCheck, Star } from 'lucide-react';
import { BusCompany, JobOffer, SpecialOffer } from '../../types';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display font-black text-gray-900">À propos de <span className="text-brand-red">FasoBus</span></h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">La révolution numérique du transport interurbain au Burkina Faso.</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-6">
          <p>
            FasoBus est née d'une vision simple : rendre le voyage par bus au Burkina Faso aussi simple qu'un clic sur un smartphone. 
            Historiquement, voyager d'une ville à une autre nécessitait de se déplacer physiquement aux gares, souvent encombrées, 
            pour acheter un billet sans garantie de place.
          </p>
          <p>
            Depuis 2024, nous travaillons avec les plus grandes compagnies nationales pour digitaliser leurs services. 
            Notre plateforme permet non seulement de comparer les prix et les horaires, mais aussi de choisir son siège exact 
            et de payer instantanément via Mobile Money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="p-3 bg-brand-green/10 w-fit rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="text-2xl font-display font-bold">Sécurité Maximale</h3>
            <p className="text-gray-500">Paiements sécurisés et partenaires certifiés par l'État.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="p-3 bg-brand-yellow/10 w-fit rounded-2xl">
              <Phone className="w-6 h-6 text-brand-yellow" />
            </div>
            <h3 className="text-2xl font-display font-bold">Support Local</h3>
            <p className="text-gray-500">Une équipe disponible 24h/24 basée à Ouagadougou.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecruitmentPage({ jobOffers, companies }: { jobOffers: JobOffer[], companies: BusCompany[] }) {
  const fadsJobs = jobOffers.filter(job => !job.companyId || job.companyId.toLowerCase() === 'fasobus');
  const partnerJobs = jobOffers.filter(job => job.companyId && job.companyId.toLowerCase() !== 'fasobus');

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-display font-black text-gray-900">Opportunités de <span className="text-brand-green">Carrière</span></h1>
        <p className="text-gray-500 font-medium">Rejoignez l'élite du transport ou l'équipe tech derrière FasoBus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 border-b border-gray-100 pb-2">Chez FasoBus Tech</h2>
          <div className="space-y-4">
            {fadsJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 group hover:border-brand-red transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-950 text-base leading-tight">{job.title}</h4>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase rounded-lg">{job.type}</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">{job.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-50 pt-3 mt-1">
                  <span>📍 {job.location}</span>
                  <span className="text-brand-red hover:underline cursor-pointer" onClick={() => alert(`Candidature pour le poste de "${job.title}" reçue ! Nous vous contacterons prochainement.`)}>Postuler en ligne →</span>
                </div>
              </div>
            ))}
            {fadsJobs.length === 0 && (
              <p className="text-gray-400 text-sm">Aucun poste ouvert pour le moment chez FasoBus.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 border-b border-gray-100 pb-2">Chez nos Partenaires</h2>
          <div className="space-y-4">
            {partnerJobs.map((job) => {
              const company = companies.find(c => c.id.toLowerCase() === job.companyId?.toLowerCase());
              return (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 group hover:border-brand-green transition-all">
                  <div className="flex items-center gap-3">
                    {company?.logo && <img src={company.logo} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-gray-100" alt="" />}
                    <div>
                      <h4 className="font-bold text-gray-950 text-base leading-tight">{job.title}</h4>
                      <p className="text-[10px] text-brand-green font-black uppercase tracking-wider">{company?.name || 'Compagnie Partenaire'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-2 leading-relaxed">{job.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-50 pt-3 mt-1">
                    <span>📍 {job.location} • {job.type}</span>
                    <span className="text-brand-green hover:underline cursor-pointer" onClick={() => alert(`Candidature transmise avec succès à ${company?.name || 'la compagnie'} !`)}>Soumettre candidature →</span>
                  </div>
                </div>
              );
            })}
            {partnerJobs.length === 0 && (
              <p className="text-gray-400 text-sm">Aucun poste à pourvoir actuellement auprès des transporteurs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpecialOffersPage({ specialOffers, companies }: { specialOffers: SpecialOffer[], companies: BusCompany[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-display font-black text-gray-900">Offres <span className="text-brand-yellow">Spéciales</span></h1>
        <p className="text-gray-500 font-medium">Bénéficiez de réductions exclusives avec nos partenaires de transport.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specialOffers.map((offer) => {
          const company = companies.find(c => c.id.toLowerCase() === offer.companyId?.toLowerCase());
          const logo = company?.logo || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=128&h=128&fit=crop';
          
          return (
            <div key={offer.id} className="bg-gradient-to-r from-gray-900 to-gray-800 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-brand-red/20 transition-all" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <img src={logo} className="w-24 h-24 rounded-full object-cover border-4 border-white/10 shrink-0" alt="" />
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-brand-yellow text-gray-900 text-[9px] font-black uppercase tracking-widest rounded-full">
                      {offer.discountPercentage ? `Promotion -${offer.discountPercentage}%` : 'Bon Plan'}
                    </span>
                    <h2 className="text-2xl font-display font-black leading-tight text-white mt-2">{offer.title}</h2>
                    {offer.lineName && <p className="text-xs text-brand-green font-semibold mt-1">{offer.lineName}</p>}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{offer.description}</p>
                  <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
                    {offer.discountCode && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Code :</span>
                        <span className="px-3 py-1 bg-white/10 text-brand-yellow font-mono text-xs font-black rounded-lg uppercase tracking-wider">{offer.discountCode}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => alert(`Offre activée ! Utilisez le code coupon lors du checkout.`)}
                      className="px-6 py-2 bg-brand-red hover:bg-white hover:text-gray-950 font-black text-xs rounded-xl transition-all"
                    >
                      En profiter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {specialOffers.length === 0 && (
          <div className="col-span-2 text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400">
            Aucune offre disponible actuellement.
          </div>
        )}
      </div>
    </div>
  );
}

export function HelpSupportPage() {
  const faqs = [
    { q: "Comment réserver un billet ?", a: "Choisissez votre ville de départ et d'arrivée, sélectionnez un trajet, vos places, et payez via Mobile Money." },
    { q: "Quels sont les modes de paiement ?", a: "Nous acceptons Orange Money, Moov Money et les cartes bancaires (Visa/Mastercard)." },
    { q: "Puis-je annuler ma réservation ?", a: "Oui, jusqu'à 24h avant le départ avec un remboursement de 90%. Passé ce délai, des frais s'appliquent." },
    { q: "Où se trouvent vos bureaux ?", a: "Notre siège est situé à Ouagadougou, secteur Patte d'Oie, non loin de la gare routière." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-brand-red/10 rounded-3xl mb-4">
            <HelpCircle className="w-10 h-10 text-brand-red" />
          </div>
          <h1 className="text-5xl font-display font-black text-gray-900">Centre d'Aide</h1>
          <p className="text-gray-500 font-medium">Nous sommes là pour vous aider à chaque étape de votre voyage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-display font-bold">Contact Rapide</h3>
            <div className="space-y-4">
              <a href="tel:+22625300000" className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-xl text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all"><Phone className="w-5 h-5" /></div>
                <span className="font-bold text-gray-700">+226 25 30 00 00</span>
              </a>
              <a href="mailto:support@fasobus.bf" className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-xl text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all"><Mail className="w-5 h-5" /></div>
                <span className="font-bold text-gray-700">support@fasobus.bf</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2">WhatsApp Business</p>
            <p className="text-3xl font-display font-black text-brand-green mb-4 hover:scale-105 transition-transform cursor-pointer">70 00 00 00</p>
            <p className="text-gray-500 text-sm">Disponible 24/7 pour vos questions urgentes.</p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-display font-bold">Questions Fréquentes</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6 space-y-2">
                <h4 className="font-bold text-lg text-gray-900">{faq.q}</h4>
                <p className="text-gray-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
