import React from "react";
import CreateFund from "./create-fund";
import { Flex } from "@/styled-antd";

const CreateFundModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: isOpen ? 9 : -1,
          opacity: isOpen ? 1 : 0,
          background: "rgba(0, 0, 0, 0.2)",
          transition: "opacity 0.3s",
        }}
        onClick={onClose}
      />
      <Flex
        style={{
          zIndex: isOpen ? 10 : -1,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CreateFund />
      </Flex>
    </>
  );
};

export default CreateFundModal;
