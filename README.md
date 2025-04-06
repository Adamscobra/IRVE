# Calculateur Câblage IRVE

Application web pour le dimensionnement des installations de recharge pour véhicules électriques (IRVE) selon les normes NF C 14-100 et NF C 15-100.

## Fonctionnalités

- Calcul du courant d'emploi en fonction de la puissance et du type d'alimentation
- Détermination de la section de câble minimale requise
- Vérification de la chute de tension selon la longueur du circuit
- Recommandations pour les dispositifs de protection
- Vérification de conformité aux normes électriques

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Adamscobra/IRVE.git
cd IRVE

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

L'application sera accessible à l'adresse http://localhost:3000

## Technologies utilisées

- Node.js
- Express.js
- EJS (templates)
- CSS personnalisé

## Structure du projet

```
├── public/           # Fichiers statiques (CSS)
├── views/            # Templates EJS
│   ├── index.ejs     # Page d'accueil avec formulaire
│   └── results.ejs   # Page de résultats
├── server.js         # Serveur Express et logique de calcul
└── package.json      # Dépendances et scripts
```

## Développement

Pour lancer l'application en mode développement avec rechargement automatique :

```bash
npm run dev
```

## Avertissement

Cette application fournit des calculs simplifiés à titre indicatif. Pour une installation réelle, consultez un professionnel qualifié qui respectera l'intégralité des normes en vigueur.

## Licence

ISC