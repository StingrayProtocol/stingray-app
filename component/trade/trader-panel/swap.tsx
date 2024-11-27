import { Button, Flex, Image, Text } from "@/styled-antd";
import TokenInput from "./token-input";
import { SwapOutlined } from "@ant-design/icons";
import cetus from "@/public/partner-cetus.png";
import MainButton from "@/common/main-button";
import useCetusSwap from "@/application/mutation/use-cetus-swap";
import { CETUS_SWAP } from "@/constant/defi-data/cetus";
import { useState } from "react";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import { FundBalance } from "@/type";
import { coins } from "@/constant/coin";
import useGetQuote from "@/application/query/use-get-quote";

const Swap = ({
  fundId,
  balance,
}: {
  fundId?: string;
  balance?: FundBalance;
}) => {
  const tokens = ["SUI", ...CETUS_SWAP.map((info) => info.name)];
  const [inToken, setInToken] = useState(tokens[0]);
  const [inAmount, setInAmount] = useState("");
  const [outToken, setOutToken] = useState(tokens[1]);
  const [outAmount, setOutAmount] = useState("");
  const { data: traderCard } = useGetOwnedTraderCard();
  const { mutate: swap, isPending: isSwaping } = useCetusSwap({
    onSuccess: () => {
      setInAmount("");
      setOutAmount("");
    },
    fundId,
  });
  const inTokenDecimal =
    coins.find((coin) => coin.name === inToken)?.decimal ?? 9;
  const isInSufficient =
    Number(inAmount) * Math.pow(10, inTokenDecimal) >
    Number(balance?.find((b) => b.name === inToken)?.value ?? 0) *
      Math.pow(10, inTokenDecimal);

  const [type, setType] = useState<"in" | "out">("in");

  const inAmountValid = !isNaN(Number(inAmount)) && Number(inAmount) > 0;
  const outAmountValid = !isNaN(Number(outAmount)) && Number(outAmount) > 0;

  const amountValid = type === "in" ? inAmountValid : outAmountValid;

  const { data: price, isFetching: isQuoting } = useGetQuote({
    inToken,
    outToken,
    amount: type === "in" ? Number(inAmount) : Number(outAmount),
    type,
  });

  const outLoading =
    type === "in" &&
    isQuoting &&
    !isNaN(Number(inAmount)) &&
    Number(inAmount) > 0;

  const inLoading =
    type === "out" &&
    isQuoting &&
    !isNaN(Number(outAmount)) &&
    Number(outAmount) > 0;

  const displayPrice = !isNaN(Number(price))
    ? Number(price)
        .toFixed(
          coins.find(
            (coin) => coin.name === (type === "in" ? outToken : inToken)
          )?.decimal ?? 9
        )
        .replace(/\.?0+$/, "")
    : "";

  return (
    <Flex
      style={{
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        padding: "32px",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      }}
      vertical
      gap="middle"
      align="center"
    >
      <Flex align="center">
        <Text>Power By</Text>
        <Image preview={false} width={150} src={cetus.src} alt="Cetus" />
      </Flex>
      <TokenInput
        balance={balance}
        isSwap
        isInputLoading={inLoading}
        token={inToken}
        tokens={tokens}
        amount={type === "out" ? displayPrice : inAmount}
        onSelectToken={(name: string) => {
          if (name === outToken) {
            setOutToken(inToken);
          }
          setInToken(name);
        }}
        onChangeValue={(value) => {
          setInAmount(value);
          setType("in");
        }}
      />

      <Button
        type="text"
        style={{
          width: "36px",
        }}
        onClick={() => {
          setInToken(outToken);
          setOutToken(inToken);
          if (isNaN(Number(inAmount)) && Number(inAmount) > 0) {
            setOutAmount(inAmount);
          }

          if (isNaN(Number(outAmount)) && Number(outAmount) > 0) {
            setInAmount(outAmount);
          }
        }}
      >
        <SwapOutlined
          style={{
            fontSize: "24px",
            transform: "rotate(90deg)",
          }}
        />
      </Button>

      <TokenInput
        balance={balance}
        isSwap
        isInputLoading={outLoading}
        token={outToken}
        tokens={tokens}
        onSelectToken={(name: string) => {
          if (name === inToken) {
            setInToken(outToken);
          }
          setOutToken(name);
        }}
        amount={type === "in" ? displayPrice : outAmount}
        onChangeValue={(value) => {
          setOutAmount(value);
          setType("out");
        }}
      />
      <MainButton
        type="text"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "40px",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "20px",
        }}
        size="large"
        htmlType="submit"
        loading={isSwaping}
        disabled={
          isSwaping ||
          isInSufficient ||
          !amountValid ||
          !traderCard?.object_id ||
          isQuoting
        }
        onClick={() => {
          if (!traderCard?.object_id || !fundId) {
            return;
          }

          swap({
            traderId: traderCard?.object_id,
            fundId,
            inToken,
            inAmount,
            outToken,
          });
        }}
      >
        {isInSufficient ? "INSUFFICIENT" : "SWAP"}
      </MainButton>
    </Flex>
  );
};

export default Swap;
