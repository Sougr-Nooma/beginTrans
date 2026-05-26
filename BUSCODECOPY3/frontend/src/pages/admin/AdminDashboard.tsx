/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
// admin@fasobus.bf / admin123)
import React, { useState } from 'react';
import { BusCompany, Trip, JobOffer, SpecialOffer, cities } from '../../types';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, TrendingUp, Users, MapPin, PieChart as PieChartIcon, Mail, Phone, Building2, Hash, Clock, X, DollarSign, Info, Briefcase, Tag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line } from 'recharts';
import { formatPrice, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  currentUser?: { name: string; email: string; phone?: string; role: 'CLIENT' | 'COMPANY' | 'ADMIN'; companyId?: string } | null;
  companies: BusCompany[];
  trips: Trip[];
  onAddCompany: (company: BusCompany) => void | Promise<void>;
  onUpdateCompany: (company: BusCompany, updatedTrips: Trip[]) => void | Promise<void>;
  onDeleteCompany: (id: string) => void | Promise<void>;
  onAddTrip: (trip: Trip) => void | Promise<void>;
  jobOffers: JobOffer[];
  onAddJobOffer: (job: JobOffer) => void;
  onDeleteJobOffer: (id: string) => void;
  specialOffers: SpecialOffer[];
  onAddSpecialOffer: (offer: SpecialOffer) => void;
  onDeleteSpecialOffer: (id: string) => void;
}

export function AdminDashboard({ 
  currentUser, 
  companies, 
  trips, 
  onAddCompany, 
  onUpdateCompany, 
  onDeleteCompany, 
  onAddTrip,
  jobOffers,
  onAddJobOffer,
  onDeleteJobOffer,
  specialOffers,
  onAddSpecialOffer,
  onDeleteSpecialOffer
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'companies' | 'trips' | 'recruitment' | 'offers'>('stats');
  
  // Edit Mode State
  const [editingCompany, setEditingCompany] = useState<BusCompany | null>(null);
  const [editingCompanyTrips, setEditingCompanyTrips] = useState<Trip[]>([]);
  
  // Stats Filter State
  const [statsFilter, setStatsFilter] = useState('all');

  const openEditModal = (company: BusCompany) => {
    setEditingCompany(company);
    setEditingCompanyTrips(trips.filter(t => t.companyId === company.id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewCompany: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNewCompany) {
          setFormData({ ...formData, logo: reader.result as string });
        } else if (editingCompany) {
          setEditingCompany({ ...editingCompany, logo: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // State transitions for edited trips
  const addEditingTrip = () => {
    if (!editingCompany) return;
    setEditingCompanyTrips([...editingCompanyTrips, {
      id: Math.random().toString(36).substr(2, 9),
      companyId: editingCompany.id,
      departureCity: '',
      arrivalCity: '',
      departureTime: new Date().toISOString(),
      arrivalTime: new Date().toISOString(),
      price: 6000,
      busType: 'Standard',
      availableSeats: 40,
      totalSeats: 40
    }]);
  };

  const updateEditingTrip = (idx: number, field: string, value: any) => {
    const newTrips = [...editingCompanyTrips];
    newTrips[idx] = { ...newTrips[idx], [field]: value };
    setEditingCompanyTrips(newTrips);
  };

  const removeEditingTrip = (idx: number) => {
    setEditingCompanyTrips(editingCompanyTrips.filter((_, i) => i !== idx));
  };

  // Form State for Adding Company
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    ifu: '',
    description: '',
    logo: '',
  });

  const [formTrips, setFormTrips] = useState([{
    from: '',
    to: '',
    depTime: '08:00',
    arrTime: '13:00',
    price: 6000,
    gares: ''
  }]);
  
  const isCompanyUser = currentUser?.role === 'COMPANY';
  const companyId = currentUser?.companyId;

  // Timeframe and Forms
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const [recruitmentForm, setRecruitmentForm] = useState({
    title: '',
    description: '',
    location: 'Ouagadougou',
    type: 'Temps plein',
    companyId: isCompanyUser ? (companyId || '') : 'fasobus'
  });

  const [specialOfferForm, setSpecialOfferForm] = useState({
    title: '',
    description: '',
    discountCode: '',
    discountPercentage: 15,
    lineName: 'Toutes destinations',
    companyId: isCompanyUser ? (companyId || '') : 'all'
  });

  const handleCreateJobOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruitmentForm.title || !recruitmentForm.description) {
      alert("Veuillez remplir le titre et la description du poste.");
      return;
    }
    onAddJobOffer({
      id: 'job-' + Math.random().toString(36).substr(2, 9),
      title: recruitmentForm.title,
      description: recruitmentForm.description,
      location: recruitmentForm.location,
      type: recruitmentForm.type,
      companyId: recruitmentForm.companyId,
      createdAt: new Date().toISOString()
    });
    setRecruitmentForm({
      title: '',
      description: '',
      location: 'Ouagadougou',
      type: 'Temps plein',
      companyId: isCompanyUser ? (companyId || '') : 'fasobus'
    });
    alert("Offre d'emploi publiée avec succès ! Elle est désormais visible par les clients.");
  };

  const handleCreateSpecialOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialOfferForm.title || !specialOfferForm.description) {
      alert("Veuillez remplir le titre et la description de l'offre.");
      return;
    }
    onAddSpecialOffer({
      id: 'offer-' + Math.random().toString(36).substr(2, 9),
      title: specialOfferForm.title,
      description: specialOfferForm.description,
      discountCode: specialOfferForm.discountCode || undefined,
      discountPercentage: Number(specialOfferForm.discountPercentage) || undefined,
      lineName: specialOfferForm.lineName || undefined,
      companyId: specialOfferForm.companyId === 'all' ? undefined : specialOfferForm.companyId,
      createdAt: new Date().toISOString()
    });
    setSpecialOfferForm({
      title: '',
      description: '',
      discountCode: '',
      discountPercentage: 15,
      lineName: 'Toutes destinations',
      companyId: isCompanyUser ? (companyId || '') : 'all'
    });
    alert("Offre promotionnelle publiée avec succès ! Elle est désormais visible par les clients.");
  };

  // Helper to abbreviate city names
  const abbreviateCity = (city: string) => {
    const map: Record<string, string> = {
      'Ouagadougou': 'Ouaga',
      'Bobo-Dioulasso': 'Bobo',
      'Koudougou': 'Koudou',
      'Banfora': 'Banf.',
      'Tenkodogo': 'Tenko',
      'Ouahigouya': 'Ouahi.',
      'Dédougou': 'Dédou.',
      "Fada N'Gourma": 'Fada'
    };
    return map[city] || (city.length > 6 ? city.substring(0, 5) + '.' : city);
  };

  // Mock Stats Data Generation but restricted for company users
  const myCompanyTrips = trips.filter(t => !isCompanyUser || t.companyId.toLowerCase() === companyId?.toLowerCase());
  const totalPurchases = isCompanyUser ? 500 : companies.reduce((acc, c) => acc + (Math.floor(Math.random() * 1000) + 100), 0);
  
  // Timeframe-based scaling factor
  const getTimeframeMultiplier = () => {
    switch (timeframe) {
      case 'day': return 0.05;     // Daily scale
      case 'week': return 0.25;    // Weekly scale
      case 'month': return 1.0;    // Monthly scale (the default)
      case 'year': return 12.0;    // Yearly scale
      default: return 1.0;
    }
  };

  const timeframeMult = getTimeframeMultiplier();

  // Master trend chart data based on timeframe selection:
  const getTrendData = () => {
    const scaleFactor = isCompanyUser ? 1 : 4.2;
    if (timeframe === 'day') {
      return [
        { name: 'Lun', passagers: Math.round(45 * scaleFactor), CA: Math.round(270000 * scaleFactor) },
        { name: 'Mar', passagers: Math.round(55 * scaleFactor), CA: Math.round(330000 * scaleFactor) },
        { name: 'Mer', passagers: Math.round(72 * scaleFactor), CA: Math.round(432000 * scaleFactor) },
        { name: 'Jeu', passagers: Math.round(48 * scaleFactor), CA: Math.round(288000 * scaleFactor) },
        { name: 'Ven', passagers: Math.round(92 * scaleFactor), CA: Math.round(552000 * scaleFactor) },
        { name: 'Sam', passagers: Math.round(110 * scaleFactor), CA: Math.round(660000 * scaleFactor) },
        { name: 'Dim', passagers: Math.round(85 * scaleFactor), CA: Math.round(510000 * scaleFactor) },
      ];
    } else if (timeframe === 'week') {
      return [
        { name: 'Semaine 1', passagers: Math.round(250 * scaleFactor), CA: Math.round(1500000 * scaleFactor) },
        { name: 'Semaine 2', passagers: Math.round(290 * scaleFactor), CA: Math.round(1740000 * scaleFactor) },
        { name: 'Semaine 3', passagers: Math.round(340 * scaleFactor), CA: Math.round(2040000 * scaleFactor) },
        { name: 'Semaine 4', passagers: Math.round(310 * scaleFactor), CA: Math.round(1860000 * scaleFactor) },
      ];
    } else if (timeframe === 'month') {
      return [
        { name: 'Jan', passagers: Math.round(1200 * scaleFactor), CA: Math.round(7200000 * scaleFactor) },
        { name: 'Fév', passagers: Math.round(1150 * scaleFactor), CA: Math.round(6900000 * scaleFactor) },
        { name: 'Mar', passagers: Math.round(1400 * scaleFactor), CA: Math.round(8400000 * scaleFactor) },
        { name: 'Avr', passagers: Math.round(1550 * scaleFactor), CA: Math.round(9300000 * scaleFactor) },
        { name: 'Mai', passagers: Math.round(1720 * scaleFactor), CA: Math.round(10320000 * scaleFactor) },
      ];
    } else { // 'year'
      return [
        { name: '2023', passagers: Math.round(13505 * scaleFactor), CA: Math.round(81000000 * scaleFactor) },
        { name: '2024', passagers: Math.round(16800 * scaleFactor), CA: Math.round(100800000 * scaleFactor) },
        { name: '2025', passagers: Math.round(18900 * scaleFactor), CA: Math.round(113400000 * scaleFactor) },
        { name: '2026', passagers: Math.round(22000 * scaleFactor), CA: Math.round(132000000 * scaleFactor) },
      ];
    }
  };

  const statsByCompanyRaw = isCompanyUser
    ? myCompanyTrips.map(t => {
        const val = Math.round((Math.floor(Math.random() * 80) + 15) * timeframeMult);
        return {
          name: `${abbreviateCity(t.departureCity)}→${abbreviateCity(t.arrivalCity)}`,
          value: val,
          percentage: ''
        };
      })
    : companies.map(c => {
        const val = Math.round((Math.floor(Math.random() * 1000) + 100) * timeframeMult);
        return {
          name: c.name.split(' ')[0],
          value: val,
          percentage: ''
        };
      });

  const totalSum = statsByCompanyRaw.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const statsByCompany = statsByCompanyRaw.map(v => ({
    ...v,
    percentage: ((v.value / totalSum) * 100).toFixed(1) + '%'
  }));

  const COLORS = ['#CE1126', '#009E49', '#FCD116', '#4B5563', '#8B5CF6'];

  const rawTripsStats = trips
    .filter(t => !isCompanyUser || t.companyId.toLowerCase() === companyId?.toLowerCase())
    .map(t => ({
      route: `${abbreviateCity(t.departureCity)} → ${abbreviateCity(t.arrivalCity)}`,
      fullRoute: `${t.departureCity} → ${t.arrivalCity}`,
      travelers: Math.round((Math.floor(Math.random() * 500) + 50) * timeframeMult),
      companyId: t.companyId,
      company: companies.find(c => c.id === t.companyId)?.name.split(' ')[0] || 'Unknown'
    }));

  const filteredTripsStats = isCompanyUser 
    ? rawTripsStats 
    : (statsFilter === 'all' 
      ? rawTripsStats 
      : rawTripsStats.filter(t => t.companyId === statsFilter));

  const addTripField = () => {
    const lastTrip = formTrips[formTrips.length - 1];
    if (lastTrip) {
      setFormTrips([...formTrips, { 
        from: lastTrip.from, 
        to: lastTrip.to, 
        depTime: lastTrip.depTime, 
        arrTime: lastTrip.arrTime, 
        price: lastTrip.price,
        gares: lastTrip.gares || ''
      }]);
    } else {
      setFormTrips([...formTrips, { from: '', to: '', depTime: '08:00', arrTime: '13:00', price: 6000, gares: '' }]);
    }
  };

  const removeTripField = (index: number) => {
    setFormTrips(formTrips.filter((_, i) => i !== index));
  };

  const updateTripField = (index: number, field: string, value: any) => {
    const newTrips = [...formTrips];
    newTrips[index] = { ...newTrips[index], [field]: value };
    setFormTrips(newTrips);
  };

  const handleSubmit = async () => {
    let activeCompanyId = formData.id;

    if (isCompanyUser) {
      if (!companyId) return;
      activeCompanyId = companyId;
    } else {
      if (!formData.name || !formData.id) {
         alert("Veuillez remplir au moins le nom et l'ID de la compagnie.");
         return;
      }

      const newCompany: BusCompany = {
        ...formData,
        logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=128&h=128&fit=crop',
        rating: 4.5,
        description: formData.description || `Compagnie de transport opérant depuis ${formData.address || 'Burkina Faso'}.`
      };

      await onAddCompany(newCompany);
    }

    let addedAny = false;
    for (const ft of formTrips) {
      if (ft.from && ft.to) {
        await onAddTrip({
          id: Math.random().toString(36).substr(2, 9),
          companyId: activeCompanyId.toLowerCase(),
          departureCity: ft.from,
          arrivalCity: ft.to,
          departureTime: new Date(`2026-05-16T${ft.depTime}:00`).toISOString(),
          arrivalTime: new Date(`2026-05-16T${ft.arrTime}:00`).toISOString(),
          price: ft.price,
          busType: 'Standard',
          availableSeats: 40,
          totalSeats: 40,
          gares: ft.gares || '',
        });
        addedAny = true;
      }
    }

    if (isCompanyUser) {
      if (addedAny) {
        alert("Vos nouveaux trajets ont été enregistrés avec succès !");
        setActiveTab('trips');
      } else {
        alert("Veuillez remplir au moins un trajet valide.");
      }
    } else {
      // Reset form
      setFormData({ id: '', name: '', address: '', email: '', phone: '', ifu: '', description: '', logo: '' });
      setActiveTab('stats');
    }

    setFormTrips([{ from: '', to: '', depTime: '08:00', arrTime: '13:00', price: 6000, gares: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dashboardTitle = isCompanyUser ? "Espace Partenaire" : "Console Admin";
  const dashboardSubtitle = isCompanyUser 
    ? "Gérez vos programmations de bus, ajoutez de nouvelles lignes et suivez vos performances."
    : "Gestion centralisée des flux et des partenaires FasoBus.";

  const tabLabels = {
    stats: "Analyse",
    companies: isCompanyUser ? "Ajouter mes trajets" : "Nouveau Partenaire",
    trips: isCompanyUser ? "Ma Compagnie" : "Liste Partenaires",
    recruitment: "Recrutement",
    offers: "Bons Plans"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-black text-gray-900 tracking-tight">{dashboardTitle}</h1>
          <p className="text-gray-500 font-medium">{dashboardSubtitle}</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto grow-0 shrink-0 gap-1.5 max-w-full">
          <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<TrendingUp className="w-4 h-4"/>} label={tabLabels.stats} />
          {isCompanyUser && (
            <TabButton active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} icon={<Plus className="w-4 h-4"/>} label={tabLabels.companies} />
          )}
          <TabButton active={activeTab === 'trips'} onClick={() => setActiveTab('trips')} icon={<MapPin className="w-4 h-4"/>} label={tabLabels.trips} />
          <TabButton active={activeTab === 'recruitment'} onClick={() => setActiveTab('recruitment')} icon={<Briefcase className="w-4 h-4"/>} label={tabLabels.recruitment} />
          <TabButton active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} icon={<Tag className="w-4 h-4"/>} label={tabLabels.offers} />
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          {/* Timeframe selector & Main Trend Graphic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-black text-gray-950 tracking-tight">Suivi Temporel de l'Activité</h2>
                <p className="text-sm text-gray-400 font-semibold">Analyse comparative des réservations et des chiffres d'affaires selon la période sélectionnée.</p>
              </div>
              
              {/* Segmented Timeframe Switcher */}
              <div className="flex bg-gray-100/80 p-1.5 rounded-2xl self-start md:self-center border border-gray-200/20">
                {(['day', 'week', 'month', 'year'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTimeframe(mode)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                      timeframe === mode 
                        ? "bg-white text-gray-950 shadow-md shadow-gray-200"
                        : "text-gray-400 hover:text-gray-900"
                    )}
                  >
                    {mode === 'day' && 'Jour'}
                    {mode === 'week' && 'Semaine'}
                    {mode === 'month' && 'Mois'}
                    {mode === 'year' && 'Année'}
                  </button>
                ))}
              </div>
            </div>

            {/* General performance KPIs for this timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-brand-red/5 rounded-3xl border border-brand-red/10 space-y-2">
                <div className="text-[10px] font-black text-brand-red uppercase tracking-wider">Réservations ({timeframe === 'day' ? 'du jour' : timeframe === 'week' ? 'de la semaine' : timeframe === 'month' ? 'du mois' : 'de l\'année'})</div>
                <div className="text-3xl font-display font-black text-gray-950">
                  {getTrendData().reduce((a, b) => a + b.passagers, 0).toLocaleString()} passagers
                </div>
              </div>
              <div className="p-6 bg-brand-green/5 rounded-3xl border border-brand-green/10 space-y-2">
                <div className="text-[10px] font-black text-brand-green uppercase tracking-wider">Chiffre d'Affaires Estimé</div>
                <div className="text-3xl font-display font-black text-gray-950">
                  {formatPrice(getTrendData().reduce((a, b) => a + b.CA, 0))}
                </div>
              </div>
              <div className="p-6 bg-brand-yellow/5 rounded-3xl border border-brand-yellow/10 space-y-2">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Taux d'occupation moyen</div>
                <div className="text-3xl font-display font-black text-gray-950">
                  {timeframe === 'day' ? '86%' : timeframe === 'week' ? '82%' : timeframe === 'month' ? '79%' : '75%'}
                </div>
              </div>
            </div>

            {/* Interactive Trend Chart */}
            <div className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTrendData()} margin={{ left: 10, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#009E49" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#009E49" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
                    label={{ value: 'Passagers', angle: -90, position: 'insideLeft', offset: -5, fontWeight: 'black', fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
                    tickFormatter={(val) => `${val / 1000}k`}
                    label={{ value: 'Chiffre d\'Affaires (FCFA)', angle: 90, position: 'insideRight', offset: 5, fontWeight: 'black', fontSize: 10, fill: '#009E49' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any, name: string) => {
                      if (name === 'CA') return [formatPrice(value), "CA"];
                      return [`${value} passagers`, "Voyageurs"];
                    }}
                  />
                  <Area yAxisId="right" type="monotone" dataKey="CA" stroke="#009E49" strokeWidth={3} fillOpacity={1} fill="url(#colorCA)" />
                  <Bar yAxisId="left" dataKey="passagers" fill="#CE1126" radius={[4, 4, 0, 0]} barSize={25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market Share Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-red/10 rounded-xl"><PieChartIcon className="w-5 h-5 text-brand-red"/></div>
                  <h2 className="text-xl font-display font-bold">{isCompanyUser ? "Performances Trajets" : "Volume d'achats"}</h2>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statsByCompany} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                      {statsByCompany.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      formatter={(value, name, props) => [`${value} réservations (${props.payload.percentage})`, name]}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center" 
                      iconType="circle" 
                      formatter={(value, entry: any) => `${value} (${entry.payload.percentage})`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Travelers per Route Chart with FILTER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-green/10 rounded-xl"><Users className="w-5 h-5 text-brand-green"/></div>
                  <h2 className="text-xl font-display font-bold">Flux Voyageurs</h2>
                </div>
                
                {/* DYNAMIC FILTER */}
                {!isCompanyUser ? (
                  <div className="relative">
                    <select 
                      value={statsFilter} 
                      onChange={(e) => setStatsFilter(e.target.value)}
                      className="appearance-none bg-gray-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-xs font-black outline-none focus:ring-2 focus:ring-brand-green cursor-pointer uppercase tracking-wider"
                    >
                      <option value="all">Tous les Partenaires</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <span className="px-4 py-2 bg-brand-green/10 text-brand-green text-xs font-black rounded-xl uppercase tracking-wider">
                    Analyse de votre compagnie
                  </span>
                )}
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredTripsStats} margin={{ bottom: 100, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="route" 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      label={{ value: 'Trajet', position: 'bottom', offset: 0, fontWeight: 'black', fontSize: 12 }}
                    />
                    <YAxis 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
                      label={{ value: 'Nbr de voyageurs', angle: -90, position: 'insideLeft', offset: -10, fontWeight: 'black', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }} 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(label, items) => {
                        const payload = items[0]?.payload;
                        return payload?.fullRoute || label;
                      }}
                    />
                    <Bar dataKey="travelers" fill="#009E49" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'companies' && isCompanyUser && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-12">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-brand-red text-white rounded-3xl flex items-center justify-center shadow-lg shadow-brand-red/20">
                 <Bus className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                 <h2 className="text-3xl font-display font-black text-gray-900">
                   {isCompanyUser ? "Ajouter de Nouveaux Trajets" : "Enregistrer un Partenaire"}
                 </h2>
                 <p className="text-gray-500 font-medium">
                   {isCompanyUser ? "Saisissez les gares intermédiaires, horaires de départ/arrivée et tarifications." : "Configuration administrative et opérationnelle complète."}
                 </p>
               </div>
            </div>

            {/* Detailed Company Info - conditional for partner portals */}
            {isCompanyUser ? (
              <div className="p-8 bg-brand-green/5 border border-brand-green/15 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-950 leading-tight">
                    Session Partenaire active : {companies.find(c => c.id.toLowerCase() === companyId?.toLowerCase())?.name || companyId?.toUpperCase()}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Vos identifiants légaux et de tarification sont automatiquement rattachés. Ajoutez autant de trajets ou horaires que vous le souhaitez dans la section ci-dessous.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField label="Nom Commercial" icon={<Building2 className="w-4 h-4"/>}>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: TSR Transport" className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300" />
                  </FormField>
                  
                  <FormField label="Code Unique (ID)" icon={<Hash className="w-4 h-4"/>}>
                    <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Ex: tsr-01" className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300" />
                  </FormField>

                  <FormField label="Logo de la compagnie" icon={<Bus className="w-4 h-4"/>}>
                    <div className="flex items-center gap-3 w-full">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleLogoUpload(e, true)} 
                        id="new-logo-upload"
                        className="hidden" 
                      />
                      <label htmlFor="new-logo-upload" className="flex-1 cursor-pointer truncate text-xs font-bold text-gray-500 hover:text-brand-red transition-colors">
                        {formData.logo && !formData.logo.startsWith('http') ? 'Logo sélectionné ✅' : 'Choisir une image...'}
                      </label>
                    </div>
                  </FormField>

                  <FormField label="Contact Email" icon={<Mail className="w-4 h-4"/>}>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="partenaire@domaine.bf" className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300" />
                  </FormField>

                  <FormField label="Contact Téléphonique" icon={<Phone className="w-4 h-4"/>}>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+226 71 23 45 67" className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300" />
                  </FormField>

                  <FormField label="Identifiant Fiscal (IFU)" icon={<Hash className="w-4 h-4"/>}>
                    <input value={formData.ifu} onChange={e => setFormData({...formData, ifu: e.target.value})} placeholder="000XXXXXXX" className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300" />
                  </FormField>
                </div>

                <FormField label="Description de la compagnie" icon={<Info className="w-4 h-4"/>}>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Ex: Une compagnie historique avec une flotte moderne..." 
                    className="w-full bg-transparent outline-none font-bold placeholder:text-gray-300 resize-none" 
                    rows={2}
                  />
                </FormField>
              </>
            )}

            {/* MULTIPLE TRIPS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-green" />
                  Routes et Horaires
                </h3>
                <button 
                  onClick={addTripField} 
                  className="flex items-center gap-2 px-6 py-3 bg-brand-green/10 text-brand-green text-xs font-black uppercase tracking-wider rounded-2xl hover:bg-brand-green hover:text-white transition-all group"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  Ajouter un trajet
                </button>
              </div>

              <div className="space-y-6">
                {formTrips.map((trip, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 relative group/trip"
                  >
                    {formTrips.length > 1 && (
                      <button 
                        onClick={() => removeTripField(idx)} 
                        className="absolute -top-3 -right-3 p-2 bg-white border border-gray-200 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-full shadow-sm opacity-0 group-hover/trip:opacity-100 transition-all scale-90 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end w-full">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Départ</label>
                        <input 
                          type="text"
                          value={trip.from} 
                          onChange={e => updateTripField(idx, 'from', e.target.value)} 
                          placeholder="Ville de départ"
                          className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                        <input 
                          type="text"
                          value={trip.to} 
                          onChange={e => updateTripField(idx, 'to', e.target.value)} 
                          placeholder="Destination"
                          className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />Heure Dép.
                        </label>
                        <input 
                          type="time" 
                          value={trip.depTime} 
                          onChange={e => updateTripField(idx, 'depTime', e.target.value)} 
                          className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />Heure Arriv.
                        </label>
                        <input 
                          type="time" 
                          value={trip.arrTime} 
                          onChange={e => updateTripField(idx, 'arrTime', e.target.value)} 
                          className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />Prix (CFA)
                        </label>
                        <input 
                          type="number" 
                          value={trip.price} 
                          onChange={e => updateTripField(idx, 'price', parseInt(e.target.value))} 
                          className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 w-full border-t border-dashed border-gray-200/60 pt-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-green" /> Arrêts Intermédiaires / Gares d'Escale (Optionnel)
                      </label>
                      <input 
                        type="text"
                        value={trip.gares || ''} 
                        onChange={e => updateTripField(idx, 'gares', e.target.value)} 
                        placeholder="Ex: Boromo, Sâbon, Houndé (lister les villes servies séparées par des virgules)"
                        className="w-full bg-white px-5 py-3.5 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:ring-2 focus:ring-brand-green shadow-sm text-gray-700 placeholder:text-gray-300"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-12 space-y-6">
              <button 
                onClick={handleSubmit}
                className="w-full py-7 bg-gray-900 text-white font-black text-xl rounded-[2.5rem] hover:bg-brand-red transition-all shadow-2xl shadow-brand-red/10 active:scale-95"
              >
                {isCompanyUser ? "Enregistrer mes Trajets" : "Intégrer le Nouveau Partenaire"}
              </button>
              <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest px-8">
                {isCompanyUser ? "Les trajets encodés seront immédiatement opérationnels pour la recherche publique." : "L'action est irréversible. Les trajets seront instantanément actifs pour la billetterie publique."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'trips' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isCompanyUser ? companies.filter(c => c.id.toLowerCase() === companyId?.toLowerCase()) : companies).map(company => (
            <div key={company.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110" />
              
              <div className="flex items-center gap-5 relative z-10">
                <img src={company.logo} className="w-16 h-16 rounded-3xl object-cover shadow-lg" alt={company.name} />
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-gray-900">{company.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black rounded uppercase tracking-wider text-gray-500">ID: {company.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Siège</p>
                    <p className="text-xs font-bold text-gray-600 truncate">{company.address || "Non défini"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IFU</p>
                    <p className="text-xs font-bold text-gray-600 truncate">{company.ifu || "---"}</p>
                  </div>
                </div>
                
                <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                   <div className="flex -space-x-2">
                     <span className="w-8 h-8 rounded-full bg-brand-red/10 border-2 border-white flex items-center justify-center text-brand-red text-[10px] font-black">
                       {trips.filter(t => t.companyId === company.id).length}
                     </span>
                     <span className="px-3 text-[10px] font-bold text-gray-400 pt-2 tracking-widest uppercase">Trajets</span>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(company)}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-2xl transition-all"
                      >
                        <Building2 className="w-5 h-5" />
                      </button>
                      {!isCompanyUser && (
                        <button 
                          onClick={() => void onDeleteCompany(company.id)}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'recruitment' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 self-start">
              <div className="space-y-1">
                <h2 className="text-xl font-display font-black text-gray-950 tracking-tight">Publier une offre</h2>
                <p className="text-xs text-gray-400 font-semibold">Ajouter des offres d'emploi visibles dans la section Recrutement.</p>
              </div>

              <form onSubmit={handleCreateJobOffer} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de l'emploi</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Chauffeur Expérimenté de Bus"
                    value={recruitmentForm.title}
                    onChange={e => setRecruitmentForm({ ...recruitmentForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de contrat</label>
                  <select
                    value={recruitmentForm.type}
                    onChange={e => setRecruitmentForm({ ...recruitmentForm, type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                  >
                    <option>Temps plein</option>
                    <option>Temps partiel</option>
                    <option>Stage</option>
                    <option>CDD</option>
                    <option>CDI</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ville / Lieu</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Ouagadougou"
                    value={recruitmentForm.location}
                    onChange={e => setRecruitmentForm({ ...recruitmentForm, location: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                  />
                </div>

                {!isCompanyUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Compagnie émettrice</label>
                    <select
                      value={recruitmentForm.companyId}
                      onChange={e => setRecruitmentForm({ ...recruitmentForm, companyId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                    >
                      <option value="fasobus">FasoBus Platform</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Missions & Profil recherché</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Décrivez les critères d'éligibilité, les années d'expérience requises et les missions principales..."
                    value={recruitmentForm.description}
                    onChange={e => setRecruitmentForm({ ...recruitmentForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gray-950 text-white hover:bg-brand-red text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Publier l'annonce
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-gray-900">Annonces actives ({
                  jobOffers.filter(j => !isCompanyUser || j.companyId.toLowerCase() === companyId?.toLowerCase()).length
                })</h3>
              </div>

              <div className="space-y-4">
                {jobOffers.filter(j => !isCompanyUser || j.companyId.toLowerCase() === companyId?.toLowerCase()).length === 0 ? (
                  <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center space-y-3">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-500">Aucune offre d'emploi active pour le moment.</p>
                  </div>
                ) : (
                  jobOffers.filter(j => !isCompanyUser || j.companyId.toLowerCase() === companyId?.toLowerCase()).map(job => {
                    const compName = job.companyId === 'fasobus' 
                      ? "FasoBus Platform" 
                      : (companies.find(c => c.id.toLowerCase() === job.companyId.toLowerCase())?.name || job.companyId);
                    return (
                      <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between gap-6 hover:shadow-md transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-display font-black text-lg text-gray-950">{job.title}</h4>
                            <span className="px-2.5 py-1 bg-brand-red/10 text-brand-red text-[9px] font-black rounded-full uppercase tracking-wider">{job.type}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-bold">Lieu: {job.location} • Recruteur: <span className="text-brand-green">{compName}</span></p>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>
                        <button
                          onClick={() => onDeleteJobOffer(job.id)}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-2xl transition-all shrink-0 cursor-pointer"
                          title="Supprimer cette offre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'offers' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 self-start">
              <div className="space-y-1">
                <h2 className="text-xl font-display font-black text-gray-950 tracking-tight">Ajouter un bon plan</h2>
                <p className="text-xs text-gray-400 font-semibold">Gérer vos codes promotionnels et vos réductions spéciales trajets.</p>
              </div>

              <form onSubmit={handleCreateSpecialOffer} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-semibold">Titre de l'offre</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: -20% sur la ligne Bobo-Ouaga"
                    value={specialOfferForm.title}
                    onChange={e => setSpecialOfferForm({ ...specialOfferForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ligne ou Destination (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="ex: Bobo-Dioulasso ou Toutes"
                    value={specialOfferForm.lineName}
                    onChange={e => setSpecialOfferForm({ ...specialOfferForm, lineName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">% Remise</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 15"
                      value={specialOfferForm.discountPercentage}
                      onChange={e => setSpecialOfferForm({ ...specialOfferForm, discountPercentage: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Code Promo</label>
                    <input
                      type="text"
                      placeholder="ex: FASTRIP20"
                      value={specialOfferForm.discountCode}
                      onChange={e => setSpecialOfferForm({ ...specialOfferForm, discountCode: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {!isCompanyUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Compagnie émettrice</label>
                    <select
                      value={specialOfferForm.companyId}
                      onChange={e => setSpecialOfferForm({ ...specialOfferForm, companyId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all"
                    >
                      <option value="all">Toutes les compagnies</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description & conditions d'activation</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="ex: Valable uniquement pour les trajets achetés en ligne pour les départs en milieu de semaine..."
                    value={specialOfferForm.description}
                    onChange={e => setSpecialOfferForm({ ...specialOfferForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-brand-red focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gray-950 text-white hover:bg-brand-red text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Publier l'offre
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-gray-900">Offres et Remises actives ({
                  specialOffers.filter(o => !isCompanyUser || o.companyId?.toLowerCase() === companyId?.toLowerCase()).length
                })</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialOffers.filter(o => !isCompanyUser || o.companyId?.toLowerCase() === companyId?.toLowerCase()).length === 0 ? (
                  <div className="col-span-2 bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center space-y-3">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-500">Aucune offre promotionnelle active pour le moment.</p>
                  </div>
                ) : (
                  specialOffers.filter(o => !isCompanyUser || o.companyId?.toLowerCase() === companyId?.toLowerCase()).map(offer => {
                    const compName = !offer.companyId
                      ? "Toutes compagnies"
                      : (companies.find(c => c.id.toLowerCase() === offer.companyId?.toLowerCase())?.name || offer.companyId);
                    return (
                      <div key={offer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all relative overflow-hidden">
                        {/* Remise badge background effect */}
                        {offer.discountPercentage && (
                          <div className="absolute top-0 right-0 py-2 px-4 bg-brand-green text-white text-[10px] font-black rounded-bl-2xl uppercase tracking-wider">
                            -{offer.discountPercentage}%
                          </div>
                        )}
                        <div className="space-y-2">
                          <h4 className="font-display font-black text-base text-gray-950 pr-12">{offer.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Compagnie: <span className="text-brand-green">{compName}</span></p>
                          {offer.lineName && (
                            <p className="text-xs text-brand-red font-bold font-mono">Ligne: {offer.lineName}</p>
                          )}
                          <p className="text-xs text-gray-600 leading-normal">{offer.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          {offer.discountCode ? (
                            <div className="px-3 py-1 bg-gray-100 text-gray-700 font-mono text-[10px] font-black rounded uppercase border border-gray-200/50">
                              CODE: {offer.discountCode}
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-400 font-black">REMISE DIRECTE</div>
                          )}

                          <button
                            onClick={() => onDeleteSpecialOffer(offer.id)}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-all cursor-pointer"
                            title="Supprimer cette offre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Company Modal */}
      <AnimatePresence>
        {editingCompany && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-green/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-gray-900 uppercase tracking-tight">Modifier Partenaire</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{editingCompany.name} • {editingCompany.id}</p>
                  </div>
                </div>
                <button onClick={() => setEditingCompany(null)} className="p-3 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField label="Nom Commercial" icon={<Building2 className="w-4 h-4"/>}>
                    <input 
                      value={editingCompany.name} 
                      onChange={e => setEditingCompany({...editingCompany, name: e.target.value})} 
                      className="w-full bg-transparent outline-none font-bold" 
                    />
                  </FormField>
                  <FormField label="Logo de la compagnie" icon={<Bus className="w-4 h-4"/>}>
                    <div className="flex items-center gap-3 w-full">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleLogoUpload(e, false)} 
                        id="edit-logo-upload"
                        className="hidden" 
                      />
                      <label htmlFor="edit-logo-upload" className="flex-1 cursor-pointer truncate text-xs font-bold text-gray-500 hover:text-brand-red transition-colors">
                        {editingCompany.logo.length > 100 ? 'Nouveau logo chargé' : 'Remplacer le logo localement'}
                      </label>
                      <img src={editingCompany.logo} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                    </div>
                  </FormField>
                  <FormField label="Adresse Siège" icon={<MapPin className="w-4 h-4"/>}>
                    <input 
                      value={editingCompany.address || ''} 
                      onChange={e => setEditingCompany({...editingCompany, address: e.target.value})} 
                      className="w-full bg-transparent outline-none font-bold" 
                    />
                  </FormField>
                  <FormField label="Email" icon={<Mail className="w-4 h-4"/>}>
                    <input 
                      value={editingCompany.email || ''} 
                      onChange={e => setEditingCompany({...editingCompany, email: e.target.value})} 
                      className="w-full bg-transparent outline-none font-bold" 
                    />
                  </FormField>
                  <FormField label="Téléphone" icon={<Phone className="w-4 h-4"/>}>
                    <input 
                      value={editingCompany.phone || ''} 
                      onChange={e => setEditingCompany({...editingCompany, phone: e.target.value})} 
                      className="w-full bg-transparent outline-none font-bold" 
                    />
                  </FormField>
                  <FormField label="IFU" icon={<Hash className="w-4 h-4"/>}>
                    <input 
                      value={editingCompany.ifu || ''} 
                      onChange={e => setEditingCompany({...editingCompany, ifu: e.target.value})} 
                      className="w-full bg-transparent outline-none font-bold" 
                    />
                  </FormField>
                </div>

                <FormField label="Description" icon={<Info className="w-4 h-4"/>}>
                  <textarea 
                    value={editingCompany.description || ''} 
                    onChange={e => setEditingCompany({...editingCompany, description: e.target.value})} 
                    rows={3}
                    className="w-full bg-transparent outline-none font-bold resize-none" 
                  />
                </FormField>

                {/* EDITING TRIPS SECTION IN MODAL */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-brand-green" />
                      Gérer les Trajets
                    </h3>
                    <button 
                      onClick={addEditingTrip} 
                      className="flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-brand-green hover:text-white transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      Ajouter un trajet
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingCompanyTrips.map((trip, idx) => (
                      <div key={trip.id || idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-4 relative group/trip-row">
                        <button 
                          onClick={() => removeEditingTrip(idx)} 
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-100 text-gray-400 hover:text-brand-red rounded-full shadow-sm opacity-0 group-hover/trip-row:opacity-100 transition-all z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <input 
                            value={trip.departureCity} 
                            onChange={e => updateEditingTrip(idx, 'departureCity', e.target.value)}
                            placeholder="Départ"
                            className="bg-white px-3 py-2.5 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green" 
                          />
                          <input 
                            value={trip.arrivalCity} 
                            onChange={e => updateEditingTrip(idx, 'arrivalCity', e.target.value)}
                            placeholder="Arrivée"
                            className="bg-white px-3 py-2.5 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green" 
                          />
                          <input 
                            type="time" 
                            value={format(parseISO(trip.departureTime), 'HH:mm')} 
                            onChange={e => {
                              const date = new Date(trip.departureTime);
                              const [h, m] = e.target.value.split(':');
                              date.setHours(parseInt(h), parseInt(m));
                              updateEditingTrip(idx, 'departureTime', date.toISOString());
                            }}
                            className="bg-white px-3 py-2.5 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green text-center" 
                          />
                          <input 
                            type="time" 
                            value={format(parseISO(trip.arrivalTime), 'HH:mm')} 
                            onChange={e => {
                              const date = new Date(trip.arrivalTime);
                              const [h, m] = e.target.value.split(':');
                              date.setHours(parseInt(h), parseInt(m));
                              updateEditingTrip(idx, 'arrivalTime', date.toISOString());
                            }}
                            className="bg-white px-3 py-2.5 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green text-center" 
                          />
                          <input 
                            type="number" 
                            value={trip.price} 
                            onChange={e => updateEditingTrip(idx, 'price', parseInt(e.target.value))}
                            className="bg-white px-3 py-2.5 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green" 
                          />
                        </div>
                        <input 
                          value={trip.gares || ''} 
                          onChange={e => updateEditingTrip(idx, 'gares', e.target.value)}
                          placeholder="Arrêts intermédiaires / Gares d'escale (ex: Boromo, Houndé)"
                          className="bg-white px-4 py-2 rounded-xl text-xs font-bold outline-none border border-gray-100 focus:border-brand-green" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => setEditingCompany(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    void onUpdateCompany(editingCompany, editingCompanyTrips);
                    setEditingCompany(null);
                  }}
                  className="flex-[2] py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-brand-red transition-all uppercase tracking-widest text-xs shadow-xl shadow-brand-red/10"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-brand-red transition-colors">{label}</label>
      <div className="flex items-center gap-4 bg-gray-50/50 p-5 rounded-[1.5rem] border-2 border-transparent focus-within:border-brand-red focus-within:bg-white transition-all ring-offset-2">
        <div className="text-gray-400 group-focus-within:text-brand-red transition-colors">{icon}</div>
        {children}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={
        `flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all
         ${active ? 'bg-white text-gray-900 shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-900'}`
      }
    >
      <span className={active ? 'text-brand-red' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const Bus = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="m6 19-2 2"/><path d="m18 19 2 2"/>
  </svg>
);
