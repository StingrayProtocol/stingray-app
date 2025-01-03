// import useGetOwnedSuiNS from "@/application/use-get-owned-sui-ns";
import useGetOwnedSuiNS from "@/application/use-get-owned-sui-ns";
import { getAnimationStyle } from "@/common/animation-style";
import MainButton from "@/common/main-button";
import { Button, Flex, Form, Image, Radio, Text } from "@/styled-antd";

const Step2 = ({
  step,
  onConfirm,
}: {
  step: number;
  onConfirm: (value: { id: string; name: string; image_url: string }) => void;
}) => {
  const { data: suiNS } = useGetOwnedSuiNS();
  // const suiNS = {
  //   lists: Array.from(Array(50)).flatMap(() => _suiNS?.lists || []),
  // };
  // const suiNS = {
  //   lists: [
  //     {
  //       name: "paulwu.sui",
  //       image_url: "https://api-mainnet.suins.io/nfts/paulwu.sui/1750311497913",
  //     },
  //   ],
  // };
  const [form] = Form.useForm();
  const selected = Form.useWatch("suiNS", form);
  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        backgroundColor: "rgba(120, 0, 255, 0.2)",
        borderRadius: "40px",
        padding: 20,
        ...getAnimationStyle(1, step),
      }}
    >
      <Form
        form={form}
        style={{
          width: "100%",
        }}
        onFinish={(v) => {
          const value = v as {
            suiNS: string;
          };

          const data = suiNS?.lists?.find((item) => item.id === value.suiNS);

          onConfirm({
            id: value.suiNS,
            name: data?.name || "",
            image_url: data?.image_url || "",
          });
        }}
      >
        <Flex
          style={{
            padding: 20,
            width: "100%",
            height: "100%",
            borderRadius: "40px",
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
            {suiNS?.lists?.length === 0 && (
              <Flex
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                gap="large"
                vertical
              >
                <Text>
                  You don&apos;t have any SuiNS yet. Please go to suins.io to
                  get one.
                </Text>
                <Button type="primary" href="https://suins.io/">
                  Get Sui Name Service
                </Button>
              </Flex>
            )}
            <Form.Item
              name={"suiNS"}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please select SuiNS",
              //   },
              // ]}
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
                          value={item.id}
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
              {/* <MainButton type="primary" htmlType="submit" disabled={!selected}> */}
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

export default Step2;
