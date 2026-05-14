import React, { useState } from 'react';
import Header from './components/layout/Header';
import EmployeeList from './features/employees/EmployeeList';
import TimesheetMatrix from './features/timesheet/TimesheetMatrix';
import ShiftScheduling from './features/scheduling/ShiftScheduling';
import PayrollTable from './features/payroll/PayrollTable';
import ApprovalModal from './features/approvals/ApprovalModal';
import SettingsLayout from './features/settings/SettingsLayout';

function App() {
  const [currentModule, setCurrentModule] = useState<'employees' | 'timesheet' | 'scheduling' | 'payroll' | 'settings'>('payroll');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 h-screen overflow-hidden">
      <Header 
        currentModule={currentModule} 
        setCurrentModule={setCurrentModule}
        onOpenApprovals={() => setIsApprovalModalOpen(true)}
      />
      
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {currentModule === 'employees' && <EmployeeList />}
        {currentModule === 'timesheet' && <TimesheetMatrix />}
        {currentModule === 'scheduling' && <ShiftScheduling />}
        {currentModule === 'payroll' && <PayrollTable />}
        {currentModule === 'settings' && <SettingsLayout />}
      </main>

      {/* Global Modals */}
      <ApprovalModal 
        isOpen={isApprovalModalOpen} 
        onClose={() => setIsApprovalModalOpen(false)} 
      />
    </div>
  );
}

export default App;
