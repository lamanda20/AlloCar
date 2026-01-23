
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../App';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: 'login' | 'signup';
}

type ModalState = 'selection' | 'email_form';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView }) => {
  const [modalView, setModalView] = useState<'login' | 'signup'>(initialView);
  const [modalState, setModalState] = useState<ModalState>('selection');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rememberMe: false,
    marketing: true
  });

  // Synchroniser la vue interne quand le modal est ouvert depuis l'extérieur
  useEffect(() => {
    if (isOpen) {
      setModalView(initialView);
      setModalState('selection');
      setError(null);
      setLoading(false);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      console.error("OAuth Error:", err);
      setError("Accès refusé. Avez-vous ajouté votre email dans 'Utilisateurs de test' sur Google Cloud ?");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (modalView === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.name,
              last_name: '', 
            }
          }
        });
        if (signupError) throw signupError;
        if (data.user) {
            setUser(data.user);
            onClose();
        }
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (loginError) throw loginError;
        if (data.user) {
            setUser(data.user);
            onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setModalState('selection');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 bg-[#fcfcfc] overflow-y-auto">
      <div className="w-full max-w-xl py-12">
        <div className="flex items-center justify-center gap-2 mb-16">
            <div className="w-9 h-9 bg-[#2A4E2F] rounded-full flex items-center justify-center">
                <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">AlloCar</span>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] p-14 relative w-full">
          <button 
            onClick={modalState === 'selection' ? onClose : resetModal}
            className="flex items-center gap-2 text-gray-900 font-bold text-[15px] mb-12 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            {modalState === 'selection' ? "Retour à l'accueil" : "Retour aux Options"}
          </button>

          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-[32px] font-black text-gray-900 tracking-tight">
                {modalView === 'login' ? 'Se connecter' : "S'inscrire"}
              </h2>
              <p className="text-gray-500 font-bold text-lg">
                Location de voitures premium au Maroc.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col gap-3 text-red-600 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-[13px] font-black uppercase tracking-tight">Erreur d'accès</span>
                </div>
                <p className="text-[14px] font-bold leading-relaxed">{error}</p>
                {error.includes("Utilisateurs de test") && (
                  <div className="mt-2 p-4 bg-white/50 rounded-xl border border-red-100 space-y-2">
                    <p className="text-[11px] font-black uppercase text-red-400">Comment corriger :</p>
                    <ol className="text-[12px] font-bold space-y-1 list-decimal ml-4">
                      <li>AlloCar Dashboard Google Cloud</li>
                      <li>Onglet 'Audience'</li>
                      <li>Ajouter votre email dans 'Utilisateurs de test'</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {modalState === 'selection' ? (
              <div className="space-y-10">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full border border-gray-100 rounded-xl py-4 flex items-center justify-center gap-4 font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-98 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      Continuer avec Google
                    </>
                  )}
                </button>

                <div className="flex items-center gap-6">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <span className="text-gray-400 font-bold text-sm lowercase">ou</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <button 
                  onClick={() => setModalState('email_form')}
                  className="w-full bg-[#1D1D1D] text-white py-6 rounded-xl font-black text-[17px] hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/5"
                >
                  {modalView === 'login' ? 'Se connecter avec email' : "S'inscrire avec email"}
                </button>

                <div className="text-center pt-2">
                    <p className="text-gray-500 font-bold text-base">
                        {modalView === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"} 
                        <button 
                            onClick={() => { setModalView(modalView === 'login' ? 'signup' : 'login'); setError(null); }}
                            className="text-blue-500 ml-2 hover:underline decoration-2 underline-offset-4"
                        >
                            {modalView === 'login' ? 'créer un compte' : 'Se connecter'}
                        </button>
                    </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {modalView === 'signup' && (
                  <div className="space-y-3">
                    <label className="text-[14px] font-black text-gray-900">Nom complet <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-black/5 font-bold text-[15px] text-gray-900 transition-all placeholder:text-gray-300"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[14px] font-black text-gray-900">E-mail <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="email" 
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-black/5 font-bold text-[15px] text-gray-900 transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[14px] font-black text-gray-900">Mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-black/5 font-bold text-[15px] text-gray-900 transition-all placeholder:text-gray-300"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-[#1D1D1D] text-white py-6 rounded-xl font-black text-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (modalView === 'login' ? 'Se connecter' : 'Créer un compte')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-24 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                © 2025 ALLOCAR • PROJETÉ PAR <span className="text-blue-500 font-black cursor-pointer hover:underline">OPEN LLUNA</span>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
