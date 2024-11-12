import { useQuery } from "@tanstack/react-query";

const useGetAllFund = () => {
  return useQuery({
    queryKey: ["all-fund"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fund/all`,
        {
          method: "GET",
        }
      );
      return response.json();
    },
  });
};

export default useGetAllFund;
