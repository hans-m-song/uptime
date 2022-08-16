import { Button, Empty, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Centre } from "./Centre";
import { useTargets } from "../contexts/targets";
import { TargetDetailHeader } from "./TargetDetailHeader";

export const TargetDetail = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { targets, listTargets } = useTargets();
  const target = targets.find(({ slug }) => id === slug);
  const toRoot = () => nav("/");

  if (!target) {
    return (
      <Centre>
        <Empty description="Target not found">
          <Button type="primary" onClick={toRoot}>
            Return
          </Button>
        </Empty>
      </Centre>
    );
  }

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <TargetDetailHeader
        target={target}
        onBack={toRoot}
        onDelete={listTargets}
      />
    </Space>
  );
};
