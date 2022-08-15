import { WarningOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import { AsyncFn, useAsync } from "../hooks/useAsync";

export interface AsyncButtonProps extends ButtonProps {
  onClick: AsyncFn;
}

export const AsyncButton = ({ onClick, ...props }: AsyncButtonProps) => {
  const [{ loading, error }, callback] = useAsync(onClick);

  return (
    <Button
      {...props}
      loading={loading && !error}
      danger={props.danger ?? !!error}
      onClick={callback}
      icon={error ? <WarningOutlined /> : props.icon}
    />
  );
};
