import { formatPrice } from "@/common";
import { Flex, Input, Select, Text } from "@/styled-antd";
import { useRef, useState } from "react";

const TokenInput = ({ isSwap }: { isSwap?: boolean }) => {
  const inputRef = useRef(null);
  const [token, setToken] = useState(""); //
  const [amount, setAmount] = useState<string>(); //
  const balance = 1000;
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
        align={isSwap ? "center" : "flex-end"}
      >
        <Flex vertical gap="4px">
          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.5)",
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
              color: "rgba(255, 255, 255, 0.5)",
              paddingLeft: 12,
            }}
          >
            Balance: {formatPrice(balance)}
          </Text>
        </Flex>
        <Flex
          vertical
          style={{
            justifyContent: "flex-end",
          }}
          gap="4px"
        >
          <Text />

          <Select
            defaultValue="lucy"
            style={{ width: 150, borderRadius: 40 }}
            size="large"
            dropdownStyle={{ background: "#2a0067" }}
            onChange={() => {}}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          {!isSwap && (
            <Text
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Farming 500 USDC
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TokenInput;
