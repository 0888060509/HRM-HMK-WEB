import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Check, Calendar, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import TimesheetApprovalTab from '../approvals/TimesheetApprovalTab';

type Status = 'on_time' | 'ot' | 'late' | 'missing_out' | 'no_punch' | 'off';

interface EmpRecord {
  name: string;
  time: string;
  note: string;
  status: Status;
}

const mockShifts = [
  { id: '1', name: 'CA NGÀY', time: '09:00 - 18:00' },
  { id: '2', name: 'CA TỐI', time: '18:00 - 22:00' },
];

const mockShiftData: Record<string, Record<string, EmpRecord[]>> = {
  '1': {
    'mon': [
        { name: 'Đỗ Thị Phương Thư', time: '08:53 - 18:11', status: 'ot', note: 'Làm thêm TC 7p, Làm thêm SC 1p' },
        { name: 'Dương Thị Mỹ Nhung', time: '09:01 - 18:00', status: 'late', note: 'Đi muộn 1p' },
        { name: 'Lâm Thanh Trúc', time: '08:32 - 18:00', status: 'ot', note: 'Làm thêm TC 28p' },
        { name: 'Lê Hoài Linh', time: '09:30 - 18:43', status: 'late', note: 'Đi muộn 30p, Làm thêm SC 33p' },
        { name: 'Lê Hồng Phương Uyên', time: '08:44 - 18:29', status: 'ot', note: 'Làm thêm TC 16p, Làm thêm SC 19p' },
        { name: 'Lê Nguyễn Kim Ngân', time: '08:16 - 20:01', status: 'ot', note: 'Làm thêm TC 44p, Làm thêm SC 1h 51p' },
        { name: 'Lê Thị Thuỳ Ngân', time: '09:07 - 18:18', status: 'late', note: 'Đi muộn 7p, Làm thêm SC 8p' },
        { name: 'Nguyễn Ngọc Quỳnh Như', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
    ],
    'tue': [
        { name: 'Đỗ Thị Phương Thư', time: '08:56 - 18:10', status: 'ot', note: 'Làm thêm TC 4p' },
        { name: 'Dương Thị Mỹ Nhung', time: '08:58 - 18:01', status: 'ot', note: 'Làm thêm TC 2p' },
        { name: 'Lâm Thanh Trúc', time: '08:52 - 18:00', status: 'ot', note: 'Làm thêm TC 8p' },
        { name: 'Lê Hoài Linh', time: '09:31 - --', status: 'missing_out', note: 'Chưa chấm ra' },
        { name: 'Lê Hồng Phương Uyên', time: '09:05 - 18:50', status: 'late', note: 'Đi muộn 5p, Làm thêm SC 40p' },
        { name: 'Lê Nguyễn Kim Ngân', time: '08:21 - --', status: 'missing_out', note: 'Chưa chấm ra' },
        { name: 'Lê Thị Thuỳ Ngân', time: '09:14 - 18:07', status: 'late', note: 'Đi muộn 14p' },
    ],
    'wed': [
        { name: 'Đỗ Thị Phương Thư', time: '08:55 - 18:03', status: 'ot', note: 'Làm thêm TC 5p' },
        { name: 'Dương Thị Mỹ Nhung', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
        { name: 'Lâm Thanh Trúc', time: '08:51 - 18:00', status: 'ot', note: 'Làm thêm TC 9p' },
        { name: 'Lê Hoài Linh', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
        { name: 'Lê Hồng Phương Uyên', time: '08:58 - 18:14', status: 'ot', note: 'Làm thêm TC 2p, Làm thêm SC 4p' },
        { name: 'Lê Nguyễn Kim Ngân', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
        { name: 'Lê Thị Thuỳ Ngân', time: '09:11 - 18:09', status: 'late', note: 'Đi muộn 11p' },
    ],
    'thu': [
        { name: 'Đỗ Thị Phương Thư', time: '08:53 - 18:04', status: 'ot', note: 'Làm thêm TC 7p' },
        { name: 'Dương Thị Mỹ Nhung', time: '08:54 - 18:02', status: 'ot', note: 'Làm thêm TC 6p' },
        { name: 'Lâm Thanh Trúc', time: '08:55 - 18:04', status: 'ot', note: 'Làm thêm TC 5p' },
        { name: 'Lê Hoài Linh', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
    ],
    'fri': [
        { name: 'Đỗ Thị Phương Thư', time: '09:00 - 18:18', status: 'ot', note: 'Làm thêm SC 8p' },
        { name: 'Dương Thị Mỹ Nhung', time: '09:00 - 18:00', status: 'on_time', note: '' },
    ],
    'sat': [
        { name: 'Đỗ Thị Phương Thư', time: '08:50 - 18:21', status: 'ot', note: 'Làm thêm TC 10p, Làm thêm SC 11p' },
        { name: 'Dương Thị Mỹ Nhung', time: '09:01 - 18:01', status: 'late', note: 'Đi muộn 1p' },
    ],
    'sun': [
        { name: 'Đỗ Thị Phương Thư', time: '-- - --', status: 'no_punch', note: 'Chưa chấm công' },
    ]
  },
  '2': {
      'mon': [{ name: 'Lê Thuỷ Ngân', time: '17:55 - 22:05', status: 'ot', note: 'Làm thêm SC 5p' }],
      'tue': [],
      'wed': [],
      'thu': [],
      'fri': [],
      'sat': [],
      'sun': []
  }
};

export default function TimesheetMatrix() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const [selectedRecord, setSelectedRecord] = useState<EmpRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const handleOpenApproval = (ticketId?: string) => {
    setSelectedTicketId(ticketId || null);
    setActiveTab('approval');
  };

  const handleRecordClick = (record: EmpRecord) => {
      setSelectedRecord(record);
      setIsRecordModalOpen(true);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full bg-white">
      {/* Header / Toolbar */}
      <div className="bg-white flex flex-col shrink-0 shadow-sm relative z-10">
         <TabsList className="bg-transparent border-b border-gray-200 w-full rounded-none p-0 h-auto justify-start px-5 mt-2 space-x-6">
            <TabsTrigger value="matrix" className="text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent px-1 py-3 transition-colors">
                Bảng chấm công
            </TabsTrigger>
            <TabsTrigger value="approval" className="text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent px-1 py-3 transition-colors">
                Duyệt chấm công
                <span className="ml-2 inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-bold leading-none shadow-sm ring-1 ring-red-500/20">99+</span>
            </TabsTrigger>
         </TabsList>

         <div className="px-5 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
             <div className="flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto">
                 {activeTab === 'matrix' && (
                 <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <div className="relative w-full sm:w-56 shrink-0">
                        <Select defaultValue="all">
                            <SelectTrigger className="pl-9 h-9 border-gray-300 text-sm focus:ring-1 focus:ring-blue-400 bg-white">
                                <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
                                <SelectValue placeholder="Tìm kiếm nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                                <SelectItem value="nv1">Đỗ Thị Phương Thư</SelectItem>
                                <SelectItem value="nv2">Dương Thị Mỹ Nhung</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="w-32 shrink-0">
                        <Select defaultValue="week">
                            <SelectTrigger className="h-9 border-gray-300 text-sm focus:ring-1 focus:ring-blue-400 bg-white">
                                <SelectValue placeholder="Chế độ xem" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">Theo tuần</SelectItem>
                                <SelectItem value="month">Theo tháng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm shrink-0">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-none rounded-l-md hover:bg-gray-100 text-gray-600"><ChevronLeft size={16} /></Button>
                        <div className="flex items-center px-3 h-9 border-x border-gray-200 bg-white text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors">
                            Tuần 3 - Th. 4 2026
                        </div>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-none rounded-r-md hover:bg-gray-100 text-gray-600"><ChevronRight size={16} /></Button>
                    </div>
                    
                    <Button variant="outline" className="h-9 px-4 text-sm font-medium bg-white border-gray-300 hover:bg-gray-50 hidden md:inline-flex">
                        Chọn
                    </Button>
                 </div>
                 )}
             </div>
             
             {activeTab === 'matrix' && (
             <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                 <Select defaultValue="shift">
                     <SelectTrigger className="h-9 border-gray-300 text-sm focus:ring-1 focus:ring-blue-400 bg-white w-40">
                         <div className="flex items-center gap-2">
                             <Calendar size={14} className="text-gray-500" />
                             <span>Xem theo ca</span>
                         </div>
                     </SelectTrigger>
                     <SelectContent>
                         <SelectItem value="shift">Xem theo ca</SelectItem>
                         <SelectItem value="emp">Xem theo nhân sự</SelectItem>
                     </SelectContent>
                 </Select>
             </div>
             )}
         </div>
      </div>

      <TabsContent value="matrix" className="flex-1 mt-0 flex flex-col min-h-0 bg-gray-50 border-none outline-none">
        <div className="flex-1 overflow-auto bg-gray-50/50 flex flex-col pt-4 px-4 pb-0">
          <div className="min-w-[1280px] border border-gray-200 rounded-t-lg bg-white shadow-sm flex flex-col relative w-full h-full overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-200 sticky top-0 z-20 bg-white text-gray-600">
             <div className="p-3.5 border-r border-gray-200 sticky left-0 z-30 bg-white flex items-center justify-between shadow-[1px_0_0_0_#e5e7eb]">
                <span className="font-bold text-sm text-gray-900">Ca làm việc</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:bg-gray-100"><Plus size={14} /></Button>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ hai</span>
                 <span className="font-semibold text-gray-900 text-sm">20</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ ba</span>
                 <span className="font-semibold text-gray-900 text-sm">21</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ tư</span>
                 <span className="font-semibold text-gray-900 text-sm">22</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ năm</span>
                 <span className="font-semibold text-gray-900 text-sm">23</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ sáu</span>
                 <span className="font-semibold text-gray-900 text-sm">24</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Thứ bảy</span>
                 <span className="font-semibold text-gray-900 text-sm">25</span>
             </div>
             <div className="p-3.5 text-center bg-white flex items-center justify-center gap-1.5">
                 <span className="text-sm font-medium text-gray-600">Chủ nhật</span>
                 <span className="font-semibold text-gray-900 text-sm">26</span>
             </div>
          </div>
          
          <div className="flex flex-1 relative bg-white overflow-y-auto min-h-0"> 
              {/* Left Column (Shifts) */}
              <div className="w-[200px] border-r border-gray-200 bg-white flex flex-col shrink-0 sticky left-0 z-10 shadow-[1px_0_4px_rgba(0,0,0,0.04)] text-sm">
                 {mockShifts.map((shift) => (
                    <div key={shift.id} className="p-4 border-b border-gray-200 flex flex-col items-start bg-white min-h-[360px]">
                        <span className="font-bold text-gray-900 uppercase">{shift.name}</span>
                        <span className="text-[13px] text-gray-500 mt-1 font-mono">{shift.time}</span>
                    </div>
                 ))}
              </div>

               {/* Matrix Data */}
              <div className="flex-1 grid grid-cols-7 relative">
                {['mon','tue','wed','thu','fri','sat','sun'].map((day, d_idx) => (
                    <div key={day} className={`flex flex-col border-r border-gray-100 last:border-r-0`}>
                       {mockShifts.map((shift) => {
                           const dayRecords = mockShiftData[shift.id]?.[day] || [];
                           return (
                               <div key={shift.id} className="border-b border-gray-200 flex flex-col flex-1 min-h-[360px] p-2 gap-2 bg-white">
                                   {dayRecords.map((record, i) => {
                                       let bgClass = '';
                                       let textClass = '';
                                       let noteClass = '';
                                       
                                       switch(record.status) {
                                           case 'late':
                                               bgClass = 'bg-[#fdf4ff] border-[#fdf4ff]';
                                               textClass = 'text-[#86198f]';
                                               noteClass = 'text-[#a21caf]';
                                               break;
                                           case 'missing_out':
                                               bgClass = 'bg-[#fef2f2] border-[#fef2f2]';
                                               textClass = 'text-[#b91c1c]';
                                               noteClass = 'text-[#dc2626]';
                                               break;
                                           case 'no_punch':
                                               bgClass = 'bg-[#fff7ed] border-[#fff7ed]';
                                               textClass = 'text-[#c2410c]';
                                               noteClass = 'text-[#ea580c]';
                                               break;
                                           case 'off':
                                               bgClass = 'bg-gray-50 border-gray-50';
                                               textClass = 'text-gray-500';
                                               noteClass = 'text-gray-400';
                                               break;
                                           case 'on_time':
                                           case 'ot':
                                           default:
                                               bgClass = 'bg-[#eff6ff] border-[#eff6ff]';
                                               textClass = 'text-[#1d4ed8]';
                                               noteClass = 'text-[#2563eb]';
                                               break;
                                       }

                                       return (
                                           <div key={i} 
                                              className={`rounded w-full border p-2.5 text-xs transition-colors cursor-pointer flex flex-col gap-1 hover:brightness-95 ${bgClass}`}
                                              onClick={() => handleRecordClick(record)}
                                           >
                                              <div className="font-semibold text-[#0f172a] truncate" title={record.name}>{record.name}</div>
                                              <div className={`font-mono text-[11px] font-medium ${textClass}`}>{record.time}</div>
                                              {record.note && (
                                                 <div className={`text-[11px] truncate leading-tight mt-0.5 ${noteClass}`} title={record.note}>{record.note}</div>
                                              )}
                                           </div>
                                       );
                                   })}
                               </div>
                           )
                       })}
                    </div>
                ))}
              </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="h-14 bg-white border-t border-gray-200 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-700 shrink-0 shadow-[0_-2px_6px_rgba(0,0,0,0.02)] z-10 w-full px-4">
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500 fill-blue-50" /> Đúng giờ</span>
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500 fill-purple-50" /> Đi muộn / Về sớm</span>
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-red-500 fill-red-50" /> Chấm công thiếu</span>
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500 fill-orange-50" /> Chưa chấm công</span>
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-400 fill-gray-50" /> Nghỉ làm</span>
      </div>
     </TabsContent>

     {/* Record Details Modal */}
     <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
       <DialogContent className="sm:max-w-[450px]">
         <DialogHeader>
           <DialogTitle>Chi tiết ca làm việc</DialogTitle>
         </DialogHeader>
         {selectedRecord && (
           <div className="py-2 space-y-4">
             <div className="grid grid-cols-[140px_1fr] items-center text-sm gap-2">
                <span className="font-medium text-gray-500">Nhân viên</span>
                <span className="font-bold text-gray-900">{selectedRecord.name}</span>
             </div>
             <div className="grid grid-cols-[140px_1fr] items-center text-sm gap-2">
                <span className="font-medium text-gray-500">Thời gian ghi nhận</span>
                <span className="font-mono font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{selectedRecord.time}</span>
             </div>
             <div className="grid grid-cols-[140px_1fr] items-center text-sm gap-2">
                <span className="font-medium text-gray-500">Trạng thái</span>
                <span className="font-medium">{
                    selectedRecord.status === 'on_time' ? 'Đúng giờ' :
                    selectedRecord.status === 'ot' ? 'Làm thêm ca' :
                    selectedRecord.status === 'late' ? 'Đi muộn / Về sớm' :
                    selectedRecord.status === 'missing_out' ? 'Chấm công thiếu' :
                    selectedRecord.status === 'no_punch' ? 'Chưa chấm công' : 'Nghỉ làm'
                }</span>
             </div>
             {selectedRecord.note && (
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-md text-sm text-gray-700 mt-2">
                    <span className="font-medium text-gray-500 mr-1">Ghi chú hệ thống:</span> 
                    {selectedRecord.note}
                  </div>
             )}
             
             <div className="pt-4 border-t flex gap-2 justify-end mt-4">
                 <Button variant="outline" onClick={() => setIsRecordModalOpen(false)}>Đóng</Button>
                 {(selectedRecord.status !== 'on_time' && selectedRecord.status !== 'off') && (
                     <Button 
                       className="bg-blue-600 hover:bg-blue-700 text-white" 
                       onClick={() => {
                           setIsRecordModalOpen(false);
                           handleOpenApproval('TK-' + Math.floor(Math.random() * 1000 + 1000));
                       }}
                     >
                         Xử lý yêu cầu
                     </Button>
                 )}
             </div>
           </div>
         )}
       </DialogContent>
     </Dialog>

     <TabsContent value="approval" className="flex-1 mt-0 border-none outline-none overflow-hidden h-full">
         <TimesheetApprovalTab defaultExpandedId={selectedTicketId} />
     </TabsContent>
    </Tabs>
  );
}

