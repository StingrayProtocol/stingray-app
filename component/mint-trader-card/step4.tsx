import { getAnimationStyle } from "@/common/animation-style";
import { createCard } from "@/common/create-card";
import { Button, Flex, Form, Image, Text, Title, Upload } from "@/styled-antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import { useEffect, useState } from "react";
import tempAvatar from "@/public/Stingray-Color.png";
import useMintTraderCard from "@/application/mutation/use-mint-trader-card";
import { useRouter } from "next/navigation";
import { beforeUpload, FileType, getBase64 } from "@/common/upload-utils";
import MainButton from "@/common/main-button";

const Step4 = ({
  step,
  suiNS,
  intro,
}: {
  step: number;
  suiNS?: {
    id: string;
    name: string;
    image_url: string;
  };
  intro: string;
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [canvasBlob, setCanvasBlob] = useState<Blob>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: mint, isPending: isMinting, isSuccess } = useMintTraderCard();

  const UploadButton = (
    <Flex
      style={{
        border: 0,
        background: "none",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
      vertical
      gap="small"
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

        setCanvasBlob(
          await createCard({
            imageUrl: url,
            name: suiNS?.name ?? "",
            intro,
          })
        );
      });
    }
  };

  useEffect(() => {
    if (!suiNS) return;
    (async () => {
      setCanvasBlob(
        await createCard({
          imageUrl: tempAvatar.src,
          name: suiNS.name,
          intro,
        })
      );
    })();
  }, [suiNS, intro]);

  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "40px",
        height: "100%",
        ...getAnimationStyle(3, step),
      }}
    >
      <Form
        form={form}
        style={{
          width: "100%",
        }}
        onFinish={async () => {
          if (!canvasBlob) return;
          mint({
            suiNS: suiNS?.id ?? "",
            intro,
            imageUrl: imageUrl || tempAvatar.src,
            canvasBlob,
          });
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
          gap="middle"
        >
          <Flex
            style={{
              width: "100%",
            }}
            gap="middle"
          >
            <Flex flex="1">
              <Flex
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%",
                }}
              >
                <Flex
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <canvas
                    id="canvas"
                    width={512}
                    height={512}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>

            <Flex
              style={{
                width: "100%",
              }}
              flex="1"
            >
              {isSuccess ? (
                <Flex
                  vertical
                  gap="middle"
                  align="center"
                  justify="center"
                  style={{
                    width: "100%",
                  }}
                >
                  <Title level={4}>Congradulation!</Title>
                  <Text>You have successfully minted your funder ID!</Text>
                  <Text>It&apos;s time to get some funding!</Text>
                  <Button
                    type="primary"
                    onClick={() => {
                      router.push("/create/fund");
                    }}
                  >
                    Get Fund
                  </Button>
                </Flex>
              ) : (
                <Form.Item
                  style={{
                    width: "100%",
                  }}
                  name={"avatar"}
                >
                  <Flex
                    style={{
                      width: "100%",
                    }}
                    vertical
                    gap="small"
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      accept=".png,.jpeg"
                      showUploadList={false}
                      action=""
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <Image
                          preview={false}
                          src={imageUrl}
                          alt="avatar"
                          width={150}
                          height={150}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        UploadButton
                      )}
                    </Upload>
                    <Text>Accept format: .png, .jpeg</Text>
                  </Flex>
                </Form.Item>
              )}
            </Flex>
          </Flex>

          <Form.Item
            name={"mint"}
            style={{
              marginBottom: 0,
              display: isSuccess ? "none" : "block",
            }}
          >
            <Flex justify="flex-end" align="center">
              <MainButton loading={isMinting} htmlType="submit">
                Mint
              </MainButton>
            </Flex>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Step4;
