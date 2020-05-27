"use strict";

const CAT_SIZES = {
  DEFAULT: 300,
  SMALL: 200,
  LARGE: 400,
};

const MAX_CLICKS = {
  DEFAULT: 50,
  EASY: 100,
  DIFFICULT: 30,
};

const catPopup = document.getElementById('success-popup');
const helpPopup = document.getElementById('help-popup');
const catArea = document.getElementById('cat-area');
const helpButton = document.getElementById('help-btn');
const difficultySlider = document.getElementById('difficulty-slider');
const cancelButton = document.getElementById('cancel-btn');
const restartButton = document.getElementById('restart-btn');
const clickCount = document.getElementById('click-count');
const catPeek = document.getElementById('cat-peek');
const settingsButton = document.getElementById('settings-btn');
const settingsDropdown = document.getElementById('settings-dropdown');
const difficultyValue = document.getElementById('difficulty-value');
let catSize = CAT_SIZES.DEFAULT;
let maxNumberOfClicks = MAX_CLICKS.DEFAULT;

let catPos = {};
let maxDistance;
let numberOfClicks = 0;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const headerHeight = document.getElementsByClassName('header')[0].offsetHeight;

const leftTop = {
  x: 0,
  y: headerHeight,
};
const rightTop = {
  x: windowWidth,
  y: headerHeight,
};
const leftBottom = {
  x: 0,
  y: windowHeight,
};
const rightBottom = {
  x: windowWidth,
  y: windowHeight,
};

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

const successfulClick = () => {
  const catPopup = document.getElementById('success-popup');
  catPopup.style.display = 'block';
  catPeek.style.display = 'block';
  clickCount.textContent = numberOfClicks;
};

const playSound = (volumeFactor) => {
  var audio = new Audio('./assets/meow.wav');
  audio.volume = 1 - volumeFactor;
  audio.play();
};

const startGame = () => {
  numberOfClicks = 0;
  const xFactor = Math.random();
  const yFactor = Math.random();
  const xPos = (windowWidth - catSize)*xFactor;
  const yPos = (windowHeight-headerHeight-catSize)*yFactor;
  catPos.x = xPos;
  catPos.y = yPos;
  catPopup.style.display = 'none';
  maxDistance = findMaxDistance();
  catPeek.style.left = `${catPos.x}px`;
  catPeek.style.top = `${catPos.y}px`;
  catPeek.style.display = 'none';
};

const setDifficultyValue = (difficulty) => {
  switch(difficulty) {
    case "1": {
      return 'Low'
    }
    case "51": {
      return 'Medium';
    }
    case "101": {
      return 'High';
    }
    default: {
      return 'Medium';
    }
  };
}

const setCatSize = (difficulty) => {
  switch (difficulty) {
    case "1": {
      return CAT_SIZES.SMALL;
    }
    case "51": {
      return CAT_SIZES.DEFAULT;
    }
    case "101": {
      return CAT_SIZES.LARGE;
    }
    default: {
      return CAT_SIZES.DEFAULT;
    }
  };
};

const setMaxClicks = (difficulty) => {
  switch (difficulty) {
    case "1": {
      return MAX_CLICKS.EASY;
    }
    case "51": {
      return MAX_CLICKS.DEFAULT;
    }
    case "101": {
      return MAX_CLICKS.DIFFICULT;
    }
    default: {
      return MAX_CLICKS.DEFAULT;
    }
  };
}

const hasFoundCat = (mousePos) => {
  if (
    isBetween(mousePos.x, catPos.x, catPos.x + catSize) &&
    isBetween(mousePos.y, catPos.y, catPos.y + catSize)
  ) {
    return true;
  }
  return false;
}

window.onclick = function(event) {
  switch (event.target) {
    case restartButton: {
      startGame();
      break;
    }
    case cancelButton: {
      catPopup.style.display = 'none';
      catPeek.style.display = 'none';
      break;
    }
    case helpPopup: {
      helpPopup.style.display = 'none';
      break;
    }
    case catPopup: {
      catPopup.style.display = 'none';
      break;
    }
    case helpButton: {
      helpPopup.style.display = 'block';
      settingsDropdown.style.display = 'none';
      break;
    }
    case difficultySlider: {
      let difficulty = event.target.value;
      difficultyValue.textContent = setDifficultyValue(difficulty);
      catSize = setCatSize(difficulty);
      maxNumberOfClicks = setMaxClicks(difficulty);
      startGame();
      break;
    }
    case settingsButton: {
      if (settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
      } else {
        settingsDropdown.style.display = 'block';
      }
      break;
    }
    case catArea: {
      numberOfClicks = numberOfClicks + 1;
      const mousePos = {
        x: event.clientX,
        y: event.clientY,
      };
      if (hasFoundCat(mousePos)) {
        successfulClick();
      }
      else if (numberOfClicks > maxNumberOfClicks) {
        alert("You lost :(");
        catPeek.style.display = 'block';
        setTimeout(startGame(), 10000);
      }
      else {
        let distance = calculateDistance(mousePos, catPos);
        let volumeFactor = (distance**2)/(maxDistance**2);
        playSound(volumeFactor);
      }
      break;
    }
  };
};

startGame();

// TODO: The size of cat  and max no of clicks can determine difficulty level.
