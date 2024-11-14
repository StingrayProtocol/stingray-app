import CreateFundModal from "../trade/create-fund-modal";
import { useState } from "react";

const CreateFundButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onHover, setOnHover] = useState(false);
  return (
    <>
      <CreateFundModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {/* <Button
        onClick={() => {
          setIsOpen(true);
        }}
        onMouseEnter={() => {
          setOnHover(true);
        }}
        onMouseLeave={() => {
          setOnHover(false);
        }}
        className={style.createFundButton}
      >
        <PlusOutlined />
      </Button> */}
      {/* <Flex
        className={style.createFundText}
        style={{
          opacity: onHover ? "1 !important" : 0,
        }}
      >
        Get Funding For Your Strategy
      </Flex> */}
      {/* <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 999,
        }}
      /> */}
    </>
  );
};

export default CreateFundButton;
