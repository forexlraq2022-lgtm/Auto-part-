import React from 'react';
import { InventoryItem, CarOrigin } from '../types';
import { Package, Tag, Globe, User } from 'lucide-react';

interface ProductCardProps {
  item: InventoryItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const getOriginColor = (origin: CarOrigin) => {
    switch (origin) {
      case CarOrigin.KOREAN: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CarOrigin.CHINESE: return 'bg-red-100 text-red-800 border-red-200';
      case CarOrigin.AMERICAN: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-50 flex justify-between items-start">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOriginColor(item.origin)}`}>
          {item.origin}
        </span>
        <span className="text-lg font-bold text-slate-900">{item.price} ر.س</span>
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2">{item.name}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <Tag size={14} />
          <span className="font-mono">{item.partNumber}</span>
        </div>
        
        <div className="space-y-2">
          {item.customerRef && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
              <User size={14} />
              <span>عميل: {item.customerRef}</span>
            </div>
          )}
          {item.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-50 px-4 py-3 flex justify-between items-center text-sm">
        <span className={`font-medium ${item.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {item.quantity > 0 ? `متوفر (${item.quantity})` : 'نفذت الكمية'}
        </span>
        <button className="text-primary hover:text-blue-700 font-medium">التفاصيل</button>
      </div>
    </div>
  );
};

export default ProductCard;
