# Lyba — Portfolio Photographer & Videographer

Site portfolio (en **anglais UK**) pour **Lyba**, photographe & vidéaste
freelance. Préloader « appareil photo » (ouverture en « O ») et animations
style _studio_ (lessestudio).

## Stack

| Domaine | Outil |
| --- | --- |
| Build | Vite + React + TypeScript |
| Styles | Tailwind CSS |
| Scroll narratif / préloader | **GSAP** (ScrollTrigger) + **Lenis** (smooth scroll) |
| Interactions (galerie hover, pile de cartes) | **Framer Motion** |

Approche hybride : GSAP pilote le préloader et les révélations au scroll ;
Framer Motion gère les deux interactions inspirées des références fournies.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans /dist
npm run preview  # prévisualiser le build
```

## Structure

```
src/
├── App.tsx                  # assemble préloader + sections, gère l'état "ready"
├── index.css                # Tailwind + styles globaux (Lenis, sélection, reduced-motion)
├── lib/
│   ├── gsap.ts              # enregistre les plugins GSAP (ScrollTrigger)
│   ├── data.ts              # ← CONTENU : catégories + images (à remplacer)
│   └── types.ts
├── hooks/
│   ├── useLenis.ts          # smooth scroll, synchronisé avec GSAP, verrouillé pendant le préloader
│   ├── useMousePosition.ts  # suivi du curseur pour la galerie
│   └── useCardRotation.ts   # physique de la pile de cartes
└── components/
    ├── Preloader/           # ApertureIris + révélation en "O" (masque SVG)
    ├── Cursor/              # curseur personnalisé (data-cursor)
    ├── Navbar/
    ├── Hero/                # titre géant + parallax
    ├── Work/                # galerie au survol (catégories → photos dispersées)
    ├── Showcase/            # pile de cartes draggable
    ├── About/
    ├── Services/
    └── Footer/              # contact / CTA
```

## Remplacer les photos

1. Déposer les vraies images dans `public/img/`.
2. Mettre à jour les chemins dans **`src/lib/data.ts`** :
   - `POOL` → toutes les images sources,
   - `CATEGORIES` → les catégories et quelles images chacune révèle,
   - `STACK_IMAGES` → les images de la pile de cartes.
3. Les portraits de la section _About_ se changent dans `src/components/About/About.tsx`.

Les visuels actuels (`work-01..04`) sont des **placeholders** issus des projets de
référence.

## Notes

- `prefers-reduced-motion` est respecté (animations neutralisées).
- Curseur personnalisé actif uniquement sur appareils à pointeur fin (desktop).

## TODO / pistes

- [ ] Intégrer les vraies photos et textes
- [ ] Polices définitives (actuellement Anton + Inter via Google Fonts)
- [ ] Page projet détaillée / lightbox au clic d'une catégorie
- [ ] SEO : meta OpenGraph, favicon final, sitemap
- [ ] Déploiement (Vercel / Netlify)
```
