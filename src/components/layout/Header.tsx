import React, { useState } from 'react';
import { Bell, HelpCircle, User, Settings, ShoppingCart, Package, ArrowRightLeft, Users, Wallet, CreditCard, Store, ShieldCheck, Database, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface HeaderProps {
  currentModule: 'employees' | 'timesheet' | 'scheduling' | 'payroll' | 'settings';
  setCurrentModule: (module: 'employees' | 'timesheet' | 'scheduling' | 'payroll' | 'settings') => void;
  onOpenApprovals: () => void;
}

const navItems = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'products', label: 'Hàng hóa' },
  { id: 'purchases', label: 'Mua hàng' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'customers', label: 'Khách hàng' },
  { id: 'employees', label: 'Nhân sự' },
  { id: 'timesheet', label: 'Khách & Chấm công' },
  { id: 'scheduling', label: 'Xếp ca' },
  { id: 'payroll', label: 'Bảng lương' },
  { id: 'cash', label: 'Sổ quỹ' },
  { id: 'analytics', label: 'Phân tích' },
];

export default function Header({ currentModule, setCurrentModule, onOpenApprovals }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const viewAllSettings = () => {
    setCurrentModule('settings');
    setIsSettingsOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white flex flex-col shadow-sm shrink-0">
      <div className="flex items-center justify-between px-4 h-12 border-b border-blue-500/30">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-blue-900 border-2 border-white">
            <span className="text-xl">K</span>
          </div>
          <span>KiotViet</span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6 text-sm flex-1 justify-end mr-2 md:mr-6">
          <button className="flex items-center space-x-1 hover:text-blue-200 transition truncate max-w-[150px] md:max-w-none">
            <span className="truncate">Chi nhánh trung tâm</span>
            <span className="text-xs shrink-0">▼</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
           <button className="hover:text-blue-200 transition hidden sm:block">
             <span>Giao hàng</span>
           </button>
           <button className="hover:text-blue-200 transition flex items-center space-x-1">
             <HelpCircle size={16} /> <span className="hidden sm:inline">Hỗ trợ</span>
           </button>
           <button className="hover:bg-blue-700 p-1.5 rounded-full transition relative" onClick={onOpenApprovals}>
              <Bell size={18} />
              <span className="absolute top-0 right-0 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-blue-600">
                5
              </span>
           </button>
           
           <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
             <PopoverTrigger className="hover:bg-blue-700 p-1.5 rounded-full transition">
               <Settings size={18} />
             </PopoverTrigger>
             <PopoverContent className="w-80 p-0 mr-4 mt-2" align="end">
                <div className="flex flex-col py-2 max-h-[70vh] overflow-y-auto">
                    {/* Popover Items */}
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <Package size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Hàng hóa</div>
                            <div className="text-xs text-gray-500">Thông tin, Nhập hàng, Nhà cung cấp</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <ArrowRightLeft size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Đơn hàng</div>
                            <div className="text-xs text-gray-500">Đặt hàng, Bán hàng, Trả hàng</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <Users size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Khách hàng</div>
                            <div className="text-xs text-gray-500">Tích điểm, Khuyến mại</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <Wallet size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Sổ quỹ</div>
                            <div className="text-xs text-gray-500">Tài khoản ngân hàng, Ví điện tử</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <CreditCard size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Tiện ích</div>
                            <div className="text-xs text-gray-500">Giao hàng, Thanh toán</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <Store size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Cửa hàng</div>
                            <div className="text-xs text-gray-500">Thông tin, Người dùng, Chi nhánh, Bảo mật</div>
                        </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex gap-3">
                        <Database size={18} className="text-gray-500 mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Dữ liệu và Lịch sử thao tác</div>
                            <div className="text-xs text-gray-500">Khoá sổ, Lịch sử thao tác, Xoá dữ liệu</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t bg-gray-50">
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={viewAllSettings}>
                        Xem tất cả thiết lập
                    </Button>
                </div>
             </PopoverContent>
           </Popover>

           <button className="bg-blue-500 hover:bg-blue-400 p-1.5 rounded-full transition relative">
              <User size={18} />
           </button>
        </div>
      </div>
      
      <div className="flex items-center px-2 h-10 overflow-x-auto space-x-1 no-scrollbar shrink-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'employees' || item.id === 'timesheet' || item.id === 'scheduling' || item.id === 'payroll') {
                setCurrentModule(item.id as any);
              }
            }}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-md transition ${
              (currentModule === item.id) 
                ? 'bg-white text-blue-700 font-semibold shadow-[0_-2px_0_0_#fff]' 
                : 'text-white/90 hover:bg-blue-500'
            }`}
          >
            {item.label}
          </button>
        ))}
         <div className="ml-auto pr-2 flex items-center">
            <Button variant="secondary" size="sm" className="h-7 text-xs bg-white text-blue-700 hover:bg-gray-100 flex items-center gap-2">
              <ShoppingCart size={14} /> Bán hàng
            </Button>
         </div>
      </div>
    </header>
  );
}
