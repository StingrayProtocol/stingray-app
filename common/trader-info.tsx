import { Flex, Image, Text } from "@/styled-antd";
import { getWalrusDisplayUrl } from "./walrus-api";
import logo from "@/public/Stingray-Round.png";
import { TraderCard } from "@/type";
import { formatAddress } from "./connect-button";
import useGetTraderCard from "@/application/query/use-get-trader-card";

const TraderInfo = ({
  traderCard,
  address,
}: {
  traderCard?: TraderCard;
  address?: string;
}) => {
  const { data: _traderCard } = useGetTraderCard({
    address,
  });
  return (
    <Flex gap="small" align="center">
      <Flex
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          overflow: "hidden",
        }}
        align="center"
      >
        {Boolean(traderCard?.image_blob_id) ||
        Boolean(_traderCard?.image_blob_id) ? (
          <Image
            preview={false}
            src={getWalrusDisplayUrl(
              traderCard?.image_blob_id || _traderCard?.image_blob_id
            )}
            alt={traderCard?.last_name}
          />
        ) : (
          <Image preview={false} src={logo.src} alt={traderCard?.last_name} />
        )}
      </Flex>
      <Text
        style={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >{`${
        traderCard?.last_name ??
        _traderCard?.last_name ??
        formatAddress(address)
      }`}</Text>
    </Flex>
  );
};

export default TraderInfo;
