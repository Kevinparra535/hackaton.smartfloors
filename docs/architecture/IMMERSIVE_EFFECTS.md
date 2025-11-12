# Efectos Inmersivos 3D - SmartFloors AI

## Descripción General

El canvas 3D de SmartFloors AI ha sido mejorado con múltiples efectos visuales para crear una experiencia inmersiva y profesional. Esta guía documenta todos los efectos implementados y cómo personalizarlos.

## 🌟 Efectos Implementados

### 1. **Post-Processing Effects**
Efectos aplicados después del renderizado para mejorar la calidad visual.

#### Bloom (Resplandor)
```jsx
<Bloom 
  intensity={0.5}              // Intensidad del brillo
  luminanceThreshold={0.2}     // Umbral de luminancia
  luminanceSmoothing={0.9}     // Suavizado
  mipmapBlur                   // Desenfoque optimizado
/>
```

**Propósito**: Crea un resplandor natural alrededor de los objetos brillantes (pisos con alertas, indicadores de estado).

#### Depth of Field (Profundidad de Campo)
```jsx
<DepthOfField 
  focusDistance={0.01}   // Distancia de enfoque
  focalLength={0.05}     // Longitud focal
  bokehScale={3}         // Escala del bokeh
/>
```

**Propósito**: Simula el enfoque de una cámara real, desenfocando ligeramente el fondo y dando profundidad a la escena.

#### Vignette (Viñeta)
```jsx
<Vignette 
  eskil={false}     // Tipo de viñeta
  offset={0.1}      // Desplazamiento desde el borde
  darkness={0.5}    // Oscurecimiento de bordes
/>
```

**Propósito**: Oscurece sutilmente los bordes de la pantalla, centrando la atención en el edificio.

---

### 2. **Partículas Flotantes**
Sistema de partículas ambientales que flotan alrededor del edificio.

**Archivo**: `src/components/FloatingParticles.jsx`

```jsx
<FloatingParticles count={150} />
```

**Características**:
- **150 partículas** flotando en el espacio 3D
- Movimiento vertical lento simulando polvo o partículas de aire
- Deriva horizontal sutil para efecto natural
- Color azul (`#646cff`) con transparencia y blending aditivo
- Las partículas se reinician cuando llegan muy alto

**Personalización**:
```jsx
// Cambiar cantidad de partículas
<FloatingParticles count={200} />

// En FloatingParticles.jsx, ajustar color y tamaño:
<pointsMaterial
  size={0.1}              // Tamaño de partículas
  color="#00ff88"         // Color personalizado
  opacity={0.8}           // Opacidad
/>
```

---

### 3. **Campo de Estrellas**
Fondo espacial con miles de estrellas animadas.

```jsx
<Stars 
  radius={100}      // Radio de distribución
  depth={50}        // Profundidad del campo
  count={5000}      // Cantidad de estrellas
  factor={4}        // Factor de escala
  saturation={0}    // Sin color (blanco)
  fade              // Desvanecimiento con distancia
  speed={1}         // Velocidad de rotación
/>
```

**Propósito**: Crea un ambiente espacial/tecnológico que complementa la visualización de datos.

---

### 4. **Fondo Degradado Dinámico**
Esfera envolvente con rotación sutil.

**Archivo**: `src/components/GradientBackground.jsx`

```jsx
<GradientBackground />
```

**Características**:
- Esfera de 50 unidades de radio
- Color base oscuro (`#0a0a0a`)
- Rotación lenta (0.05 rad/s) para dinamismo sutil
- No afectado por la niebla

**Personalización**:
```jsx
// En GradientBackground.jsx
<meshBasicMaterial
  color="#1a1a2e"  // Cambiar color de fondo
/>
```

---

### 5. **Iluminación Mejorada**
Sistema de iluminación multicapa para profundidad y ambiente.

#### Luces Implementadas:
```jsx
// Luz ambiental suave
<ambientLight intensity={0.3} />

// Luz direccional principal (sol)
<directionalLight 
  position={[10, 15, 5]} 
  intensity={1.5} 
  castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
/>

// Luces puntuales de acento
<pointLight position={[-10, 10, -5]} intensity={0.8} color="#646cff" />
<pointLight position={[10, 5, 10]} intensity={0.5} color="#00ff88" />

// Spotlight cenital
<spotLight
  position={[0, 20, 0]}
  angle={0.6}
  penumbra={1}
  intensity={0.5}
  castShadow
/>
```

**Luces dinámicas por piso**:
Cada `FloorBlock` tiene su propia luz que cambia según el estado:
```jsx
<pointLight 
  color={color} 
  intensity={status === 'danger' ? 2 : status === 'warning' ? 1.5 : 0.8}
  distance={5}
  decay={2}
/>
```

---

### 6. **Niebla Atmosférica**
Niebla exponencial para profundidad y ambiente.

```jsx
<fog attach="fog" args={['#0a0a0a', 5, 30]} />
```

**Parámetros**:
- Color: `#0a0a0a` (negro oscuro)
- Inicio: 5 unidades
- Fin: 30 unidades

**Efecto**: Los objetos lejanos se desvanecen gradualmente en la niebla.

---

### 7. **Materiales Mejorados en FloorBlock**

#### Bloque Principal
```jsx
<meshStandardMaterial
  color={color}
  emissive={color}
  emissiveIntensity={0.2}
  metalness={0.6}              // Aspecto metálico
  roughness={0.3}              // Superficie semi-pulida
  envMapIntensity={1}          // Reflejos del entorno
  transparent
  opacity={0.95}               // Ligeramente transparente
/>
```

#### Efecto de Resplandor Exterior
```jsx
<mesh scale={[1.05, 1.05, 1.05]}>
  <boxGeometry args={[3, 1.5, 3]} />
  <meshBasicMaterial
    color={color}
    transparent
    opacity={0.1}
    wireframe                  // Wireframe externo
  />
</mesh>
```

#### Indicador de Estado Mejorado
```jsx
<mesh position={[1.6, 0, 0]}>
  <sphereGeometry args={[0.15, 16, 16]} />
  <meshStandardMaterial 
    color={color} 
    emissive={color} 
    emissiveIntensity={2}      // Brillo intenso
    metalness={0.8}
    roughness={0.2}
  />
</mesh>
```

#### Etiquetas con Contorno
```jsx
<Text
  position={[0, 0, 1.6]}
  fontSize={0.3}
  color='#ffffff'
  outlineWidth={0.02}          // Contorno negro
  outlineColor='#000000'
/>
```

---

### 8. **Plano del Suelo Mejorado**
```jsx
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
  <planeGeometry args={[30, 30]} />
  <meshStandardMaterial 
    color='#0d0d0d' 
    metalness={0.4}            // Superficie reflectante
    roughness={0.6}
    envMapIntensity={0.5}
  />
</mesh>
```

**Mejoras**:
- Tamaño aumentado (30x30 vs 20x20)
- Recibe sombras de los pisos
- Material más reflectante

---

### 9. **Cámara Optimizada**
```jsx
<PerspectiveCamera 
  makeDefault 
  position={[10, 6, 10]}     // Posición mejorada
  fov={55}                   // Campo de visión aumentado
/>
```

**Cambios**:
- Posición más elevada para mejor vista general
- FOV aumentado de 50 a 55 grados
- Mejor ángulo para ver todos los pisos

---

### 10. **Controles Mejorados**
```jsx
<OrbitControls
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  minDistance={8}
  maxDistance={25}             // Rango ampliado
  maxPolarAngle={Math.PI / 2}
  autoRotate={false}           // Desactivado por defecto
  autoRotateSpeed={0.5}
/>
```

**Para activar rotación automática**:
```jsx
autoRotate={true}
```

---

## 🎨 Paleta de Colores Dinámica

### Colores por Estado
```jsx
const STATUS_COLORS = {
  normal: '#00ff88',   // Verde brillante
  warning: '#ffd966',  // Amarillo dorado
  danger: '#ff4d4f'    // Rojo intenso
};
```

### Colores de Luces de Acento
- Azul tecnológico: `#646cff`
- Verde éxito: `#00ff88`
- Blanco puro: `#ffffff`

---

## ⚡ Rendimiento

### Optimizaciones Implementadas
1. **Uso de refs** para prevenir re-renders innecesarios
2. **useMemo** para arrays de partículas (generadas una sola vez)
3. **Buffer attributes** para geometrías de partículas (más eficiente)
4. **Mipmaps en Bloom** para mejor rendimiento
5. **Shadow maps** de alta resolución pero controlados (2048x2048)

### Configuración de Bajo Rendimiento
Si experimentas lag, ajusta estos valores:

```jsx
// Reducir partículas
<FloatingParticles count={50} />

// Reducir estrellas
<Stars count={2000} />

// Reducir intensidad de Bloom
<Bloom intensity={0.2} />

// Desactivar DepthOfField
{/* <DepthOfField .../> */}
```

---

## 🔧 Personalización Avanzada

### Cambiar Tema a "Día"
```jsx
// En BuildingScene.jsx
<fog attach="fog" args={['#87CEEB', 10, 40]} />
<ambientLight intensity={0.8} />
<directionalLight position={[10, 15, 5]} intensity={2} />

// Colores de partículas más claros
<pointsMaterial color="#ffffff" opacity={0.4} />
```

### Modo "Matrix" (Verde Cyberpunk)
```jsx
<fog attach="fog" args={['#001100', 5, 30]} />
<pointLight color="#00ff00" />
<Stars saturation={1} />  // Estrellas verdes
```

### Activar Auto-Rotación Lenta
```jsx
<OrbitControls autoRotate={true} autoRotateSpeed={0.2} />
```

---

## 📦 Dependencias Nuevas

```json
{
  "@react-three/postprocessing": "^2.x",
  "three-stdlib": "^2.x",
  "lamina": "^1.0.6"
}
```

Instaladas con:
```bash
npm i @react-three/postprocessing three-stdlib lamina@1.0.6
```

---

## 🐛 Troubleshooting

### Las partículas no se ven
- Verifica que `FloatingParticles` esté importado y renderizado
- Asegúrate de que `attach="attributes-position"` esté en `bufferAttribute`

### Rendimiento lento
- Reduce `count` en Stars y FloatingParticles
- Desactiva DepthOfField
- Reduce `shadow-mapSize` a 1024

### Bloom demasiado intenso
```jsx
<Bloom intensity={0.3} luminanceThreshold={0.4} />
```

### Niebla demasiado densa
```jsx
<fog attach="fog" args={['#0a0a0a', 10, 50]} />
```

---

## 📚 Recursos

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [Three.js Docs](https://threejs.org/docs/)

---

**Última actualización**: Noviembre 2025
