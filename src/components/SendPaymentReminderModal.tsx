import React, { useState } from 'react';
import { Loan } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { 
  BellRing, 
  X, 
  Send, 
  Smartphone, 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Check
} from 'lucide-react';

interface SendPaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onSendReminder: (loanId: string, channel: 'SMS' | 'PUSH' | 'BOTH', message: string) => void;
}

export const SendPaymentReminderModal: React.FC<SendPaymentReminderModalProps> = ({
  isOpen,
  onClose,
  loan,
  onSendReminder,
}) => {
  if (!isOpen || !loan) return null;

  const remaining = Math.max(0, loan.totalRepayment - loan.amountPaid);
  const formattedDueDate = loan.dueDate ? formatDate(loan.dueDate) : 'Mwisho wa Mwezi';

  const [channel, setChannel] = useState<'SMS' | 'PUSH' | 'BOTH'>('BOTH');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);

  const templates = [
    {
      id: 0,
      title: 'Ukumbusho wa Kirafiki (Friendly)',
      text: `Ndugu ${loan.borrowerName}, huu ni ukumbusho wa kirafiki kuhusu marejesho ya mkopo #${loan.loanNumber} ya ${formatTzs(remaining)} yanayotakiwa kabla ya tarehe ${formattedDueDate}. Kurejesha kwa wakati kunaboresha alama zako za mkopo za BOT/Creditinfo. Asante!`,
    },
    {
      id: 1,
      title: 'Tarehe Inakaribia (Due Soon)',
      text: `Habari ${loan.borrowerName}, tarehe ya ukomo wa marejesho ya mkopo #${loan.loanNumber} (Kiasi: ${formatTzs(remaining)}) inakaribia tarehe ${formattedDueDate}. Tafadhali fanya marejesho kwa M-Pesa / Tigo Pesa mapema kuepuka tozo za kuchelewa.`,
    },
    {
      id: 2,
      title: 'Muhimu & Haraka (Urgent Notice)',
      text: `TAARIFA MUHIMU: Marejesho yako ya mkopo #${loan.loanNumber} ya ${formatTzs(remaining)} yanatakiwa kulipwa tarehe ${formattedDueDate}. Tafadhali lipa sasa ili kulinda uaminifu na rekodi yako ya NIDA kwenye Benki Kuu ya Tanzania.`,
    },
  ];

  const [customMessage, setCustomMessage] = useState(templates[0].text);

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomMessage(templates[idx].text);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      onSendReminder(loan.id, channel, customMessage.trim());
      setIsSending(false);
      setSuccessStatus(true);
      setTimeout(() => {
        setSuccessStatus(false);
        onClose();
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full my-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Tuma Ukumbusho wa Tarehe ya Malipo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mkopaji: <span className="font-semibold text-slate-700 dark:text-slate-300">{loan.borrowerName}</span> ({loan.borrowerPhone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successStatus ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Ukumbusho Umetumwa Kikamilifu!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Ujumbe umetumwa kwenda kwa {loan.borrowerName} kupitia {channel === 'BOTH' ? 'SMS na Push Notification' : channel}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4 text-xs">
            {/* Loan Context Summary Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                  Baki Inayodaiwa:
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {formatTzs(remaining)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                  Tarehe ya Ukomo (Due Date):
                </span>
                <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDueDate}
                </span>
              </div>
            </div>

            {/* Delivery Channel Selector */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Chagua Njia ya Kutuma Ukumbusho:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('BOTH')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition flex flex-col items-center gap-1 ${
                    channel === 'BOTH'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>SMS + Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition flex flex-col items-center gap-1 ${
                    channel === 'SMS'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>SMS Pekee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('PUSH')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition flex flex-col items-center gap-1 ${
                    channel === 'PUSH'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <BellRing className="w-4 h-4 text-emerald-600" />
                  <span>Push Pekee</span>
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Violezo vya Ujumbe (Templates):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((tpl, i) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(i)}
                    className={`py-1 px-2.5 rounded-lg border text-[11px] transition flex items-center gap-1 ${
                      selectedTemplateIndex === i
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {selectedTemplateIndex === i && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>{tpl.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ujumbe Utakaotumwa kwa {loan.borrowerPhone}:
              </label>
              <textarea
                rows={4}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Herufi: {customMessage.length}</span>
                <span>Inatuma kwenda mtandao wa simu wa Tanzania</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
              >
                Ghairi
              </button>
              <button
                type="submit"
                disabled={isSending || !customMessage.trim()}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSending ? (
                  <span>Inatuma...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Tuma Ukumbusho</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
