import React, { useState } from 'react';
import { Filter, Plus, Trash2, Edit2, AlertCircle, Store, Settings, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const initialBranches = [
    { id: '1', name: 'Chi nhánh trung tâm', address: 'Sài Gòn, Phường Hòa Hưng, Thành phố Hồ Chí Minh', phone: '0906026844', userCount: 44, timezone: '', status: 'Đang hoạt động', region: 'R1', manager: 'NV1', supervisors: ['NV2', 'NV3'] },
    { id: '2', name: 'ECOM', address: '284/25/5 Lý Thường Kiệt', phone: '1900 9368', userCount: 31, timezone: '', status: 'Đang hoạt động', region: 'R1', manager: 'NV4', supervisors: ['NV2'] },
    { id: '3', name: 'HKM BÀ RỊA', address: '39 Cách Mạng Tháng 8', phone: '+84335756665', userCount: 21, timezone: '', status: 'Đang hoạt động', region: 'R2', manager: 'NV5', supervisors: ['NV6'] },
    { id: '4', name: 'HMK AEON HUẾ', address: '08 Võ Nguyên Giáp', phone: '+84337256665', userCount: 57, timezone: '', status: 'Đang hoạt động', region: 'R3', manager: 'NV7', supervisors: ['NV8'] },
    { id: '5', name: 'HMK BẠC LIÊU', address: '321-323 Trần Phú', phone: '+84325576665', userCount: 48, timezone: '', status: 'Đang hoạt động', region: 'R4', manager: 'NV9', supervisors: ['NV10'] },
    { id: '6', name: 'HMK BIÊN HOÀ 1 PVT', address: '1249 PHẠM VĂN THUẬN, TP BIÊN HOÀ', phone: '+84901046109', userCount: 113, timezone: '', status: 'Đang hoạt động', region: 'R5', manager: 'NV11', supervisors: ['NV12'] },
    { id: '7', name: 'HMK BIÊN HÒA 2 ĐK', address: '241 Đồng Khởi', phone: '+84867361241', userCount: 115, timezone: '', status: 'Đang hoạt động', region: 'R5', manager: 'NV13', supervisors: ['NV12'] },
];

const initialRegions = [
    { id: 'R1', name: 'Khu vực Hồ Chí Minh 1', description: 'Khu vực nội thành HCM', manager: 'Trần Sup A' },
    { id: 'R2', name: 'Khu vực Miền Nam', description: 'Các tỉnh Đông Nam Bộ', manager: 'Lê Quản Lý B' },
    { id: 'R3', name: 'Khu vực Miền Trung', description: 'Huế, Đà Nẵng', manager: '' },
    { id: 'R4', name: 'Khu vực Miền Tây', description: 'Các tỉnh ĐBSCL', manager: '' },
    { id: 'R5', name: 'Khu vực Biên Hòa', description: 'Biên Hòa, Đồng Nai', manager: '' },
];

export default function BranchManagement() {
    const [branches, setBranches] = useState(initialBranches);
    const [regions, setRegions] = useState(initialRegions);
    
    // Tab states
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>('1');
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    
    // Region CRUD States
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<{id: string, name: string, description: string, manager: string, isNew?: boolean} | null>(null);
    const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);

    const handleSaveRegion = () => {
        if (editingRegion?.id && regions.some(r => r.id === editingRegion.id && !editingRegion.isNew)) {
            // Update
            setRegions(prev => prev.map(r => r.id === editingRegion.id ? editingRegion : r));
        } else if (editingRegion) {
            // Add
            const newId = editingRegion.id || `R${regions.length + 1}`;
            setRegions(prev => [...prev, { ...editingRegion, id: newId }]);
        }
        setIsRegionModalOpen(false);
    };

    const handleDeleteRegion = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa khu vực này?")) {
            setRegions(prev => prev.filter(r => r.id !== id));
            // Unassign branches
            setBranches(prev => prev.map(b => b.region === id ? { ...b, region: '' } : b));
            if (selectedRegionId === id) setSelectedRegionId(null);
        }
    };
    const [selectedBranchIdsToAdd, setSelectedBranchIdsToAdd] = useState<string[]>([]);
    const [selectedBranchIdsToRemove, setSelectedBranchIdsToRemove] = useState<string[]>([]);

    const handleRemoveSelectedBranchesFromRegion = (regionId: string) => {
        setBranches(prev => prev.map(b => selectedBranchIdsToRemove.includes(b.id) ? { ...b, region: '' } : b));
        setSelectedBranchIdsToRemove([]);
    };

    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-1 flex-col min-h-0">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-semibold outline-none text-gray-900 mb-1">Quản lý chi nhánh</h1>
                        <p className="text-sm text-gray-500">Quản lý thông tin, khu vực, người dùng và địa chỉ lấy hàng của các chi nhánh.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="branches" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-6 shrink-0 pt-6">
                    <TabsList>
                        <TabsTrigger value="branches">Danh sách chi nhánh</TabsTrigger>
                        <TabsTrigger value="regions">Khu vực hoạt động</TabsTrigger>
                    </TabsList>
                </div>

                {/* --- CHITIẾT CHI NHÁNH --- */}
                <TabsContent value="branches" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0 outline-none">
                    <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
                        <Button variant="outline" className="h-9 text-gray-700 font-normal">
                            <Filter size={16} className="mr-2" /> Lọc
                        </Button>
                        <Button className="h-9 bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" /> Thêm chi nhánh
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                        <Table>
                            <TableHeader className="bg-gray-50/80 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[200px]">Tên chi nhánh</TableHead>
                                    <TableHead className="font-semibold text-gray-700 w-1/3 min-w-[250px]">Địa chỉ</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Điện thoại</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[120px] text-center">Nhân sự</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[120px] text-right">Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.map(branch => (
                                    <React.Fragment key={branch.id}>
                                        <TableRow 
                                            className={`cursor-pointer transition-colors ${selectedBranchId === branch.id ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedBranchId(selectedBranchId === branch.id ? null : branch.id)}
                                        >
                                            <TableCell className={`font-medium ${selectedBranchId === branch.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                                <div className="flex items-center gap-2">
                                                    {branch.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                <div className="line-clamp-2" title={branch.address}>{branch.address}</div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{branch.phone}</TableCell>
                                            <TableCell className="text-gray-600 text-center">
                                                <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-normal">{branch.userCount}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-normal whitespace-nowrap">
                                                    {branch.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>

                                        {selectedBranchId === branch.id && (
                                            <TableRow className="bg-gray-50/30 border-b-2 border-blue-500 shadow-inner">
                                                <TableCell colSpan={5} className="p-0">
                                                    <div className="p-6 max-w-5xl">
                                                        <Tabs defaultValue="vanchuyen" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="thongtin">Thông tin</TabsTrigger>
                                <TabsTrigger value="nguoidung">Người dùng</TabsTrigger>
                                <TabsTrigger value="diachi">Địa chỉ lấy hàng</TabsTrigger>
                                <TabsTrigger value="vanchuyen">Cấu hình vận hành (Sơ đồ tổ chức)</TabsTrigger>
                                <TabsTrigger value="diemdanh">Định vị & WiFi Điểm danh</TabsTrigger>
                            </TabsList>

                                                            <TabsContent value="thongtin" className="animate-in fade-in duration-200 mt-0">
                                                                <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-8">
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 block mb-1">Tên chi nhánh:</span>
                                                                        <span className="font-medium text-sm text-gray-900 block">{branch.name}</span>
                                                                        <div className="h-px bg-gray-200 mt-2"></div>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 block mb-1">Email:</span>
                                                                        <span className="text-sm text-gray-400 block italic">Chưa có</span>
                                                                        <div className="h-px bg-gray-200 mt-2"></div>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 block mb-1">Điện thoại:</span>
                                                                        <span className="font-medium text-sm text-gray-900 block">{branch.phone}</span>
                                                                        <div className="h-px bg-gray-200 mt-2"></div>
                                                                    </div>
                                                                    <div className="col-span-3">
                                                                        <span className="text-xs text-gray-500 block mb-1">Địa chỉ:</span>
                                                                        <span className="font-medium text-sm text-gray-900 block">{branch.address}</span>
                                                                        <div className="h-px bg-gray-200 mt-2"></div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                                                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium px-2"><Trash2 size={16} className="mr-2" /> Xóa</Button>
                                                                    <Button className="bg-blue-600 hover:bg-blue-700 font-medium"><Edit2 size={16} className="mr-2" /> Chỉnh sửa</Button>
                                                                </div>
                                                            </TabsContent>

                                                            <TabsContent value="vanchuyen" className="animate-in fade-in duration-200 mt-0">
                                                                <div className="bg-white border text-sm border-blue-100 rounded-lg p-5 shadow-sm space-y-6">
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900 text-base mb-1">Sơ đồ tổ chức & Quản lý</h3>
                                                                        <p className="text-gray-500 text-sm mb-4">Gán cửa hàng vào đúng Khu vực để thiết lập luồng báo cáo và SLA.</p>
                                                                        
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            <div className="space-y-1.5">
                                                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Khu vực (Region) *</label>
                                                                                <Select 
                                                                                    value={branch.region} 
                                                                                    onValueChange={(val) => setBranches(prev => prev.map(b => b.id === branch.id ? {...b, region: val} : b))}
                                                                                >
                                                                                    <SelectTrigger className="w-full font-medium h-9"><SelectValue placeholder="Chọn khu vực" /></SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {regions.map(r => (
                                                                                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                            <div className="space-y-1.5">
                                                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Cửa hàng trưởng (CHT)</label>
                                                                                <Select defaultValue={branch.manager}>
                                                                                    <SelectTrigger className="w-full h-9 bg-gray-50/50"><SelectValue placeholder="Chọn quản lý (Có thể null)" /></SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectItem value="NV1">Dương Như Mỹ (NV001083)</SelectItem>
                                                                                        <SelectItem value="NV4">Nguyễn Ngọc Nguyên (NV001082)</SelectItem>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <p className="text-[11px] text-gray-400 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> Cho phép khuyết chức danh.</p>
                                                                            </div>
                                                                            <div className="space-y-1.5 col-span-2">
                                                                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Giám sát khu vực (Sup) *</label>
                                                                                <div className="p-3 border border-gray-200 rounded-md bg-gray-50/30 flex gap-2 flex-wrap min-h-[46px] items-center">
                                                                                    <Badge variant="secondary" className="bg-white border-gray-300 font-normal px-2.5 py-1">
                                                                                        <span className="font-medium mr-1 text-gray-700">Trần Sup A</span> <span className="text-gray-400">SUP001</span>
                                                                                        <button className="text-gray-400 hover:text-red-500 ml-2 focus:outline-none">×</button>
                                                                                    </Badge>
                                                                                    <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50 text-xs ml-1"><Plus size={14} className="mr-1"/> Thêm Sup</Button>
                                                                                </div>
                                                                                <p className="text-[11px] text-orange-500 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> Cửa hàng bắt buộc phải có ít nhất 1 Sup quản lý để duyệt ca.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-end mt-6">
                                                                    <Button variant="outline" className="mr-2">Hủy</Button>
                                                                    <Button className="bg-blue-600 hover:bg-blue-700">Lưu cấu hình</Button>
                                                                </div>
                                                            </TabsContent>

                                                            <TabsContent value="diemdanh" className="animate-in fade-in duration-200 mt-0">
                                                                <div className="bg-white border text-sm border-gray-200 rounded-lg p-5 shadow-sm space-y-6">
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900 text-base mb-1">Mạng lưới điểm danh</h3>
                                                                        <p className="text-gray-500 text-sm mb-4">Cấu hình các mạng WiFi và vị trí GPS hợp lệ để nhân viên có thể check-in/check-out tại chi nhánh.</p>
                                                                        
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            <div className="space-y-4 col-span-2 border border-gray-100 bg-gray-50/50 p-4 rounded-lg">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <div>
                                                                                        <h4 className="font-medium text-gray-800 text-sm">Địa chỉ MAC WiFi (BSSID)</h4>
                                                                                        <p className="text-xs text-gray-500">Người dùng truy cập vào mạng WiFi này mới được phép điểm danh</p>
                                                                                    </div>
                                                                                    <Button variant="outline" size="sm" className="h-8"><Plus size={14} className="mr-2" /> Thêm mạng WiFi</Button>
                                                                                </div>
                                                                                <div className="flex gap-2 flex-wrap">
                                                                                    <Badge variant="secondary" className="bg-white border-gray-300 font-normal px-2.5 py-1.5 flex items-center">
                                                                                        <span className="font-medium mr-2 text-gray-700">Store_Wifi_01</span> <span className="text-gray-400 font-mono text-xs">A1:B2:C3:D4:E5:F6</span>
                                                                                        <button className="text-gray-400 hover:text-red-500 ml-2 focus:outline-none">×</button>
                                                                                    </Badge>
                                                                                    <Badge variant="secondary" className="bg-white border-gray-300 font-normal px-2.5 py-1.5 flex items-center">
                                                                                        <span className="font-medium mr-2 text-gray-700">Store_Wifi_5G</span> <span className="text-gray-400 font-mono text-xs">11:22:33:44:55:66</span>
                                                                                        <button className="text-gray-400 hover:text-red-500 ml-2 focus:outline-none">×</button>
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-4 col-span-2 border border-gray-100 bg-gray-50/50 p-4 rounded-lg mt-2">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <div>
                                                                                        <h4 className="font-medium text-gray-800 text-sm">Định vị địa lý (Geofencing GPS)</h4>
                                                                                        <p className="text-xs text-gray-500">Giới hạn khu vực bán kính điểm danh tính từ tâm cửa hàng</p>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Input defaultValue="10.762622" className="h-8 w-28 text-sm" placeholder="Vĩ độ (Lat)" />
                                                                                        <Input defaultValue="106.660172" className="h-8 w-28 text-sm" placeholder="Kinh độ (Lng)" />
                                                                                        <Button variant="secondary" className="h-8"><MapPin size={14} className="mr-1" /> Lấy vị trí</Button>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="grid grid-cols-2 gap-6 mt-4">
                                                                                    <div>
                                                                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Bán kính cho phép (mét)</label>
                                                                                        <Select defaultValue="50">
                                                                                            <SelectTrigger className="w-full h-9 bg-white"><SelectValue placeholder="Chọn khoảng cách" /></SelectTrigger>
                                                                                            <SelectContent>
                                                                                                <SelectItem value="20">20 mét (Rất chặt)</SelectItem>
                                                                                                <SelectItem value="50">50 mét (Tiêu chuẩn)</SelectItem>
                                                                                                <SelectItem value="100">100 mét (Co giãn)</SelectItem>
                                                                                                <SelectItem value="200">200 mét (Rộng lớn)</SelectItem>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                        <p className="text-[11px] text-gray-400 flex items-center mt-1.5"><AlertCircle size={12} className="mr-1 inline"/> Nhân viên phải đứng trong vùng này để check-in.</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Chính sách xử lý sai lệch</label>
                                                                                        <Select defaultValue="warning">
                                                                                            <SelectTrigger className="w-full h-9 bg-white"><SelectValue placeholder="Chọn chính sách xử lý" /></SelectTrigger>
                                                                                            <SelectContent>
                                                                                                <SelectItem value="block">Chặn điểm danh hoàn toàn</SelectItem>
                                                                                                <SelectItem value="warning">Cho phép, nhưng đánh dấu cảnh báo (Đợi duyệt)</SelectItem>
                                                                                                <SelectItem value="allow">Cho phép bình thường</SelectItem>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-end mt-6">
                                                                    <Button variant="outline" className="mr-2">Hủy</Button>
                                                                    <Button className="bg-blue-600 hover:bg-blue-700">Cập nhật mạng lưới</Button>
                                                                </div>
                                                            </TabsContent>
                                                        </Tabs>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* --- KHU VỰC HOẠT ĐỘNG --- */}
                <TabsContent value="regions" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0 outline-none">
                    <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
                        <Button variant="outline" className="h-9 text-gray-700 font-normal">
                            <Filter size={16} className="mr-2" /> Lọc
                        </Button>
                        <Button 
                            className="h-9 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                                setEditingRegion({ id: '', name: '', description: '', manager: '', isNew: true });
                                setIsRegionModalOpen(true);
                            }}
                        >
                            <Plus size={16} className="mr-2" /> Thêm khu vực
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                        <Table>
                            <TableHeader className="bg-gray-50/80 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[200px]">Mã / Tên khu vực</TableHead>
                                    <TableHead className="font-semibold text-gray-700 w-1/3 min-w-[200px]">Mô tả</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[150px]">Quản lý khu vực</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center min-w-[120px]">SL chi nhánh</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {regions.map(region => {
                                    const regionBranches = branches.filter(b => b.region === region.id);
                                    
                                    return (
                                        <React.Fragment key={region.id}>
                                            <TableRow 
                                                className={`cursor-pointer transition-colors ${selectedRegionId === region.id ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-gray-50'}`}
                                                onClick={() => {
                                                    setSelectedRegionId(selectedRegionId === region.id ? null : region.id);
                                                    setSelectedBranchIdsToRemove([]); // Reset bulk remove
                                                }}
                                            >
                                                <TableCell className={`font-medium ${selectedRegionId === region.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-xs">{region.id}</span>
                                                        <span>{region.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{region.description}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {region.manager ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                                                {region.manager.substring(0, 1)}
                                                            </div>
                                                            {region.manager}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-sm">Chưa có</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-gray-700">
                                                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                                                        {regionBranches.length}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>

                                            {selectedRegionId === region.id && (
                                                <TableRow className="bg-gray-50/30 border-b-2 border-blue-500 shadow-inner">
                                                    <TableCell colSpan={4} className="p-0">
                                                        <div className="p-6">
                                                            <Tabs defaultValue="chi_nhanh" className="w-full">
                                                                <TabsList className="mb-6">
                                                                    <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                                                                    <TabsTrigger value="chi_nhanh">Danh sách chi nhánh ({regionBranches.length})</TabsTrigger>
                                                                </TabsList>
                                                                
                                                                <TabsContent value="info" className="animate-in fade-in duration-200 mt-0 max-w-4xl">
                                                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
                                                                        <div>
                                                                            <span className="text-xs text-gray-500 block mb-1">Mã khu vực:</span>
                                                                            <span className="font-medium text-sm text-gray-900 block">{region.id}</span>
                                                                            <div className="h-px bg-gray-200 mt-2"></div>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-xs text-gray-500 block mb-1">Tên khu vực:</span>
                                                                            <span className="font-medium text-sm text-gray-900 block">{region.name}</span>
                                                                            <div className="h-px bg-gray-200 mt-2"></div>
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <span className="text-xs text-gray-500 block mb-1">Mô tả:</span>
                                                                            <span className="text-sm text-gray-800 block">{region.description}</span>
                                                                            <div className="h-px bg-gray-200 mt-2"></div>
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <span className="text-xs text-gray-500 block mb-1">Quản lý khu vực (Giám sát trưởng):</span>
                                                                            <span className="font-medium text-sm text-gray-900 block">{region.manager || 'Chưa thiết lập'}</span>
                                                                            <div className="h-px bg-gray-200 mt-2"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                                                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium px-2" onClick={() => handleDeleteRegion(region.id)}><Trash2 size={16} className="mr-2" /> Xóa khu vực</Button>
                                                                        <Button className="bg-blue-600 hover:bg-blue-700 font-medium" onClick={() => {
                                                                            setEditingRegion({ ...region });
                                                                            setIsRegionModalOpen(true);
                                                                        }}><Edit2 size={16} className="mr-2" /> Chỉnh sửa</Button>
                                                                    </div>
                                                                </TabsContent>

                                                                <TabsContent value="chi_nhanh" className="animate-in fade-in duration-200 mt-0">
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <div className="flex items-center gap-4">
                                                                            <Input 
                                                                                placeholder="Tìm kiếm chi nhánh trong khu vực..." 
                                                                                className="w-72 h-9 text-sm"
                                                                            />
                                                                            {selectedBranchIdsToRemove.length > 0 && (
                                                                                <Button 
                                                                                    variant="outline" 
                                                                                    className="h-9 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                                                    onClick={() => handleRemoveSelectedBranchesFromRegion(region.id)}
                                                                                >
                                                                                    <Trash2 size={16} className="mr-2" />
                                                                                    Xóa chi nhánh đã chọn ({selectedBranchIdsToRemove.length})
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                        <Button 
                                                                            className="bg-blue-600 hover:bg-blue-700 h-9"
                                                                            onClick={() => {
                                                                                setIsAddBranchModalOpen(true);
                                                                                setSelectedBranchIdsToAdd([]);
                                                                            }}
                                                                        >
                                                                            <Plus size={16} className="mr-2" />
                                                                            Cập nhật chi nhánh
                                                                        </Button>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-md bg-white">
                                                                        <Table>
                                                                            <TableHeader className="bg-gray-50/50">
                                                                                <TableRow>
                                                                                    <TableHead className="w-12 text-center">
                                                                                        <Checkbox 
                                                                                            checked={regionBranches.length > 0 && selectedBranchIdsToRemove.length === regionBranches.length}
                                                                                            onCheckedChange={(c) => {
                                                                                                if (c) setSelectedBranchIdsToRemove(regionBranches.map(b => b.id));
                                                                                                else setSelectedBranchIdsToRemove([]);
                                                                                            }}
                                                                                        />
                                                                                    </TableHead>
                                                                                    <TableHead className="min-w-[200px]">Tên chi nhánh</TableHead>
                                                                                    <TableHead className="min-w-[200px]">Địa chỉ</TableHead>
                                                                                    <TableHead className="min-w-[120px]">Trạng thái</TableHead>
                                                                                    <TableHead className="w-16"></TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {regionBranches.length > 0 ? (
                                                                                    regionBranches.map(b => (
                                                                                        <TableRow key={b.id} className="hover:bg-gray-50">
                                                                                            <TableCell className="text-center">
                                                                                                <Checkbox 
                                                                                                    checked={selectedBranchIdsToRemove.includes(b.id)}
                                                                                                    onCheckedChange={(c) => {
                                                                                                        if (c) setSelectedBranchIdsToRemove(prev => [...prev, b.id]);
                                                                                                        else setSelectedBranchIdsToRemove(prev => prev.filter(id => id !== b.id));
                                                                                                    }}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell className="font-medium text-gray-900">{b.name}</TableCell>
                                                                                            <TableCell className="text-gray-500 text-sm">{b.address}</TableCell>
                                                                                            <TableCell>
                                                                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-normal">{b.status}</Badge>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Button 
                                                                                                    variant="ghost" 
                                                                                                    size="sm" 
                                                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                                                    onClick={() => {
                                                                                                        setBranches(prev => prev.map(bb => bb.id === b.id ? { ...bb, region: '' } : bb));
                                                                                                        setSelectedBranchIdsToRemove(prev => prev.filter(id => id !== b.id));
                                                                                                    }}
                                                                                                    title="Loại khỏi khu vực này"
                                                                                                >
                                                                                                    <Trash2 size={14} />
                                                                                                </Button>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                ) : (
                                                                                    <TableRow>
                                                                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                                                                            Chưa có chi nhánh nào trong khu vực này.
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                </TabsContent>
                                                            </Tabs>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modal Bổ sung nhiều chi nhánh vào khu vực */}
            <Dialog open={isAddBranchModalOpen} onOpenChange={setIsAddBranchModalOpen}>
                <DialogContent className="sm:max-w-3xl p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b border-gray-200">
                        <DialogTitle className="text-xl">
                            {selectedRegionId ? `Gán chi nhánh vào ${regions.find(r => r.id === selectedRegionId)?.name}` : 'Gán chi nhánh'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <Input placeholder="Tìm theo tên hoặc địa chỉ..." className="max-w-sm h-9 bg-white" />
                        <span className="text-sm text-gray-500">
                            Đã chọn: <strong className="text-blue-600">{selectedBranchIdsToAdd.length}</strong> chi nhánh
                        </span>
                    </div>
                    <div className="max-h-[50vh] overflow-y-auto w-full px-2">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_#e5e7eb]">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-12 text-center pl-4">
                                        <Checkbox 
                                            checked={
                                                branches.filter(b => b.region !== selectedRegionId).length > 0 && 
                                                selectedBranchIdsToAdd.length === branches.filter(b => b.region !== selectedRegionId).length
                                            }
                                            onCheckedChange={(c) => {
                                                if (c) setSelectedBranchIdsToAdd(branches.filter(b => b.region !== selectedRegionId).map(b => b.id));
                                                else setSelectedBranchIdsToAdd([]);
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">Tên chi nhánh</TableHead>
                                    <TableHead className="min-w-[150px]">Khu vực hiện tại</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.filter(b => b.region !== selectedRegionId).map(branch => (
                                    <TableRow 
                                        key={branch.id} 
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            if (selectedBranchIdsToAdd.includes(branch.id)) {
                                                setSelectedBranchIdsToAdd(prev => prev.filter(id => id !== branch.id));
                                            } else {
                                                setSelectedBranchIdsToAdd(prev => [...prev, branch.id]);
                                            }
                                        }}
                                    >
                                        <TableCell className="text-center pl-4">
                                            <Checkbox 
                                                checked={selectedBranchIdsToAdd.includes(branch.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {branch.name}
                                            <div className="text-xs text-gray-500 font-normal hidden sm:block truncate mt-0.5">{branch.address}</div>
                                        </TableCell>
                                        <TableCell>
                                            {branch.region ? (
                                                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 font-normal">
                                                    Đang thuộc: {regions.find(r => r.id === branch.region)?.name || branch.region}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Chưa phân vùng</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {branches.filter(b => b.region !== selectedRegionId).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center text-gray-500">
                                            <Store className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                            Không có chi nhánh nào khả dụng để thêm.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50/50">
                        <Button variant="outline" onClick={() => setIsAddBranchModalOpen(false)}>Hủy</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            disabled={selectedBranchIdsToAdd.length === 0}
                            onClick={() => {
                                if (selectedRegionId) {
                                    setBranches(prev => prev.map(b => selectedBranchIdsToAdd.includes(b.id) ? { ...b, region: selectedRegionId } : b));
                                }
                                setIsAddBranchModalOpen(false);
                                setSelectedBranchIdsToAdd([]);
                            }}
                        >
                            Lưu cấu hình
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Add/Edit Region */}
            <Dialog open={isRegionModalOpen} onOpenChange={setIsRegionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRegion?.isNew ? 'Thêm khu vực' : 'Chỉnh sửa khu vực'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tên khu vực *</label>
                            <Input 
                                value={editingRegion?.name || ''} 
                                onChange={e => setEditingRegion(prev => prev ? { ...prev, name: e.target.value } : null)}
                                placeholder="VD: Khu vực Miền Nam" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mô tả</label>
                            <Input 
                                value={editingRegion?.description || ''} 
                                onChange={e => setEditingRegion(prev => prev ? { ...prev, description: e.target.value } : null)}
                                placeholder="Mô tả khu vực" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quản lý khu vực (Giám sát trưởng)</label>
                            <Input 
                                value={editingRegion?.manager || ''} 
                                onChange={e => setEditingRegion(prev => prev ? { ...prev, manager: e.target.value } : null)}
                                placeholder="Tên quản lý" 
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRegionModalOpen(false)}>Hủy</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            onClick={handleSaveRegion}
                            disabled={!editingRegion?.name}
                        >
                            Lưu
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
