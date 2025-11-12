/**
 * Centralized Style System Exports
 *
 * Usage:
 * import { theme, spacing, GlobalStyles, mixins } from '../styles';
 */

// Design Tokens (using scssTokens for SCSS parity)
export {
  spacing,
  colors,
  fonts,
  weights,
  fontSize,
  getOpacity,
  size,
  fontWeight,
  textStyle,
  getContrastColor,
  contrastText,
  scssBreakpoints as breakpoints,
  scssMedia as media
} from './scssTokens';

// Theme (colors, typography)
export { theme } from './theme';

// Global Styles
export { GlobalStyles } from './base';

// Font Declarations
export * from './fonts';

// Reusable Mixins
export { default as mixins } from './mixins';
export * from './mixins';

// Component Styles
export * as AlertsPanelStyles from './AlertsPanel.styled';
export * as PredictionsPanelStyles from './PredictionsPanel.styled';
export * as SocketDebuggerStyles from './SocketDebugger.styled';
export * as AppContainerStyles from './AppContainer.styled';
export * as HeaderStyles from './Header.styled';
export * as SidebarStyles from './Sidebar.styled';
export * as VisualizationControlsStyles from './VisualizationControls.styled';
