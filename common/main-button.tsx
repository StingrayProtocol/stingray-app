import { Button } from "@/styled-antd";
import { ButtonProps } from "antd";
import style from "./main-button.module.css";

const MainButton = ({
  children,
  ...restProps
}: {
  children: React.ReactNode;
} & ButtonProps) => {
  return (
    <Button
      className={style.mainButton}
      type="text"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "40px",
        fontSize: "24px",
        fontWeight: "bold",
        padding: "22px",
      }}
      size="large"
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default MainButton;
