import React, { useState, useRef } from 'react';
import { Search, Camera, Loader2, Sparkles, Image as ImageIcon, X, Package } from 'lucide-react';
import { InventoryItem, AISearchResult } from '../types';
import { analyzePartImage, fileToBase64 } from '../services/geminiService';
import ProductCard from './ProductCard';

interface SearchInterfaceProps {
  inventory: InventoryItem[];
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Text Search
  const filteredInventory = inventory.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesText = item.name.toLowerCase().includes(term) || 
                        item.partNumber.toLowerCase().includes(term) ||
                        item.description?.toLowerCase().includes(term);

    // If AI found part numbers, include matches for those too
    const matchesAI = aiResult?.possiblePartNumbers?.some(pn => 
      item.partNumber.toLowerCase().includes(pn.toLowerCase())
    ) || (aiResult && item.name.includes(aiResult.detectedName));

    return matchesText || (aiResult && matchesAI);
  });

  // Handle Image Upload & AI Analysis
  const handleImageUpload = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setAiResult(null);
      const base64 = await fileToBase64(file);
      setSelectedImage(`data:image/jpeg;base64,${base64}`);

      const result = await analyzePartImage(base64);
      setAiResult(result);
      
      // Auto-fill search term with detected name to help user
      if (result.detectedName && result.detectedName !== 'غير معروف') {
        setSearchTerm(result.detectedName);
      }
    } catch (error) {
      console.error(error);
      alert('فشل تحليل الصورة. يرجى التأكد من مفتاح API والمحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAiResult(null);
    setSearchTerm('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-secondary to-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ابحث عن أي قطعة غيار في ثوانٍ</h1>
          <p className="text-slate-300 text-lg">استخدم رقم القطعة، الاسم، أو فقط قم بتصوير القطعة القديمة وسيتولى الذكاء الاصطناعي الباقي.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Text Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم القطعة أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-slate-400 pr-12 pl-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
              />
            </div>

            {/* Image Search Button */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Camera />
                )}
                <span>بحث بالصورة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Result Section */}
      {selectedImage && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden animate-fade-in">
          <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-64 h-64 bg-slate-100 rounded-xl overflow-hidden shrink-0 group">
               <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover" />
               <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
               >
                 <X size={16} />
               </button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-wide text-sm uppercase">
                <Sparkles size={16} />
                تحليل الذكاء الاصطناعي
              </div>
              
              {isAnalyzing ? (
                <div className="flex flex-col gap-3">
                  <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : aiResult ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {aiResult.detectedName}
                    <span className="mr-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      دقة: {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {aiResult.description}
                  </p>
                  
                  {aiResult.possiblePartNumbers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-slate-500 self-center">أرقام محتملة:</span>
                      {aiResult.possiblePartNumbers.map((num, idx) => (
                        <span key={idx} className="bg-slate-800 text-white px-3 py-1 rounded font-mono text-sm">
                          {num}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">نتائج البحث ({filteredInventory.length})</h2>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-red-500 text-sm hover:underline"
            >
              مسح البحث
            </button>
          )}
        </div>
        
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600">لا توجد نتائج مطابقة</h3>
            <p className="text-slate-400">حاول البحث بكلمات مختلفة أو تأكد من إضافة القطع للمخزون</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;