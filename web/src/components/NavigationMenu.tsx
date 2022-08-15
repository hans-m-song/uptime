import { BarChartOutlined, AimOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTargets } from "../contexts/targets";

export const NavigationMenu = () => {
  const { pathname } = useLocation();
  const { targets } = useTargets();

  const selected = useMemo(() => {
    if (pathname === "/") {
      return ["dashboard"];
    }

    if (!pathname.startsWith("/targets")) {
      return ["dashboard"];
    }

    const matched = targets.find(({ slug }) => pathname.endsWith(slug));
    if (matched) {
      return ["targets", matched.slug];
    }

    return ["targets"];
  }, [pathname, targets]);

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]}
      selectedKeys={selected}
      defaultOpenKeys={["targets"]}
      items={[
        {
          key: "dashboard",
          label: <Link to="/">Dashboard</Link>,
          icon: <BarChartOutlined />,
        },
        {
          key: "targets",
          label: "Targets",
          icon: <AimOutlined />,
          children: [
            ...targets.map((target) => ({
              icon: <Avatar>{target.name.slice(0, 1).toUpperCase()}</Avatar>,
              label: <Link to={`/targets/${target.slug}`}>{target.name}</Link>,
              key: target.slug,
            })),
            {
              icon: <PlusOutlined />,
              label: <Link to={`/targets/new`}>Create Target</Link>,
              key: "create",
            },
          ],
        },
      ]}
    />
  );
};
