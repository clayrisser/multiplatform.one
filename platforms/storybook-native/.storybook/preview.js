import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import withProvider from "./withProvider";

export const decorators = [withProvider, withBackgrounds];

export const parameters = {
  backgrounds: [
    { name: "light", value: "white", default: true },
    { name: "dark", value: "#262626" },
  ],
};
