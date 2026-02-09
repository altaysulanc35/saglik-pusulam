import { useState } from "react";
import { useAnalyzeSymptom } from "@/hooks/use-health";
import { Loader2, SendHorizontal, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SymptomFormProps {
  onResult: (result: any) => void;
}

export function SymptomForm({ onResult }: SymptomFormProps) {
  const [symptom, setSymptom] = useState("");
  const analyzeMutation = useAnalyzeSymptom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    try {
      const result = await analyzeMutation.mutateAsync({ symptom });
      onResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Stethoscope className="w-48 h-48 text-primary" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Şikayetiniz nedir?</h2>
        <p className="text-slate-500 mb-6">
          Semptomlarınızı detaylı bir şekilde açıklayın, yapay zeka size en uygun tıbbi bölümü önersin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Örn: 2 gündür şiddetli baş ağrım var ve midem bulanıyor..."
              className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none text-lg"
              disabled={analyzeMutation.isPending}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={analyzeMutation.isPending || symptom.length < 3}
              className="
                group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white
                bg-gradient-to-r from-primary to-accent
                shadow-lg shadow-primary/25
                hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transition-all duration-200 ease-out
              "
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  Analiz Et
                  <SendHorizontal className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
