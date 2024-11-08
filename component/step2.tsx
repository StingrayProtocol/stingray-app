import { getAnimationStyle } from "@/common/animation-style";
import { Button, Flex, Form, Input, Text, Title } from "@/styled-antd";
import { LockOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const Step2 = ({
  step,
  suiNS,
  onConfirm,
}: {
  step: number;
  suiNS: string;
  onConfirm: (value: { intro: string }) => void;
}) => {
  console.log(suiNS);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldValue("suiNS", suiNS);
  }, [form, suiNS]);
  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        padding: 20,
        ...getAnimationStyle(1, step),
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
            border: "1px solid #333",
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
              label={<Title level={4}>Trader Info</Title>}
              name={"suiNS"}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label={
                <Flex gap="middle" vertical>
                  <Title level={4}>Brief Intro</Title>
                  <Text
                    style={{
                      position: "absolute",
                      top: "24px",
                      fontSize: "12px",
                    }}
                  >
                    Max 150 Words
                  </Text>
                </Flex>
              }
              name={"intro"}
            >
              <Input.TextArea rows={4} />
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
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </Flex>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Step2;
