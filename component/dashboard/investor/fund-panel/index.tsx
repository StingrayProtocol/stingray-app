import { Flex, Tabs, Text } from "@/styled-antd";
import { useEffect, useState } from "react";
import useGetInvestFund from "@/application/query/use-get-invest-fund";
import Funds from "@/component/funds";

const FundPanel = () => {
  const [activeKey, setActiveKey] = useState("funding");
  const { data: pools } = useGetInvestFund();
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
  const [funding, setFunding] = useState<string>();
  const [running, setRunning] = useState<string>();
  const [claimable, setClaimable] = useState<string>();

  const items = [
    {
      key: "funding",
      label: <Label name={"funding"}>Funding</Label>,
      children: (
        <Funds
          status="funding"
          funds={pools?.fundings}
          onSelectFund={(fundId) => {
            setFunding(fundId);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          fundId={funding}
        />
      ),
    },
    {
      key: "running",
      label: <Label name={"running"}>Running</Label>,
      children: (
        <Funds
          status="running"
          funds={pools?.runnings}
          onSelectFund={(fundId) => {
            setRunning(fundId);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          fundId={running}
        />
      ),
    },
    {
      key: "claimable",
      label: <Label name={"claimable"}>Claimable</Label>,
      children: (
        <Funds
          status="claimable"
          funds={pools?.claimables}
          onSelectFund={(fundId) => {
            setClaimable(fundId);
            document.getElementById("fund-panel")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          fundId={claimable}
        />
      ),
    },
  ];

  useEffect(() => {
    if (pools?.fundings?.length) {
      setFunding(pools?.fundings?.[0]?.object_id);
    }
    if (pools?.runnings?.length) {
      setRunning(pools?.runnings?.[0]?.object_id);
    }
    if (pools?.claimables?.length) {
      setClaimable(pools?.claimables?.[0]?.object_id);
    }
  }, [pools]);
  return (
    <Flex>
      <Tabs
        id={"fund-panel"}
        style={{
          width: "100%",
          margin: "20px",
        }}
        defaultActiveKey="1"
        items={items}
        onChange={(value) => {
          setActiveKey(value);
          if (value === "funding") {
            setFunding(pools?.fundings?.[0]?.object_id);
          }
          if (value === "running") {
            setRunning(pools?.runnings?.[0]?.object_id);
          }
          if (value === "claimable") {
            setClaimable(pools?.claimables?.[0]?.object_id);
          }
        }}
      />
    </Flex>
  );
};

export default FundPanel;
