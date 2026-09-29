import React, { useState } from 'react';
import { User, Loan, PaymentTransaction } from '../types';
import { formatTzs, formatDate } from '../utils/format';
import { ShieldCheck, UserCheck, AlertTriangle, Users, Check, X, Bell, Camera } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  loans: Loan[];
  transactions: PaymentTransaction[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  loans,
  transactions,
  onApproveUser,
  onRejectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'TRANSACTIONS' | 'ANNOUNCEMENTS'>('USERS');
  const [selectedNidaPhoto, setSelectedNidaPhoto] = useState<{ photo: string; userName: string; nida: string } | null>(null);
  const [announcements, setAnnouncements] = useState<string[]>([
    'Ilani ya BOT: Wakopeshaji wote wanatakiwa kuwasilisha ripoti ya robo mwaka kabla ya tarehe 15.',
    'Mfumo umeanza kutumia uthibitisho wa namba za NIDA tarakimu 20 kwa watumiaji wote wapya.',
  ]);
  const [newNotice, setNewNotice] = useState('');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.trim()) return;
    setAnnouncements([newNotice.trim(), ...announcements]);
    setNewNotice('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
            Jopo Kuu la Usimamizi (System Administration)
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Msimamizi wa Mfumo (Admin Console)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kusimamia watumiaji, uthibitishaji wa NIDA, leseni za BOT, na taarifa za mfumo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="py-1 px-3 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            PostgreSQL (Neon) Imeunganishwa
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 px-3 font-semibold border-b-2 transition ${
            activeTab === 'USERS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Watumiaji & Uthibitisho wa NIDA ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`pb-3 px-3 font-semibold border-b-2 transition ${
            activeTab === 'TRANSACTIONS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Kumbukumbu za Miamala ya Simu ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('ANNOUNCEMENTS')}
          className={`pb-3 px-3 font-semibold border-b-2 transition ${
            activeTab === 'ANNOUNCEMENTS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Matangazo ya Umma ({announcements.length})
        </button>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'USERS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Watumiaji Wote Waliosajiliwa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Jina Kamili</th>
                  <th className="py-3 px-4">Jukumu (Role)</th>
                  <th className="py-3 px-4">NIDA Number</th>
                  <th className="py-3 px-4">Simu & Email</th>
                  <th className="py-3 px-4">Hali ya Akaunti</th>
                  <th className="py-3 px-4 text-right">Uamuzi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {u.fullName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 tracking-wider">
                      <div>{u.nidaNumber}</div>
                      {u.nidaCardPhotoBase64 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNidaPhoto({
                              photo: u.nidaCardPhotoBase64!,
                              userName: u.fullName,
                              nida: u.nidaNumber,
                            })
                          }
                          className="mt-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-sans"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Picha ya NIDA</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Bila picha</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{u.phone}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'APPROVED' ? (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Imethibitishwa
                        </span>
                      ) : (
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Inasubiri Uhakiki
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.status !== 'APPROVED' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveUser(u.id)}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition"
                          >
                            <Check className="w-3 h-3" />
                            Idhinisha
                          </button>
                          <button
                            onClick={() => onRejectUser(u.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Hakuna hatua</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Transactions */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rekodi za Miamala ya Marejesho</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Kumbukumbu (Ref)</th>
                  <th className="py-3 px-4">Mkopaji</th>
                  <th className="py-3 px-4">Kiasi</th>
                  <th className="py-3 px-4">Njia ya Malipo</th>
                  <th className="py-3 px-4">Muda</th>
                  <th className="py-3 px-4">Hali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {t.referenceNumber}
                    </td>
                    <td className="py-3 px-4 font-medium">{t.borrowerName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 tabular-nums">
                      {formatTzs(t.amount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {t.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {t.timestamp.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Announcements */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-6">
          <form onSubmit={handlePostNotice} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Chapisha Tangazo Jipya la Umma
            </h4>
            <textarea
              required
              rows={2}
              placeholder="Andika tangazo la mfumo hapa..."
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Chapisha Tangazo
            </button>
          </form>

          <div className="space-y-3">
            {announcements.map((a, idx) => (
              <div
                key={idx}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3"
              >
                <Bell className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIDA Card Photo Preview Modal for Admin KYC Verification */}
      {selectedNidaPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Picha ya Kitambulisho cha NIDA (KYC Review)
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {selectedNidaPhoto.userName} · NIDA: {selectedNidaPhoto.nida}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNidaPhoto(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex flex-col items-center justify-center bg-slate-950/20">
              <img
                src={selectedNidaPhoto.photo}
                alt="Kitambulisho cha NIDA"
                className="max-h-72 rounded-xl object-contain shadow-md border border-slate-200 dark:border-slate-800"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-3">
                Imepigwa kwa Kamera ya Mfumo · Base64 KYC Verification Format
              </span>
            </div>

            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNidaPhoto(null)}
                className="py-1.5 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
