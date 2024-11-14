import { coins } from "@/constant/coin";
import { Flex, Image, Input, Select, Text } from "@/styled-antd";
import { FundBalance } from "@/type";
import { Skeleton } from "antd";

const TokenInput = ({
  protocol,
  balance,
  isInputLoading,
  isSwap,
  tokens,
  token,
  amount,
  onSelectToken,
  onChangeValue,
}: {
  protocol?: string;
  balance?: FundBalance;
  isInputLoading?: boolean;
  isSwap?: boolean;
  isSwapOut?: boolean;
  tokens: string[];
  token?: string;
  amount: string;
  onSelectToken?: (name: string) => void;
  onChangeValue?: (value: string) => void;
}) => {
  const tokenBalance = balance?.find((b) => b.name === token);
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
              const tokenBalance = balance?.find((b) => b.name === token);
              if (token && tokenBalance) {
                onChangeValue?.(tokenBalance.value.toString());
              } else {
                onChangeValue?.("");
              }
            }}
          >
            MAX
          </Text>
          <Flex
            style={{
              position: "relative",
            }}
          >
            <Skeleton.Input
              style={{
                display: isInputLoading ? "block" : "none",
                width: "100%",
                transition: "all 0.2s",
                position: "absolute",
                top: 3,
                left: 10,
              }}
              active
            />
            <Input
              value={amount}
              style={{
                opacity: isInputLoading ? 0 : 1,
                fontSize: "24px",
                fontWeight: "bold",
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none",
                paddingTop: 0,
                paddingBottom: 0,
                transition: "all 0.2s",
              }}
              onChange={(e) => {
                onChangeValue?.(e.target.value);
              }}
              placeholder="0"
            />
          </Flex>

          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.5)",
              paddingLeft: 12,
            }}
          >
            Balance: {tokenBalance?.value}
          </Text>
        </Flex>
        <Flex
          vertical
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          gap="4px"
        >
          <Select
            value={token}
            style={{ width: 150, borderRadius: 40 }}
            size="large"
            dropdownStyle={{ background: "#2a0067" }}
            onChange={(v: unknown) => {
              const value = v as string;
              onSelectToken?.(value);
              onChangeValue?.("");
            }}
            options={tokens?.map((token) => ({
              label: token,
              value: token,
            }))}
            suffixIcon={
              <Image
                preview={false}
                src={coins?.find((coin) => coin.name === token)?.iconUrl}
                width={24}
                height={24}
                style={{ borderRadius: "50%", overflow: "hidden" }}
              />
            }
            optionRender={(option) => (
              <Flex gap="small">
                <Image
                  preview={false}
                  src={
                    coins?.find((coin) => coin.name === option.label)?.iconUrl
                  }
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%", overflow: "hidden" }}
                />
                <Text style={{ color: "white" }}>{option.label}</Text>
              </Flex>
            )}
          />
          {!isSwap && (
            <Text
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              Farming{" "}
              {tokenBalance?.farmings.find(
                (farming) => farming.protocol === protocol
              )?.value ?? 0}{" "}
              {tokenBalance?.name}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TokenInput;
