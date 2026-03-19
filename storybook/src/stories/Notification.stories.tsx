import type { Meta, StoryObj } from "@storybook/react";
import { InlineNotification, ToastNotification } from "@carbon/react";

const meta: Meta<typeof InlineNotification> = {
  title: "Carbon/Notification",
  component: InlineNotification,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carbon Notifications inform users of important status updates. Used in Forecast4U to display API errors and warnings.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["error", "info", "info-square", "success", "warning", "warning-alt"],
    },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof InlineNotification>;

export const Error: Story = {
  args: {
    kind: "error",
    title: "Error:",
    subtitle: "Invalid zip code or location not found.",
  },
};

export const Success: Story = {
  args: {
    kind: "success",
    title: "Success:",
    subtitle: "Weather data loaded successfully.",
  },
};

export const Warning: Story = {
  args: {
    kind: "warning",
    title: "Warning:",
    subtitle: "This zip code may be outside of supported areas.",
  },
};

export const Info: Story = {
  args: {
    kind: "info",
    title: "Note:",
    subtitle: "Times are displayed in EDT (Eastern Daylight Time).",
  },
};

export const AllKinds: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <InlineNotification kind="error" title="Error:" subtitle="Something went wrong." />
      <InlineNotification kind="success" title="Success:" subtitle="Action completed." />
      <InlineNotification kind="warning" title="Warning:" subtitle="Proceed with caution." />
      <InlineNotification kind="info" title="Info:" subtitle="Here is some information." />
    </div>
  ),
};

export const Toast: StoryObj<typeof ToastNotification> = {
  render: () => (
    <ToastNotification
      kind="success"
      title="Weather Updated"
      subtitle="Forecast refreshed at 12:16 PM EDT"
      caption="Just now"
      timeout={0}
    />
  ),
};
