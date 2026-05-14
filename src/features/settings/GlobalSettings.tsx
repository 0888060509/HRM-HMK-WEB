import React, { useState } from 'react';
import { Settings, Save, Plus, Clock, Copy, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';

const mockVersions = [
  { id: 'v2', name: 'Chính sách vận hành Q3/2026', effectiveDate: '2026-07-01', status: 'Bản nháp', createdAt: '2026-05-10', createdBy: 'Admin' },
  { id: 'v1', name: 'Chính sách gốc', effectiveDate: '2026-01-01', status: 'Đang áp dụng', createdAt: '2025-12-25', createdBy: 'System' }
];

export default function GlobalSettings() {
  const [selectedVersion, setSelectedVersion] = useState('v1');
  
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-1 flex-col min-h-0">
      <div className="px-6 py-5 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-semibold outline-none text-gray-900 mb-1">Tham số toàn cục & Phiên bản</h1>
        <p className="text-sm text-gray-500">Quản lý các biến số vận hành hệ thống, ngưỡng thời gian và lịch sử phiên bản chính sách.</p>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar: Versions list */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h3 className="font-semibold text-gray-800">Phiên bản thiết lập</h3>
            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
              <Plus size={14} className="mr-1" /> Tạo mới
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockVersions.map(v => (
              <div 
                key={v.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedVersion === v.id 
                    ? 'bg-blue-50 border-blue-300 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => setSelectedVersion(v.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${selectedVersion === v.id ? 'text-blue-800' : 'text-gray-900'}`}>{v.name}</h4>
                  <Badge variant="outline" className={
                    v.status === 'Đang áp dụng' ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-600 bg-gray-50'
                  }>
                    {v.status}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center"><Calendar size={13} className="mr-1.5" /> Hiệu lực: <strong>{v.effectiveDate}</strong></p>
                  <p className="flex items-center"><Clock size={13} className="mr-1.5" /> Ngày tạo: {v.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content: Settings Editor */}
        <div className="w-2/3 flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Chỉnh sửa: {mockVersions.find(v => v.id === selectedVersion)?.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                <AlertCircle size={13} className="mr-1 inline text-orange-500" /> 
                Thay đổi sẽ ảnh hưởng đến luồng payroll và ticket từ ngày {mockVersions.find(v => v.id === selectedVersion)?.effectiveDate}.
              </div>
            </div>
            {mockVersions.find(v => v.id === selectedVersion)?.status !== 'Đang áp dụng' && (
              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
             <Tabs defaultValue="time" className="w-full">
                <TabsList className="mb-6 grid grid-cols-3">
                  <TabsTrigger value="time">Ngưỡng thời gian</TabsTrigger>
                  <TabsTrigger value="sla">SLA & Vận hành</TabsTrigger>
                  <TabsTrigger value="sys">Hệ thống</TabsTrigger>
                </TabsList>
                
                <TabsContent value="time" className="space-y-8 mt-0">
                   <section>
                      <h3 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Ngưỡng chấm công</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Ngưỡng đi trễ (Late In)</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="5" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">phút sau khi ca bắt đầu</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Ngưỡng về sớm (Early Out)</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="0" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">phút trước khi ca kết thúc</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Mốc Auto-Checkout</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="180" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">phút sau khi kết thúc ca</span>
                           </div>
                           <p className="text-xs text-gray-400 mt-1">Sẽ tự động checkout nếu nhân viên quên.</p>
                        </div>
                      </div>
                   </section>
                   
                   <section>
                      <h3 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Giới hạn thời lượng</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Độ dài tối đa ca ảo</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="12" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">tiếng / ca</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Mức làm thêm tối đa / Tháng</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="40" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">tiếng (Cảnh báo OT)</span>
                           </div>
                        </div>
                      </div>
                   </section>
                </TabsContent>
                
                <TabsContent value="sla" className="space-y-8 mt-0">
                   <section>
                      <h3 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">SLA Điều phối & Duyệt (giờ)</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">SLA Duyệt Ticket Quản lý</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="24" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">giờ kể từ lúc tạo</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">Lead time Publish ca tối thiểu</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="24" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">giờ trước khi ca đầu tiên bắt đầu</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">SLA Handshake State 2 (Cụm)</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="15" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">phút để phản hồi</span>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-gray-700">SLA Handshake State 3 (Sup)</label>
                           <div className="flex items-center space-x-2">
                             <Input defaultValue="30" className="w-24 text-right" type="number" />
                             <span className="text-sm text-gray-500">phút để phản hồi</span>
                           </div>
                        </div>
                      </div>
                   </section>
                </TabsContent>

                <TabsContent value="sys" className="space-y-6 mt-0">
                   <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div>
                         <h4 className="font-medium text-gray-900">Tính lương hồi tố (Retroactive Recalculation)</h4>
                         <p className="text-xs text-gray-500 mt-1">Tự động kích hoạt tính lại các Ticket đã duyệt nếu đổi chính sách rơi vào đầu kỳ công.</p>
                      </div>
                      <Switch checked={true} />
                   </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div>
                         <h4 className="font-medium text-gray-900">Bắt buộc Check-in thiết bị (Device Binding)</h4>
                         <p className="text-xs text-gray-500 mt-1">Phát hiện và yêu cầu phê duyệt khi đăng nhập ở thiết bị lạ.</p>
                      </div>
                      <Switch checked={true} />
                   </div>
                </TabsContent>
             </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
