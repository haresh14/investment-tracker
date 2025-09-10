export interface SIP {
  id: string;
  name: string;
  start_date: string; // ISO date string
  amount: number;
  annual_return: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  pause_date?: string | null;
  is_paused: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number;
  date: string; // ISO date string
  sip_id?: string;
  user_id: string;
  created_at?: string;
}

export interface PortfolioSummary {
  total_invested: number;
  total_withdrawals: number;
  net_portfolio: number;
  expected_value: number;
  total_gain_loss: number;
}

export interface SIPCalculation {
  installments_paid: number;
  total_invested: number;
  expected_value: number;
  gain_loss: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}
