import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import RoleManagement from './RoleManagement';
// import AccountManagement from './AccountManagement'; // We'll add this later if needed

export default function UserManagement() {
    return (
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-md shadow-sm border border-gray-200">
            <Tabs defaultValue="roles" className="flex-1 flex flex-col min-h-0 hidden-scrollbar">
                <div className="px-6 shrink-0 pt-6">
                    <TabsList>
                        <TabsTrigger value="accounts">Tài khoản người dùng</TabsTrigger>
                        <TabsTrigger value="roles">Quản lý vai trò</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="accounts" className="flex-1 p-6 m-0 outline-none">
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Tính năng Quản lý tài khoản đang được phát triển
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="flex-1 flex flex-col m-0 outline-none overflow-hidden">
                    <RoleManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
