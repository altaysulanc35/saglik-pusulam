import { useState } from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { SymptomForm } from "@/components/SymptomForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { HospitalMap } from "@/components/HospitalMap";
import { type AnalysisResponse } from "@shared/schema";
import { HeartPulse, Stethoscope, ChevronRight, Activity, MapPin, Info, ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const LegalModal = ({ title, content, icon: Icon }: { title: string, content: React.ReactNode, icon: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary transition-colors cursor-pointer">{title}</button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon className="w-6 h-6 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-slate dark:prose-invert max-w-none py-4">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );

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
                Sağlık<span className="text-primary">Pusulam</span>
                <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md align-top font-semibold tracking-wide border border-blue-200">BETA</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Bilgilendirme Amaçlı Sağlık Rehberi</p>
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
        <div className="mb-6 bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
          <p className="text-xs md:text-sm text-blue-800 font-medium">
            “Bu uygulama tıbbi teşhis koymaz. Bilgilendirme amaçlıdır. Acil durumlarda 112 Acil Servis’i arayın.”
          </p>
        </div>

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
              Akıllı yönlendirme sistemi ile semptomlarınızı analiz edin, doğru tıbbi bölüme yönlendirme alın ve size en yakın sağlık kuruluşlarını bulun.
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


          <HospitalMap />
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-slate-800">Sağlık Pusulam</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
              <LegalModal
                title="Hakkımızda"
                icon={Info}
                content={
                  <div className="space-y-4">
                    <p>Sağlık Pusulam, üniversite öğrencisi bir geliştirici tarafından, insanların günlük hayatta yaşadıkları sağlıkla ilgili belirsizliklerde daha doğru yönlendirme alabilmelerine yardımcı olmak amacıyla geliştirilmiştir.</p>
                    <p>Bu platform, kullanıcıların yaşadıkları belirtilere göre hangi hastane bölümüne başvurmalarının daha uygun olabileceği konusunda genel bilgilendirme ve yönlendirme sunar.</p>
                    <p>Sağlık Pusulam tıbbi teşhis veya tedavi önerisi sunmaz. Uygulama tamamen bilgilendirme amaçlıdır ve kullanıcıdan kişisel sağlık verisi talep etmez veya saklamaz.</p>
                  </div>
                }
              />
              <LegalModal
                title="Gizlilik Politikası"
                icon={ShieldCheck}
                content={
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Kullanıcılardan kişisel sağlık verisi toplanmaz</li>
                    <li>Kimlik veya hassas bilgi istenmez</li>
                    <li>Girilen bilgiler kayıt altına alınmaz</li>
                    <li>Veriler yalnızca anlık olarak analiz edilir</li>
                    <li>Üçüncü taraflarla veri paylaşımı yapılmaz</li>
                  </ul>
                }
              />
              <LegalModal
                title="Kullanım Koşulları"
                icon={FileText}
                content={
                  <div className="space-y-4">
                    <p>Bu web sitesini kullanan herkes aşağıdaki koşulları kabul etmiş sayılır.</p>
                    <p>Sağlık Pusulam yalnızca bilgilendirme ve yönlendirme amaçlıdır. Sunulan bilgiler tıbbi teşhis veya tedavi yerine geçmez.</p>
                    <p>Kullanıcılar site üzerindeki bilgileri kendi sorumlulukları dahilinde kullanır. Sağlık Pusulam, sunulan bilgiler doğrultusunda alınan kararlardan sorumlu tutulamaz.</p>
                    <p className="font-bold text-red-600">Acil durumlarda 112 Acil Servis ile iletişime geçilmelidir.</p>
                  </div>
                }
              />

            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <div className="text-center md:text-left">
              <p>© 2026 Sağlık Pusulam. Tüm hakları saklıdır.</p>
              <p className="text-xs mt-1">İletişim: saglikpusulam@hotmail.com</p>
            </div>
            <p className="text-xs max-w-xs text-center md:text-right">
              Bu uygulama tıbbi teşhis koymaz. Bilgilendirme amaçlıdır. Acil durumlarda 112 Acil Servis’i arayın.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
