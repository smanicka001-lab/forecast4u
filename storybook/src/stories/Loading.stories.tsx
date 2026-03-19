import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from "@carbon/react";

const meta: Meta<typeof Loading> = {
  title: "Carbon/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carbon Loading spinner is used to indicate an ongoing process. Used in Forecast4U while fetching weather data.",
      },
    },
  },
  argTypes: {
    description: { control: "text" },
    withOverlay: { control: "boolean" },
    small: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    description: "Fetching weather data...",
    withOverlay: false,
  },
};

export const Small: Story = {
  args: {
    description: "Loading...",
    withOverlay: false,
    small: true,
  },
};
