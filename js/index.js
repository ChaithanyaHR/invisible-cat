"use strict";

// Constants
const LEVELS = {
  EASY: {
    catSize: 400,
    maxClicks: 100,
  },
  MEDIUM: {
    catSize: 300,
    maxClicks: 50,
  },
  DIFFICULT: {
    catSize: 200,
    maxClicks: 30,
  },
}

const DIFF_VALUE_TO_LEVEL = {
  '1': LEVELS.EASY,
  '51': LEVELS.MEDIUM,
  '101': LEVELS.DIFFICULT,
};

// Elements
// Header elements
const startButton = document.getElementById('start-button');
const difficultySlider = document.getElementById('difficulty-slider');
const clicksDiv = document.getElementById('clicks-div');
const currClickCount = document.getElementById('curr-click-count');
const totalClickCount = document.getElementById('total-click-count');
const helpButton = document.getElementById('help-btn');
const helpPopup = document.getElementById('help-popup');
// Cat Area elements
const catArea = document.getElementById('cat-area');
const catPeek = document.getElementById('cat-peek');
// Game Over Popup
const gameOverPopup = document.getElementById('game-over-popup');
const successMessage = document.getElementById('success-message');
const clickCount = document.getElementById('click-count');
const failureMessage = document.getElementById('failure-message');
const restartButton = document.getElementById('restart-btn');
const cancelButton = document.getElementById('cancel-btn');

// Game state variables
let catSize, maxClicks, catPos, maxDistance, difficultyLevel = LEVELS.MEDIUM, numberOfClicks = 0, isGameInProgress = false;

// Window variables
let windowWidth, windowHeight, headerHeight, leftTop, rightTop, leftBottom, rightBottom;

// Utility functions

const isBetween = ( num, min, max ) => {
  return (num >= min && num <= max);
};

const calculateDistance = (pt1, pt2) => {
  let sumOfSq = (pt1.x - pt2.x)**2 + (pt1.y - pt2.y)**2;
  return Math.sqrt(sumOfSq);
}

const findMaxDistance = () => {
  const leftTopDistance = calculateDistance(leftTop, catPos);
  const rightTopDistance = calculateDistance(rightTop, catPos);
  const leftBottomDistance = calculateDistance(leftBottom, catPos);
  const rightBottomDistance = calculateDistance(rightBottom, catPos);
  return Math.max(leftTopDistance, rightTopDistance, leftBottomDistance, rightBottomDistance);
}

// Game functions

const setWindowProperties = () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
  leftTop = {
    x: 0,
    y: headerHeight,
  };
  rightTop = {
    x: windowWidth,
    y: headerHeight,
  };
  leftBottom = {
    x: 0,
    y: windowHeight,
  };
  rightBottom = {
    x: windowWidth,
    y: windowHeight,
  };
}


const startGame = () => {
  setWindowProperties();
  isGameInProgress = true;
  clicksDiv.style.display = 'inline-block';
  // Close all pop-ups
  gameOverPopup.style.display = 'none';
  helpPopup.style.display = 'none';
  // Set Game Parameters
  catSize = difficultyLevel.catSize;
  maxClicks = difficultyLevel.maxClicks;
  // Set random cat position
  const xFactor = Math.random();
  const yFactor = Math.random();
  const xPos = (windowWidth - catSize)*xFactor;
  const yPos = (windowHeight-headerHeight-catSize)*yFactor;
  catPos = {
    x: xPos,
    y: yPos,
  };
  catPeek.style.left = `${catPos.x}px`;
  catPeek.style.top = `${catPos.y}px`;
  catPeek.style.display = 'none'; // Hide the cat
  maxDistance = findMaxDistance(); // Find the new maxDistance
  numberOfClicks = 0;
  totalClickCount.textContent = maxClicks;
  currClickCount.textContent = 0;
};

const hasFoundCat = (mousePos) => {
  if (
    isBetween(mousePos.x, catPos.x, catPos.x + catSize) &&
    isBetween(mousePos.y, catPos.y, catPos.y + catSize)
  ) {
    return true;
  }
  return false;
}

const playSound = (volumeFactor) => {
  var audio = new Audio('./assets/meow.wav');
  audio.volume = 1 - volumeFactor;
  audio.play();
};

const successfulClick = () => {
  // Display the hidden cat
  catPeek.style.display = 'block';
  // Set clickCount and display success popup
  clickCount.textContent = numberOfClicks;
  gameOverPopup.style.display = 'block';
  successMessage.style.display = 'block';
  failureMessage.style.display = 'none';
};

const cancelGame = () => {
  // Close all popups
  gameOverPopup.style.display = 'none';
  catPeek.style.display = 'none'; // Hide the cat
  isGameInProgress = false;
  clicksDiv.style.display = 'none';
  // Reset click counts
  totalClickCount.textContent = 0;
  currClickCount.textContent = 0;
}

// Handle onClick events

window.onclick = function(event) {
  switch (event.target) {
    case startButton:
    case restartButton: {
      startGame();
      break;
    }
    case cancelButton: {
      cancelGame();
      break;
    }
    case helpPopup: {
      helpPopup.style.display = 'none';
      break;
    }
    case gameOverPopup: {
      gameOverPopup.style.display = 'none';
      cancelGame();
      break;
    }
    case helpButton: {
      helpPopup.style.display = 'block';
      break;
    }
    case difficultySlider: {
      difficultyLevel = DIFF_VALUE_TO_LEVEL[event.target.value];
      if (isGameInProgress) {
        startGame();
      }
      break;
    }
    case catArea: {
      if (isGameInProgress) {
        // Change no of clicks
        numberOfClicks = numberOfClicks + 1;
        currClickCount.textContent = numberOfClicks;
        // Check if user clicked on cat
        const mousePos = {
          x: event.clientX,
          y: event.clientY,
        };
        if (hasFoundCat(mousePos)) {
          successfulClick();
        }
        else if (numberOfClicks > maxClicks) {
          gameOverPopup.style.display = 'block';
          failureMessage.style.display = 'block';
          successMessage.style.display = 'none';
          catPeek.style.display = 'block';
        }
        else {
          let distance = calculateDistance(mousePos, catPos);
          let volumeFactor = (distance)/(maxDistance);
          playSound(volumeFactor);
        }
      }
      break;
    }
  };
};

window.onresize = (event) => {
  startGame();
}
