import { useState } from "react";
import { motion } from "framer-motion";
import { Check, HeartPulse, Shield, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "ÜCRETSİZ",
    price: "0₺",
    description: "Temel sağlık yönlendirme ve bilgilendirme.",
    features: [
      "Bölüm yönlendirme",
      "Kısa, genel açıklama",
      "Yakın hastaneleri haritada görme",
      "Günlük sınırlı kullanım"
    ],
    footer: "Genel bilgilendirme amaçlıdır.",
    buttonText: "Ücretsiz Başla",
    variant: "outline" as const,
  },
  {
    name: "PREMIUM BASIC",
    price: "49₺",
    period: "/ay",
    description: "Daha detaylı analiz ve sınırsız kullanım.",
    features: [
      "Daha detaylı açıklamalar",
      "Olası nedenlerin öncelik sıralaması",
      "Kritik bilgilendirmeler",
      "Günlük limit yok",
      "Reklamsız deneyim"
    ],
    footer: "Doktor görüşü önerilir.",
    buttonText: "Premium'a Geç",
    variant: "default" as const,
    popular: true
  },
  {
    name: "PREMIUM PLUS",
    price: "99₺",
    period: "/ay",
    description: "Tam kapsamlı sağlık takip ve raporlama.",
    features: [
      "Premium Basic'teki her şey",
      "Geçmiş semptom kayıtları",
      "Semptom değişim takibi",
      "Doktora özel PDF sağlık özeti",
      "Doktora sorulacaklar rehberi"
    ],
    footer: "Teşhis ve tedavi içermez.",
    buttonText: "Plus'ı Keşfet",
    variant: "default" as const,
  },
  {
    name: "FAMILY / CARE",
    price: "149₺",
    period: "/ay",
    description: "Tüm aile için ortak sağlık pusulası.",
    features: [
      "3-5 ayrı kişi profili",
      "Çocuk/Yaşlı özel geçmiş takibi",
      "Hassas uyarı sistemi",
      "Devlet hastaneleri öncelikli rehber",
      "Öncelikli destek"
    ],
    footer: "Aile boyu güvenli rehberlik.",
    buttonText: "Aileni Koru",
    variant: "secondary" as const,
  }
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 py-1 px-4 text-sm bg-blue-50 text-primary border-blue-100 rounded-full">
            Üyelik Paketleri
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
            Sağlık Yolculuğunuzda <span className="text-gradient">Size Uygun Paketi</span> Seçin
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            İhtiyacınıza göre özelleştirilmiş analiz ve takip seçenekleriyle sağlığınızı daha yakından takip edin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative flex flex-col hover-elevate transition-all duration-300 ${tier.popular ? 'border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20' : 'border-slate-200 shadow-sm'}`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  En Popüler
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                  {tier.period && <span className="text-slate-500 text-sm">{tier.period}</span>}
                </div>
                <CardDescription className="mt-4 text-slate-600 line-clamp-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full h-11" variant={tier.variant}>
                  {tier.buttonText}
                </Button>
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                  {tier.footer}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Güvenli Veri</h3>
              <p className="text-sm text-slate-600">Verileriniz anlık analiz edilir ve asla üçüncü taraflarla paylaşılmaz.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Hızlı Analiz</h3>
              <p className="text-sm text-slate-600">Semptomlarınız saniyeler içinde analiz edilerek en uygun bölüme yönlendirilirsiniz.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Ailecek Kullanım</h3>
              <p className="text-sm text-slate-600">Aile paketi ile tüm sevdiklerinizin sağlık geçmişini tek platformdan takip edin.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-xs max-w-2xl mx-auto">
          <p>“Bu platform tıbbi teşhis veya tedavi sunmaz. Sunulan bilgiler yalnızca sağlık kuruluşu ve branş yönlendirme amaçlıdır.”</p>
        </div>
      </div>
    </div>
  );
}
