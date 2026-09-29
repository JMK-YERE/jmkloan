import React, { useState } from 'react';
import { User, Role, AppNotification } from '../types';
import { Terminal, LogOut, UserCheck, Bell, Check } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentRole: Role;
  notificationCount: number;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
  onRoleChange: (role: Role) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDiagnostics: () => void;
  onLogout: () => void;
  activeView: 'LANDING' | 'DASHBOARD' | 'CALCULATOR';
  setActiveView: (view: 'LANDING' | 'DASHBOARD' | 'CALCULATOR') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  notificationCount,
  notifications,
  onMarkNotificationsRead,
  onRoleChange,
  onOpenLogin,
  onOpenRegister,
  onOpenDiagnostics,
  onLogout,
  activeView,
  setActiveView,
}) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('LANDING')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              J
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                JmkLoanApp
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Tanzania P2P & Microfinance</span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveView('LANDING')}
            className={`transition hover:text-emerald-600 ${activeView === 'LANDING' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Kuhusu Mfumo
          </button>
          <button
            onClick={() => setActiveView('CALCULATOR')}
            className={`transition hover:text-emerald-600 ${activeView === 'CALCULATOR' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Kikokotoo cha Mkopo
          </button>
          <button
            onClick={() => setActiveView('DASHBOARD')}
            className={`transition hover:text-emerald-600 ${activeView === 'DASHBOARD' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Dashibodi ya Mikopo
          </button>
          <a
            href="#sheria-bot"
            onClick={() => setActiveView('LANDING')}
            className="hover:text-emerald-600 transition"
          >
            Sheria za BOT & Leseni
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* Diagnostics / Mambo Gani Hapa button */}
          <button
            onClick={onOpenDiagnostics}
            className="py-1.5 px-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition hover:bg-amber-100"
            title="Angalia sababu za makosa ya 403, CORS, na validation ya Render"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mambo Gani Hapa?</span>
          </button>

          {/* Interactive Notification Bell with Badge Counter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationPanelOpen(!isNotificationPanelOpen);
                if (!isNotificationPanelOpen && notificationCount > 0) {
                  // user opened notifications
                }
              }}
              className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title="Arifa na Taarifa za Mikopo"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-xs animate-pulse">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationPanelOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Arifa za Mfumo</span>
                    {notificationCount > 0 && (
                      <span className="font-mono text-[10px] font-bold py-0.5 px-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                        {notificationCount} Mpya
                      </span>
                    )}
                  </div>
                  {notificationCount > 0 && (
                    <button
                      onClick={() => {
                        onMarkNotificationsRead();
                      }}
                      className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Check className="w-3 h-3" />
                      Soma Zote
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      Hakuna arifa mpya kwa sasa.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          !notif.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {notif.timestamp.replace('T', ' ').substring(11, 16)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
                  <button
                    onClick={() => {
                      setIsNotificationPanelOpen(false);
                      setActiveView('DASHBOARD');
                    }}
                    className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-semibold"
                  >
                    Tazama kwenye Dashibodi →
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Role selector dropdown */}
              <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-[11px]">
                {(['LENDER', 'BORROWER', 'GUARANTOR', 'ADMIN'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setActiveView('DASHBOARD');
                    }}
                    className={`py-1 px-2 rounded-md font-medium transition ${
                      currentRole === r
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r === 'LENDER' && 'Mkopeshaji'}
                    {r === 'BORROWER' && 'Mkopaji'}
                    {r === 'GUARANTOR' && 'Mdhamini'}
                    {r === 'ADMIN' && 'Admin'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2">
                <button
                  onClick={() => setActiveView('DASHBOARD')}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[100px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                  title="Toka (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Ingia
              </button>
              <button
                onClick={onOpenRegister}
                className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Jisajili
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

