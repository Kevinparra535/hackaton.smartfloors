# Style System Documentation

This directory contains the organized style system for SmartFloors AI, following a modern design token approach with **SCSS parity**.

## Structure

```
src/styles/
├── index.js           # Central export point
├── scssTokens.js      # Design tokens with SCSS parity
├── theme.js           # Color palette and typography
├── base.js            # Global styles and reset
├── mixins.js          # Reusable style patterns
└── fonts.js           # Font-face declarations
```

## Usage

### Import the Theme

```jsx
import { theme, spacing, GlobalStyles, colors } from '../styles';
```

### Using Design Tokens (SCSS Parity)

```jsx
import styled from 'styled-components';
import { spacing, colors } from '../styles';

const Card = styled.div`
  padding: ${spacing.space_x2};
  background: ${colors.primary};
  margin-bottom: ${spacing.space_x3};
`;
```

### Using Theme Colors

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;
```

### Using Mixins

```jsx
import styled from 'styled-components';
import { flexCenter, card, fadeIn } from '../styles';

const Container = styled.div`
  ${card}
  ${flexCenter}
  ${fadeIn}
`;
```

### Using Media Queries

```jsx
import styled from 'styled-components';
import { media } from '../styles';

const ResponsiveBox = styled.div`
  padding: 1rem;
  
  ${media.tablet} {
    padding: 2rem;
  }
  
  ${media['desktop-s']} {
    padding: 3rem;
  }
`;
```

### Using Advanced Helpers

#### fontSize Helper
```jsx
import { fontSize } from '../styles';

const Heading = styled.h1`
  ${fontSize(24)}  // Auto-calculates rem and line-height
`;
```

#### getOpacity Helper
```jsx
import { colors, getOpacity } from '../styles';

const Panel = styled.div`
  background: ${getOpacity(colors.primary, 0.1)};
`;
```

#### size Helper
```jsx
import { size } from '../styles';

const Avatar = styled.img`
  ${size(48)}  // width: 48px, height: 48px
`;
```

#### Contrast Color (WCAG)
```jsx
import { getContrastColor } from '../styles';

const Button = styled.button`
  background: ${props => props.bg};
  color: ${props => getContrastColor(props.bg)};
`;
```

## Design Tokens (SCSS Parity)

### Spacing Scale
- `space`: 1rem (16px)
- `space_half`: 0.5rem (8px)
- `space_x2`: 2rem (32px)
- `space_x3`: 3rem (48px)
- `space_x4`: 4rem (64px)
- `space_x5`: 5rem (80px)
- `space_x6`: 6rem (96px)
- `space_x7`: 7rem (112px)

### Breakpoints (SCSS Parity)
- `tablet`: 768px
- `desktop-s`: 992px
- `desktop-m`: 1200px
- `desktop-ml`: 1366px
- `desktop-l`: 1480px
- `desktop-xl`: 1780px

### Media Queries
- `tablet` - min-width: 768px
- `desktop-s` - min-width: 992px
- `desktop-m` - min-width: 1200px
- `desktop-ml` - min-width: 1366px
- `desktop-l` - min-width: 1480px
- `desktop-xl` - min-width: 1780px
- `mobile-only` - max-width: 768px
- `tablet-p-only` - 768-992px portrait
- `tablet-l-only` - 768-992px landscape
- `desktop-s-only` - 768-1200px
- `desktop-m-only` - 1200-1480px

## Theme

### Color Palette

#### Primary Colors
- `primary`: #646cff (brand blue)
- `primaryHover`: #535bf2
- `primaryLight`: rgba(100, 108, 255, 0.1)

#### Status Colors
- `success`: #00ff88 (green)
- `warning`: #ffd966 (yellow)
- `danger`: #ff4d4f (red)
- `info`: #646cff (blue)

#### Heat Layer States
- `normal`: #00ff88
- `warning`: #ffd966
- `critical`: #ff4d4f
- `optimal`: #4dff88
- `moderate`: #ffeb99
- `severe`: #ff3333

#### Dark Theme
- Background: #0a0a0a
- Panel: rgba(26, 26, 26, 0.95)
- Elevated: rgba(40, 40, 40, 0.95)
- Glass: rgba(26, 26, 26, 0.8)

### Typography

#### Font Families
- `body`: 'Poppins', sans-serif
- `heading`: 'Montserrat', sans-serif
- `mono`: 'Fira Code', monospace

#### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)
- `5xl`: 3rem (48px)

#### Font Weights
- `light`: 300
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700

## Available Mixins

### Layout
- `flexCenter` - Center items with flexbox
- `flexBetween` - Space between with flexbox
- `flexColumn` - Flex column direction
- `absoluteCenter` - Absolute position center
- `absoluteFill` - Fill parent absolutely

### Typography
- `heading1`, `heading2`, `heading3` - Heading styles
- `bodyText` - Body text style
- `smallText` - Small text style
- `truncate` - Single line truncate
- `lineClamp(lines)` - Multi-line truncate

### Effects
- `glassMorphism` - Glass panel effect
- `card` - Card style with shadow
- `cardHover` - Card with hover effect
- `shimmer` - Loading shimmer animation
- `fadeIn` - Fade in animation
- `slideUp` - Slide up animation

### Interactive
- `hoverScale(scale)` - Scale on hover
- `focusRing` - Accessible focus outline
- `statusIndicator(status)` - Status dot

### Utilities
- `customScrollbar` - Styled scrollbar
- `hideScrollbar` - Hidden scrollbar
- `aspectRatio(w, h)` - Aspect ratio helper
- `onMobile(content)` - Mobile-only styles
- `onTablet(content)` - Tablet-only styles
- `onDesktop(content)` - Desktop-only styles

## CSS Variables

All design tokens are also available as CSS variables for use in regular CSS:

```css
.my-element {
  padding: var(--space-lg);
  color: var(--color-primary);
  font-family: var(--font-body);
  border-radius: var(--radius-md);
}
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use semantic color names** from theme instead of color codes
3. **Prefer mixins** for common patterns instead of repeating styles
4. **Use transient props** ($prop) in styled-components to avoid DOM warnings
5. **Leverage CSS variables** for dynamic theming
6. **Follow mobile-first** approach with media queries
7. **Use theme context** via ThemeProvider for consistency

## Examples

### Complete Component Example

```jsx
import styled from 'styled-components';
import { flexCenter, card, spacing, radii } from '../styles';

const StatusCard = styled.div`
  ${card}
  ${flexCenter}
  gap: ${spacing.md};
  min-height: 200px;
  
  background: ${({ theme, $status }) => 
    $status === 'danger' ? theme.heatStates.critical :
    $status === 'warning' ? theme.heatStates.warning :
    theme.heatStates.normal
  };
  
  border-radius: ${radii.xl};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

export default function MyComponent({ status }) {
  return (
    <StatusCard $status={status}>
      <h3>Status: {status}</h3>
    </StatusCard>
  );
}
```

### Using Media Queries

```jsx
import styled from 'styled-components';
import { media, spacing } from '../styles';

const Grid = styled.div`
  display: grid;
  gap: ${spacing.md};
  grid-template-columns: 1fr;
  
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
```

## Migration Notes

- Old `index.css` styles are now in `base.js` as GlobalStyles
- Font imports moved from inline to `fonts.js`
- Hard-coded colors should be replaced with theme values
- Magic numbers should use spacing/sizing tokens
- Component-specific styles can still use styled-components as before
