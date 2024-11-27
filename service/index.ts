import { PaginatedEvents, SuiClient } from "@mysten/sui/client";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

export class SuiService {
  private client: SuiClient;
  private prisma: PrismaClient;
  private limit = 10;

  constructor({ url }: { url: string }) {
    this.client = new SuiClient({
      url,
    });
    this.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  async getOwnedSuiNS({ owner }: { owner: string }) {
    if (!process.env.NEXT_PUBLIC_SUI_NS_TYPE) {
      throw new Error("SUI_NS_TYPE not found");
    }
    const suiNSs = await this.client.getOwnedObjects({
      filter: {
        StructType: process.env.NEXT_PUBLIC_SUI_NS_TYPE,
      },
      owner,
    });
    return suiNSs;
  }

  async getOwnedTraderCard({ owner }: { owner: string }) {
    if (!process.env.NEXT_PUBLIC_PACKAGE_ASSET) {
      throw new Error("PACKAGE not found");
    }
    const traderCards = await this.client.getOwnedObjects({
      filter: {
        StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ASSET}::trader::Trader`,
      },
      options: {
        showDisplay: true,
      },
      owner,
    });
    return traderCards;
  }

  async queryEvents({
    module,
    packageId,
    eventType,
    nextCursor,
  }: {
    module: string;
    packageId: string;
    eventType: string;
    nextCursor?: PaginatedEvents["nextCursor"];
  }) {
    let hasNextPage = false;

    const data: PaginatedEvents["data"] = [];
    console.log(`${packageId}::${module}::${eventType}`);
    do {
      const event = await this.client.queryEvents({
        query: {
          MoveEventType: `${packageId}::${module}::${eventType}`,
        },
        limit: this.limit,
        cursor: nextCursor,
        order: "ascending",
      });
      hasNextPage = event.hasNextPage;
      nextCursor = event.nextCursor;
      data.push(...event.data);
    } while (hasNextPage);

    return data;
  }

  async upsertArenaEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const lastArena = await this.prisma.arena.findFirst({
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = lastArena
      ? {
          txDigest: lastArena.tx_digest,
          eventSeq: lastArena.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "arena",
      packageId,
      eventType: "NewArena<0x2::sui::SUI>",
      nextCursor,
    });

    type ArenaData = {
      arena_type: number;
      attend_duration: string;
      end_time: string;
      id: string;
      invest_duration: string;
      start_time: string;
    };

    // const getPeriodType = (arena_type: number) => {
    //   switch (arena_type) {
    //     case 0:
    //       return "WEEK";
    //     case 1:
    //       return "MONTH";
    //     default:
    //       return "WEEK";
    //   }
    // };

    const upserts = events.map((event) => {
      const arenaData: ArenaData = event.parsedJson as ArenaData;
      const timestamp = event.timestampMs ?? "0";
      console.log(event);
      return this.prisma.arena.upsert({
        where: {
          object_id: arenaData.id,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: {
          object_id: arenaData.id,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
          start_time: arenaData.start_time,
          end_time: arenaData.end_time,
          invest_duration: arenaData.invest_duration,
          attend_duration: arenaData.attend_duration,
        },
        create: {
          object_id: arenaData.id,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
          start_time: arenaData.start_time,
          end_time: arenaData.end_time,
          invest_duration: arenaData.invest_duration,
          attend_duration: arenaData.attend_duration,
        },
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertFundEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const lastFund = await this.prisma.fund.findFirst({
      where: {
        arena_object_id: {
          equals: null,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = lastFund
      ? {
          txDigest: lastFund.tx_digest,
          eventSeq: lastFund.event_seq.toString(),
        }
      : undefined;
    console.log(nextCursor, "nextCursor");
    const events = await this.queryEvents({
      module: "fund",
      packageId,
      eventType: "CreatedFund",
      nextCursor,
    });
    console.log(events);
    type FundData = {
      name: string;
      description: string;
      end_time: string;
      fund_img: string;
      id: string;
      invest_duration: string;
      start_time: string;
      trader: string;
      trader_fee: string;
      limit_amount: string;
      expected_roi: string;
    };

    const upserts = events.map((event) => {
      console.log(event);
      const data: FundData = event.parsedJson as FundData;
      const timestamp = event.timestampMs ?? "0";

      const object: {
        object_id: string;
        name: string;
        description: string;
        start_time: string;
        end_time: string;
        invest_duration: string;
        image_blob_id: string;
        trader_fee: string;
        owner_id: string;
        limit_amount: string;
        expected_roi: string;
        event_seq: number;
        tx_digest: string;
        timestamp: string;
      } = {
        object_id: data.id,
        name: data.name,
        description: data.description,
        start_time: data.start_time,
        end_time: data.end_time,
        invest_duration: data.invest_duration,
        image_blob_id: data.fund_img,
        trader_fee: (Number(data.trader_fee) / 100).toString(),
        owner_id: data.trader,
        limit_amount: data.limit_amount,
        expected_roi: (Number(data.expected_roi) / 100).toString(),
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };
      return this.prisma.fund.upsert({
        where: {
          object_id: data.id,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertAttendEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const lastFund = await this.prisma.fund.findFirst({
      where: {
        arena_object_id: {
          not: null,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = lastFund
      ? {
          txDigest: lastFund.tx_digest,
          eventSeq: lastFund.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "arena",
      packageId,
      eventType: "Attended<0x2::sui::SUI>",
      nextCursor,
    });

    type ArenaFundData = {
      name: string;
      description: string;
      end_time: string;
      fund_img: string;
      fund: string;
      arena: string;
      invest_duration: string;
      start_time: string;
      trader: string;
      trader_fee: string;
      limit_amount: string;
      expected_roi: string;
    };

    const upserts = events.map((event) => {
      console.log(event);
      const data: ArenaFundData = event.parsedJson as ArenaFundData;
      const timestamp = event.timestampMs ?? "0";
      const object = {
        object_id: data.fund,
        name: data.name,
        description: data.description,
        start_time: data.start_time,
        end_time: data.end_time,
        invest_duration: data.invest_duration,
        image_blob_id: data.fund_img,
        arena_object_id: data.arena,
        trader_fee: (Number(data.trader_fee) / 100).toString(),
        owner_id: data.trader,
        limit_amount: data.limit_amount,
        expected_roi: (Number(data.expected_roi) / 100).toString(),
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };
      return this.prisma.fund.upsert({
        where: {
          object_id: data.fund,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertTraderCardEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const lastFund = await this.prisma.trader_card.findFirst({
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = lastFund
      ? {
          txDigest: lastFund.tx_digest,
          eventSeq: lastFund.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "trader",
      packageId,
      eventType: "Mint",
      nextCursor,
    });

    type TraderCardData = {
      trader_id: string;
      new_first_name: string;
      new_last_name: string;
      minter: string;
      description: string;
      pfp_img: string;
    };

    const upserts = events.map((event) => {
      console.log(event);
      const data: TraderCardData = event.parsedJson as TraderCardData;
      const timestamp = event.timestampMs ?? "0";
      const object = {
        object_id: data.trader_id,
        first_name: data.new_first_name === "" ? "Sui" : data.new_first_name,
        last_name: data.new_last_name === "" ? "PaulWu" : data.new_last_name,
        description: data.description,
        image_blob_id: data.pfp_img,
        owner_address: data.minter,
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };
      return this.prisma.trader_card.upsert({
        where: {
          object_id: data.trader_id,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertInvestedEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const fundHistory = await this.prisma.fund_history.findFirst({
      where: {
        action: "Invested",
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = fundHistory
      ? {
          txDigest: fundHistory.tx_digest,
          eventSeq: fundHistory.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "fund_share",
      packageId,
      eventType: "Invested",
      nextCursor,
    });
    console.log(events);

    type InvestedData = {
      fund_id: string;
      invest_amount: string;
      investor: string;
      share_id: string;
    };

    const upserts = await Promise.all(
      events.map(async (event) => {
        console.log(event);
        const data: InvestedData = event.parsedJson as InvestedData;
        const timestamp = event.timestampMs ?? "0";

        const object: {
          share_id: string;
          action: string;
          fund_object_id: string;
          redeemed: boolean;
          amount: string;
          investor: string;
          event_seq: number;
          tx_digest: string;
          timestamp: string;
        } = {
          share_id: data.share_id,
          action: "Invested",
          fund_object_id: data.fund_id,
          redeemed: false,
          amount: data.invest_amount,
          investor: data.investor,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
        };

        return [
          this.prisma.fund_history.create({
            data: object,
          }),
        ];
      })
    );
    const result = await this.prisma.$transaction(upserts.flatMap((x) => x));
    return result;
  }

  async upsertDeinvestedEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const fundHistory = await this.prisma.fund_history.findFirst({
      where: {
        action: "Deinvested",
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = fundHistory
      ? {
          txDigest: fundHistory.tx_digest,
          eventSeq: fundHistory.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "fund",
      packageId,
      eventType: "Deinvested",
      nextCursor,
    });
    console.log(events);

    type DeinvestedData = {
      fund_id: string;
      withdraw_invest_amount: string;
      investor: string;
      remain_share: string;
    };

    const upserts = await Promise.all(
      events.map(async (event) => {
        console.log(event);
        const data: DeinvestedData = event.parsedJson as DeinvestedData;
        const timestamp = event.timestampMs ?? "0";

        const object: {
          share_id: string;
          action: string;
          fund_object_id: string;
          redeemed: boolean;
          amount: string;
          investor: string;
          event_seq: number;
          tx_digest: string;
          timestamp: string;
        } = {
          share_id: data.remain_share,
          action: "Deinvested",
          fund_object_id: data.fund_id,
          redeemed: false,
          amount: data.withdraw_invest_amount,
          investor: data.investor,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
        };

        const share = await this.prisma.fund_history.findFirst({
          where: {
            share_id: data.remain_share,
          },
        });

        const executions = [];
        console.log(data);
        console.log(data.remain_share);
        executions.push(
          this.prisma.fund_history.updateMany({
            where: {
              AND: [
                {
                  NOT: {
                    share_id: { equals: data.remain_share },
                  },
                },
                {
                  fund_object_id: {
                    equals: data.fund_id,
                  },
                },
                {
                  redeemed: {
                    equals: false,
                  },
                },
              ],
            },
            data: {
              redeemed: true,
            },
          })
        );

        if (share) {
          executions.push(
            this.prisma.fund_history.create({
              data: {
                share_id: uuid(),
                action: "Deinvested",
                fund_object_id: data.fund_id,
                redeemed: true,
                amount: data.withdraw_invest_amount,
                investor: data.investor,
                event_seq: Number(event.id.eventSeq),
                tx_digest: event.id.txDigest,
                timestamp,
              },
            })
          );
        } else {
          executions.push(
            this.prisma.fund_history.create({
              data: object,
            })
          );
        }

        return executions;
      })
    );
    const result = await this.prisma.$transaction(upserts.flatMap((x) => x));
    return result;
  }

  async upsertSettleEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const settleResult = await this.prisma.settle_result.findFirst({
      orderBy: [
        {
          timestamp: "desc",
        },
        {
          event_seq: "desc",
        },
      ],

      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = settleResult
      ? {
          txDigest: settleResult.tx_digest,
          eventSeq: settleResult.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "fund",
      packageId,
      eventType: "SettleResult",
      nextCursor,
    });
    console.log(events);

    type SettleResultData = {
      fund: string;
      trader: string;
      is_matched_roi: boolean;
    };

    const upserts = events.map((event) => {
      console.log(event);
      const data: SettleResultData = event.parsedJson as SettleResultData;
      const timestamp = event.timestampMs ?? "0";

      const object: {
        fund_object_id: string;
        trader_id: string;
        match_roi: boolean;
        event_seq: number;
        tx_digest: string;
        timestamp: string;
      } = {
        fund_object_id: data.fund,
        trader_id: data.trader,
        match_roi: data.is_matched_roi,
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };
      return this.prisma.settle_result.upsert({
        where: {
          fund_object_id: data.fund,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });

    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertSwapEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const traderOperation = await this.prisma.trader_operation.findFirst({
      where: {
        action: "Swap",
      },
      orderBy: [
        {
          timestamp: "desc",
        },
        {
          event_seq: "desc",
        },
      ],
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = traderOperation
      ? {
          txDigest: traderOperation.tx_digest,
          eventSeq: traderOperation.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "cetus",
      packageId,
      eventType: "Swap",
      nextCursor,
    });
    console.log(events);

    type SwapData = {
      fund: string;
      protocol: string;
      input_coin_type: {
        name: string;
      };
      input_amount: string;
      output_coin_type: {
        name: string;
      };
      output_amount: string;
    };
    console.log(events);
    const upserts = events.map((event) => {
      console.log(event);
      const data: SwapData = event.parsedJson as SwapData;
      console.log(data);
      const timestamp = event.timestampMs ?? "0";

      const object: {
        id: string;
        fund_object_id: string;
        action: string;
        protocol: string;
        token_in: string;
        amount_in: string;
        token_out: string;
        amount_out: string;
        event_seq: number;
        tx_digest: string;
        timestamp: string;
      } = {
        id: event.id.txDigest + Number(event.id.eventSeq),
        fund_object_id: data.fund,
        action: "Swap",
        protocol: data.protocol,
        token_in: data.input_coin_type.name,
        amount_in: data.input_amount,
        token_out: data.output_coin_type.name,
        amount_out: data.output_amount,
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };

      return this.prisma.trader_operation.upsert({
        where: {
          id: event.id.txDigest + Number(event.id.eventSeq),
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertDepositEvents({
    protocol,
  }: {
    protocol: "Scallop" | "Bucket" | "Suilend";
  }) {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const traderOperation = await this.prisma.trader_operation.findFirst({
      where: {
        action: "Deposit",
        protocol,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = traderOperation
      ? {
          txDigest: traderOperation.tx_digest,
          eventSeq: traderOperation.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: protocol.toLocaleLowerCase(),
      packageId,
      eventType: "Deposited",
      nextCursor,
    });
    console.log(events);

    type DepositData = {
      fund: string;
      protocol: string;
      input_type: {
        name: string;
      };
      in_amount: string;
      output_type: {
        name: string;
      };
      output_amount: string;
    };
    console.log(events);
    const upserts = events.map((event) => {
      console.log(event);
      const data: DepositData = event.parsedJson as DepositData;
      console.log(data);
      const timestamp = event.timestampMs ?? "0";

      const object: {
        id: string;
        fund_object_id: string;
        action: string;
        protocol: string;
        token_in: string;
        amount_in: string;
        token_out: string;
        amount_out: string;
        event_seq: number;
        tx_digest: string;
        timestamp: string;
      } = {
        id: event.id.txDigest + Number(event.id.eventSeq),
        fund_object_id: data.fund,
        action: "Deposit",
        protocol: data.protocol,
        token_in: data.input_type.name,
        amount_in: data.in_amount,
        token_out: data.output_type.name,
        amount_out: data.output_amount,
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };

      return this.prisma.trader_operation.upsert({
        where: {
          id: event.id.txDigest + Number(event.id.eventSeq),
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
        },
        update: object,
        create: object,
      });
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertWithdrawEvents({
    protocol,
  }: {
    protocol: "Scallop" | "Bucket" | "Suilend";
  }) {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const traderOperation = await this.prisma.trader_operation.findFirst({
      where: {
        action: "Withdraw",
        protocol,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = traderOperation
      ? {
          txDigest: traderOperation.tx_digest,
          eventSeq: traderOperation.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: protocol.toLocaleLowerCase(),
      packageId,
      eventType: "Withdrawed",
      nextCursor,
    });
    console.log(events);

    type WithdrawData = {
      fund: string;
      protocol: string;
      input_type: {
        name: string;
      };
      in_amount: string;
      output_type: {
        name: string;
      };
      output_amount: string;
    };

    type BucketWithdrawData = {
      fund: string;
      protocol: string;
      input_type: {
        name: string;
      };
      in_amount: string;
      output_type1: {
        name: string;
      };
      output_amount1: string;
      output_type2: {
        name: string;
      };
      output_amount2: string;
    };

    console.log(events);
    const upserts = events.map((event) => {
      if (protocol === "Bucket") {
        console.log(event);
        const data: BucketWithdrawData = event.parsedJson as BucketWithdrawData;
        console.log(data);
        const timestamp = event.timestampMs ?? "0";

        const bucketObject: {
          id: string;
          fund_object_id: string;
          action: string;
          protocol: string;
          token_in: string;
          amount_in: string;
          token_out: string;
          amount_out: string;
          token_out2: string;
          amount_out2: string;
          event_seq: number;
          tx_digest: string;
          timestamp: string;
        } = {
          id: event.id.txDigest + Number(event.id.eventSeq),
          fund_object_id: data.fund,
          action: "Withdraw",
          protocol: data.protocol,
          token_in: data.input_type.name,
          amount_in: data.in_amount,
          token_out: data.output_type1.name,
          amount_out: data.output_amount1,
          token_out2: data.output_type2.name,
          amount_out2: data.output_amount2,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
        };

        return this.prisma.trader_operation.upsert({
          where: {
            id: event.id.txDigest + Number(event.id.eventSeq),
            event_seq: Number(event.id.eventSeq),
            tx_digest: event.id.txDigest,
          },
          update: bucketObject,
          create: bucketObject,
        });
      } else {
        console.log(event);
        const data: WithdrawData = event.parsedJson as WithdrawData;
        console.log(data);
        const timestamp = event.timestampMs ?? "0";

        const object: {
          id: string;
          fund_object_id: string;
          action: string;
          protocol: string;
          token_in: string;
          amount_in: string;
          token_out: string;
          amount_out: string;
          event_seq: number;
          tx_digest: string;
          timestamp: string;
        } = {
          id: event.id.txDigest + Number(event.id.eventSeq),
          fund_object_id: data.fund,
          action: "Withdraw",
          protocol: data.protocol,
          token_in: data.input_type.name,
          amount_in: data.in_amount,
          token_out: data.output_type.name,
          amount_out: data.output_amount,
          event_seq: Number(event.id.eventSeq),
          tx_digest: event.id.txDigest,
          timestamp,
        };

        return this.prisma.trader_operation.upsert({
          where: {
            id: event.id.txDigest + Number(event.id.eventSeq),
            event_seq: Number(event.id.eventSeq),
            tx_digest: event.id.txDigest,
          },
          update: object,
          create: object,
        });
      }
    });
    const result = await this.prisma.$transaction(upserts);
    return result;
  }

  async upsertClaimEvents() {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ASSET;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const claimResult = await this.prisma.claim_result.findFirst({
      orderBy: [
        {
          timestamp: "desc",
        },
        {
          event_seq: "desc",
        },
      ],

      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    const nextCursor: PaginatedEvents["nextCursor"] = claimResult
      ? {
          txDigest: claimResult.tx_digest,
          eventSeq: claimResult.event_seq.toString(),
        }
      : undefined;
    const events = await this.queryEvents({
      module: "fund",
      packageId,
      eventType: "Claimed<0x2::sui::SUI>",
      nextCursor,
    });
    console.log(events);

    type ClaimedResultData = {
      fund: string;
      receiver: string;
      amount: string;
      shares: string[];
    };

    const upserts = events.map((event) => {
      console.log(event);
      const data: ClaimedResultData = event.parsedJson as ClaimedResultData;
      const timestamp = event.timestampMs ?? "0";

      const executions = [];

      const object: {
        id: string;
        fund_object_id: string;
        receiver: string;
        amount: string;
        event_seq: number;
        tx_digest: string;
        timestamp: string;
      } = {
        id: event.id.txDigest + Number(event.id.eventSeq),
        fund_object_id: data.fund,
        receiver: data.receiver,
        amount: data.amount,
        event_seq: Number(event.id.eventSeq),
        tx_digest: event.id.txDigest,
        timestamp,
      };
      executions.push(
        this.prisma.claim_result.upsert({
          where: {
            id: event.id.txDigest + Number(event.id.eventSeq),
            event_seq: Number(event.id.eventSeq),
            tx_digest: event.id.txDigest,
          },
          update: object,
          create: object,
        })
      );

      data.shares.forEach((share) => {
        console.log(share);
        executions.push(
          this.prisma.fund_history.update({
            where: {
              share_id: share,
              fund_object_id: data.fund,
            },
            data: {
              redeemed: true,
            },
          })
        );
      });

      return executions;
    });

    const result = await this.prisma.$transaction(upserts.flatMap((x) => x));
    return result;
  }
}
