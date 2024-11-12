"use client";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import CreateFund from "@/component/trade/create-fund";
import MintPage from "@/component/trade/mint";
import TradePanel from "@/component/trade/trader-panel";
import { Flex, Title } from "@/styled-antd";

const Page = () => {
  const { data: traderCard } = useGetOwnedTraderCard();
  return (
    <Flex
      vertical
      gap="large"
      style={{
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <TradePanel />
      <Title
        level={1}
        id="mint"
        style={{
          fontSize: "72px",
          textAlign: "center",
        }}
      >
        {!!traderCard ? "Create Pool" : "Mint Your Trader ID"}
      </Title>
      {!!traderCard ? <CreateFund /> : <MintPage />}
    </Flex>
  );
};

export default Page;
