import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar, Plus, CheckCircle2, Clock, AlertTriangle, HelpCircle, UserX } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import TimesheetApprovalTab from '../approvals/TimesheetApprovalTab';
import TicketProcessingFlow from '../approvals/TicketProcessingFlow';
import { Ticket, TicketStatus } from '../approvals/types';

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
  const [mockTicket, setMockTicket] = useState<Ticket | null>(null);

  const handleOpenApproval = (ticketId?: string) => {
    setSelectedTicketId(ticketId || null);
    setActiveTab('approval');
  };

  const handleRecordClick = (record: EmpRecord) => {
      setSelectedRecord(record);
      
      // Build a mock ticket if actionable
      if (record.status !== 'on_time' && record.status !== 'off') {
         // In a real app, status 'adhoc' would apply if the user punched without a schedule.
         // Here 'no_punch' means scheduled but no punches recorded -> 'missing' (both).
         // 'missing_out' means one punch is missing.
         // 'late', 'ot' -> 'abnormal'
         const type = (record.status === 'missing_out' || record.status === 'no_punch') ? 'missing' : 'abnormal';
         
         const timeParts = record.time ? record.time.split(' - ') : [];
         const inTime = timeParts[0] && timeParts[0] !== '--' ? timeParts[0] : '';
         const outTime = timeParts[1] && timeParts[1] !== '--' ? timeParts[1] : '';

         setMockTicket({
            id: 'TK-' + Math.floor(Math.random() * 1000 + 1000),
            employeeName: record.name,
            code: 'NV-MOCK',
            date: '20/05/2026',
            type,
            status: 'pending',
            standardShift: { start: '08:00', end: '17:00' },
            actualTime: { in: inTime, out: outTime },
            reason: record.note,
         });
      } else {
         setMockTicket(null);
      }

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

                    <div className="w-40 shrink-0 hidden lg:block">
                        <Select defaultValue="all-status">
                            <SelectTrigger className="h-9 border-gray-300 text-sm focus:ring-1 focus:ring-blue-400 bg-white">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                                <SelectItem value="late">Đi muộn / Về sớm</SelectItem>
                                <SelectItem value="missing_out">Chấm công thiếu</SelectItem>
                                <SelectItem value="no_punch">Unscheduled / Lỗi</SelectItem>
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
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-200 sticky top-0 z-20 bg-white text-gray-600 shadow-sm">
             <div className="p-3.5 border-r border-gray-200 sticky left-0 z-30 bg-gray-50 flex items-center justify-between shadow-[1px_0_0_0_#e5e7eb]">
                <span className="font-bold text-sm text-gray-900 uppercase">Ca làm việc</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:bg-gray-100"><Plus size={14} /></Button>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm">Thứ Hai</span>
                 <span className="text-xs text-gray-500 font-medium">20/05</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm">Thứ Ba</span>
                 <span className="text-xs text-gray-500 font-medium">21/05</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm">Thứ Tư</span>
                 <span className="text-xs text-gray-500 font-medium">22/05</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm">Thứ Năm</span>
                 <span className="text-xs text-gray-500 font-medium">23/05</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm">Thứ Sáu</span>
                 <span className="text-xs text-gray-500 font-medium">24/05</span>
             </div>
             <div className="p-3.5 border-r border-gray-200 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm text-blue-600">Thứ Bảy</span>
                 <span className="text-xs text-blue-500 font-medium">25/05</span>
             </div>
             <div className="p-3.5 bg-white flex flex-col items-center justify-center gap-0.5">
                 <span className="font-semibold text-gray-900 text-sm text-red-600">Chủ Nhật</span>
                 <span className="text-xs text-red-500 font-medium">26/05</span>
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
                                       let Icon = CheckCircle2;
                                       let iconColor = '';
                                       
                                       switch(record.status) {
                                           case 'late':
                                               bgClass = 'bg-purple-50 border-purple-100 hover:border-purple-300';
                                               textClass = 'text-purple-700';
                                               noteClass = 'text-purple-600';
                                               Icon = Clock;
                                               iconColor = 'text-purple-500';
                                               break;
                                           case 'missing_out':
                                               bgClass = 'bg-red-50 border-red-100 hover:border-red-300';
                                               textClass = 'text-red-700';
                                               noteClass = 'text-red-600';
                                               Icon = AlertTriangle;
                                               iconColor = 'text-red-500';
                                               break;
                                           case 'no_punch':
                                               bgClass = 'bg-orange-50 border-orange-100 hover:border-orange-300';
                                               textClass = 'text-orange-700';
                                               noteClass = 'text-orange-600';
                                               Icon = HelpCircle;
                                               iconColor = 'text-orange-500';
                                               break;
                                           case 'off':
                                               bgClass = 'bg-gray-50 border-gray-100 hover:border-gray-300 opacity-60 grayscale';
                                               textClass = 'text-gray-500';
                                               noteClass = 'text-gray-400';
                                               Icon = UserX;
                                               iconColor = 'text-gray-400';
                                               break;
                                           case 'ot':
                                               bgClass = 'bg-indigo-50 border-indigo-100 hover:border-indigo-300';
                                               textClass = 'text-indigo-700';
                                               noteClass = 'text-indigo-600';
                                               Icon = CheckCircle2;
                                               iconColor = 'text-indigo-500';
                                               break;
                                           case 'on_time':
                                           default:
                                               bgClass = 'bg-blue-50 border-blue-100 hover:border-blue-300';
                                               textClass = 'text-blue-700';
                                               noteClass = 'text-blue-600';
                                               Icon = CheckCircle2;
                                               iconColor = 'text-blue-500';
                                               break;
                                       }

                                       return (
                                           <div key={i} 
                                              className={`rounded w-full border border-l-4 p-2 transition-colors cursor-pointer flex flex-col gap-1 shadow-sm ${bgClass}`}
                                              onClick={() => handleRecordClick(record)}
                                           >
                                              <div className="flex items-start justify-between gap-1">
                                                 <div className="font-semibold text-gray-900 text-xs truncate" title={record.name}>{record.name}</div>
                                              </div>
                                              <div className={`font-mono text-[11px] font-medium flex items-center gap-1.5 ${textClass}`}>
                                                 <Icon size={12} className={iconColor} strokeWidth={2.5} />
                                                 {record.time}
                                              </div>
                                              {record.note && (
                                                 <div className={`text-[10px] truncate leading-tight mt-0.5 ${noteClass}`} title={record.note}>{record.note}</div>
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
         <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500 fill-indigo-50" /> Có OT</span>
         <span className="flex items-center gap-2"><Clock size={16} className="text-purple-500 fill-purple-50" /> Đi muộn / Về sớm</span>
         <span className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500 fill-red-50" /> Chấm thiếu giờ</span>
         <span className="flex items-center gap-2"><HelpCircle size={16} className="text-orange-500 fill-orange-50" /> Unscheduled / Lỗi</span>
         <span className="flex items-center gap-2"><UserX size={16} className="text-gray-400 fill-gray-50" /> Nghỉ làm</span>
      </div>
     </TabsContent>

     {/* Record Details Modal */}
     <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
       <DialogContent className={mockTicket ? "sm:max-w-[700px] max-h-[90vh] overflow-y-auto" : "sm:max-w-[450px]"}>
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
                    selectedRecord.status === 'on_time' ? <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Đúng giờ</span> :
                    selectedRecord.status === 'ot' ? <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Có OT</span> :
                    selectedRecord.status === 'late' ? <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Đi muộn / Về sớm</span> :
                    selectedRecord.status === 'missing_out' ? <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">Chấm công thiếu</span> :
                    selectedRecord.status === 'no_punch' ? <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Unscheduled / Lỗi</span> : <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Nghỉ làm</span>
                }</span>
             </div>
             {selectedRecord.note && (
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-md text-sm text-gray-700 mt-2">
                    <span className="font-medium text-gray-500 mr-1">Ghi chú hệ thống:</span> 
                    {selectedRecord.note}
                  </div>
             )}
             
             {mockTicket ? (
                 <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-lg tracking-tight text-gray-900 border-l-4 border-blue-500 pl-3 mb-4">Quy trình Phê duyệt</h3>
                    <TicketProcessingFlow 
                       ticket={mockTicket} 
                       onCloseTicket={(id, status) => {
                          setIsRecordModalOpen(false);
                          // We mock updating the cell here visually by just closing
                       }} 
                       onUpdateTicket={setMockTicket} 
                    />
                 </div>
             ) : (
                 <div className="pt-4 border-t flex gap-2 justify-end mt-4">
                     <Button variant="outline" onClick={() => setIsRecordModalOpen(false)}>Đóng</Button>
                 </div>
             )}
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

