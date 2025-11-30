import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchInterface from './components/SearchInterface';
import InventoryUpload from './components/InventoryUpload';
import CategorySection from './components/CategorySection';
import SubscriptionPlans from './components/SubscriptionPlans';
import { InventoryItem, CarOrigin } from './types';
import { Package, X, Filter, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CarOrigin | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // Merchant subscription state
  const [merchantFilter, setMerchantFilter] = useState<CarOrigin | 'ALL'>('ALL');

  useEffect(() => {
    // Load some mock data for demonstration if inventory is empty
    if (inventory.length === 0) {
      setInventory([
        { id: '1', partNumber: '58101-2S000', name: 'فحمات فرامل أمامية', origin: CarOrigin.KOREAN, price: 120, quantity: 15, description: 'تناسب هيونداي توسان 2011-2015' },
        { id: '2', partNumber: '12341-RCA-A00', name: 'وجه غطاء بلوف', origin: CarOrigin.AMERICAN, price: 45, quantity: 4, description: 'جودة عالية مطابقة للأصل' },
        { id: '3', partNumber: 'CN-LIGHT-22', name: 'شمعة أمامية يمين', origin: CarOrigin.CHINESE, price: 450, quantity: 2, description: 'جيلي كولراي 2023 - ليد كامل' },
        { id: '4', partNumber: 'AC-FILT-99', name: 'فلتر مكيف', origin: CarOrigin.KOREAN, price: 35, quantity: 100, description: 'كيا سبورتاج / هيونداي النترا' },
      ]);
    }
    
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleCategorySelect = (origin: CarOrigin) => {
    setSelectedCategory(origin);
    setActiveTab('search'); // Send them to search tab when category clicked
  };

  const filteredInventory = selectedCategory 
    ? inventory.filter(item => item.origin === selectedCategory)
    : inventory;

  const handleSubscribe = () => {
    setIsSubscribed(true);
    alert('تم الاشتراك بنجاح! يمكنك الآن إدارة المخزون.');
    setActiveTab('inventory');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'search') setSelectedCategory(null);
        }} 
      />
      
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {apiKeyMissing && (
           <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
             <Package className="text-amber-600" />
             <div>
               <p className="font-bold">مفتاح API مفقود</p>
               <p className="text-sm">لم يتم العثور على مفتاح Gemini API. وظائف الذكاء الاصطناعي لن تعمل بشكل كامل.</p>
             </div>
           </div>
        )}

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <header className="text-center py-10 space-y-4">
               <h1 className="text-4xl font-extrabold text-slate-900">
                 بوابتك الذكية لقطع الغيار
               </h1>
               <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                 أسرع طريقة لإيجاد القطعة المناسبة لسيارتك الصينية، الكورية، أو الأمريكية باستخدام تقنيات الذكاء الاصطناعي.
               </p>
               <div className="flex justify-center gap-4 pt-4">
                 <button 
                  onClick={() => setActiveTab('search')}
                  className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
                 >
                   ابحث عن قطعة
                 </button>
                 <button 
                  onClick={() => setActiveTab('subscription')}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-full font-bold shadow-sm transition-all"
                 >
                   سجل كتاجر
                 </button>
               </div>
            </header>
            
            <CategorySection onSelectCategory={handleCategorySelect} />
            
            {/* Display some latest items for customers to see */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">منتجات وصلت حديثاً</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {inventory.slice(0, 4).map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">{item.origin}</span>
                       <span className="font-bold text-primary">{item.price} ر.س</span>
                     </div>
                     <h4 className="font-bold text-slate-800 mb-1 truncate">{item.name}</h4>
                     <p className="text-xs text-slate-500 font-mono">{item.partNumber}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-6">
             {selectedCategory && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Filter size={20} />
                    <span className="font-bold">تصفية حسب: {selectedCategory}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <X size={16} />
                    إلغاء التصفية
                  </button>
                </div>
              )}
             <SearchInterface inventory={filteredInventory} />
          </div>
        )}

        {/* INVENTORY / MERCHANT TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {!isSubscribed ? (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center py-20 px-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-slate-400" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">هذه المنطقة مخصصة للتجار</h2>
                <p className="text-slate-500 max-w-lg mx-auto mb-8 text-lg">
                  لإضافة المنتجات وإدارة المخزون واستخدام أدوات التحليل المتقدمة، يجب الاشتراك في باقة التاجر الشهرية.
                </p>
                <button 
                  onClick={() => setActiveTab('subscription')}
                  className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all"
                >
                  عرض باقات الاشتراك
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">لوحة تحكم التاجر</h2>
                    <p className="text-green-600 font-medium flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      اشتراك نشط: باقة التاجر المميزة
                    </p>
                  </div>
                  <button 
                    onClick={() => { setIsSubscribed(false); setActiveTab('home'); }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    تسجيل الخروج
                  </button>
                </div>

                <InventoryUpload setInventory={setInventory} currentCount={inventory.length} />
                
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="font-bold text-lg">سجل المخزون الحالي</h3>
                    
                    {/* Merchant Filter Bar */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMerchantFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          merchantFilter === 'ALL'
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        الكل
                      </button>
                      {Object.values(CarOrigin).map(origin => (
                        <button
                          key={origin}
                          onClick={() => setMerchantFilter(origin)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            merchantFilter === origin
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {origin}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="p-4">رقم القطعة</th>
                          <th className="p-4">الاسم</th>
                          <th className="p-4">المنشأ</th>
                          <th className="p-4">السعر</th>
                          <th className="p-4">الكمية</th>
                          <th className="p-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inventory
                          .filter(item => merchantFilter === 'ALL' || item.origin === merchantFilter)
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-mono text-slate-600">{item.partNumber}</td>
                              <td className="p-4 font-medium text-slate-800">{item.name}</td>
                              <td className="p-4">
                                <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200">
                                  {item.origin}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-slate-700">{item.price} ر.س</td>
                              <td className="p-4">
                                <span className={`${item.quantity < 5 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="p-4">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                              </td>
                            </tr>
                          ))}
                          
                          {inventory.filter(item => merchantFilter === 'ALL' || item.origin === merchantFilter).length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500">
                                لا توجد قطع مطابقة للفلتر المحدد.
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <SubscriptionPlans 
            isSubscribed={isSubscribed} 
            onSubscribe={handleSubscribe} 
          />
        )}
      </main>
    </div>
  );
};

export default App;