# Bataille Navale

## Description du Projet

Ce projet est une implémentation du jeu de bataille navale en utilisant **HTML, CSS, JavaScript, PHP et MySQL**. Il permet aux joueurs de tenter de couler tous les bateaux adverses sur une grille de 10x10 en cliquant sur les cases.

## Fonctionnalités

- Interface graphique en **HTML/CSS/JavaScript** avec une grille cliquable.
- Gestion des interactions et des tirs en **JavaScript** avec des requêtes **fetch**.
- Stockage des positions des bateaux en **MySQL**.
- Traitement des tirs et gestion de la partie en **PHP**.
- Suivi des scores des joueurs avec un tableau des scores.
- Affichage des bateaux coulés et message de victoire.

## 1. Conception du Jeu

### 1.1 Règles

- Le jeu se base sur une **matrice 10x10** où chaque case représente une position sur la mer.
- Les bateaux sont représentés par des nombres dans la matrice :
  - `1` : Torpilleur (taille 2)
  - `2` : Sous-marin (taille 3)
  - `3` : Croiseur (taille 4)
  - `4` : Porte-avions (taille 5)
- Lorsque le joueur clique sur une case :
  - Si un bateau est touché, la case devient **rouge**.
  - Si aucun bateau n'est touché, la case devient **bleue**.
- Un message **"Vous avez gagné"** s'affiche lorsque tous les bateaux ont été coulés.

## 2. Structure de la Matrice de Jeu

La grille est une **matrice 10x10** où chaque valeur représente un élément :

- `0` : Case vide
- `1-4` : Bateaux avec leur identifiant

Exemple de matrice :

```python
grid = [
 [3, 0, 0, 0, 0, 0, 0, 2, 2, 0],
 [3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 2, 2, 0, 0, 0],
 [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
 [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
 [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
 [3, 3, 3, 0, 0, 5, 0, 0, 0, 4],
 [0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
```

## 3. Front-End : Interface JavaScript et HTML + CSS

### 3.1 Grille de Jeu

- Une grille **10x10** où chaque case est cliquable.
- Un clic affiche une couleur correspondant à un **touche** (rouge) ou **manqué** (bleu).
- Les colonnes sont numérotées **0-9** et les lignes **A-L**.

### 3.2 Affichage des Résultats

- Un message **"Vous avez gagné"** s'affiche lorsque tous les bateaux sont coulés.
- Liste des bateaux coulés avec leurs coordonnées.

### 3.3 Gestion des Clics

- Chaque clic envoie une requête **fetch** au serveur **PHP** pour vérifier la présence d'un bateau.
- La réponse met à jour l'affichage.

## 4. Back-End : PHP et MySQL

### 4.1 Base de données MySQL

Une table pour stocker les positions des bateaux :

```sql
CREATE TABLE bateaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    row INT NOT NULL,
    col INT NOT NULL,
    bateau_id INT NOT NULL
);
```

### 4.2 Gestion des Clics en PHP

- Le serveur reçoit les coordonnées de la case cliquée.
- Il interroge la base de données pour vérifier si un bateau est présent.
- Retourne `touché` ou `manqué` au front-end.

## 5. Communication entre Front-End et Back-End

### 5.1 Requêtes fetch

Le **JavaScript** envoie une requête :

```js
fetch('server.php', {
    method: 'POST',
    body: JSON.stringify({ row: 2, col: 3 })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 5.2 Traitement PHP

Le **PHP** traite la requête et interroge la base de données :

```php
$row = $_POST['row'];
$col = $_POST['col'];
$sql = "SELECT bateau_id FROM bateaux WHERE row = $row AND col = $col";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    echo json_encode(["status" => "touché"]);
} else {
    echo json_encode(["status" => "manqué"]);
}
```

## 6. Fonctionnalité de Victoire

- Une vérification est faite après chaque tir.
- Si tous les bateaux sont coulés, un message de victoire est affiché.

## 7. Nom des Bateaux Coulés

Chaque bateau est suivi avec son identifiant et affiché dans une liste des bateaux coulés.

## 8. Tableau des Scores

- Un tableau enregistre le nombre de victoires par joueur.
- Exemple de structure de la table :

```sql
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    joueur VARCHAR(50) NOT NULL,
    victoires INT DEFAULT 0
);
```

- Mise à jour du score après une victoire.

## Installation

1. Clonez le projet :
2. Configurez la base de données MySQL avec les tables ci-dessus.
3. Hébergez le serveur PHP et assurez-vous que les fichiers sont accessibles.
4. Lancez le projet dans un navigateur et commencez à jouer ! 🎮

## Auteur

Projet développé par **Lin Ilan et Evrad Mepiyou** dans le cadre d’un exercice de développement web sur quatre jours.

