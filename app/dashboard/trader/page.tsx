"use client";
import FundAllocationFarming from "@/component/dashboard/funder/fund-allocation-farming";
import FundAllocationHolding from "@/component/dashboard/funder/fund-allocation-holding";
import FundStatus from "@/component/dashboard/funder/fund-status";
import { Flex } from "@/styled-antd";
import React from "react";

const Page = () => {
  return (
    <Flex
      vertical
      gap="large"
      style={{
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <FundStatus />
      <FundAllocationHolding />
      <FundAllocationFarming />
    </Flex>
  );
};

export default Page;
