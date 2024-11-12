import { Flex, Text, Title } from "@/styled-antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { formatPrice } from "@/common";
import PieChart from "@/component/fund-pie-chart";

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundOverview = () => {
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
          <DataDescription>{formatPrice(10000)} SUI</DataDescription>
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
          <DataDescription>{formatPrice(2500)} SUI</DataDescription>
        </Flex>
      ),
    },
    {
      name: "Current Invested Strategies:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>+{556}</DataDescription>
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
          <DataDescription>+{35}%</DataDescription>
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
            {/* <PieChart /> */}
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
