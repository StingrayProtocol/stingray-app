"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  devnet: { url: getFullnodeUrl("devnet") },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  fontFamily: "Inter",
                  colorPrimaryText: "white",
                },
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Provider;
