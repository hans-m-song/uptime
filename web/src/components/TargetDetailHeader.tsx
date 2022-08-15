import { DeleteOutlined } from "@ant-design/icons";
import { PageHeader, PageHeaderProps, Tag, Typography } from "antd";
import { api } from "../api";
import { Target } from "../contexts/targets";
import { AsyncButton } from "./AsyncButton";

export interface TargetDetailHeaderProps extends PageHeaderProps {
  target: Target;
}

export const TargetDetailHeader = ({
  target,
  ...props
}: TargetDetailHeaderProps) => (
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
          onClick={() =>
            api.deleteTarget(target.url).then(() => props.onBack?.())
          }
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
