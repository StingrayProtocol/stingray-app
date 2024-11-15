import MainButton from "@/common/main-button";
import TraderInfo from "@/common/trader-info";
import { beforeUpload, FileType, getBase64 } from "@/common/upload-utils";
import {
  Flex,
  Form,
  Image,
  Progress,
  Segmented,
  Slider,
  Text,
  Upload,
} from "@/styled-antd";
import { LoadingOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { Input, message, UploadProps } from "antd";
import { useEffect, useState } from "react";
import buttonBg from "@/public/button-background.png";
import useCreateFund from "@/application/mutation/use-create-fund";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import useAttendArena from "@/application/mutation/use-attend-arena";
import useGetCurrentArena from "@/application/query/use-get-current-arena";
import { toLocalISOString, typeToTimestampms } from "@/common";

const CreateFund = () => {
  const { data: traderCard } = useGetOwnedTraderCard();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const strategy = Form.useWatch("strategy", form);
  const intro = Form.useWatch("intro", form);
  const limit = Form.useWatch("limit", form);
  const amount = Form.useWatch("amount", form);
  const isArena = Form.useWatch("isArena", form);
  const startTime = Form.useWatch("start_time", form);
  const endTime = Form.useWatch("end_time", form);
  const [rate, setRate] = useState(20);
  const [roi, setRoi] = useState(5);
  const [durationType, setDurationType] = useState(0);
  const { data: arenas } = useGetCurrentArena();
  const arena = arenas?.[arenas?.length - 1];
  console.log(arena);
  useEffect(() => {
    if (isArena && Boolean(arena)) {
      //no need to set
      // form.setFieldValue(
      //   "start_time",
      //   toLocalISOString(
      //     Number(arena?.start_time) + Number(arena?.attend_duration)
      //   )
      // );

      form.setFieldValue(
        "end_time",
        toLocalISOString(
          Number(arena?.start_time) +
            Number(arena?.attend_duration) +
            Number(arena?.invest_duration)
        )
      );
    }
  }, [arena, form, isArena]);

  const { mutate: createFund, isPending: isCreatingFund } = useCreateFund({
    onSuccess: () => {
      message.success("Create fund success");
    },
  });

  const { mutate: attendArena, isPending: isAttendingArena } = useAttendArena();

  const UploadButton = (
    <Flex
      style={{
        width: "100%",
        paddingTop: "100%",
      }}
    >
      <Flex
        vertical
        gap="small"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
        }}
        justify="center"
        align="center"
      >
        {loading ? (
          <LoadingOutlined
            style={{
              fontSize: "16px",
            }}
          />
        ) : (
          <PlusOutlined
            style={{
              fontSize: "16px",
            }}
          />
        )}
        <Text style={{ marginTop: 12, fontSize: "16px" }}>Upload</Text>
      </Flex>
    </Flex>
  );

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, async (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <Flex
      style={{
        padding: 20,
        height: "768px",
        maxWidth: "1200px",
        width: "100%",
      }}
      vertical
    >
      <Form
        form={form}
        style={{
          width: "100%",
        }}
        onFinish={(d) => {
          // if (!imageUrl) {
          //   message.error("Please upload avatar");
          //   return;
          // }
          if (!traderCard?.owner_address) {
            message.error("Please create a trader card first");
            return;
          }
          console.log(d);
          const data = d as {
            imageUrl: string;
            strategy: string;
            intro: string;
            isArena: boolean;
            amount: number;
            rate: number;
            limit: number;
            start_time: string;
            end_time: string;
            duration_type: number;
            roi: number;
          };
          const startTime = new Date(data.start_time).getTime();
          const endTime = new Date(data.end_time).getTime();
          if (!data.isArena) {
            createFund({
              imageUrl,
              name: data.strategy,
              description: data.intro,
              amount: data.amount,
              traderFee: data.rate,
              limit: data.limit,
              startTime,
              endTime,
              trader: traderCard?.object_id,
              tradeDuration: typeToTimestampms(durationType),
              roi: data.roi,
            });
          } else {
            attendArena({
              imageUrl,
              name: data.strategy,
              description: data.intro,
              amount: data.amount,
              traderFee: data.rate,
              limit: data.limit,
              startTime,
              endTime,
              trader: traderCard?.object_id,
              arenaId: arena?.object_id,
              tradeDuration: Number(arena?.attend_duration),
              roi: data.roi,
            });
          }
        }}
      >
        <Flex
          vertical
          gap="small"
          style={{
            backgroundColor: "rgba(120, 0, 255, 0.2)",
            padding: 32,
            borderRadius: 40,
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <Flex gap="middle">
            <Flex
              flex="1"
              style={{
                maxWidth: "320px",
                paddingRight: "32px",
                borderRight: "1px solid rgba(255, 255, 255, 0.5)",
                paddingBottom: "32px",
              }}
              vertical
            >
              <Form.Item
                style={{
                  width: "100%",
                }}
                name={"avatar"}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  accept=".png,.jpeg"
                  showUploadList={false}
                  action={""}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <Image
                      preview={false}
                      width="100%"
                      height="100%"
                      src={imageUrl}
                      alt="avatar"
                    />
                  ) : (
                    UploadButton
                  )}
                </Upload>
                {/* <Text>Accept format: .png, .jpeg</Text> */}
              </Form.Item>
              <Flex gap="small" vertical flex="1">
                <TraderInfo traderCard={traderCard} />
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {strategy}
                </Text>
                <Text
                  style={{
                    wordBreak: "break-word",
                    lineHeight: "16px",
                  }}
                >
                  {intro}
                </Text>
              </Flex>
              <Flex vertical>
                <Flex justify="space-between" align="center">
                  <Text>
                    Funded {isNaN(amount) ? 0 : amount} SUI (
                    {!isNaN(amount / limit)
                      ? ((amount / limit) * 100)?.toFixed(2)
                      : 0}
                    %)
                  </Text>
                  <Flex gap="small">
                    <Text>1</Text>
                    <TeamOutlined />
                  </Flex>
                </Flex>
                <Progress
                  percent={(amount / limit) * 100 || 0}
                  status="active"
                  format={() => ``}
                  // strokeColor={{ from: '#108ee9', to: '#87d068' }}
                />
              </Flex>
            </Flex>
            <Flex
              flex="1"
              gap="small"
              style={{
                background: "rgba(120, 0, 255, 0.2)",
                border: "1px solid rgba(255,255,255, 0.5)",
                padding: "20px",
                borderRadius: "20px",
              }}
              vertical
            >
              <Flex gap="small">
                <Flex
                  flex="1"
                  style={{
                    flexShrink: 0,
                  }}
                  vertical
                >
                  <Form.Item
                    layout="vertical"
                    label={<Text>Strategy Name (≤ 20 words)</Text>}
                    name={"strategy"}
                    rules={[
                      {
                        max: 20,
                        message: "Max 20 words",
                      },
                    ]}
                  >
                    <Input
                      maxLength={20}
                      style={{
                        fontWeight: "bold",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{
                      height: "251px",
                    }}
                    layout="vertical"
                    label={<Text>Strategy Description (≤ 200 words)</Text>}
                    rules={[
                      {
                        max: 200,
                        message: "Max 200 words",
                      },
                    ]}
                    name={"intro"}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 9, maxRows: 9 }}
                      style={{
                        padding: "8px",
                        fontSize: "18px",
                        lineHeight: "24px",
                      }}
                      rows={2}
                      maxLength={200}
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    style={{
                      marginBottom: "0px",
                      marginTop: "26px",
                    }}
                    initialValue={roi.toString()}
                    label={<Text>Expected ROI</Text>}
                    name={"roi"}
                  >
                    <Flex align="center" gap="small">
                      <Slider
                        style={{
                          flex: 1,
                        }}
                        tooltip={{
                          formatter: null,
                        }}
                        onChange={(value) => {
                          setRoi(value);
                        }}
                        value={roi}
                        max={1000}
                      />
                      <Text>{isNaN(roi) ? 0 : roi}%</Text>
                    </Flex>
                  </Form.Item>
                </Flex>
                <Flex flex="1" vertical>
                  <Form.Item
                    layout="vertical"
                    label={<Text>Limit Funding Amount</Text>}
                    name={"limit"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (isNaN(value)) {
                            return Promise.reject(
                              "Limit funding amount should be a number"
                            );
                          }

                          if (value > 100000) {
                            return Promise.reject(
                              "Limit funding amount too high"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      style={{
                        fontWeight: "bold",
                      }}
                      suffix={<Text>SUI</Text>}
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    label={<Text>Self Funding Amount</Text>}
                    name={"amount"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (isNaN(value)) {
                            return Promise.reject(
                              "Self funding amount should be a number"
                            );
                          }

                          if (value > limit / 10) {
                            return Promise.reject(
                              "Self funding amount should be less than limit"
                            );
                          }
                          if (value < limit / 100) {
                            return Promise.reject(
                              "Self funding amount too low"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      style={{
                        fontWeight: "bold",
                      }}
                      suffix={<Text>SUI</Text>}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{
                      display: "none",
                    }}
                    layout="vertical"
                    initialValue={toLocalISOString(new Date().getTime())}
                    label={<Text>Funding Start Time:</Text>}
                    name={"start_time"}
                  >
                    <Input
                      style={{
                        width: "100%",
                        fontSize: "24px",
                        fontWeight: "bold",
                        background: "rgba(155, 155, 155, 0.2)",
                      }}
                      disabled={isArena}
                      value={
                        isArena
                          ? new Date().toISOString().slice(0, 16)
                          : startTime
                      }
                      type="datetime-local"
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    label={<Text>Funding End Time:</Text>}
                    name={"end_time"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (
                            new Date(value).getTime() <=
                            new Date(form.getFieldValue("start_time")).getTime()
                          ) {
                            return Promise.reject(
                              "End time should be later than now"
                            );
                          }
                          if (!value) {
                            return Promise.reject("End time is required");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      disabled={isArena}
                      type="datetime-local"
                      style={{
                        width: "100%",
                        fontSize: "24px",
                        fontWeight: "bold",
                        background: "rgba(155, 155, 155, 0.2)",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    style={{
                      width: "100%",
                    }}
                    label={
                      <Text
                        style={{
                          paddingBottom: 4,
                        }}
                      >
                        Trading Peiod:{" "}
                        {new Date(
                          new Date(endTime).getTime()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          typeToTimestampms(durationType) +
                            new Date(endTime).getTime()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    }
                    name={"duration_type"}
                  >
                    <Segmented
                      onChange={(v: unknown) => {
                        const value = v as number;
                        setDurationType(value);
                      }}
                      style={{
                        background: "rgba(120, 0, 255, 0.2)",
                        border: "1px solid rgba(255,255,255, 0.5)",
                        padding: "4px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        gap: 16,
                        width: "100%",
                      }}
                      block
                      options={[
                        {
                          label: "1W",
                          value: 0,
                        },
                        {
                          label: "1M",
                          value: 1,
                        },
                        {
                          label: "3M",
                          value: 2,
                        },
                        {
                          label: "1Y",
                          value: 3,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Text>Trader Profit Share Rate:</Text>}
                    name={"rate"}
                    layout="vertical"
                    initialValue={rate.toString()}
                    style={{
                      marginBottom: "0px",
                    }}
                  >
                    <Flex gap="small" align="center">
                      <Slider
                        style={{
                          flex: 1,
                        }}
                        tooltip={{
                          formatter: null,
                        }}
                        onChange={(value) => {
                          setRate(value);
                        }}
                        value={rate}
                        max={20}
                      />
                      <Text>{isNaN(rate) ? 0 : rate}%</Text>
                    </Flex>
                  </Form.Item>
                </Flex>
              </Flex>

              <Flex
                gap="small"
                style={{
                  width: "100%",
                }}
                align="center"
                justify="space-between"
              >
                <Form.Item
                  layout="vertical"
                  label={
                    <Text
                      style={{
                        paddingBottom: 4,
                      }}
                    >
                      Join Arena
                    </Text>
                  }
                  name={"isArena"}
                  initialValue={false}
                >
                  <Segmented
                    block
                    style={{
                      background: "rgba(120, 0, 255, 0.2)",
                      border: "1px solid rgba(255,255,255, 0.5)",
                      padding: "4px",
                      fontSize: "32px",
                      fontWeight: "bold",
                      gap: 16,
                      overflow: "hidden",
                    }}
                    options={[
                      { label: "Y", value: true },
                      { label: "N", value: false },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  label={
                    <Text
                      style={{
                        fontSize: 14,
                      }}
                    />
                  }
                >
                  <MainButton
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      borderRadius: "40px",
                      fontSize: "24px",
                      fontWeight: "bold",
                      padding: "22px",
                      backgroundImage: `url(${buttonBg.src})`,
                      margin: "0px",
                      backgroundSize: "103%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "-2px -2px",
                    }}
                    loading={isCreatingFund || isAttendingArena}
                  >
                    Create
                  </MainButton>
                </Form.Item>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Flex>
  );
};

export default CreateFund;
