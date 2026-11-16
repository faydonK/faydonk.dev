# Guide du site — faydonk.dev v2

Ce document explique ce qui a changé avec la v2 et comment ajouter ou modifier du contenu
sans rien casser.

---

## 1. Lancer le projet

```bash
npm install        # une fois
npm run dev        # site en local sur http://localhost:5173
npm run build      # vérifie les types (tsc) puis construit dist/
npm run lint       # oxlint (vérifie le code, réglages dans .oxlintrc.json)
npm run preview    # sert le build de production en local
```

Le build échoue s'il y a une erreur TypeScript : c'est voulu.

---

## 2. Ce qui a changé par rapport à la v1

| | v1 | v2 |
| --- | --- | --- |
| Design | fond noir simple, dégradé ShaderGradient | interface « HUD de visée » de la maquette (`archive/design/`) |
| Arrivée sur le site | rien | loader (le personnage se dessine trait par trait) puis ouverture du cadre du hero |
| Hero | titre + texte | nom qui se décode, étiquettes HUD, anneaux qui tournent, callouts ID / CLASS / ORIGIN |
| About | 3 paragraphes | timeline |
| Skills | grille d'icônes | logos en vraie 3D (extrudés) qui flottent et rebondissent autour d'un globe 🌐 |
| Projets | carte simple | pièce 3D au logo AirCodes + grille pour les projets suivants |
| Traductions | partielles | tout le site en EN / FR |
| Polices | Inter (fichier local) | Space Grotesk + JetBrains Mono, hébergées sur le site |
| Code | erreurs TypeScript, CSS dupliqué | typecheck au build, lint propre, une feuille globale de tokens |

Ce qui a été **retiré** est rangé dans `archive/` (voir `archive/README.md`) : page `/lab`,
cube en verre R3F, ShaderGradient, icônes JSX de la v1, ancien écran de chargement…

**Technos ajoutées** : GSAP (animation d'intro), three.js + React Three Fiber + drei + Rapier
(skills en 3D avec physique), `@fontsource-variable/*` (polices), oxlint (vérification du
code, à la place d'ESLint).
**Technos retirées** : lucide-react, @shadergradient/react, leva, camera-controls, ESLint et
ses plugins.

---

## 3. Où se trouve quoi

```
src/
  data/            site.ts (email, liens), skills.ts (technos/outils), projects.ts (projets)
  locales/         en.json, fr.json — tous les textes du site
  components/      un dossier par composant : Nom.tsx + Nom.css
    Intro/         loader + ouverture du hero (GSAP), blocage du scroll
    Loader/        l'écran « ACQUIRING TARGET »
    Hero/          titre, étiquettes HUD, callouts autour de la photo
    Skills/        scène 3D (SkillsScene.tsx), modèles 3D des logos (logoModel.ts), version CSS (CssSkills.tsx)
    Projects/ About/ Header/ Footer/ …
  assets/
    logos/         logos des technos en SVG (servent au rendu 3D ET à la version mobile)
    images/        avatar, logo AirCodes
    trace-paths.json   les traits du loader (générés par le script, voir §4.6)
  index.css        couleurs, polices, boutons… (les « tokens » du design)
public/
  og-banner.jpg    image de partage (réseaux sociaux)
  env/             éclairage HDR des logos 3D (preset « city », réduit à 512 px)
archive/           ancien code, jamais lu par le build
scripts/           outils locaux (pas dans git) : script de tracé de l'avatar
```

---

## 4. Ajouter ou modifier du contenu

### 4.1 Une techno ou un outil (section Skills)

1. Mettre le logo en **SVG** dans `src/assets/logos/` (ex. `bun.svg`).
2. Dans `src/data/skills.ts`, importer le fichier et l'ajouter à la bonne liste :

   ```ts
   import bun from '../assets/logos/bun.svg';

   export const TECHNOLOGIES: Skill[] = [
     // …
     { name: 'Bun', logo: bun },
   ];
   ```

C'est tout : **le modèle 3D est fabriqué automatiquement** à partir du SVG (chaque forme
pleine est extrudée dans sa couleur, avec une tranche métallique) et la version mobile
affiche le même SVG à plat. Le nom apparaît aussi dans la liste sous la scène.

**Bien choisir le SVG**, pour un rendu 3D propre :

- un SVG **en couleur** avec des **formes pleines** : le SVG officiel de la marque
  (kit presse) ou celui de [simple-icons.org](https://simple-icons.org) (libre de droits) ;
- le **texte doit être converti en tracés** (un `<text>` n'est pas extrudé) ;
- pas d'image intégrée (`<image>`), pas de dessin fait uniquement de contours (`stroke`) ;
- les dégradés sont remplacés par leur couleur moyenne, les masques et les reflets
  semi-transparents sont ignorés ;
- un logo blanc ou noir reste lisible sur fond sombre s'il est blanc (ex. Express).

Vérifier ensuite avec `npm run dev` : descendre jusqu'à « What I Use ».

### 4.2 Un projet

Tout se passe dans `src/data/projects.ts`, textes compris : ajouter une entrée.

```ts
{
  id: 'monprojet',            // identifiant unique
  name: 'MonProjet',
  logo: monProjetLogo,        // optionnel : image importée depuis src/assets/images/ (sans logo, pas de pièce)
  url: 'https://monprojet.dev',
  linkLabel: 'monprojet.dev',
  description: {              // texte long, affiché si le projet est en vedette
    en: 'Long text in English.',
    fr: 'Texte long en français.',
  },
  summary: {                  // optionnel : texte court pour la grille (sinon la description)
    en: 'Short text.',
    fr: 'Texte court.',
  },
},
```

Les deux langues sont obligatoires : s'il en manque une, `npm run build` le signale.

Le **premier** projet de la liste est en vedette (grande pièce 3D) ; les suivants
s'affichent automatiquement en grille en dessous. Pour un logo, préférer une image
carrée d'environ 512 px (WebP ou PNG).

### 4.3 Les textes et les traductions

Tous les textes sont dans `src/locales/en.json` et `src/locales/fr.json`, avec les
**mêmes clés** dans les deux fichiers. Dans un composant, un texte s'affiche avec
`t('section.cle')`. Les codes HUD décoratifs (REC, formules chimiques…) restent dans les
composants.

### 4.4 L'email et les réseaux

`src/data/site.ts` : `email` (utilisé partout : header, hero, footer, mentions) et
`socials` (boutons du footer).

Un clic sur « Open channel », sur l'email du footer ou sur celui des conditions ouvre une
petite fenêtre : **Gmail, Outlook, Proton Mail ou Apple Mail**. Les trois premiers ouvrent leur page
« nouveau message » dans un nouvel onglet, avec l'adresse déjà remplie ; Apple Mail n'a pas de
version web : c'est un lien `mailto:` qui ouvre l'application mail de l'appareil (Apple Mail sur
Mac et iPhone) (Ctrl/Cmd + clic garde le lien `mailto:`
classique). Pour ajouter un service : son logo SVG dans `src/assets/mail/`, puis une entrée
dans `src/data/mail.ts` avec son lien « nouveau message » :

```ts
{
  name: 'Yahoo Mail',
  logo: yahoo, // import yahoo from '../assets/mail/yahoo.svg';
  compose: (to) => `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}`,
},
```

Lien direct vers la fenêtre : ajouter `?openchannel` à n'importe quelle adresse du site
(ex. `https://faydonk.dev/en?openchannel`). Elle s'ouvre à l'arrivée (après l'intro si elle
joue) ; une fois fermée, `?openchannel` est retiré de l'adresse pour qu'un rechargement ne la
rouvre pas.

### 4.5 Les étiquettes autour de la photo (ID / CLASS / ORIGIN)

- `ID` affiche `SITE.name` ;
- `CLASS` et `ORIGIN` sont dans les traductions : `hero.callouts.class` et
  `hero.callouts.origin`, au format `LIBELLÉ · VALEUR` ;
- leurs angles autour de la photo sont dans `src/components/Hero/Hero.tsx`.

La place qu'elles prennent est calculée automatiquement ; sous 768 px de large elles
deviennent une ligne sous la photo.

### 4.6 Changer l'avatar et refaire les traits du loader

1. Remplacer `src/assets/images/pfp_faydonk.jpg` (image carrée, même nom ; JPEG qualité ~80,
   une vingtaine de Ko suffisent).
2. Régénérer les traits avec le script **local** `scripts/trace-avatar/` (pas dans git :
   garde-le de côté). Il ne trace que le personnage, jamais le décor derrière lui.

   ```bash
   # une fois : environnement Python avec uv
   uv venv .venv-trace
   uv pip install --python .venv-trace/bin/python -r scripts/trace-avatar/requirements.txt

   # régénérer (avec le masque retouché)
   .venv-trace/bin/python scripts/trace-avatar/trace_avatar.py \
     --source src/assets/images/pfp_faydonk.jpg \
     --mask scripts/trace-avatar/avatar-mask.png \
     --out src/assets/trace-paths.json \
     --control trace-control.png
   ```

3. Ouvrir `trace-control.png` (traits noirs sur blanc) : on ne doit voir que le
   personnage.

**Nouvel avatar** : lancer d'abord sans `--mask` mais avec `--save-mask nouveau-masque.png`,
puis retoucher ce PNG dans un logiciel de dessin :
blanc = personnage, **gris** = élément d'interface dessiné par-dessus le personnage
(gardé dans la silhouette, sans traits dedans), noir = fond. Relancer ensuite avec
`--mask nouveau-masque.png`. Plus l'image source est grande, plus les traits sont nets.

---

## 5. Comportements à connaître

- **L'intro ne joue qu'une fois par session**, et seulement si on arrive par l'accueil.
  Pour la revoir : nouvel onglet ou fenêtre privée.
- **Le scroll est bloqué pendant l'intro** (environ 5 s) : c'est voulu.
- **Réglage « réduire les animations » du système** : intro remplacée par un fondu, pas
  de scène 3D (version CSS), animations figées.
- **Mobile (moins de 720 px)** : la section Skills utilise la version CSS (pas de WebGL).
- **La scène 3D** (≈ 1 Mo) n'est téléchargée que sur grand écran, quand on descend vers la
  section Skills, et jamais en mode « économie de données » : la page principale reste légère.
  Elle prend toute la largeur du navigateur (les logos rebondissent sur ses bords gauche et
  droit) et la hauteur de la zone du globe.
- **Changer d'onglet dans Skills** : les logos sont balayés d'un côté (un « balai » invisible
  les pousse vraiment, c'est de la physique), chacun est retiré une fois sorti de l'écran, puis les
  autres sont lancés depuis l'autre côté : les technos arrivent par la gauche, les outils par la
  droite. Sur mobile (version CSS), le cercle de logos glisse dehors puis le nouveau arrive.
- **Langue** : le bouton `[ EN ▾ ]` du header déroule une petite liste pour choisir entre
  English et Français (Échap ou un clic à côté la referme). Les noms des langues sont dans
  `src/utils/i18n.ts` (`LANGUAGE_NAMES`).
- **Neige** : elle tombe tout le mois de décembre (pas avec « réduire les animations »).
  Pour la tester en local, ajouter `?snow=1` à l'adresse (ex. `http://localhost:5173/en?snow=1`),
  `?snow=0` pour la couper ; ça ne marche qu'en local, jamais sur le vrai site.
- **L'email du header** est pile au centre de la page ; sous 1100 px de large il est masqué
  (il reste dans le hero et le footer). Le lien « Terms » du footer est lui aussi centré.
- **L'intro** (loader + traits + animation) est elle aussi un fichier à part, téléchargé
  seulement quand elle joue.

---

## 6. Points techniques

- **three.js est bloqué en 0.182** : à partir de la 0.183, React Three Fiber v8 (la
  dernière version compatible React 18) affiche un avertissement dans la console. À
  mettre à jour seulement avec React 19 + React Three Fiber 9 + Rapier 2.
- L'éclairage des logos vient de `public/env/city_512.hdr` (preset « city » de drei, réduit
  à 512 px et hébergé sur le site pour ne dépendre d'aucun CDN).
- Chaque logo 3D est fusionné en 2 maillages (faces + tranche) : il coûte 2 appels de dessin,
  quel que soit le nombre de formes dans son SVG.
- `archive/` n'est lu par rien (TypeScript, oxlint, Vercel) : ne jamais importer depuis.
- `.lycheeignore` : liens que la vérification de liens de la CI ne teste pas (le lien
  « nouveau message » d'Outlook répond une erreur aux robots, mais marche dans un navigateur).
- Les détails d'architecture pour Claude Code sont dans `CLAUDE.md`.
