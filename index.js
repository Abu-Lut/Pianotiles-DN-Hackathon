const gameContainer = document.querySelector('#gameContainer')
console.log(gameContainer)
tileNum = 1000

for (let i=0; i<tileNum; i++) {
    let tile = document.createElement('div')
    tile.classList.add('tile')
    i<4 && tile.classList.add('end')
    gameContainer.appendChild(tile)
}

gameContainer.scrollBy(0, 20.3125*tileNum)

gameContainer.addEventListener("mousewheel", e => e.preventDefault())

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


const endTile = document.querySelector('.end')

let acclerator = 1
let scrollInterval = setInterval(() => {
    if (isInViewport(endTile)) {
        clearInterval(scrollInterval)
    }
    else {
        gameContainer.scrollBy(0, -(acclerator))
    }
    console.log(isInViewport(endTile))
    console.log(acclerator)
}, 10)

let acceleratorInteravl = setInterval(() => {
    if (isInViewport(endTile)){
        clearInterval(acceleratorInteravl)
    }
    else{
        acclerator +=0.001, 10
    }
})




