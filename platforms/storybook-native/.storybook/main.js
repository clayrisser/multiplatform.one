module.exports = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../app/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../ui/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-ondevice-backgrounds",
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-notes",
  ],
};
