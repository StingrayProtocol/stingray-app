import useGetTraderCard from "@/application/query/use-get-trader-card";
import { formatSuiPrice, getRelativeTime } from "@/common";
import TraderInfo from "@/common/trader-info";
import FundCard from "@/component/fund-card";
import FundPieChart from "@/component/fund-pie-chart";
import { coins } from "@/constant/coin";
import { Flex, Text, Title, Tooltip } from "@/styled-antd";
import { Fund } from "@/type";
import { DollarOutlined } from "@ant-design/icons";
import FundHistory from "./fund-history";
import useGetPositionValue from "@/application/query/use-get-position-value";
import MainButton from "@/common/main-button";
import useTradeBackToSui from "@/application/mutation/use-trade-back-to-sui";
import useSettle from "@/application/mutation/use-settle";
import useGetFundHistory from "@/application/query/use-get-fund-history";
import { Skeleton } from "antd";

const Running = ({ fund }: { fund?: Fund }) => {
  const { data: traderCard } = useGetTraderCard({
    address: fund?.owner_id,
  });

  const { data: history } = useGetFundHistory({
    fundId: fund?.object_id,
  });
  const total = history?.length
    ? history.reduce((acc, cur) => {
        acc =
          cur.action === "Invested"
            ? acc + Number(cur.amount)
            : acc - Number(cur.amount);
        return acc;
      }, 0)
    : 0;

  const { mutate: tradeBack, isPending: isTradingBack } = useTradeBackToSui({
    fundId: fund?.object_id,
  });

  const { mutate: settle, isPending: isSettling } = useSettle({
    fundId: fund?.object_id,
  });

  const fundStatuses = [
    {
      label: "Target Funded Amount",
      value: formatSuiPrice(Number(fund?.limit_amount) ?? 0),
    },
    {
      label: "Current Funded Amount",
      value: formatSuiPrice(total ?? 0),
    },
  ];

  const fundInfo = [
    {
      label: "Total Profit Share",
      value: fund?.trader_fee,
    },
    {
      label: "Expected ROI",
      value: fund?.expected_roi,
    },
  ];

  const { data: positionValue, isPending: isGettingPositionValue } =
    useGetPositionValue({
      fundId: fund?.object_id,
    });

  const positions = [
    {
      name: "SUI",
      value: positionValue?.percent?.sui,
      color: "rgba(120, 0, 205, 1)",
    },
    {
      name: "Trading",
      value: positionValue?.percent?.trading,
      color: "rgba(100, 0, 225, 1)",
    },
    {
      name: "Farming",
      value: positionValue?.percent?.farming,
      color: "rgba(80, 0, 245, 1)",
    },
  ];

  const tradeLogs = fund?.trader_operation.sort((a, b) => {
    if (Number(b.timestamp) - Number(a.timestamp) > 0) {
      return 1;
    } else if (Number(b.timestamp) - Number(a.timestamp) < 0) {
      return -1;
    } else {
      return Number(b.event_seq) - Number(a.event_seq);
    }
  });

  const canSettle = (positionValue?.percent?.sui ?? 0) > 99.9;

  return (
    <Flex gap="large" vertical>
      <Flex
        style={{
          backgroundColor: "rgba(120, 0, 255, 0.2)",
          padding: "24px",
          margin: "20px",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
        gap="large"
      >
        <FundCard fund={fund} card={false} />
        <Flex
          vertical
          gap="middle"
          style={{
            width: "100%",
          }}
        >
          <Flex
            vertical
            gap="large"
            style={{
              padding: "24px",
              background: "rgba(120, 0, 255, 0.2)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <Flex justify="space-between" align="center">
              <Title style={{ fontSize: "24px", fontWeight: "bold" }}>
                Fund Status
              </Title>
              <Flex gap="8px">
                <MainButton
                  loading={isTradingBack || isGettingPositionValue}
                  size="small"
                  onClick={() => {
                    tradeBack({
                      fundId: fund?.object_id,
                      traderId: traderCard?.object_id,
                    });
                  }}
                >
                  Swap All to SUI
                </MainButton>
                <Tooltip
                  overlayInnerStyle={{
                    background: "#2a0067",
                  }}
                  arrow={false}
                  title={
                    <Text>
                      You can only settle when your SUI position is more than
                      99.9%
                    </Text>
                  }
                >
                  <MainButton
                    loading={isSettling || isGettingPositionValue}
                    size="small"
                    disabled={!canSettle}
                    onClick={() => {
                      settle({
                        fundId: fund?.object_id,
                        initShareId: fund?.fund_history.sort(
                          (a, b) => Number(a.timestamp) - Number(b.timestamp)
                        )[0].share_id,
                      });
                    }}
                  >
                    Settle
                  </MainButton>
                </Tooltip>
              </Flex>
            </Flex>

            <Flex gap="middle">
              {fundStatuses.map((fundStatus) => (
                <Flex vertical gap="small" key={fundStatus.label} flex="1">
                  <Text>{fundStatus.label}</Text>
                  <Flex
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    }}
                    justify="space-between"
                    align="center"
                  >
                    <Flex gap="middle" align="center">
                      <DollarOutlined
                        style={{
                          fontSize: "32px",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                        }}
                      >
                        {fundStatus.value}
                      </Text>
                    </Flex>
                    <Text
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      SUI
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
            <Flex gap="middle">
              <Flex
                flex={1}
                style={{
                  width: "100%",
                }}
                vertical
                gap="small"
                justify="start"
              >
                <Flex justify="space-between">
                  {positions.map((position) => (
                    <Flex key={position.name} flex={1} align="center" gap="8px">
                      <Text
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {position.name}
                      </Text>
                      <div
                        style={{
                          background: position.color,
                          height: "16px",
                          width: "16px",
                          borderRadius: "50%",
                        }}
                      />
                    </Flex>
                  ))}
                </Flex>

                <Flex>
                  {positions.map((position) => (
                    <div
                      key={position.name}
                      style={{
                        width: `${parseInt(
                          position.value?.toString() ?? "0"
                        )}%`,
                        background: position.color,
                        height: "20px",
                        borderRadius: "20px",
                      }}
                    />
                  ))}
                </Flex>
                {isGettingPositionValue && (
                  <Skeleton.Input
                    style={{
                      width: "100%",
                      height: "20px",
                    }}
                    active
                  />
                )}
              </Flex>
              <Flex flex={1} gap="small">
                {fundInfo.map((fundStatus) => (
                  <Flex vertical gap="small" key={fundStatus.label} flex="1">
                    <Text
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {fundStatus.label}
                    </Text>
                    <Flex
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                      }}
                      justify="space-between"
                      align="center"
                    >
                      <Text
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                        }}
                      >
                        {fundStatus.value}%
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            gap="middle"
            style={{
              height: "240px",
            }}
          >
            <Flex
              vertical
              gap="middle"
              style={{
                padding: "24px",
                background: "rgba(120, 0, 255, 0.2)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                width: "100%",
              }}
            >
              <Title style={{ fontSize: "24px", fontWeight: "bold" }}>
                Fund Logs
              </Title>
              <Flex
                style={{
                  overflow: "auto",
                  width: "100%",
                }}
                vertical
                gap="small"
              >
                {tradeLogs?.map((log) => {
                  const tokenType =
                    log.action === "Deposit" ? log.token_in : log.token_out;
                  const coin = coins.find(
                    (coin) => coin.typename === `0x${tokenType}`
                  );
                  const traderAmount =
                    log.action === "Deposit"
                      ? -Number(log.amount_in) / 10 ** (coin?.decimal ?? 9)
                      : +Number(log.amount_out) / 10 ** (coin?.decimal ?? 9);
                  return (
                    <Tooltip
                      key={log.id}
                      overlayInnerStyle={{
                        background: "#2a0067",
                      }}
                      arrow={false}
                      title={getRelativeTime(Number(log.timestamp))}
                    >
                      <Flex
                        style={{
                          width: "100%",
                        }}
                        justify="space-between"
                        align="center"
                      >
                        <Flex gap="large" align="center">
                          <TraderInfo traderCard={traderCard} />
                          <Text>{log.action}</Text>
                        </Flex>
                        <Text>
                          {Number(traderAmount) > 0 ? "+" : ""}
                          {traderAmount} {coin?.name}
                        </Text>
                      </Flex>
                    </Tooltip>
                  );
                })}
                <FundHistory history={history} />
              </Flex>
            </Flex>
            <Flex
              align="center"
              style={{
                background: "rgba(120, 0, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                minWidth: "240px",
                borderRadius: "8px",
                padding: "24px",
                position: "relative",
              }}
              vertical
            >
              <Title style={{ fontSize: "24px", fontWeight: "bold" }}>
                UR SHARE%
              </Title>

              <Flex
                align="center"
                justify="center"
                style={{
                  marginTop: "20px",
                  width: "150px",
                  height: "150px",
                  background: "rgba(120, 0, 255, 0.2)",
                  borderRadius: "50%",
                }}
              >
                <FundPieChart fund={fund} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Running;
