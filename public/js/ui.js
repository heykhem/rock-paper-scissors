"use-strict";

import * as Game from "./game.js";
import * as Auth from "./auth.js";

// === DOM ELEMENTS ===

const btnModalGuest = document.querySelector(".modal-guest-btn");
const landingModalBox = document.querySelector(".modal-landing-outer");

const defaultModalBox = document.querySelector(".default-home-modal");
const defaultModalContain = document.querySelector(".home-modal-wrapper");
const newGameBtn = document.querySelector(".new-game");
const newGameModalBox = document.querySelector(".new-game-modal");
const newGameModalContain = document.querySelector(".modal-wrapper");
const historyModalBox = document.querySelector(".history-modal");
const historyModalContain = document.querySelector(".hisotry-modal-wrapper");
const gameBackground = document.querySelector(".hand-wrapper");
const leftHandBox = document.querySelector(".left-hand-wrapper");
const opponentThinking = document.querySelector(".para");
const rightHandBox = document.querySelector(".right-hand-wrapper");
const scoreBoardBox = document.querySelector(".score-board-wrapper");
const currentRoundResult = document.querySelector(".current-round-result-show");

//  === GAME OPTIONS ===
const btnContinue = document.querySelector(".game-continue");
const btnHistory = document.querySelector(".game-history");
const btnPlayFriend = document.querySelector(".play-with-friend");
const warnProgress = document.querySelector(".show-alert-about-progress");

// === USER PROFILE ===
const setUsername = document.querySelector(".guest-user-username");

// DURING GAME PLAYING
const playRoundName = document.querySelector("#user-play-name");
const playUserProfile = document.getElementById("user-play-profile");
// === PLAYER SCORE DISPLAY ===
const player1ScoreDisplay = document.querySelector(".player2-score");
const player2ScoreDisplay = document.querySelector(".player1-score");

// ==== PLAYER CHOICE BTNS ===
const playerChoiceDiv = document.querySelector(".selection-option");

let rightHand = document.querySelector(".rimg");
let leftHand = document.querySelector(".limg");
const leftHandImages = [
  "Assets/rock.png",
  "Assets/paper.png",
  "Assets/scissors.png",
];
const rightHandImages = [
  "Assets/Rrock.png",
  "Assets/Rpaper.png",
  "Assets/Rscissors.png",
];

// Redirect to main game modal
btnModalGuest.addEventListener("click", () => {
  landingModalBox.style.display = "none";
});

// ===NEW Game Button BEGIN===
newGameBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(newGameModalBox, newGameModalContain);
});

// close modal if clicked outside of the content
newGameModalBox.addEventListener("click", () => {
  closeModal(newGameModalBox, newGameModalContain);
});

// new game modal content
newGameModalContain.addEventListener("click", (e) => {
  e.stopPropagation();
});

// new game modal close btn
const closeBtn = newGameModalContain.children[2].children[0];
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeModal(newGameModalBox, newGameModalContain);
});

//START GAME
const playGameBtn = newGameModalContain.querySelector(".msg-start");
playGameBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Get selected rounds
  const selectedRound = newGameModalContain.querySelector(
    'input[name="rounds"]:checked'
  ).value;

  //Get selected opponent
  const selectedOpponent = newGameModalContain
    .querySelector('input[name="opponent"]:checked')
    .getAttribute("data-opponent");

  // close modal
  closeModal(newGameModalBox, newGameModalContain);
  playGame({ rounds: selectedRound, opponent: selectedOpponent });
});

// ===NEW Game Button END===
let userScore = 0;
let computerScore = 0;
let currentRound = 1;
let numberOfRounds = 3; // default
let index = 0;
let cycleInterval;
let gameStartTime = 0;
let gameEndTime = 0;
let matchDuration = 0;

// === GAME START BEGIN ===
const playGame = function ({ rounds, opponent }) {
  // Reset game state
  userScore = 0;
  computerScore = 0;
  currentRound = 1;
  numberOfRounds = Number(rounds);
  gameStartTime = Date.now();

  // Reset scoreboar size
  gsap.to(currentRoundResult.closest(".score-board-wrapper"), {
    scale: 1,
    transformOrigin: "center center",
  });

  gameBackground.style.background = `url("./Assets/bg.jpg")`;
  gameBackground.style.backgroundPosition = "center center";
  gameBackground.style.backgroundSize = "cover";
  gameBackground.style.backgroundRepeat = "no-repeat";

  closeModal(defaultModalBox, defaultModalContain);
  closeModal(historyModalBox, historyModalContain);
  playerChoiceDiv.style.display = "flex";
  leftHandBox.style.display = "flex";
  rightHandBox.style.display = "flex";
  scoreBoardBox.style.display = "flex";

  // Choice Buttons are enabled
  enableChoiceButtons();
};

Array.from(playerChoiceDiv.children).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    playSound();
    playRound(Number(btn.dataset.value));
  });
});

function playRound(userChoice) {
  // Check if game is already finished
  if (currentRound > numberOfRounds) {
    showGameResult();
    return; // Don't allow more plays
  }

  let choice = ["Rock", "Paper", "Scissors"];
  disableChoiceButtons();

  // Show player 1 choice with hand animation
  rightHand.src = rightHandImages[userChoice];
  gsap.fromTo(
    rightHand,
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

  var cycleStop = cycleImages();

  setTimeout(async () => {
    clearInterval(cycleStop);

    let computerChoice = computerThink();

    opponentThinking.innerHTML = `Opponent chose a ${choice[computerChoice]}`;

    let finalResult = Game.winCheck(userChoice, computerChoice);

    if (finalResult === null) {
      currentRoundResult.innerHTML = "Draw";
    } else if (finalResult === true) {
      currentRoundResult.innerHTML = "You Win";
      userScore++;
    } else {
      currentRoundResult.innerHTML = "You Lose";
      computerScore++;
    }
    // Update score display
    player1ScoreDisplay.innerHTML = userScore;
    player2ScoreDisplay.innerHTML = computerScore;

    leftHand.src = leftHandImages[computerChoice];

    // Increment the round counter
    currentRound++;

    // Check if game is finished
    if (currentRound > numberOfRounds) {
      setTimeout(() => {
        showGameResult();
      }, 100);

      // Game Duration
      gameEndTime = Date.now();
      matchDuration = Math.floor((gameEndTime - gameStartTime) / 1000);

      // Save history
      let user = Auth.getUser(); // assuming this returns current user object
      let isMultiplayer = false;
      if (user) {
        let activeUser = await Auth.getUserProfile(user.id);
        Game.saveGameHistory({
          userId: user.id,
          opponentId: isMultiplayer ? opponent.id : null,
          userAvatar: activeUser.avatar_url,
          opponentAvatar: isMultiplayer
            ? opponent.avatar_url
            : "assets/avatar/pro-controller.png.png",
          opponentName: isMultiplayer ? opponent.username : "Computer",
          userScore,
          opponentScore: computerScore, // ✅ match JS naming
          status: userScore > computerScore ? "win" : "lose",
          matchDuration,
          rounds: numberOfRounds,
          roomId: isMultiplayer ? roomId : null,
          gameType: isMultiplayer ? "multiplayer" : "singleplayer",
        });
      }
    } else {
      // Enable buttons for next round
      setTimeout(() => {
        enableChoiceButtons();
      }, 100);
    }
  }, 400);
}

// === GAME START END ===

// === FUNCTIONS ===
// Open Modal
const openModal = (overlay, content, display = "flex") => {
  overlay.style.display = display;

  gsap.fromTo(
    content,
    {
      scale: 0.5,
      opacity: 0,
      y: 50,
      rotationX: -15,
      transformPerspective: 1000,
    },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    }
  );
};

// close Modal
const closeModal = (overlay, content) => {
  gsap.to(content, {
    scale: 0.7,
    opacity: 0,
    y: 40,
    duration: 0.1,
    ease: "power2.in",
    onComplete: () => {
      overlay.style.display = "none";

      // reset for next open
      gsap.set(content, { scale: 1, opacity: 1, y: 0 });
    },
  });
};

// Enable choice buttons
function enableChoiceButtons() {
  Array.from(playerChoiceDiv.children).forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = 1;
  });
}

// Disable choice buttons
function disableChoiceButtons() {
  Array.from(playerChoiceDiv.children).forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = 0.5; // optional visual feedback
  });
}

function computerThink() {
  var randomIndex = Math.floor(Math.random() * 3);
  leftHand.src = leftHandImages[randomIndex];
  gsap.fromTo(
    leftHand,
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

function cycleImages() {
  if (cycleInterval) clearInterval(cycleInterval);

  cycleInterval = setInterval(function () {
    gsap.fromTo(
      leftHand,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        transformOrigin: "left center",
      }
    );
    index = (index + 1) % leftHandImages.length;
    leftHand.src = leftHandImages[index];
  }, 120);
  return cycleInterval;
}

function showGameResult() {
  let finalMessage = "";

  if (userScore > computerScore) {
    finalMessage = `🎉 You Won the Game! `;
  } else if (computerScore > userScore) {
    finalMessage = `😔 You Lost the Game! `;
  } else {
    finalMessage = `🤝 It's a Tie!`;
  }

  currentRoundResult.textContent = finalMessage;
  const parentBox = currentRoundResult.closest(".score-board-wrapper");

  // Animate parent box to center & enlarge
  gsap.to(parentBox, {
    scale: 1.5,
    duration: 0.25,
    transformOrigin: "center center",
    ease: "power1.out",
  });

  // Keep buttons disabled after game ends
  disableChoiceButtons();
}

function playSound() {
  let audio = new Audio("../assets/sound/start.mp3");
  audio.play();
}

// Authentication

const authModalBox = document.querySelector(".modal-login-singup-outer");
const authModalContain = document.querySelector(".modal-login-signup-inner");

const btnLoginAuth = document.querySelector(".game-login-btn");
const btnLogoutAuth = document.querySelector(".game-logout-btn");
const tabButtons = Array.from(
  document.querySelectorAll(".login-signup-top-menu button")
);

// Get the menu wrappers
const loginMenu = document.querySelector(".login-menu-wrapper");
const signupMenu = document.querySelector(".signin-menu-wrapper");

// Get the forms
const loginForm = loginMenu.querySelector("form");
const signupForm = signupMenu.querySelector("form");

btnLoginAuth.addEventListener("click", () => {
  authModalBox.style.display = "flex";
});

authModalBox.addEventListener("click", () => {
  authModalBox.style.display = "none";
});

authModalContain.addEventListener("click", (e) => {
  e.stopPropagation();
});

tabButtons.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    // Remove 'form-active' class from all buttons
    tabButtons.forEach((button) => button.classList.remove("form-active"));

    // Add 'form-active' class to clicked button
    btn.classList.add("form-active");

    // Show/hide menus based on which button was clicked
    if (index === 0) {
      // Login button clicked
      loginMenu.style.display = "block";
      signupMenu.style.display = "none";
    } else {
      // Signup button clicked
      loginMenu.style.display = "none";
      signupMenu.style.display = "block";
    }
  });
});

// Login form submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form from refreshing page

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const user = await Auth.login(email, password);
    closeAuthModal();
    showUserUI(user);
  } catch (err) {
    alert(err.message);
  }

  // Close modal
  closeAuthModal();

  // Clear form
  loginForm.reset();
});

// Signup form submit
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form from refreshing page

  const fullName = document.getElementById("fName").value;
  const email = document.getElementById("email").value;
  const signupPassword = document.getElementById("signup-password").value;
  const { user, error } = await Auth.signup(fullName, email, signupPassword);

  if (error) {
    alert(error.message);
    return;
  }

  alert(`Welcome, ${fullName}! Your account has been created.`);
  // Redirect to game or profile page
  // window.location.href = "/";

  // Clear form
  signupForm.reset();
});

// AUTH CODE
export function showGuestUI() {
  landingModalBox.classList.remove("display-none");
  btnContinue.classList.add("display-none");
  btnHistory.classList.add("display-none");
  btnPlayFriend.classList.add("disabled");
  warnProgress.classList.remove("display-none");
  btnLoginAuth.classList.remove("display-none");
  btnLogoutAuth.classList.add("display-none");
}

const userAvatarBox = document.getElementById("user-avatar-img");
const userFullName = document.querySelector(".guest-user-display-name");
const userInfoTopBox = document.querySelector(".guest-user-top");

export async function showUserUI(user) {
  userInfoTopBox.classList.remove("display-none");
  landingModalBox.classList.add("display-none");
  btnContinue.classList.remove("display-none");
  btnHistory.classList.remove("display-none");
  btnPlayFriend.classList.remove("disabled");
  warnProgress.classList.add("display-none");
  btnLoginAuth.classList.add("display-none");
  btnLogoutAuth.classList.remove("display-none");

  let activeUser = await Auth.getUserProfile(Auth.getUser().id);

  userAvatarBox.src = activeUser.avatar_url;
  userFullName.textContent = activeUser.full_name;
  setUsername.textContent = activeUser.username;
  playRoundName.textContent = activeUser.username;
  playUserProfile.src = activeUser.avatar_url;
}

export function closeAuthModal() {
  authModalBox.style.display = "none";
}

export function openAuthModal() {
  authModalBox.style.display = "flex";
}

// LOGOUT USER
btnLogoutAuth.addEventListener("click", Auth.logout);

// ===HISTORY MODAL===
btnHistory.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("History is enabled");
  historyModalBox.style.display = "flex";
  historyModalContain.style.display = "flex";
});
