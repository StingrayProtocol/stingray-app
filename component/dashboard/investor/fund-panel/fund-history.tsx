import { formatSuiPrice, getRelativeTime } from "@/common";
import TraderInfo from "@/common/trader-info";
import { Flex, Text, Tooltip } from "@/styled-antd";
import { FundHistory as FundHistoryType } from "@/type";
import React from "react";

const FundHistory = ({ history }: { history?: FundHistoryType[] }) => {
  const fundLogs = history?.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );
  return (
    <Flex
      style={{
        width: "100%",
      }}
      vertical
      gap="small"
    >
      {fundLogs?.map((log) => (
        <Tooltip
          key={log.share_id}
          overlayInnerStyle={{
            background: "#2a0067",
          }}
          arrow={false}
          title={getRelativeTime(Number(log.timestamp))}
        >
          <Flex
            style={{
              width: "100%",
            }}
            justify="space-between"
            align="center"
          >
            <Flex gap="large" align="center">
              <TraderInfo address={log.investor} />
              <Text>
                {log.action === "Invested"
                  ? "Funded Strategy"
                  : "Removed Funds"}
              </Text>
            </Flex>
            <Text>
              {log.action === "Invested" ? "+" : "-"}
              {formatSuiPrice(Number(log.amount))} SUI
            </Text>
          </Flex>
        </Tooltip>
      ))}
    </Flex>
  );
};

export default FundHistory;
