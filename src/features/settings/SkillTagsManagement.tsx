import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';

interface SkillTag {
    id: string;
    name: string;
    code: string;
    description: string;
    color: string;
    assignedCount: number;
}

const mockSkillTags: SkillTag[] = [
    { id: '1', code: 'SK_001', name: 'Kho', description: 'Kỹ năng quản lý kho cơ bản', color: 'bg-blue-100 text-blue-800', assignedCount: 15 },
    { id: '2', code: 'SK_002', name: 'Đóng gói', description: 'Đóng gói hàng hóa', color: 'bg-green-100 text-green-800', assignedCount: 22 },
    { id: '3', code: 'SK_003', name: 'Vận hành xe nâng', description: 'Có chứng chỉ lái xe nâng', color: 'bg-yellow-100 text-yellow-800', assignedCount: 5 },
    { id: '4', code: 'SK_004', name: 'Tư vấn BH', description: 'Tư vấn bán hàng', color: 'bg-purple-100 text-purple-800', assignedCount: 18 },
];

export default function SkillTagsManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<SkillTag | null>(null);

    const openAssignModal = (tag: SkillTag) => {
        setSelectedTag(tag);
        setIsAssignModalOpen(true);
    };
    
    return (
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Quản lý Tag Kỹ năng</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Thiết lập các thẻ kỹ năng chuyên môn áp dụng vào luật phân ca và trả lương
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Thêm Tag Khóa
                    </Button>
                </div>
                
                <div className="flex bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                    <div className="relative w-80">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                        <Input placeholder="Tìm kiếm tag kỹ năng..." className="pl-9 h-9 border-gray-300 bg-white" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="font-medium text-gray-900 w-32 py-3">Mã Tag</TableHead>
                            <TableHead className="font-medium text-gray-900 py-3">Tên Kỹ năng</TableHead>
                            <TableHead className="font-medium text-gray-900 py-3">Mô tả</TableHead>
                            <TableHead className="font-medium text-gray-900 text-right py-3">Số NV áp dụng</TableHead>
                            <TableHead className="font-medium text-gray-900 w-24 text-center py-3">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockSkillTags.map((tag) => (
                            <TableRow key={tag.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-900 py-3">{tag.code}</TableCell>
                                <TableCell className="py-3">
                                    <Badge variant="secondary" className={`font-medium ${tag.color} border-0 hover:bg-opacity-80 transition-colors`}>
                                        {tag.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-600 py-3">{tag.description}</TableCell>
                                <TableCell 
                                    className="text-right text-blue-600 font-medium py-3 cursor-pointer hover:underline"
                                    onClick={() => openAssignModal(tag)}
                                    title="Click để gán thêm nhân viên"
                                >
                                    {tag.assignedCount} NV
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button className="p-1 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Thêm Tag Kỹ Năng Mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mã Tag</label>
                            <Input id="code" placeholder="VD: SK_005" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tên Kỹ năng</label>
                            <Input id="name" placeholder="VD: Bán hàng" />
                        </div>
                         <div className="space-y-2">
                            <label htmlFor="desc" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mô tả chi tiết</label>
                            <Input id="desc" placeholder="Giải thích chi tiết về kỹ năng này" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Màu sắc đánh dấu</label>
                             <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-500"></button>
                                <button className="w-8 h-8 rounded-full bg-green-100 border-2 border-transparent hover:border-gray-300"></button>
                                <button className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-transparent hover:border-gray-300"></button>
                                <button className="w-8 h-8 rounded-full bg-purple-100 border-2 border-transparent hover:border-gray-300"></button>
                                <button className="w-8 h-8 rounded-full bg-pink-100 border-2 border-transparent hover:border-gray-300"></button>
                                <button className="w-8 h-8 rounded-full bg-gray-200 border-2 border-transparent hover:border-gray-300"></button>
                             </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Hủy bỏ</Button>
                        <Button onClick={() => setIsAddModalOpen(false)}>Lưu Tag</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Gán kỹ năng cho nhân viên</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div>
                                <p className="text-sm text-gray-500">Đang gán thẻ kỹ năng:</p>
                                <Badge variant="secondary" className={`font-medium ${selectedTag?.color} border-0 mt-1`}>
                                    {selectedTag?.name}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Đã gán cho</p>
                                <p className="font-semibold text-lg">{selectedTag?.assignedCount} <span className="text-sm font-normal text-gray-600">nhân viên</span></p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tìm và chọn nhân viên</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                                    <Input placeholder="Tìm theo tên, mã NV..." className="pl-9" />
                                </div>
                                <Button variant="outline">Chọn theo bộ phận</Button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-gray-50 sticky top-0">
                                    <TableRow>
                                        <TableHead className="w-12 text-center"><Checkbox /></TableHead>
                                        <TableHead>Mã NV</TableHead>
                                        <TableHead>Tên nhân viên</TableHead>
                                        <TableHead>Chi nhánh</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[1,2,3].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-center"><Checkbox /></TableCell>
                                            <TableCell>NV00108{i}</TableCell>
                                            <TableCell>Nguyễn Văn {String.fromCharCode(64+i)}</TableCell>
                                            <TableCell className="text-gray-500">Chi nhánh trung tâm</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Đóng</Button>
                        <Button onClick={() => setIsAssignModalOpen(false)}>Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
