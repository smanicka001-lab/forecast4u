import{j as n}from"./index-DPlj6oAc.js";import{useMDXComponents as t}from"./index-BCw-bPr1.js";import{M as s}from"./index-Bfx7x0pf.js";import"./index-B1ozKwQc.js";import"./index-CAYNOms2.js";import"./iframe-CdlAwaXM.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function o(r){const e={a:"a",code:"code",h1:"h1",h2:"h2",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(s,{title:"Carbon Design System/Introduction"}),`
`,n.jsx(e.h1,{id:"forecast4u--carbon-design-system",children:"Forecast4U — Carbon Design System"}),`
`,n.jsxs(e.p,{children:["Welcome to the Forecast4U component library, powered by the ",n.jsx(e.strong,{children:"IBM Carbon Design System"}),"."]}),`
`,n.jsxs(e.p,{children:["This Storybook is intended for the ",n.jsx(e.strong,{children:"design team"})," to explore, customize, and reskin Carbon components for production use."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"what-is-carbon",children:"What is Carbon?"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.a,{href:"https://carbondesignsystem.com/",rel:"nofollow",children:"Carbon"})," is IBM's open-source design system. It provides:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"A comprehensive set of accessible UI components"}),`
`,n.jsx(e.li,{children:"A token-based theming system (colors, spacing, typography)"}),`
`,n.jsxs(e.li,{children:["Four built-in themes: ",n.jsx(e.strong,{children:"White"}),", ",n.jsx(e.strong,{children:"Gray 10"}),", ",n.jsx(e.strong,{children:"Gray 90"}),", ",n.jsx(e.strong,{children:"Gray 100"})]}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"switching-themes",children:"Switching Themes"}),`
`,n.jsxs(e.p,{children:["Use the ",n.jsx(e.strong,{children:"Carbon Theme"})," switcher in the Storybook toolbar (top right, paintbrush icon) to toggle between:"]}),`
`,n.jsx(e.p,{children:`| Theme    | Description              |
|----------|--------------------------|
| White    | Default light theme      |
| Gray 10  | Subtle light gray        |
| Gray 90  | Dark theme               |
| Gray 100 | High-contrast dark theme |`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"components-in-this-library",children:"Components in This Library"}),`
`,n.jsx(e.p,{children:"The following Carbon components are used in Forecast4U and are documented here:"}),`
`,n.jsxs(e.p,{children:[`| Component       | Story Path                  | Used For                        |
|-----------------|-----------------------------|---------------------------------|
| `,n.jsx(e.strong,{children:"Button"}),`      | Carbon/Button               | Form submit, Refresh action     |
| `,n.jsx(e.strong,{children:"TextInput"}),`   | Carbon/TextInput            | ZIP code entry                  |
| `,n.jsx(e.strong,{children:"Tile"}),`        | Carbon/Tile                 | Weather forecast cards          |
| `,n.jsx(e.strong,{children:"Loading"}),`     | Carbon/Loading              | Fetching weather data indicator |
| `,n.jsx(e.strong,{children:"Notification"}),"| Carbon/Notification         | Error and status messages       |"]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{id:"customizing-tokens",children:"Customizing Tokens"}),`
`,n.jsx(e.p,{children:"To reskin Carbon for production, update the SCSS token overrides. Key tokens for Forecast4U:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-scss",children:`// Example: Override primary brand color
$button-primary: #your-brand-color;
$interactive: #your-brand-color;
$link-primary: #your-brand-color;

// Override background
$background: #your-background-color;

// Override text
$text-primary: #your-text-color;
`})}),`
`,n.jsxs(e.p,{children:["See the ",n.jsx(e.a,{href:"https://carbondesignsystem.com/elements/themes/overview/",rel:"nofollow",children:"Carbon theming documentation"})," for the full token reference."]})]})}function x(r={}){const{wrapper:e}={...t(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(o,{...r})}):o(r)}export{x as default};
