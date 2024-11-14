"use client";
import useGetOwnedFund from "@/application/query/use-get-owned-fund";
import FundAllocationHolding from "@/component/dashboard/trader/fund-allocation-holding";
import FundStatus from "@/component/dashboard/trader/fund-status";
import { Flex, Select } from "@/styled-antd";
import { Fund } from "@/type";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [fund, setFund] = useState<Fund>();
  const { data: funds } = useGetOwnedFund();
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
      {/* <FundAllocationFarming fund={fund} /> */}
    </Flex>
  );
};

export default Page;
