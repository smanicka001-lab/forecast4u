import type { Preview } from "@storybook/react";
import "@carbon/styles/css/styles.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#161616" },
        { name: "gray-10", value: "#f4f4f4" },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: "Carbon Theme",
      description: "Switch between Carbon themes",
      defaultValue: "white",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "white", title: "White" },
          { value: "g10", title: "Gray 10" },
          { value: "g90", title: "Gray 90" },
          { value: "g100", title: "Gray 100" },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
