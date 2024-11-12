import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import { Flex, Image, Text } from "@/styled-antd";
import { getWalrusDisplayUrl } from "./walrus-api";

const TraderInfo = () => {
  const { data: traderCard } = useGetOwnedTraderCard();
  return (
    <Flex gap="middle">
      <Flex
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image
          preview={false}
          src={getWalrusDisplayUrl(traderCard?.image_blob_id)}
          alt={traderCard?.last_name}
        />
      </Flex>
      <Text
        style={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >{`${traderCard?.last_name}`}</Text>
    </Flex>
  );
};

export default TraderInfo;
