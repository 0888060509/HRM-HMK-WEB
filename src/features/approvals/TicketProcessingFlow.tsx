import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, CheckCircle2, ChevronRight, ShieldAlert, XCircle } from 'lucide-react';
import { Ticket, TicketStatus } from './types';

interface TicketProcessingFlowProps {
  ticket: Ticket;
  viewMode?: 'pending' | 'history';
  onCloseTicket: (ticketId: string, status: TicketStatus) => void;
  onUpdateTicket?: (updatedTicket: Ticket) => void; // allow parent to sync state
}

export default function TicketProcessingFlow({ ticket: initialTicket, viewMode = 'pending', onCloseTicket, onUpdateTicket }: TicketProcessingFlowProps) {
  const [ticket, setTicket] = useState(initialTicket);

  // Sync back to parent when local ticket state changes
  useEffect(() => {
     if (onUpdateTicket) onUpdateTicket(ticket);
  }, [ticket, onUpdateTicket]);

  const [actualIn, setActualIn] = useState(ticket.actualTime?.in || '');
  const [actualOut, setActualOut] = useState(ticket.actualTime?.out || '');
  
  const [useLeave, setUseLeave] = useState(false);
  const [applyFine, setApplyFine] = useState(false);
  
  const [inUTDecision, setInUTDecision] = useState<'forgiven' | 'unpaid' | null>(null);
  const [inApplyFine, setInApplyFine] = useState(false);
  const [outUTDecision, setOutUTDecision] = useState<'forgiven' | 'unpaid' | null>(null);
  const [outApplyFine, setOutApplyFine] = useState(false);
  const [inOTDecision, setInOTDecision] = useState<'rejected' | 'approved' | null>(null);
  const [outOTDecision, setOutOTDecision] = useState<'rejected' | 'approved' | null>(null);
  
  const [missingReasonType, setMissingReasonType] = useState('subjective');

  const [adhocStart, setAdhocStart] = useState(ticket.standardShift?.start || '08:00');
  const [adhocEnd, setAdhocEnd] = useState(ticket.standardShift?.end || '17:00');
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const updateSecurityFlag = (flagType: 'checkIn' | 'checkOut', status: TicketStatus) => {
     setTicket(prev => {
       if (prev.securityFlags && prev.securityFlags[flagType]) {
          let updatedFlags = { 
            ...prev.securityFlags, 
            [flagType]: { ...prev.securityFlags[flagType]!, status } 
          };

          if (status === 'rejected') {
             if (updatedFlags.checkIn) updatedFlags.checkIn = { ...updatedFlags.checkIn, status: 'rejected' };
             if (updatedFlags.checkOut) updatedFlags.checkOut = { ...updatedFlags.checkOut, status: 'rejected' };
          }
          return { ...prev, securityFlags: updatedFlags };
       }
       return prev;
     });
  };

  const updateSecurityFine = (flagType: 'checkIn' | 'checkOut', amount: number) => {
     setTicket(prev => {
       if (prev.securityFlags && prev.securityFlags[flagType]) {
          return { 
            ...prev, 
            securityFlags: { 
              ...prev.securityFlags, 
              [flagType]: { ...prev.securityFlags[flagType]!, fineAmount: amount } 
            } 
          };
       }
       return prev;
     });
  };

  const nextAdhocStep = () => {
     if (!showBudgetWarning) {
        setShowBudgetWarning(true);
        return;
     }
     setTicket(prev => {
        return { 
           ...prev, 
           adhocStep: 2, 
           standardShift: { start: adhocStart, end: adhocEnd },
           lateOutFlag: { active: (prev.actualTime?.out || '') > adhocEnd, status: 'pending' as TicketStatus },
           lateInFlag: { active: (prev.actualTime?.in || '') > adhocStart, status: 'pending' as TicketStatus },
        };
     });
  };

  const renderOTHandling = (type: 'in' | 'out', intro: string) => {
    const decision = type === 'in' ? inOTDecision : outOTDecision;
    const setDecision = type === 'in' ? setInOTDecision : setOutOTDecision;
    return (
       <>
          <p className="text-xs text-gray-500">{intro}</p>
          <div className="flex gap-3 mt-2">
             <Button variant="outline" size="sm" onClick={() => setDecision('rejected')} className={decision === 'rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'}>Từ chối ghi nhận (Tính theo giờ chuẩn)</Button>
             <Button variant="outline" size="sm" onClick={() => setDecision('approved')} className={decision === 'approved' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}>Duyệt giờ công thực tế</Button>
          </div>
       </>
    );
  };

  const renderUTHandling = (type: 'in' | 'out', intro: string) => {
    const decision = type === 'in' ? inUTDecision : outUTDecision;
    const setDecision = type === 'in' ? setInUTDecision : setOutUTDecision;
    const applyFineFlag = type === 'in' ? inApplyFine : outApplyFine;
    const setApplyFineFlag = type === 'in' ? setInApplyFine : setOutApplyFine;
    
    return (
       <>
          <p className="text-xs text-gray-500">{intro}</p>
          <div className="flex flex-col gap-3 mt-2">
             <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => setDecision('forgiven')} className={decision === 'forgiven' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}>Châm chước lỗi (Ghi nhận đủ ca)</Button>
                <Button variant="outline" size="sm" onClick={() => setDecision('unpaid')} className={decision === 'unpaid' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'}>Không châm chước (Tính giờ thực tế)</Button>
             </div>

             {decision === 'unpaid' && (
                 <Label className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-normal mt-1 animate-in fade-in">
                   <Checkbox checked={applyFineFlag} onCheckedChange={(c) => setApplyFineFlag(c===true)} />
                   <div className="flex flex-col gap-1">
                     <span className="text-sm font-semibold text-gray-800 leading-none">Phạt kỷ luật {type === 'in' ? 'Late In' : 'Early Out'}</span>
                     <span className="text-xs text-gray-500">Trừ tiền chuyên cần ngoài việc bị trừ công.</span>
                   </div>
                   {applyFineFlag && (
                      <div className="ml-auto flex items-center gap-4" onClick={(e) => e.preventDefault()}>
                         <div className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-100">
                            Phạt: -50,000 đ
                         </div>
                      </div>
                   )}
                 </Label>
             )}
          </div>
       </>
    );
  };

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
                     <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50 bg-white" onClick={() => updateSecurityFlag(type, 'rejected')}>
                        <XCircle size={16} className="mr-2" /> Đánh dấu Gian lận (Hủy ca)
                     </Button>
                     <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 bg-white" onClick={() => updateSecurityFlag(type, 'approved')}>
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
                                  onChange={(e) => updateSecurityFine(type, parseInt(e.target.value) || 0)} 
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
  };

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
  const isError = actualIn !== '' && actualOut !== '' && actualIn >= actualOut;
  const inMismatch = actualIn !== stdStart && actualIn !== '';
  const outMismatch = actualOut !== stdEnd && actualOut !== '';

  const canEditIn = ticket.type !== 'missing' || (isMissingIn || isMissingBoth);
  const canEditOut = ticket.type !== 'missing' || (isMissingOut || isMissingBoth);

  if (ticket.type === 'adhoc' && ticket.adhocStep !== 2) {
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
                  <label className="text-sm font-semibold text-gray-700">Tag vị trí / vai trò <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                      <Select defaultValue="pv">
                         <SelectTrigger className="h-10 bg-white border-gray-300 shadow-sm flex-1"><SelectValue/></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="pv">Phục vụ</SelectItem>
                            <SelectItem value="tn">Thu ngân</SelectItem>
                            <SelectItem value="kt">Kỹ thuật</SelectItem>
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
               {viewMode !== 'history' && <Button onClick={nextAdhocStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 shadow-sm">
                  {showBudgetWarning ? 'Lưu giải trình & Tiếp tục' : 'Thiết lập & Qua bước hậu kiểm'} <ChevronRight className="ml-2 -mr-1" size={16} />
               </Button>}
            </div>
         </div>
      );
  }

  return (
     <div className="flex flex-col gap-5 py-2">
         {ticket.type === 'adhoc' && ticket.adhocStep === 2 && (
             <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded font-medium text-sm flex justify-between items-center">
                <span>✓ Đã thiết lập ca gốc: {ticket.standardShift?.start} - {ticket.standardShift?.end}</span>
                {viewMode !== 'history' && <Button variant="link" className="h-auto p-0 text-indigo-600" onClick={() => setTicket(prev => ({...prev, adhocStep: 1}))}>Sửa lại</Button>}
             </div>
         )}
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
                                Xử lý check-in: {actualIn > stdStart ? 'Vào Trễ (Late In)' : 'Vào Sớm (Làm thêm giờ)'}
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
                                Xử lý check-out: {actualOut < stdEnd ? 'Ra Sớm (Early Out)' : 'Ra Trễ (Làm thêm giờ)'}
                            </h4>
                            {actualOut > stdEnd ? 
                               renderOTHandling('out', 'Giờ ra thực tế trễ hơn ca chuẩn (Dư giờ).') : 
                               renderUTHandling('out', 'Giờ ra thực tế sớm hơn ca chuẩn (tính Unpaid Time).')
                            }
                        </div>
                     )}
                     <div className="flex justify-end mt-2 border-t border-gray-200 pt-3">
                        {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => onCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
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
                           {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => onCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
                        </div>
                     </div>
                  </div>
               )}

               {(actualIn && actualOut && !isError && isPerfectTimeMatch) && ticket.type !== 'missing' && (
                  <div className="flex justify-end mt-2 pt-3">
                     {viewMode !== 'history' && <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => onCloseTicket(ticket.id, 'approved')}>Đóng Ticket</Button>}
                  </div>
               )}
            </div>
         )}
     </div>
  );
}
