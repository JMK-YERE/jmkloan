import React, { useState, useRef, useEffect } from 'react';
import { 
  UserCheck, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  RefreshCw, 
  Upload, 
  Trash2, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Role, User } from '../types';
import { calculateMaxEligibleLoanAmount } from '../utils/loanLimit';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newUser: User) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '+255',
    nidaNumber: '',
    password: '',
    confirmPassword: '',
    role: 'BORROWER' as Role,
    location: '',
    occupation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Camera & KYC NIDA Card Photo State
  const [nidaPhotoBase64, setNidaPhotoBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Play error:', e));
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Kamera haikuweza kufunguka (kivinjari kimezuia ruhusa). Unaweza kupakia faili au kutumia picha ya mfano.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      setNidaPhotoBase64(base64);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNidaPhotoBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSampleNida = () => {
    // Generates a mock NIDA card snapshot in Base64 for instant demo verification
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 370;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background & border
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 370);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 592, 362);

      // Card Header
      ctx.fillStyle = '#065f46';
      ctx.fillRect(4, 4, 592, 55);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('JAMHURI YA MUUNGANO WA TANZANIA - NIDA', 130, 35);

      // Photo frame
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(25, 80, 130, 160);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('PICHA YA NIDA', 45, 165);

      // Details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('NIDA: ' + (form.nidaNumber || '19950712345670000003'), 175, 110);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('JINA: ' + (form.fullName || 'JONAS MKUDE').toUpperCase(), 175, 145);
      ctx.font = '12px sans-serif';
      ctx.fillText('URAIA: MTANZANIA', 175, 180);
      ctx.fillText('TAREHE YA KUZALIWA: 12/07/1995', 175, 215);

      // Security seal stamp
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(480, 260, 85, 65);
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('VERIFIED NIDA', 488, 298);

      const sampleBase64 = canvas.toDataURL('image/jpeg', 0.9);
      setNidaPhotoBase64(sampleBase64);
    }
  };

  const handleModalClose = () => {
    stopCamera();
    onClose();
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      errs.fullName = 'Jina kamili linahitaji angalau herufi 3';
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      errs.email = 'Weka anwani halali ya barua pepe (email)';
    }

    // Phone validation for Tanzania +255
    const cleanPhone = form.phone.replace(/\s+/g, '');
    if (!/^\+255[67]\d{8}$/.test(cleanPhone)) {
      errs.phone = 'Namba ya simu lazima ianze na +255 na iwe na tarakimu 12 (k.m. +255712345678)';
    }

    // NIDA validation (20 digits in Tanzania)
    const cleanNida = form.nidaNumber.replace(/\D/g, '');
    if (cleanNida.length !== 20) {
      errs.nidaNumber = `NIDA lazima iwe na tarakimu 20 (Sasa zipo: ${cleanNida.length})`;
    }

    // Password validation (This is what caused "Makosa ya uingizaji" in their app!)
    if (!form.password || form.password.length < 6) {
      errs.password = 'Nenosiri (password) lazima liwe na angalau herufi 6';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Manenosiri hayafanani';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        nidaNumber: form.nidaNumber.trim(),
        role: form.role,
        status: form.role === 'LENDER' ? 'APPROVED' : 'PENDING_APPROVAL',
        creditScore: 680,
        maxEligibleLoanAmount: calculateMaxEligibleLoanAmount(680),
        registeredAt: new Date().toISOString(),
        isKycVerified: Boolean(nidaPhotoBase64),
        location: form.location.trim() || 'Dar es Salaam',
        occupation: form.occupation.trim() || 'Mjasiriamali',
        nidaCardPhotoBase64: nidaPhotoBase64 || undefined,
        kycMetadata: nidaPhotoBase64
          ? {
              nidaCardPhotoBase64: nidaPhotoBase64,
              capturedAt: new Date().toISOString(),
              verificationMethod: 'CAMERA_CAPTURE',
            }
          : undefined,
      };

      stopCamera();
      setIsSubmitting(false);
      onRegisterSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full my-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Jisajili kwenye JmkLoanApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usajili salama unaozingatia NIDA & Sheria ya Ulinzi wa Taarifa (PDPC).
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chagua Jukumu Lako (Account Role):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'BORROWER', title: 'Mkopaji', desc: 'Kuomba mikopo' },
                { id: 'LENDER', title: 'Mkopeshaji', desc: 'Kuwekeza & kutoa mikopo' },
                { id: 'GUARANTOR', title: 'Mdhamini', desc: 'Kudhamini ndugu' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setForm({ ...form, role: r.id as Role })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    form.role === r.id
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{r.title}</div>
                  <div className="text-[10px] text-slate-400">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Jina Kamili (kama lilivyo kwenye NIDA):
            </label>
            <input
              type="text"
              required
              placeholder="k.m. Joseph Jonas Mkude"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
                errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Barua Pepe (Email):</label>
              <input
                type="email"
                required
                placeholder="mfano@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Namba ya Simu (+255):
              </label>
              <input
                type="tel"
                required
                placeholder="+255712345678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono ${
                  errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* NIDA Number with 20-digit counter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Namba ya NIDA (Kitambulisho cha Taifa):
              </label>
              <span
                className={`font-mono text-[10px] ${
                  form.nidaNumber.length === 20 ? 'text-emerald-600 font-bold' : 'text-slate-400'
                }`}
              >
                {form.nidaNumber.length}/20 tarakimu
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="19950712345670000003"
              value={form.nidaNumber}
              onChange={(e) => setForm({ ...form, nidaNumber: e.target.value.replace(/\D/g, '') })}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono tracking-wider ${
                errors.nidaNumber ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.nidaNumber && <p className="text-red-500 text-[11px] mt-1">{errors.nidaNumber}</p>}
          </div>

          {/* Camera Capture for NIDA Card Photo (KYC Feature) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Picha ya Kitambulisho cha NIDA (Camera KYC)</span>
              </div>
              {nidaPhotoBase64 && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Picha Imepigwa
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Piga picha ya kadi yako ya NIDA kwa kamera ya simu/kifaa ili kuharakisha uhakiki wa KYC.
            </p>

            {/* Hidden canvas for snapshot rendering */}
            <canvas ref={canvasRef} className="hidden" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* State A: Photo is captured */}
            {nidaPhotoBase64 ? (
              <div className="space-y-3">
                <div className="relative border border-emerald-500/40 rounded-xl overflow-hidden bg-slate-900/10 p-2 flex justify-center">
                  <img
                    src={nidaPhotoBase64}
                    alt="Kitambulisho cha NIDA Kilichopigwa"
                    className="max-h-48 rounded-lg object-contain shadow-xs"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>NIDA Card Captured</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Uthibitisho: Base64 JPEG Image
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNidaPhotoBase64(null);
                        startCamera();
                      }}
                      className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Piga Tena</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNidaPhotoBase64(null)}
                      className="py-1 px-2 text-slate-400 hover:text-red-500 transition"
                      title="Futa picha"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : isCameraActive ? (
              /* State B: Live Camera Viewfinder */
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-700 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* ID card alignment guideline frame */}
                  <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between text-[10px] text-emerald-300 font-bold bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-xs self-center">
                      Weka Kitambulisho cha NIDA Ndani ya Fremu Hii
                    </div>
                    <div className="text-[10px] text-emerald-300/80 text-center bg-slate-900/40 py-0.5 rounded">
                      Hakikisha namba na jina vinasomeka wazi
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-semibold text-xs"
                  >
                    Ghairi Kamera
                  </button>

                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Piga Picha Sasa</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State C: Inactive camera - Action buttons */
              <div className="space-y-2">
                {cameraError && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-[11px]">
                    {cameraError}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Fungua Kamera ya NIDA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pakia Picha</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateSampleNida}
                    className="py-2 px-3 rounded-lg border border-dashed border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Tumia sampuli ya picha ya kitambulisho cha NIDA kwa ajili ya majaribio"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Sampuli ya NIDA</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nenosiri (Password):
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Angalau herufi 6"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-3 py-2 pr-9 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thibitisha Nenosiri:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Rudia nenosiri"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Taarifa zako zinalindwa kwa mujibu wa Sheria ya Ulinzi wa Taarifa Binafsi 2023 (PDPC).</span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Ghairi
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Inasajili...' : 'Kamilisha Usajili'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

