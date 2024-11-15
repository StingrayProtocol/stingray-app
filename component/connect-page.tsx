import ConnectButton from "@/common/connect-button";
import { Flex } from "@/styled-antd";
import TitleTemplate from "./title-tempplate/title-template";

const ConnectPage = () => {
  return (
    <Flex
      vertical
      gap="large"
      style={{
        position: "relative",
        marginLeft: "20px",
        marginRight: "20px",
      }}
      justify="center"
    >
      <TitleTemplate title="JOIN STINGRAYLABS" />
      <Flex
        style={{
          position: "absolute",
          bottom: "0%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ConnectButton />
      </Flex>
    </Flex>
  );
};

export default ConnectPage;
