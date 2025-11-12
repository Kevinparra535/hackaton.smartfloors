import { css } from 'styled-components';
import { theme } from './theme';
import { spacing, scssMedia as media } from './scssTokens';

/**
 * Reusable Style Mixins
 * Common style patterns for styled-components
 */

// Flexbox utilities
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// Typography
export const heading1 = css`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.tight};
`;

export const heading2 = css`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.tight};
`;

export const heading3 = css`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.tight};
`;

export const bodyText = css`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.normal};
  line-height: ${theme.lineHeights.base};
`;

export const smallText = css`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.normal};
  line-height: ${theme.lineHeights.relaxed};
`;

// Truncate text
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const lineClamp = (lines = 2) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Glass morphism effect
export const glassMorphism = css`
  background: ${theme.background.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.border.subtle};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

// Card styles
export const card = css`
  background: ${theme.background.secondary};
  border-radius: 0.75rem;
  padding: ${spacing.space_x2};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

export const cardHover = css`
  ${card}
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

// Interactive states
export const hoverScale = (scale = 1.05) => css`
  transition: transform 0.15s ease;
  
  &:hover {
    transform: scale(${scale});
  }
`;

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`;

// Transitions
export const fadeIn = css`
  animation: fadeIn 0.25s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const slideUp = css`
  animation: slideUp 0.25s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Gradient backgrounds
export const gradientPrimary = css`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
`;

export const gradientDanger = css`
  background: linear-gradient(135deg, ${theme.colors.danger} 0%, #ff6b6b 100%);
`;

export const gradientSuccess = css`
  background: linear-gradient(135deg, ${theme.colors.success} 0%, #4ecdc4 100%);
`;

// Position utilities
export const absoluteCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const absoluteFill = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

// Scrollbar styling
export const customScrollbar = css`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.background.elevated};
    border-radius: 9999px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.border.medium};
    border-radius: 9999px;
    
    &:hover {
      background: ${theme.border.strong};
    }
  }

  scrollbar-width: thin;
  scrollbar-color: ${theme.border.medium} ${theme.background.elevated};
`;

// Hide scrollbar
export const hideScrollbar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Aspect ratio (legacy support)
export const aspectRatio = (width, height) => css`
  aspect-ratio: ${width} / ${height};
  
  @supports not (aspect-ratio: 1 / 1) {
    &::before {
      content: '';
      display: block;
      padding-top: ${(height / width) * 100}%;
    }
  }
`;

// Media query helpers (using scssMedia)
export const onMobile = (content) => css`
  ${media['mobile-only']} {
    ${content}
  }
`;

export const onTablet = (content) => css`
  ${media.tablet} {
    ${content}
  }
`;

export const onDesktop = (content) => css`
  ${media['desktop-s']} {
    ${content}
  }
`;

// Status indicator
export const statusIndicator = (status) => {
  const colors = {
    normal: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    info: theme.colors.info
  };
  
  return css`
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${colors[status] || colors.normal};
      margin-right: ${spacing.space_half};
    }
  `;
};

// Shimmer loading effect
export const shimmer = css`
  background: linear-gradient(
    90deg,
    ${theme.background.secondary} 0%,
    ${theme.background.elevated} 50%,
    ${theme.background.secondary} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export default {
  flexCenter,
  flexBetween,
  flexColumn,
  heading1,
  heading2,
  heading3,
  bodyText,
  smallText,
  truncate,
  lineClamp,
  glassMorphism,
  card,
  cardHover,
  hoverScale,
  focusRing,
  fadeIn,
  slideUp,
  gradientPrimary,
  gradientDanger,
  gradientSuccess,
  absoluteCenter,
  absoluteFill,
  customScrollbar,
  hideScrollbar,
  aspectRatio,
  onMobile,
  onTablet,
  onDesktop,
  statusIndicator,
  shimmer
};
