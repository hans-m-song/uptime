import { HTMLAttributes } from "react";

export const Centre = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{
      ...props.style,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  />
);
