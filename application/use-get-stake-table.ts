import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

const useGetStakeTable = () => {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["stake-table"],
    queryFn: async () => {
      const d = await suiClient.getDynamicFields({
        parentId:
          "0x647d57c0a7b1b7a829d14de0a2db60d6df266a7cc096ba11074650c3153e1eae",
      });
      console.log(d);
      const data = await suiClient.getDynamicFieldObject({
        parentId:
          "0x647d57c0a7b1b7a829d14de0a2db60d6df266a7cc096ba11074650c3153e1eae",
        name: {
          type: "0x35b773e91f49ac2026819171ea13319e20a9345f68d99188681c075e3b2ec6d2::pool::StakeAmount",
          value: {
            dummy_field: false,
          },
        },
      });
      console.log(data);
      return data;
    },
  });
};

export default useGetStakeTable;
