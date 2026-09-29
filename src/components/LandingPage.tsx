import React from 'react';
import { 
  ShieldCheck, 
  PenTool, 
  Users, 
  Scale, 
  Smartphone, 
  FileCheck, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  AlertOctagon,
  Calculator
} from 'lucide-react';
import { LoanCalculator } from './LoanCalculator';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenRegister: () => void;
  onOpenDiagnostics: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onOpenRegister,
  onOpenDiagnostics,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Mfumo wa Kisasa wa Mikopo ya P2P & Vikundi Tanzania</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Kopesha na Kopa kwa <span className="text-emerald-600 dark:text-emerald-400">Usalama Kamili</span>, Mikataba ya Kisheria na Sahihi ya Kalamu.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Mfumo wa kwanza wa kidijitali Tanzania unaowaunganisha wakopeshaji binafsi, wakopaji, na wadhamini.
            Ukiwa na sahihi ya kidijitali, hesabu ya riba ya BOT, na uthibitisho wa kisheria ili kuondoa mikopo ya hatari na migogoro.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartDemo}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Fungua Dashibodi ya Majaribio (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="py-3 px-6 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm transition"
            >
              Jisajili Kama Mkopeshaji au Mkopaji
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Inatii BOT Microfinance Act 2018</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ulinzi wa Data (PDPC 2023)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>M-Pesa, Tigo Pesa & Airtel Money</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Piga Hesabu ya Mkopo Wako Hapa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Hakuna ada zilizofichwa! Mkopaji na mkopeshaji wanaona marejesho, riba, na ada ya wakili kabla ya kusaini mkataba wowote.
          </p>
        </div>
        <LoanCalculator onApplyWithCalculation={() => onOpenRegister()} />
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Vipengele 6 Muhimu Vilivyojengwa kwa Mazingira ya Tanzania
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Kila kipengele kimeundwa kutatua matatizo halisi ya wakopeshaji na wakopaji wa mtaani.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Sahihi ya Kalamu */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Sahihi ya Kalamu (Electronic Signature)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mkopaji na mdhamini wanasaini mkataba kwa kalamu kwenye skrini ya simu au kompyuta. Sahihi inabana kisheria na inaunganishwa kwenye faili la mkataba moja kwa moja.
            </p>
          </div>

          {/* 2. Moduli ya Wadhamini */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Usimamizi wa Wadhamini (Guarantors)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mdhamini anapokea ombi rasmi lenye maelezo ya deni, anaingiza NIDA na kusaini kuridhia dhamana. Mkopo hautolewi hadi mdhamini athibitishe.
            </p>
          </div>

          {/* 3. Mwanasheria / Wakili */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Ada ya Mwanasheria (Legal Verification)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kipengele cha hiari cha kumhusisha wakili kusimamia mikataba mikubwa, kuandika fomu ya dhamana, na kuongeza ada ya ushauri kisheria kwenye hesabu.
            </p>
          </div>

          {/* 4. Malipo ya Simu */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              M-Pesa, Tigo, Airtel & HaloPesa
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Uunganishaji wa miamala ya simu (C2B & STK push). Mkopaji analipa marejesho na mfumo unasasisha salio na kutoa risiti ya msimbo (Reference ID) papo hapo.
            </p>
          </div>

          {/* 5. Historia & Alama ya Uaminifu */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Historia & Credit Scoring
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mkopeshaji anaona alama ya mkopaji (Credit Score 300–850), idadi ya mikopo aliyowahi kulipa kwa wakati, na kiwango cha hatari kabla ya kutoa fedha.
            </p>
          </div>

          {/* 6. Ulinzi wa Sheria na BOT */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Faragha na Ulinzi wa Data (PDPC)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hakuna alama za vidole (fingerprints) zinazohifadhiwa ovyo. Tunatumia viwango vya WebAuthn (FIDO2) ili kulinda usalama na kufuata Sheria ya Mwaka 2023.
            </p>
          </div>
        </div>
      </section>

      {/* BOT & Legal Compliance Warning Banner */}
      <section id="sheria-bot" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/20">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Mwongozo wa Kisheria wa Benki Kuu ya Tanzania (BOT) & Tahadhari ya "Kausha Damu"
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Kulingana na <strong>Microfinance Services Act 2018</strong> Kifungu cha 16(1), mtu yeyote au taasisi inayotoa mikopo kwa umma kwa njia ya faida au riba lazima awe na <strong>Leseni ya BOT (Tier 2 Microfinance)</strong> au asajiliwe rasmi kama kikundi cha VICOBA/SACCOS (Tier 3/4). Kutoa mikopo bila leseni ni kosa lenye adhabu ya faini isiyopungua TZS 20,000,000 au kifungo cha miaka miwili.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <span>✓ Mfumo wetu hutoa mikataba halisi ya kisheria</span>
                <span>✓ Huzuia riba kandamizi zisizoidhinishwa</span>
                <span>✓ Unasaidia wakopeshaji binafsi kufuata taratibu rasmi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-10 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Anza Kusimamia Mikopo Yako Kidijitali Leo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Acha kutumia madaftari ya karatasi yanayoweza kupotea au kuchanika. Tumia JmkLoanApp kuona hesabu, rekodi za M-Pesa, na sahihi za kisheria popote ulipo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartDemo}
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
            >
              Fungua Dashibodi ya Moja kwa Moja
            </button>
            <button
              onClick={onOpenDiagnostics}
              className="py-3 px-5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              Ufafanuzi wa Hitilafu ya Render & Spring Boot
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
