import React from "react";

interface Props {
  children: string;
  value: number | string | null | undefined;
  color?: string;
  // onClick: () => void;
}

const Button = ({ children, value, color = "primary" }: Props) => {
  return (
    <button
      className={"m-1 p-5 btn btn-" + color}
      style={{ borderRadius: "9999px", minWidth: "180px" }}
    >
      {children}
      <h1>{value}</h1>
    </button>
  );
};

export default Button;
