import React from "react";
import { Path } from "react-native-svg";
import { Svg } from "./index";

export default {
  title: "images/Svg",
  component: Svg,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = () => (
  <Svg width={304} height={290}>
    <Path
      d="M2,111 h300 l-242.7,176.3 92.7,-285.3 92.7,285.3 z"
      fill="#FB2"
      stroke="#BBB"
      strokeWidth={15}
      strokeLinejoin="round"
    />
  </Svg>
);
