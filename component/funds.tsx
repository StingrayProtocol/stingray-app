import { Col, Divider, Flex, Row } from "@/styled-antd";
import { Fund } from "@/type";
import React from "react";
import FundCard from "./fund-card";
import Funding from "./dashboard/investor/fund-panel/funding";
import { Empty } from "antd";
import Running from "./dashboard/investor/fund-panel/running";

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
  return (
    <Flex gap="middle" vertical>
      {Boolean(fundId) && status === "funding" && (
        <Funding fund={funds?.find((fund) => fund?.object_id === fundId)} />
      )}
      {Boolean(fundId) && status === "running" && (
        <Running fund={funds?.find((fund) => fund?.object_id === fundId)} />
      )}
      {Boolean(fundId) && (
        <Divider
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        />
      )}
      {funds?.length === 0 && (
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
