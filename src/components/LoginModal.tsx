import React, { useState } from 'react';
import { LogIn, X, User } from 'lucide-react';
import { INITIAL_USERS } from '../data/mockData';
import { User as UserType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('admin@jmkloanapp.co.tz');
  const [password, setPassword] = useState('admin@123');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );
    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      // Default to first user or create session user
      onLoginSuccess({
        id: 'usr-custom',
        fullName: 'Mtumiaji Aliyethibitishwa',
        email: emailOrPhone,
        phone: '+255700000000',
        nidaNumber: '19900101111110000000',
        role: 'LENDER',
        status: 'APPROVED',
        creditScore: 720,
        registeredAt: new Date().toISOString(),
        isKycVerified: true,
      });
      onClose();
    }
  };

  const selectPreset = (user: UserType) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ingia kwenye Mfumo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chagua akaunti ya mfano au weka nenosiri.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Quick preset account selector */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Ingia Moja kwa Moja (Akaunti za Majaribio):
            </span>
            <div className="space-y-1.5">
              {INITIAL_USERS.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectPreset(u)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 flex items-center justify-between text-left transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-300">
                      {u.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {u.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.role === 'ADMIN' && 'Msimamizi Mkuu'}
                        {u.role === 'LENDER' && 'Mkopeshaji (Mwekezaji)'}
                        {u.role === 'BORROWER' && 'Mkopaji'}
                        {u.role === 'GUARANTOR' && 'Mdhamini'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Ingia →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px]">au ingiza kawaida</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Barua Pepe au Simu:
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nenosiri (Password):
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition"
            >
              Ingia kwenye Dashibodi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
