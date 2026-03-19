import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "@carbon/react";

const meta: Meta<typeof TextInput> = {
  title: "Carbon/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carbon TextInput is used to capture text from users. Supports validation states, helper text, and password mode.",
      },
    },
  },
  argTypes: {
    labelText: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    invalid: { control: "boolean" },
    invalidText: { control: "text" },
    warn: { control: "boolean" },
    warnText: { control: "text" },
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    id: "default-input",
    labelText: "Label",
    placeholder: "Enter text...",
  },
};

export const WithHelperText: Story = {
  args: {
    id: "helper-input",
    labelText: "ZIP Code",
    placeholder: "e.g., 10001",
    helperText: "Enter a valid 5-digit US ZIP code",
  },
};

export const Invalid: Story = {
  args: {
    id: "invalid-input",
    labelText: "ZIP Code",
    placeholder: "e.g., 10001",
    invalid: true,
    invalidText: "Please enter a valid 5-digit zip code",
  },
};

export const Warning: Story = {
  args: {
    id: "warn-input",
    labelText: "ZIP Code",
    placeholder: "e.g., 10001",
    warn: true,
    warnText: "This zip code may be outside of our supported area",
  },
};

export const Disabled: Story = {
  args: {
    id: "disabled-input",
    labelText: "ZIP Code",
    placeholder: "e.g., 10001",
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <TextInput id="sm" labelText="Small" placeholder="Small input" size="sm" />
      <TextInput id="md" labelText="Medium" placeholder="Medium input" size="md" />
      <TextInput id="lg" labelText="Large" placeholder="Large input" size="lg" />
    </div>
  ),
};
