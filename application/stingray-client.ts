import { TradeDuration } from "@/type";
import qs from "qs";

export class StingrayClient {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getRequest(url: string, params?: any) {
    const queryString = qs.stringify(params, {
      arrayFormat: "indices",
      encode: true,
    });

    const requestUrl =
      queryString.length === 0
        ? `${this.apiUrl}${url}`
        : `${this.apiUrl}${url}?${queryString}`;

    return fetch(requestUrl, {
      method: "GET",
      credentials: "include",
    });
  }
  async getArenaInfo() {
    const arenas = await this.getRequest("/api/arena/info");
    return arenas;
  }

  async getPoolArenas({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/pool/arenas", {
      duration,
    });
    return funds;
  }

  async getPoolFundings({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/pool/fundings", {
      duration,
    });
    return funds;
  }

  async getPoolRunningFunds({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/pool/runnings", {
      duration,
    });
    return funds;
  }

  async getInvestedFundings({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/invested/fundings", {
      duration,
    });
    return funds;
  }

  async getInvestedRunnings({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/invested/runnings", {
      duration,
    });
    return funds;
  }

  async getInvestedClaimables({ duration }: { duration: TradeDuration }) {
    const funds = await this.getRequest("/api/invested/claimables", {
      duration,
    });
    return funds;
  }

  async getFundHistory({ fundId }: { fundId: string }) {
    const funds = await this.getRequest(`/api/fund/history/${fundId}`);
    return funds;
  }
}
