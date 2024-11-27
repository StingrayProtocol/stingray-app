import { Col, Divider, Flex, Row } from "@/styled-antd";
import { Fund } from "@/type";
import React from "react";
import FundCard from "./fund-card";
import Funding from "./dashboard/investor/fund-panel/funding";
import { Empty } from "antd";
import Running from "./dashboard/investor/fund-panel/running";
import Claimable from "./dashboard/investor/fund-panel/claimable";

const Funds = ({
  status,
  funds,
  fundId,
  onSelectFund,
}: {
  status: "funding" | "running" | "claimable";
  funds?: Fund[];
  fundId?: string;
  onSelectFund: (fund: string) => void;
}) => {
  console.log(funds);
  console.log("funds");
  const hasFunds = (funds?.length ?? 0) > 0;
  return (
    <Flex gap="middle" vertical>
      {Boolean(fundId) && hasFunds && status === "funding" && (
        <Funding fund={funds?.find((fund) => fund?.object_id === fundId)} />
      )}
      {Boolean(fundId) && hasFunds && status === "running" && (
        <Running fund={funds?.find((fund) => fund?.object_id === fundId)} />
      )}
      {Boolean(fundId) && hasFunds && status === "claimable" && (
        <Claimable fund={funds?.find((fund) => fund?.object_id === fundId)} />
      )}
      {Boolean(fundId) && (
        <Divider
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        />
      )}
      {!hasFunds && (
        <Empty
          style={{
            paddingTop: "100px",
          }}
        />
      )}
      <Row
        gutter={[16, 32]}
        style={{
          marginTop: "20px",
        }}
      >
        {funds?.map((fund: Fund) => (
          <Col
            key={fund.object_id}
            span={8}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              onSelectFund(fund.object_id);
            }}
          >
            <FundCard fund={fund} />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Funds;
