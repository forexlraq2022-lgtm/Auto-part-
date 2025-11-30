import React from 'react';
import { CarOrigin } from '../types';
import { ChevronLeft } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (origin: CarOrigin) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: CarOrigin.KOREAN,
      title: 'سيارات كورية',
      count: 'هيونداي، كيا، جينيسيس',
      image: 'https://images.unsplash.com/photo-1590051263300-d83b5f9392c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: CarOrigin.AMERICAN,
      title: 'سيارات أمريكية',
      count: 'شيفروليه، فورد، جي إم سي',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-indigo-600 to-indigo-800'
    },
    {
      id: CarOrigin.CHINESE,
      title: 'سيارات صينية',
      count: 'جيلي، شانجان، هافال',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-red-600 to-red-800'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">تصفح حسب المنشأ</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.title}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10"></div>
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-slate-300 text-sm mb-4">{cat.count}</p>
              <div className="flex items-center text-white/80 text-sm font-medium group-hover:text-white group-hover:gap-2 transition-all">
                <span>تصفح القطع</span>
                <ChevronLeft size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
