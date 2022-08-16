import { DeleteOutlined } from "@ant-design/icons";
import { message, PageHeader, PageHeaderProps, Tag, Typography } from "antd";
import { api } from "../api";
import { Target } from "../contexts/targets";
import { AsyncButton } from "./AsyncButton";

export interface TargetDetailHeaderProps extends PageHeaderProps {
  target: Target;
  onDelete?: () => void;
}

export const TargetDetailHeader = ({
  target,
  ...props
}: TargetDetailHeaderProps) => {
  const onDelete = () =>
    api
      .deleteTarget(target.slug)
      .then(() => {
        message.success(`Deleted target: ${target.name}`);
        props.onBack?.();
        props.onDelete?.();
      })
      .catch((error) => {
        console.error(error);
        message.error(`Failed to delete target: ${error.message}`);
      });

  return (
    <PageHeader
      ghost={false}
      title={target.name}
      subTitle={<Tag color="green">OK</Tag>}
      extra={
        <>
          <AsyncButton
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={onDelete}
          />
        </>
      }
      {...props}
    >
      <Typography.Link href={target.url} target="_blank" code copyable>
        {target.url}
      </Typography.Link>
    </PageHeader>
  );
};
