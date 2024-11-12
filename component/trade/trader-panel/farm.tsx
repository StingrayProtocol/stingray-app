import { Flex, Image, Text } from "@/styled-antd";
import TokenInput from "./token-input";
import MainButton from "@/common/main-button";

const Farm = ({
  name,
  powerBy,
  activeFarm,
  onActiveFarm,
}: {
  name: string;
  powerBy: string;
  activeFarm: string;
  onActiveFarm: (name: string) => void;
}) => {
  const isActived = activeFarm === name;
  return (
    <Flex
      style={{
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        maxHeight: isActived ? "500px" : "80px",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
      align="center"
      vertical
    >
      <Flex
        style={{
          padding: isActived ? 0 : 8,
          display: isActived ? "none" : "flex",
          cursor: "pointer",
          width: "100%",
          zIndex: 1,
        }}
        justify="center"
        onClick={() => {
          onActiveFarm(name);
        }}
      >
        <Image preview={false} width={150} src={powerBy} alt={name} />
      </Flex>
      <Flex
        vertical
        gap="small"
        align="center"
        style={{
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingTop: isActived ? "32px" : "0px",
          paddingBottom: isActived ? "32px" : "0px",
          opacity: isActived ? 1 : 0,
          height: isActived ? "100%" : "0px",
          width: "100%",
        }}
      >
        <Flex align="center">
          <Text>Power By</Text>
          <Image preview={false} width={150} src={powerBy} alt={name} />
        </Flex>

        <TokenInput />

        <Flex
          align="center"
          justify="center"
          gap="small"
          style={{
            marginTop: "20px",
          }}
        >
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
            Deposit
          </MainButton>
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
            Withdraw
          </MainButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Farm;
