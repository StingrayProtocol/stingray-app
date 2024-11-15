"use client";
import useGetOwnedFund from "@/application/query/use-get-owned-fund";
import MainButton from "@/common/main-button";
import FundAllocationHolding from "@/component/dashboard/trader/fund-allocation-holding";
import FundStatus from "@/component/dashboard/trader/fund-status";
import TitleTemplate from "@/component/title-tempplate/title-template";
import { Button, Flex, Select } from "@/styled-antd";
import { Fund } from "@/type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [fund, setFund] = useState<Fund>();
  const { data: funds } = useGetOwnedFund();
  const router = useRouter();
  useEffect(() => {
    if (funds?.length) {
      setFund(funds[0]);
    }
  }, [funds]);

  return (
    <Flex
      vertical
      gap="large"
      style={{
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <Flex vertical>
        <Select
          style={{
            marginRight: "20px",
            width: 450,
            borderRadius: 40,
            alignSelf: "flex-end",
            background: "#2a0067",
          }}
          value={fund?.object_id}
          size="large"
          dropdownStyle={{ background: "#2a0067" }}
          options={
            funds?.map((fund) => ({
              label: fund.name,
              value: fund.object_id,
            })) ?? []
          }
          onChange={(v) => {
            const value = v as string;

            setFund(
              funds?.find((fund) => fund.object_id === value) ?? funds?.[0]
            );
          }}
        />
        <FundStatus fund={fund} />
      </Flex>

      <FundAllocationHolding fund={fund} />
      <TitleTemplate title="It's time to trade" full />
      <MainButton
        style={{
          fontWeight: "bold",
          fontSize: "24px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          padding: "20px",
          backgroundColor: "rgba(65, 0, 150, 1)",
          alignSelf: "center",
          borderRadius: 40,
        }}
        onClick={() => {
          router.push("/trade");
        }}
      >
        Go Trade, Good Luck
      </MainButton>
      {/* <FundAllocationFarming fund={fund} /> */}
    </Flex>
  );
};

export default Page;
