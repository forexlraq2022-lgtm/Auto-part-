import React from 'react';
import { Car, Search, Upload, Database, CreditCard } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <Car size={20} /> },
    { id: 'search', label: 'بحث ذكي', icon: <Search size={20} /> },
    { id: 'inventory', label: 'منطقة التجار', icon: <Database size={20} /> },
    { id: 'subscription', label: 'باقات الاشتراك', icon: <CreditCard size={20} /> },
  ];

  return (
    <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-primary p-2 rounded-lg">
              <Car className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl hidden sm:block">AutoParts AI</span>
          </div>

          <div className="flex space-x-1 space-x-reverse bg-slate-700/50 p-1 rounded-xl overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;