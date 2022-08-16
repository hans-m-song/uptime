import { WarningOutlined } from "@ant-design/icons";
import { ITarget } from "@uptime/lib/models";
import { Button, Form, Input, message } from "antd";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useTargets } from "../contexts/targets";
import { useAsync } from "../hooks/useAsync";

const { useMessage } = message;

export const TargetCreate = () => {
  const { listTargets } = useTargets();
  const [message, contextHolder] = useMessage();

  const createTarget = useCallback(
    (target: Omit<ITarget, "slug">) =>
      api
        .createTarget(target)
        .then((response) => {
          message.success(
            <>
              Created target:{" "}
              <Link to={`/targets/${response.target.slug}`}>
                {response.target.name}
              </Link>
            </>
          );
          listTargets();
        })
        .catch((error) => {
          console.error(error);
          message.error(`Failed to create target: ${error.message}`);
        }),
    [listTargets, message]
  );

  const [{ loading, error }, submit] = useAsync(createTarget);

  return (
    <Form onFinish={submit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      {contextHolder}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="URL"
        name="url"
        rules={[{ required: true, message: "URL is required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          danger={!!error}
          icon={error && <WarningOutlined />}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
