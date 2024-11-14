import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const useGetBalance = () => {
  const suiclient = useSuiClient();
  const account = useCurrentAccount();
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    if (!account?.address) {
      return;
    }
    (async () => {
      const coinBalance = await suiclient.getBalance({
        owner: account?.address ?? "",
      });
      setBalance((Number(coinBalance.totalBalance) / 10 ** 9).toFixed(2));
    })();
  }, [account?.address]);

  return balance;
};

export default useGetBalance;
