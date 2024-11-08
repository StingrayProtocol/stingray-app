"use client";

import Step1 from "@/component/step1";
import Step2 from "@/component/step2";
import { Flex, Steps } from "@/styled-antd";
import { useState } from "react";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [suiNS, setSuiNS] = useState("");
  const [intro, setIntro] = useState("");
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
  console.log(intro);
  return (
    <Flex
      style={{
        padding: 20,
        height: "100vh",
      }}
      gap="large"
    >
      <Flex
        style={{
          width: "400px",
          height: "50%",
          padding: 20,
        }}
      >
        <Steps current={currentStep} direction="vertical">
          {steps.map((item, i) => (
            <Steps.Step
              key={i}
              title={item.title}
              description={item.description}
            />
          ))}
        </Steps>
      </Flex>

      <Flex
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Step1
          step={currentStep}
          onConfirm={({ suiNS }) => {
            setSuiNS(suiNS);
            console.log(suiNS);
            setCurrentStep(currentStep + 1);
          }}
        />
        <Step2
          step={currentStep}
          suiNS={suiNS}
          onConfirm={({ intro }) => {
            setIntro(intro);
            setCurrentStep(currentStep + 1);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default Page;
