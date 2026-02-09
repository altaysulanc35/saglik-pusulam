import { AlertCircle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
            Önemli Yasal Uyarı
          </h3>
          <div className="mt-1 text-sm text-red-700">
            <p>
              Bu uygulama <strong>tıbbi teşhis koymaz</strong> ve profesyonel tıbbi tavsiyenin yerini tutmaz. 
              Sağladığı bilgiler sadece rehberlik amaçlıdır.
            </p>
            <p className="mt-2 font-bold">
              Acil bir durumunuz varsa veya göğüs ağrısı, nefes darlığı gibi ciddi semptomlar yaşıyorsanız, 
              lütfen hemen <span className="text-xl mx-1 bg-red-200 px-2 rounded">112</span>'yi arayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
