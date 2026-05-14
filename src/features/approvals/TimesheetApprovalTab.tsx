import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { Ticket, TicketStatus } from './types';
import TicketProcessingFlow from './TicketProcessingFlow';

const mockTickets: Ticket[] = [
  {
    id: 'TK-101',
    employeeName: 'Nguyễn Văn A',
    code: 'NV001',
    date: '07/05/2026',
    type: 'abnormal',
    status: 'pending',
    standardShift: { start: '08:00', end: '17:00' },
    actualTime: { in: '08:15', out: '17:30', originalIn: '08:15', originalOut: '17:30' },
    reason: 'Rớt mạng phải dùng 4G máy cá nhân, cuối buổi ở lại dọn dẹp kho.',
    securityFlags: { 
      checkIn: { active: true, type: 'Sai MAC Wifi', status: 'pending', fineAmount: 50000 },
      checkOut: { active: true, type: 'Không có ảnh chụp', status: 'pending', fineAmount: 50000 }
    },
    lateOutFlag: { active: true, status: 'pending' },
    lateInFlag: { active: true, status: 'pending' },
  },
  {
    id: 'TK-102',
    employeeName: 'Trần Thị B',
    code: 'NV002',
    date: '07/05/2026',
    type: 'missing',
    status: 'pending',
    standardShift: { start: '08:00', end: '17:00' },
    actualTime: { in: '08:00', out: '' },
    reason: 'Quên check-out lúc về.',
  },
  {
    id: 'TK-103',
    employeeName: 'Lê Văn C',
    code: 'NV003',
    date: '07/05/2026',
    type: 'adhoc',
    status: 'pending',
    actualTime: { in: '09:00', out: '14:00' },
    reason: 'Quản lý gọi lên thay ca đột xuất do nhân sự ốm.',
    adhocStep: 1,
  },
  {
    id: 'TK-104',
    employeeName: 'Hoàng Văn D',
    code: 'NV004',
    date: '07/05/2026',
    type: 'missing',
    status: 'pending',
    standardShift: { start: '08:00', end: '17:00' },
    actualTime: { in: '', out: '' },
    reason: '(Hệ thống gộp) Quên Check-in và Check-out.',
  }
];

export default function TimesheetApprovalTab({ defaultExpandedId }: { defaultExpandedId?: string | null }) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);
  const [tickets, setTickets] = useState(mockTickets);
  const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');

  React.useEffect(() => {
    if (defaultExpandedId) {
      setExpandedId(defaultExpandedId);
    }
  }, [defaultExpandedId]);

  const toggleExpand = (ticket: Ticket) => {
    if (expandedId === ticket.id) {
       setExpandedId(null);
    } else {
       setExpandedId(ticket.id);
    }
  };

  const handleCloseTicket = React.useCallback((ticketId: string, status: TicketStatus) => {
     setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
     setExpandedId(null);
  }, []);

  const handleUpdateTicket = React.useCallback((updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden min-h-0 min-w-0 m-0 w-full h-full">
         {/* Left Filters */}
         <Card className="w-56 xl:w-64 shrink-0 rounded-none border-y-0 border-l-0 border-r border-gray-200 bg-white hidden md:flex flex-col overflow-y-auto h-full">
            <CardContent className="p-5 flex flex-col gap-8">
               <div>
                  <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3">Nhóm Yêu cầu</h3>
                  <div className="space-y-3">
                     <Label className="flex items-center space-x-3 text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900 transition-colors">
                         <Checkbox defaultChecked className="border-gray-300 data-[state=checked]:bg-blue-600" /> <span>Bất thường (Abnormal)</span>
                     </Label>
                     <Label className="flex items-center space-x-3 text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900 transition-colors">
                         <Checkbox defaultChecked className="border-gray-300 data-[state=checked]:bg-blue-600" /> <span>Quên In/Out (Missing)</span>
                     </Label>
                     <Label className="flex items-center space-x-3 text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900 transition-colors">
                         <Checkbox defaultChecked className="border-gray-300 data-[state=checked]:bg-blue-600" /> <span>Cập nhật Ca (Ad-hoc)</span>
                     </Label>
                  </div>
               </div>
               <div>
                  <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">Nhân viên</h3>
                  <div className="relative">
                      <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                      <Input placeholder="Tìm nhân viên..." className="h-9 pl-8 text-sm focus-visible:ring-1 focus-visible:border-blue-300 transition-shadow" />
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Right Data Table */}
         <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4 gap-4 min-w-0 min-h-0">
            {/* Toolbar Area */}
            <div className="flex justify-between items-center text-sm">
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start">
                    <button className={`px-5 py-1.5 text-sm font-medium rounded-md ${viewMode === 'pending' ? 'bg-gray-100 text-gray-900 shadow-sm pointer-events-none' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'} transition-all`} onClick={() => setViewMode('pending')}>Chờ duyệt ({tickets.filter(t => t.status === 'pending').length})</button>
                    <button className={`px-5 py-1.5 text-sm font-medium rounded-md ${viewMode === 'history' ? 'bg-gray-100 text-gray-900 shadow-sm pointer-events-none' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'} transition-all`} onClick={() => setViewMode('history')}>Lịch sử ({tickets.filter(t => t.status !== 'pending').length})</button>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto rounded-xl shadow-sm border border-gray-200 bg-white relative min-h-0">
               <Table>
                  <TableHeader className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 shadow-[0_1px_0_0_#e5e7eb]">
                     <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã</TableHead>
                        <TableHead className="w-48 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân loại</TableHead>
                        <TableHead className="w-56 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhân viên</TableHead>
                        <TableHead className="min-w-[200px] text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung thay đổi</TableHead>
                        <TableHead className="w-32 text-right pr-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {tickets.filter(t => (viewMode === 'pending' ? t.status === 'pending' : t.status !== 'pending')).length === 0 && (
                        <TableRow>
                           <TableCell colSpan={5} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <CheckCircle2 className="h-10 w-10 text-gray-300" />
                                <p className="text-base font-medium">{viewMode === 'pending' ? 'Tất cả yêu cầu đã được xử lý' : 'Lịch sử trống'}</p>
                                <p className="text-sm text-gray-400">Bạn đã hoàn thành công việc của mình.</p>
                              </div>
                           </TableCell>
                        </TableRow>
                     )}
                     {tickets.filter(t => (viewMode === 'pending' ? t.status === 'pending' : t.status !== 'pending')).map(ticket => {
                        const isExpanded = expandedId === ticket.id;
                        return (
                           <React.Fragment key={ticket.id}>
                              {/* Main Row */}
                              <TableRow className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/40 hover:bg-blue-50/60 relative' : 'hover:bg-gray-50'}`} onClick={() => toggleExpand(ticket)}>
                                 <TableCell className="text-center font-mono text-xs text-gray-500 relative">
                                    {isExpanded && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-r"></div>}
                                    {ticket.id.split('-')[1]}
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex flex-col gap-1.5 items-start">
                                       {ticket.type === 'abnormal' && <Badge variant="destructive" className="rounded-md font-medium text-[10px] tracking-wide px-1.5 py-0">BẤT THƯỜNG</Badge>}
                                       {ticket.type === 'missing' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-md font-medium text-[10px] tracking-wide px-1.5 py-0">THIẾU IN/OUT</Badge>}
                                       {ticket.type === 'adhoc' && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md font-medium text-[10px] tracking-wide px-1.5 py-0">CA ĐỘT XUẤT</Badge>}
                                       <span className="text-[11px] text-gray-500 font-medium">{ticket.date}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="font-semibold text-gray-900 text-sm">{ticket.employeeName}</div>
                                    <div className="text-gray-500 text-xs mt-0.5 font-mono">{ticket.code}</div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex flex-col gap-1.5">
                                       <div className="flex items-center gap-2 text-sm max-w-sm">
                                          <div className={`flex border shadow-sm rounded-md px-2 py-1 items-center gap-1.5 text-xs font-mono font-medium ${isExpanded ? 'bg-white border-blue-200 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                                             <span>{ticket.actualTime?.in || '--:--'}</span>
                                             <ChevronRight size={12} className={isExpanded ? 'text-blue-400' : 'text-gray-400'} />
                                             <span>{ticket.actualTime?.out || '--:--'}</span>
                                          </div>
                                          {ticket.standardShift && (
                                             <span className="text-xs text-gray-400 truncate">(Ca: {ticket.standardShift.start} - {ticket.standardShift.end})</span>
                                          )}
                                       </div>
                                       {ticket.reason && <div className="text-[11px] text-gray-600 truncate max-w-sm" title={ticket.reason}><span className="font-medium text-gray-800">Lý do:</span> {ticket.reason}</div>}
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                       {viewMode === 'history' ? (
                                          <>
                                            <Badge className={ticket.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100 shadow-none' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100 shadow-none'} variant="outline">
                                                {ticket.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className={`h-8 text-blue-600 hover:text-blue-800 ml-1 ${isExpanded ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-blue-50'}`} onClick={(e) => { e.stopPropagation(); toggleExpand(ticket); }}>
                                               {isExpanded ? 'Đóng HS' : 'Xem HS'}
                                            </Button>
                                          </>
                                       ) : (
                                          <>
                                             {!isExpanded && (
                                                 <Button variant="ghost" size="sm" className="h-8 hidden md:inline-flex text-red-600 hover:bg-red-50 hover:text-red-700 mr-1" onClick={(e) => { e.stopPropagation(); handleCloseTicket(ticket.id, 'rejected'); }}>
                                                    Bỏ qua
                                                 </Button>
                                             )}
                                             <Button variant={isExpanded ? 'ghost' : 'default'} size="sm" className={`h-8 transition-shadow ${isExpanded ? 'text-gray-600 hover:bg-gray-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`} onClick={(e) => { e.stopPropagation(); toggleExpand(ticket); }}>
                                                {isExpanded ? 'Đóng' : 'Xử lý'}
                                             </Button>
                                          </>
                                       )}
                                    </div>
                                 </TableCell>
                              </TableRow>
                              
                              {/* Expanded Panel */}
                              {isExpanded && (
                                 <TableRow className="bg-slate-50 border-b border-gray-200">
                                    <TableCell colSpan={5} className="p-0 overflow-hidden relative shadow-inner">
                                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r opacity-50"></div>
                                       <div className="p-6 md:p-8 flex flex-col gap-5">
                                          <div className="flex items-center justify-between">
                                             <h3 className="font-semibold text-lg tracking-tight text-gray-900 border-l-4 border-blue-500 pl-3">Quy trình Phê duyệt</h3>
                                          </div>
                                          <Card className="shadow-sm border-gray-200 border">
                                             <CardContent className="p-5">
                                                <TicketProcessingFlow 
                                                   ticket={ticket} 
                                                   viewMode={viewMode} 
                                                   onCloseTicket={handleCloseTicket} 
                                                   onUpdateTicket={handleUpdateTicket} 
                                                />
                                             </CardContent>
                                          </Card>
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
         </div>
    </div>
  );
}
