import useGetOwnedSuiNS from "@/application/use-get-owned-sui-ns";
import { getAnimationStyle } from "@/common/animation-style";
import { Button, Flex, Form, Image, Radio } from "@/styled-antd";

const Step1 = ({
  step,
  onConfirm,
}: {
  step: number;
  onConfirm: (value: { suiNS: string }) => void;
}) => {
  const { data: _suiNS } = useGetOwnedSuiNS();
  const suiNS = {
    lists: Array.from(Array(50)).flatMap(() => _suiNS?.lists || []),
  };
  const [form] = Form.useForm();
  const selected = Form.useWatch("suiNS", form);
  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        padding: 20,
        ...getAnimationStyle(0, step),
      }}
    >
      <Form
        form={form}
        style={{
          width: "100%",
        }}
        onFinish={(value) => {
          onConfirm(value as { suiNS: string });
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
          >
            <Form.Item
              name={"suiNS"}
              rules={[
                {
                  required: true,
                  message: "Please select SuiNS",
                },
              ]}
            >
              <Radio.Group>
                <Flex wrap="wrap" gap="middle">
                  {suiNS?.lists?.map((item, i) => (
                    <label
                      key={i}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Flex
                        style={{
                          width: "120px",
                          height: "120px",
                          position: "relative",
                        }}
                      >
                        <Radio
                          style={{
                            position: "absolute",
                            zIndex: 1,
                            right: "0px",
                            top: "5px",
                          }}
                          value={item.name}
                        />
                        <Image preview={false} alt="" src={item.image_url} />
                      </Flex>
                    </label>
                  ))}
                </Flex>
              </Radio.Group>
            </Form.Item>
          </Flex>

          <Form.Item>
            <Flex justify="flex-end">
              <Button type="primary" htmlType="submit" disabled={!selected}>
                Confirm
              </Button>
            </Flex>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Step1;
