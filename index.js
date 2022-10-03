const gameContainer = document.querySelector("#gameContainer");
console.log(gameContainer);
tileNum = 200;
let gameOver = false;
let scoreCount = 0;
let highScore;
let vtLength;
var lastTileGlobal;
let gameCount = 0

let visibleTiles = [];

if (!localStorage.getItem("high-score")) {
  localStorage.setItem("high-score", "0");
}else{
    highScore = localStorage.getItem('high-score');
    document.querySelector('#highScore-2').textContent = highScore;
}
console.log(highScore)
// Creating tiles
function gameCreator() {
  gameCount +=1
  for (let i = 0; i < tileNum; i++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    i < 4 && tile.classList.add("end");
    i < 4 && tile.classList.remove("tile");
    gameContainer.appendChild(tile);
  }

  // It will randomly allocate a black tile in each row and remove the 'tile' class to give an 'active' class instead

  const tileList = document.querySelectorAll(".tile");
  const letters = ["F", "A", "S", "D"];

  // 1, 2, 3, 4,--> 1%4 == 1, 2%4 == 2 , 3%4==3, 4%4==0              randomTile = 3      tileList[2]
  // 5, 6, 7, 8 --> 5%4 == 1, 6%4 == 2, 7%4 ==3, 8%4==0              randomTile = 0, 1, 2, 3    8%4 == 0
  // 9, 10, 11, 12
  // ....400

  function randomGen() {
    return Math.floor(Math.random() * 4);
  }

  for (let i = 1; i < tileList.length + 1; i++) {
    if (i % 4 == 1) {
      randomTile = randomGen();
    }

    if (i % 4 == randomTile) {
      tileList[i - 1].classList.remove("tile");
      tileList[i - 1].classList.add("active");
      tileList[i - 1].innerHTML = `<div class = "tile-letter">${
        letters[i % 4]
      }</div>`;
    }
  }

  const activeTileList = document.querySelectorAll(".active");

  const activeList = Array.from(document.querySelectorAll(".active"));

   visibleTiles = [];
  // Clicking an 'active' tile will make it inactive

  for (let tile of activeTileList) {
    tile.addEventListener("click", () => {
      increaseScore();
      tile.classList.remove("active");
      tile.classList.add("inactive");
      visibleTiles.shift();
    });
  }

  // Scrolls all the way to the bottom
  gameContainer.scrollBy(0, 150 * (tileNum / 4));

  // Preventing scroll wheel action inside game container
  gameContainer.addEventListener("mousewheel", (e) => e.preventDefault());

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) + 150 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  const endTile = document.querySelector(".end");
  
  let options3 = {
    threshold: 1
  }
  const observer3 = new IntersectionObserver((entries) => entries[0].isIntersecting && stopGame(true), options3)
  observer3.observe(endTile)


  let accelerator = 1;

  const lastTile = activeList.slice(-1)[0];
  lastTileGlobal = lastTile;
  lastTile.innerHTML += "<span>start</span>";

  let scrollInterval
  lastTile.addEventListener("click", () => {
      scrollInterval = setInterval(() => {

        gameContainer.scrollBy(0, -accelerator);
        accelerator += 0.001;
    
      // console.log(isInViewport(endTile))
      // console.log(accelerator)
    }, 10);
  });

  // let acceleratorInterval = setInterval(() => {
  //     if (isInViewport(endTile)){
  //         clearInterval(acceleratorInterval)
  //     }
  //     else{

  //     }
  // }, 100)

  // setInterval(() => {
  //     gameContainer.scrollBy(0, -2)
  //     console.log(accelerator)
  // }, 10)

  function increaseScore() {
    scoreCount += 1;
    let score = document.getElementById("score-2");
    score.textContent = scoreCount;
    // let highScore = 0

    // checking if scoreCount beats high score or not
    if(scoreCount > parseInt(localStorage.getItem('high-score'))){
        highScore = scoreCount;
        localStorage.setItem('high-score',highScore);
        document.querySelector('#highScore-2').textContent = highScore;
    }
  }

  // GAME OVER POPUP
  let whiteTiles = document.querySelectorAll(".tile");
  let gameoverCard = document.querySelector(".gameover-popup");
  let gameEndedCard = document.querySelector(".highscore-popup")

  let scrollInterval2
  function stopGame(lastTile = false) {
    if (lastTile ){
      gameEndedCard.querySelector('#highscoreReal').textContent = scoreCount
      gameEndedCard.classList.add("openPopup2")
    }
    else {
      gameoverCard.querySelector('#score').textContent = scoreCount;
      gameoverCard.classList.add("openPopup");
    }
    clearInterval(scrollInterval);
    clearInterval(scrollInterval2)
    // clearInterval(acceleratorInterval);
    clearInterval(missingInterval);
  }


  whiteTiles.forEach((item) =>
    item.addEventListener("click", () => {
      item.style.backgroundColor = "red";
      gameoverCard.querySelector('#gameOverMessage').textContent = 'Oops, you clicked on the white tile!'
      stopGame();
    })
  );

  // Checking if an black tile is missed

  for (let i = activeList.length - 1; i > activeList.length - 5; i--) {
    visibleTiles.push(activeList[i]);
  }
  vtLength = visibleTiles.length;

  let options = {
    root: gameContainer,
    rootMargin: "0px",
    threshold: 1,
  };

  let count = 0;

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        count += 1;
        if (count > 4) {
          visibleTiles.push(entry.target);
          console.log(visibleTiles);
        }
      }
    });
  }, options);

  activeList.forEach((activeTile) => observer.observe(activeTile));

  // let options2 = {
  //     root: gameContainer,
  //     rootMargin: '0px',
  //     threshold: 0.1
  //   }

  // let observer2 = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //             console.log("hello")
  //         }
  //         else{
  //             stopGame()
  //         }
  //         entry.target.addEventListener('click', () => {

  //             observer2.unobserve(entry.target)
  //         })
  //     })
  // }, options2)

  let missingInterval = setInterval(() => {
    if (visibleTiles.length > 1 && !isInViewport(visibleTiles[0])) {
      console.log(visibleTiles[0].getBoundingClientRect());
      gameoverCard.querySelector('#gameOverMessage').textContent = 'Oops, you missed a black tile!'
      stopGame();
    }
    // if (vtLength<visibleTiles.length){
    //     observer2.observe(visibleTiles[visibleTiles.length-1])
    //     vtLength = visibleTiles.length
    // }
  }, 10);

  // let options2 = {
  //     root: gameContainer,
  //     rootMargin: '0px',
  //     threshold: 0.5
  // }

  // let observer2 = new IntersectionObserver((entries) => {

  //     if (entries[0].target.classList[0] == 'active' && !(entries[0].isIntersecting)){
  //         stopGame()
  //     }
  // })

  // let missingInterval = setInterval(() => {
  //     if (isInViewport(endTile)){
  //         clearInterval(missingInterval)
  //         console.log("YOU HAVE WON")
  //     }
  //     else{

  //         if (visibleTiles.length>1 && !isInViewport(visibleTiles[0])){
  //             console.log(visibleTiles)
  //             stopGame()
  //         }
  //     }
  // }, 10)

  let restartButtons = document.querySelectorAll(".restart")
  
  restartButtons.forEach(item => item.addEventListener("click", () => {
    gameoverCard.classList.remove("openPopup");
    gameEndedCard.classList.remove("openPopup2")
    gameContainer.innerHTML = "";
    gameContainer.appendChild(gameoverCard);
    scoreCount = 0;
    document.querySelector('#score-2').textContent = 0;
    gameCreator();
  }))
  

  


// --------keyborad functionality---------------------
console.log(gameCount)

  if (gameCount >1) {
    console.log("gameCount is greater than 1")
    document.removeEventListener('keydown', keyFunctionality)
  }

  document.addEventListener('keydown', keyFunctionality)

  function keyFunctionality(event) {
    let key = event.key.toLowerCase();
    if(key == 'a' || key == 's' || key == 'd' ||key == 'f' ){
        let lastActiveTile = visibleTiles[0];
        // console.log(lastActiveTile.querySelector('.tile-letter').textContent.toLowerCase())
        let lastTileTextValue = lastActiveTile.querySelector('.tile-letter').textContent.toLowerCase()
        if(lastTileTextValue == key){
            increaseScore();
            let tile = visibleTiles[0]
  
            if(tile.isEqualNode(lastTileGlobal)){
              
                scrollInterval2 = setInterval(() => {

                        gameContainer.scrollBy(0, -accelerator);
                        accelerator += 0.001;

                    // console.log(isInViewport(endTile))
                    // console.log(accelerator)
                    }, 10);
            }
            // visibleTiles[0].remove('active');
            // visibleTiles[0].add('inactive');
            tile.classList.remove("active");
            tile.classList.add("inactive");
            visibleTiles.shift()
        } else{
            gameoverCard.querySelector('#gameOverMessage').textContent = 'Oops, you pressed the wrong key!'
            stopGame();
        }
    }
  }

}

gameCreator();

function calculateHighScore() {
  if (score > highScore) {
    // ui highscore value will change
    highScore = score;
    let highScoreDisplay = document.getElementById("high-score");
    highScoreDisplay.textContent = highScore;
    // local storage will change
    localStorage.setItem("high-score", highScore.toString());
  }
}





