import useGetAllFund from "../query/use-get-all-fund";
import useGetInvestFund from "../query/use-get-invest-fund";
import useGetOwnedFund from "../query/use-get-owned-fund";
import useGetPools from "../query/use-get-pools";

const useRefetchWholeFund = () => {
  const { refetch: r } = useGetAllFund();
  const { refetch: e } = useGetOwnedFund();
  const { refetch: f } = useGetInvestFund();
  const { refetch: t } = useGetPools();

  return {
    refetch: () => {
      r();
      e();
      f();
      t();
    },
  };
};

export default useRefetchWholeFund;
