
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'CLIENT' });
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Connexion' : 'Inscription'}</h2>
        
        {!isLogin && (
          <>
            <input type="text" placeholder="Prénom" className="w-full p-2 mb-4 border rounded" 
              onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Nom" className="w-full p-2 mb-4 border rounded" 
              onChange={e => setFormData({...formData, lastName: e.target.value})} required />
          </>
        )}
        
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" 
          onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Mot de passe" className="w-full p-2 mb-4 border rounded" 
          onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        {!isLogin && (
          <select className="w-full p-2 mb-4 border rounded" 
            onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="CLIENT">Client</option>
            <option value="COMPANY">Compagnie</option>
          </select>
        )}
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
        
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-blue-600 underline">
          {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </form>
    </div>
  );
}