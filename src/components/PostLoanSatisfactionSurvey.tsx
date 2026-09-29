import React, { useState } from 'react';
import { Loan, LoanSatisfactionSurvey } from '../types';
import { formatTzs } from '../utils/format';
import { 
  Star, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  Sparkles, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PostLoanSatisfactionSurveyProps {
  loan: Loan;
  onSurveySubmitted: (loanId: string, survey: LoanSatisfactionSurvey) => void;
  onDismiss?: () => void;
}

export const PostLoanSatisfactionSurvey: React.FC<PostLoanSatisfactionSurveyProps> = ({
  loan,
  onSurveySubmitted,
  onDismiss,
}) => {
  const existingSurvey = loan.satisfactionSurvey;

  const [rating, setRating] = useState<number>(existingSurvey?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [easeRating, setEaseRating] = useState<number>(existingSurvey?.easeOfApplication || 5);
  const [transparencyRating, setTransparencyRating] = useState<number>(existingSurvey?.transparencyRating || 5);
  const [speedRating, setSpeedRating] = useState<number>(existingSurvey?.customerServiceRating || 5);
  const [recommend, setRecommend] = useState<'DEFINITELY' | 'MAYBE' | 'UNLIKELY'>(
    existingSurvey?.recommendLikelihood || 'DEFINITELY'
  );
  const [comment, setComment] = useState<string>(existingSurvey?.feedbackComment || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!existingSurvey);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const starLabels: Record<number, string> = {
    1: 'Haikuridhisha Kabisa',
    2: 'Wastani (Inahitaji Maboresho)',
    3: 'Nzuri',
    4: 'Nzuri Sana',
    5: 'Bora Kabisa! (Excellent)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: LoanSatisfactionSurvey = {
      rating,
      easeOfApplication: easeRating,
      transparencyRating,
      customerServiceRating: speedRating,
      recommendLikelihood: recommend,
      feedbackComment: comment.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    onSurveySubmitted(loan.id, newSurvey);
    setIsSubmitted(true);
  };

  // State: Already submitted review summary
  if (isSubmitted) {
    return (
      <div className="p-5 bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300 dark:border-emerald-800 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Tathmini ya Mkopo #{loan.loanNumber} Imekamilika!
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {rating} / 5 Nyota
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Asante kwa maoni yako. Uaminifu wako wa kurejesha mkopo unakuza alama zako za BOT/Creditinfo!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              Badilisha Maoni
            </button>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Funga"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-linear-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border-2 border-emerald-400/50 dark:border-emerald-800 rounded-3xl shadow-md space-y-5 transition-all">
      {/* Top Banner Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="py-0.5 px-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono">
                Mkopo Umekamilika (SETTLED)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                #{loan.loanNumber}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Pongezi! Umekamilisha Marejesho ya Mkopo Wako
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kiasi cha {formatTzs(loan.principalAmount)} kilichokopwa kutoka kwa {loan.lenderName || 'Mkopeshaji'} kimelipwa kikamilifu. Tupe tathmini ya uzoefu wako.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isExpanded ? 'Kunja' : 'Fungua'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Kamilisha baadaye"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs pt-2">
          {/* Main 1-5 Star Rating */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="font-bold text-sm text-slate-900 dark:text-white block">
                1. Tathmini ya Jumla ya Uzoefu Wako:
              </label>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                {starLabels[hoverRating || rating]}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-hidden"
                    title={`${star} kati ya 5`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Criteria Breakdown Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Criterion 1: Ease of Application */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Urahisi wa Maombi:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEaseRating(s)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        easeRating >= s
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {easeRating}/5
              </span>
            </div>

            {/* Criterion 2: Transparency of Terms */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Uwazi wa Riba na Masharti:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTransparencyRating(s)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        transparencyRating >= s
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {transparencyRating}/5
              </span>
            </div>

            {/* Criterion 3: Speed & Support */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Huduma & Kasi ya Kutoa Fedha:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeedRating(s)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        speedRating >= s
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {speedRating}/5
              </span>
            </div>
          </div>

          {/* NPS Recommendation Question */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              2. Je, ungependa kupendekeza JmkLoanApp kwa rafiki, ndugu au mfanyabiashara mwenzako?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { id: 'DEFINITELY', label: 'Ndiyo, Hakika (100%)', desc: 'Ningependekeza sana' },
                { id: 'MAYBE', label: 'Labda / Pengine', desc: 'Inategemea mahitaji' },
                { id: 'UNLIKELY', label: 'Hapana kwa Sasa', desc: 'Kuna mambo ya kurekebisha' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setRecommend(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    recommend === opt.id
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Written Feedback / Comments */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Maoni au ushauri wako kwa mkopeshaji na mfumo (Si lazima):</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Eleza kilichokupendeza zaidi au mambo ambayo ungependa yaboreshwe kwenye mikopo ijayo..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Kutoa maoni huongeza uaminifu na alama zako za mkopo ujao!</span>
            </div>

            <div className="flex items-center gap-2">
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-semibold"
                >
                  Baadaye
                </button>
              )}
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tuma Tathmini ya Mkopo</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
