import React, { useRef, useState, useEffect } from 'react';
import { Pen, RotateCcw, CheckCircle2 } from 'lucide-react';

interface SignatureCanvasProps {
  title?: string;
  subtitle?: string;
  onSave: (dataUrl: string) => void;
  existingSignature?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  title = 'Sahihi ya Kalamu (Digital Signature)',
  subtitle = 'Tumia kidole au kalamu ya kifaa chako kusaini ndani ya kisanduku hapa chini.',
  onSave,
  existingSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [savedSig, setSavedSig] = useState<string | null>(existingSignature || null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 180 * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;

    // Background guideline line
    drawGuide(ctx, rect.width, 180);
  }, []);

  const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.moveTo(30, height - 40);
    ctx.lineTo(width - 30, height - 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGuide(ctx, rect.width, 180);
    setHasDrawn(false);
    setSavedSig(null);
  };

  const handleConfirmSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSavedSig(dataUrl);
    onSave(dataUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pen className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        </div>
        {savedSig && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sahihi Imethibitishwa
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{subtitle}</p>

      {savedSig ? (
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
          <img src={savedSig} alt="Sahihi Iliyohifadhiwa" className="h-20 object-contain" />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Saini Tena
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950 relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[180px] touch-none cursor-crosshair block"
            />
            <div className="absolute bottom-2 right-3 pointer-events-none text-[11px] text-slate-400">
              Eneo la Sahihi
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Futa
            </button>

            <button
              type="button"
              onClick={handleConfirmSave}
              disabled={!hasDrawn}
              className="text-xs font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 py-1.5 px-4 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Weka Sahihi Kwenye Mkataba
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
