import { getAnimationStyle } from "@/common/animation-style";
import MainButton from "@/common/main-button";
import { Flex, Form, Input, Text } from "@/styled-antd";
import { LockOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const Step3 = ({
  step,
  suiNS,
  onConfirm,
}: {
  step: number;
  suiNS?: {
    id: string;
    name: string;
    image_url: string;
  };
  onConfirm: (value: { intro: string }) => void;
}) => {
  console.log(suiNS);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldValue("suiNS", suiNS?.name);
  }, [form, suiNS]);
  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "40px",
        padding: 20,
        ...getAnimationStyle(2, step),
      }}
    >
      <Form
        form={form}
        style={{
          width: "100%",
        }}
        onFinish={(value) => {
          onConfirm(value as { intro: string });
        }}
      >
        <Flex
          style={{
            padding: 20,
            width: "100%",
            height: "100%",
          }}
          justify="space-between"
          vertical
        >
          <Flex
            style={{
              width: "100%",
              height: "80%",
              overflow: "auto",
            }}
            vertical
            gap="large"
          >
            <Form.Item
              layout="vertical"
              label={
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  Trader Info
                </Text>
              }
              name={"suiNS"}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              layout="vertical"
              label={
                <Flex vertical>
                  <Text
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Brief Intro
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Max 100 Words
                  </Text>
                </Flex>
              }
              rules={[
                {
                  max: 100,
                  message: "Max 100 words",
                },
              ]}
              name={"intro"}
            >
              <Input.TextArea showCount rows={5} maxLength={100} />
            </Form.Item>
            <Flex gap="small">
              <LockOutlined
                style={{
                  color: "white",
                }}
              />
              <Text>
                Join Date:{" "}
                {Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                }).format(Date.now())}
              </Text>
            </Flex>
          </Flex>

          <Form.Item>
            <Flex justify="flex-end">
              <MainButton type="primary" htmlType="submit">
                Confirm
              </MainButton>
            </Flex>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Step3;
