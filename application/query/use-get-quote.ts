import { quote } from "@/common/quote";
import { PRICE_FEE } from "@/constant/price";
import { useQuery } from "@tanstack/react-query";

const useGetQuote = ({
  inToken,
  outToken,
  amount,
  type,
}: {
  inToken: string;
  outToken: string;
  amount: number;
  type: "in" | "out";
}) => {
  return useQuery({
    queryKey: ["quote", inToken, outToken, amount, type],
    queryFn: async () => {
      const indexIn = PRICE_FEE.findIndex((item) => item.name === inToken);
      if (indexIn < 0) throw new Error("Invalid inToken");
      const indexOut = PRICE_FEE.findIndex((item) => item.name === outToken);
      if (indexOut < 0) throw new Error("Invalid outToken");

      return quote(indexIn, indexOut, amount, type);
    },
    enabled: Boolean(inToken && outToken && amount),
    refetchInterval: 7000,
  });
};

export default useGetQuote;
