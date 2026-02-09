import { useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { SymptomForm } from "@/components/SymptomForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { HospitalMap } from "@/components/HospitalMap";
import { type AnalysisResponse } from "@shared/schema";
import { HeartPulse, Stethoscope, ChevronRight, Activity, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-none text-slate-800">
                Sağlık<span className="text-primary">Asistanı</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Yapay Zeka Destekli Rehber</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#analyze" className="hover:text-primary transition-colors">Semptom Analizi</a>
            <a href="#hospitals" className="hover:text-primary transition-colors">Hastaneler</a>
            <div className="w-px h-4 bg-slate-200"></div>
            <a href="tel:112" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition-colors">
              <Activity className="w-4 h-4" />
              Acil Durum: 112
            </a>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MedicalDisclaimer />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Sağlığınız için <span className="text-gradient">Akıllı Rehberlik</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Yapay zeka teknolojisi ile semptomlarınızı analiz edin, doğru tıbbi bölüme yönlendirme alın ve size en yakın sağlık kuruluşlarını bulun.
            </p>
          </motion.div>
        </div>

        {/* Analysis Section */}
        <section id="analyze" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Semptom Analizi</h3>
              <p className="text-slate-500">Şikayetlerinizi anlatın, bölüm önerisi alın</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-1 gap-8">
            <SymptomForm onResult={setResult} />
            {result && <AnalysisResult result={result} />}
          </div>
        </section>

        {/* Hospital Map Section */}
        <section id="hospitals" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Yakın Hastaneler</h3>
              <p className="text-slate-500">Konumunuza en yakın sağlık kuruluşları</p>
            </div>
          </div>

          <HospitalMap />
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <HeartPulse className="w-5 h-5" />
              <span className="font-semibold text-slate-600">SağlıkAsistanı</span>
            </div>
            <p className="text-sm text-slate-400 text-center md:text-right">
              &copy; 2024 Sağlık Asistanı. Tüm hakları saklıdır. <br />
              <span className="text-xs">Bu uygulama sadece bilgilendirme amaçlıdır.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
