import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, RegisterData } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'CLIENT' | 'COMPANY'>('CLIENT');
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Appel à login avec 3 arguments : email, password, role
        await login(formData.email, formData.password, role);
        alert('Connexion réussie !');
        navigate(role === 'CLIENT' ? '/search' : '/admin');
      } else {
        // Préparation des données pour l'inscription
        const registerData: RegisterData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          companyName: role === 'COMPANY' ? formData.companyName : undefined
        };

        // Appel à register avec 2 arguments : data object, role
        await register(registerData, role);
        alert('Inscription réussie !');
        navigate(role === 'CLIENT' ? '/search' : '/admin');
      }
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {isLogin ? 'Connexion' : 'Inscription'} - FasoBus
        </h2>

        {/* Sélecteur de Rôle */}
        <div className="flex mb-6 border-b">
          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`flex-1 pb-2 ${role === 'CLIENT' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole('COMPANY')}
            className={`flex-1 pb-2 ${role === 'COMPANY' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Compagnie
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input name="firstName" placeholder="Prénom" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="lastName" placeholder="Nom" onChange={handleChange} className="w-full p-2 border rounded" required />
              {role === 'COMPANY' && (
                <input name="companyName" placeholder="Nom de la compagnie" onChange={handleChange} className="w-full p-2 border rounded" required />
              )}
            </>
          )}
          
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="w-full p-2 border rounded" required />
          
          {!isLogin && role === 'CLIENT' && (
             <input name="phone" placeholder="Téléphone" onChange={handleChange} className="w-full p-2 border rounded" />
          )}

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline">
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;