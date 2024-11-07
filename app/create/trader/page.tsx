"use client";

import { Flex, Steps } from "@/styled-antd";

const page = () => {
  const steps = [
    {
      title: "Step 1",
      description: "Select your SuiNS",
    },
    {
      title: "Step 2",
      description: "Enter Trader Info",
    },
    {
      title: "Step 3",
      description: "Mint with 10 SUI",
    },
  ];
  return (
    <Flex
      style={{
        padding: 20,
      }}
      gap="large"
    >
      <Steps current={0}>
        {steps.map((item, i) => (
          <Steps.Step
            key={i}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
      <Flex
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Flex
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          gap="large"
        >
          <Flex gap="middle">
            <h1>SuiNS</h1>
            <input type="text" />
          </Flex>
          <Flex gap="middle">
            <h1>Trader</h1>
            <input type="text" />
          </Flex>
          <button>Mint</button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default page;
