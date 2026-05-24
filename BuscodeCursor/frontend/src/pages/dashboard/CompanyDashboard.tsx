import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { AdminDashboard } from '../admin/AdminDashboard';
import { useMockAppData } from '../../hooks/useMockAppData';

export function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    companies,
    setCompanies,
    trips,
    setTrips,
    jobOffers,
    setJobOffers,
    specialOffers,
    setSpecialOffers,
  } = useMockAppData();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900">
      <Navbar variant="company" currentUser={user} onLogout={handleLogout} />
      <main className="pt-16">
        <AdminDashboard
          currentUser={user}
          companies={companies}
          trips={trips}
          onAddCompany={(c) => setCompanies([...companies, c])}
          onUpdateCompany={(updated, updatedTrips) => {
            setCompanies(companies.map((c) => (c.id === updated.id ? updated : c)));
            const otherTrips = trips.filter((t) => t.companyId !== updated.id);
            setTrips([...otherTrips, ...updatedTrips]);
          }}
          onDeleteCompany={(id) => setCompanies(companies.filter((c) => c.id !== id))}
          onAddTrip={(t) => setTrips([...trips, t])}
          jobOffers={jobOffers}
          onAddJobOffer={(job) => setJobOffers([job, ...jobOffers])}
          onDeleteJobOffer={(id) => setJobOffers(jobOffers.filter((j) => j.id !== id))}
          specialOffers={specialOffers}
          onAddSpecialOffer={(offer) => setSpecialOffers([offer, ...specialOffers])}
          onDeleteSpecialOffer={(id) => setSpecialOffers(specialOffers.filter((so) => so.id !== id))}
        />
      </main>
    </div>
  );
}
