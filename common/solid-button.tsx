import { Button } from "@/styled-antd";
import { ButtonProps } from "antd";
import style from "./solid-button.module.css";

const SolidButton = ({
  children,
  ...restProps
}: {
  children: React.ReactNode;
} & ButtonProps) => {
  return (
    <Button
      className={style.solidButton}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "40px",
      }}
      type="primary"
      size="large"
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default SolidButton;
