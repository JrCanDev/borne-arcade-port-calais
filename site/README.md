# Borne d'Arcade du Port de Calais

Ce projet à été développé par Joshua Vandaële lors d'un stage se déroulant dans le cadre d'un projet entre le Port Boulogne Calais, VIIA, La Société des Ports du Détroit, la Ville de Calais, le SAS Coluche, JrCanDev, l'Université du Littoral Côte d'Opale et le Lycée Professionnel Pierre de Coubertin.

- [Borne d'Arcade du Port de Calais](#borne-darcade-du-port-de-calais)
  - [Mise en marche](#mise-en-marche)
  - [Utilisation](#utilisation)
  - [Licence](#licence)

## Mise en marche

Ce projet nécessite un système Debian avec Firefox (dernier testé : 123.0.1). Pour la première mise en marche, certains paramètres de Firefox ont besoin d'être changé.

1. Accéder à l'URL `about:config`.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`.
3. Recherchez `privacy.file_unique_origin` et assurez vous que cette valeur soit à `false`.

Pour que le projet démarre automatiquement au démarrage, configurez Firefox pour ouvrir le fichier "index.html" en mode kiosque au démarrage. Vous pouvez le faire en ajoutant la commande suivante à votre fichier `~/.bashrc` ou `~/.bash_profile` :

```bash
firefox --kiosk /chemin/vers/index.html
```

## Utilisation

Lancez "index.html" et entrer en mode plein-écran. (Touche F11 par défaut.)

## Licence

Ce projet est sous la licence GPLv3. Voir le fichier LICENSE pour plus d'information.