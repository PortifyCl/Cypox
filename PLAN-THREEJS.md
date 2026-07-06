# Plan d'implémentation Three.js pour CYPOX

## 🎯 Vue d'ensemble
Ajouter des effets Three.js interactifs au site CYPOX en 6 étapes progressives.
Chaque étape est indépendante et peut être testée avant de passer à la suivante.

---

## 📦 Phase 0 : Installation et structure

### Fichiers à créer
```
src/
├── components/
│   ├── three/
│   │   ├── Particles.jsx        ← Phase 1
│   │   ├── FloatingShapes.jsx   ← Phase 2
│   │   ├── MouseFollower.jsx    ← Phase 3
│   │   ├── ScrollGlobe.jsx      ← Phase 4
│   │   ├── PostEffects.jsx      ← Phase 5
│   │   └── Text3D.jsx           ← Phase 6
│   └── Hero.jsx                 ← Modification
```

### Packages installés ✅
- three
- @react-three/fiber
- @react-three/drei

### Packages à installer
- @react-three/postprocessing (Phase 5)

---

## 📦 Phase 1 : Particles Background (HERO)

### Objectif
Champ de particules noires sur fond blanc qui réagissent à la souris avec lignes de connexion.

### Composants
| Composant | Rôle |
|-----------|------|
| `Particles.jsx` | Canvas R3F + particules |
| `ParticleField.jsx` | Logique des particules (positions, vitesses) |
| `ConnectionLines.jsx` | Lignes entre particules proches |

### Fonctionnalités
- [ ] 600-800 particules noires
- [ ] Mouvement aléatoire lent
- [ ] Réaction à la souris (éloignement)
- [ ] Lignes de connexion si distance < seuil
- [ ] Performance : utiliser BufferGeometry + Points
- [ ] Mobile : réduire à 300 particules

### Intégration Hero.jsx
```jsx
// Hero.jsx
<section>
  <ParticlesCanvas />  ← NOUVEAU (positionné en arrière-plan)
  <div className="relative z-10">
    {/* Contenu existant */}
  </div>
</section>
```

### Tests
- [ ] Vérifier 60fps sur desktop
- [ ] Vérifier mobile (300 particules)
- [ ] Vérifier interaction souris
- [ ] Vérifier performance après 30s

---

## 📦 Phase 2 : Floating 3D Shapes (HERO RIGHT)

### Objectif
Remplacer la colonne droite statique par des formes 3D qui flottent.

### Composants
| Composant | Rôle |
|-----------|------|
| `FloatingShapes.jsx` | Canvas R3F avec formes |
| `TorusShape.jsx` | Torus wireframe noir |
| `SphereWireframe.jsx` | Sphère wireframe |

### Fonctionnalités
- [ ] Torus noir wireframe qui tourne lentement
- [ ] Sphère wireframe qui pulse subtilement
- [ ] Effet Float de drei pour le flottement
- [ ] Réaction légère à la souris
- [ ] Ombre portée subtile

### Intégration Hero.jsx
```jsx
// Hero.jsx - Colonne droite
<div className="hidden lg:flex">
  <FloatingShapesCanvas />
</div>
```

### Tests
- [ ] Rotation fluide
- [ ] Pas de conflit avec particles
- [ ] Mobile : masquer (déjà hidden lg:flex)

---

## 📦 Phase 3 : Mouse-Following Element

### Objectif
Élément 3D qui suit la souris avec délai (lerp) pour un effet premium.

### Composants
| Composant | Rôle |
|-----------|------|
| `MouseFollower.jsx` | Forme 3D qui suit la souris |

### Fonctionnalités
- [ ] Petit cube ou sphère noire
- [ ] Position = lerp(souris, 0.1)
- [ ] Rotation basée sur la vitesse
- [ ] Masquer sur mobile
- [ ] Performance : RAF uniquement

### Intégration
```jsx
// App.jsx - Au niveau global
<MouseFollowerCanvas />  ← Canvas fixe, z-index élevé mais pointer-events-none
```

### Tests
- [ ] Suit la souris avec délai
- [ ] Pas de lag
- [ ] Invisible sur mobile

---

## 📦 Phase 4 : Scroll-Based 3D (SECTIONS)

### Objectif
Objets 3D dans les sections qui réagissent au scroll.

### Composants
| Composant | Rôle | Section |
|-----------|------|---------|
| `ScrollGlobe.jsx` | Globe wireframe | About |
| `ScrollIcons.jsx` | Icônes 3D | Skills |

### Fonctionnalités - Globe (About)
- [ ] Globe wireframe noir
- [ ] Rotation = scroll position
- [ ] Points pour les 4 villes (Cotonou, Paris, Bruxelles, Genève)
- [ ] Taille : 200x200px

### Fonctionnalités - Icons (Skills)
- [ ] Icônes 3D React, Figma, GSAP
- [ ] Apparition au scroll
- [ ] Rotation subtile

### Intégration
```jsx
// About.jsx
<div className="relative">
  <ScrollGlobeCanvas className="absolute right-0 top-0 w-48 h-48" />
  {/* Contenu existant */}
</div>
```

### Tests
- [ ] Globe rotate au scroll
- [ ] Performance : un seul Canvas pour toutes les sections

---

## 📦 Phase 5 : Post-Processing Effects

### Objectif
Ajouter des effets cinématiques (bloom, noise, vignette).

### Packages
```bash
npm install @react-three/postprocessing
```

### Composants
| Composant | Rôle |
|-----------|------|
| `PostEffects.jsx` | Bloom + Noise + Vignette |

### Fonctionnalités
- [ ] Bloom subtil (threshold: 0.8, intensity: 0.3)
- [ ] Noise overlay (density: 0.5)
- [ ] Vignette légère
- [ ] Uniquement sur le Hero (pas partout)

### Intégration
```jsx
// Particles.jsx ou Hero
<Canvas>
  <Particles />
  <PostEffects />  ← NOUVEAU
</Canvas>
```

### Tests
- [ ] Bloom visible mais pas excessif
- [ ] Noise subtil
- [ ] Performance : pas de drop fps

---

## 📦 Phase 6 : 3D Text (HERO)

### Objectif
Texte "CYPOX" rendu en 3D avec extrusion et rotation subtile.

### Composants
| Composant | Rôle |
|-----------|------|
| `Text3D.jsx` | Texte 3D avec drei |

### Fonctionnalités
- [ ] Texte "CYPOX" en 3D
- [ ] Font : Inter ou Space Grotesk
- [ ] Couleur noire
- [ ] Rotation Y subtile (0.1 rad/s)
- [ ] Position : colonne droite du Hero

### Intégration
```jsx
// Hero.jsx - Colonne droite (remplace ou ajoute)
<Text3DCanvas />
```

### Tests
- [ ] Texte lisible
- [ ] Rotation fluide
- [ ] Mobile : texte 2D classique

---

## 🔄 Ordre d'implémentation

```
Phase 0: Structure + test build
    ↓
Phase 1: Particles Background ⭐ PRIORITÉ 1
    ↓
Phase 2: Floating Shapes ⭐ PRIORITÉ 2
    ↓
Phase 3: Mouse-Following
    ↓
Phase 4: Scroll-Based 3D
    ↓
Phase 5: Post-Processing
    ↓
Phase 6: 3D Text
```

---

## ⚡ Optimisations Performance

### Règles R3F
1. Jamais de `setState` dans `useFrame`
2. Utiliser `useMemo` pour les géométries
3. Utiliser `useRef` pour les mutables
4. Un seul `Canvas` par zone (pas multi-canvas)
5. `frameloop="demand"` si pas d'animation continue

### Mobile
- Particles : 300 au lieu de 800
- Floating shapes : masqués
- Mouse follower : masqué
- Post-processing : désactivé
- Scroll 3D : simplifié

### Bundle
- Lazy load les composants Three.js
- Dynamic import : `const Particles = lazy(() => import('./three/Particles'))`

---

## 📋 Checklist finale

### Avant chaque phase
- [ ] `npm run build` passe
- [ ] Pas d'erreurs console
- [ ] Test mobile (responsive)

### Après chaque phase
- [ ] Animation fluide (60fps)
- [ ] Interaction souris OK
- [ ] Performance stable après 30s
- [ ] Pas de conflit avec GSAP
- [ ] Mobile : fallback gracieux

### Phase finale
- [ ] Toutes les phases fonctionnent ensemble
- [ ] Bundle size acceptable (< 500KB JS)
- [ ] Lighthouse score > 90
- [ ] Test sur 3 navigateurs (Chrome, Firefox, Safari)
