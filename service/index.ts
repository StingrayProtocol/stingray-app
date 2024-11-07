import { PaginatedEvents, SuiClient } from "@mysten/sui/client";
import { PrismaClient } from "@prisma/client";

export class SuiService {
  private client: SuiClient;
  private prisma: PrismaClient;
  private limit = 10;

  constructor({ url }: { url: string }) {
    this.client = new SuiClient({
      url,
    });
    this.prisma = new PrismaClient();
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

  async queryEvents({
    module,
    packageId,
    eventType,
  }: {
    module: string;
    packageId: string;
    eventType: string;
  }) {
    let hasNextPage = false;
    const lastArena = await this.prisma.arena.findFirst({
      orderBy: {
        timestamp: "desc",
      },
      select: {
        tx_digest: true,
        event_seq: true,
      },
    });
    console.log(lastArena);
    let nextCursor: PaginatedEvents["nextCursor"] = lastArena
      ? {
          txDigest: lastArena.tx_digest,
          eventSeq: lastArena.event_seq,
        }
      : undefined;

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

  async upsertArenaEvents({ packageId }: { packageId: string }) {
    const events = await this.queryEvents({
      module: "arena",
      packageId,
      eventType: "NewArena<0x2::sui::SUI>",
    });

    type ArenaDate = {
      arena_type: number;
      attend_duration: string;
      end_time: string;
      id: string;
      invest_duration: string;
      start_time: string;
    };

    const getPeriodType = (arena_type: number) => {
      switch (arena_type) {
        case 0:
          return "WEEK";
        case 1:
          return "MONTH";
        default:
          return "WEEK";
      }
    };

    const upserts = events.map((event) => {
      const arenaData: ArenaDate = event.parsedJson as ArenaDate;
      const timestamp = event.timestampMs ?? "0";
      console.log(event);
      return this.prisma.arena.upsert({
        where: {
          object_id: arenaData.id,
          event_seq: event.id.eventSeq,
          tx_digest: event.id.txDigest,
        },
        update: {
          object_id: arenaData.id,
          period_type: getPeriodType(arenaData.arena_type),
          coin_type: "Sui",
          event_seq: event.id.eventSeq,
          tx_digest: event.id.txDigest,
          timestamp,
          start_time: arenaData.start_time,
          end_time: arenaData.end_time,
          invest_duration: arenaData.invest_duration,
          attend_duration: arenaData.attend_duration,
        },
        create: {
          object_id: arenaData.id,
          period_type: getPeriodType(arenaData.arena_type),
          coin_type: "Sui",
          event_seq: event.id.eventSeq,
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

  // async query
}
