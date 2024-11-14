import useGetTraderCard from "@/application/query/use-get-trader-card";
import TraderInfo from "@/common/trader-info";
import { getWalrusDisplayUrl } from "@/common/walrus-api";
import { Flex, Image, Progress, Text } from "@/styled-antd";
import { Fund } from "@/type";
import { TeamOutlined } from "@ant-design/icons";

const FundCard = ({ fund, card = true }: { fund?: Fund; card?: boolean }) => {
  const { data: traderCard } = useGetTraderCard({
    address: fund?.owner_id,
  });
  const total = fund?.fund_history?.length
    ? fund?.fund_history.reduce((acc, cur) => acc + Number(cur.amount), 0)
    : 0;

  //same investor aggregate to one
  const investSet = new Set(
    fund?.fund_history.map((history) => history.investor)
  );

  const investCount = investSet.size;

  return (
    <Flex
      style={{
        width: "100%",
        maxWidth: "320px",
        minHeight: "480px",
        padding: card ? "24px" : "0px",
        paddingLeft: card ? "24px" : "0px",
        paddingRight: card ? "24px" : "0px",
        borderRadius: "20px",
        backgroundColor: card ? "rgba(120, 0, 255, 0.2)" : "transparent",
        border: card ? "1px solid rgba(255, 255, 255, 0.5)" : "none",
        margin: card ? "0 auto" : "0px",
        height: "100%",
      }}
      vertical
      gap="small"
    >
      <Flex>
        <Image
          preview={false}
          src={getWalrusDisplayUrl(fund?.image_blob_id)}
          alt=""
        />
      </Flex>
      <Flex gap="small" vertical flex="1">
        <TraderInfo traderCard={traderCard} />
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {fund?.name}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            lineHeight: "16px",
          }}
        >
          {fund?.description}
        </Text>
      </Flex>
      <Flex vertical>
        <Flex justify="space-between" align="center">
          <Text>
            Funded
            {fund?.amount} SUI (100%)
          </Text>
          <Flex gap="small">
            <Text>{investCount ?? 1}</Text>
            <TeamOutlined />
          </Flex>
        </Flex>
        <Progress
          percent={Number(
            ((total / Number(fund?.limit_amount)) * 100).toFixed(2)
          )}
          status="active"
          // strokeColor={{ from: '#108ee9', to: '#87d068' }}
        />
      </Flex>
    </Flex>
  );
};

export default FundCard;
