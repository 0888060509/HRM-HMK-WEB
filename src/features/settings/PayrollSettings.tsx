import React, { useState } from 'react';
import { Settings, Plus, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';

const mockTags = [
  { id: '1', name: 'Đóng gói', baseRate: 25000 },
  { id: '2', name: 'Kho', baseRate: 28000 },
  { id: '3', name: 'Vận hành xe nâng', baseRate: 40000 },
  { id: '4', name: 'Tư vấn BH', baseRate: 35000 },
  { id: '5', name: 'Pha chế (Bartender)', baseRate: 30000 },
];

export default function PayrollSettings() {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-1 flex-col min-h-0">
      <div className="px-6 py-5 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-semibold outline-none text-gray-900 mb-1">Chính sách lương (Payroll Setup)</h1>
        <p className="text-sm text-gray-500">Cấu hình Đơn giá lương, phụ cấp, PIT lũy tiến.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="allowances" className="w-full">
            <TabsList className="mb-6 grid grid-cols-2 max-w-lg">
              <TabsTrigger value="allowances">Phụ cấp & Thưởng</TabsTrigger>
              <TabsTrigger value="pit">Trích nộp & Thuế TNCN</TabsTrigger>
            </TabsList>
            
            <TabsContent value="allowances" className="mt-0">
                <div className="h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500 bg-gray-50">
                   Chưa có phụ cấp nào được cấu hình.
                </div>
                <div className="mt-4">
                   <Button variant="outline"><Plus size={16} className="mr-2"/> Thêm loại phụ cấp mới</Button>
                </div>
            </TabsContent>

            <TabsContent value="pit" className="mt-0">
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 text-sm">Bảo hiểm & Trích nộp (Theo quy định Bộ LĐTBXH)</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-xs text-gray-600 block">BHXH, BHYT, BHTN (Người lao động đóng)</label>
                              <div className="flex items-center space-x-2">
                                <Input defaultValue="10.5" className="w-24 text-right" /> <span className="text-sm">%</span>
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-xs text-gray-600 block">Kinh phí công đoàn</label>
                              <div className="flex items-center space-x-2">
                                <Input defaultValue="0" className="w-24 text-right" /> <span className="text-sm">%</span>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
