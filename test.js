const chaine = "Hey fellow warriors"
const result = chaine.split(' ')

let finish = result[0]
for (let i = 1; i < result.length; i++) {
    for (let m = result[i].length - 1; m >= 0; m--) {
        console.log(result[i][m])
    }
}




