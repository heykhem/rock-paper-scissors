let rhand = document.querySelector(".rimg");
let lhand = document.querySelector(".limg");
let resultText = document.querySelector("#result");
let para = document.querySelector(".para");
let p2choiceText = document.querySelector("#p2choice");
const limages = ["Assets/rock.png", "Assets/paper.png", "Assets/scissors.png"];
const rimages = [
  "Assets/Rrock.png",
  "Assets/Rpaper.png",
  "Assets/Rscissors.png",
];
let p1Sboard = document.querySelector(".user-score");
let p2Sboard = document.querySelector(".computer-score");
let p1Score = 0;
let p2Score = 0;
let pressbutton = document.querySelectorAll(".btn"); // FIXED: Declare pressbutton

let index = 0;
let cycleInterval;

pressbutton.forEach((element) => {
  element.addEventListener("click", (event) => {
    if (event.currentTarget.disabled) return; // Prevent clicks when disabled

    playSound(); // Play sound only if button is enabled

    let btnIndex = Array.from(pressbutton).indexOf(event.currentTarget);
    playRound(btnIndex);
  });
});

function playRound(player1) {
  let choice = ["Rock", "Paper", "Scissors"];
  para.innerHTML = "Opponent is choosing...";
  p2choiceText.innerHTML = ""; // FIXED: Use innerHTML instead of .text

  // Disable all buttons to prevent multiple clicks
  pressbutton.forEach((btn) => (btn.disabled = true));

  var cstop = cycleImages();

  setTimeout(() => {
    rhand.src = rimages[player1]; // Show player choice
    clearInterval(cstop);

    let player2 = pThink();
    let determine = roundGameCheck(player1, player2);

    para.innerHTML = `Opponent is choosing a ${choice[player2]}`;

    let finalRes = winCheck(player1, player2);

    if (finalRes === null) {
      resultText.innerHTML = `Draw`;
    } else if (finalRes === true) {
      p1Score++;
      resultText.innerHTML = `You Win`;
    } else {
      p2Score++;
      resultText.innerHTML = `You Lose`;
    }

    // Update score display
    p1Sboard.innerHTML = p1Score;
    p2Sboard.innerHTML = p2Score;

    p2choiceText.innerHTML = `${choice[player2]}`;
    gsap.fromTo(
      rhand,
      {
        opacity: 0,
      },
      {
        duration: 0.5,
        opacity: 1,
        ease: "power1.inOut",
        transformOrigin: "right center",
      }
    );
    lhand.src = limages[player2];

    // Enable buttons after round finishes
    setTimeout(() => {
      pressbutton.forEach((btn) => {
        btn.disabled = false;
        btn.style.opacity = "1";
      });
    }, 1000);
  }, 2000);
}

function pThink() {
  var randomIndex = Math.floor(Math.random() * 3);
  lhand.src = limages[randomIndex];
  gsap.fromTo(
    lhand,
    { opacity: 0.9 },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
      transformOrigin: "left center",
    }
  );
  return randomIndex;
}

function winCheck(x, y) {
  return x === y ? null : x === (y + 1) % 3 ? true : false;
}

function roundGameCheck(player_1, player_2) {
  if (player_1 === player_2) return null;
  if (player_1 === 3 && player_2 !== 3) return true;
  else return false;
}

function cycleImages() {
  if (cycleInterval) clearInterval(cycleInterval);
  cycleInterval = setInterval(function () {
    gsap.fromTo(
      lhand,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        transformOrigin: "left center",
      }
    );
    index = (index + 1) % limages.length;
    lhand.src = limages[index];
  }, 120);
  return cycleInterval;
}

function playSound() {
  let audio = new Audio("Assets/Sounds/start.mp3");
  audio.play();
}
