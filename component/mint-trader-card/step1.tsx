// import useGetOwnedSuiNS from "@/application/use-get-owned-sui-ns";
import { getAnimationStyle } from "@/common/animation-style";
import ConnectButton from "@/common/connect-button";
import { Flex } from "@/styled-antd";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";

const Step1 = ({
  step,
  onConfirm,
}: {
  step: number;
  onConfirm: () => void;
}) => {
  const account = useCurrentAccount();
  useEffect(() => {
    if (account?.address) {
      onConfirm();
    }
  }, [account]);
  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...getAnimationStyle(0, step),
      }}
    >
      <Flex
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(120, 0, 255, 0.2)",
          borderRadius: "40px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
        vertical
        align="center"
        justify="center"
      >
        <ConnectButton />
      </Flex>
    </Flex>
  );
};

export default Step1;
