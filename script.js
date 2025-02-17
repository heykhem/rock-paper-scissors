// Images path
let images = [
    "Assets/rock.png",
    "Assets/paper.png",
    "Assets/scissors.png",
];

// Game start 
// function gStart() {
//     document.querySelector(".start-menu").style.display = "none";
// }


let rhand = document.getElementsByClassName("rimg")[0];

function run(a) {
    let choice = ["Rock", "Paper", "Scissors"];
    var player1 = a;
    var player2 = p2Think();
    var finalRes = winCheck(player1, player2);
    if (0 === 0) {
        rhand.src = images[a];
    }
    document.getElementById(
        "result"
    ).innerHTML = `${finalRes}`;
    document.getElementById(
        "p2choice"
    ).innerHTML = `${choice[player2]}`;
}

function p2Think() {
    let a = Math.floor(Math.random() * 3)
    lhand.src = images[a];
    console.log(lhand);
    lhand.classList.add("move");
    return a;
}

function winCheck(x, y) {
    return x === y
        ? "It's Draw"
        : x === (y + 1) % 3
            ? "You Win"
            : "You Lose";
}

let index = 0;
let lhand = document.querySelector(".limg");
console.log('hello');

// function cycleImages() {
//     cycleInterval = setInterval(function () {
//         index = (index + 1) % images.length;
//         lhand.src = images[index];
//     }, 150);
// }

// function cycleStop() {
//     clearInterval(cycleInterval)
// }

// Sound to make choice
function playSound() {
    let audio = new Audio("Assets/Sounds/result.mp3");
    audio.play();
}

// Sound to start game
function loadSound() {
    let audio = new Audio("Assets/Sounds/start.mp3");
    audio.play();
}


