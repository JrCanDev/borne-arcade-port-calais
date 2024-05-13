# Outils d'optimisation des images

Ce projet comprend des outils d'optimisation des images pour réduire la taille des images et améliorer la vitesse de chargement des pages web. Cet outil fonctionne uniquement sur Linux, et a été testé sur Debian 12 (Bookworm).

## Utilisation

Voici comment utiliser l'outil d'optimisation des images :

- Ouvrez le terminal.
- Naviguez jusqu'au répertoire parent du projet.
- Exécutez la commande suivante :

```bash
chmod +x optimise-images.sh
./optimise-images.sh
```

L'outil va alors parcourir tous les fichiers d'images du projet et les optimiser pour réduire leur taille. Veuillez noter que les images originales seront écrasées par les images optimisées, et que ce processus peut prendre un certain temps.

## Note importante

Assurez-vous d'avoir installé les dépendances nécessaires pour l'outil d'optimisation des images. Vous pouvez les installer en exécutant la commande suivante :

```bash
./optimise-images.sh --install
```

Si vous rencontrez des problèmes lors de l'installation des dépendances, veuillez les installer manuellement. Vous pouvez trouver la liste des dépendances en exécutant la commande suivante :

```bash
./optimise-images.sh --help
```
