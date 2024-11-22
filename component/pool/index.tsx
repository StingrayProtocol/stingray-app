import { Flex, Tabs, Text } from "@/styled-antd";
import React, { useEffect, useState } from "react";
import Funds from "../funds";
import useGetPools from "@/application/query/use-get-pools";

const Pools = () => {
  const [activeKey, setActiveKey] = useState("arena");
  const { data: pools } = useGetPools();
  const [arenaId, setArenaId] = useState<string>();
  const [fundingId, setFundingId] = useState<string>();
  const [runningId, setRunningId] = useState<string>();
  const arena = pools?.arenas?.find((arena) => arena.object_id === arenaId);
  useEffect(() => {
    if (pools?.arenas?.length) {
      setArenaId(pools.arenas[0].object_id);
    }
    if (pools?.fundings?.length) {
      setFundingId(pools.fundings[0].object_id);
    }
    if (pools?.runnings?.length) {
      setRunningId(pools.runnings[0].object_id);
    }
  }, [pools]);
  const arenaStatus =
    Number(arena?.start_time) + Number(arena?.invest_duration) > Date.now()
      ? "funding"
      : "running";
  const Label = ({
    name,
    children,
  }: {
    name: string;
    children: React.ReactNode;
  }) => (
    <Text
      style={{
        fontSize: activeKey === name ? "22px" : "16px",
        textShadow: activeKey === name ? "0px 0px 15px #fff" : "none",
      }}
    >
      {children}
    </Text>
  );
  const items = [
    {
      key: "arena",
      label: <Label name={"arena"}>Arena</Label>,
      children: (
        <Funds
          status={arenaStatus}
          fundId={arenaId}
          funds={pools?.arenas}
          onSelectFund={(value) => {
            setArenaId(value);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        />
      ),
    },
    {
      key: "funding",
      label: <Label name={"funding"}>Funding</Label>,
      children: (
        <Funds
          status="funding"
          fundId={fundingId}
          funds={pools?.fundings}
          onSelectFund={(value) => {
            setFundingId(value);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        />
      ),
    },
    {
      key: "running",
      label: <Label name={"running"}>Running</Label>,
      children: (
        <Funds
          status="running"
          fundId={runningId}
          funds={pools?.runnings}
          onSelectFund={(value) => {
            setRunningId(value);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        />
      ),
    },
  ];
  return (
    <Flex>
      <Tabs
        style={{
          width: "100%",
          margin: "20px",
        }}
        defaultActiveKey="1"
        items={items}
        onChange={(value) => {
          setActiveKey(value);
          console.log(value);
        }}
      />
    </Flex>
  );
};

export default Pools;
