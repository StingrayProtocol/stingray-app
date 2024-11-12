const url = process.env.NEXT_PUBLIC_API_URL;
export const syncDb = {
  fund: () => fetch(`${url}/sync/fund`, { method: "POST" }),
  traderCard: () => fetch(`${url}/sync/trader-card`, { method: "POST" }),
  attend: () => fetch(`${url}/sync/attend`, { method: "POST" }),
};
