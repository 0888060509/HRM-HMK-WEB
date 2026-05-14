import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Copy, Plus, MoreHorizontal, Search, Filter, Edit2, Trash2, User, AlertCircle, CheckCircle, XCircle, Smartphone, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

type Bid = { id: string; employeeId: string; employeeName: string; status: 'pending' | 'approved' | 'rejected'; avatar: string };
type ShiftRecord = { id: string; employeeId: string; day: number; type: 'morning' | 'evening'; title: string; time: string; bids?: Bid[]; draftEmployeeId?: string; draftEmployeeName?: string; isLocked?: boolean };

const MOCK_EMPLOYEES = [
  { id: 'emp-0', name: 'Nhân viên 1', role: 'Thu ngân' },
  { id: 'emp-1', name: 'Nhân viên 2', role: 'Pha chế' },
  { id: 'emp-2', name: 'Nhân viên 3', role: 'Thu ngân' },
  { id: 'emp-3', name: 'Nhân viên 4', role: 'Pha chế' },
  { id: 'emp-4', name: 'Nhân viên 5', role: 'Thu ngân' },
];

const INIT_SHIFTS: ShiftRecord[] = [
  { id: 'open-1', employeeId: 'open', day: 1, type: 'morning', title: 'Ca Sáng (Thiếu 1)', time: '08:00 - 16:00', bids: [{ id: 'bid-1', employeeId: 'emp-5', employeeName: 'Hoàng Long', status: 'pending', avatar: 'HL' }] },
  { id: 'open-2', employeeId: 'open', day: 4, type: 'morning', title: 'Ca Sáng (Thiếu 1)', time: '08:00 - 16:00' },
];
MOCK_EMPLOYEES.forEach((emp, empIdx) => {
  for(let day=0; day<7; day++) {
      const isOff = (day === 5 && empIdx === 1) || (day === 6 && empIdx === 0);
      if (isOff) continue;
      // create some overtime for emp-1
      const isMorning = (empIdx + day) % 2 === 0;
      INIT_SHIFTS.push({
          id: `shift-${empIdx}-${day}`,
          employeeId: emp.id,
          day,
          type: isMorning ? 'morning' : 'evening',
          title: isMorning ? 'Ca Sáng' : 'Ca Tối',
          time: isMorning ? '08:00 - 16:00' : '16:00 - 23:00'
      });
  }
});
// push an extra shift for emp-1 to make them exceed 48h
INIT_SHIFTS.push({
    id: `shift-1-4-extra`,
    employeeId: 'emp-1',
    day: 4,
    type: 'evening',
    title: 'Ca Tối',
    time: '16:00 - 23:00'
});

function AssignEmployeePopoverContent({ 
  role, 
  matrixKey, 
  onAssign, 
  onRequestSupport 
}: { 
  role: string;
  matrixKey: string;
  onAssign: (key: string, empName: string) => void;
  onRequestSupport: (key: string) => void;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const matchedEmployees = MOCK_EMPLOYEES.filter(e => e.role === role && e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const otherEmployees = MOCK_EMPLOYEES.filter(e => e.role !== role && e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAssignClick = (empName: string, isOverride: boolean) => {
        if (isOverride) {
            if (window.confirm('CẢNH BÁO RỦI RO VẬN HÀNH:\n\nNhân sự không có kỹ năng phù hợp. Nếu bạn vẫn muốn ép ca này, thao tác sẽ được lưu vào Audit Log Đỏ.\n\nTiếp tục?')) {
                onAssign(matrixKey, empName + ' (Ép ca)');
            }
        } else {
            onAssign(matrixKey, empName);
        }
    };

    return (
        <PopoverContent className="p-0 w-64 shadow-lg" side="bottom">
            <div className="p-2 border-b border-gray-100 bg-white placeholder-gray-400 rounded-t-md">
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                    <Input 
                        placeholder="Tìm kiếm nhân viên..." 
                        className="pl-8 h-9 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
            <div className="flex flex-col max-h-56 overflow-y-auto bg-white">
                {matchedEmployees.length > 0 && (
                    <div className="px-2.5 py-1.5 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider sticky top-0">
                        Đúng kỹ năng ({role})
                    </div>
                )}
                {matchedEmployees.map(emp => (
                    <div 
                        key={emp.id} 
                        className="p-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0 transition-colors" 
                        onClick={() => handleAssignClick(emp.name, false)}
                    >
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {emp.name.split(' ').pop()?.substring(0,2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="truncate font-medium text-gray-700">{emp.name}</span>
                            <span className="truncate text-xs text-gray-500">{emp.role}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Sẵn sàng"></div>
                    </div>
                ))}
                
                {otherEmployees.length > 0 && (
                    <div className="px-2.5 py-1.5 bg-red-50 text-[10px] font-bold text-red-600 uppercase tracking-wider sticky top-0 mt-1 border-t border-red-100">
                        Khác kỹ năng (Vượt rào)
                    </div>
                )}
                {otherEmployees.map(emp => (
                    <div 
                        key={emp.id} 
                        className="p-2.5 text-sm hover:bg-red-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0 transition-colors" 
                        onClick={() => handleAssignClick(emp.name, true)}
                    >
                        <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {emp.name.split(' ').pop()?.substring(0,2).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="truncate font-medium text-gray-700">{emp.name}</span>
                            <span className="truncate text-xs text-red-500">{emp.role}</span>
                        </div>
                        <AlertCircle size={14} className="text-red-400 shrink-0" />
                    </div>
                ))}

                {matchedEmployees.length === 0 && otherEmployees.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        Không tìm thấy nhân viên
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-md">
                <Button 
                    variant="outline" 
                    className="w-full text-xs h-8 text-orange-600 border-orange-200 hover:bg-orange-50 bg-white flex items-center justify-center shadow-sm"
                    onClick={() => onRequestSupport(matrixKey)}
                >
                    <AlertCircle size={14} className="mr-1.5" />
                    Tạo Y/C Sự cố (Handshake)
                </Button>
            </div>
        </PopoverContent>
    );
}

export default function ShiftScheduling() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day');
  const [openCreateShift, setOpenCreateShift] = useState(false);
  const [openAddShiftToSchedule, setOpenAddShiftToSchedule] = useState(false);
  const [slots, setSlots] = useState([{ id: 1, role: 'Thu ngân', count: 1 }]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [shifts, setShifts] = useState<ShiftRecord[]>(INIT_SHIFTS);
  const [matrixShifts, setMatrixShifts] = useState([
      { id: 'shift-1', title: 'Ca Sáng', time: '08:00 - 16:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 2 }], activeDays: ['mon','tue','wed','thu','fri','sat','sun'] },
      { id: 'shift-2', title: 'Ca Tối', time: '16:00 - 23:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 3 }], activeDays: ['mon','tue','wed','thu','fri','sat','sun'] }
  ]);
  const [selectedTemplateForMatrix, setSelectedTemplateForMatrix] = useState('template1');
  const [selectedDaysForMatrix, setSelectedDaysForMatrix] = useState('all');
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekStatuses, setWeekStatuses] = useState<Record<number, 'DRAFT' | 'PUBLISHED' | 'REVIEWING' | 'APPROVED'>>({
      0: 'DRAFT'
  });

  const weekStatus = weekStatuses[weekOffset] || 'DRAFT';
  
  const setWeekStatus = (status: 'DRAFT' | 'PUBLISHED' | 'REVIEWING' | 'APPROVED') => {
      setWeekStatuses(prev => ({ ...prev, [weekOffset]: status }));
  };

  const [matrixState, setMatrixState] = useState<Record<string, { bids: Bid[], draftEmployeeName?: string }>>({
      'shift-1_mon_Thu ngân': { bids: [{ id: 'b1', employeeId: 'emp-6', employeeName: 'Hoàng Long', status: 'pending', avatar: 'HL' }] },
      'shift-2_thu_Pha chế': { bids: [{ id: 'b2', employeeId: 'emp-7', employeeName: 'Minh Tuấn', status: 'pending', avatar: 'MT' }] }
  });

  const handleCopyLastWeek = () => {
      setMatrixShifts([
          { id: 'shift-1', title: 'Ca Sáng', time: '08:00 - 16:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 2 }], activeDays: ['mon','tue','wed','thu','fri','sat','sun'] },
          { id: 'shift-2', title: 'Ca Tối', time: '16:00 - 23:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 3 }], activeDays: ['mon','tue','wed','thu','fri','sat','sun'] }
      ]);
      setMatrixState({});
  };

  const currentMatrixShifts = weekOffset > 0 && matrixShifts.length > 0 && Object.keys(matrixState).length > 0 && matrixShifts.length === 2 ? [] : matrixShifts;

  // Handlers for Matrix Bids
  const handleApproveMatrixBid = (key: string, bidId: string) => {
      setMatrixState(prev => {
          const item = prev[key];
          if (!item) return prev;
          const bid = (item.bids || []).find(b => b.id === bidId);
          if (!bid) return prev;
          return {
              ...prev,
              [key]: {
                  bids: (item.bids || []).map(b => ({ ...b, status: b.id === bidId ? 'approved' : 'rejected' })),
                  draftEmployeeName: bid.employeeName
              }
          };
      });
  };

  const handleRejectMatrixBid = (key: string, bidId: string) => {
      setMatrixState(prev => {
          const item = prev[key];
          if (!item) return prev;
          const bid = (item.bids || []).find(b => b.id === bidId);
          const isDraftReject = item.draftEmployeeName === bid?.employeeName;
          return {
              ...prev,
              [key]: {
                  bids: (item.bids || []).map(b => ({ ...b, status: b.id === bidId ? 'rejected' : b.status })),
                  draftEmployeeName: isDraftReject ? undefined : item.draftEmployeeName
              }
          };
      });
  };

  const handleResetMatrixDraft = (key: string) => {
      setMatrixState(prev => {
          const item = prev[key];
          if (!item) return prev;
          return {
              ...prev,
              [key]: {
                  bids: (item.bids || []).map(b => ({ ...b, status: 'pending' })),
                  draftEmployeeName: undefined
              }
          };
      });
  };

  const handleAssignMatrixSlot = (key: string, employeeName: string) => {
      setMatrixState(prev => {
          const item = prev[key] || { bids: [] };
          return {
              ...prev,
              [key]: {
                  ...item,
                  draftEmployeeName: employeeName
              }
          };
      });
  };

  const handleRequestSupport = (key: string) => {
      handleAssignMatrixSlot(key, '(Đã gửi Y/C hỗ trợ)');
  };

  const handleDragStart = (e: React.DragEvent, shiftId: string) => {
      e.dataTransfer.setData('shiftId', shiftId);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetEmployeeId: string, day: number) => {
      e.preventDefault();
      const shiftId = e.dataTransfer.getData('shiftId');
      if (shiftId) {
          setShifts(prev => prev.map(s => {
              if (s.id === shiftId) {
                  let nextTitle = s.title.replace(' (Thiếu 1)', '');
                  if (targetEmployeeId === 'open') {
                      nextTitle += ' (Thiếu 1)';
                  }
                  return { ...s, employeeId: targetEmployeeId, day, title: nextTitle };
              }
              return s;
          }));
      }
  };

  const handleApproveBid = (shiftId: string, bidId: string) => {
      setShifts(prev => prev.map(s => {
          if (s.id === shiftId && s.bids) {
              const approvedBid = s.bids.find(b => b.id === bidId);
              if (approvedBid) {
                  const updatedBids = s.bids.map(b => ({
                      ...b,
                      status: b.id === bidId ? 'approved' : 'rejected'
                  })) as Bid[];
                  return { ...s, bids: updatedBids, draftEmployeeId: approvedBid.employeeId, draftEmployeeName: approvedBid.employeeName };
              }
          }
          return s;
      }));

      setTimelineShifts((prev: any[]) => prev.map((s: any) => {
          if (s.id === shiftId && s.bids) {
              const approvedBid = s.bids.find((b: any) => b.id === bidId);
              if (approvedBid) {
                  const updatedBids = s.bids.map(b => ({
                      ...b,
                      status: b.id === bidId ? 'approved' : 'rejected'
                  })) as Bid[];
                  return { ...s, bids: updatedBids, draftEmployeeId: approvedBid.employeeId, draftEmployeeName: approvedBid.employeeName };
              }
          }
          return s;
      }));
  };

  const handleRejectBid = (shiftId: string, bidId: string) => {
      setShifts(prev => prev.map(s => {
          if (s.id === shiftId && s.bids) {
              const updatedBids = s.bids.map(b => b.id === bidId ? { ...b, status: 'rejected' } : b) as Bid[];
              const isDraftRejected = s.bids.find(b => b.id === bidId)?.employeeId === s.draftEmployeeId;
              return { 
                  ...s, 
                  bids: updatedBids, 
                  draftEmployeeId: isDraftRejected ? undefined : s.draftEmployeeId,
                  draftEmployeeName: isDraftRejected ? undefined : s.draftEmployeeName 
              };
          }
          return s;
      }));

      setTimelineShifts((prev: any[]) => prev.map((s: any) => {
          if (s.id === shiftId && s.bids) {
              const updatedBids = s.bids.map((b: any) => b.id === bidId ? { ...b, status: 'rejected' } : b) as Bid[];
              const isDraftRejected = s.bids.find(b => b.id === bidId)?.employeeId === s.draftEmployeeId;
              return { 
                  ...s, 
                  bids: updatedBids, 
                  draftEmployeeId: isDraftRejected ? undefined : s.draftEmployeeId,
                  draftEmployeeName: isDraftRejected ? undefined : s.draftEmployeeName 
              };
          }
          return s;
      }));
  };

  const handlePublishSchedule = () => {
      setWeekStatus('APPROVED');
      // 1. Weekly Shifts
      setShifts(prev => prev.map(s => {
          if (s.draftEmployeeId) {
              return {
                  ...s,
                  employeeId: s.draftEmployeeId,
                  title: s.type === 'morning' ? 'Ca Sáng' : 'Ca Tối',
                  bids: [],
                  draftEmployeeId: undefined,
                  draftEmployeeName: undefined,
                  isLocked: true
              };
          }
          return s;
      }));

      // 2. Timeline Shifts
      setTimelineShifts((prev: any[]) => prev.map((s: any) => {
          if (s.draftEmployeeId) {
              return {
                  ...s,
                  type: 'assigned',
                  employeeName: s.draftEmployeeName || '',
                  short: s.draftEmployeeName?.split(' ').pop()?.charAt(0) || '?',
                  bids: [],
                  draftEmployeeId: undefined,
                  draftEmployeeName: undefined,
              };
          }
          return s;
      }));
      // In a real app, send notifications here
  };

  const getEmployeeHours = (empId: string) => {
      return shifts.filter(s => s.employeeId === empId).reduce((acc, s) => acc + (s.type === 'morning' ? 8 : 7), 0);
  };

  const getOpenShiftsCount = () => shifts.filter(s => s.employeeId === 'open').length;
  const getViolationsCount = () => MOCK_EMPLOYEES.filter(emp => getEmployeeHours(emp.id) > 48).length;

  const [customShiftName, setCustomShiftName] = useState('Ca Mới');

  const [timelineRoles] = useState([
      { id: 'role-1', name: 'Thu ngân', limit: '1-2', color: 'blue' },
      { id: 'role-2', name: 'Pha chế', limit: '2-3', color: 'blue', rowCount: 2 },
      { id: 'role-3', name: 'Phục vụ Part-time', limit: 'Linh hoạt', color: 'orange' }
  ]);

  const [timelineShifts, setTimelineShifts] = useState([
      { id: 'ts-1', roleId: 'role-1', title: 'Ca Sáng', time: '08:00 - 16:00', employeeName: 'Nhân viên 1', short: 'N1', type: 'assigned', rowIdx: 0 },
      { id: 'ts-2', roleId: 'role-1', title: 'Ca Tối', time: '16:00 - 23:00', employeeName: 'Nhân viên 3', short: 'N3', type: 'assigned', rowIdx: 0 },
      { id: 'ts-3', roleId: 'role-2', title: 'Nhân viên 2', time: '08:00 - 16:00', employeeName: 'Nhân viên 2', short: 'N2', type: 'assigned', rowIdx: 0 },
      { id: 'ts-4', roleId: 'role-2', title: 'Nhân viên 4', time: '16:00 - 23:00', employeeName: 'Nhân viên 4', short: 'N4', type: 'assigned', rowIdx: 1 },
      { id: 'ts-5', roleId: 'role-2', title: 'Nhân viên 5', time: '08:00 - 16:00', employeeName: 'Nhân viên 5', short: 'N5', type: 'assigned', rowIdx: 0, color: 'purple' },
      { id: 'ts-6', roleId: 'role-2', title: 'Thiếu 1 Pha chế', time: '16:00 - 23:00', type: 'open', rowIdx: 1, bids: [{ id: 'bid-2', employeeId: 'emp-6', employeeName: 'Hoàng Long', status: 'pending', avatar: 'HL' }], draftEmployeeId: '', draftEmployeeName: '' },
      { id: 'ts-7', roleId: 'role-3', title: 'Ca gãy Trưa', time: '11:00 - 14:00', employeeName: 'PT', short: 'PT', type: 'assigned', rowIdx: 0 },
      { id: 'ts-8', roleId: 'role-3', title: 'Ca gãy Tối', time: '18:00 - 22:00', employeeName: 'PT', short: 'PT', type: 'assigned', rowIdx: 0 },
  ]);

  const handleAddShiftToTimeline = () => {
      const templates: Record<string, any> = {
          template1: { time: '08:00 - 16:00', title: 'Ca Sáng', reqs: [{role: 'Thu ngân'}, {role: 'Pha chế'}] },
          template2: { time: '16:00 - 23:00', title: 'Ca Tối', reqs: [{role: 'Thu ngân'}, {role: 'Pha chế'}] },
          template3: { time: '11:00 - 14:00', title: 'Ca gãy Trưa', reqs: [{role: 'Phục vụ Part-time'}] },
          template4: { time: '17:00 - 21:00', title: 'Ca gãy Chiều', reqs: [{role: 'Phục vụ Part-time'}] },
      };

      if (selectedTemplateForMatrix === 'custom') {
          const newShifts = slots.map((s, idx) => {
              const role = timelineRoles.find(r => r.name === s.role) || timelineRoles[0];
              return {
                  id: `ts-new-${Date.now()}-${idx}`,
                  roleId: role.id,
                  title: customShiftName || `Ca Tùy Chỉnh`,
                  time: `${startTime} - ${endTime}`,
                  employeeName: 'Trống',
                  short: '?',
                  type: 'open',
                  rowIdx: 0,
              };
          });
          setTimelineShifts(prev => [...prev, ...newShifts]);
      } else {
          const s = templates[selectedTemplateForMatrix];
          if (s) {
              const newShifts = s.reqs.map((r: any, idx: number) => {
                  const role = timelineRoles.find(tr => tr.name === r.role) || timelineRoles[0];
                  return {
                      id: `ts-new-${Date.now()}-${idx}`,
                      roleId: role.id,
                      title: s.title,
                      time: s.time,
                      employeeName: 'Trống',
                      short: '?',
                      type: 'open',
                      rowIdx: 0,
                  };
              });
              setTimelineShifts(prev => [...prev, ...newShifts]);
          }
      }
      setOpenAddShiftToSchedule(false);
  };

  const handleAddShiftToMatrix = () => {
      const templates: Record<string, any> = {
          template1: { id: Date.now().toString(), title: 'Ca Sáng Tiêu Chuẩn', time: '08:00 - 16:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 2 }] },
          template2: { id: Date.now().toString(), title: 'Ca Tối Cuối Tuần', time: '16:00 - 23:00', requirements: [{ tag: 'Thu ngân', min: 1, max: 1 }, { tag: 'Pha chế', min: 2, max: 3 }] },
          template3: { id: Date.now().toString(), title: 'Ca Gãy Trưa', time: '11:00 - 14:00', requirements: [{ tag: 'Phục vụ', min: 1, max: 2 }] },
          template4: { id: Date.now().toString(), title: 'Ca Gãy Chiều', time: '17:00 - 21:00', requirements: [{ tag: 'Phục vụ', min: 2, max: 3 }] },
      };

      let baseShift = templates[selectedTemplateForMatrix];
      
      if (selectedTemplateForMatrix === 'custom') {
          baseShift = {
              id: Date.now().toString(),
              title: customShiftName || 'Ca Tùy Chỉnh',
              time: `${startTime} - ${endTime}`,
              requirements: slots.map(s => ({ tag: s.role, min: s.count, max: s.count }))
          };
      }

      if (!baseShift) return;
      
      let activeDays = ['mon','tue','wed','thu','fri','sat','sun'];
      if (selectedDaysForMatrix === 'weekdays') {
          activeDays = ['mon','tue','wed','thu','fri'];
      } else if (selectedDaysForMatrix === 'weekend') {
          activeDays = ['sat','sun'];
      }

      setMatrixShifts(prev => [...prev, { ...baseShift, activeDays }]);
      setOpenAddShiftToSchedule(false);
  };

  const totalMax = useMemo(() => slots.reduce((acc, slot) => acc + (slot.count || 0), 0), [slots]);

  const isCrossDay = useMemo(() => {
    if (!startTime || !endTime) return false;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    return startTotal > endTotal;
  }, [startTime, endTime]);

  const addSlot = () => setSlots([...slots, { id: Date.now(), role: '', count: 1 }]);
  const removeSlot = (id: number) => setSlots(slots.filter(s => s.id !== id));
  const updateSlotCount = (id: number, count: number) => {
    setSlots(slots.map(s => s.id === id ? { ...s, count } : s));
  };


  return (
    <div className="flex flex-col h-full w-full bg-gray-50 min-h-0">
      <div className="border-b border-gray-200 bg-white p-4 shrink-0 flex items-center justify-between">
        <div>
           <h1 className="text-xl font-bold text-gray-900">Quản lý Lịch làm việc & Ca mẫu</h1>
           <p className="text-sm text-gray-500 mt-1">Dành cho Quản lý / Giám sát bộ phận</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-gray-200 text-gray-700">Xuất Excel</Button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 bg-white border border-gray-200 w-auto inline-flex h-10">
              <TabsTrigger value="schedule" className="px-6 flex-1">Xếp lịch (Sup)</TabsTrigger>
              <TabsTrigger value="bidding" className="px-6 flex-1">Duyệt đăng ký</TabsTrigger>
              <TabsTrigger value="employee" className="px-6 flex-1 font-semibold text-blue-600">📱 Mô phỏng App NV</TabsTrigger>
              <TabsTrigger value="templates" className="px-6 flex-1">Templates (Ca mẫu)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="mt-0 flex-1 flex flex-col h-[calc(100vh-210px)]">
                {/* Unified Context Header */}
                <div className="bg-white border flex flex-col border-gray-200 rounded-lg mb-4 shrink-0 shadow-sm overflow-hidden">
                    {/* Top row: Store, Date, and Week Status Stepper */}
                    <div className="bg-slate-50 border-b border-gray-100 p-2.5 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Select defaultValue="store1">
                                <SelectTrigger className="w-48 h-8 font-semibold bg-white border-gray-200 text-sm">
                                    <SelectValue placeholder="Chọn cửa hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="store1">Cửa hàng Quận 1</SelectItem>
                                    <SelectItem value="store2">Cửa hàng Quận 3</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <div className="h-5 w-px bg-gray-300"></div>
                            
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm" onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} disabled={weekOffset === 0}>
                                    <ChevronLeft size={16} />
                                </Button>
                                <Button variant="outline" className="h-8 bg-white border-gray-200 text-gray-700 min-w-[200px] justify-center text-sm shadow-sm gap-2">
                                    <CalendarIcon size={14} className="text-blue-500" /> 
                                    {viewMode === 'day' 
                                        ? '07/05/2026' 
                                        : (weekOffset === 0 ? 'Tuần 18 (04/05 - 10/05)' : `Tuần ${18 + weekOffset} (${(11 + (weekOffset-1)*7).toString().padStart(2, '0')}/05 - ${(17 + (weekOffset-1)*7).toString().padStart(2, '0')}/05)`)}
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm" onClick={() => setWeekOffset(prev => prev + 1)}>
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Status Stepper */}
                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className={
                               weekStatus === 'DRAFT' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                               weekStatus === 'PUBLISHED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                               weekStatus === 'REVIEWING' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                               'bg-green-50 text-green-600 border-green-200'
                           }>
                               {weekStatus === 'DRAFT' && '1. Khởi tạo'}
                               {weekStatus === 'PUBLISHED' && '2. Mở đăng ký'}
                               {weekStatus === 'REVIEWING' && '3. Đang duyệt'}
                               {weekStatus === 'APPROVED' && '4. Đã chốt'}
                           </Badge>
                           <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
                                {([
                                    { id: 'DRAFT', label: 'Tạo ca' },
                                    { id: 'PUBLISHED', label: 'Đăng tuyển' },
                                    { id: 'REVIEWING', label: 'Xếp lịch' },
                                    { id: 'APPROVED', label: 'Công bố' },
                                ]).map((s, i, arr) => (
                                    <React.Fragment key={s.id}>
                                        <span className={weekStatus === s.id ? 'text-gray-900 font-bold' : ''}>
                                            {s.label}
                                        </span>
                                        {i < arr.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom row: View Mode and Actions */}
                    <div className="p-3 px-4 flex justify-between items-center">
                        <div className="flex items-center bg-gray-100/80 rounded-lg p-1 border border-gray-200/60 w-fit">
                            <button 
                                onClick={() => setViewMode('week')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition duration-200 ${viewMode === 'week' ? 'bg-white shadow relative text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-gray-500 hover:text-gray-900'} flex items-center gap-2`}
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={viewMode === 'week' ? "text-blue-500" : "text-gray-400"}><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                Dạng lưới (Lịch tuần)
                            </button>
                            <button 
                                onClick={() => setViewMode('day')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition duration-200 ${viewMode === 'day' ? 'bg-white shadow relative text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-gray-500 hover:text-gray-900'} flex items-center gap-2`}
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={viewMode === 'day' ? "text-blue-500" : "text-gray-400"}><path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H13.5C14.3284 2 15 2.67157 15 3.5V13.5C15 14.3284 14.3284 15 13.5 15H1.5C0.671573 15 0 14.3284 0 13.5V3.5C0 2.67157 0.671573 2 1.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM14 6H1V13.5C1 13.7761 1.22386 14 1.5 14H13.5C13.7761 14 14 13.7761 14 13.5V6ZM1 5V3.5C1 3.22386 1.22386 3 1.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H13.5C13.7761 3 14 3.22386 14 3.5V5H1Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                Dạng cột dọc (Ngày)
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Workflow Actions */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-1 mr-2 shadow-sm">
                                {weekStatus === 'DRAFT' && (
                                    <Button className="bg-blue-600 hover:bg-blue-700 h-8 text-xs font-semibold px-4" onClick={() => setWeekStatus('PUBLISHED')}>
                                        Cho phép NV đăng ký
                                    </Button>
                                )}
                                {weekStatus === 'PUBLISHED' && (
                                    <Button className="bg-orange-500 hover:bg-orange-600 text-white h-8 text-xs font-semibold px-4 shadow-orange-200 shadow-sm" onClick={() => setWeekStatus('REVIEWING')}>
                                        Đóng đăng ký ca
                                    </Button>
                                )}
                                {weekStatus === 'REVIEWING' && (
                                    <Button className="bg-green-600 hover:bg-green-700 h-8 text-white px-4 text-xs font-semibold shadow-green-200 shadow-sm flex items-center gap-1.5" onClick={handlePublishSchedule}>
                                        <CheckCircle size={14} /> Chốt lịch (Publish)
                                    </Button>
                                )}
                                {weekStatus === 'APPROVED' && (
                                    <Button variant="outline" className="border-gray-200 text-gray-700 h-8 text-xs font-semibold px-4 bg-white" onClick={() => setWeekStatus('REVIEWING')}>
                                        <Edit2 size={14} className="mr-1.5" /> Chỉnh sửa lại
                                    </Button>
                                )}
                            </div>

                            {/* Editing Actions */}
                            {weekStatus !== 'APPROVED' && (
                                <>
                                    <Button variant="outline" className="h-8 bg-white border-blue-200 text-blue-700 text-xs hover:bg-blue-50 font-medium" onClick={() => setOpenAddShiftToSchedule(true)}>
                                        <Plus size={14} className="mr-1" /> Thêm ca
                                    </Button>
                                    <Button variant="outline" className="h-8 bg-white border-gray-200 text-gray-700 text-xs hover:bg-gray-50 font-medium" onClick={handleCopyLastWeek}>
                                        <Copy size={14} className="mr-1" /> Copy tuần trước
                                    </Button>
                                    <Button className="h-8 bg-gray-800 hover:bg-gray-900 border-none text-white text-xs font-medium" onClick={() => {}} disabled={weekStatus === 'APPROVED'}>
                                        <CalendarIcon size={14} className="mr-1.5"/> Auto-Fill
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard / Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-4 shrink-0">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tổng giờ công (Dự kiến)</p>
                            <p className="text-lg font-bold text-gray-900">
                                {currentMatrixShifts.length > 0 ? MOCK_EMPLOYEES.reduce((acc, emp) => acc + getEmployeeHours(emp.id), 0) : 0}h
                                <span className="text-xs font-normal text-gray-400"> / 400h trần</span>
                            </p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Clock size={18} /></div>
                    </div>
                    <div className={`bg-white border rounded-lg p-3 shadow-sm flex items-center justify-between ${currentMatrixShifts.length > 0 && getOpenShiftsCount() > 0 ? 'border-red-200' : 'border-gray-200'}`}>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Ca thiếu người (Open Shifts)</p>
                            <p className={`text-lg font-bold ${currentMatrixShifts.length > 0 && getOpenShiftsCount() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {currentMatrixShifts.length > 0 ? getOpenShiftsCount() : 0} ca {currentMatrixShifts.length > 0 && getOpenShiftsCount() > 0 ? <span className="text-xs font-normal text-red-400">cần xử lý</span> : <span className="text-xs font-normal text-green-500">đã phủ kín</span>}
                            </p>
                        </div>
                        <div className={`p-2 rounded-full ${currentMatrixShifts.length > 0 && getOpenShiftsCount() > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}><AlertCircle size={18} /></div>
                    </div>
                    <div className={`bg-white border rounded-lg p-3 shadow-sm flex items-center justify-between ${currentMatrixShifts.length > 0 && getViolationsCount() > 0 ? 'border-orange-200' : 'border-gray-200'}`}>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Cảnh báo vi phạm (Luật)</p>
                            <p className={`text-lg font-bold ${currentMatrixShifts.length > 0 && getViolationsCount() > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {currentMatrixShifts.length > 0 ? getViolationsCount() : 0} NV {currentMatrixShifts.length > 0 && getViolationsCount() > 0 ? <span className="text-xs font-normal text-orange-400">vượt 48h/tuần</span> : <span className="text-xs font-normal text-green-500">hợp lệ</span>}
                            </p>
                        </div>
                        <div className={`p-2 rounded-full ${currentMatrixShifts.length > 0 && getViolationsCount() > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}><AlertCircle size={18} /></div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Chi phí nhân sự (Ước tính)</p>
                            <p className="text-lg font-bold text-gray-900">~{currentMatrixShifts.length > 0 ? ((MOCK_EMPLOYEES.reduce((acc, emp) => acc + getEmployeeHours(emp.id), 0) * 25000) / 1000000).toFixed(1) : 0}M <span className="text-xs font-normal text-gray-400">VND</span></p>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-full"><Users size={18} /></div>
                    </div>
                </div>

                {viewMode === 'week' ? (
                <div className="min-w-[1200px] border border-gray-200 rounded text-sm bg-white shadow-sm flex flex-col relative w-full flex-1 overflow-auto">
                    {/* NEW SHIFT MATRIX */}
                    {/* Header */}
                    <div className="grid grid-cols-[240px_repeat(7,minmax(0,1fr))] border-b border-gray-200 sticky top-0 z-20 font-medium text-gray-600 bg-gray-100 h-12 min-w-full">
                        <div className="p-3 border-r border-gray-200 sticky left-0 z-30 bg-gray-100 font-bold text-gray-800 flex items-center min-w-0">
                            Ca làm việc
                        </div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 min-w-0">Thứ 2 <span className="font-bold text-gray-800">04</span></div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 min-w-0">Thứ 3 <span className="font-bold text-gray-800">05</span></div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 min-w-0">Thứ 4 <span className="font-bold text-gray-800">06</span></div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 text-blue-600 border-b-2 border-b-blue-600 bg-blue-50/50 min-w-0">Thứ 5 <span className="font-bold">07</span></div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 min-w-0">Thứ 6 <span className="font-bold text-gray-800">08</span></div>
                        <div className="p-3 border-r border-gray-200 text-center flex items-center justify-center gap-1 min-w-0">Thứ 7 <span className="font-bold text-gray-800">09</span></div>
                        <div className="p-3 text-center flex items-center justify-center gap-1 min-w-0">CN <span className="font-bold text-gray-800">10</span></div>
                    </div>

                    {/* Matrix Data */}
                    <div className="flex flex-col flex-1 min-h-min pb-12 w-full bg-gray-50 relative">
                        {currentMatrixShifts.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-10 w-full" style={{ minHeight: '300px'}}>
                                <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
                                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có lịch cho {weekOffset === 0 ? 'Tuần 18' : `Tuần ${18 + weekOffset}`}</h3>
                                    <p className="text-gray-500 text-sm mb-6 max-w-sm">Bạn có thể xây dựng lịch từ đầu hoặc sao chép toàn bộ khung ca trực từ tuần trước để tiết kiệm thời gian.</p>
                                    <div className="flex gap-3 justify-center">
                                        <Button variant="outline" className="bg-white text-gray-700" onClick={() => setOpenAddShiftToSchedule(true)}>
                                            <Plus size={16} className="mr-2" /> Thêm ca mới
                                        </Button>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCopyLastWeek}>
                                            <Copy size={16} className="mr-2" /> Sao chép từ tuần trước
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentMatrixShifts.map(shift => (
                            <div key={shift.id} className="grid grid-cols-[240px_repeat(7,minmax(0,1fr))] border-b border-gray-200 min-h-[200px] min-w-full bg-white">
                                {/* Left Sticky Column (Shift Info + Quota) */}
                                <div className="p-4 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0 sticky left-0 z-10 shadow-[1px_0_4px_rgba(0,0,0,0.05)] text-sm min-w-0">
                                    <h3 className="font-bold text-gray-900 text-base">{shift.title}</h3>
                                    <div className="text-gray-500 text-sm flex items-center mt-1 mb-4 bg-white border border-gray-200 w-fit px-2.5 py-1 rounded-md shadow-sm">
                                        <Clock size={12} className="mr-1.5" /> <span className="font-medium">{shift.time}</span>
                                    </div>
                                    <div className="space-y-2 mt-auto">
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Định biên (Quota)</div>
                                        {shift.requirements.map(req => (
                                            <div key={req.tag} className="flex justify-between items-center text-sm bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                                                <span className="text-gray-700 font-semibold">{req.tag}</span>
                                                <div className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded font-bold">{req.min} ({req.min}-{req.max})</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Right columns (Days) */}
                                {['mon','tue','wed','thu','fri','sat','sun'].map((day, d_idx) => {
                                    const isActive = shift.activeDays.includes(day);

                                    return (
                                    <div key={day} className={`p-2 border-r border-gray-100 flex flex-col gap-2 min-w-0 ${d_idx === 3 ? 'bg-blue-50/10' : ''}`}>
                                        {isActive ? (
                                            shift.requirements.map(req => {
                                                const matrixKey = `${shift.id}_${day}_${req.tag}`;
                                                const cellState = matrixState[matrixKey];

                                                // Mock Assignments Logic
                                                let assigned: {name: string, isDraft: boolean}[] = [];
                                                if (shift.id === 'shift-1') {
                                                    if (req.tag === 'Thu ngân') assigned = (day === 'mon' || day === 'wed' || day === 'sat') ? [{name: 'Nhân viên 1', isDraft: false}] : [];
                                                    if (req.tag === 'Pha chế') assigned = [{name: 'Nhân viên 2', isDraft: false}, {name: 'Nhân viên 4', isDraft: false}];
                                                } else if (shift.id === 'shift-2') {
                                                    if (req.tag === 'Thu ngân') assigned = [{name: 'Nhân viên 3', isDraft: false}];
                                                    if (req.tag === 'Pha chế') assigned = (day === 'fri' || day === 'sat') ? [{name: 'Nhân viên 5', isDraft: false}] : [{name: 'Nhân viên 5', isDraft: false}, {name: 'NV Part-time 1', isDraft: false}];
                                                }

                                                if (cellState?.draftEmployeeName) {
                                                    assigned.push({name: cellState.draftEmployeeName + ' (Dự kiến)', isDraft: true});
                                                }

                                                const isMissing = assigned.length < req.min;
                                                const pendingBids = cellState?.bids?.filter(b => b.status === 'pending') || [];
                                                
                                                // Business rules based on weekStatus
                                                const showBids = (weekStatus === 'PUBLISHED' || weekStatus === 'REVIEWING') && pendingBids.length > 0;
                                                const canApproveBids = weekStatus === 'REVIEWING';
                                                const canEditSchedule = weekStatus !== 'APPROVED';

                                                return (
                                                    <div key={req.tag} className={`rounded-md p-2.5 border ${isMissing && !showBids ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-gray-200'}`}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isMissing && !showBids ? 'text-orange-700' : 'text-gray-500'}`}>{req.tag}</span>
                                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isMissing && !showBids ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{assigned.length}/{req.min}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            {assigned.map((emp, i) => (
                                                                <div key={i} className={`text-xs border rounded shadow-sm px-2.5 py-1.5 flex justify-between items-center group cursor-pointer ${emp.isDraft ? 'bg-green-50 border-green-300 text-green-900 group-hover:border-green-400' : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 hover:shadow transition-all'}`}>
                                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${emp.isDraft ? 'bg-white text-green-700 border border-green-200' : 'bg-blue-100 text-blue-600'}`}>
                                                                            {emp.name.split(' ').filter(n => n !== '(Dự').pop()?.substring(0,2).toUpperCase()}
                                                                        </div>
                                                                        <span className="truncate font-medium">{emp.name}</span>
                                                                    </div>
                                                                    {emp.isDraft && canEditSchedule && (
                                                                        <button onClick={() => handleResetMatrixDraft(matrixKey)} className="text-gray-400 hover:text-red-600 cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={14} /></button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            
                                                            {showBids && (
                                                                <div className="flex flex-col gap-1.5 mt-0.5">
                                                                    {pendingBids.map(bid => (
                                                                        <div key={bid.id} className="text-xs bg-orange-50 border border-orange-300 rounded shadow-sm px-2 py-1.5 flex flex-col gap-1 w-full h-full relative cursor-default">
                                                                            <div className="text-[11px] font-bold text-orange-900 truncate mb-0.5" title={bid.employeeName}>{bid.employeeName}</div>
                                                                            {canApproveBids ? (
                                                                                <div className="flex gap-1 justify-end">
                                                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 rounded-sm" onClick={() => handleApproveMatrixBid(matrixKey, bid.id)} title="Đồng ý">
                                                                                        <Check size={14} />
                                                                                    </Button>
                                                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-sm" onClick={() => handleRejectMatrixBid(matrixKey, bid.id)} title="Từ chối">
                                                                                        <X size={14} />
                                                                                    </Button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-[10px] text-orange-700 font-medium italic mt-0.5 text-right">Đang chờ duyệt...</div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {!showBids && isMissing && canEditSchedule && (
                                                                    Array.from({ length: req.min - assigned.length }).map((_, idx) => (
                                                                        <Popover key={`empty-${idx}`}>
                                                                            <PopoverTrigger className="text-xs border border-dashed border-gray-300 rounded px-2.5 py-1.5 flex items-center group cursor-pointer bg-gray-50/50 text-gray-500 hover:border-gray-400 hover:bg-gray-100 transition-all mt-0.5">
                                                                                <div className="flex items-center gap-1.5 overflow-hidden w-full">
                                                                                    <div className="w-5 h-5 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-white text-gray-400 border-opacity-50 shrink-0">
                                                                                        <Plus size={10} />
                                                                                    </div>
                                                                                    <span className="truncate font-medium text-gray-600">Chỉ định nhân viên</span>
                                                                                </div>
                                                                            </PopoverTrigger>
                                                                            <AssignEmployeePopoverContent 
                                                                                role={req.tag} 
                                                                                matrixKey={matrixKey} 
                                                                                onAssign={handleAssignMatrixSlot} 
                                                                                onRequestSupport={handleRequestSupport} 
                                                                            />
                                                                        </Popover>
                                                                    ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-[11px] font-medium bg-gray-50/50 rounded border border-dashed border-gray-200 p-2 text-center mt-2 group hover:bg-gray-100 transition-colors cursor-pointer">
                                                <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100">
                                                    <Plus size={14} />
                                                    <span>Mở ca</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    )
                                })}
                            </div>
                        ))}

                        {/* Add Shift Button */}
                        {weekStatus !== 'APPROVED' && (
                            <div className="p-4 border-b border-gray-200 min-w-full bg-gray-50 flex justify-center mt-4">
                                <Button variant="outline" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-dashed border-2 border-gray-300 text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-300 w-full max-w-sm h-12 rounded-lg bg-gray-50/50" onClick={() => setOpenAddShiftToSchedule(true)}>
                                    <Plus size={16} className="mr-2" /> Thêm ca
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                ) : (
                <div className="border border-gray-200 rounded bg-white shadow-sm flex flex-col relative w-full flex-1 overflow-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-gray-900">
                                {weekOffset === 0 ? 'Timeline: Thứ 5, 07/05' : `Timeline: Thứ 5, ${(14 + (weekOffset-1)*7).toString().padStart(2, '0')}/05`}
                            </h3>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-white">Hôm qua</Badge>
                                <Badge className="bg-blue-600">Thứ 5</Badge>
                                <Badge variant="outline" className="bg-white">Ngày mai</Badge>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span> Đã xếp ca
                            <span className="w-3 h-3 bg-red-400 rounded-full inline-block ml-4 mr-2"></span> Thiếu người (Open Shift)
                        </div>
                    </div>
                    {/* Timeline Container */}
                    <div className="flex-1 w-full min-w-[1000px] relative overflow-x-auto">
                        <div className="grid grid-cols-[180px_1fr] h-full min-h-[400px]">
                            {/* Y-Axis: Tags/Employees */}
                            <div className="border-r border-gray-200 bg-white sticky left-0 z-10 flex flex-col pt-10">
                                {timelineRoles.map(role => (
                                    <div key={role.id} className={`border-b border-gray-100 px-4 flex-col justify-center flex ${role.color === 'orange' ? 'bg-orange-50/30' : ''}`} style={{ height: `${(role.rowCount || 1) * 80}px` }}>
                                        <div className={`font-bold ${role.color === 'orange' ? 'text-orange-800' : 'text-gray-800'}`}>{role.name}</div>
                                        <div className={`text-xs ${role.color === 'orange' ? 'text-orange-600' : 'text-gray-500'}`}>Định mức: {role.limit}</div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* X-Axis: Time */}
                            <div className="relative border-b border-gray-200 flex flex-col">
                                {/* Time header row */}
                                <div className="h-10 border-b border-gray-200 flex absolute top-0 w-full z-0 bg-gray-50">
                                    {Array.from({length: 17}).map((_, i) => (
                                        <div key={i} className="flex-1 flex justify-center text-[10px] font-bold text-gray-400 pt-2 border-r border-gray-100 last:border-none">
                                            {i + 6}:00
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Vertical Grid Lines */}
                                <div className="absolute top-10 bottom-0 left-0 w-full flex opacity-50 pointer-events-none">
                                    {Array.from({length: 17}).map((_, i) => (
                                        <div key={i} className="flex-1 border-r border-dashed border-gray-200 last:border-none"></div>
                                    ))}
                                </div>

                                {/* Timeline Matrix Content */}
                                <div className="pt-10 w-full flex flex-col relative z-0">
                                    {timelineRoles.map(role => {
                                        const roleShifts = timelineShifts.filter(s => s.roleId === role.id);
                                        return (
                                            <div key={role.id} className={`border-b border-gray-100 relative group pt-3 ${role.color === 'orange' ? 'bg-orange-50/10' : ''}`} style={{ height: `${(role.rowCount || 1) * 80}px` }}>
                                                {roleShifts.map(shift => {
                                                    const getTimelineStyle = (start: string, end: string) => {
                                                        const parseTime = (t: string) => parseInt(t.split(':')[0]) + parseInt(t.split(':')[1])/60;
                                                        let MathBound = (val: number) => Math.max(0, Math.min(17, val - 6));
                                                        let startHour = parseTime(start);
                                                        let endHour = parseTime(end);
                                                        if (endHour <= startHour) endHour += 24; 
                                                        
                                                        const left = MathBound(startHour) / 17 * 100;
                                                        const width = (MathBound(endHour) - MathBound(startHour)) / 17 * 100;
                                                        return { left: `${left}%`, width: `${width}%` };
                                                    };
                                                    
                                                    const [start, end] = shift.time.split(' - ');
                                                    const style = start && end ? getTimelineStyle(start, end) : { left: '0', width: '10%' };
                                                    const top = (shift.rowIdx || 0) * 80 + 12;

                                                    if (shift.type === 'open') {
                                                        const pendingBids = shift.bids?.filter(b => b.status === 'pending') || [];
                                                        const showBids = (weekStatus === 'PUBLISHED' || weekStatus === 'REVIEWING') && pendingBids.length > 0;
                                                        const canApproveBids = weekStatus === 'REVIEWING';
                                                        
                                                        let content = (
                                                            <>
                                                                <div className="text-xs font-bold text-red-600 flex items-center shrink-0">
                                                                    <AlertCircle size={14} className="mr-1 shrink-0"/> {shift.title}
                                                                </div>
                                                                {weekStatus !== 'APPROVED' && (
                                                                    <div className="absolute inset-0 bg-red-600 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition">Đăng tuyển ca này</div>
                                                                )}
                                                            </>
                                                        );

                                                        if (shift.draftEmployeeId) {
                                                            content = (
                                                                <div className="flex items-center w-full px-1">
                                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mr-2 shrink-0 bg-white text-green-700 border border-green-200">
                                                                        {shift.draftEmployeeName?.split(' ').pop()?.charAt(0)}
                                                                    </div>
                                                                    <div className="flex flex-col flex-1 min-w-0">
                                                                        <div className="text-xs font-bold truncate text-green-900">{shift.draftEmployeeName} (Dự kiến)</div>
                                                                        <div className="text-[10px] truncate text-green-700">Chờ công bố lịch</div>
                                                                    </div>
                                                                </div>
                                                            );
                                                            return (
                                                                <div key={shift.id} className="absolute h-14 bg-green-50 border border-green-300 rounded-lg shadow-sm flex items-center px-2 cursor-pointer transition hover:shadow-md" style={{ ...style, top: `${top}px` }}>
                                                                    {content}
                                                                </div>
                                                            );
                                                        }

                                                        if (showBids) {
                                                            return (
                                                                <div key={shift.id} className="absolute bg-orange-50 border border-orange-300 rounded-lg flex items-center p-1 shadow-sm overflow-hidden auto-rows-max" style={{ ...style, top: `${top}px`, height: '56px', display: 'grid', gridTemplateColumns: `repeat(${pendingBids.length}, minmax(100px, 1fr))`, gap: '4px' }}>
                                                                    {pendingBids.map(bid => (
                                                                        <div key={bid.id} className={`flex items-center ${canApproveBids ? 'justify-between' : 'justify-center'} bg-white/70 border border-orange-200 rounded p-1 w-full h-full`}>
                                                                            <span className={`text-[10px] font-bold text-orange-900 truncate mx-1 ${!canApproveBids ? 'text-center w-full' : ''}`} title={bid.employeeName}>
                                                                                {bid.employeeName}
                                                                                {!canApproveBids && <span className="block font-normal text-[9px] text-orange-600 mt-0.5">Chờ duyệt</span>}
                                                                            </span>
                                                                            {canApproveBids && (
                                                                                <div className="flex gap-0.5 shrink-0 items-center justify-center">
                                                                                    <Button size="icon" variant="ghost" className="h-5 w-5 text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 rounded-sm" onClick={() => handleApproveBid(shift.id, bid.id)} title="Đồng ý">
                                                                                        <Check size={12} />
                                                                                    </Button>
                                                                                    <Button size="icon" variant="ghost" className="h-5 w-5 text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-sm" onClick={() => handleRejectBid(shift.id, bid.id)} title="Từ chối">
                                                                                        <X size={12} />
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div key={shift.id} className="absolute h-14 bg-red-50 border-2 border-dashed border-red-300 rounded-lg flex items-center px-3 cursor-pointer hover:bg-red-100 transition justify-center group overflow-hidden" style={{ ...style, top: `${top}px` }}>
                                                                {content}
                                                            </div>
                                                        );
                                                    }

                                                    const isPurple = shift.color === 'purple';
                                                    const isOrange = role.color === 'orange';
                                                    let bgClass = 'bg-blue-100', borderClass = 'border-blue-300', textClass = 'text-blue-900', subTextClass = 'text-blue-700', hoverClass = 'hover:bg-blue-200';
                                                    let dotBgClass = 'bg-white', dotTextClass = 'text-blue-700';

                                                    if (isPurple) {
                                                        bgClass = 'bg-purple-100'; borderClass = 'border-purple-300'; textClass = 'text-purple-900'; subTextClass = 'text-purple-700'; hoverClass = 'hover:bg-purple-200'; dotTextClass = 'text-purple-700';
                                                    } else if (isOrange) {
                                                        bgClass = 'bg-orange-100'; borderClass = 'border-orange-300'; textClass = 'text-orange-900'; subTextClass = 'text-orange-700'; hoverClass = 'hover:bg-orange-200'; dotTextClass = 'text-orange-700';
                                                    }
                                                    
                                                    return (
                                                        <div key={shift.id} className={`absolute h-14 border rounded-lg shadow-sm flex items-center px-3 cursor-pointer transition ${bgClass} ${borderClass} ${hoverClass} hover:shadow-md`} style={{ ...style, top: `${top}px` }}>
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mr-2 shrink-0 ${dotBgClass} ${dotTextClass}`}>{shift.short}</div>
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <div className={`text-xs font-bold truncate ${textClass}`}>{shift.title || shift.employeeName}</div>
                                                                <div className={`text-[10px] truncate ${subTextClass}`}>{shift.time}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Heatmap/Coverage Summary at bottom */}
                                    <div className="h-16 flex items-end ml-0 mr-0 mt-4 px-2 space-x-1 opacity-80">
                                        <div className="w-[11.7%] h-2 bg-gray-200 rounded-t" title="06:00 - 08:00"></div>
                                        <div className="w-[17.7%] h-12 bg-green-400 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="08:00 - 11:00 (3 NV)">3</div>
                                        <div className="w-[17.6%] h-16 bg-blue-500 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="11:00 - 14:00 (4 NV - Giờ cao điểm)">4</div>
                                        <div className="w-[11.8%] h-12 bg-green-400 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="14:00 - 16:00 (3 NV)">3</div>
                                        <div className="w-[11.7%] h-8 bg-orange-400 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="16:00 - 18:00 (2 NV)">2</div>
                                        <div className="w-[23.5%] h-12 bg-green-400 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="18:00 - 22:00 (3 NV - Thiếu 1)">3</div>
                                        <div className="w-[6%] h-8 bg-orange-400 rounded-t flex items-end justify-center pb-1 text-white text-[10px] font-bold" title="22:00 - 23:00 (2 NV)">2</div>
                                    </div>
                                    <div className="text-center text-xs text-gray-400 mb-2 mt-1">Biểu đồ độ phủ nhân sự thực tế (Heatmap)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </TabsContent>

            {/* Bidding (Duyệt đăng ký) */}
            <TabsContent value="bidding" className="mt-0 flex-1 flex flex-col h-[calc(100vh-220px)] overflow-auto">
               <div className="bg-white border rounded-lg shadow-sm">
                   <Table>
                       <TableHeader>
                           <TableRow className="bg-gray-50/50">
                               <TableHead>Ca cần người (Open Shift)</TableHead>
                               <TableHead>Thời gian</TableHead>
                               <TableHead>Vị trí</TableHead>
                               <TableHead>Nhân sự ứng tuyển</TableHead>
                               <TableHead>Hạn mức</TableHead>
                               <TableHead className="text-right">Thao tác</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                           <TableRow>
                               <TableCell className="font-medium text-blue-700">Ca Sáng (04/05) <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-200 h-5">Gấp</Badge></TableCell>
                               <TableCell><div className="flex items-center text-sm"><Clock size={14} className="mr-1 text-gray-400"/> 08:00 - 16:00</div></TableCell>
                               <TableCell>Pha chế</TableCell>
                               <TableCell>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 z-10" title="Nhân viên 1">NV1</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs font-bold text-green-600 z-0" title="Nhân viên 3">NV3</div>
                                    </div>
                               </TableCell>
                               <TableCell>Cần 1 người</TableCell>
                               <TableCell className="text-right">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Xem & Duyệt</Button>
                               </TableCell>
                           </TableRow>
                           <TableRow>
                               <TableCell className="font-medium text-gray-900">Ca Tối (07/05)</TableCell>
                               <TableCell><div className="flex items-center text-sm"><Clock size={14} className="mr-1 text-gray-400"/> 16:00 - 23:00</div></TableCell>
                               <TableCell>Thu ngân</TableCell>
                               <TableCell>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">NV2</div>
                                    </div>
                               </TableCell>
                               <TableCell>Cần 1 người</TableCell>
                               <TableCell className="text-right">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Xem & Duyệt</Button>
                               </TableCell>
                           </TableRow>
                       </TableBody>
                   </Table>
               </div>
            </TabsContent>

            {/* Employee App View */}
            <TabsContent value="employee" className="mt-0 flex-1 flex flex-col items-center justify-center bg-gray-100 overflow-hidden relative rounded-xl border border-gray-300 h-[calc(100vh-220px)]">
                <div className="w-[375px] h-[750px] max-h-full bg-white border-[8px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative my-4 shrink-0">
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                        <div className="w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
                    </div>
                    {/* Header */}
                    <div className="bg-blue-600 text-white pt-10 pb-4 px-5 shrink-0 shadow-md">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Đăng ký ca làm</h2>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <User size={16} />
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm mt-1">Tuần 18 (04/05 - 10/05)</p>
                        
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar space-x-1">
                             <div className="flex flex-col items-center min-w-[48px] p-2 bg-white rounded-xl text-blue-600 shadow-sm cursor-pointer transition-transform hover:scale-105">
                                <span className="text-[10px] uppercase font-bold tracking-wider mb-0.5">T2</span>
                                <span className="font-bold text-lg leading-tight">04</span>
                             </div>
                             <div className="flex flex-col items-center min-w-[48px] p-2 hover:bg-white/10 rounded-xl text-blue-50 cursor-pointer transition-colors">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">T3</span>
                                <span className="font-bold text-lg leading-tight">05</span>
                             </div>
                             <div className="flex flex-col items-center min-w-[48px] p-2 hover:bg-white/10 rounded-xl text-blue-50 cursor-pointer transition-colors">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">T4</span>
                                <span className="font-bold text-lg leading-tight">06</span>
                             </div>
                             <div className="flex flex-col items-center min-w-[48px] p-2 hover:bg-white/10 rounded-xl text-blue-50 cursor-pointer transition-colors">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">T5</span>
                                <span className="font-bold text-lg leading-tight">07</span>
                                <div className="w-1 h-1 bg-red-400 rounded-full mt-1"></div>
                             </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 p-5 space-y-4 overflow-y-auto pb-12">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 text-[15px]">Ca trống đang tuyển (2)</h3>
                            <button className="text-xs text-blue-600 font-semibold bg-blue-100/50 px-2 py-1 rounded flex items-center"><Filter size={12} className="mr-1" /> Lọc</button>
                        </div>
                        
                        {/* Open Shift 1 */}
                        <div className="bg-white p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-orange-100 relative overflow-hidden group hover:border-orange-200 transition-colors">
                             <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50/50 rounded-bl-full -z-0"></div>
                             <div className="flex justify-between items-start mb-3 relative z-10">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-[16px]">Ca Sáng</h4>
                                    <div className="text-orange-600 text-[13px] font-semibold mt-0.5 flex items-center">
                                       Thu ngân (Cần 1)
                                    </div>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700 font-bold border-none shadow-none text-[10px] uppercase tracking-wide">Tăng ca</Badge>
                             </div>
                             <div className="flex items-center text-[13px] text-gray-600 mb-4 bg-orange-50/40 border border-orange-100/50 p-2.5 rounded-xl relative z-10">
                                <Clock size={16} className="mr-2 text-orange-400" />
                                <span className="font-semibold text-gray-800">08:00 - 16:00</span>
                                <span className="text-gray-300 mx-2">•</span>
                                <span className="font-medium text-gray-500">8h làm việc</span>
                             </div>
                             <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_2px_8px_rgba(37,99,235,0.2)] font-bold h-11 relative z-10">Đăng ký nhận ca</Button>
                        </div>

                         {/* Open Shift 2 */}
                        <div className="bg-white p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 relative overflow-hidden">
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-[16px]">Ca Tối</h4>
                                    <div className="text-gray-500 text-[13px] font-medium mt-0.5">Pha chế (Cần 1)</div>
                                </div>
                             </div>
                             <div className="flex items-center text-[13px] text-gray-600 mb-4 bg-gray-50 border border-gray-100/80 p-2.5 rounded-xl">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                <span className="font-semibold text-gray-800">16:00 - 23:00</span>
                                <span className="text-gray-300 mx-2">•</span>
                                <span className="font-medium text-gray-500">7h làm việc</span>
                             </div>
                             <Button variant="outline" className="w-full border-blue-200 bg-blue-50/50 text-blue-600 font-bold h-11 opacity-80 cursor-not-allowed rounded-xl shadow-none">Đang chờ duyệt...</Button>
                        </div>

                         <div className="bg-green-50 p-4 rounded-2xl shadow-sm border border-green-100 mt-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-40"></div>
                             <div className="flex items-center gap-2 text-green-700 mb-1.5 relative z-10">
                                 <CheckCircle size={18} className="text-green-600" />
                                 <span className="font-bold">Ca của bạn (Thứ 2)</span>
                             </div>
                             <p className="text-[13px] text-green-800 opacity-80 leading-relaxed relative z-10 w-[90%]">Bạn chưa có lịch phân bổ trong ngày này. Hãy đăng ký nhận thêm ca trống nhé!</p>
                         </div>
                    </div>
                    {/* Bottom Nav Bar */}
                    <div className="h-[68px] bg-white border-t border-gray-100 flex justify-around items-center shrink-0 px-2 pb-5 pt-2">
                        <div className="flex flex-col items-center justify-center w-16 h-full text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            <CalendarIcon size={22} className="mb-1 transition-transform hover:scale-110" />
                            <span className="text-[10px] font-medium">Lịch của tôi</span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-16 h-full text-blue-600 cursor-pointer">
                            <div className="relative">
                               <CheckCircle size={22} className="mb-1" />
                               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="text-[10px] font-bold">Đăng ký ca</span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-16 h-full text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            <User size={22} className="mb-1 transition-transform hover:scale-110" />
                            <span className="text-[10px] font-medium">Cá nhân</span>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-0 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-72">
                                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                <Input placeholder="Tìm kiếm ca mẫu..." className="pl-9 bg-white" />
                            </div>
                            <Button variant="outline" className="bg-white border-gray-200"><Filter size={16} className="mr-2 text-gray-500" /> Lọc</Button>
                        </div>
                        <Dialog open={openCreateShift} onOpenChange={setOpenCreateShift}>
                          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-blue-600 text-white shadow-sm hover:bg-blue-700 h-9 px-4 py-2">
                            <Plus size={16} className="mr-2"/> Tạo Ca mẫu mới
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                 <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Plus size={18} />
                                 </div>
                                 Thiết kế Ca mẫu mới
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-700">Tên ca mẫu <span className="text-red-500">*</span></label>
                                  <Input placeholder="VD: Ca Sáng Tiêu chuẩn..." defaultValue="Ca Sáng" />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-700">Tổng định biên tối đa (Tự tính)</label>
                                  <div className="relative">
                                    <Input value={totalMax} readOnly className="bg-gray-50 border-gray-200 font-bold text-blue-600 cursor-not-allowed pr-10" />
                                    <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  </div>
                                </div>
                              </div>

                              <div className="p-5 border border-blue-100 rounded-lg bg-blue-50/20 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                   <h4 className="font-bold text-blue-900 text-sm">Cơ cấu nhân sự (Định biên)</h4>
                                   <Button variant="outline" size="sm" onClick={addSlot} className="h-8 text-blue-600 border-blue-200 bg-white hover:bg-blue-50 transition-all font-medium">
                                      <Plus size={14} className="mr-1.5" /> Thêm vị trí / Tag
                                   </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                   {slots.map(slot => (
                                     <div key={slot.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 bg-white p-2.5 border border-gray-200 rounded-md shadow-sm transition-all hover:border-gray-300">
                                        <Select defaultValue={slot.role || 'Thu ngân'}>
                                          <SelectTrigger className="h-9 border-gray-200"><SelectValue placeholder="Chọn vai trò/tag" /></SelectTrigger>
                                          <SelectContent>
                                             <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                                             <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                                             <SelectItem value="Tư vấn">Tư vấn/Chung</SelectItem>
                                             <SelectItem value="Kho">Kho</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                                          <span className="text-[13px] text-gray-500 whitespace-nowrap">Số lượng:</span>
                                          <Input 
                                            type="number" 
                                            className="w-20 h-9 text-center font-bold border-gray-200" 
                                            defaultValue={slot.count} 
                                            min={0} 
                                            onChange={(e) => updateSlotCount(slot.id, parseInt(e.target.value) || 0)}
                                          />
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-md" onClick={() => removeSlot(slot.id)}>
                                          <Trash2 size={16} />
                                        </Button>
                                     </div>
                                   ))}
                                   {slots.length === 0 && <span className="text-gray-500 italic text-sm text-center py-4">Chưa cấu hình định biên. Vui lòng thêm ít nhất 1 vị trí.</span>}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-700">Giờ làm việc</label>
                                  <div className="flex items-center gap-2">
                                     <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border-gray-300 h-10 shadow-sm" />
                                     <span className="text-gray-500">đến</span>
                                     <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border-gray-300 h-10 shadow-sm" />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium text-gray-500 opacity-70">Nghỉ giữa ca (Phút)</label>
                                  <Input type="number" defaultValue="30" className="border-gray-200 h-10 bg-white" />
                                </div>
                              </div>

                              {isCrossDay && (
                                <div className="flex flex-col gap-4 p-5 rounded-lg border border-orange-200 bg-orange-50/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                   <div className="flex items-center gap-2 text-orange-700">
                                       <AlertCircle size={18} />
                                       <h4 className="font-bold text-[15px]">Hệ thống cảnh báo: Ca này là Ca Vắt Đêm</h4>
                                   </div>
                                   <p className="text-sm text-orange-800 pl-6">
                                       Hạch toán công cho ca này sẽ được tự động áp dụng theo <span className="font-bold underline cursor-pointer">Thiết lập Quy tắc Xếp ca</span> do Admin quy định.
                                   </p>
                                </div>
                              )}
                            </div>
                            <DialogFooter className="mt-6 border-t border-gray-100 pt-6">
                               <Button variant="ghost" className="hover:bg-gray-200 text-gray-600 h-10 px-6" onClick={() => setOpenCreateShift(false)}>Hủy</Button>
                               <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-10 px-8 font-bold" onClick={() => setOpenCreateShift(false)}>Lưu Mẫu</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Template Card 1 */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 flex items-center">
                                    Ca Sáng Tiêu Chuẩn 
                                </h3>
                                <div className="text-sm text-gray-500 mt-2 space-y-1">
                                    <div className="flex items-center"><Clock size={14} className="mr-2 text-gray-400"/> 08:00 - 16:00 (8h)</div>
                                    <div className="flex items-center"><Users size={14} className="mr-2 text-gray-400"/> Định biên: 4 vị trí</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700"><MoreHorizontal size={18}/></Button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Cơ cấu nhân sự</h4>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Thu ngân</Badge></span>
                                    <span className="font-medium text-gray-900">1</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Pha chế</Badge></span>
                                    <span className="font-medium text-gray-900">1-2</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Phục vụ</Badge></span>
                                    <span className="font-medium text-gray-900">1-2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Template Card 2 */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 flex items-center">
                                    Ca Tối Cuối Tuần
                                </h3>
                                <div className="text-sm text-gray-500 mt-2 space-y-1">
                                    <div className="flex items-center"><Clock size={14} className="mr-2 text-gray-400"/> 16:00 - 23:00 (7h)</div>
                                    <div className="flex items-center"><Users size={14} className="mr-2 text-gray-400"/> Định biên: 6 vị trí</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700"><MoreHorizontal size={18}/></Button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Cơ cấu nhân sự</h4>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Quản lý ca</Badge></span>
                                    <span className="font-medium text-gray-900">1</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Bếp/Pha chế</Badge></span>
                                    <span className="font-medium text-gray-900">2-3</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 flex items-center gap-1.5"><Badge variant="outline" className="font-normal border-gray-300 text-xs px-1.5 py-0">Phục vụ</Badge></span>
                                    <span className="font-medium text-gray-900">3-4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>
        <Dialog open={openAddShiftToSchedule} onOpenChange={setOpenAddShiftToSchedule}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CalendarIcon size={16} />
                        </div>
                        Thêm ca
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Chọn từ ca mẫu <span className="text-red-500">*</span></label>
                        <Select value={selectedTemplateForMatrix} onValueChange={setSelectedTemplateForMatrix}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Chọn ca mẫu..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="template1">Ca Sáng Tiêu Chuẩn (08:00 - 16:00)</SelectItem>
                                <SelectItem value="template2">Ca Tối Cuối Tuần (16:00 - 23:00)</SelectItem>
                                <SelectItem value="template3">Ca Gãy Trưa (11:00 - 14:00)</SelectItem>
                                <SelectItem value="template4">Ca Gãy Chiều (17:00 - 21:00)</SelectItem>
                                <SelectItem value="custom">Ca mới (Tùy chỉnh định biên)...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedTemplateForMatrix === 'custom' && (
                        <div className="flex flex-col gap-4 p-4 border border-blue-100 rounded-lg bg-blue-50/20">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Tên ca tùy chỉnh</label>
                                <Input value={customShiftName} onChange={(e) => setCustomShiftName(e.target.value)} placeholder="VD: Ca Sáng" className="bg-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Giờ làm việc</label>
                                <div className="flex items-center gap-2">
                                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-white border-gray-300 h-10 shadow-sm" />
                                    <span className="text-gray-500">đến</span>
                                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-white border-gray-300 h-10 shadow-sm" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-blue-900 text-sm">Định biên (Số lượng nhân sự)</h4>
                                    <Button variant="outline" size="sm" onClick={addSlot} className="h-8 text-blue-600 bg-white border-blue-200 hover:bg-blue-50">
                                        <Plus size={14} className="mr-1.5" /> Thêm
                                    </Button>
                                </div>
                                {slots.map(slot => (
                                    <div key={slot.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 bg-white p-2 border border-gray-200 rounded-md">
                                        <Select defaultValue={slot.role || 'Thu ngân'} onValueChange={(val) => {
                                            setSlots(slots.map(s => s.id === slot.id ? { ...s, role: val } : s))
                                        }}>
                                            <SelectTrigger className="h-8 border-gray-200"><SelectValue placeholder="Vai trò" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                                                <SelectItem value="Pha chế">Pha chế</SelectItem>
                                                <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                                                <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input 
                                            type="number" 
                                            className="w-16 h-8 text-center" 
                                            defaultValue={slot.count} 
                                            min={1} 
                                            onChange={(e) => updateSlotCount(slot.id, parseInt(e.target.value) || 0)}
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeSlot(slot.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'week' && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Áp dụng cho ngày</label>
                            <Select value={selectedDaysForMatrix} onValueChange={setSelectedDaysForMatrix}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Chọn ngày..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Cả tuần (T2 - CN)</SelectItem>
                                    <SelectItem value="weekdays">Ngày thường (T2 - T6)</SelectItem>
                                    <SelectItem value="weekend">Cuối tuần (T7 - CN)</SelectItem>
                                    <SelectItem value="specific">Chỉ chọn ngày cụ thể...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter className="mt-4 border-t border-gray-100 pt-4">
                    <Button variant="ghost" onClick={() => setOpenAddShiftToSchedule(false)} className="px-6 h-10">Hủy</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-10 font-bold" onClick={viewMode === 'week' ? handleAddShiftToMatrix : handleAddShiftToTimeline}>Thêm vào lịch</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
