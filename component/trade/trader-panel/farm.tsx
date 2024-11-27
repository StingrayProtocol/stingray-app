import { Flex, Image, Text } from "@/styled-antd";
import TokenInput from "./token-input";
import MainButton from "@/common/main-button";
import { useState } from "react";
import useScallopDeposit from "@/application/mutation/use-scallop-deposit";
import useBucketDeposit from "@/application/mutation/use-bucket-deposit";
import useSuilendDeposit from "@/application/mutation/use-suilend-deposit";
import useScallopWithdraw from "@/application/mutation/use-scallop-withdraw";
import useBucketWithdraw from "@/application/mutation/use-bucket-withdraw";
import useSuilendWithdraw from "@/application/mutation/use-suilend-withdraw";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import useGetFundBalance from "@/application/query/use-get-fund-balance";
import { coins } from "@/constant/coin";

const Farm = ({
  fundId,
  name,
  powerBy,
  activeFarm,
  onActiveFarm,
  tokens,
}: {
  fundId?: string;
  name: string;
  powerBy: string;
  activeFarm: string;
  onActiveFarm: (name: string) => void;
  tokens: string[];
}) => {
  const isActived = activeFarm === name;
  const { data: balance } = useGetFundBalance({
    fundId,
  });

  const [token, setToken] = useState<string>(tokens?.[0]);
  const [amount, setAmount] = useState<string>("");

  const { data: traderCard } = useGetOwnedTraderCard();

  const { mutate: scallopDeposit, isPending: isScallopDepositing } =
    useScallopDeposit({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });
  const { mutate: bucketDeposit, isPending: isBucketDepositing } =
    useBucketDeposit({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });
  const { mutate: suilendDeposit, isPending: isSuilendDepositing } =
    useSuilendDeposit({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });
  const { mutate: scallopWithdraw, isPending: isScallopWithdrawing } =
    useScallopWithdraw({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });
  const { mutate: bucketWithdraw, isPending: isBucketWithdrawing } =
    useBucketWithdraw({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });
  const { mutate: suilendWithdraw, isPending: isSuilendWithdrawing } =
    useSuilendWithdraw({
      fundId,
      onSuccess: () => {
        setAmount("");
      },
    });

  const isDepositing =
    (isScallopDepositing || isBucketDepositing || isSuilendDepositing) &&
    isActived;
  const isWithdrawing =
    (isScallopWithdrawing || isBucketWithdrawing || isSuilendWithdrawing) &&
    isActived;

  const farmingBalance = balance
    ?.find((b) => b.name === token)
    ?.farmings?.find((f) => f.protocol === name)?.value;

  const reStakeAmount =
    Number(farmingBalance) *
      Math.pow(10, coins.find((c) => c.name === token)?.decimal ?? 9) -
    Number(amount) *
      Math.pow(10, coins.find((c) => c.name === token)?.decimal ?? 9);

  const isWithdrawInSuffient = reStakeAmount < 0 || isNaN(reStakeAmount);
  const isDepositInsuffient =
    Number(amount) > Number(balance?.find((b) => b.name === token)?.value);
  const isAmountInvalid = isNaN(Number(amount)) || Number(amount) === 0;

  return (
    <Flex
      style={{
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        maxHeight: isActived ? "500px" : "80px",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
      align="center"
      vertical
    >
      <Flex
        style={{
          padding: isActived ? 0 : 8,
          display: isActived ? "none" : "flex",
          cursor: "pointer",
          width: "100%",
          zIndex: 1,
        }}
        justify="center"
        onClick={() => {
          onActiveFarm(name);
        }}
      >
        <Image
          preview={false}
          width={name === "Bucket" ? 130 : 150}
          src={powerBy}
          alt={name}
        />
      </Flex>
      <Flex
        vertical
        gap="small"
        align="center"
        style={{
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingTop: isActived ? "32px" : "0px",
          paddingBottom: isActived ? "32px" : "0px",
          opacity: isActived ? 1 : 0,
          height: isActived ? "100%" : "0px",
          width: "100%",
          zIndex: isActived ? 0 : -1,
        }}
      >
        <Flex align="center">
          <Text>Power By</Text>
          <Image
            preview={false}
            width={name === "Bucket" ? 130 : 150}
            src={powerBy}
            alt={name}
          />
        </Flex>

        <TokenInput
          protocol={name}
          balance={balance}
          amount={amount}
          token={token}
          tokens={tokens}
          onSelectToken={(value) => {
            setToken(value);
          }}
          onChangeValue={(value) => {
            setAmount(value);
          }}
        />

        <Flex
          align="center"
          justify="center"
          gap="small"
          style={{
            marginTop: "20px",
          }}
        >
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
            onClick={() => {
              if (!traderCard?.object_id || !fundId) {
                return;
              }
              if (name === "Scallop") {
                scallopDeposit({
                  amount,
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                });
              } else if (name === "Bucket") {
                const hasDeposit =
                  (balance?.find((b) => b.name === token)?.farmings?.length ??
                    0) > 0;

                const buckAmount = balance
                  ?.find((b) => b.name === token)
                  ?.farmings.reduce((acc, cur) => {
                    return acc + Number(cur.value);
                  }, 0);

                bucketDeposit({
                  amount,
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                  hasDeposit,
                  originalAmount: buckAmount,
                });
              } else if (name === "Suilend") {
                suilendDeposit({
                  amount,
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                });
              }
            }}
            loading={isDepositing}
            disabled={
              isDepositing ||
              isWithdrawing ||
              isAmountInvalid ||
              isDepositInsuffient
            }
          >
            Deposit
          </MainButton>
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
            onClick={() => {
              if (!traderCard?.object_id || !fundId) {
                return;
              }
              const farmings = balance?.find((b) => b.name === token)?.farmings;
              if (name === "Scallop") {
                const liquidityAmount = farmings
                  ?.find((f) => f.protocol === "Scallop")
                  ?.liquidityValue.toString();
                if (!liquidityAmount) {
                  return;
                }

                scallopWithdraw({
                  // liquidityAmount: Number(liquidityAmount) - 1,
                  liquidityAmount: Number(liquidityAmount),
                  reStakeAmount,
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                });
              } else if (name === "Bucket") {
                const liquidityAmount = farmings
                  ?.find((f) => f.protocol === "Bucket")
                  ?.liquidityValue.toString();

                if (!liquidityAmount) {
                  return;
                }

                bucketWithdraw({
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                  reStakeAmount,
                });
              } else if (name === "Suilend") {
                const liquidityAmount = farmings
                  ?.find((f) => f.protocol === "Suilend")
                  ?.liquidityValue.toString();
                if (!liquidityAmount) {
                  return;
                }
                suilendWithdraw({
                  // liquidityAmount: Number(liquidityAmount) - 1,
                  liquidityAmount: Number(liquidityAmount),
                  reStakeAmount,
                  name: token,
                  traderId: traderCard?.object_id,
                  fundId,
                });
              }
            }}
            loading={isWithdrawing}
            disabled={
              isWithdrawing ||
              isDepositing ||
              isAmountInvalid ||
              isWithdrawInSuffient
            }
          >
            Withdraw
          </MainButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Farm;
