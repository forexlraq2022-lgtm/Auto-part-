import React from 'react';
import { Check, X, ShieldCheck, Zap, Database } from 'lucide-react';

interface SubscriptionPlansProps {
  onSubscribe: () => void;
  isSubscribed: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSubscribe, isSubscribed }) => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">خطط تناسب جميع الاحتياجات</h2>
        <p className="text-xl text-slate-500">اختر الخطة التي تناسب حجم تجارتك وابدأ في بيع قطع الغيار بذكاء</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col hover:border-blue-300 transition-all">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800">زائر / مشتري</h3>
            <p className="text-slate-500 mt-2">للأفراد والباحثين عن قطع غيار</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-900">مجاناً</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600">
              <Check className="text-green-500 shrink-0" size={20} />
              <span>البحث الذكي عن القطع</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <Check className="text-green-500 shrink-0" size={20} />
              <span>البحث باستخدام الصور (AI)</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600">
              <Check className="text-green-500 shrink-0" size={20} />
              <span>تصفح المنتجات حسب المنشأ</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-slate-300 shrink-0" size={20} />
              <span className="line-through">إضافة منتجات للمخزون</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-slate-300 shrink-0" size={20} />
              <span className="line-through">لوحة تحكم التاجر</span>
            </li>
          </ul>
          <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
            الخطة الحالية
          </button>
        </div>

        {/* Merchant Plan */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 flex flex-col relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
            الأكثر طلباً
          </div>
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-400 fill-yellow-400" />
              باقة التاجر
            </h3>
            <p className="text-slate-400 mt-2">لأصحاب محلات قطع الغيار والموزعين</p>
          </div>
          <div className="mb-6 relative z-10">
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">199</span>
              <span className="text-xl font-bold text-slate-400 mb-2">ر.س / شهرياً</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <Check className="text-blue-400 shrink-0" size={16} />
              </div>
              <span className="text-slate-200">إضافة عدد غير محدود من المنتجات</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <Check className="text-blue-400 shrink-0" size={16} />
              </div>
              <span className="text-slate-200">رفع البيانات عبر Excel / CSV</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <Check className="text-blue-400 shrink-0" size={16} />
              </div>
              <span className="text-slate-200">تحليلات الذكاء الاصطناعي للمخزون</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <Check className="text-blue-400 shrink-0" size={16} />
              </div>
              <span className="text-slate-200">شارة "تاجر موثوق"</span>
            </li>
          </ul>
          
          {isSubscribed ? (
            <div className="w-full py-4 rounded-xl bg-green-500 text-white font-bold flex items-center justify-center gap-2 relative z-10">
              <ShieldCheck size={20} />
              أنت مشترك بالفعل
            </div>
          ) : (
            <button 
              onClick={onSubscribe}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-primary hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-lg shadow-blue-900/50 transition-all relative z-10"
            >
              اشترك الآن
            </button>
          )}
          
          {/* Background decoration */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-600/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center text-blue-800 max-w-4xl mx-auto">
        <p className="flex items-center justify-center gap-2 font-medium">
          <Database size={20} />
          <span>هل لديك أكثر من 10,000 صنف؟ تواصل معنا للحصول على باقة الشركات الكبرى.</span>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;