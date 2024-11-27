import { useQueryClient } from "@tanstack/react-query";
import useGetAllFund from "../query/use-get-all-fund";
import useGetInvestFund from "../query/use-get-invest-fund";
import useGetOwnedFund from "../query/use-get-owned-fund";
import useGetPools from "../query/use-get-pools";

const useRefetchWholeFund = () => {
  const { refetch: r } = useGetAllFund();
  const { refetch: e } = useGetOwnedFund();
  const { refetch: f } = useGetInvestFund();
  const { refetch: t } = useGetPools();
  const queryClient = useQueryClient();

  return {
    refetch: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["fund-history"],
        refetchType: "all",
      });
      r();
      e();
      f();
      t();
    },
  };
};

export default useRefetchWholeFund;
