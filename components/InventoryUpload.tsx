import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { InventoryItem, CarOrigin } from '../types';

interface InventoryUploadProps {
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  currentCount: number;
}

const InventoryUpload: React.FC<InventoryUploadProps> = ({ setInventory, currentCount }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to parse CSV manually to avoid heavy xlsx library dependency in this demo environment
  // In a real production app, we would use SheetJS (xlsx).
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const items: InventoryItem[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(',');
      if (cols.length < 3) continue;

      // Map origin string to Enum
      let origin = CarOrigin.OTHER;
      const originStr = cols[2]?.trim().toLowerCase();
      if (originStr?.includes('كوري') || originStr?.includes('korea')) origin = CarOrigin.KOREAN;
      else if (originStr?.includes('صيني') || originStr?.includes('china')) origin = CarOrigin.CHINESE;
      else if (originStr?.includes('أمريكي') || originStr?.includes('usa') || originStr?.includes('american')) origin = CarOrigin.AMERICAN;

      items.push({
        id: Math.random().toString(36).substr(2, 9),
        partNumber: cols[0]?.trim() || 'N/A',
        name: cols[1]?.trim() || 'قطعة غير معروفة',
        origin: origin,
        price: parseFloat(cols[3]) || 0,
        quantity: parseInt(cols[4]) || 0,
        customerRef: cols[5]?.trim() || '',
        description: cols[6]?.trim() || ''
      });
    }
    return items;
  };

  const handleFile = (file: File) => {
    setError(null);
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('يرجى رفع ملف CSV. (في هذا العرض التوضيحي نستخدم CSV لضمان التوافق بدون مكتبات خارجية)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const newItems = parseCSV(text);
        setInventory(prev => [...prev, ...newItems]);
      } catch (err) {
        setError('حدث خطأ أثناء قراءة الملف. تأكد من تنسيق البيانات.');
      }
    };
    reader.readAsText(file);
  };

  const generateTemplate = () => {
    const header = "PartNumber,PartName,Origin,Price,Quantity,CustomerRef,Description\n";
    const sample1 = "58101-2S000,فحمات فرامل أمامية,كوري,120,50,CUST-001,هيونداي توسان 2015\n";
    const sample2 = "CN-FILTER-99,فلتر زيت,صيني,25,200,CUST-002,شانجان ايدو\n";
    const sample3 = "GM-123456,بواجي,أمريكي,80,100,CUST-003,شيفروليه تاهو\n";
    
    const blob = new Blob([header + sample1 + sample2 + sample3], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "inventory_template.csv";
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" />
            إدارة المخزون
          </h2>
          <p className="text-slate-500 mt-1">قم برفع ملفات Excel/CSV لتحديث قاعدة البيانات</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
          إجمالي القطع: {currentCount}
        </div>
      </div>

      <div
        className={`border-3 border-dashed rounded-xl p-10 text-center transition-all ${
          isDragOver ? 'border-primary bg-blue-50' : 'border-slate-300 hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
      >
        <Upload className="mx-auto h-16 w-16 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          اسحب وأفلت ملف البيانات هنا
        </h3>
        <p className="text-slate-500 mb-6">أو انقر لاختيار ملف من جهازك</p>
        
        <label className="inline-block cursor-pointer">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <span className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
            تصفح الملفات
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
        <div className="text-sm text-slate-500">
          * الملف يجب أن يحتوي على الأعمدة التالية: رقم القطعة، الاسم، المنشأ، السعر.
        </div>
        <button 
          onClick={generateTemplate}
          className="text-primary hover:underline text-sm font-medium"
        >
          تحميل ملف تجريبي (Template)
        </button>
      </div>
    </div>
  );
};

export default InventoryUpload;
