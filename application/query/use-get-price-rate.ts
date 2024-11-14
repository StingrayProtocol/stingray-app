import { quote } from "@/common/quote";
import { PRICE_FEE } from "@/constant/price";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetPriceRateProps = Omit<
  UseQueryOptions<
    {
      name: string;
      price: number;
      decimal: number;
    }[]
  >,
  "queryKey"
>;

const useGetPriceRate = (options?: UseGetPriceRateProps) => {
  return useQuery({
    queryKey: ["price-rate"],
    queryFn: async () => {
      return Promise.all(
        PRICE_FEE.map(async (item, i) => {
          const price = await quote(
            i,
            10, //sui
            1,
            "in"
          );
          return {
            name: item.name,
            price,
            decimal: item.decimal,
          };
        })
      );
    },
    ...options,
  });
};

export default useGetPriceRate;
