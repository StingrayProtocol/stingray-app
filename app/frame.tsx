"use client";
import { Flex, Image, Text } from "@/styled-antd";
import bgCover from "@/public/stingray_website_bg.png";
import Header from "./header";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import {
  useAccounts,
  useCurrentWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import useGetOwnedFund from "@/application/query/use-get-owned-fund";
import ConnectPage from "@/component/connect-page";
import loadingGif from "@/public/loading.gif";
import CreateFundButton from "@/component/create-pool-button";
import stingray9 from "@/public/stingray_element_9.png";
import stingray8 from "@/public/stingray_element_8.png";
import stingray1 from "@/public/stingray_element_1.png";

const Frame = ({ children }: { children: React.ReactNode }) => {
  const { isLoading: isGettingCard } = useGetOwnedTraderCard();
  const [onLoad, setOnLoad] = useState(false);
  const accounts = useAccounts();
  const { connectionStatus } = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const { isLoading: isGettingOwnFund } = useGetOwnedFund();
  const [windowWidth, setWindowWidth] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      setOnLoad(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (accounts.length === 0 && connectionStatus === "connected") {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, accounts]);

  const isLoading = isGettingCard || isGettingOwnFund || !onLoad;

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Flex
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <CreateFundButton />

      <Image
        preview={false}
        alt="bg"
        src={stingray9.src}
        style={{
          position: "absolute",
          top: 360,
          left: 1100,
          width: "700px",
          filter: "brightness(0.1)",
        }}
      />
      <Image
        preview={false}
        alt="bg"
        src={stingray8.src}
        style={{
          position: "absolute",
          top: 2560,
          left: 1000,
          width: "700px",
          filter: "brightness(0.1)",
        }}
      />
      <Image
        preview={false}
        alt="bg"
        src={stingray1.src}
        style={{
          position: "absolute",
          top: 1060,
          left: -600,
          width: "1400px",
          filter: "brightness(0.1)",
        }}
      />
      <Image
        preview={false}
        alt="bg"
        src={bgCover.src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: isLoading || (windowWidth && windowWidth < 768) ? 10000 : -1,
        }}
      />
      {windowWidth && windowWidth <= 768 && (
        <Text
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10001,
            color: "white",
            textAlign: "center",
            fontSize: "36px",
            width: "80%",
          }}
        >
          This website is best viewed on a larger screen
        </Text>
      )}
      <Image
        alt="loading..."
        src={loadingGif.src}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "50px",
          height: "50px",
          transform: "translate(-50%, -50%)",
          display: isLoading ? "block" : "none",
          zIndex: 10001,
        }}
      />
      <Flex
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          zIndex: 1,
        }}
        vertical
      >
        <Header />
        {(connectionStatus === "disconnected" ||
          connectionStatus === "connecting") &&
          onLoad && <ConnectPage />}

        {connectionStatus === "connected" && <>{children}</>}
      </Flex>
    </Flex>
  );
};

export default Frame;
