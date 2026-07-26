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
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # build de production dans /dist
pnpm preview  # prévisualiser le build
pnpm lint     # ESLint
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

- [x] Intégrer les vraies photos et textes
- [x] Polices définitives (Anton + Inter via Google Fonts)
- [x] SEO de base : meta Open Graph / Twitter Card (`index.html`)
- [ ] Catégories **Video** et **Events** : présentes dans `src/lib/data.ts`
      (`hidden: true`) mais pointent vers des images `work-01..04` qui
      n'existent pas dans `public/img/`. Ajouter les vraies photos/vidéos
      puis retirer `hidden: true` pour les afficher dans le Work.
- [ ] Liens sociaux : Instagram est réel, TikTok/YouTube ont été retirés du
      footer (placeholders `#`) — à rajouter dans `Footer.tsx` avec les
      vraies URLs.
- [ ] Page projet détaillée / lightbox au clic d'une catégorie
- [ ] SEO avancé : une fois le domaine final connu, ajouter `og:url`,
      `sitemap.xml`, `robots.txt` et un favicon PNG/ICO définitif
      (actuellement `aperture.svg` seul)
- [ ] Déploiement (Vercel / Netlify)
```
