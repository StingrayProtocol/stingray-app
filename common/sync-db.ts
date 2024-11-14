const url = process.env.NEXT_PUBLIC_API_URL;
export const syncDb = {
  fundHistory: () => fetch(`${url}/sync/fund-history`, { method: "POST" }),
  fund: () => fetch(`${url}/sync/fund`, { method: "POST" }),
  traderCard: () => fetch(`${url}/sync/trader-card`, { method: "POST" }),
  attend: () => fetch(`${url}/sync/attend`, { method: "POST" }),
  swap: () => fetch(`${url}/sync/swap`, { method: "POST" }),
  deposit: (protocol: string) =>
    fetch(`${url}/sync/deposit`, {
      method: "POST",
      body: JSON.stringify(protocol),
    }),
  withdraw: (protocol: string) =>
    fetch(`${url}/sync/withdraw`, {
      method: "POST",
      body: JSON.stringify(protocol),
    }),
};
