"use client";
import React, { useState } from "react";

import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Title,
} from "@/styled-antd";
import {
  ConnectButton,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { CloseOutlined } from "@ant-design/icons";

type PtbLast = {
  package: string;
  module: string;
  function: string;
  arguments: { type: string; value: string }[];
  types: string[];
};

type Ptb = {
  package: string;
  module: string;
  function: string;
  arguments: {
    type: string;
    value: string | PtbLast;
  }[];
  types: string[];
};

const MoveCallModal = ({
  argIndex,
  ptbIndex,
}: {
  argIndex: number;
  ptbIndex: number;
}) => {
  const [isOpen, setMoveCallOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  console.log(argIndex, ptbIndex);
  return (
    <>
      <Button
        style={{
          border: confirmed ? "1px solid green" : "1px solid #ccc",
          color: confirmed ? "green" : "#ccc",
        }}
        onClick={() => {
          setMoveCallOpen(true);
        }}
      >
        Move Call
      </Button>
      {(isOpen || !confirmed) && (
        <Flex
          style={{
            display: isOpen ? "flex" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
          }}
        >
          <Flex
            style={{
              padding: "1rem",
              backgroundColor: "rgba(0,0,0)",
              width: "600px",
            }}
            vertical
            gap="1rem"
          >
            <Title level={5}>Move Call</Title>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Package</Title>
              <Form.Item name={[argIndex, "package"]} layout="vertical">
                <Input placeholder="package" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>module</Title>
              <Form.Item name={[argIndex, "module"]} layout="vertical">
                <Input placeholder="module" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>function</Title>
              <Form.Item name={[argIndex, "function"]} layout="vertical">
                <Input placeholder="function" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Arguments</Title>
              <Form.List name={[argIndex, "arguments"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }, i) => (
                      <Flex gap="small" key={i}>
                        <Form.Item
                          name={[name, "value"]}
                          style={{
                            marginBottom: 0,
                            width: "100%",
                          }}
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <Form.Item
                          name={[name, "type"]}
                          style={{
                            marginBottom: 0,
                            minWidth: "100px",
                          }}
                        >
                          <Select placeholder="type">
                            <Select.Option value="string">string</Select.Option>
                            <Select.Option value="object">object</Select.Option>
                            <Select.Option value="u64">u64</Select.Option>
                            <Select.Option value="u8">u8</Select.Option>
                            <Select.Option value="bool">bool</Select.Option>
                            <Select.Option value="gas">gas</Select.Option>
                          </Select>
                        </Form.Item>
                        <Button
                          onClick={() => {
                            remove(name);
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      </Flex>
                    ))}
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      Add Argument
                    </Button>
                  </>
                )}
              </Form.List>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Types</Title>
              <Form.List name={[argIndex, "types"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Flex
                        key={key}
                        style={{
                          gap: "1rem",
                          width: "100%",
                        }}
                      >
                        <Form.Item
                          name={name}
                          style={{
                            marginBottom: 0,
                            gap: "1rem",
                            width: "100%",
                          }}
                        >
                          <Input
                            placeholder="type"
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                        <Button
                          onClick={() => {
                            remove(name);
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      </Flex>
                    ))}
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      Add types
                    </Button>
                  </>
                )}
              </Form.List>
            </Flex>
            <Flex gap="middle">
              <Button
                type="primary"
                onClick={() => {
                  setMoveCallOpen(false);
                  setConfirmed(true);
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setMoveCallOpen(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

const page = () => {
  const suiClient = useSuiClient();
  const [ptbNumber, setPtbNumber] = useState(1);
  const [moveCallOpen, setMoveCallOpen] = useState(false);

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });

  const getArgument = ({
    ptbIndex,
    type,
    value,
    tx,
  }: {
    ptbIndex: number;
    type: string;
    value: string | PtbLast;
    tx: Transaction;
  }): any => {
    if (type === "move call") {
      const ptb = value as PtbLast;
      return tx.moveCall({
        package: ptb.package,
        module: ptb.module,
        function: ptb.function,
        arguments: ptb.arguments.map((arg) =>
          getArgument({
            ptbIndex,
            type: arg.type,
            value: arg.value,
            tx,
          })
        ),
        typeArguments: ptb.types,
      });
    }

    const valueString = value as string;
    if (type === "u64") {
      return tx.pure.u64(Number(value));
    } else if (type === "u8") {
      return tx.pure.u8(Number(value));
    } else if (type === "object") {
      return tx.object(valueString);
    } else if (type === "string") {
      return tx.pure.string(valueString);
    } else if (type === "bool") {
      return tx.pure.bool(value === "true");
    } else if (type === "gas") {
      return tx.splitCoins(tx.gas, [Number(value) * 10 ** 10]);
    }
    return tx.object(valueString);
  };

  const { mutate } = useMutation({
    mutationFn: async (ptbs: Ptb[]) => {
      const tx = new Transaction();
      console.log(ptbs);
      ptbs.forEach((ptb, ptbIndex) => {
        tx.moveCall({
          package: ptb.package,
          module: ptb.module,
          function: ptb.function,
          arguments: ptb.arguments.map((arg, argIndex) =>
            getArgument({
              ptbIndex,
              type: arg.type,
              value: arg.value,
              tx,
            })
          ),
          typeArguments: ptb.types,
        });
      });
      console.log(ptbs);
      console.log(tx);
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(result);
      return result;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Flex
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "500px",
        gap: "1rem",
        margin: "0 auto",
        marginTop: "2rem",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          width: "100%",
        }}
      >
        <Title level={3}>PTB</Title>
        <ConnectButton />
      </Flex>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
        onFinish={(value) => {
          const ptbs: Ptb[] = [];
          console.log(value);
          const result = value as Record<
            string,
            | string
            | {
                type: string;
                value: string;
              }[]
            | string[]
          >;
          for (let i = 0; i < ptbNumber; i++) {
            ptbs.push({
              package: result[`package-${i}`] as string,
              module: result[`module-${i}`] as string,
              function: result[`function-${i}`] as string,
              arguments: (result[`arguments-${i}`] as any[]).map((argument) => {
                if (argument?.package) {
                  return {
                    type: "move call",
                    value: {
                      package: argument.package,
                      module: argument.module,
                      function: argument.function,
                      arguments: (argument.arguments as any[]).map((arg) => {
                        return {
                          type: arg.type,
                          value: arg.value,
                        };
                      }),
                      types: argument.types,
                    },
                  };
                } else {
                  return {
                    type: argument.type,
                    value: argument.value,
                  };
                }
              }),
              types: result[`types-${i}`] as string[],
            });
          }
          console.log(ptbs);
          mutate(ptbs);
        }}
      >
        {Array.from(Array(ptbNumber))?.map((_, i) => (
          <Flex
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
            }}
            vertical
            gap="1rem"
          >
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Package</Title>
              <Form.Item name={`package-${i}`} layout="vertical">
                <Input placeholder="package" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>module</Title>
              <Form.Item name={`module-${i}`} layout="vertical">
                <Input placeholder="module" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>function</Title>
              <Form.Item name={`function-${i}`} layout="vertical">
                <Input placeholder="function" />
              </Form.Item>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Arguments</Title>
              <Form.List name={`arguments-${i}`}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }, j) => (
                      <Flex gap="small" key={i}>
                        <Form.Item
                          name={[name, "value"]}
                          style={{
                            marginBottom: 0,
                            width: "100%",
                          }}
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <Form.Item
                          name={[name, "type"]}
                          style={{
                            marginBottom: 0,
                            minWidth: "100px",
                          }}
                        >
                          <Select placeholder="type">
                            <Select.Option value="string">string</Select.Option>
                            <Select.Option value="object">object</Select.Option>
                            <Select.Option value="u64">u64</Select.Option>
                            <Select.Option value="u8">u8</Select.Option>
                            <Select.Option value="bool">bool</Select.Option>
                            <Select.Option value="gas">gas</Select.Option>
                          </Select>
                        </Form.Item>

                        <MoveCallModal argIndex={j} ptbIndex={i} />
                        <Button
                          onClick={() => {
                            remove(name);
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      </Flex>
                    ))}
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      Add Argument
                    </Button>
                  </>
                )}
              </Form.List>
            </Flex>
            <Flex
              style={{
                flexDirection: "column",
              }}
              gap="small"
            >
              <Title level={5}>Types</Title>
              <Form.List name={`types-${i}`}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Flex
                        key={key}
                        style={{
                          gap: "1rem",
                          width: "100%",
                        }}
                      >
                        <Form.Item
                          name={name}
                          style={{
                            marginBottom: 0,
                            gap: "1rem",
                            width: "100%",
                          }}
                        >
                          <Input
                            placeholder="type"
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                        <Button
                          onClick={() => {
                            remove(name);
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      </Flex>
                    ))}
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      Add types
                    </Button>
                  </>
                )}
              </Form.List>
            </Flex>
          </Flex>
        ))}
        <Button
          onClick={() => {
            setPtbNumber(ptbNumber + 1);
          }}
        >
          Add ptbs
        </Button>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Run
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default page;
