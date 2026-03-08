

Title: note css 
---
## Les balises block et inline

exemple de code css
```css
.class {
    display: flex
}
```
## 1. Les balises block
- la taille occupé dans l'affichage (occupent toute la largeur de leur bloc, se positionne les unes au dessus des autres); ils peuvent etre re-dimensionner en hauteur et en largeur via des instruction css.

- la largeur et la hauteur.
pour changer la largeur ou la longueur des blocs.
```css
selector {
    width: 400px;
    height: 200px
}
```

- les marges.
Les marges d'un block on peut les diviser en deux catégories : 
 - externes 'margin'
 - internes 'padding'

## 2. Les balises inline
la taille occupé dans l'affichage, la largeur et la hauteur , les marges.

- occupent la largeur de son contenu seulement
- se positionne les unes à coté des autres
- ne peuvent pas étre redimenssionner en hauteur et en largeur


## 3. Les display
La propriété 'display' nous permet de transtyper l'affichage d'un élément HTML. 

### display: inline  
En appliquant la propriété display: block a des balise inline, on obtient une balise block. On peut alors modifier la largeur et la hauteur de cette balise.

### display: inline-block
En appliquant la propriété display: inline-block a des éléments inline on obtient une balise inline-block.On peut alors modifier la largeur et la hauteur de cette balise et leur marges.

### display: flex 
en appliquant la propriété display: flex aux elements HTML

## 4. Les pixels
Carré avec lequels les éléments que nous voyons à l'écran sont dessiné.
1 pixel ==> 0.2 mm


### Les avantages:
Le principale avantage est de pouvoir définir la taille des éléments plus précisement.

### Les inconvénients: 
fixer une taille est problèmatique si on veut faire du responsive.

## 5. Les pourcentages
Proportion de définir quelle proportion l'élément doit prendre de la largeur de son parent.

## Les avantages:
Sont trés pour créer des design responsive adapté aux différentes tailles d'écran.

## Les inconvénients:


