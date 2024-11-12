import { formatPrice } from "@/common";
import { Flex, Text, Title } from "@/styled-antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundAllocationFarming = () => {
  const data = [
    {
      name: "Token Fund in Farming:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {Intl.NumberFormat().format(10000)} SUI
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Current Token Value:",
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
      name: "Realized Profit & Loss:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>{7} Days</DataDescription>
        </Flex>
      ),
    },
    {
      name: "Estimated ROI by Token Farming:",
      value: (
        <Flex gap="small">
          <CalendarOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>3D 5H</DataDescription>
        </Flex>
      ),
    },
  ];
  const assets = [
    {
      name: "SUI",
      value: 10000,
    },
    {
      name: "USDT",
      value: 10000,
    },
    {
      name: "SCA",
      value: 10000,
    },
    {
      name: "BUCK",
      value: 0,
    },
    {
      name: "DEEP",
      value: 0,
    },
    {
      name: "SUI",
      value: 10000,
    },
    {
      name: "USDT",
      value: 10000,
    },
    {
      name: "SCA",
      value: 10000,
    },
    {
      name: "BUCK",
      value: 0,
    },
    {
      name: "DEEP",
      value: 0,
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
      <Flex vertical>
        <Title>Fund Allocation</Title>
        <Text
          style={{
            fontSize: "32px",
          }}
        >
          Holding Position
        </Text>
      </Flex>
      <Flex>
        <Flex
          flex="1"
          vertical
          gap="small"
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
        <Flex
          style={{
            padding: 20,
            border: "1px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
            minWidth: "500px",
            backgroundColor: "rgba(45, 0, 97, 0.8)",
          }}
        >
          <Flex
            vertical
            gap="small"
            style={{
              width: "100%",
              padding: 4,
              overflow: "auto",
              height: "450px",
            }}
          >
            {assets.map((item, index) => (
              <Flex
                key={index}
                style={{
                  padding: 20,
                  backgroundColor: "rgba(80, 2, 155, 1)",
                  borderRadius: "10px",
                  width: "100%",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                }}
                align="center"
                justify="space-between"
              >
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {formatPrice(item.value)}
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FundAllocationFarming;
