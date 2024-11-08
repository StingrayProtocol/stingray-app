import { getAnimationStyle } from "@/common/animation-style";
import { createCard } from "@/common/create-card";
import { Button, Flex, Form, Image, Upload } from "@/styled-antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { GetProp, message, UploadProps } from "antd";
import { useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const Step3 = ({
  step,
  suiNS,
  intro,
  onConfirm,
}: {
  step: number;
  suiNS: string;
  intro: string;
  onConfirm: (value: { intro: string }) => void;
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const UploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
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
      <div style={{ marginTop: 12, fontSize: "16px" }}>Upload</div>
    </button>
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

        const card = await createCard({
          imageUrl: url,
          name: intro,
        });
        console.log(card);
      });
    }
  };

  const avatar = Form.useWatch("avatar", form);
  console.log(avatar);

  return (
    <Flex
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
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
            <Form.Item name={"avatar"}>
              <Upload
                name="avatar"
                style={{
                  width: "150px",
                  height: "150px",
                }}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action=""
                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
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
            </Form.Item>
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

export default Step3;
