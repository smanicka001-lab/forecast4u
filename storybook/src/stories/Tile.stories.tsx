import type { Meta, StoryObj } from "@storybook/react";
import { Tile, ClickableTile, SelectableTile, ExpandableTile, TileAboveTheFoldContent, TileBelowTheFoldContent } from "@carbon/react";

const meta: Meta<typeof Tile> = {
  title: "Carbon/Tile",
  component: Tile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carbon Tiles are used to display related information grouped together. Used in Forecast4U to display individual weather forecast cards.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tile>;

export const Default: Story = {
  render: () => (
    <Tile style={{ maxWidth: "300px" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>75°F</p>
      <p style={{ color: "#525252" }}>clear sky</p>
    </Tile>
  ),
};

export const WeatherCard: Story = {
  render: () => (
    <div style={{ maxWidth: "160px" }}>
      <span style={{ fontSize: "0.75rem", color: "#525252" }}>3:00 PM</span>
      <Tile>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.25rem" }}>75°F</p>
          <p style={{ fontSize: "0.75rem", color: "#525252" }}>clear sky</p>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <div style={{ fontSize: "0.75rem", color: "#525252" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Feels Like:</span><span>73°F</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Humidity:</span><span>50%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Wind:</span><span>5 mph</span>
            </div>
          </div>
        </div>
      </Tile>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <ClickableTile href="#" style={{ maxWidth: "300px" }}>
      <p style={{ fontWeight: "bold" }}>Click me</p>
      <p style={{ color: "#525252" }}>This tile is interactive</p>
    </ClickableTile>
  ),
};

export const Selectable: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <SelectableTile id="tile-1" name="tile" value="white" title="White Theme">
        White Theme
      </SelectableTile>
      <SelectableTile id="tile-2" name="tile" value="g10" title="Gray 10">
        Gray 10 Theme
      </SelectableTile>
      <SelectableTile id="tile-3" name="tile" value="g100" title="Gray 100">
        Gray 100 Theme
      </SelectableTile>
    </div>
  ),
};

export const Expandable: Story = {
  render: () => (
    <ExpandableTile style={{ maxWidth: "400px" }}>
      <TileAboveTheFoldContent>
        <p style={{ fontWeight: "bold" }}>Wed, Mar 18 — Summary</p>
        <p style={{ color: "#525252" }}>High: 80°F / Low: 68°F</p>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <p style={{ marginTop: "1rem", color: "#525252" }}>
          Clear skies throughout the day with light winds from the southwest at 5–10 mph. Humidity around 45%.
        </p>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  ),
};
