import React, { useState } from 'react';
import { Plus, Edit2, Copy, Trash2, HelpCircle, ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import RoleEditModal from './RoleEditModal';

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    users: string[]; // usernames for hover
    isDefault: boolean;
    level?: number;
    permissions: Record<string, boolean>;
}

const mockRoles: Role[] = [
    { id: 'om', name: 'Quản lý vận hành (OM)', description: 'Giám đốc Vận hành', userCount: 1, users: ['admin_om'], isDefault: true, level: 3, permissions: {} },
    { id: 'sup', name: 'Trưởng nhóm (Sup)', description: 'Quản lý khu vực', userCount: 5, users: ['sup_hcm', 'sup_hn'], isDefault: true, level: 2, permissions: {} },
    { id: 'cht', name: 'Cửa hàng trưởng (CHT)', description: 'Quản lý cửa hàng', userCount: 24, users: ['cht_01', 'cht_02'], isDefault: true, level: 1, permissions: {} },
    { id: 'admin_branch', name: 'Quản trị chi nhánh', description: '', userCount: 10, users: ['admin1', 'admin2'], isDefault: false, permissions: {} },
    { id: 'store_clerk', name: 'Nhân viên kho', description: '', userCount: 8, users: ['kho1', 'kho2'], isDefault: false, permissions: {} },
    { id: 'cashier', name: 'Nhân viên thu ngân', description: '', userCount: 15, users: ['media', 'HoangAnh', 'ktadmin'], isDefault: false, permissions: {} },
];

export default function RoleManagement() {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const handleCreateRole = () => {
        setEditingRole(null);
        setIsEditModalOpen(true);
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setIsEditModalOpen(true);
    };

    const handleDeleteRole = (id: string, isDefault: boolean) => {
        if (isDefault) return;
        setRoles(roles.filter(r => r.id !== id));
    };

    const handleSaveRole = (roleData: any) => {
        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...roleData } : r));
        } else {
            setRoles([...roles, { ...roleData, id: Math.random().toString(), userCount: 0, users: [], isDefault: false }]);
        }
    };

    return (
        <div className="flex h-full min-h-0 p-6 gap-6 bg-white overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white min-w-0 min-h-0">
                <div className="pb-4 flex justify-end shrink-0">
                    <Button onClick={handleCreateRole} className="h-9 px-4 text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm">
                        <Plus size={16} className="mr-2" /> Tạo vai trò
                    </Button>
                </div>

                <div className="flex-1 overflow-auto border border-gray-200 rounded-md">
                    <Table>
                        <TableHeader className="bg-gray-50/80 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 w-1/3 min-w-[250px]">Vai trò</TableHead>
                                <TableHead className="font-semibold text-gray-700 w-1/3 min-w-[200px]">Mô tả</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-center min-w-[150px]">Tài khoản</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-right min-w-[120px]">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium text-gray-900 border-r border-[#f0f0f0] last:border-r-0 pl-4 py-3">{role.name}</TableCell>
                                    <TableCell className="text-gray-600 border-r border-[#f0f0f0] last:border-r-0 py-3">{role.description}</TableCell>
                                    <TableCell className="text-center border-r border-[#f0f0f0] last:border-r-0 py-3">
                                        <Popover>
                                            <PopoverTrigger className="inline-flex items-center justify-center cursor-pointer text-gray-600 group hover:bg-transparent">
                                                {role.userCount} tài khoản. <span className="text-blue-600 ml-1 group-hover:underline">Xem</span>
                                            </PopoverTrigger>
                                            <PopoverContent align="center" className="w-auto p-4 z-50">
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-gray-900">{role.userCount} tài khoản người dùng</h4>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {role.users.map((u, i) => (
                                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                                                {u}
                                                            </span>
                                                        ))}
                                                        {role.userCount > role.users.length && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">...</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className="text-right py-3 pr-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEditRole(role)}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                                                <Copy size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={`h-8 w-8 p-0 ${role.isDefault ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                                                disabled={role.isDefault}
                                                onClick={() => handleDeleteRole(role.id, role.isDefault)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination (Visual only based on image) */}
                <div className="pt-4 bg-white flex items-center justify-start gap-2 text-sm text-gray-600 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 px-2 border-gray-200 text-gray-500" disabled><ChevronLeft size={16}/></Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-blue-500 text-blue-600 bg-blue-50 font-medium">1</Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 border-gray-200 text-gray-500"><ChevronRight size={16}/></Button>
                    <span className="ml-4 text-xs font-medium border-l border-gray-300 pl-4 py-1">1 - {roles.length} trong {roles.length} vai trò</span>
                </div>
            </div>

            {/* Hint Sidebar */}
            <div className="w-64 shrink-0 bg-white border-l border-gray-200 pl-6 hidden lg:block self-start h-full">
                <div className="flex items-center gap-2 text-blue-600 font-medium mb-3">
                    <HelpCircle size={18} />
                    <span>Gợi ý</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Thiết lập quyền mặc định theo vai trò để phân quyền người dùng nhanh chóng.
                </p>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                    Tìm hiểu cách thiết lập tài khoản người dùng và vai trò
                </a>
            </div>

            {isEditModalOpen && (
                <RoleEditModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    role={editingRole} 
                    onSave={handleSaveRole}
                />
            )}
        </div>
    );
}
