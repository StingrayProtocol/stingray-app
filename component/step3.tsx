import { getAnimationStyle } from "@/common/animation-style";
import { Button, Flex, Form, Input, Text, Title, Upload } from "@/styled-antd";
import { LockOutlined } from "@ant-design/icons";
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
            <Form.Item
              label={<Title level={4}>Trader Info</Title>}
              name={"suiNS"}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={(e) => {
                  console.log(e);
                }}
              >
                {/* {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )} */}
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
