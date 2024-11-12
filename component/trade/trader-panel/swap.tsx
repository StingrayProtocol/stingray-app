import { Button, Flex, Image, Text } from "@/styled-antd";
import TokenInput from "./token-input";
import { SwapOutlined } from "@ant-design/icons";
import cetus from "@/public/partner-cetus.png";
import MainButton from "@/common/main-button";

const Swap = () => {
  return (
    <Flex
      style={{
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        padding: "32px",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      }}
      vertical
      gap="middle"
      align="center"
    >
      <Flex align="center">
        <Text>Power By</Text>
        <Image preview={false} width={150} src={cetus.src} alt="Cetus" />
      </Flex>

      <TokenInput isSwap />
      <Button
        type="text"
        style={{
          width: "36px",
        }}
      >
        <SwapOutlined
          style={{
            fontSize: "24px",
            transform: "rotate(90deg)",
          }}
        />
      </Button>

      <TokenInput isSwap />
      <MainButton
        type="text"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "40px",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "20px",
        }}
        size="large"
      >
        Swap
      </MainButton>
    </Flex>
  );
};

export default Swap;
