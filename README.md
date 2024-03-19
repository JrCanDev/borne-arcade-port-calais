# Borne d'Arcade du Port de Calais

Ce projet à été développé par Joshua Vandaële lors d'un stage se déroulant dans le cadre d'un projet entre le Port Boulogne Calais, VIIA, La Société des Ports du Détroit, la Ville de Calais, le SAS Coluche, JrCanDev, l'Université du Littoral Côte d'Opale et le Lycée Professionnel Pierre de Coubertin.

- [Borne d'Arcade du Port de Calais](#borne-darcade-du-port-de-calais)
  - [Mise en marche](#mise-en-marche)
  - [Liste des jeux](#liste-des-jeux)
  - [Licence](#licence)

## Mise en marche

Ce projet nécessite un système Debian avec Firefox (dernier testé : 123.0.1). Pour la première mise en marche, certains paramètres de Firefox ont besoin d'être changé.

1. Accéder à l'URL `about:config`.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`.
3. Recherchez `privacy.file_unique_origin` et assurez vous que cette valeur soit à `false`.

Pour que le projet démarre automatiquement au démarrage, configurez Firefox pour ouvrir le fichier "index.html" en mode kiosque au démarrage. Vous pouvez le faire en ajoutant la commande suivante à votre fichier `~/.bashrc` ou `~/.bash_profile` :

```bash
firefox --disable-pinch --kiosk /chemin/vers/index.html
```

`--disable-pinch` est utilisé pour désactiver le zoom sur les écrans tactiles.

## Liste des jeux

| Jeu             | Repo                                                                                                        | License                                                                | Demo                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Frogger         | [https://github.com/ruankranz/froggerGame](https://github.com/ruankranz/froggerGame)                        | MIT                                                                    | [ruankranz.github.io/froggerGame/](https://ruankranz.github.io/froggerGame/)                                                                    |
| Pacman          | [github.com/luciopanepinto/pacman](https://github.com/luciopanepinto/pacman)                                | GPLv3                                                                  | [pacman-e281c.firebaseapp.com](https://pacman-e281c.firebaseapp.com/)                                                                           |
| Tetris          | [github.com/jakesgordon/javascript-tetris](https://github.com/jakesgordon/javascript-tetris/)               | MIT                                                                    | [jakesgordon.com/games/tetris/](https://jakesgordon.com/games/tetris/)                                                                          |
| Puzzle          | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)                          | ISC                                                                    | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Où est charlie? | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| 7 erreurs       | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| Vrai ou faux?   | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| Blind test      | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| Qui est-ce?     | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)                          | ISC                                                                    | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Labyrinthe      | [https://www.the-art-of-web.com/javascript/maze-game](https://www.the-art-of-web.com/javascript/maze-game/) | [Free to use and adapt](https://www.the-art-of-web.com/copyright.html) | [https://www.the-art-of-web.com/javascript/maze-game-large/](https://www.the-art-of-web.com/javascript/maze-game-large/)                        |
| Snake           | [github.com/rembound/Snake-Game-HTML5](https://github.com/rembound/Snake-Game-HTML5)                        | MIT                                                                    | [rembound.com/articles/creating-a-snake-game-tutorial-with-html5](https://rembound.com/articles/creating-a-snake-game-tutorial-with-html5#demo) |

## Licence

Ce projet est sous la licence GPLv3. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
