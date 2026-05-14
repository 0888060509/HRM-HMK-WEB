import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import TimesheetApprovalTab from './TimesheetApprovalTab';

interface TimesheetApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // We can pass a specific ticket ID or employee code if triggered directly from a cell
  defaultTicketId?: string | null;
}

export function TimesheetApprovalDrawer({ isOpen, onClose, defaultTicketId }: TimesheetApprovalDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[65vw] sm:max-w-none p-0 flex flex-col bg-gray-50 border-l border-gray-200">
        <SheetHeader className="px-6 py-4 border-b border-gray-200 bg-white shrink-0 shadow-sm z-10">
          <SheetTitle className="text-lg font-bold text-gray-800">Yêu cầu chấm công (Timesheet Approvals)</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden m-0 min-h-0 bg-white">
            <TimesheetApprovalTab defaultExpandedId={defaultTicketId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
