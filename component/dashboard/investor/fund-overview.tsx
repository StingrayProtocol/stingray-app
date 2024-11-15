import { Flex, Image, Text, Title } from "@/styled-antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { formatSuiPrice } from "@/common";
import useGetBalance from "@/application/use-get-balance";
import useGetInvestFund from "@/application/query/use-get-invest-fund";
import stingray from "@/public/Stingray-White.png";
import { useMemo } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import BalancePieChart from "@/component/balance-pie-chart";
import CountDown from "@/component/count-down";

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundOverview = () => {
  const balance = useGetBalance();
  const { data: funds } = useGetInvestFund();
  const account = useCurrentAccount();
  const allFunds = [...(funds?.fundings ?? []), ...(funds?.runnings ?? [])];

  const totalInvestedAmount = useMemo(() => {
    return allFunds.reduce((acc, fund) => {
      const historyTotal = fund.fund_history
        .filter((history) => history.investor === account?.address)
        .reduce((_acc, history) => _acc + Number(history.amount), 0);
      return acc + historyTotal;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, funds]);

  const totalInvestFunds = useMemo(() => {
    return allFunds.reduce((acc, fund) => {
      const hasPosition = fund.fund_history.some(
        (history) => history.investor === account?.address
      );
      if (hasPosition) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds, account?.address]);

  const shortestAgreement = useMemo(() => {
    return Math.min(
      ...allFunds
        ?.filter((fund) => Number(fund?.end_time) > Date.now())
        ?.map((fund) => Number(fund.end_time))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds]);

  console.log(shortestAgreement);
  const data = [
    {
      name: "Total Fund in Wallet:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>{balance} SUI</DataDescription>
        </Flex>
      ),
    },
    {
      name: "Current Invested in Strategy:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {formatSuiPrice(totalInvestedAmount)} SUI
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Current Invested Strategies:",
      value: (
        <Flex gap="small" align="center">
          <Image
            width={36}
            height={36}
            preview={false}
            alt="Stingray"
            src={stingray.src}
          />
          <DataDescription>{totalInvestFunds}</DataDescription>
        </Flex>
      ),
    },
    {
      name: "The Longest Agreement Remaining:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            <CountDown timestamp={shortestAgreement} />
          </DataDescription>
        </Flex>
      ),
    },
  ];
  return (
    <Flex
      vertical
      style={{
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        padding: "40px",
        margin: "20px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      }}
      gap="large"
    >
      <Title>Fund Overview</Title>
      <Flex justify="space-between">
        <Flex
          style={{
            padding: 20,
          }}
          align="center"
          justify="center"
          flex={1}
        >
          <Flex
            style={{
              padding: 20,
            }}
            align="center"
            justify="center"
          >
            <BalancePieChart funds={allFunds} />
          </Flex>
        </Flex>
        <Flex
          flex="1"
          vertical
          gap="middle"
          style={{
            padding: 20,
          }}
        >
          {data.map((item, index) => (
            <Flex key={index} vertical>
              <DataTitle>{item.name}</DataTitle>
              {item.value}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FundOverview;
