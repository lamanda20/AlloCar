
import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      console.error("Erreur Google OAuth:", err);
      if (err.message?.includes("provider is not enabled")) {
        setError("L'authentification Google n'est pas activée. Veuillez configurer le Client ID et le Client Secret dans votre console Supabase.");
      } else {
        setError("Impossible de se connecter avec Google pour le moment.");
      }
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
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#1D3621] rounded-full flex items-center justify-center">
                    <div className="flex gap-0.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Cardnd</span>
            </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] p-14 relative w-full">
          
          {/* Back Button */}
          <button 
            onClick={modalState === 'selection' ? onClose : resetModal}
            className="flex items-center gap-2 text-gray-900 font-bold text-[15px] mb-12 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            {modalState === 'selection' ? "Retour à l'accueil" : "Retour aux Options"}
          </button>

          <div className="space-y-12">
            {/* Titles */}
            <div className="space-y-4">
              <h2 className="text-[32px] font-black text-gray-900 tracking-tight">
                {modalState === 'selection' 
                    ? (modalView === 'login' ? 'Se connecter' : "S'inscrire avec email et mot de passe")
                    : (modalView === 'login' ? 'Se connecter' : "S'inscrire avec email et mot de passe")}
              </h2>
              <p className="text-gray-500 font-bold text-lg">
                Nous vous enverrons un code de confirmation par e-mail.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex items-start gap-3 text-red-600 text-[13px] font-bold animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {modalState === 'selection' ? (
              <div className="space-y-10">
                {/* Google Button */}
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full border border-gray-100 rounded-xl py-4 flex items-center justify-center gap-4 font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-98 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      Se connecter avec Google
                    </>
                  )}
                </button>

                <div className="flex items-center gap-6">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <span className="text-gray-400 font-bold text-sm lowercase">ou</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* Email Toggle Button */}
                <button 
                  onClick={() => setModalState('email_form')}
                  className="w-full bg-[#1D1D1D] text-white py-6 rounded-xl font-black text-[17px] hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/5"
                >
                  {modalView === 'login' ? 'Se connecter avec email et mot de passe' : "S'inscrire avec email et mot de passe"}
                </button>

                {/* Footer Link */}
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
                    <label className="text-[14px] font-black text-gray-900">Nom <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="Entrez votre Nom"
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
                    placeholder="Entrez votre e-mail"
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
                      placeholder="Entrez votre mot de passe"
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

                {modalView === 'login' ? (
                  <div className="space-y-6">
                    <button type="button" className="text-[14px] font-black text-red-500 hover:underline">Mot de passe oublié ?</button>
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div 
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.rememberMe ? 'bg-[#f5f5f5] border-gray-100' : 'border-gray-200'}`} 
                            onClick={() => setFormData(f => ({...f, rememberMe: !f.rememberMe}))}
                        >
                            {formData.rememberMe && <div className="w-2.5 h-1.5 border-b-2 border-r-2 border-gray-400 -rotate-45 mb-1"></div>}
                        </div>
                        <span className="text-[15px] font-bold text-gray-400">Se souvenir de moi</span>
                    </label>
                  </div>
                ) : (
                    <label className="flex items-start gap-4 cursor-pointer group pt-2">
                        <div 
                            className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${formData.marketing ? 'bg-[#1D1D1D] border-[#1D1D1D]' : 'border-gray-200'}`} 
                            onClick={() => setFormData(f => ({...f, marketing: !f.marketing}))}
                        >
                            {formData.marketing && <div className="w-2.5 h-1.5 border-b-2 border-r-2 border-white -rotate-45 mb-1"></div>}
                        </div>
                        <span className="text-[15px] font-bold text-gray-500 leading-snug">J'accepte de recevoir des communications marketing et des offres promotionnelles</span>
                    </label>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-[#1D1D1D] text-white py-6 rounded-xl font-black text-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (modalView === 'login' ? 'Se connecter' : 'créer un compte')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-24 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                © 2025 CARDND Tous droits réservés. Réalisé par <span className="text-blue-500 font-black cursor-pointer hover:underline">OPEN LLUNA</span>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
