# Site officiel SOGASUR-MALI

Site statique (HTML, CSS, JavaScript), sans backend, prêt pour GitHub Pages.
Adresse cible : **https://sogasurmali.github.io**

---

## 1. Structure du projet

```
/
├── index.html            Accueil
├── about.html            À propos
├── services.html         Services & tarifs
├── references.html       Nos références
├── agrements.html        Agréments & autorisations
├── gallery.html          Galerie + vidéos
├── contact.html          Contact, formulaire de devis, Google Maps
├── gardiennage.html      Page SEO « Gardiennage à Bamako »
├── surveillance.html     Page SEO « Surveillance à Bamako »
├── securite.html         Page SEO « Sécurité privée au Mali »
├── 404.html              Page d'erreur
├── css/style.css         Toute la mise en forme (couleurs en haut du fichier)
├── js/main.js            Menu mobile, visionneuse, filtres galerie, formulaire
├── images/
│   ├── logo/             Logo officiel (transparent + fond noir) et icônes
│   ├── hero/             Photo du grand bandeau d'accueil
│   ├── agents/           Photos des agents
│   ├── equipes/  activites/  vehicules/  sites/   (prêts à recevoir des photos)
│   ├── agrements/        Documents officiels
│   └── og-sogasur-mali.jpg   Image de partage (Facebook, WhatsApp…)
├── assets/fonts/         Polices hébergées localement
├── videos/               Emplacement des futures vidéos
├── favicon.ico, favicon-32.png, apple-touch-icon.png, site.webmanifest
├── sitemap.xml, robots.txt
└── .nojekyll             Indique à GitHub Pages de servir les fichiers tels quels
```

Chaque image existe en deux formats : `.webp` (léger, utilisé en priorité) et `.jpg` (secours).

---

## 2. Publier sur GitHub Pages

1. Créer un compte ou une organisation GitHub nommé **`sogasurmali`** (le nom détermine l'adresse `sogasurmali.github.io`).
2. Créer un dépôt **public** nommé exactement **`sogasurmali.github.io`**.
3. Envoyer tout le contenu de ce dossier à la racine du dépôt :
   - Sans ligne de commande : dans le dépôt, *Add file → Upload files*, glisser **le contenu** du dossier (pas le dossier lui-même), puis *Commit changes*.
   - En ligne de commande :
     ```bash
     git init
     git add .
     git commit -m "Site SOGASUR-MALI"
     git branch -M main
     git remote add origin https://github.com/sogasurmali/sogasurmali.github.io.git
     git push -u origin main
     ```
4. Dans le dépôt : *Settings → Pages → Build and deployment* : Source = **Deploy from a branch**, Branch = **main**, dossier **/ (root)**. Enregistrer.
5. Attendre 1 à 3 minutes, puis ouvrir https://sogasurmali.github.io

> Le fichier `.nojekyll` est caché sur Mac/Windows : vérifiez qu'il a bien été envoyé.

**Tester en local avant publication :** dans ce dossier, lancer `python3 -m http.server 8000` puis ouvrir http://localhost:8000

---

## 3. Modifier les textes

Les textes sont directement dans les fichiers `.html`. Ouvrir le fichier avec un éditeur de texte (VS Code, Notepad++, TextEdit en mode texte brut), chercher la phrase avec Ctrl/Cmd+F, la modifier, enregistrer, renvoyer le fichier sur GitHub.

- **Tarifs** : ils apparaissent sur `index.html`, `services.html`, `gardiennage.html`, `surveillance.html`, `securite.html` (cartes + tableau « en un coup d'œil ») et dans `contact.html` (liste du formulaire). Rechercher par exemple `100 000` et remplacer partout.
- **Menu, pied de page, téléphone, email** : ils sont répétés dans chaque page. Utiliser « Rechercher/Remplacer dans tous les fichiers » de l'éditeur (VS Code : Ctrl/Cmd+Shift+H).
- **Numéro WhatsApp** : il figure dans les liens `https://wa.me/22391621502` (toutes les pages) et dans `js/main.js` (`WA_NUMBER`).
- **Titre et description Google d'une page** : balises `<title>` et `<meta name="description">` en haut du fichier.
- **Couleurs** : variables en haut de `css/style.css` (`--cream`, `--brown`, `--gold`…).

---

## 4. Modifier ou ajouter des photos

1. Préparer la photo : format JPG, 1200 à 1600 px de large, idéalement moins de 300 Ko (outil gratuit : https://squoosh.app, qui permet aussi d'exporter en WebP).
2. La placer dans le bon dossier (`images/agents/`, `images/equipes/`, `images/vehicules/`…) avec un nom sans espace ni accent, ex. `vehicule-patrouille-1.jpg` (+ `vehicule-patrouille-1.webp`).
3. **Remplacer une photo existante** : donner au nouveau fichier exactement le même nom que l'ancien (versions `.jpg` et `.webp`). Pour la photo d'accueil : `images/hero/agent-sogasur-mali-entree-800` et `-1280`.
4. **Ajouter une photo dans la galerie** : dans `gallery.html`, copier un bloc `<button class="g-item" …>…</button>` existant et modifier :
   - `data-cat` : `agents`, `equipes`, `activites`, `vehicules`, `sites` ou `agrements` ;
   - `data-src` et les chemins d'image ;
   - `alt` (description de la photo, utile pour Google) et `data-caption` / `<figcaption>` (légende).

   Le bouton de filtre de la catégorie apparaît automatiquement dès qu'une photo y est rangée.

---

## 5. Ajouter un agrément ou un document officiel

1. Scanner chaque page en JPG (idéalement sans la mention « CamScanner »), 1000 à 1600 px de haut. **Masquer toute information sensible** (numéros de série, QR codes) avant publication.
2. Placer les fichiers dans `images/agrements/` (ex. `nouvel-agrement-2026-page-1.jpg`, `-page-2.jpg`, + versions `.webp`).
3. Dans `agrements.html`, copier un bloc `<article class="doc …">…</article>` et adapter :
   - `id`, titre `<h3>`, année (`doc-year`), référence (`doc-ref`), description ;
   - `data-group="doc-NOM"` (unique pour chaque document) ;
   - `data-pages="page1.jpg|page2.jpg"` : les pages séparées par `|` ;
   - l'image de la miniature (`<picture>`) et le nombre de pages.
4. Facultatif : ajouter aussi les pages dans `gallery.html` (catégorie `agrements`) et dans la bande de l'accueil.

---

## 6. Vidéo

La vidéo de présentation (`videos/sogasur-mali-presentation.mp4`, format vertical, environ 4 Mo) apparaît sur l'accueil et dans la galerie, section « Nos activités en vidéo ». Elle ne se télécharge que lorsque le visiteur appuie sur lecture, pour préserver les forfaits mobiles.

- **Remplacer la vidéo** : déposer la nouvelle vidéo MP4 dans `videos/` sous le même nom `sogasur-mali-presentation.mp4`. Pour changer l'image d'aperçu, modifier l'attribut `poster="…"` de la balise `<video>` dans `index.html` et `gallery.html`.
- **Ajouter une deuxième vidéo** : copier le bloc `<div class="video-frame">…</div>` et changer le chemin `src`.
- Garder chaque vidéo sous 20 Mo (GitHub refuse les fichiers de plus de 100 Mo). Pour des vidéos plus lourdes, les publier sur YouTube et intégrer leur code `<iframe>`.

---

## 7. Google Maps

La section « Nous trouver » (`contact.html`) contient un bouton qui ouvre une recherche Google Maps à partir de l'adresse. Aucune coordonnée GPS n'a été inventée. Pour afficher une vraie carte :

1. Sur Google Maps, trouver le lieu exact (immeuble Hôtel Almounia, Faladié Sema) et vérifier que l'épingle est au bon endroit.
2. *Partager → Intégrer une carte → Copier le code HTML*.
3. Dans `contact.html`, repérer le commentaire `GOOGLE MAPS` et remplacer le bloc `<div class="map-card">…</div>` par le code copié. Supprimer les attributs `width` et `height` de l'`<iframe>` : la carte s'adapte alors automatiquement.

**Recommandé** : créer une fiche **Google Business Profile** (https://business.google.com) pour SOGASUR-MALI. C'est le facteur le plus important pour apparaître sur Google Maps et dans les recherches « société de gardiennage Bamako ».

---

## 8. Google Search Console

1. Aller sur https://search.google.com/search-console et ajouter une propriété de type **Préfixe de l'URL** : `https://sogasurmali.github.io/`
2. Validation — méthode la plus simple, **Balise HTML** : copier la balise `<meta name="google-site-verification" content="…">` fournie par Google, la coller dans `index.html` à l'endroit du commentaire prévu (en haut, dans `<head>`), publier, puis cliquer sur *Valider*.
   Alternative : télécharger le **fichier HTML** de validation proposé par Google et le déposer à la racine du dépôt.
3. Menu *Sitemaps* : saisir `sitemap.xml` et envoyer. (Adresse complète : https://sogasurmali.github.io/sitemap.xml)
4. Menu *Inspection de l'URL* : inspecter la page d'accueil et cliquer sur *Demander une indexation*.

Après chaque modification importante, mettre à jour la date `<lastmod>` dans `sitemap.xml`.

---

## 9. Ce qui est déjà optimisé

- SEO : title et description uniques, un seul H1 par page, balise canonical, Open Graph, ALT descriptifs, sitemap.xml, robots.txt, données structurées Schema.org (LocalBusiness, BreadcrumbList, catalogue d'offres).
- Performance : images WebP responsives avec chargement différé, photo d'accueil préchargée, polices locales, CSS et JS légers sans bibliothèque externe.
- Mobile : conçu d'abord pour le téléphone, menu hamburger, bouton WhatsApp flottant, formulaire adapté au tactile, aucun débordement horizontal.
- Sécurité des documents : le document relatif à l'arme est publié uniquement en **version masquée** (numéro de série, numéro gravé et QR code cachés). Les autres documents officiels sont publiés sans aucune modification de contenu.
