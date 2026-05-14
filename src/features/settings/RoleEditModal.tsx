import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, ChevronUp, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '../../components/ui/scroll-area';

export interface PermissionSection {
    id: string;
    title: string;
    view?: { id: string; label: string }[];
    create?: { id: string; label: string }[];
    edit?: { id: string; label: string }[];
    delete?: { id: string; label: string }[];
    others?: { id: string; label: string }[];
}

export interface PermissionCategory {
    id: string;
    title: string;
    description: string;
    sections: PermissionSection[];
}

export interface PermissionGroup {
    id: string;
    title: string;
    categories: PermissionCategory[];
}

const PERMISSION_MATRIX: PermissionGroup[] = [
    {
        id: 'tongquan', title: 'Tổng quan', categories: [
            { id: 'cat_tongquan', title: 'Tổng quan', description: '', sections: [
                { id: 'sec_tongquan', title: 'Xem tổng quan', view: [{ id: 'view_tongquan', label: 'Xem tổng quan Dashboard' }] }
            ]}
        ]
    },
    {
        id: 'tochuc', title: 'Cửa hàng & Tổ chức', categories: [
            {
                id: 'cat_tochuc', title: 'Sơ đồ tổ chức', description: 'Quản lý Chi nhánh, Khu vực, Cụm hỗ trợ',
                sections: [
                    {
                        id: 'sec_chinhanh', title: 'Chi nhánh & Khu vực',
                        view: [{ id: 'view_branch', label: 'Chi nhánh' }],
                        create: [{ id: 'create_branch', label: 'Chi nhánh' }],
                        edit: [{ id: 'edit_branch', label: 'Chi nhánh' }],
                        delete: [{ id: 'delete_branch', label: 'Chi nhánh' }],
                        others: [
                            { id: 'assign_manager', label: 'Gán Quản lý/Sup' },
                            { id: 'setup_gps', label: 'Cấu hình WiFi/GPS điểm danh' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'nhansu', title: 'Hồ sơ Nhân sự', categories: [
            {
                id: 'cat_nhansu', title: 'Quản lý Nhân viên', description: 'Hồ sơ, Kỹ năng, HĐLĐ',
                sections: [
                    {
                        id: 'sec_nhanvien', title: 'Danh sách nhân viên',
                        view: [{ id: 'view_emp', label: 'Nhân viên' }],
                        create: [{ id: 'create_emp', label: 'Nhân viên' }],
                        edit: [{ id: 'edit_emp', label: 'Nhân viên' }],
                        delete: [{ id: 'delete_emp', label: 'Nhân viên' }],
                        others: [
                            { id: 'edit_skill', label: 'Cập nhật Tag Kỹ năng' },
                            { id: 'view_contract', label: 'Xem lương & HĐLĐ' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'chamcong', title: 'Chấm công & Ca', categories: []
    },
    {
        id: 'tinhluong', title: 'Tính lương', categories: []
    },
    {
        id: 'ticket', title: 'Phê duyệt Ticket', categories: []
    },
    {
        id: 'thietlap', title: 'Thiết lập hệ thống', categories: [
             {
                id: 'cat_thietlap', title: 'Thiết lập hệ thống', description: 'Phân quyền, Tham số toàn cục',
                sections: [
                    {
                        id: 'sec_rbac', title: 'Vai trò & Phân quyền',
                        view: [{ id: 'view_role', label: 'Vai trò' }],
                        create: [{ id: 'create_role', label: 'Vai trò' }],
                        edit: [{ id: 'edit_role', label: 'Vai trò' }],
                        delete: [{ id: 'delete_role', label: 'Vai trò' }],
                    },
                    {
                         id: 'sec_global', title: 'Tham số toàn cục',
                         view: [{ id: 'view_global', label: 'Tham số' }],
                         create: [],
                         edit: [{ id: 'edit_global', label: 'Sửa Tham số & SLA' }],
                         delete: [],
                    }
                ]
             }
        ]
    },
];

export default function RoleEditModal({ isOpen, onClose, role, onSave }: { isOpen: boolean, onClose: () => void, role: any, onSave: (data: any) => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [activeTab, setActiveTab] = useState('tongquan');
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'sec_chinhanh': true,
        'sec_nhanvien': true
    });

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description);
            setPermissions(role.permissions || {});
        } else {
            setName('');
            setDescription('');
            setPermissions({});
        }
    }, [role]);

    const handleTogglePermission = (id: string, checked: boolean) => {
        setPermissions(prev => ({ ...prev, [id]: checked }));
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        onSave({ name, description, permissions });
        onClose();
    };

    const activeGroup = PERMISSION_MATRIX.find(g => g.id === activeTab);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[1100px] w-[90vw] max-w-none h-[90vh] flex flex-col p-0 bg-white overflow-hidden gap-0 rounded-lg" showCloseButton={false}>
                <DialogHeader className="p-6 pb-4 border-b border-gray-200 shrink-0 relative bg-white z-10 flex flex-row justify-between items-center">
                    <DialogTitle className="text-xl font-bold text-gray-900">{role ? 'Sửa vai trò' : 'Thêm vai trò'}</DialogTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 rounded-full" onClick={onClose}><X size={18} /></Button>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 pb-2 shrink-0">
                        <div className="grid grid-cols-2 gap-6 relative">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 border-gray-300 focus-visible:ring-blue-500" placeholder="Ngắn gọn, rõ ràng" disabled={role?.isDefault} />
                            </div>
                            <div className="flex items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-10 border-gray-300 focus-visible:ring-blue-500" placeholder="Nhập mô tả" />
                                </div>
                                <div className="ml-4 text-blue-600 font-medium text-sm flex items-center whitespace-nowrap cursor-pointer hover:underline mb-2">
                                     <Search size={16} className="mr-1" />
                                     Ctrl+F để tìm phân quyền
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden mt-4 border-t border-gray-200">
                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 bg-white" id="main-scroll-area">
                            {(activeGroup?.categories || []).length > 0 ? (
                                activeGroup?.categories.map(category => (
                                    <div key={category.id} className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h3>
                                        {category.description && <p className="text-sm text-gray-500 mb-4">{category.description}</p>}
                                        
                                        <div className="space-y-4">
                                            {category.sections.map(section => {
                                                const isExpanded = expandedSections[section.id];
                                                
                                                // Handle general overview "Xem tổng quan" style layout (flat)
                                                if (category.id === 'cat_tongquan') {
                                                     return (
                                                         <div key={section.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                                                             {section.view?.map(v => (
                                                                 <div key={v.id} className="flex items-center space-x-2">
                                                                     <Checkbox id={v.id} checked={!!permissions[v.id]} onCheckedChange={(c) => handleTogglePermission(v.id, !!c)} />
                                                                     <label htmlFor={v.id} className="text-sm font-medium text-gray-700 cursor-pointer">{v.label}</label>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     )
                                                }

                                                return (
                                                    <div key={section.id} className="border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
                                                        <div 
                                                            className="flex items-center justify-between p-3 px-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                                                            onClick={() => toggleSection(section.id)}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded text-white font-bold text-lg leading-none cursor-pointer">
                                                                    {isExpanded ? '-' : '+'}
                                                                </div>
                                                                <span className="font-semibold text-gray-800 text-sm">{section.title}</span>
                                                            </div>
                                                            <div className="text-gray-400">
                                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                            </div>
                                                        </div>
                                                        
                                                        {isExpanded && (
                                                            <div className="p-5">
                                                                <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                                                                    {/* Xem */}
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Xem</h4>
                                                                        <div className="space-y-2.5">
                                                                            {section.view?.map(item => (
                                                                                <div key={item.id} className="flex items-center space-x-2">
                                                                                    <Checkbox id={item.id} checked={!!permissions[item.id]} onCheckedChange={(c) => handleTogglePermission(item.id, !!c)} />
                                                                                    <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">{item.label}</label>
                                                                                </div>
                                                                            ))}
                                                                            {(!section.view || section.view.length === 0) && <span className="text-sm text-gray-400 italic">--</span>}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Tạo */}
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Tạo</h4>
                                                                        <div className="space-y-2.5">
                                                                            {section.create?.map(item => (
                                                                                <div key={item.id} className="flex items-center space-x-2">
                                                                                    <Checkbox id={item.id} checked={!!permissions[item.id]} onCheckedChange={(c) => handleTogglePermission(item.id, !!c)} />
                                                                                    <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">{item.label}</label>
                                                                                </div>
                                                                            ))}
                                                                            {(!section.create || section.create.length === 0) && <span className="text-sm text-gray-400 italic">--</span>}
                                                                        </div>
                                                                    </div>

                                                                    {/* Chỉnh sửa */}
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Chỉnh sửa</h4>
                                                                        <div className="space-y-2.5">
                                                                            {section.edit?.map(item => (
                                                                                <div key={item.id} className="flex items-center space-x-2">
                                                                                    <Checkbox id={item.id} checked={!!permissions[item.id]} onCheckedChange={(c) => handleTogglePermission(item.id, !!c)} />
                                                                                    <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">{item.label}</label>
                                                                                </div>
                                                                            ))}
                                                                            {(!section.edit || section.edit.length === 0) && <span className="text-sm text-gray-400 italic">--</span>}
                                                                        </div>
                                                                    </div>

                                                                    {/* Xóa / Hủy */}
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">{category.id === 'cat_khohang' ? 'Huỷ' : 'Xóa'}</h4>
                                                                        <div className="space-y-2.5">
                                                                            {section.delete?.map(item => (
                                                                                <div key={item.id} className="flex items-center space-x-2">
                                                                                    <Checkbox id={item.id} checked={!!permissions[item.id]} onCheckedChange={(c) => handleTogglePermission(item.id, !!c)} />
                                                                                    <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">{item.label}</label>
                                                                                </div>
                                                                            ))}
                                                                            {(!section.delete || section.delete.length === 0) && <span className="text-sm text-gray-400 italic">--</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Khác */}
                                                                {section.others && section.others.length > 0 && (
                                                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Khác</h4>
                                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                                            {section.others.map(item => (
                                                                                <div key={item.id} className="flex items-center space-x-2">
                                                                                    <Checkbox id={item.id} checked={!!permissions[item.id]} onCheckedChange={(c) => handleTogglePermission(item.id, !!c)} />
                                                                                    <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">{item.label}</label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Tính năng đang được phát triển
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar Menu inside modal */}
                        <div className="w-56 border-l border-gray-200 bg-gray-50/30 shrink-0 overflow-y-auto">
                            <ul className="py-2">
                                {PERMISSION_MATRIX.map(group => (
                                    <li key={group.id}>
                                        <button
                                            onClick={() => setActiveTab(group.id)}
                                            className={`w-full text-left px-5 py-2.5 text-sm transition-colors relative ${
                                                activeTab === group.id 
                                                ? 'text-blue-600 font-medium bg-blue-50/50' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            {activeTab === group.id && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600" />}
                                            {group.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t border-gray-200 bg-white sticky bottom-0 shrink-0 flex justify-between items-center sm:justify-between">
                    <div>
                        {role && (
                           <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto" disabled={role.isDefault}>
                               <Trash2 size={16} className="mr-2" /> Xóa vai trò
                           </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="px-6 border-gray-300 shadow-sm" onClick={onClose}>Bỏ qua</Button>
                        <Button className="px-8 bg-blue-600 hover:bg-blue-700 font-medium" onClick={handleSave}>Lưu</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
