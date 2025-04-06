const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser le corps des requêtes POST (form data)
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

// Page d'accueil (formulaire)
app.get('/', (req, res) => {
  res.render('index', { title: 'Calculateur Câblage IRVE' });
});

// Traitement du formulaire et affichage des résultats
app.post('/calculate', (req, res) => {
  const inputParams = req.body; // Récupère les données du formulaire

  // --- !!! SIMULATION DU CALCUL !!! ---
  // En réalité, ici se trouverait la logique complexe basée sur NF C 14-100
  // On se base sur les inputs pour générer des résultats plausibles
  const results = simulateCalculation(inputParams);
  // --- Fin de la simulation ---

  res.render('results', {
    title: 'Résultats du Dimensionnement',
    inputParams: inputParams, // On renvoie les params pour affichage
    results: results // On renvoie les résultats calculés/simulés
  });
});

// --- Démarrage du serveur ---
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});


// --- Fonction de Simulation (A REMPLACER PAR LOGIQUE REELLE) ---
function simulateCalculation(params) {
  // Exemple très simplifié
  const puissance = parseFloat(params.puissance) || 7.4;
  const tension = params.tension === 'triphase' ? 400 : 230;
  const longueur = parseFloat(params.longueur) || 15;

  let courantEmploi, sectionMin, protection, chuteTension, typeDiff;

  // Logique très basique (non conforme à la norme, juste pour l'exemple !)
  if (tension === 400) { // Triphasé
      courantEmploi = (puissance * 1000) / (tension * Math.sqrt(3));
      if (puissance <= 11) { sectionMin = '5G2.5'; protection = '20A'; typeDiff = 'A'; }
      else { sectionMin = '5G6'; protection = '32A'; typeDiff = 'A'; } // Ou B si DC > 6mA possible
  } else { // Monophasé
      courantEmploi = (puissance * 1000) / tension;
      if (puissance <= 3.7) { sectionMin = '3G2.5'; protection = '20A'; typeDiff = 'A'; }
      else { sectionMin = '3G6'; protection = '40A'; typeDiff = 'A'; } // Ou F/B selon borne
  }

  // Simulation chute tension (très grossière)
  // Ro cuivre = 0.01786 ohm.mm²/m. Formule simplifiée U = 2 * Ro * L * Ib / S (mono)
  const sectionNum = parseFloat(sectionMin.split('G')[1].replace(',', '.'));
  chuteTension = (2 * 0.01786 * longueur * courantEmploi) / sectionNum; // En Volts
  let chuteTensionPourcent = (chuteTension / tension) * 100;
  if (tension === 400) chuteTensionPourcent /= Math.sqrt(3); // Approximation triphasé

   // Simulation conformité (basique)
   const conformeChuteTension = chuteTensionPourcent <= 5;
   // Autres vérifications simulées
   const conformeProtection = true; // Simulé OK
   const conformeSection = true; // Simulé OK
   const conformeDiff = true; // Simulé OK

   const estConformeGlobal = conformeChuteTension && conformeProtection && conformeSection && conformeDiff;

  return {
    courantEmploi: courantEmploi.toFixed(1),
    protectionRecommandee: `Disjoncteur ${protection}, Courbe C, Différentiel Type ${typeDiff}`,
    sectionCableMin: `${sectionMin} mm²`,
    courantAdmissible: (parseFloat(protection) * 1.1).toFixed(1), // Simulation Iz > In
    chuteTensionPourcent: chuteTensionPourcent.toFixed(2),
    diametreConduit: sectionNum > 6 ? 'Ø 32 mm' : 'Ø 25 mm', // Très simplifié
    tauxRemplissage: '40%', // Exemple fixe
    conformite: {
        status: estConformeGlobal ? 'CONFORME' : 'NON CONFORME',
        details: [
            { check: 'Protection (In ≥ Ib)', ok: conformeProtection, raison: !conformeProtection ? 'Calibre inadapté' : '' },
            { check: 'Câble (Iz ≥ In)', ok: conformeSection, raison: !conformeSection ? 'Section insuffisante' : '' },
            { check: `Chute de tension (≤ 5%)`, ok: conformeChuteTension, raison: !conformeChuteTension ? `${chuteTensionPourcent.toFixed(2)}% > 5%` : `${chuteTensionPourcent.toFixed(2)}% ≤ 5%` },
            { check: 'Protection différentielle', ok: conformeDiff, raison: !conformeDiff ? 'Type incorrect' : '' },
            { check: 'Circuit dédié IRVE', ok: true, raison: '(Rappel normatif)'} // Non vérifiable par calcul seul
        ]
    }
  };
}