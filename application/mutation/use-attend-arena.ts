import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useAttendArena = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      arena,
      trader,
      description = "",
      traderFee = 20,
    }: {
      arena?: string;
      trader: string;
      description: string;
      traderFee: number;
    }) => {
      if (!account) {
        throw new Error("Account not found");
      }
      if (!arena) {
        throw new Error("Arena not found");
      }
      if (
        !process.env.NEXT_PUBLIC_GLOBAL_CONFIG ||
        !process.env.NEXT_PUBLIC_PACKAGE
      ) {
        throw new Error("Global config or package not found");
      }
      const tx = new Transaction();

      const arenaRequest = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "arena",
        function: "create_arena_request",
        arguments: [tx.pure.u8(0)], // 0 week, 1 month
        typeArguments: ["0x2::sui::SUI"],
      }); //arena_request

      const fund = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "create",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          tx.pure.string(description),
          tx.object(trader), // trader
          tx.pure.u64(traderFee), // trader fee
          tx.pure.bool(false), // is arena
          tx.pure.u64(Date.now() + 10000), //start time
          tx.pure.u64(86400000), //invest duration
          tx.pure.u64(Date.now() + 1000000), // end time
          tx.splitCoins(tx.gas, [100000000]), // coin // temporary sui only
        ],
        typeArguments: ["0x2::sui::SUI"],
      }); //fund

      // attend arena
      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "arena",
        function: "attend",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          arenaRequest,
          tx.object(arena), //arena
          fund[0], //fund
          tx.object(trader), // trader
          tx.object("0x6"),
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

      // fund to share object
      tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund",
        function: "to_share_object",
        arguments: [
          fund[0], //fund
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

      // mint share
      const share = tx.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE,
        module: "fund_share",
        function: "mint",
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_GLOBAL_CONFIG), //global config
          fund[1], //mint request
        ],
        typeArguments: ["0x2::sui::SUI"],
      });

      tx.transferObjects([share], account.address);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAttendArena;
