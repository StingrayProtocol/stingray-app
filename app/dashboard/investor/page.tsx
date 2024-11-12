"use client";
import FundOverview from "@/component/dashboard/investor/fund-overview";
import FundPanel from "@/component/dashboard/investor/fund-panel";
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
      <FundOverview />
      <FundPanel />
    </Flex>
  );
};

export default Page;
