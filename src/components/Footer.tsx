import React from 'react';
import { ShieldCheck, Scale, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenDiagnostics: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiagnostics }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                J
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">JmkLoanApp</span>
            </div>
            <p className="text-xs leading-relaxed">
              Jukwaa la kidijitali la kuunganisha mikopo ya P2P, vikundi vya hisa, na wakopeshaji binafsi Tanzania.
            </p>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 dark:text-white block">Uzingatiaji wa Sheria</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>• BOT Microfinance Act 2018</li>
              <li>• Personal Data Protection Act 2023</li>
              <li>• Sheria ya Mikataba ya Kielektroniki</li>
              <li>• Mwongozo wa Kuzuia Utakatishaji Fedha (AML)</li>
            </ul>
          </div>

          {/* Mawasiliano */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 dark:text-white block">Mawasiliano & Ofisi</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Posta Mpya, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>+255 712 345 678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>msaada@jmkloanapp.co.tz</span>
              </div>
            </div>
          </div>

          {/* Developer / System Status */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 dark:text-white block">Mfumo & Zana</span>
            <p className="text-[11px] leading-relaxed">
              Teknolojia: Spring Boot 3 + PostgreSQL Neon + React.
            </p>
            <button
              onClick={onOpenDiagnostics}
              className="mt-2 py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition"
            >
              Uchunguzi wa Render & CORS →
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} JmkLoanApp Tanzania. Haki zote zimehifadhiwa.
          </div>
          <div className="flex items-center gap-4">
            <span>Usalama wa NIDA</span>
            <span>·</span>
            <span>Ulinzi wa Faragha</span>
            <span>·</span>
            <span>Mikataba Halali</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
