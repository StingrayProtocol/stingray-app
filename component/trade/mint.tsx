"use client";

import { Flex, Steps } from "@/styled-antd";
import { useEffect, useState } from "react";
import Step2 from "../mint-trader-card/step2";
import Step3 from "../mint-trader-card/step3";
import Step4 from "../mint-trader-card/step4";
import Step1 from "../mint-trader-card/step1";
import { useCurrentAccount } from "@mysten/dapp-kit";

const MintPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [suiNS, setSuiNS] = useState<{
    id: string;
    name: string;
    image_url: string;
  }>();
  const [intro, setIntro] = useState("");
  const account = useCurrentAccount();
  useEffect(() => {
    if (account?.address) {
      setCurrentStep(1);
    }
  }, [account]);
  const steps = [
    {
      title: "Step 1",
      description: "Connect Wallet",
    },
    {
      title: "Step 2",
      description: "Select your SuiNS",
    },
    {
      title: "Step 3",
      description: "Enter Trader Info",
    },
    {
      title: "Step 4",
      description: "Mint with 1 SUI",
    },
  ];
  console.log(suiNS);
  return (
    <Flex
      style={{
        paddingLeft: "0px",
        paddingRight: "0px",
        padding: 20,
        paddingTop: "32px",
        paddingBottom: "32px",
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        height: "768px",
      }}
      align="center"
    >
      <Flex
        style={{
          width: "400px",
          height: "50%",
          padding: 20,
          alignSelf: "flex-start",
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
          onConfirm={() => {
            setCurrentStep(currentStep + 1);
          }}
        />
        <Step2
          step={currentStep}
          onConfirm={({ id, name, image_url }) => {
            setSuiNS({
              id,
              name,
              image_url,
            });
            console.log(suiNS);
            setCurrentStep(currentStep + 1);
          }}
        />
        <Step3
          step={currentStep}
          suiNS={suiNS}
          onConfirm={({ intro }) => {
            setIntro(intro);
            setCurrentStep(currentStep + 1);
          }}
        />
        <Step4 step={currentStep} intro={intro} suiNS={suiNS} />
      </Flex>
    </Flex>
  );
};

export default MintPage;
