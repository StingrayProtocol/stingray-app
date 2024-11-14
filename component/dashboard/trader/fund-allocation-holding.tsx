import useGetFundBalance from "@/application/query/use-get-fund-balance";
import useGetPositionValue from "@/application/query/use-get-position-value";
import { coins } from "@/constant/coin";
import { Flex, Image, Text, Title } from "@/styled-antd";
import { Fund } from "@/type";
import {
  DollarCircleOutlined,
  FundProjectionScreenOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const TokenPosition = ({ value, name }: { value: string; name: string }) => {
  const iconUrl = coins.find((coin) => coin.name === name)?.iconUrl;
  return (
    <Flex
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
        {value}
      </Text>
      <Flex align="center" gap="small">
        <Image
          preview={false}
          width={20}
          height={20}
          src={iconUrl}
          alt={name}
        />
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
      </Flex>
    </Flex>
  );
};

const DataTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "12px" }}>{children}</Text>
);

const DataDescription = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: "36px", fontWeight: "bold" }}>{children}</Text>
);

const FundAllocationHolding = ({ fund }: { fund?: Fund }) => {
  const { data: balances } = useGetFundBalance({
    fundId: fund?.object_id,
  });
  const { data: positionValue } = useGetPositionValue({
    fund,
  });

  const total = (
    (fund?.fund_history.reduce(
      (acc, history) => acc + Number(history.amount),
      0
    ) ?? 0) / Math.pow(10, 9)
  )
    ?.toFixed(9)
    .replace(/\.?0+$/, "");

  const data = [
    {
      name: "Inital Token Value:",
      value: (
        <Flex gap="small">
          <DollarCircleOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>{total} SUI</DataDescription>
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
          <DataDescription>
            {(
              Number(positionValue?.trading ?? 0) +
              Number(positionValue?.farming ?? 0) +
              Number(positionValue?.sui ?? 0)
            )
              ?.toFixed(9)
              .replace(/\.?0+$/, "")}{" "}
            SUI
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Realized Profit & Loss:",
      value: (
        <Flex gap="small">
          <FundProjectionScreenOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {(
              Number(positionValue?.trading ?? 0) +
              Number(positionValue?.farming ?? 0) +
              Number(positionValue?.sui ?? 0) -
              (Number(total) ?? 0)
            ).toFixed(9)}
            SUI
          </DataDescription>
        </Flex>
      ),
    },
    {
      name: "Estimated ROI:",
      value: (
        <Flex gap="small">
          <RocketOutlined
            style={{
              fontSize: "36px",
            }}
          />
          <DataDescription>
            {(
              ((Number(positionValue?.trading ?? 0) +
                Number(positionValue?.farming ?? 0) +
                Number(positionValue?.sui ?? 0) -
                (Number(total) ?? 0)) /
                (Number(total) ?? 0)) *
              100
            ).toFixed(2)}
            %
          </DataDescription>
        </Flex>
      ),
    },
  ];

  const swapPositions = balances?.filter(
    (balance) => Number(balance?.value) > 0
  );

  const farmingPositions = balances?.filter(
    (balance) => balance?.farmings.length > 0
  );

  return (
    <Flex
      id={"FundAllocationHolding"}
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
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                display: swapPositions?.length ? "block" : "none",
              }}
            >
              Swap
            </Text>
            {swapPositions?.map((balance, index) => (
              <TokenPosition
                key={balance.name}
                value={Number(balance?.value)
                  ?.toFixed(balance?.decimal)
                  .replace(/\.?0+$/, "")}
                name={balance.name}
              />
            ))}
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                display: farmingPositions?.length ? "block" : "none",
              }}
            >
              Farm
            </Text>
            {farmingPositions?.map((balance, index) => (
              <TokenPosition
                key={index}
                value={(
                  balance.farmings.reduce(
                    (acc, farming) => acc + Number(farming.value),
                    0
                  ) ?? 0
                )
                  ?.toFixed(balance.decimal)
                  .replace(/\.?0+$/, "")}
                name={balance.name}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FundAllocationHolding;
