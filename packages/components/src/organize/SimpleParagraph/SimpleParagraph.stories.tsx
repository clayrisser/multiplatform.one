import React from "react";
import { SimpleParagraph } from ".";

export default {
  title: "Components/SimpleParagraph",
  component: SimpleParagraph,
  parameters: { status: { type: "beta" } },
};

export const main = () => (
  <SimpleParagraph>{`
                function helloWorld() {
                    console.log("Hello, World!");
                    console.log(${new Date().getTime().toString()})
                }
                `}</SimpleParagraph>
);
