"use client";

import TitleTemplate from "@/component/title-tempplate/title-template";
import { Divider, Flex, Image, Table, Text, Title } from "@/styled-antd";
import banner from "@/public/arena-banner.png";
import MainButton from "@/common/main-button";
import useGetAllArena from "@/application/query/use-get-all-arenas";
import TraderInfo from "@/common/trader-info";
import { Fund, TraderCard } from "@/type";
import { TeamOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import useGetPositionValue from "@/application/query/use-get-position-value_";
import { useEffect, useState } from "react";

const Roi = ({
  arena,
  onSuccess,
}: {
  arena: Fund;
  onSuccess: (roi: number) => void;
}) => {
  const { data: positionValue, isPending } = useGetPositionValue({
    fundId: arena.object_id,
  });

  const total =
    arena.fund_history.reduce((acc, cur) => acc + Number(cur.amount), 0) /
    Math.pow(10, 9);
  const currenValue = positionValue?.total ?? 0;
  const roi = ((currenValue - total) / total) * 100;

  useEffect(() => {
    if (roi) {
      onSuccess(roi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roi]);
  return (
    <Flex align="center">
      {isPending && <Skeleton.Input active />}
      {!isPending && (
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {roi.toFixed(3)}%
        </Text>
      )}
    </Flex>
  );
};

const Page = () => {
  const { data: arenas } = useGetAllArena();

  const [arenaInfos, setArenaInfos] = useState<
    {
      trader: TraderCard;
      name: string;
      rate: number;
      investor: number;
      roi: Fund;
      roiRate: number;
    }[]
  >([]);

  useEffect(() => {
    if (arenas) {
      const _arenaInfos = arenas?.map((arena) => {
        const totalFund = arena.fund_history.reduce(
          (acc, cur) => acc + parseFloat(cur.amount),
          0
        );
        const investSet = new Set(
          arena?.fund_history.map((history) => history.investor)
        );
        const investCount = investSet.size;

        return {
          trader: arena.owner,
          name: arena.name,
          rate: totalFund / Number(arena.limit_amount),
          investor: investCount,
          roi: arena,
          roiRate: 0,
        };
      });
      setArenaInfos(_arenaInfos);
    }
  }, [arenas]);

  return (
    <Flex
      vertical
      gap="large"
      style={{
        marginLeft: "20px",
        marginRight: "20px",
      }}
      align="center"
    >
      <Flex
        style={{
          padding: "12px",
        }}
      >
        <Image
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
          alt="banner"
          preview={false}
          src={banner.src}
        />
      </Flex>

      <Flex
        style={{
          marginTop: "50px",
          position: "relative",
        }}
        vertical
        align="center"
      >
        <TitleTemplate title="Arena's running" />
        <Flex
          style={{
            width: "100%",
            justifyContent: "center",
            position: "absolute",
            bottom: "0px",
            alignItems: "center",
          }}
          vertical
        >
          <MainButton
            style={{
              marginTop: "40px",
              borderRadius: "40px",
              alignSelf: "center",
              border: "none",
              paddingLeft: "40px",

              paddingRight: "40px",
              background: "rgba(83, 83, 83, 0.8)",
              fontSize: "24px",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
            disabled
            type="default"
          >
            Running...
          </MainButton>
        </Flex>
      </Flex>
      <Flex
        style={{
          width: "100%",
          marginTop: "50px",
          marginBottom: "50px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <Divider />
      </Flex>
      <Title
        style={{
          marginTop: "50px",
          fontSize: "72px",
          textAlign: "center",
        }}
      >
        Round #1 Ranking
      </Title>
      <Table
        footer={() => (
          <div
            style={{
              overflow: "hidden",
            }}
          />
        )}
        bordered
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "40px",
          borderRadius: 40,
          background: "rgba(90, 0, 175, 0.6)",
          fontWeight: "bold",
        }}
        dataSource={arenaInfos}
        columns={[
          {
            title: "Trader ID",
            dataIndex: "trader",
            key: "trader",
            render: (traderCard) => <TraderInfo traderCard={traderCard} />,
          },
          {
            title: "Strategy Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Funding Rate",
            dataIndex: "rate",
            key: "rate",
          },
          {
            title: "Investor",
            dataIndex: "investor",
            key: "investor",
            sortOrder: "descend",
            render: (investor) => (
              <Text
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {investor}
                <TeamOutlined />
              </Text>
            ),
          },
          {
            title: "ROI",
            dataIndex: "roi",
            key: "roi",
            showSorterTooltip: false,
            sortOrder: "descend",
            sorter: (a, b) => {
              const rateA = (
                a as {
                  roiRate: number;
                }
              ).roiRate;
              const rateB = (
                b as {
                  roiRate: number;
                }
              ).roiRate;
              return rateA - rateB;
            },
            render: (arena) => (
              <Roi
                arena={arena}
                onSuccess={(roi) => {
                  setArenaInfos((prev) => [
                    ...prev.map((item) =>
                      item.roi.object_id === arena.object_id
                        ? { ...item, roiRate: roi }
                        : item
                    ),
                  ]);
                }}
              />
            ),
          },
        ]}
        pagination={false}
      />
    </Flex>
  );
};

export default Page;
