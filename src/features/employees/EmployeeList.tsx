import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, User, AlignJustify } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const mockEmployees = [
  { id: 'NV001083', code: 'NV001083', name: 'Dương Như Mỹ', phone: '0353466441', cmnd: '', debt: 0, status: 'working', tags: [{name: 'Kho', color: 'bg-blue-100 text-blue-800'}, {name: 'Đóng gói', color: 'bg-green-100 text-green-800'}] },
  { id: 'NV001082', code: 'NV001082', name: 'Nguyễn Ngọc Nguyên', phone: '0567104910', cmnd: '', debt: 0, status: 'working', tags: [{name: 'Tư vấn BH', color: 'bg-purple-100 text-purple-800'}] },
  { id: 'NV001081', code: 'NV001081', name: 'Trương Mỹ Duyên', phone: '0938714473', cmnd: '', debt: 0, status: 'working', tags: [{name: 'Vận hành xe nâng', color: 'bg-yellow-100 text-yellow-800'}] },
  { id: 'NV001075', code: 'NV001075', name: 'Trương Thị Ngọc Yến', phone: '0706919708', cmnd: '', debt: 0, status: 'working', tags: [] },
  { id: 'NV001074', code: 'NV001074', name: 'Nguyễn Văn A', phone: '0901234567', cmnd: '', debt: 0, status: 'resigned', tags: [] },
];

export default function EmployeeList() {
  const [selectedId, setSelectedId] = useState<string | null>('NV001083');

  return (
    <div className="flex h-full w-full bg-white">
      {/* Left Sidebar Filter */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col p-4 overflow-y-auto hidden md:flex">
        <h2 className="font-semibold text-lg mb-6">Trạng thái nhân viên</h2>
        
        <div className="space-y-4">
          <div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input type="radio" name="status" defaultChecked className="text-blue-600 form-radio" />
                <span>Đang làm việc</span>
              </label>
              <label className="flex items-center space-x-2 text-sm cursor-pointer text-gray-500">
                <input type="radio" name="status" className="text-blue-600 form-radio" />
                <span>Đã nghỉ</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-medium text-sm mb-2">Chi nhánh làm việc</h3>
            <div className="flex flex-wrap gap-2">
               <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 font-normal px-2 space-x-1">
                 <span>Chi nhánh trung tâm</span>
                 <button className="text-xs ml-1 hover:text-white">x</button>
               </Badge>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2 flex justify-between items-center">
                 Chi nhánh trả lương
              </h3>
              <Select>
                <SelectTrigger className="w-full h-8 text-sm"><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger>
                <SelectContent><SelectItem value="ct">Chi nhánh trung tâm</SelectItem></SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-2 flex justify-between items-center">
                 Phòng ban <Plus size={14} className="cursor-pointer text-gray-400" />
              </h3>
              <Select>
                <SelectTrigger className="w-full h-8 text-sm"><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                <SelectContent><SelectItem value="sales">Kinh doanh</SelectItem></SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2 flex justify-between items-center">
                 Chức danh <Plus size={14} className="cursor-pointer text-gray-400" />
              </h3>
              <Select>
                <SelectTrigger className="w-full h-8 text-sm"><SelectValue placeholder="Chọn chức danh" /></SelectTrigger>
                <SelectContent><SelectItem value="nv">Nhân viên</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
           <h1 className="text-lg font-semibold mr-4 hidden lg:block">Danh sách nhân viên</h1>
           <div className="relative flex-1 max-w-md">
             <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
             <Input placeholder="Tìm theo mã, tên nhân viên" className="pl-9 h-9 border-gray-300 bg-gray-50 text-sm" />
           </div>
           <div className="flex items-center space-x-2 ml-4">
              <Button variant="outline" className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50">
                 <Plus size={16} className="mr-1" /> Nhân viên
              </Button>
              <Select>
                 <SelectTrigger className="h-9 w-10 px-0 flex justify-center bg-white border border-gray-200 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
                    <MoreHorizontal size={16} />
                 </SelectTrigger>
                 <SelectContent align="end">
                    <SelectItem value="import">Nhập File (Bulk Import)</SelectItem>
                    <SelectItem value="export">Xuất Excel (Export)</SelectItem>
                 </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9"><AlignJustify size={16} /></Button>
           </div>
        </div>

        {/* Data Table Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4">
           <div className="bg-white border sm:border border-gray-200 sm:rounded-md flex-1 flex flex-col min-h-0 shadow-sm">
              <div className="flex-1 overflow-auto">
                 <Table>
                   <TableHeader className="bg-gray-50/90 sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb] backdrop-blur-sm">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="w-12 text-center"><Checkbox /></TableHead>
                    <TableHead className="w-12 truncate">Ảnh</TableHead>
                    <TableHead className="font-semibold text-gray-800 min-w-[120px]">Mã nhân viên</TableHead>
                    <TableHead className="font-semibold text-gray-800 min-w-[120px]">Mã chấm công</TableHead>
                    <TableHead className="font-semibold text-gray-800 min-w-[150px]">Tên nhân viên</TableHead>
                    <TableHead className="font-semibold text-gray-800 min-w-[120px]">Số điện thoại</TableHead>
                    <TableHead className="font-semibold text-gray-800 hidden md:table-cell min-w-[150px]">Số CMND/CCCD</TableHead>
                    <TableHead className="font-semibold text-gray-800 text-right min-w-[120px]">Nợ và tạm ứng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployees.map((emp) => (
                    // React.Fragment to render expanded row details
                    <React.Fragment key={emp.id}>
                    <TableRow 
                        className={`cursor-pointer ${selectedId === emp.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedId(selectedId === emp.id ? null : emp.id)}
                    >
                      <TableCell className="text-center" onClick={e => e.stopPropagation()}><Checkbox /></TableCell>
                      <TableCell>
                         <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                           <User size={16} />
                         </div>
                      </TableCell>
                      <TableCell className="font-medium">{emp.code}</TableCell>
                      <TableCell className="text-gray-500"></TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{emp.cmnd}</TableCell>
                      <TableCell className="text-right">{emp.debt}</TableCell>
                    </TableRow>
                    {/* Expanded Detail Panel inline */}
                    {selectedId === emp.id && (
                        <TableRow className="bg-white border-b-2 border-blue-500">
                            <TableCell colSpan={8} className="p-0">
                                <div className="p-0 border-t border-gray-100 flex shadow-inner">
                                   <div className="p-6 flex-1 max-w-4xl">
                                     {/* Navigation Inside Detail */}
                                     <Tabs defaultValue="thongtin" className="w-full">
                                         <TabsList className="mb-6">
                                            <TabsTrigger value="thongtin">Thông tin</TabsTrigger>
                                            <TabsTrigger value="lichlamviec">Lịch làm việc</TabsTrigger>
                                            <TabsTrigger value="thietlapluong">Thiết lập lương</TabsTrigger>
                                            <TabsTrigger value="phieuluong">Phiếu lương</TabsTrigger>
                                            <TabsTrigger value="no_tam_ung">Nợ và tạm ứng</TabsTrigger>
                                         </TabsList>

                                         <TabsContent value="thongtin" className="mt-0 outline-none">
                                             <div className="flex gap-8">
                                                <div className="w-32">
                                                   <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                                                      <User size={48} className="text-gray-300" />
                                                   </div>
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6">
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Mã nhân viên:</span>
                                                        <span className="font-medium text-sm block">{emp.code}</span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Tên nhân viên:</span>
                                                        <span className="font-medium text-sm block">{emp.name}</span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Giới tính:</span>
                                                        <span className="font-medium text-sm block min-h-[20px]"></span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Số CMND/CCCD:</span>
                                                        <span className="font-medium text-sm block min-h-[20px]"></span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Ngày bắt đầu làm việc:</span>
                                                        <span className="font-medium text-sm block min-h-[20px]"></span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Chi nhánh trả lương:</span>
                                                        <span className="font-medium text-sm block">Chi nhánh trung tâm</span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Số điện thoại:</span>
                                                        <span className="font-medium text-sm block">{emp.phone}</span>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-xs text-gray-500 block mb-2">Bộ Tag Kỹ năng (Skill Portfolio):</span>
                                                        <div className="flex flex-wrap gap-2 min-h-[24px]">
                                                            {emp.tags && emp.tags.length > 0 ? emp.tags.map((tag, idx) => (
                                                                <Badge key={idx} variant="secondary" className={`font-medium ${tag.color} border-0`}>
                                                                    {tag.name}
                                                                </Badge>
                                                            )) : <span className="text-sm text-gray-400 italic">Chưa có kỹ năng nào</span>}
                                                        </div>
                                                        <div className="h-px bg-gray-100 mt-2"></div>
                                                    </div>

                                                    <div className="col-span-2 mt-2 pt-4 border-t border-dashed border-gray-200 grid grid-cols-3 gap-x-8 gap-y-6">
                                                        <div>
                                                            <span className="text-xs text-gray-500 block mb-1">Mã Số Thuế (PIT):</span>
                                                            <span className="font-medium text-sm block italic text-gray-400">Chưa cập nhật</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 block mb-1">Người phụ thuộc (NPT):</span>
                                                            <span className="font-medium text-sm block">0</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 block mb-1">Tài khoản ngân hàng:</span>
                                                            <span className="font-medium text-sm block italic text-gray-400">Chưa cập nhật</span>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <span className="text-xs text-gray-500 block mb-1">Hợp đồng lao động (HĐLĐ):</span>
                                                            <span className="text-sm block">
                                                                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 font-normal">Thử việc (2 tháng)</Badge> 
                                                                <span className="ml-2 text-gray-500">(15/05/2026 - 15/07/2026)</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                        <div className="col-span-3 mt-4">
                                                            <span className="text-xs text-gray-500 block mb-2">Thông tin thiết bị (Device Binding):</span>
                                                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded border border-gray-100">
                                                                <div>
                                                                    <div className="font-medium text-sm">iPhone 12 Pro (A123-B456)</div>
                                                                    <div className="text-xs text-green-600 px-1.5 py-0.5 bg-green-100 rounded inline-block mt-1">Đang hoạt động</div>
                                                                </div>
                                                                <Button variant="outline" size="sm" className="ml-auto text-red-600 border-red-200 hover:bg-red-50">
                                                                    Gỡ liên kết (Unbind)
                                                                </Button>
                                                            </div>
                                                        </div>

                                                    <div className="col-span-2 mt-4 flex items-center gap-4">
                                                        <Input placeholder="Ghi chú..." className="border-gray-200 flex-1" />
                                                        {emp.status === 'working' && (
                                                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                                                                Ngừng việc (Terminate)
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                             </div>
                                         </TabsContent>
                                     </Tabs>
                                   </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              </div>
              
              <div className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2 text-sm text-gray-600 shrink-0">
                 <Button variant="outline" size="sm" className="h-7 px-2 border-gray-200 text-gray-500" disabled>«</Button>
                 <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-blue-500 text-blue-600 bg-blue-50 font-medium">1</Button>
                 <Button variant="outline" size="sm" className="h-7 px-2 border-gray-200 text-gray-500" disabled>»</Button>
                 <span className="ml-4">1 - 5 trong 5 nhân viên</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
