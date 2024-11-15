import { Flex, Title } from "@/styled-antd";
import style from "./title-template.module.css";

const TitleTemplate = ({ title, full }: { title: string; full?: boolean }) => {
  const stlyes = full ? [0.5, 0.2, 0.05] : [0.5, 0.2];
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
        {title}
      </Title>
      {stlyes.map((opacity, i) => (
        <h1
          key={i}
          style={{
            opacity,
            fontSize: "80px",
          }}
          className={style.titleTemplate}
        >
          {title}
        </h1>
      ))}
    </Flex>
  );
};

export default TitleTemplate;
