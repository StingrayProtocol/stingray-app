import { Flex, Tabs, Text } from "@/styled-antd";
import React, { useState } from "react";

const Pools = () => {
  const [activeKey, setActiveKey] = useState("Arena");
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
      children: <div>Content of Tab Pane 1</div>,
    },
    {
      key: "funding",
      label: <Label name={"funding"}>Funding</Label>,
      children: <></>,
    },
    {
      key: "running",
      label: <Label name={"running"}>Running</Label>,
      children: <div>Content of Tab Pane 1</div>,
    },
  ];
  return (
    <Flex style={{}}>
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
