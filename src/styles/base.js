import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import { spacing } from './scssTokens';

/**
 * Global Base Styles
 * Reset, normalize, and base styles for the entire application
 */
export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Root variables */
  :root {
    /* Base spacing unit */
    --space: 1rem;
    --space-half: 0.5rem;
    --space-x2: 2rem;
    --space-x3: 3rem;
    --space-x4: 4rem;
    --space-x5: 5rem;
    --space-x6: 6rem;
    --space-x7: 7rem;
    
    /* Color tokens */
    --color-primary: ${theme.colors.primary};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-danger: ${theme.colors.danger};
    --color-info: ${theme.colors.info};
    
    /* Background colors */
    --color-bg: ${theme.background.primary};
    --color-bg-panel: ${theme.background.secondary};
    --color-bg-elevated: ${theme.background.elevated};
    --color-bg-light: ${theme.background.elevated};
    --color-bg-dark: ${theme.background.primary};
    
    /* Text colors */
    --color-text: ${theme.text.primary};
    --color-text-muted: ${theme.text.secondary};
    --color-text-dimmed: ${theme.text.dimmed};
    --color-light: ${theme.text.primary};
    --color-dark: ${theme.background.primary};
    
    /* Border colors */
    --color-border: ${theme.border.default};
    
    /* Status colors for SCSS parity */
    --color-negative: ${theme.colors.danger};
    --color-check: ${theme.colors.success};
    
    /* Font families */
    --font-body: ${theme.fonts.body};
    --font-heading: ${theme.fonts.heading};
    --font-mono: ${theme.fonts.mono};
  }

  /* HTML & Body */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-body);
    font-size: ${theme.fontSizes.base};
    font-weight: ${theme.fontWeights.normal};
    line-height: ${theme.lineHeights.base};
    color: var(--color-text);
    background-color: var(--color-bg);
    overflow-x: hidden;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: ${theme.fontWeights.semibold};
    line-height: ${theme.lineHeights.tight};
    margin: 0;
  }

  h1 { font-size: ${theme.fontSizes['4xl']}; }
  h2 { font-size: ${theme.fontSizes['3xl']}; }
  h3 { font-size: ${theme.fontSizes['2xl']}; }
  h4 { font-size: ${theme.fontSizes.xl}; }
  h5 { font-size: ${theme.fontSizes.lg}; }
  h6 { font-size: ${theme.fontSizes.base}; }

  /* Links */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 150ms ease;

    &:hover {
      color: ${theme.colors.primaryHover};
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: 0.25rem;
    }
  }

  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  /* Images */
  img, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Code */
  code, pre {
    font-family: var(--font-mono);
    font-size: 0.875em;
  }

  /* Selection */
  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }

  /* Scrollbar styling (webkit) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.background.elevated};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.border.medium};
    border-radius: 9999px;

    &:hover {
      background: ${theme.border.strong};
    }
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${theme.border.medium} ${theme.background.elevated};
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 ${spacing.space};
  }
`;

export default GlobalStyles;
