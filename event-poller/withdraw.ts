import { CronJob } from "cron";
import { getFullnodeUrl } from "@mysten/sui/client";
import dotenv from "dotenv";
import { SuiService } from "../service";

dotenv.config({
  path: "../.env",
});

const rpcUrl = getFullnodeUrl("mainnet");

const job = CronJob.from({
  cronTime: "*/20 * * * * *",
  onTick: async function () {
    const packageId = process.env.NEXT_PUBLIC_PACKAGE;
    if (!packageId) {
      throw new Error("Package not found");
    }
    const suiService = new SuiService({
      url: process.env.NEXT_PUBLIC_SUI_NETWORK_URL ?? rpcUrl,
    });

    await suiService.upsertWithdrawEvents({ protocol: "Bucket" });
    await suiService.upsertWithdrawEvents({ protocol: "Scallop" });
    await suiService.upsertWithdrawEvents({ protocol: "Suilend" });
  },
  start: true,
  timeZone: "America/Los_Angeles",
});

job.start();
