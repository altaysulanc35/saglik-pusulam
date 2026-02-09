import { type AnalysisResponse } from "@shared/schema";
import { AlertTriangle, Info, CheckCircle2, Siren } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisResultProps {
  result: AnalysisResponse;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const urgencyConfig = {
    low: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
      label: "Düşük Aciliyet",
    },
    medium: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Info,
      label: "Orta Aciliyet",
    },
    high: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: AlertTriangle,
      label: "Yüksek Aciliyet",
    },
    emergency: {
      color: "bg-red-100 text-red-800 border-red-200 animate-pulse",
      icon: Siren,
      label: "ACİL DURUM",
    },
  };

  const urgency = urgencyConfig[result.urgency];
  const Icon = urgency.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 border border-blue-50 mt-8"
    >
      <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">Analiz Sonucu</h3>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${urgency.color}`}>
          <Icon className="w-4 h-4" />
          {urgency.label}
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Önerilen Bölüm</h4>
          <div className="text-3xl font-display font-bold text-slate-800 bg-slate-50 inline-block px-4 py-2 rounded-lg border border-slate-100">
            {result.department}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Açıklama</h4>
          <p className="text-lg text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
            {result.explanation}
          </p>
        </div>

        {result.relatedSymptoms && result.relatedSymptoms.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">İlişkili Olabilecek Diğer Belirtiler</h4>
            <div className="flex flex-wrap gap-2">
              {result.relatedSymptoms.map((symptom, index) => (
                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
