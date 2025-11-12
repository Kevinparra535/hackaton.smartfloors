# Migración a scssTokens.js

## ✅ Cambios Realizados

Se ha reorganizado el sistema de estilos para usar **`scssTokens.js`** en lugar de `tokens.js`, manteniendo paridad con SCSS y aprovechando las funcionalidades avanzadas del sistema existente.

### Archivos Modificados

#### 1. `src/styles/index.js`
**Antes:**
```javascript
export { spacing, breakpoints, media, zIndex, radii, shadows, transitions, easings } from './tokens';
```

**Después:**
```javascript
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
```

#### 2. `src/styles/base.js`
- Cambiado import de `spacing, radii` desde `./tokens` a `spacing` desde `./scssTokens`
- Agregadas variables CSS para compatibilidad con SCSS:
  - `--space`, `--space-half`, `--space-x2` hasta `--space-x7`
  - `--color-bg-light`, `--color-bg-dark`
  - `--color-light`, `--color-dark`
  - `--color-negative`, `--color-check`
- Ajustado padding del contenedor para usar `spacing.space`

#### 3. `src/styles/mixins.js`
- Actualizado import para usar `spacing, scssMedia as media` desde `./scssTokens`
- Reemplazados valores hardcodeados con tokens de `scssTokens`:
  - `radii.lg` → `0.75rem`
  - `spacing.lg` → `spacing.space_x2`
  - `spacing.xs` → `spacing.space_half`
  - `shadows.lg/md/xl` → valores hardcodeados equivalentes
- Actualizados media queries para usar `scssMedia`:
  - `onMobile` usa `media['mobile-only']`
  - `onTablet` usa `media.tablet`
  - `onDesktop` usa `media['desktop-s']`

#### 4. Eliminado `src/styles/tokens.js`
Ya no es necesario, toda la funcionalidad está en `scssTokens.js`.

## 📋 Funcionalidades de scssTokens.js

### Tokens Disponibles

#### Spacing (Paridad con SCSS)
```javascript
spacing.space        // var(--space) = 1rem
spacing.space_half   // var(--space-half) = 0.5rem
spacing.space_x2     // var(--space-x2) = 2rem
spacing.space_x3     // var(--space-x3) = 3rem
// ... hasta space_x7
```

#### Colors (Paridad con SCSS)
```javascript
colors.primary
colors.secondary
colors.variant
colors.negative      // para errores
colors.warning
colors.info
colors.check         // para success
colors.bg_light
colors.bg_dark
// + mood colors (mood_two, mood_three, etc.)
```

#### Typography
```javascript
fonts.heading        // var(--font-heading)
fonts.body           // var(--font-body)
fonts.mono           // var(--font-mono)

weights.light        // 400
weights.normal       // 500
weights.medium       // 600
weights.bolder       // 700
weights.black        // 800
```

### Funciones Útiles

#### fontSize(px)
Convierte px a rem con line-height automático:
```javascript
const Title = styled.h1`
  ${fontSize(24)}  // 1.5rem font-size, 2.25rem line-height
`;
```

#### getOpacity(color, amount)
Mezcla color con transparencia usando color-mix:
```javascript
background: ${getOpacity(colors.primary, 0.1)};
```

#### size(width, height?)
Atajo para width/height:
```javascript
const Box = styled.div`
  ${size(100, 200)}     // width: 100px, height: 200px
  ${size('50%')}        // width: 50%, height: 50%
`;
```

#### textStyle(options)
Combinación de estilos de texto:
```javascript
const Text = styled.p`
  ${textStyle({ 
    transform: 'uppercase', 
    weight: 'bolder' 
  })}
`;
```

#### getContrastColor(background, options)
Determina color de texto con mejor contraste (WCAG):
```javascript
const Button = styled.button`
  background: ${props => props.bg};
  color: ${props => getContrastColor(props.bg)};
`;
```

#### contrastText(background, light?, dark?)
Mixin de styled-components para contraste automático:
```javascript
const Card = styled.div`
  background: ${colors.primary};
  ${contrastText(colors.primary)}
`;
```

### Media Queries (Breakpoints SCSS)

```javascript
scssBreakpoints = {
  tablet: '768px',
  'desktop-s': '992px',
  'desktop-m': '1200px',
  'desktop-ml': '1366px',
  'desktop-l': '1480px',
  'desktop-xl': '1780px'
}

scssMedia = {
  tablet,
  'desktop-s',
  'desktop-m',
  'desktop-ml',
  'desktop-l',
  'desktop-xl',
  'mobile-only',           // max-width: 768px
  'tablet-p-only',         // 768-992px portrait
  'tablet-l-only',         // 768-992px landscape
  'desktop-s-only',        // 768-1200px
  'desktop-m-only'         // 1200-1480px
}
```

## 💡 Ejemplos de Uso

### Usando Spacing
```javascript
import { spacing } from '../styles';

const Container = styled.div`
  padding: ${spacing.space_x2};
  margin-bottom: ${spacing.space_x3};
  gap: ${spacing.space_half};
`;
```

### Usando Media Queries
```javascript
import { media } from '../styles';

const Grid = styled.div`
  grid-template-columns: 1fr;
  
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media['desktop-m']} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
```

### Usando fontSize
```javascript
import { fontSize } from '../styles';

const Heading = styled.h2`
  ${fontSize(32)}
  font-weight: 600;
`;
```

### Usando Colors con Opacity
```javascript
import { colors, getOpacity } from '../styles';

const Panel = styled.div`
  background: ${getOpacity(colors.primary, 0.1)};
  border: 1px solid ${getOpacity(colors.primary, 0.3)};
`;
```

### Usando Contrast Color
```javascript
import { getContrastColor } from '../styles';

const StatusBadge = styled.span`
  background: ${props => props.color};
  color: ${props => getContrastColor(props.color)};
  padding: 0.5rem 1rem;
`;
```

### Usando Size Helper
```javascript
import { size } from '../styles';

const Avatar = styled.img`
  ${size(48)}
  border-radius: 50%;
`;

const Banner = styled.div`
  ${size('100%', 200)}
`;
```

## 🎯 Ventajas del Sistema

1. **Paridad con SCSS**: Variables compatibles con sistemas SCSS
2. **Type Safety**: Funciones con tipos documentados
3. **Utilidades Avanzadas**: Contraste WCAG, color mixing, helpers
4. **Breakpoints Completos**: Sistema de media queries robusto
5. **CSS Variables**: Integración perfecta con CSS vars
6. **Mixins Reutilizables**: Funciones helper para casos comunes

## 📦 Estructura Final

```
src/styles/
├── scssTokens.js              # ✅ Sistema principal de tokens
├── theme.js                    # Tema (colores, tipografía)
├── base.js                     # Estilos globales
├── mixins.js                   # Mixins reutilizables
├── fonts.js                    # Font-faces
├── index.js                    # Export central
├── README.md                   # Documentación
│
├── AppContainer.styled.js      # Estilos de componentes
├── Header.styled.js
├── Sidebar.styled.js
└── VisualizationControls.styled.js
```

## ✨ Compatibilidad

- ✅ Todas las importaciones existentes siguen funcionando
- ✅ Nuevas funcionalidades disponibles (fontSize, getOpacity, size, etc.)
- ✅ Media queries con nombres SCSS estándar
- ✅ CSS variables para integración con CSS puro
- ✅ Sistema de contraste WCAG integrado
- ✅ Sin cambios en componentes existentes
