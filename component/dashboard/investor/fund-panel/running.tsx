import useGetAllFund from "@/application/query/use-get-all-fund";
import {
  formatAddress,
  formatPrice,
  formatSuiPrice,
  getRelativeTime,
} from "@/common";
import AddFundModal from "@/common/add-fund-modal";
import MainButton from "@/common/main-button";
import FundCard from "@/component/fund-card";
import FundPieChart from "@/component/fund-pie-chart";
import { Button, Col, Flex, Row, Table, Text, Title } from "@/styled-antd";
import { Fund } from "@/type";
import {
  DollarOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const Funding = () => {
  const { data: funds } = useGetAllFund();
  const [fund, setFund] = useState<Fund>(funds?.[0]);
  const account = useCurrentAccount();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (funds) {
      setFund(funds[0]);
    }
  }, [funds]);

  const fundStatuses = [
    {
      label: "Total Funded Amount",
      value: 10000,
    },
    {
      label: "Current Value (Estimated)",
      value: 12000,
    },
  ];
  const tradingPercents = 20;
  const farmingPercents = 40;
  const restPercents = 100 - tradingPercents - farmingPercents;

  const percents = [
    {
      label: "Trading",
      value: tradingPercents,
      color: "rgba(250, 0, 255, 0.5)",
    },
    {
      label: "Farming",
      value: farmingPercents,
      color: "rgba(120, 0, 255, 0.5)",
    },
    {
      label: "Sui",
      value: restPercents,
      color: "rgba(80, 0, 155, 0.5)",
    },
  ];

  const hasPosition = fund?.fund_history?.find(
    (history) => history?.investor === account?.address
  );
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
            <Title style={{ fontSize: "24px", fontWeight: "bold" }}>
              Fund Status
            </Title>
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
                    <Flex gap="middle" style={{}} align="center">
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
                        {formatPrice(fundStatus.value)}
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
            <Flex>
              {percents
                .filter((percent) => !!percent.value)
                .map((percent) => (
                  <Flex
                    key={percent.label}
                    style={{
                      width: `${percent.value}%`,
                    }}
                    vertical
                  >
                    <Text>{percent.label}</Text>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        backgroundColor: percent.color,
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      }}
                    />
                  </Flex>
                ))}
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
                {/* <Table
                  dataSource={
                    fund?.fund_history?.map((log) => ({
                      key: log.share_id,
                      investor: formatAddress(log.investor),
                      amount: formatSuiPrice(Number(log.amount)),
                      timestamp: getRelativeTime(Number(log.timestamp)),
                    })) ?? []
                  }
                  columns={[
                    {
                      title: "Investor",
                      dataIndex: "investor",
                      key: "investor",
                    },
                    {
                      title: "Amount",
                      dataIndex: "amount",
                      key: "amount",
                    },
                    {
                      title: "Timestamp",
                      dataIndex: "timestamp",
                      key: "timestamp",
                    },
                  ]}
                /> */}
                {fund?.fund_history?.map((log) => (
                  <Flex
                    key={log.share_id}
                    style={{
                      width: "100%",
                    }}
                    justify="space-between"
                  >
                    <Text>{formatAddress(log.investor)}</Text>
                    <Text>{formatSuiPrice(Number(log.amount))} SUI</Text>
                    <Text>{getRelativeTime(Number(log.timestamp))}</Text>
                  </Flex>
                ))}
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
              {!hasPosition && (
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
                  <MainButton
                    size="middle"
                    style={{
                      padding: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    }}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Add Fund
                  </MainButton>
                </Flex>
              )}
              {hasPosition && (
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
              )}
              {hasPosition && (
                <Button
                  type="text"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    padding: "8px",
                  }}
                >
                  <MinusCircleFilled
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </Button>
              )}
              {hasPosition && (
                <Button
                  type="text"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    padding: "8px",
                  }}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <PlusCircleFilled
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <AddFundModal
        fundId={fund?.object_id}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />

      <Row gutter={16}>
        {funds?.map((fund: Fund) => (
          <Col
            key={fund.object_id}
            span={8}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setFund(fund);
            }}
          >
            <FundCard fund={fund} />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Funding;
