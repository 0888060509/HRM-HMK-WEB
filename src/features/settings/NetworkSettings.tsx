import React, { useState } from 'react';
import { Wifi, MapPin, Smartphone, AlertTriangle, Search, Activity, ShieldCheck, MonitorSmartphone, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function NetworkSettings() {
  return (
    <div className="bg-gray-50 flex flex-1 flex-col min-h-0">
      <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Quản lý Tập trung Điểm danh</h1>
        <p className="text-sm text-gray-500 mt-1">Cấu hình MAC Wifi, theo dõi định vị GPS (Geofencing) và trạng thái kết nối thiết bị theo chuẩn Zero-Trust.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
             <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                   <Wifi size={20} />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">Active</Badge>
             </div>
             <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">324</h3>
                <p className="text-sm text-gray-500">Router Whitelist toàn hệ thống</p>
             </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
             <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-md">
                   <MonitorSmartphone size={20} />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">Active</Badge>
             </div>
             <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">1,405</h3>
                <p className="text-sm text-gray-500">Thiết bị nhân viên đã khóa (Binded)</p>
             </div>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
             <div className="flex justify-between items-start">
                <div className="p-2 bg-red-100 text-red-700 rounded-md">
                   <AlertTriangle size={20} />
                </div>
             </div>
             <div className="mt-4">
                <h3 className="text-2xl font-bold text-red-600">12</h3>
                <p className="text-sm text-gray-500">Thiết bị có rủi ro & Yêu cầu gỡ Bind</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
