export type TicketStatus = 'pending' | 'approved' | 'rejected';

export interface Ticket {
  id: string;
  employeeName: string;
  code: string;
  date: string;
  type: 'missing' | 'abnormal' | 'adhoc';
  status: TicketStatus;
  
  standardShift?: { start: string; end: string };
  actualTime?: { in: string; out: string; originalIn?: string; originalOut?: string };
  reason?: string;

  securityFlags?: {
    checkIn?: { active: boolean; type: string; status: TicketStatus; fineAmount: number };
    checkOut?: { active: boolean; type: string; status: TicketStatus; fineAmount: number };
  };
  lateOutFlag?: { active: boolean; status: TicketStatus };
  lateInFlag?: { active: boolean; status: TicketStatus };
  
  adhocStep?: 1 | 2;
}
