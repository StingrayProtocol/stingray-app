"use client";
import MainButton from "@/common/main-button";
import FundOverview from "@/component/dashboard/investor/fund-overview";
import FundPanel from "@/component/dashboard/investor/fund-panel";
import TitleTemplate from "@/component/title-tempplate/title-template";
import { Button, Flex } from "@/styled-antd";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
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
      <TitleTemplate title="Liquid ur assets" full />
      <MainButton
        style={{
          fontWeight: "bold",
          fontSize: "24px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          padding: "20px",
          backgroundColor: "rgba(65, 0, 150, 1)",
          alignSelf: "center",
          borderRadius: "40px",
        }}
        onClick={() => {
          router.push("/pools");
        }}
      >
        Check Pools
      </MainButton>
    </Flex>
  );
};

export default Page;
