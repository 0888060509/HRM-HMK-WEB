import React, { useState } from 'react';
import { Plus, Edit2, Copy, Trash2, Clock, CalendarRange, Users, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';

export default function ShiftSettings() {
  return (
    <div className="bg-gray-50 flex flex-1 flex-col min-h-0">
      <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Thiết lập Quy tắc Xếp ca & Lịch</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình các quy tắc ràng buộc hệ thống khi Admin/Sup tiến hành lên lịch làm việc.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Lưu thay đổi
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl space-y-6">
         {/* System Rules */}
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Ràng buộc Xếp ca (Scheduling Constraints)</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Khoảng cách nghỉ tối thiểu giữa 2 ca</h4>
                        <p className="text-xs text-gray-500 mt-1">Mỗi nhân viên sau khi kết thúc ca làm việc phải được nghỉ một khoảng thời gian trước khi nhận ca tiếp theo.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input defaultValue="11" className="w-20 text-center" />
                        <span className="text-sm text-gray-600">giờ</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Số ngày nghỉ tối thiểu trong tháng / tuần</h4>
                        <p className="text-xs text-gray-500 mt-1">Theo quy định pháp luật hoặc tổ chức (Mẫu: 4 ngày nghỉ/tháng hoặc 1 ngày nghỉ/tuần).</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input defaultValue="4" className="w-20 text-center" />
                        <span className="text-sm text-gray-600">ngày / tháng</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Giới hạn thời lượng làm việc / Tuần</h4>
                        <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ cảnh báo khi xếp lịch làm việc vượt quá thời lượng này.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input defaultValue="48" className="w-20 text-center" />
                        <span className="text-sm text-gray-600">giờ</span>
                    </div>
                </div>
            </div>
         </div>

         {/* Breaks */}
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Quy tắc Nghỉ giữa ca (Break Time Rules)</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="max-w-md">
                        <h4 className="font-medium text-gray-900 text-sm">Tự động trừ thời gian nghỉ giữa ca</h4>
                        <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động trừ đi số giờ nghỉ giữa ca khi tính thời gian làm việc thực tế cho các ca có cấu hình thời gian nghỉ.</p>
                    </div>
                    <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="max-w-md">
                        <h4 className="font-medium text-gray-900 text-sm">Bắt buộc Check-in / out giữa ca</h4>
                        <p className="text-xs text-gray-500 mt-1">Nhân viên phải điểm danh để ghi nhận thời gian nghỉ, thay vì hệ thống tự động trừ.</p>
                    </div>
                    <Switch checked={false} />
                </div>
            </div>
         </div>

         {/* Night Shifts */}
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-purple-900 mb-4 border-b border-purple-100 pb-2 flex items-center">
               <Clock size={18} className="mr-2 text-purple-600" />
               Quy tắc Ca vắt đêm & Trợ cấp ca đêm (Night Shifts)
            </h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="max-w-md">
                        <h4 className="font-medium text-gray-900 text-sm">Cách tính công Ca vắt đêm</h4>
                        <p className="text-xs text-gray-500 mt-1">Chỉ định hệ thống hạch toán ngày công cho ca làm việc bắc cầu qua midnight (24:00).</p>
                    </div>
                    <Select defaultValue="day1">
                        <SelectTrigger className="w-64">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="split">Cắt đôi ca tại 24:00</SelectItem>
                            <SelectItem value="day1">Tính toàn bộ vào Ngày tạo ca (Ngày 1)</SelectItem>
                            <SelectItem value="day2">Tính toàn bộ vào Ngày kết thúc ca (Ngày 2)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Khung giờ Ca Sinh lý</h4>
                        <p className="text-xs text-gray-500 mt-1">Theo luật LĐTBXH, khung giờ này được áp dụng % phụ cấp riêng.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input defaultValue="22:00" type="time" className="w-32" />
                        <span className="text-sm text-gray-500 mx-2">Tới</span>
                        <Input defaultValue="06:00" type="time" className="w-32" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm">Mức Phụ cấp Ca Sinh lý (% lương)</h4>
                        <p className="text-xs text-gray-500 mt-1">Được cộng thêm vào mức lương hiện tại đối với số giờ làm việc nằm trong khung giờ ca sinh lý.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input defaultValue="30" type="number" className="w-24 text-right" />
                        <span className="text-sm text-gray-600">%</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
