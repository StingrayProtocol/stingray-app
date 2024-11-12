import useGetBalance from "@/application/use-get-balance";
import { formatPrice } from "@/common";
import { Flex, Input, Text } from "@/styled-antd";
import { useState } from "react";

const FundTokenInput = () => {
  const [amount, setAmount] = useState<string>(); //
  const balance = useGetBalance();
  return (
    <Flex
      gap="middle"
      style={{
        backgroundColor: "rgba(150, 0, 255, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        padding: 4,
        borderRadius: 16,
        width: "100%",
      }}
    >
      <Flex
        style={{
          width: "100%",
          padding: 8,
        }}
        justify="space-between"
        align="center"
      >
        <Flex vertical gap="4px">
          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 1)",
              paddingLeft: 12,
              width: 40,
              cursor: "pointer",
            }}
            onClick={() => {
              setAmount(balance.toString());
            }}
          >
            MAX
          </Text>
          <Input
            value={amount}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              paddingTop: 0,
              paddingBottom: 0,
            }}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="0.0"
          />
          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 1)",
              paddingLeft: 12,
            }}
          >
            Balance: {formatPrice(Number(balance))}
          </Text>
        </Flex>

        <Flex
          align="center"
          style={{
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            SUI
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FundTokenInput;
