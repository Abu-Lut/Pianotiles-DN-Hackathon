const gameContainer = document.querySelector('#gameContainer')
console.log(gameContainer)
tileNum = 400


// Creating tiles

for (let i=0; i<tileNum; i++) {
    let tile = document.createElement('div')
    tile.classList.add('tile')
    i<4 && tile.classList.add('end')
    gameContainer.appendChild(tile)
}

// It will randomly allocate a black tile in each row and remove the 'tile' class to give an 'active' class instead

const tileList = document.querySelectorAll('.tile')
const letters = ['f', 'a', 's', 'd']

// 1, 2, 3, 4,--> 1%4 == 1, 2%4 == 2 , 3%4==3, 4%4==0              randomTile = 3      tileList[2]
// 5, 6, 7, 8 --> 5%4 == 1, 6%4 == 2, 7%4 ==3, 8%4==0              randomTile = 0, 1, 2, 3    8%4 == 0
// 9, 10, 11, 12
// ....400

function randomGen() {
    return Math.floor(Math.random()*4)
}

for (let i=1; i<tileList.length+1; i++){ 
    
    if (i%4==1){
        randomTile = randomGen()
        console.log(randomTile)
    }

    if ((i%4)==randomTile){
        tileList[i-1].classList.remove('tile')       
        tileList[i-1].classList.add('active')
        tileList[i-1].textContent = letters[i%4]
    }
}

const activeTileList = document.querySelectorAll('.active')

// Clicking an 'active' tile will make it inactive

for (let tile of activeTileList){
    tile.addEventListener('click', () => {
        tile.classList.remove('active')
        tile.classList.add('inactive')
    })
}


// Scrolls all the way to the bottom
gameContainer.scrollBy(0, 150*(tileNum/4))


// Preventing scroll wheel action inside game container
gameContainer.addEventListener("mousewheel", e => e.preventDefault())



function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0
}


const endTile = document.querySelector('.end')

let accelerator = 1

let scrollInterval = setInterval(() => {
    if (isInViewport(endTile)) {
        clearInterval(scrollInterval)
    }
    else {
        gameContainer.scrollBy(0, -(accelerator))
    }
    // console.log(isInViewport(endTile))
    // console.log(accelerator)
}, 10)

let acceleratorInterval = setInterval(() => {
    if (isInViewport(endTile)){
        clearInterval(acceleratorInterval)
    }
    else{
        accelerator +=0.001, 10
    }
})

// setInterval(() => {
//     gameContainer.scrollBy(0, -2)
//     console.log(accelerator)
// }, 10)





