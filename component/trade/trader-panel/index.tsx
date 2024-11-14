import { Flex, Select, Text, Title } from "@/styled-antd";
import Swap from "./swap";
import Farm from "./farm";
import bucket from "@/public/partner-bucket.png";
import scallop from "@/public/partner-scallop.png";
import suilend from "@/public/partner-suilend.png";
import { useEffect, useState } from "react";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import SolidButton from "@/common/solid-button";
import useGetOwnedFund from "@/application/query/use-get-owned-fund";
import { Fund } from "@/type";
import { BUCKET_DEPOSIT } from "@/constant/defi-data/bucket";
import { SCALLOP_DEPOSIT } from "@/constant/defi-data/scallop";
import { SUILEND_DEPOSIT } from "@/constant/defi-data/suilend";
import useGetFundBalance from "@/application/query/use-get-fund-balance";

const TradePanel = () => {
  const { data: traderCard } = useGetOwnedTraderCard();
  const { data: funds, isSuccess } = useGetOwnedFund();
  const [fundId, setFundId] = useState<string>();
  const { data: balance } = useGetFundBalance({
    fundId,
  });
  useEffect(() => {
    if (isSuccess && funds?.length && !fundId) {
      setFundId(funds[0]?.object_id);
    }
  }, [isSuccess, funds]);
  const farms = [
    {
      name: "Bucket",
      powerBy: bucket,
      tokens: BUCKET_DEPOSIT.map((info) => info.name),
    },
    {
      name: "Scallop",
      powerBy: scallop,
      tokens: SCALLOP_DEPOSIT.map((info) => info.name),
    },
    {
      name: "Suilend",
      powerBy: suilend,
      tokens: SUILEND_DEPOSIT.map((info) => info.name),
    },
  ];
  const [activeFarm, setActiveFarm] = useState(farms[0].name);
  console.log(fundId);
  return (
    <Flex
      style={{
        width: "100%",
        zIndex: 1,
        padding: "20px",
        position: "relative",
      }}
      vertical
      gap="middle"
    >
      <Flex
        style={{
          width: "100%",
        }}
        align="center"
        justify="space-between"
        gap="middle"
      >
        <Title
          style={{
            fontSize: "80px",
          }}
          level={1}
        >
          SWAP
        </Title>
        <Flex
          vertical
          gap="small"
          flex="1"
          style={{
            marginTop: "20px",
          }}
          align="center"
        >
          <Text
            style={{
              fontSize: "12px",
            }}
          >
            Select Your Funded Strategy
          </Text>
          <Select
            defaultValue={funds?.[0]?.object_id}
            style={{ borderRadius: 40, background: "#2a0067", width: "100%" }}
            size="large"
            dropdownStyle={{ background: "#2a0067" }}
            onChange={(value) => {
              setFundId(
                funds?.find((fund: Fund) => fund.object_id === value)?.object_id
              );
            }}
            value={fundId}
            options={
              Array.isArray(funds)
                ? funds.map((fund: { name: string; object_id: string }) => ({
                    label: fund.name,
                    value: fund.object_id,
                  }))
                : []
            }
          />
        </Flex>

        <Title
          style={{
            fontSize: "80px",
          }}
          level={1}
        >
          FARM
        </Title>
      </Flex>
      <Flex gap="small">
        <Flex vertical gap="large" flex="1">
          <Swap fundId={fundId} balance={balance} />
        </Flex>
        <Flex vertical flex="1" justify="space-between">
          {farms.map(({ name, powerBy, tokens }, i) => (
            <Farm
              key={i}
              name={name}
              powerBy={powerBy.src}
              activeFarm={activeFarm}
              onActiveFarm={setActiveFarm}
              tokens={tokens}
              fundId={fundId}
            />
          ))}
        </Flex>
      </Flex>
      <Flex
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          display:
            traderCard?.object_id && (funds?.length ?? 0) > 0 ? "none" : "flex",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "40px",
          zIndex: 2,
        }}
        align="center"
        justify="center"
      >
        <Flex
          style={{
            width: "80%",
            height: "80%",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "40px",
            padding: "36px",
          }}
          gap="large"
          vertical
          align="center"
          justify="center"
        >
          <Title level={1}>NOTICE</Title>
          {!traderCard?.object_id ? (
            <Text>You must have a Trader ID to access trader feature.</Text>
          ) : (
            <Text>No fund running</Text>
          )}
          <SolidButton
            onClick={() => {
              document
                .querySelector("#mint")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {!traderCard?.object_id ? "Mint Trader ID" : "Create Fund"}
          </SolidButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TradePanel;
