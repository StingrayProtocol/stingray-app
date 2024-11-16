import { Flex, Form, Modal, Title } from "@/styled-antd";
import MainButton from "./main-button";
import FundTokenInput from "@/component/fund-token-input";
import useRemoveFund from "@/application/mutation/use-remove-fund";
import { Fund } from "@/type";

const RemoveFundModal = ({
  fund,
  isOpen,
  onClose,
}: {
  fund?: Fund;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const { mutate: removeFund, isPending } = useRemoveFund({
    onSuccess: () => {
      form.resetFields();
      onClose();
    },
  });

  return (
    <>
      <Modal
        centered
        title={
          <Title level={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            Remove Fund
          </Title>
        }
        open={isOpen}
        onCancel={() => {
          onClose();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(d) => {
            const data = d as { amount: number };
            if (!fund) return;
            removeFund({ fund, amount: data.amount });
          }}
        >
          <Form.Item name="amount">
            <Flex
              style={{
                paddingTop: "24px",
                paddingBottom: "24px",
              }}
              align="center"
            >
              <FundTokenInput fund={fund} action="remove" />
            </Flex>
          </Form.Item>
          <Form.Item name="submit">
            <Flex align="center" justify="center">
              <MainButton
                htmlType="submit"
                style={{
                  backgroundColor: "rgba(120, 0, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: "40px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  padding: "20px",
                }}
                loading={isPending}
              >
                Confirm
              </MainButton>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RemoveFundModal;