import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import BranchManagement from './BranchManagement';
import UserManagement from './UserManagement';
import SkillTagsManagement from './SkillTagsManagement';
import GlobalSettings from './GlobalSettings';
import PayrollSettings from './PayrollSettings';
import ShiftSettings from './ShiftSettings';
import NetworkSettings from './NetworkSettings';
import RoleManagement from './RoleManagement';

const menuSections = [
    {
        title: 'Tổ chức & Cửa hàng',
        items: [
            { id: 'branches', label: 'Quản lý Chi nhánh', icon: null },
            { id: 'shift-settings', label: 'Lịch mẫu & Định biên', icon: null },
            { id: 'network', label: 'Tập trung Điểm danh', icon: null },
        ]
    },
    {
        title: 'Nhân viên & Phân quyền',
        items: [
            { id: 'users', label: 'Tài khoản hệ thống', icon: null },
            { id: 'roles', label: 'Vai trò & Phân quyền', icon: null },
            { id: 'settings-skilltags', label: 'Quản lý Skill Tags', icon: null },
        ]
    },
    {
        title: 'Chính sách vận hành',
        items: [
            { id: 'global-settings', label: 'Tham số Toàn cục & SLA', icon: null },
            { id: 'settings-tinhluong', label: 'Chính sách Lương', icon: null },
        ]
    }
];

export default function SettingsLayout() {
    const [activeSection, setActiveSection] = useState('branches');

    return (
        <div className="flex flex-col md:flex-row flex-1 w-full min-h-0 bg-white overflow-hidden">
            {/* Mobile Settings Menu Header */}
            <div className="md:hidden p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
                 <h2 className="text-xl font-bold text-gray-800 mb-2">Thiết lập</h2>
                 <select 
                    value={activeSection}
                    onChange={(e) => setActiveSection(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                     {menuSections.map(section => (
                         <optgroup key={section.title || 'general'} label={section.title || 'Chung'}>
                             {section.items.map(item => (
                                 <option key={item.id} value={item.id}>{item.label}</option>
                             ))}
                         </optgroup>
                     ))}
                 </select>
            </div>

            {/* Sidebar Settings Menu (Desktop) */}
            <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0 h-full hidden md:flex">
                <div className="p-4 border-b border-gray-200 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Thiết lập</h2>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="mb-4">
                            {section.title && (
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">
                                    {section.title}
                                </h3>
                            )}
                            <ul className="space-y-0.5">
                                {section.items.map(item => (
                                    <li key={item.id}>
                                        <button 
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                                                activeSection === item.id 
                                                ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600 pl-3' 
                                                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent pl-3'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-gray-50 overflow-hidden">
                {/* Global Search Bar Area for Settings */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0 shadow-sm relative z-10">
                    <div className="relative w-96 max-w-md">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <Input placeholder="Tìm kiếm thiết lập" className="pl-9 h-9 border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500" />
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 min-h-0 overflow-hidden p-6 flex flex-col">
                    {activeSection === 'branches' ? (
                        <BranchManagement />
                    ) : activeSection === 'shift-settings' ? (
                        <ShiftSettings />
                    ) : activeSection === 'network' ? (
                        <NetworkSettings />
                    ) : activeSection === 'users' ? (
                        <UserManagement />
                    ) : activeSection === 'roles' ? (
                        <RoleManagement />
                    ) : activeSection === 'settings-skilltags' ? (
                        <SkillTagsManagement />
                    ) : activeSection === 'settings-tinhluong' ? (
                        <PayrollSettings />
                    ) : activeSection === 'global-settings' ? (
                        <GlobalSettings />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Tính năng đang được phát triển
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
