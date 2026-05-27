import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { AdminDashboard } from '../admin/AdminDashboard';
import { useAppData } from '../../hooks/useAppData';

export function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    companies,
    trips,
    jobOffers,
    specialOffers,
    loading,
    error,
    refresh,
    patchCompany,
    addTrip,
    addJobOffer,
    removeJobOffer,
    addSpecialOffer,
    removeSpecialOffer,
  } = useAppData();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] text-gray-500 font-semibold">
        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] p-6 text-brand-red font-semibold">
        {error}
        <button type="button" onClick={() => refresh()} className="mt-4 underline text-sm">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900">
      <main className="pt-16">
        <AdminDashboard
          currentUser={user}
          companies={companies}
          trips={trips}
          onAddCompany={async () => {}}
          onUpdateCompany={patchCompany}
          onDeleteCompany={async () => {}}
          onAddTrip={addTrip}
          jobOffers={jobOffers}
          onAddJobOffer={addJobOffer}
          onDeleteJobOffer={removeJobOffer}
          specialOffers={specialOffers}
          onAddSpecialOffer={addSpecialOffer}
          onDeleteSpecialOffer={removeSpecialOffer}
        />
      </main>
    </div>
  );
}
