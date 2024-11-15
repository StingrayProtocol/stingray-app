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

const network =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : "testnet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: "https://mainnet.sui.rpcpool.com" },
  // devnet: { url: getFullnodeUrl("devnet") },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  // process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : "testnet";
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
        <WalletProvider autoConnect>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                components: {
                  Segmented: {
                    // itemSelectedBg: "rgba(125, 125, 125, 0.2)",
                    itemSelectedBg: "rgba(150, 0, 255, 0.5) !important",
                    itemActiveBg: "rgba(150, 0, 255, 0.5) !important",
                    // itemHoverBg: "transparent",
                    // itemActiveBg: "transparent",
                    // borderRadius: 40,
                  },
                  Select: {
                    colorBgContainer: "rgba(155, 155, 155, 0.1)",
                    selectorBg: "rgba(155, 155, 155, 0.1)",
                    hoverBorderColor: "rgba(155, 155, 155, 0.1)",
                    activeBorderColor: "rgba(155, 155, 155, 0.1)",
                    activeOutlineColor: "rgba(155, 155, 155, 0.1)",
                    multipleSelectorBgDisabled: "rgba(155, 155, 155, 0.1)",
                    clearBg: "rgba(155, 155, 155, 0.1)",
                    optionSelectedBg: "rgba(155, 155, 155, 0.2)",
                    multipleItemBg: "rgba(155, 155, 155, 0.1)",
                  },
                  Button: {
                    borderRadius: 40,
                    textTextHoverColor: "white",
                    textTextActiveColor: "white",
                  },
                  Steps: {
                    navArrowColor: "rgba(155, 155, 155, 0.1)",
                  },
                  Modal: {
                    contentBg: "rgba(155, 155, 155, 0.1)",
                    headerBg: "rgba(155, 155, 155, 0.1)",
                  },
                  Input: {
                    colorBorder: "rgba(255, 255, 255, 0.5)",
                    hoverBorderColor: "rgba(255, 255, 255, 1)",
                    activeBorderColor: "rgba(255, 255, 255, 1)",
                    controlOutline: "rgba(255,255, 255, 0.1)",
                    activeBg: "rgba(120, 0, 255, 0.2)",
                    colorPrimaryBg: "rgba(120, 0, 255, 0.2)",
                    colorBgBlur: "rgba(120, 0, 255, 0.2)",
                    addonBg: "rgba(120, 0, 255, 0.2)",
                    colorBgBase: "rgba(120, 0, 255, 0.2)",
                    colorBgContainer: "rgba(120, 0, 255, 0.2)",
                    fontSize: 28,
                  },
                  Tabs: {
                    inkBarColor: "white",
                    itemColor: "rgba(155, 155, 155, 0.5)",
                    itemActiveColor: "white",
                    itemHoverColor: "white",
                    itemSelectedColor: "white",
                  },
                  Progress: {
                    defaultColor: "white",
                  },
                  Radio: {
                    fontSize: 24,
                    colorBorder: "rgba(255, 255, 255, 0.5)",
                    colorPrimary: "rgba(255, 255, 255, 0.5)",
                    colorBgSolidHover: "rgba(255, 255, 255, 0.1)",
                    colorTextLabel: "rgba(255, 255, 255, 0.5)",
                  },
                  Slider: {
                    trackBg: "rgba(255, 255, 255, 0.5)",
                    trackHoverBg: "rgba(255, 255, 255, 0.5)",
                    dotBorderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  Tooltip: {
                    colorBgBase: "#2a0067",
                    colorBgContainer: "#2a0067",
                    colorPrimary: "white",
                  },
                  Table: {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    cellFontSize: 20,
                    cellPaddingBlock: 20,
                    headerBg: "rgba(85, 0, 155, 0.5)",
                    headerBorderRadius: 40,
                    footerBg: "rgba(90, 0, 175, 0.6)",
                    borderRadius: 40,
                  },
                },
                algorithm: theme.darkAlgorithm,
                token: {
                  fontFamily: "Inter",
                  colorPrimaryText: "white",
                  colorBgBase: "rgba(155, 155, 155, 0.1)",
                  colorBgContainer: "rgba(155, 155, 155, 0.1)",
                  colorPrimary: "#2a0067",
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
