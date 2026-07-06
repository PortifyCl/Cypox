# Étude Approfondie — 6 Sites d'Inspiration pour CYPOX

**Date :** 1 juillet 2026
**Objectif :** Identifier les patterns, techniques et designs qui peuvent améliorer le portfolio CYPOX

---

## 1. UNSEEN.CO — Brand, Digital & Motion Studio

### Structure
- **Loader 3D rotatif** : Cube 3D avec les lettres U-N-S-E-N-E qui tourne (CSS 3D transforms, pas Three.js)
- **Navigation minimaliste** : 3 liens desktop (Index, Projects, Contact) — hover avec overlay serif italic
- **Menu mobile** : Clip-path circle reveal, items numérotés (01, 02, 03, 04)
- **Footer minimal** : ©2026 + bouton "Our 2025 Wrapped" + bouton World (globe SVG)

### Design System
- **Polices** : Neue Montreal (sans-serif), Saol Display (serif italic pour accents)
- **Couleurs** : Fond beige/cream (#efded9 pour le loader), texte noir, fond blanc
- **Layout** : Beaucoup d'espace négatif, typographie géante
- **Boutons** : 
  - `btn--fill` : fond noir qui monte de bas en haut au hover
  - `btn--border` : bordure fine + texte, hover avec background qui remplit
  - `btn--circle` : bouton rond avec icône

### Animations & Interactions
- **Custom cursor** : Cercle + point, mix-blend-différence, grossit au hover
- **Nav hover** : Le texte normal slide vers le haut, un texte serif italic slide depuis le bas
- **Scroll** : Asscroll (smooth scroll custom)
- **Loader** : Cube 3D CSS qui tourne, pas WebGL
- **Menu** : Clip-path circle qui s'ouvre depuis le bouton menu
- **Sons** : Audio au hover et aux interactions (optionnel)

### Ce qu'on peut reprendre pour CYPOX
1. **Loader CSS 3D** — Un cube rotatif avec les lettres CYPOX (pas Three.js, juste CSS)
2. **Nav hover serif italic** — Le texte normal slide up, italic slide in
3. **Boutons fill** — Fond noir qui monte de bas en haut
4. **Menu mobile clip-path** — Circle reveal depuis le bouton
5. **Footer minimaliste** — Juste © + lien + ville

---

## 2. ZAJNO.COM — Digital Studio

### Structure
- **Loader** : Compteur 0-100 + barre de progression
- **Navigation** : Logo à gauche, liens au centre, bouton menu à droite
- **Hero** : Titre géant + sous-titre + CTA
- **Sections** : Alternance fond blanc / fond noir

### Design System
- **Polices** : Custom font "s" (probablement Satoshi ou similaire)
- **Couleurs** : Fond #ebebeb (gris clair), texte #1a1a1a
- **Layout** : Grid clean, beaucoup d'espace

### Animations
- **Smooth scroll** : Custom implementation
- **Reveal animations** : Elements qui apparaissent au scroll
- **Hover effects** : Subtils, scale + opacité

### Ce qu'on peut reprendre pour CYPOX
1. **Sections alternées** blanc/noir pour casser la monotonie
2. **Loader avec compteur** — Similaire à ce qu'on a déjà

---

## 3. NOOMO AGENCY — 3D Storytelling

### Structure
- **Hero** : Titre géant + sous-titre descriptif + background image
- **Clients** : Logos en scrolling infini (marquee)
- **Awards** : Tableau détaillé avec FWA (12), Webby (08), Awwwards (23), CSS Design Award (07)
- **Témoignages** : Citations avec photo + nom + titre
- **Contact** : Formulaire simple avec budget dropdown
- **Footer** : Menu + Social + Email + Adresse

### Design System
- **Polices** : Serif pour les titres, sans-serif pour le body
- **Couleurs** : Fond sombre, texte clair, accents roses/rouges (❤)
- **Layout** : Two-column grids, beaucoup de images

### Animations
- **Heart cursor** : Le curseur devient un coeur (♥‿♥)
- **Marquee clients** : Logos qui défilent en boucle
- **Scroll reveals** : Elements qui apparaissent progressivement
- **Background image** : Image de fond avec overlay

### Ce qu'on peut reprendre pour CYPOX
1. **Section Awards/Récompenses** — Montrer les prix si CYPOX en a
2. **Marquee logos clients** — Défilement infini des logos
3. **Témoignages avec citation** — Format "photo + citation + nom + titre"
4. **Heart cursor** — Curseur personnalisé (on a déjà le cercle)
5. **Background image avec overlay** — Hero avec image + texte par-dessus

---

## 4. MESH3D.GALLERY — Three.js Showcase

### Structure
- **Hero** : Titre + sous-titre + compteur (0+ Experiences, 0+ Makers)
- **Grille de projets** : Cards avec preview image + favicon + titre + maker
- **Sélection éditoriale** : Badge "Selected by us" et "Featured"
- **Newsletter** : "Weekly Render" — 6 sites Three.js chaque semaine
- **Makers** : Section qui montre les créateurs (PeachWeb 23 entries, Unseen 23, Lusion 15)

### Design System
- **Polices** : Sans-serif clean
- **Couleurs** : Fond noir, texte blanc, accents verts pour "Featured"
- **Layout** : Grid responsive, cards avec ombres

### Features uniques
- **Marquee infinie** : Les projets défilent en boucle (CSS animation)
- **Badges** : "Selected by us", "Featured" pour la curation
- **Favicons** : Chaque projet affiche son favicon
- **Newsletter** : Inscription pour recevoir les meilleurs sites Three.js

### Ce qu'on peut reprendre pour CYPOX
1. **Grille de projets avec cards** — Image preview + favicon + titre
2. **Marquee infinie** — Pour les projets ou les technologies
3. **Badges de sélection** — "Projet vedette", "Sélection éditoriale"
4. **Compteur de projets** — "50+ projets livrés" (déjà fait)

---

## 5. VELLOVENTURES.COM — Venture Studio

### Structure
- **SPA React** : tout est dans un seul fichier JS (vendor-r3f, vendor-lenis, vendor-three)
- **Hero** : Titre "Speed is engineering." + sous-titre
- **3D** : Utilise Three.js + React Three Fiber + Lenis

### Design System
- **Polices** : Clash Display (display), Satoshi (body), JetBrains Mono (mono)
- **Couleurs** : Fond très sombre (#03060c), texte clair
- **Layout** : Full-screen sections

### Tech Stack
- React + Three.js + R3F + Lenis
- Rolldown (bundler moderne)
- CSS custom

### Ce qu'on peut reprendre pour CYPOX
1. **Polices** — Clash Display pour les titres (élégant, moderne)
2. **JetBrains Mono** — Pour les éléments techniques/code
3. **Fond très sombre** — #03060c au lieu de noir pur

---

## 6. ASCENDMARKETING.XYZ — Background 3D

### Structure
- **Hero** : Logo SVG + "Ascend." + navigation (About, Clients, Contact)
- **Hero content** : "Powering the next generation of web3 brands."
- **Background 3D** : Scène Three.js avec :
  - Torus/spiral 3D en filaire (spiral-shape-v3-optimize.glb)
  -另一个直的螺旋 (spiral-staight-v2-optimize.glb)
  - Environment map (studio-small-07-2k-1-.hdr)
  - Background overlay images (overlay.webp, overlay2.webp)
- **Loading** : Spinner ring (cercle qui tourne) + logo au centre
- **Sections** : OUR AGENCY, CLIENTS, CTA, Footer

### Design System
- **Polices** : Helvetica Now Display (medium, regular, light), Neue Haas Display Roman, Geist Mono, Instrument Serif
- **Couleurs** : Fond noir (#06040A), texte blanc, accents dorés
- **Layout** : Full-width sections, beaucoup d'espace

### Background 3D (détails techniques)
- **Fichier** : `spiral-shape-v3-optimize.glb` — Torus/spiral wireframe
- **Animation** : Rotation lente, pas d'interaction souris
- **Overlay** : Images webp avec overlay pour créer de la profondeur
- **HDR** : Environment map pour lesreflets
- **Scene state** : Fichier JSON pour l'état de la scène
- **PeachWorlds** : Builder no-code pour sites 3D

### Ce qu'on peut reprendre pour CYPOX
1. **Background 3D subtil** — Un torus wireframe rotation lente (pas de particles, pas de shapes complexes)
2. **Overlay images** — Images semi-transparentes par-dessus le 3D
3. **Spinner loading** — Cercle qui tourne pendant le chargement
4. **Instruments Serif** — Police serif élégante pour les accents

---

## RECOMMANDATIONS PRIORITAIRES POUR CYPOX

### 1. Loader (Priorité Haute)
**Inspiration** : Unseen.co (cube 3D CSS) + Ascend (spinner ring)
- Cube CSS rotatif avec les lettres C-Y-P-O-X
- OU spinner ring minimaliste + compteur 0-100
- Pas Three.js, juste CSS 3D transforms

### 2. Navigation (Priorité Haute)
**Inspiration** : Unseen.co
- Desktop : 3 liens numérotés (01 Accueil, 02 Réalisations, 03 Contact)
- Hover : Le texte slide up, un serif italic slide in par-dessous
- Mobile : Clip-path circle reveal depuis le bouton menu
- Items numérotés dans le menu mobile

### 3. Boutons (Priorité Haute)
**Inspiration** : Unseen.co
- `btn-fill` : Fond noir qui monte de bas en haut au hover (CSS ::before)
- `btn-border` : Bordure fine + texte, hover avec background fill
- `btn-border-light` : Même chose mais sur fond noir

### 4. Hero Section (Priorité Moyenne)
**Inspiration** : Noomo + Ascend
- Titre géant "Des idées qui marquent"
- Sous-titre descriptif plus long (2-3 lignes)
- Background : Image subtile avec overlay OU gradient
- CTA : Deux boutons (Voir le travail + Parlons de votre projet)

### 5. Section Awards/Témoignages (Priorité Moyenne)
**Inspiration** : Noomo Agency
- Tableau des réalisations (FWA, Awwwards, etc.)
- OU témoignages clients avec citation + photo + nom + titre
- Format : "Nom" en gras, "Titre" en gris, citation en italique

### 6. Marquee Clients (Priorité Basse)
**Inspiration** : Noomo + mesh3d
- Logos des clients qui défilent en boucle
- CSS animation, pas JS
- Utile si CYPOX a des clients identifiables

### 7. Footer (Priorité Haute)
**Inspiration** : Unseen.co
- Ultra-minimaliste : © 2024—26 CYPOX
- 3 liens : Accueil, Réalisations, Contact
- Ville : Cotonou, Bénin
- PAS de formulaire dans le footer

### 8. Polices (Priorité Moyenne)
**Inspiration** : Vello Ventures + Ascend
- **Display** : Clash Display OU Space Grotesk (déjà en place)
- **Body** : Inter (déjà en place)
- **Serif italic** : Playfair Display (déjà en place) OU Instrument Serif
- **Mono** : JetBrains Mono (pour les éléments techniques)

### 9. Background 3D Subtil (Priorité Basse)
**Inspiration** : Ascend Marketing
- Un seul torus wireframe qui tourne lentement
- Pas de particles, pas de shapes complexes
- Background noir avec overlay subtil
- Desktop uniquement, hidden sur mobile

### 10. Couleurs (Priorité Moyenne)
**Inspiration** : Ascend + Vello
- Fond : #06040A (très sombre) au lieu de noir pur #000
- Texte : #ffffff
- Accents : #efded9 (beige/cream comme Unseen) OU doré subtil
- Bordures : rgba(255,255,255,0.1)

---

## PATTERNS COMMUNS AUX 6 SITES

| Pattern | Unseen | Zajno | Noomo | mesh3d | Vello | Ascend |
|---------|--------|-------|-------|--------|-------|--------|
| Loader animé | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Custom cursor | ✅ | ❌ | ✅ (heart) | ❌ | ❌ | ❌ |
| Smooth scroll | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Nav hover animation | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Menu mobile overlay | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Marquee/scrolling | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| 3D/WebGL | ✅ (globe) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Témoignages | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Awards/récompenses | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Footer minimal | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## PROCHAINE ÉTAPE

Implémenter dans l'ordre :
1. **Loader CSS 3D** (cube CYPOX)
2. **Nav hover serif italic** (comme Unseen)
3. **Boutons fill** (fond qui monte)
4. **Footer minimaliste**
5. **Hero enrichi** (sous-titre plus long + layout amélioré)
6. **Section témoignages** (format Noomo)
7. **Background 3D subtil** (torus wireframe Ascend-style)
