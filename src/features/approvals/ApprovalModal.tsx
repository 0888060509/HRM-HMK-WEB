import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Card, CardContent } from '../../components/ui/card';
import TimesheetApprovalTab from './TimesheetApprovalTab';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockRequests = [
    { id: 1, time: '07/05/2026 13:57:14', name: 'Nguyễn Hồng Phúc', code: 'NV001041', type: 'Tạo hồ sơ mới', content: '', canReject: true },
    { id: 2, time: '07/05/2026 13:55:21', name: 'Nguyễn Thị Ngọc Hiền', code: 'NV000676', type: 'Cập nhật SĐT', old: '0353466441', new: '0987654321' },
    { id: 3, time: '07/05/2026 13:53:41', name: 'Trần Thị Hồng', code: 'NV001079', type: 'Cập nhật SĐT', old: '0353466441', new: '0987654321' },
    { id: 4, time: '07/05/2026 13:50:11', name: 'Nguyễn Văn A', code: 'NV001074', type: 'Gỡ thiết bị', old: 'iPhone 12 Pro (A123-B456)', new: 'Lý do: Hỏng màn hình' },
];

export default function ApprovalModal({ isOpen, onClose }: ApprovalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-6xl xl:max-w-7xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="pt-4 px-6 pb-2 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">Yêu cầu chờ duyệt</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="nhanvien" className="flex-1 flex flex-col h-full overflow-hidden">
           <div className="px-6 shrink-0 pt-4 pb-0 bg-white">
             <TabsList className="mb-0">
               <TabsTrigger value="nhanvien">Nhân viên</TabsTrigger>
               <TabsTrigger value="chamcong">Chấm công</TabsTrigger>
             </TabsList>
          </div>

          <TabsContent value="nhanvien" className="flex-1 flex overflow-hidden m-0 min-h-0 [&[hidden]]:!hidden">
             {/* Left Filters */}
             <Card className="w-64 shrink-0 rounded-none border-y-0 border-l-0 border-r border-gray-200 bg-white overflow-y-auto h-full">
                <CardContent className="p-4 space-y-6">
                   <div>
                       <h3 className="font-semibold text-sm mb-3 text-gray-800">Loại yêu cầu</h3>
                       <div className="space-y-2.5">
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer"><Checkbox /> <span>Tạo hồ sơ mới</span></Label>
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer"><Checkbox /> <span>Cập nhật SĐT</span></Label>
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer"><Checkbox /> <span>Gỡ thiết bị (Unbind)</span></Label>
                       </div>
                   </div>

                   <div>
                       <h3 className="font-semibold text-sm mb-3 text-gray-800">Trạng thái yêu cầu</h3>
                       <RadioGroup defaultValue="pending" className="space-y-1">
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer">
                             <RadioGroupItem value="pending" className="text-blue-600" /> <span>Chưa duyệt</span>
                           </Label>
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer">
                             <RadioGroupItem value="approved" className="text-blue-600" /> <span>Đã duyệt</span>
                           </Label>
                       </RadioGroup>
                   </div>

                   <div>
                       <h3 className="font-semibold text-sm mb-2 text-gray-800">Nhân viên</h3>
                       <Input placeholder="Tìm kiếm nhân viên" className="h-8 text-sm" />
                   </div>

                   <div>
                       <h3 className="font-semibold text-sm mb-2 text-gray-800">Thời gian</h3>
                       <RadioGroup defaultValue="all" className="space-y-1">
                           <Label className="flex items-center space-x-2 text-sm font-normal cursor-pointer">
                             <RadioGroupItem value="all" className="text-blue-600" /> <span>Toàn thời gian</span>
                           </Label>
                           <Label className="flex items-center space-x-2 text-sm font-normal w-full cursor-pointer">
                             <RadioGroupItem value="other" className="text-blue-600 shrink-0" />
                             <Input placeholder="Lựa chọn khác" className="h-8 text-sm p-1 ml-2 flex-1 pointer-events-none opacity-60" />
                           </Label>
                       </RadioGroup>
                   </div>
                </CardContent>
             </Card>

             {/* Right Data Table */}
             <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4">
                 <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm min-h-0">
                     <div className="flex-1 overflow-auto">
                         <Table>
                             <TableHeader className="bg-gray-50/90 sticky top-0 font-medium text-gray-800 shadow-[0_1px_0_0_#e5e7eb] z-10 backdrop-blur-sm">
                             <TableRow>
                                 <TableHead className="w-12 text-center"><Checkbox /></TableHead>
                                 <TableHead className="min-w-[150px]">Thời gian</TableHead>
                                 <TableHead className="min-w-[150px]">Tên nhân viên</TableHead>
                                 <TableHead className="min-w-[150px]">Loại yêu cầu</TableHead>
                                 <TableHead className="min-w-[200px]">Nội dung</TableHead>
                                 <TableHead className="text-right pr-6 min-w-[200px]">Xác nhận</TableHead>
                             </TableRow>
                         </TableHeader>
                         <TableBody>
                            {mockRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell className="text-center"><Checkbox /></TableCell>
                                    <TableCell className="text-sm">
                                        <div className="text-gray-900">{req.time.split(' ')[0]}</div>
                                        <div className="text-gray-500 text-xs">{req.time.split(' ')[1]}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-900 text-sm">{req.name}</div>
                                        <div className="text-gray-500 text-xs">{req.code}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-800">{req.type}</TableCell>
                                    <TableCell className="text-sm">
                                        {req.old && req.type !== 'Gỡ thiết bị' && (
                                            <>
                                              <div className="flex gap-2"><span className="text-gray-500 whitespace-nowrap min-w-[90px]">Số cũ:</span> {req.old}</div>
                                              <div className="flex gap-2"><span className="text-gray-500 whitespace-nowrap min-w-[90px]">Số mới:</span> <span className="text-blue-600 font-medium">{req.new}</span></div>
                                            </>
                                        )}
                                        {req.type === 'Gỡ thiết bị' && (
                                            <>
                                              <div className="flex gap-2"><span className="text-gray-500 whitespace-nowrap min-w-[90px]">Thiết bị cũ:</span> <span className="font-medium">{req.old}</span></div>
                                              <div className="flex gap-2"><span className="text-gray-500 whitespace-nowrap min-w-[90px]"></span> <span className="text-orange-600 italic">{req.new}</span></div>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-500"><BanIcon size={14}/></Button>
                                            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded border-blue-500 text-blue-600 hover:bg-blue-50"><CheckIcon size={14}/></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                             ))}
                         </TableBody>
                     </Table>
                 </div>
                 
                 {/* Footer Pagination inside Tab Content */}
                 <div className="p-3 border-t border-gray-200 bg-white flex justify-between items-center shrink-0">
                     <div className="flex items-center space-x-2 text-sm text-gray-500">
                         <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>«</Button>
                         <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>‹</Button>
                         <Input className="w-10 h-7 text-center p-0 text-sm" value="1" readOnly/>
                         <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>›</Button>
                         <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>»</Button>
                         <span className="ml-4 font-medium">1 - 10 trong 293 yêu cầu</span>
                     </div>
                 </div>
             </div>
             </div>
          </TabsContent>

          <TabsContent value="chamcong" className="flex-1 overflow-hidden m-0 min-h-0 flex flex-col [&[hidden]]:!hidden">
             <TimesheetApprovalTab />
          </TabsContent>
        </Tabs>
        
        {/* Global Footer of Modal */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
            <Button variant="outline" onClick={onClose} className="px-6 h-9 font-medium">Xong</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BanIcon({size}: {size: number}) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>;
}
function CheckIcon({size}: {size: number}) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}
