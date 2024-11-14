"use client";
import Pools from "@/component/pool";
import { Flex } from "@/styled-antd";

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
      <Pools />
    </Flex>
  );
};

export default Page;
