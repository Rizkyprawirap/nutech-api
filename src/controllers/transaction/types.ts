export type GetBalanceRequest = {
  user_id: string;
};

export type GetBalanceResponse = {
  balance: number;
};

export type AddBalanceRequest = {
  user_id: string;
  top_up_amount: number;
};

export type AddBalanceResponse = {
  balance: number;
};

export type ServiceTransactionRequest = {
  service_code: string;
  user_id: string;
};

export type ServiceTransactionResponse = {
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
  total_amount: number;
  created_on: string;
};

export type GetTransactionHistoryRequest = {
  user_id: string;
  limit: number;
  offset: number;
};
export type GetTransactionHistoryResponse = {
  limit: number;
  offset: number;
  records: {
    invoice_number: string;
    transaction_type: string;
    description: string;
    total_amount: number;
    created_at: string;
  }[];
};
