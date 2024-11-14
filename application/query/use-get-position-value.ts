import { Fund } from "@/type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import useGetPriceRate from "./use-get-price-rate";
import useGetFundBalance from "./use-get-fund-balance";

type UseGetPositionValueProps = Omit<
  UseQueryOptions<{
    sui: number;
    trading: number;
    farming: number;
    total: number;
    percent: {
      sui: number;
      trading: number;
      farming: number;
    };
  }>,
  "queryKey"
> & {
  fund?: Fund;
};

const useGetPositionValue = ({
  fund,
  ...options
}: UseGetPositionValueProps) => {
  const { data: priceRates } = useGetPriceRate();
  const { data: balances } = useGetFundBalance({
    fundId: fund?.object_id,
  });
  return useQuery({
    queryKey: ["position-value", fund?.object_id, priceRates, balances],
    queryFn: async () => {
      const sui =
        Number(balances?.find((balance) => balance.name === "SUI")?.value) ?? 0;

      const trading =
        balances
          ?.filter((balance) => balance.name !== "SUI")
          ?.reduce((acc, balance) => {
            const priceRate = priceRates?.find(
              (priceRate) => priceRate.name === balance.name
            );
            if (!priceRate) return acc;

            return acc + priceRate.price * balance.value;
          }, 0) ?? 0;

      const farming =
        balances?.reduce((acc, balance) => {
          const priceRate = priceRates?.find(
            (priceRate) => priceRate.name === balance.name
          );
          if (!priceRate) return acc;

          const totalFarming =
            priceRate.price *
            (balance.farmings?.reduce((acc, farming) => {
              return acc + Number(farming.value);
            }, 0) || 0);
          return acc + totalFarming;
        }, 0) ?? 0;

      return {
        sui,
        trading,
        farming,
        total: sui + trading + farming,
        percent: {
          sui: (sui / (sui + trading + farming)) * 100,
          trading: (trading / (sui + trading + farming)) * 100,
          farming: (farming / (sui + trading + farming)) * 100,
        },
      };
    },
    enabled: Boolean(priceRates && balances),
    ...options,
  });
};

export default useGetPositionValue;
