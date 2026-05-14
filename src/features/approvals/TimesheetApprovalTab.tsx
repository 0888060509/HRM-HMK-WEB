import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Clock, ShieldAlert, XCircle, Search } from 'lucide-react';

type TicketStatus = 'pending' | 'approved' | 'rejected';

interface Ticket {
  id: string;
  employeeName: string;
  code: string;
  date: string;
  type: 'missing' | 'abnormal' | 'adhoc';
  status: TicketStatus;
  
  standardShift?: { start: string; end: string };
  actualTime?: { in: string; out: string; originalIn?: string; originalOut?: string };
  reason?: string;

  securityFlags?: {
    checkIn?: { active: boolean; type: string; status: TicketStatus; fineAmount: number };
    checkOut?: { active: boolean; type: string; status: TicketStatus; fineAmount: number };
  };
  lateOutFlag?: { active: boolean; status: TicketStatus };
  lateInFlag?: { active: boolean; status: TicketStatus };
  
  adhocStep?: 1 | 2;
}

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

  // Active Ticket States
  const activeTicket = tickets.find(t => t.id === expandedId);
  
  // Abnormal / Multi-Layer States
  const [actualIn, setActualIn] = useState('');
  const [actualOut, setActualOut] = useState('');
  
  // Layer B (Trễ / Sớm) Options
  const [useLeave, setUseLeave] = useState(false);
  const [applyFine, setApplyFine] = useState(false);
  
  const [inUseLeave, setInUseLeave] = useState(false);
  const [inApplyFine, setInApplyFine] = useState(false);
  const [outUseLeave, setOutUseLeave] = useState(false);
  const [outApplyFine, setOutApplyFine] = useState(false);
  const [inOTDecision, setInOTDecision] = useState<'rejected' | 'approved' | null>(null);
  const [outOTDecision, setOutOTDecision] = useState<'rejected' | 'approved' | null>(null);
  
  // Missing In/Out Options
  const [missingReasonType, setMissingReasonType] = useState('subjective'); // subjective | objective

  // Adhoc Setup
  const [adhocStart, setAdhocStart] = useState('08:00');
  const [adhocEnd, setAdhocEnd] = useState('17:00');
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const toggleExpand = (ticket: Ticket) => {
    if (expandedId === ticket.id) {
       setExpandedId(null);
    } else {
       setExpandedId(ticket.id);
       setActualIn(ticket.actualTime?.in || '');
       setActualOut(ticket.actualTime?.out || '');
       setUseLeave(false);
       setApplyFine(false);
       setInOTDecision(null);
       setOutOTDecision(null);
       setInUseLeave(false);
       setOutUseLeave(false);
       setInApplyFine(false);
       setOutApplyFine(false);
       setAdhocStart(ticket.standardShift?.start || '08:00');
       setAdhocEnd(ticket.standardShift?.end || '17:00');
       setShowBudgetWarning(false);
    }
  };

  const handleCloseTicket = (ticketId: string, status: TicketStatus = 'approved') => {
     setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
     setExpandedId(null);
  };

  const updateFlag = (ticketId: string, flagType: 'lateOutFlag' | 'lateInFlag', status: TicketStatus) => {
     setTickets(prev => prev.map(t => {
       if (t.id === ticketId && t[flagType]) {
          return { ...t, [flagType]: { ...t[flagType], status } };
       }
       return t;
     }));
  };

  const updateSecurityFlag = (ticketId: string, flagType: 'checkIn' | 'checkOut', status: TicketStatus) => {
     setTickets(prev => prev.map(t => {
       if (t.id === ticketId && t.securityFlags && t.securityFlags[flagType]) {
          let updatedFlags = { 
            ...t.securityFlags, 
            [flagType]: { ...t.securityFlags[flagType]!, status } 
          };

          if (status === 'rejected') {
             if (updatedFlags.checkIn) {
                updatedFlags.checkIn = { ...updatedFlags.checkIn, status: 'rejected' };
             }
             if (updatedFlags.checkOut) {
                updatedFlags.checkOut = { ...updatedFlags.checkOut, status: 'rejected' };
             }
          }

          return { ...t, securityFlags: updatedFlags };
       }
       return t;
     }));
  };

  const updateSecurityFine = (ticketId: string, flagType: 'checkIn' | 'checkOut', amount: number) => {
     setTickets(prev => prev.map(t => {
       if (t.id === ticketId && t.securityFlags && t.securityFlags[flagType]) {
          return { 
            ...t, 
            securityFlags: { 
              ...t.securityFlags, 
              [flagType]: { ...t.securityFlags[flagType]!, fineAmount: amount } 
            } 
          };
       }
       return t;
     }));
  };

  const nextAdhocStep = (ticket: Ticket) => {
     if (!showBudgetWarning) {
        setShowBudgetWarning(true);
        return;
     }
     setTickets(prev => prev.map(t => {
       if (t.id === ticket.id) {
          return { 
             ...t, 
             adhocStep: 2, 
             standardShift: { start: adhocStart, end: adhocEnd },
             lateOutFlag: { active: t.actualTime?.out > adhocEnd, status: 'pending' },
             lateInFlag: { active: t.actualTime?.in > adhocStart, status: 'pending' },
          };
       }
       return t;
     }));
  };

  const renderOTHandling = (type: 'in' | 'out', intro: string) => {
    const decision = type === 'in' ? inOTDecision : outOTDecision;
    const setDecision = type === 'in' ? setInOTDecision : setOutOTDecision;
    return (
       <>
          <p className="text-xs text-gray-500">{intro}</p>
          <div className="flex gap-3 mt-2">
             <Button variant="outline" size="sm" onClick={() => setDecision('rejected')} className={decision === 'rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'}>Từ chối OT (Cắt đuôi)</Button>
             <Button variant="outline" size="sm" onClick={() => setDecision('approved')} className={decision === 'approved' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}>Duyệt OT (Cộng quỹ)</Button>
          </div>
       </>
    );
  };

  const renderUTHandling = (type: 'in' | 'out', intro: string) => {
    const useLeaveFlag = type === 'in' ? inUseLeave : outUseLeave;
    const setUseLeaveFlag = type === 'in' ? setInUseLeave : setOutUseLeave;
    const applyFineFlag = type === 'in' ? inApplyFine : outApplyFine;
    const setApplyFineFlag = type === 'in' ? setInApplyFine : setOutApplyFine;
    
    return (
       <>
          <p className="text-xs text-gray-500">{intro}</p>
          <div className="flex flex-col gap-3 mt-2">
             <Label className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-normal">
               <Checkbox checked={useLeaveFlag} onCheckedChange={(c) => setUseLeaveFlag(c===true)} />
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-semibold text-gray-800 leading-none">Sử dụng OT/Phép bù (Lấp UT)</span>
                 <span className="text-xs text-gray-500">{type === 'in' ? 'Dùng quỹ bù giờ đi trễ.' : 'Dùng quỹ bù giờ về sớm.'}</span>
               </div>
               {useLeaveFlag && (
                  <div className="ml-auto" onClick={(e) => e.preventDefault()}>
                     <Select defaultValue="phepnam">
                        <SelectTrigger className="w-40 h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="phepnam" className="text-xs">Phép năm (Còn 12h)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               )}
             </Label>
             <Label className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-normal">
               <Checkbox checked={applyFineFlag} onCheckedChange={(c) => setApplyFineFlag(c===true)} />
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-semibold text-gray-800 leading-none">Phạt kỷ luật {type === 'in' ? 'Late In' : 'Early Out'}</span>
                 <span className="text-xs text-gray-500">Trừ thêm tiền chuyên cần.</span>
               </div>
               {applyFineFlag && (
                  <div className="ml-auto flex items-center gap-4" onClick={(e) => e.preventDefault()}>
                     <div className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-100">
                        Phạt: -50,000 đ
                     </div>
                  </div>
               )}
             </Label>
          </div>
       </>
    );
  };

  const renderTicketFlow = (ticket: Ticket) => {
     const checkInFlag = ticket.securityFlags?.checkIn;
     const checkOutFlag = ticket.securityFlags?.checkOut;
     const secBlocked = (checkInFlag?.active && checkInFlag.status === 'pending') || 
                        (checkOutFlag?.active && checkOutFlag.status === 'pending');
     const isSecRejected = checkInFlag?.status === 'rejected' || checkOutFlag?.status === 'rejected';

     const isMissingIn = !ticket.actualTime?.in && ticket.type === 'missing';
     const isMissingOut = !ticket.actualTime?.out && ticket.type === 'missing';
     const isMissingBoth = isMissingIn && isMissingOut;

     const stdStart = ticket.standardShift?.start || '08:00';
     const stdEnd = ticket.standardShift?.end || '17:00';
     const isPerfectTimeMatch = actualIn === stdStart && actualOut === stdEnd;
     const isError = actualIn && actualOut && actualIn >= actualOut;
     const inMismatch = actualIn !== stdStart && actualIn !== '';
     const outMismatch = actualOut !== stdEnd && actualOut !== '';

     // Access permissions for actual time input
     const canEditIn = ticket.type !== 'missing' || (isMissingIn || isMissingBoth);
     const canEditOut = ticket.type !== 'missing' || (isMissingOut || isMissingBoth);

     const renderSecurityLayer = (flag: { active: boolean; type: string; status: TicketStatus; fineAmount: number } | undefined, label: string, type: 'checkIn' | 'checkOut', isAnyRejected: boolean) => {
       if (!flag?.active) return null;
       const isRejectedLocally = flag.status === 'rejected';
       const isApprovedLocally = flag.status === 'approved';

       return (
         <Card className={`transition-colors shadow-sm ${flag.status === 'pending' ? 'bg-orange-50/50 border-orange-200' : isRejectedLocally ? 'bg-red-50 border-red-200 opacity-60' : 'bg-gray-50 border-gray-200'}`}>
            <CardContent className="p-4 flex flex-col gap-3">
               <div className="flex flex-col gap-3 bg-white/60 px-4 py-3 rounded border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <ShieldAlert className={flag.status === 'pending' ? 'text-orange-500' : flag.status === 'approved' ? 'text-green-500' : 'text-red-500'} size={18} />
                          <h4 className="font-bold text-sm">Tầng 1: Vi phạm Bảo mật ({label})</h4>
                          <Badge variant="destructive" className="ml-2">{flag.type}</Badge>
                       </div>
                       {flag.status === 'approved' && (
                         <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Đã hợp lệ hóa</Badge>
                       )}
                       {flag.status === 'rejected' && (
                         <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Đã đánh dấu gian lận</Badge>
                       )}
                   </div>
                   {flag.status === 'pending' && <div className="text-sm text-gray-700 pl-7 border-l-2 border-gray-200 ml-2 py-1">Lý do: {ticket.reason}</div>}
               </div>
               
               {flag.status === 'pending' && !isAnyRejected && (
                  <div className="flex items-center gap-4 mt-2 ml-1">
                     <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50 bg-white" onClick={() => updateSecurityFlag(ticket.id, type, 'rejected')}>
                           <XCircle size={16} className="mr-2" /> Đánh dấu Gian lận (Hủy ca)
                        </Button>
                        <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 bg-white" onClick={() => updateSecurityFlag(ticket.id, type, 'approved')}>
                           <CheckCircle2 size={16} className="mr-2" /> Hợp lệ hóa (Chấp nhận cảnh báo)
                        </Button>
                     </div>
                  </div>
               )}
               
               {flag.status === 'pending' && isAnyRejected && (
                  <Alert variant="destructive" className="mt-2 py-3 px-4 flex items-center bg-red-50/50">
                      <AlertDescription className="italic">Vi phạm này không cần xử lý thêm do ca làm việc đã bị đánh dấu gian lận.</AlertDescription>
                  </Alert>
               )}

               {isApprovedLocally && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200 mt-2">
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-gray-800">Quyết định: Tính tiền phạt (Do đã hợp lệ hóa)</span>
                        <span className="text-xs text-gray-500">Mặc định tính tiền phạt khi vi phạm bảo mật mà vẫn được duyệt.</span>
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Mức phạt:</span>
                            <div className="relative">
                              <Input type="number" 
                                     value={flag.fineAmount} 
                                     onChange={(e) => updateSecurityFine(ticket.id, type, parseInt(e.target.value) || 0)} 
                                     className="w-24 h-8 text-xs bg-white text-right pr-6"
                                     disabled={isAnyRejected} />
                              <span className="absolute right-2 top-2 text-xs text-gray-500">đ</span>
                            </div>
                         </div>
                         <Badge variant="outline" className="text-sm font-bold text-red-600 bg-red-50 border-red-100 px-3 py-1.5">
                            Phạt: -{flag.fineAmount.toLocaleString()} đ
                         </Badge>
                      </div>
                  </div>
               )}
            </CardContent>
         </Card>
       );
     }

     return (
        <div className="flex flex-col gap-5 py-2">
            {(checkInFlag?.active || checkOutFlag?.active) && (
               <div className="flex flex-col gap-4">
                  {renderSecurityLayer(checkInFlag, 'Check-in', 'checkIn', isSecRejected)}
                  {renderSecurityLayer(checkOutFlag, 'Check-out', 'checkOut', isSecRejected)}
                  
                  {isSecRejected && (
                       <Alert variant="destructive">
                           <ShieldAlert className="h-4 w-4" />
                           <AlertTitle>Bị từ chối</AlertTitle>
                           <AlertDescription>
                               Ca làm việc bị từ chối và KHÔNG ghi nhận giờ công do phát hiện gian lận bảo mật. Các bước tiếp theo đã bị vô hiệu hóa.
                           </AlertDescription>
                       </Alert>
                  )}
               </div>
            )}

            {!isSecRejected && (
               <div className={`flex flex-col gap-4 ${secBlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                  {/* Step 2: Confirmation of actual times */}
                  <div className={`flex items-center gap-6 p-4 rounded-md border ${isError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                     <div className="flex flex-col gap-1 w-1/3">
                        <span className="text-sm font-semibold text-gray-700">{checkInFlag?.active || checkOutFlag?.active ? 'Tầng 2' : 'Bước 1'}: Chốt giờ thực tế</span>
                        <p className="text-xs text-gray-500">{ticket.type === 'missing' ? 'Khóa dữ liệu thật. Nhập tay mốc giờ còn thiếu.' : 'Kiểm tra và có thể sửa lại giờ thực tế nếu sai lệch do máy.'}</p>
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2">
                              <span className="text-sm w-8">In:</span> 
                              <Input type="time" value={actualIn} onChange={e => setActualIn(e.target.value)} disabled={!canEditIn} className={`h-8 w-32 ${!canEditIn ? 'bg-gray-100 text-gray-500' : 'bg-white border-blue-300 ring-1 ring-blue-100'}`} />
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-sm w-8">Out:</span> 
                              <Input type="time" value={actualOut} onChange={e => setActualOut(e.target.value)} disabled={!canEditOut} className={`h-8 w-32 ${!canEditOut ? 'bg-gray-100 text-gray-500' : 'bg-white border-blue-300 ring-1 ring-blue-100'}`} />
                           </div>
                        </div>
                        {isError && <span className="text-xs text-red-600 font-medium">Lỗi: Giờ ra phải sau giờ vào.</span>}
                     </div>
                  </div>

                  {(!isPerfectTimeMatch && actualIn && actualOut && !isError) && (
                     <div className="flex flex-col gap-4 animate-in fade-in border-t border-gray-200 pt-4">
                        <div className="flex flex-col gap-1">
                           <span className="text-sm font-semibold text-gray-700">{checkInFlag?.active || checkOutFlag?.active ? 'Tầng 3' : 'Bước 2'}: Xử lý Ngoại lệ (Thời gian bị lệch)</span>
                           <p className="text-xs text-gray-500">Thời gian thực tế không khớp với ca chuẩn, hệ thống đã phân luồng tự động.</p>
                        </div>

                        {inMismatch && (
                           <div className={`p-4 border rounded-md flex flex-col gap-3 shadow-sm ${actualIn > stdStart ? 'bg-white border-red-100' : 'bg-white border-blue-100'}`}>
                               <h4 className={`font-bold text-sm flex items-center gap-2 ${actualIn > stdStart ? 'text-red-700' : 'text-blue-800'}`}>
                                   Xử lý check-in: {actualIn > stdStart ? 'Vào Trễ (Late In)' : 'Vào Sớm (Early In / OT)'}
                               </h4>
                               {actualIn < stdStart ? 
                                  renderOTHandling('in', 'Giờ vào thực tế sớm hơn ca chuẩn.') : 
                                  renderUTHandling('in', 'Giờ vào thực tế trễ hơn ca chuẩn (tính Unpaid Time).')
                               }
                           </div>
                        )}

                        {outMismatch && (
                           <div className={`p-4 border rounded-md flex flex-col gap-3 shadow-sm ${actualOut < stdEnd ? 'bg-white border-red-100' : 'bg-white border-blue-100'}`}>
                               <h4 className={`font-bold text-sm flex items-center gap-2 ${actualOut < stdEnd ? 'text-red-700' : 'text-blue-800'}`}>
                                   Xử lý check-out: {actualOut < stdEnd ? 'Ra Sớm (Early Out)' : 'Ra Trễ (Late Out / OT)'}
                               </h4>
                               {actualOut > stdEnd ? 
                                  renderOTHandling('out', 'Giờ ra thực tế trễ hơn ca chuẩn (Dư giờ).') : 
                                  renderUTHandling('out', 'Giờ ra thực tế sớm hơn ca chuẩn (tính Unpaid Time).')
                               }
                           </div>
                        )}
                        <div className="flex justify-end mt-2 border-t border-gray-200 pt-3">
                           {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => handleCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
                        </div>
                     </div>
                  )}

                  {(actualIn && actualOut && !isError && isPerfectTimeMatch) && ticket.type === 'missing' && (
                     <div className="flex items-start gap-6 p-4 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in">
                        <div className="flex flex-col gap-1 w-1/3">
                           <span className="text-sm font-semibold text-gray-700">Bước 2: Phân định lỗi</span>
                           <p className="text-xs text-gray-500">Ca khớp giờ chuẩn 100%. Xác nhận lý do cho lỗi quên chấm công.</p>
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                           <RadioGroup value={missingReasonType} onValueChange={setMissingReasonType} className="flex flex-col gap-3">
                              <Label className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer font-normal ${missingReasonType === 'subjective' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-red-200'}`}>
                                 <RadioGroupItem value="subjective" className="mt-1 text-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-red-600" />
                                 <div className="flex flex-col w-full">
                                    <span className="text-sm font-semibold text-gray-900">Lỗi chủ quan - Áp dụng phạt</span>
                                    {missingReasonType === 'subjective' && (
                                       <div className="flex items-center gap-2 mt-2 w-full" onClick={(e) => e.preventDefault()}>
                                          <span className="text-xs text-gray-600">Ghi đè số phút phạt (Tùy chọn):</span>
                                          <Input defaultValue="30" className="h-7 w-16 px-2 text-xs bg-white" />
                                          <span className="text-xs text-gray-500 font-medium">phút</span>
                                       </div>
                                    )}
                                 </div>
                              </Label>
                              <Label className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer font-normal ${missingReasonType === 'objective' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-green-200'}`}>
                                 <RadioGroupItem value="objective" className="mt-1 text-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-green-600" />
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">Lý do khách quan - Miễn phạt</span>
                                    <span className="text-xs text-gray-500">Miễn trừ toàn bộ vi phạm.</span>
                                 </div>
                              </Label>
                           </RadioGroup>
                           <div className="flex justify-end mt-2">
                              {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => handleCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
                           </div>
                        </div>
                     </div>
                  )}

                  {(actualIn && actualOut && !isError && isPerfectTimeMatch) && ticket.type !== 'missing' && (
                     <div className="flex justify-end mt-2 pt-3">
                        {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => handleCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
                     </div>
                  )}
               </div>
            )}
        </div>
     );
  };

  const renderAdhoc = (ticket: Ticket) => {
      if (ticket.adhocStep !== 2) {
          return (
             <div className="flex flex-col gap-5 py-4 px-2">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 shadow-sm">
                   <AlertCircle className="h-4 w-4 !text-blue-600" />
                   <AlertDescription>
                      Đây là ca phát sinh đột xuất. Vui lòng thiết lập <span className="font-bold">Ca Gốc (Định mức)</span> để làm cơ sở đối chiếu chấm công.
                   </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-6 p-5 border border-gray-200 rounded-lg bg-gray-50/50">
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Giờ tiêu chuẩn <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2">
                         <Input type="time" value={adhocStart} onChange={e => setAdhocStart(e.target.value)} className="h-10 bg-white border-gray-300 shadow-sm"/>
                         <span className="text-gray-400">đến</span>
                         <Input type="time" value={adhocEnd} onChange={e => setAdhocEnd(e.target.value)} className="h-10 bg-white border-gray-300 shadow-sm"/>
                      </div>
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Tag kỹ năng & Quy quỹ <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                          <Select defaultValue="pv">
                             <SelectTrigger className="h-10 bg-white border-gray-300 shadow-sm flex-1"><SelectValue/></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="pv">Phục vụ</SelectItem>
                                <SelectItem value="tn">Thu ngân</SelectItem>
                                <SelectItem value="kt">Kỹ thuật</SelectItem>
                             </SelectContent>
                          </Select>
                          <Select defaultValue="base">
                             <SelectTrigger className="h-10 bg-gray-100 border-gray-300 shadow-sm flex-1 opacity-70"><SelectValue/></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="base">Quỹ Base (Tự động tính)</SelectItem>
                                <SelectItem value="ot">Quỹ OT</SelectItem>
                             </SelectContent>
                          </Select>
                      </div>
                   </div>
                </div>

                {showBudgetWarning && (
                   <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 shadow-sm">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle className="flex justify-between items-center pr-2">
                          <span>Cảnh báo: Vượt Budget Cap Tháng (Soft-block)</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">Tạo Audit Log Cấp Cao</span>
                      </AlertTitle>
                      <AlertDescription className="mt-2 flex flex-col gap-3">
                         <p>Ca đột xuất này sẽ làm quỹ lương tháng vượt mức. Cho phép duyệt để trả lương thực tế, nhưng Audit Log sẽ được gửi đến Giám đốc Vùng.</p>
                         <Input placeholder="Nhập lý do giải trình..." className="w-full bg-white border-red-200 focus-visible:ring-red-500" />
                      </AlertDescription>
                   </Alert>
                )}

                <div className="flex justify-end pr-2 mt-2">
                   {viewMode !== 'history' && <Button onClick={() => nextAdhocStep(ticket)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 shadow-sm">
                      {showBudgetWarning ? 'Lưu giải trình & Tiếp tục' : 'Thiết lập & Qua bước hậu kiểm'} <ChevronRight className="ml-2 -mr-1" size={16} />
                   </Button>}
                </div>
             </div>
          )
      }

       // Step 2 uses TicketFlow rendering
      return (
         <div className="p-2 flex flex-col gap-3">
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded font-medium text-sm flex justify-between items-center">
               <span>✓ Đã thiết lập ca gốc: {ticket.standardShift?.start} - {ticket.standardShift?.end}</span>
               {viewMode !== 'history' && <Button variant="link" className="h-auto p-0 text-indigo-600" onClick={() => setTickets(ts => ts.map(t => t.id === ticket.id ? {...t, adhocStep: 1} : t))}>Sửa lại</Button>}
            </div>
            {renderTicketFlow(ticket)}
         </div>
      );
  };

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
                                                {ticket.type === 'adhoc' ? renderAdhoc(ticket) : renderTicketFlow(ticket)}
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
