import useGetBalance from "@/application/use-get-balance";
import { formatPrice } from "@/common";
import { Flex, Input, Text } from "@/styled-antd";
import { Skeleton } from "antd";
import { useState } from "react";

const FundTokenInput = ({
  total,
  action,
}: {
  total: number;
  action: "add" | "remove";
}) => {
  const [amount, setAmount] = useState<string>(); //
  const balance = useGetBalance();
  const isLoading = isNaN(Number(balance));

  const Current = () => {
    return (
      <Text
        style={{
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        Current In Fund: {total.toFixed(9).replace(/\.?0+$/, "")} SUI
      </Text>
    );
  };

  const Balance = () => {
    return (
      <>
        {isLoading && <Skeleton.Input active />}
        {!isLoading && (
          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 1)",
              paddingLeft: 12,
            }}
          >
            Balance: {formatPrice(Number(balance))}
          </Text>
        )}
      </>
    );
  };
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
              setAmount(
                action === "add" ? balance.toString() : total.toString()
              );
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
          {action === "add" ? <Balance /> : <Current />}
        </Flex>

        <Flex
          vertical
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            alignSelf: "flex-end",
          }}
          gap="4px"
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            SUI
          </Text>
          {action === "add" ? <Current /> : <Balance />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FundTokenInput;
