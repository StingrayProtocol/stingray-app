import ConnectButton from "@/common/connect-button";
import { Flex, Title } from "@/styled-antd";

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
      <Title
        style={{
          fontSize: "80px",
          textAlign: "center",
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        JOIN STINGRAYLABS
      </Title>
      <Title
        style={{
          textAlign: "center",
          fontSize: "80px",
          color: "transparent !important",
          WebkitTextStroke: "1px white",
          opacity: 0.2,
        }}
      >
        JOIN STINGRAYLABS
      </Title>
      <Title
        style={{
          textAlign: "center",
          fontSize: "80px",
          color: "transparent !important",
          WebkitTextStroke: "1px white",
          opacity: 0.05,
        }}
      >
        JOIN STINGRAYLABS
      </Title>
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
