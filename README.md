# Dashboard Analytics Temps Réel

Dashboard Analytics Temps Réel est une interface de suivi conçue avec React, TypeScript et Vite. Le projet simule un flux de données en continu pour présenter un tableau de bord moderne avec indicateurs clés, graphique linéaire et répartition par canal.

## Aperçu

L'application met à jour ses données toutes les 3 secondes afin d'imiter un scénario temps réel sans dépendre d'un backend. Les chiffres, les graphiques et l'horodatage évoluent automatiquement pour donner une vue vivante des performances.

## Fonctionnalités

- Indicateurs principaux animés en temps réel.
- Graphique linéaire des ventes avec évolution continue.
- Diagramme circulaire de répartition des canaux.
- Interface responsive pensée pour desktop et mobile.
- Design sombre avec cartes translucides et effets de profondeur.

## Stack technique

- React 18
- TypeScript
- Vite
- Recharts

## Lancer le projet

### Prérequis

- Node.js 18 ou supérieur
- npm

### Installation

```bash
npm install
```

### Démarrage en développement

```bash
npm run dev
```

### Génération de production

```bash
npm run build
```

### Prévisualisation du build

```bash
npm run preview
```

## Structure du projet

```text
src/
	App.tsx
	main.tsx
	index.css
	components/
		Dashboard.tsx
		Dashboard.css
```

## Principe de fonctionnement

Les données initiales sont définies dans le composant principal du dashboard. Un intervalle met ensuite à jour les ventes, la répartition des canaux et l'horodatage. Les animations numériques et les graphiques Recharts assurent une lecture fluide des variations.

## Licence

Aucune licence n'est fournie pour le moment.
