import { Button, Select, Text } from "@/styled-antd";
import { WalletOutlined } from "@ant-design/icons";
import {
  ConnectModal,
  useAccounts,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const formatAddress = (address?: string) =>
  `${address?.slice(0, 4)}...${address?.slice(-4)}`;

const ConnectButton = () => {
  const { mutate: switchAccount } = useSwitchAccount();
  const currentAccount = useCurrentAccount();
  const accounts = useAccounts();
  const { connectionStatus } = useCurrentWallet();

  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accounts.length === 0) {
      disconnect();
    }
  }, [connectionStatus, accounts]);
  return (
    <>
      {connectionStatus === "connected" ? (
        <Select
          options={accounts.map((account) => ({
            label: formatAddress(account.address),
            value: account,
          }))}
          onChange={(account) => {
            if (account) {
              switchAccount({ account: account as any });
            }
          }}
        />
      ) : (
        <ConnectModal
          trigger={
            <Button
              disabled={!!currentAccount}
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                padding: "20px",
                backgroundColor: "rgba(105, 0, 200, 1)",
                alignSelf: "center",
              }}
            >
              {currentAccount ? currentAccount.address : "Connect Wallet"}
            </Button>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
      )}
    </>
  );
};

export default ConnectButton;
