"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import useMintTraderCard from "@/application/mutation/use-mint-trader-card";
import useCreateFund from "@/application/mutation/use-create-fund";
import useAttendArena from "@/application/mutation/use-attend-arena";
import useGetOwnedSuiNS from "@/application/use-get-owned-sui-ns";
import { Button, Flex } from "antd";

export default function Home() {
  //split token and interact with pool
  // const { mutate: stake } = useStake();
  // const { data } = useGetStakeTable();
  // console.log(data);
  const { mutate } = useMintTraderCard();
  const { mutate: attendArena } = useAttendArena();
  const { mutate: createFund } = useCreateFund();
  const { data: suiNS } = useGetOwnedSuiNS({
    cursor: null,
  });

  console.log();
  console.log(suiNS);
  return (
    <Flex
      gap="middle"
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <ConnectButton />
      {/* <Button
        onClick={() => {
          stake();
        }}
      >
        Stake
      </Button> */}
      <Button
        onClick={() => {
          mutate({
            suiNS: "",
          });
        }}
      >
        Mint Trader Card
      </Button>

      <Button
        onClick={() => {
          createFund({
            trader: "",
            description: "",
            traderFee: 20,
          });
        }}
      >
        Create Fund
      </Button>

      <Button
        onClick={() => {
          attendArena({
            trader: "",
            description: "",
            traderFee: 20,
            arena: "", //need to get arena in db
          });
        }}
      >
        Attend Arena
      </Button>
    </Flex>
  );
}
