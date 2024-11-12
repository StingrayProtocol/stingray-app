import { Flex, Text, Title } from "@/styled-antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { formatPrice } from "@/common";

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundStatus = () => {
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
          <DataDescription>{formatPrice(10000)} SUI</DataDescription>
        </Flex>
      ),
    },
    {
      name: "Funds Not Yet Invested:",
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
      name: "Operation Time Remaining:",
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
      name: "Estimated ROI by Token Swap:",
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
            <Pie
              height={300}
              width={300}
              colorField="type"
              data={[
                {
                  type: "Funded Amount",
                  value: 10000,
                },
                {
                  type: "Funds Not Yet Invested",
                  value: 2500,
                },
              ]}
              angleField="value"
              legend={null}
              style={{
                fill: ({ type }: { type: string }) => {
                  if (type === "Funded Amount") {
                    return "rgba(120, 0, 255)";
                  }
                  return "rgba(200, 120, 255)";
                },
              }}
            />
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
