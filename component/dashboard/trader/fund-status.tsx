import { Flex, Text, Title } from "@/styled-antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { formatSuiPrice, getDHMS } from "@/common";
import TradePieChart from "@/component/trade-pie-chart";
import { Fund } from "@/type";
import CountDown from "@/component/count-down";
import useGetPositionValue from "@/application/query/use-get-position-value";

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundStatus = ({ fund }: { fund?: Fund }) => {
  const total = fund?.fund_history?.length
    ? fund?.fund_history.reduce((acc, cur) => {
        acc =
          cur.action === "Invested"
            ? acc + Number(cur.amount)
            : acc - Number(cur.amount);
        return acc;
      }, 0)
    : 0;

  const { data: positionValue } = useGetPositionValue({
    fundId: fund?.object_id,
  });
  console.log(positionValue);
  console.log((positionValue?.farming ?? 0) + (positionValue?.trading ?? 0));
  const data = [
    {
      name: "Funded Amount:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>{formatSuiPrice(total ?? 0)} SUI</DataDescription>
        </Flex>
      ),
    },
    {
      name: "Trading + Farming Position:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {((positionValue?.farming ?? 0) + (positionValue?.trading ?? 0))
              .toFixed(9)
              .replace(/\.?0+$/, "")}{" "}
            SUI
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Operation Agreement:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {getDHMS(
              Number(fund?.end_time) -
                Number(fund?.start_time) +
                Number(fund?.invest_duration)
            )}
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Operation Time Remaining:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            <CountDown timestamp={Number(fund?.end_time)} />
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
      <Title>Fund Status</Title>
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
            <TradePieChart fund={fund} />
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

export default FundStatus;
