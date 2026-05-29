# Petit rappel sur le but du JS et de sa particularité avec le typage:

Depuis sa création en 1995 par Brendan Eich le JS a pour but de permettre à des designers ou des amateurs 
de rendre des pages interactives sans qu'une simple erreur de type (additionner un nombre et du texte) ne 
fasse planter tout le navigateur. C'est pour cela que c'est un language faiblement typé et c'est pour cela 
qu'on créera plus tard le typescript qui est une surcouche du js permettant au js d'étre fortement typé.

exemple : Le créateur de JS voulait que le langage soit "gentil". Si vous demandez à JavaScript de faire 10 + "5", 
au lieu d'afficher une erreur rouge et d'arrêter le script, il se dit : "Tiens, l'utilisateur veut probablement coller du texte".
Résultat : "105"

Les valeurs falsy => 0; false; ""(chaine vide); null; undefined; Nan

Les valeurs truly => "0"; "false"(car chaine de caractère rempli); [] (tableau vide); {} (objet vide)


## pourquoi l'algo est si important 
1. Résoudre des problèmes (Problem Solving) => amélioration de ta logique
Apprendre l'algo => apprendre à penser comme l'ordi => point faible = trop fort

Un ordinateur est "bête" : il ne comprend que des instructions ultra-précises.
L'algorithmique te donne la méthodologie pour :
Décomposer un problème complexe en petites étapes simples.
Anticiper les cas d'erreurs (les "edge cases").
Structurer ta pensée avant même de toucher au clavier.

2. Le rapport avec le développement => imaginons que vous travaillez pour Sephora et que vous deviez appliquer 
une remise de 10% pour tout les parfum chanel => vous allez utiliser map + filter ou reduce.
Quand on utilise des framework backend + frontend on initialise des vaiable, on déclare des function; on fait des calcul complexe. 
Le monde numérique de 2026 est numérisé; derrière les pixels il y a les algorithme complexe.

3. Rapport avec les entreprise 
C'est la réalité du marché : les grandes entreprises (les GAFA mais aussi les belles startups françaises) 
testent systématiquement tes bases en algo. Elles ne veulent pas savoir 
si tu connais par cœur la dernière version de React, mais si tu es capable de 
résoudre un problème de logique complexe sous pression.


## Liste des méthodes intégrés JS :

## Arrays :
<span style="color:red">**pop()**</span> : Supprime le dernier élément d’un tableau
```javascript
const liste = [1, 3, 5, 4, 25, 0, 10]
console.log(liste.pop()) // reponse => 10
console.log(liste) // response => [1, 3, 5, 4, 25, 0]

```
<span style="color:red">**push()**</span> : Ajoute un nouvel élément à la fin du tableau
```javascript
const liste = [1, 3, 5, 4, 25, 0, 10]
liste.push(40)
console.log(liste) // response => [1, 3, 5, 4, 25, 0, 10, 40]

```

<span style="color:red">**sort()**</span> : Trie les éléments par ordre alphabétique
```javascript

const liste = [1, 3, 5, 4, 25, 0, 10]
console.log(liste.sort((a, b)=> a - b)) 
// response => [0, 1, 3, 4, 5, 10, 25]  ordre croissant

const liste = [1, 3, 5, 4, 25, 0, 10]
console.log(liste.sort((a, b)=> b - a)) 
// response => [25, 10, 5, 4, 3,  1, 0]  ordre décroissant

```
<span style="color:red">**reverse()**</span> : Trier les éléments dans un ordre décroissant
```javascript
const liste = [1, 3, 4, 25, 0, 10]
console.log(liste.reverse()) // response => [10, 0, 25, 4, 3, 1]

```

<span style="color:red">**shift()**</span> : Supprime le premier élément d’un tableau
```javascript
const liste = [1, 3, 5, 4, 25, 0, 10]
liste.shift()
console.log(liste) // response => [ 3, 5, 4, 25, 0, 10 ]
```

<span style="color:red">**String()**</span> : Convertit des éléments en chaînes de caractères
```javascript
let liste = [1, 3, 5, 4, 25, 0, 10]
const newliste = liste.map(a => String(a))
console.log(newliste) // response => ['1', '3', '5', '4', '25', '0', '10']
```

<span style="color:red">**concat()**</span> : Fusionne plusieurs tableaux en un seul
```javascript
const fruits = ["Pomme", "Banane"];
const legumes = ["Carotte", "Poireau"];

const courses = fruits.concat(legumes); 
// ["Pomme", "Banane", "Carotte", "Poireau"]
```

<span style="color:red">**join()**</span> : Combine les éléments d’un tableau en une seule chaîne de caractères et renvoie la chaîne
```javascript
const smileys = ["😀", "😎", "🚀"];

const texte = smileys.join(" - "); 
// "😀 - 😎 - 🚀"
```
<span style="color:red">**include()**</span> : Son rôle est de vérifier si un élément (pour un tableau) ou une sous-chaîne (pour du texte) est présent.

Elle renvoie toujours un Booléen (true ou false).

```javascript
const fruits = ["Pomme", "Banane", "Orange"];

console.log(fruits.includes("Banane")); // true
console.log(fruits.includes("Fraise")); // false
```


<span style="color:red">**slice()**</span> : Copie une partie d’un tableau dans un nouveau tableau
```javascript
const amis = ["Alice", "Bob", "Charlie", "David"];
const duo = amis.slice(1, 3); 

console.log(duo);  // ["Bob", "Charlie"]
console.log(amis); // ["Alice", "Bob", "Charlie", "David"] (Inchangé)
```

<span style="color:red">**splice()**</span> : Est utilisé pour modifier le contenu d’un tableau en supprimant les éléments existants et/ou en ajoutant de nouveaux éléments.
```javascript
let mois = ["Janvier", "Mars", "Avril"];

// À l'index 1, on supprime 0 élément et on ajoute "Février"
mois.splice(1, 0, "Février");

console.log(mois); // ["Janvier", "Février", "Mars", "Avril"]
```

<span style="color:red">**valueof()**</span> : Retourne la valeur primitive de l’objet spécifié
```javascript
const nombres = [1, 2, 3];
console.log(nombres.valueOf()); // [1, 2, 3]
```

<span style="color:red">**indexof()**</span> : Retourne le premier index auquel l’élément donné peut être trouvé dans un tableau, ou -1 s’il n’est pas présent dans un tableau.
```javascript
const sports = ["Foot", "Tennis", "Rugby"];

console.log(sports.indexOf("Tennis")); // 1
console.log(sports.indexOf("Basket")); // -1 (N'existe pas)
```

## String
<span style="color:red">**search()**</span> : Recherche dans une chaîne de caractères la valeur spécifiée et renvoie la position de la correspondance.
```javascript
const texte = "Contactez le 0601020304";
// Cherche n'importe quel chiffre (\d)
console.log(texte.search(/\d/)); // 13
```

<span style="color:red">**toLowerCase()**</span>: Convertit une chaîne de caractères en minuscules
```javascript
const cri = "J'AI FAIM !";
console.log(cri.toLowerCase()); // "j'ai faim !"
```

<span style="color:red">**toUpperCase()**</span> : Convertit une chaîne de caractères en majuscules
```javascript
const chuchotement = "je dors...";
console.log(chuchotement.toUpperCase()); // "JE DORS..."
```


<span style="color:red">**charAt()**</span> : Retourne le caractère à la position spécifiée dans la chaîne
```javascript
const prenom = "Zelda";
console.log(prenom.charAt(0)); // "Z"
console.log(prenom.charAt(4)); // "a"
```

<span style="color:red">**concat()**</span> : Concatène deux ou plusieurs chaînes en une seule
```javascript
const debut = "Hello";
const fin = " World";
console.log(debut.concat(fin)); // "Hello World"
```

<span style="color:red">**charCodeAt()**</span> : Retourne la valeur unicode d’un caractère à la position spécifiée
```javascript
const mot = "ABC";
console.log(mot.charCodeAt(0)); // 65 (Le code de 'A')
```

<span style="color:red">**lastIndexof()**</span> : Fournit la position du dernière occurrence d’un texte spécifié dans une chaîne
```javascript
const phrase = "Le chat mange le poisson";
console.log(phrase.lastIndexOf("le")); // 14 (idem ici, mais cherche en partant de la droite)
// Note: "Le" avec majuscule n'est pas "le" !
```

<span style="color:red">**slice()**</span> : Extrait une partie d’une chaîne et la renvoie sous forme de nouvelle chaîne
```javascript
const film = "Star Wars";
console.log(film.slice(0, 4)); // "Star"
```

<span style="color:red">**split()**</span> : Découpe une chaîne de caractère en un tableau de sous-chaînes en fonction d’un séparateur
```javascript
const liste = "Pomme,Poire,Pêche";
const tableau = liste.split(","); 
// ["Pomme", "Poire", "Pêche"]
```

<span style="color:red">**replace()**</span> : Recherche et remplace un texte spécifique dans une chaîne
```javascript
const message = "J'aime le thé et le thé";
console.log(message.replace("thé", "café")); 
// "J'aime le café et le thé"
```




