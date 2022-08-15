import { Layout, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTargets } from "./contexts/targets";
import { NavigationMenu } from "./components/NavigationMenu";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { TargetDetail } from "./components/TargetDetailSummary";
import { TargetCreate } from "./components/TargetCreate";

export const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { loading, listTargets } = useTargets();

  useEffect(() => {
    listTargets();
  }, [listTargets]);

  return (
    <Spin spinning={loading} size="large" tip="Loading targets...">
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Header>
          <Typography.Text type="secondary">Uptime</Typography.Text>
        </Layout.Header>
        <Layout>
          <Layout.Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(state) => setCollapsed(state)}
          >
            <NavigationMenu />
          </Layout.Sider>
          <Layout>
            <Layout.Content style={{ margin: "1rem" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/targets" element={<Navigate to="/" />} />
                <Route path="/targets/new" element={<TargetCreate />} />
                <Route path="/targets/:id" element={<TargetDetail />} />
              </Routes>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    </Spin>
  );
};
