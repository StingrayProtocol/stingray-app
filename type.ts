export type TraderOperation = {
  id: string;
  fund: Fund;
  fund_object_id: string;
  action: string;
  protocol: string;
  token_in: string;
  amount_in: string;
  token_out: string;
  amount_out: string;
  event_seq: string;
  tx_digest: string;
  timestamp: string;
};

export type FundHistory = {
  share_id: string;
  fund: Fund;
  fund_object_id: string;
  action: "Invested" | "Deinvested";
  amount: string;
  redeemed: boolean;
  investor: string;
  event_seq: string;
  tx_digest: string;
  timestamp: string;
};

export type Fund = {
  object_id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  invest_duration: string;
  image_blob_id: string;
  arena: Arena;
  arena_object_id: string;
  owner_id: string;
  owner: TraderCard;
  fund_history: FundHistory[];
  trader_operation: TraderOperation[];
  trader_fee: string;
  limit_amount: string;
  expected_roi: string;
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
  trader_operation: TraderOperation[];
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

export type Farming = {
  name: string;
  value: string;
  liquidityTypename: string;
  liquidityValue: number;
  protocol: string;
};

export type FundBalance = {
  name: string;
  typename: string;
  value: number;
  decimal: number;
  farmings: Farming[];
}[];

export type PositionValue = {
  sui: number;
  trading: number;
  farming: number;
  total: number;
  percent: {
    sui: number;
    trading: number;
    farming: number;
  };
  balances: FundBalance;
};
