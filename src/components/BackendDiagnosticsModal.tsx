import React, { useState } from 'react';
import { Terminal, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, X, ShieldAlert, Key } from 'lucide-react';

interface BackendDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDiagnosticsModal: React.FC<BackendDiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [targetUrl, setTargetUrl] = useState('https://jmkloanapp-backend.onrender.com');
  const [healthStatus, setHealthStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [healthResponse, setHealthResponse] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'TESTER' | 'EXPLANATION' | 'FIXES'>('EXPLANATION');

  if (!isOpen) return null;

  const testHealthEndpoint = async () => {
    setHealthStatus('LOADING');
    setHealthResponse('Inatuma ombi la kupima backend ya Render...');
    try {
      const startTime = Date.now();
      const res = await fetch(`${targetUrl}/api/auth/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      const duration = Date.now() - startTime;
      const text = await res.text();
      setHealthResponse(`HTTP ${res.status} ${res.statusText} (${duration}ms)\n\nResponse:\n${text}`);
      if (res.ok) {
        setHealthStatus('SUCCESS');
      } else {
        setHealthStatus('ERROR');
      }
    } catch (err: any) {
      setHealthStatus('ERROR');
      setHealthResponse(
        `HITILAFU YA MTANDAO / CORS:\n${err.message}\n\nSababu inayowezekana:\n1. Backend ya Render bado inalala (Inachukua sekunde 50 kuamka)\n2. CORS inazuia ombi kutoka kwa kivinjari hiki\n3. URL sio sahihi au service imezimwa.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mambo Gani Hapa: Mchanganuo wa Makosa & Tiba ya Render
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ufafanuzi wa "Makosa ya uingizaji", 403 Forbidden, na CORS kwenye Parrot OS & Render.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-3 bg-white dark:bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('EXPLANATION')}
            className={`pb-3 font-semibold border-b-2 transition ${
              activeTab === 'EXPLANATION'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Kwa Nini Makosa Yalitokea?
          </button>
          <button
            onClick={() => setActiveTab('FIXES')}
            className={`pb-3 font-semibold border-b-2 transition ${
              activeTab === 'FIXES'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Code Fixes (Spring Boot & Next.js)
          </button>
          <button
            onClick={() => setActiveTab('TESTER')}
            className={`pb-3 font-semibold border-b-2 transition ${
              activeTab === 'TESTER'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Pima Backend Yako ya Render
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'EXPLANATION' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 dark:text-red-300">
                      Kosa #1: Nenosiri (Password) Halikutumwa Kwenye Fomu!
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1 leading-relaxed">
                      Kwenye Next.js <code>RegisterPage</code> yako, fomu ilikuwa inatuma tu:{' '}
                      <code>fullName, email, phone, nidaNumber, role</code>.
                      Lakini kwenye Spring Boot, model ya <code>RegisterRequest</code> inahitaji{' '}
                      <strong>password</strong> iliyowekewa <code>@NotBlank</code>. Spring Boot ilikataa
                      ombi hilo na kurudisha: <em>"Makosa ya uingizaji: password lazima ijazwe"</em>!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-300">
                      Kosa #2: Render Free Tier "Cold Sleep" (Usingizi wa Dakika 15)
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                      Render Free plan huzima seva baada ya dakika 15 bila shughuli. Mtu anapobonyeza "Jisajili",
                      seva ya Java Spring Boot inachukua sekunde 45–60 kuamka (JVM bootstrap). Wakati inazinduka,
                      kivinjari kinapata <strong>Timeout</strong> au <strong>CORS error</strong> kwa sababu
                      seva haikujibu kwa wakati.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/30">
                <div className="flex items-start gap-2.5">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-300">
                      Kosa #3: 403 Forbidden & Spring Security Preflight OPTIONS
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                      Kivinjari kinapotuma ombi la <code>POST</code> kwenda kikoa kingine, kinatanguliza ombi la{' '}
                      <code>OPTIONS</code> (Pre-flight). Kama Spring Security haina <code>requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()</code>{' '}
                      au inakataa CORS origin, inatupa <strong>403 Forbidden</strong> kabla ya controller kufikiwa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FIXES' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2">
                <div className="text-emerald-400 font-bold font-sans text-xs">
                  Hatua A: Ongeza Password Field kwenye Register Form (Next.js)
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Fungua Parrot Terminal na uhakikishe kuwa state ya <code>form</code> inajumuisha{' '}
                  <code>password: ''</code> na kuna input ya nenosiri.
                </p>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] overflow-x-auto text-emerald-300">
                  {`const [form, setForm] = useState({
  fullName: '',
  email: '',
  phone: '',
  nidaNumber: '',
  role: 'LENDER',
  password: '' // <-- LAZIMA!
});`}
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2">
                <div className="text-emerald-400 font-bold font-sans text-xs">
                  Hatua B: Weka UptimeRobot Kuamsha Render (Free)
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Unda monitor kwenye uptimerobot.com inayopiga URL:{' '}
                  <code>https://jmkloanapp-backend.onrender.com/api/auth/health</code> kila baada ya dakika 5
                  ili seva yako isilale kamwe!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'TESTER' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL ya Backend ya Render:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={testHealthEndpoint}
                    disabled={healthStatus === 'LOADING'}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${healthStatus === 'LOADING' ? 'animate-spin' : ''}`} />
                    Pima Health
                  </button>
                </div>
              </div>

              {healthResponse && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    {healthStatus === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {healthStatus === 'ERROR' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Matokeo ya Jaribio:
                    </span>
                  </div>
                  <pre className="p-3 bg-slate-950 text-slate-200 text-xs rounded-lg font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800">
                    {healthResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition"
          >
            Funga & Endelea
          </button>
        </div>
      </div>
    </div>
  );
};
