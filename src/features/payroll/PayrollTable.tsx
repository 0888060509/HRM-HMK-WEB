import React, { useState } from 'react';
import { Search, Filter, DownloadCloud, FileText, ChevronRight, Lock, Unlock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';

interface PayrollRecord {
  id: string;
  code: string;
  name: string;
  role: string;
  baseSalary: number; // Lương CB/Giờ
  totalHours: number;
  otHours: number;
  allowance: number; // Phụ cấp
  bonuses: number;
  deductions: number; // Phạt
  taxes: number; // Thuế/BH
  status: 'draft' | 'locked' | 'paid';
}

const mockPayroll: PayrollRecord[] = [
  { id: '1', code: 'NV001', name: 'Nguyễn Văn A', role: 'Quản lý', baseSalary: 35000, totalHours: 200, otHours: 20, allowance: 500000, bonuses: 1000000, deductions: 0, taxes: 500000, status: 'locked' },
  { id: '2', code: 'NV002', name: 'Trần Thị B', role: 'Thu ngân', baseSalary: 25000, totalHours: 180, otHours: 5, allowance: 200000, bonuses: 0, deductions: 50000, taxes: 200000, status: 'draft' },
  { id: '3', code: 'NV003', name: 'Lê Văn C', role: 'Phục vụ', baseSalary: 22000, totalHours: 195, otHours: 12, allowance: 200000, bonuses: 200000, deductions: 100000, taxes: 150000, status: 'draft' },
];

export default function PayrollTable() {
    const [records, setRecords] = useState<PayrollRecord[]>(mockPayroll);
    const [period, setPeriod] = useState('Tháng 5, 2026');

    const calculateNet = (r: PayrollRecord) => {
        // Simple calculation for UI demo
        const baseEarned = r.baseSalary * r.totalHours;
        const otEarned = r.baseSalary * 1.5 * r.otHours;
        const gross = baseEarned + otEarned + r.allowance + r.bonuses;
        return gross - r.deductions - r.taxes;
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white">
            <div className="p-4 border-b flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Bảng Lương</h2>
                    <span className="text-gray-500 font-medium px-3 border-l border-gray-300">{period}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-gray-200">
                        <DownloadCloud size={16} className="mr-2 text-gray-500" /> Xuất Excel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Lock size={16} className="mr-2" /> Chốt Lương Kỳ Này
                    </Button>
                </div>
            </div>

            <div className="p-4 flex gap-4 border-b bg-gray-50/50">
                <div className="relative w-80">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <Input placeholder="Tìm mã, tên nhân viên..." className="pl-9 bg-white" />
                </div>
                <Button variant="outline" className="bg-white"><Filter size={16} className="mr-2 text-gray-500" /> Lọc</Button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="bg-white border rounded-md shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                <TableHead className="min-w-[150px]">Nhân viên</TableHead>
                                <TableHead className="text-right">Tổng Giờ</TableHead>
                                <TableHead className="text-right">Giờ OT</TableHead>
                                <TableHead className="text-right">Lương Cơ Bản</TableHead>
                                <TableHead className="text-right">Phụ Cấp + Thưởng</TableHead>
                                <TableHead className="text-right text-red-600">Khấu Trừ / Phạt</TableHead>
                                <TableHead className="text-right font-bold text-gray-900 border-l border-l-gray-200">Thực Lãnh</TableHead>
                                <TableHead className="text-center w-[100px]">Trạng thái</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        <div className="font-semibold text-gray-900">{r.name}</div>
                                        <div className="text-xs text-gray-500">{r.code} - {r.role}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{r.totalHours}h</TableCell>
                                    <TableCell className="text-right text-purple-600 font-medium">{r.otHours}h</TableCell>
                                    <TableCell className="text-right">
                                        <div className="text-sm text-gray-900">{formatCurrency(r.baseSalary * r.totalHours)}</div>
                                        <div className="text-xs text-gray-500 font-mono">{formatCurrency(r.baseSalary)}/h</div>
                                    </TableCell>
                                    <TableCell className="text-right text-green-700">+{formatCurrency(r.allowance + r.bonuses)}</TableCell>
                                    <TableCell className="text-right text-red-600">-{formatCurrency(r.deductions + r.taxes)}</TableCell>
                                    <TableCell className="text-right font-bold text-lg text-blue-700 border-l border-l-gray-100 bg-blue-50/30">
                                        {formatCurrency(calculateNet(r))}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {r.status === 'draft' && <Badge variant="outline" className="text-gray-500 cursor-help" title="Nháp">Nháp</Badge>}
                                        {r.status === 'locked' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200"><Lock size={12} className="mr-1" /> Đã chốt</Badge>}
                                        {r.status === 'paid' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Đã thanh toán</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                            <ChevronRight size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            <div className="p-4 border-t bg-white flex justify-between items-center text-sm text-gray-600 shrink-0">
                <div>Tổng số nhân viên: <span className="font-bold text-gray-900">{records.length}</span></div>
                <div className="flex gap-6">
                    <div>Tổng Thực Lãnh: <span className="font-bold text-blue-700 text-base ml-1">{formatCurrency(records.reduce((acc, r) => acc + calculateNet(r), 0))}</span></div>
                </div>
            </div>
        </div>
    );
}
