import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@carbon/react";
import { Add, TrashCan, Download } from "@carbon/icons-react";

const meta: Meta<typeof Button> = {
  title: "Carbon/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carbon Buttons are used to trigger actions. Use the `kind` prop to switch between variants. The design team can customize colors via Carbon theme tokens.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "danger", "ghost"],
      description: "Button variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description: "Button size",
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { kind: "primary", children: "Primary Button" },
};

export const Secondary: Story = {
  args: { kind: "secondary", children: "Secondary Button" },
};

export const Tertiary: Story = {
  args: { kind: "tertiary", children: "Tertiary Button" },
};

export const Danger: Story = {
  args: { kind: "danger", children: "Danger Button" },
};

export const Ghost: Story = {
  args: { kind: "ghost", children: "Ghost Button" },
};

export const Disabled: Story = {
  args: { kind: "primary", children: "Disabled Button", disabled: true },
};

export const WithIcon: Story = {
  args: {
    kind: "primary",
    children: "Add Item",
    renderIcon: Add,
  },
};

export const DangerWithIcon: Story = {
  args: {
    kind: "danger",
    children: "Delete",
    renderIcon: TrashCan,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button kind="primary">Primary</Button>
      <Button kind="secondary">Secondary</Button>
      <Button kind="tertiary">Tertiary</Button>
      <Button kind="danger">Danger</Button>
      <Button kind="ghost">Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
      <Button kind="primary" size="sm">Small</Button>
      <Button kind="primary" size="md">Medium</Button>
      <Button kind="primary" size="lg">Large</Button>
      <Button kind="primary" size="xl">XL</Button>
    </div>
  ),
};
