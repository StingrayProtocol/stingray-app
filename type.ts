/* eslint-disable @typescript-eslint/no-explicit-any */

export type FundHistory = {
  share_id: string;
  fund: Fund;
  fund_object_id: string;
  amount: string;
  investor: string;
  event_seq: string;
  tx_digest: string;
  timestamp: string;
};

export type Fund = {
  object_id: string;
  owner_id: string;
  amount: number;
  start_time: string;
  end_time: string;
  invest_duration: string;
  trader: string;
  trader_fee: number;
  name: string;
  description: string;
  image_blob_id: string;
  arena_object_id?: string;
  limit_amount: number;
  expected_roi: number;
  arena?: Arena;
  fund_history: FundHistory[];
  trader_operation: any[];
  event_seq: string;
  tx_digest: string;
  timestamp: string;
};

export type Arena = {
  object_id: string;
  start_time: string;
  end_time: string;
  invest_duration: string;
  attend_duration: string;
  fund: Fund;
  event_seq: string;
  tx_digest: string;
  timestamp: string;
};

export type TraderCard = {
  object_id: string;
  first_name: string;
  last_name: string;
  description: string;
  image_blob_id: string;
  owner_address: string;
  event_seq: string;
  tx_digest: string;
  timestamp: string;
  trader_operation: any[];
};

export type SwapInfo = {
  name: string;
  firstToken: {
    type: string;
    decimal: number;
    amount: number;
  };
  secondToken: {
    type: string;
    decimal: number;
    amount: number;
  };
  pool: string;
  poolFirstType: string;
  poolSecondType: string;
};

export type InvestTarget = {
  fund: string;
  trader: string;
  fundType: string;
};
