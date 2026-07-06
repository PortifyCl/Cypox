# Phase 1 : Particles Background - Plan détaillé

## 🎯 Objectif
Champ de particules noires sur fond blanc qui réagissent à la souris avec lignes de connexion entre particules proches.

## 📐 Architecture

```
src/components/three/
├── Particles.jsx           ← Canvas R3F principal
├── ParticleField.jsx       ← Logique des particules (positions, mouvement)
└── ConnectionLines.jsx     ← Lignes entre particules proches
```

## 🔧 Implémentation

### 1. Particles.jsx (Canvas principal)

```jsx
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'
import ConnectionLines from './ConnectionLines'

export default function Particles() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField count={800} />
        <ConnectionLines />
      </Canvas>
    </div>
  )
}
```

### 2. ParticleField.jsx (Logique particules)

**Constantes :**
- `COUNT = 800` (desktop) / `300` (mobile)
- `SPEED = 0.002` (vitesse de base)
- `MOUSE_RADIUS = 1.5` (zone d'influence souris)
- `MOUSE_FORCE = 0.5` (force de répulsion)

**Attributs par particule :**
- `position` : xyz aléatoire dans [-5, 5]
- `velocity` : xyz aléatoire petit
- `size` : aléatoire [0.01, 0.03]

**Logique useFrame :**
1. Pour chaque particule :
   - Calculer distance à la souris
   - Si distance < MOUSE_RADIUS : appliquer répulsion
   - Mettre à jour position += velocity
   - Boundary check : si hors limites, wrap around
2. Mettre à jour BufferGeometry.attributes.position

**Performance :**
- Utiliser `Float32Array` pour les positions
- Utiliser `BufferGeometry` (pas Mesh)
- Utiliser `PointsMaterial` (pas MeshStandardMaterial)
- `useMemo` pour la géométrie initiale

### 3. ConnectionLines.jsx (Lignes)

**Constantes :**
- `MAX_DISTANCE = 1.5` (distance max pour connecter)
- `LINE_OPACITY = 0.15` (opacité des lignes)

**Logique :**
1. Récupérer les positions des particules
2. Pour chaque paire de particules :
   - Si distance < MAX_DISTANCE : ajouter une ligne
3. Utiliser `LineSegments` de drei
4. Mettre à jour à chaque frame

**Performance :**
- Limiter à 200 lignes max
- Utiliser un seul `LineSegments` (pas 200 Line)
- Désactiver les lignes si fps < 30

## 🎨 Style

**Couleurs :**
- Particules : `#0a0a0a` (noir CYPOX)
- Lignes : `#0a0a0a` avec opacity 0.15
- Fond : transparent (canvas over white bg)

**Tailles :**
- Particules desktop : size [0.01, 0.03]
- Particules mobile : size [0.02, 0.04] (plus grosses, moins nombreuses)

## 📱 Mobile

**Détection :**
```js
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const COUNT = isMobile ? 300 : 800
```

**Ajustements mobile :**
- 300 particules au lieu de 800
- Pas de connection lines (trop lourd)
- Size légèrement augmenté

## 🔗 Intégration Hero.jsx

```jsx
// Hero.jsx
import Particles from './three/Particles'

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      {/* Particles en arrière-plan */}
      <Particles />
      
      {/* Contenu au premier plan */}
      <div className="relative z-10">
        {/* ... contenu existant ... */}
      </div>
    </section>
  )
}
```

## ⚡ Optimisations

1. **BufferGeometry** : Une seule géométrie pour toutes les particules
2. **PointsMaterial** : Plus rapide que MeshStandardMaterial
3. **useMemo** : Initialisation des positions une seule fois
4. **useRef** : Accès direct aux positions sans re-render
5. **DPR** : Limiter à [1, 2] pour mobile
6. **frameloop** : "always" pour animation continue

## 🧪 Tests

### Avant implémentation
- [ ] `npm run build` passe
- [ ] Hero.jsx fonctionne sans Particles

### Après implémentation
- [ ] Particles visibles sur fond blanc
- [ ] Mouvement aléatoire fluide
- [ ] Réaction à la souris (répulsion)
- [ ] Lignes de connexion visibles
- [ ] 60fps sur desktop (Chrome DevTools)
- [ ] 30fps+ sur mobile
- [ ] Pas de conflit avec GSAP
- [ ] Responsive (resize canvas)

## 📦 Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/components/three/Particles.jsx` | Créer |
| `src/components/three/ParticleField.jsx` | Créer |
| `src/components/three/ConnectionLines.jsx` | Créer |
| `src/components/Hero.jsx` | Modifier (ajouter Particles) |

## ⚠️ Points d'attention

1. **Z-index** : Canvas doit être derrière le contenu (z-0 vs z-10)
2. **pointer-events** : Canvas doit être pointer-events-none
3. **Overflow** : Section Hero doit être overflow-hidden
4. **Alpha** : Canvas doit être transparent (alpha: true)
5. **Resize** : Canvas doit gérer le resize de la fenêtre
6. **Cleanup** : Detacher les event listeners au unmount
