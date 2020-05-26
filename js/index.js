"use strict";

const catPopup = document.getElementById('success-popup');
const helpPopup = document.getElementById('help-popup');
const catArea = document.getElementById('cat-area');
const cancelButton = document.getElementById('cancel-btn');
const restartButton = document.getElementById('restart-btn');

let catPos = {};
let maxDistance;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const headerHeight = document.getElementsByClassName('header')[0].style.height;

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

const handleClick = (e) => {
  const mousePos = {
    x: e.clientX,
    y: e.clientY,
  };
  const minX = (catPos.x - 100) >=0 ? ((catPos.x - 100)) : 0;
  const maxX = (catPos.x + 100) <= windowWidth ? (catPos.x + 100) : windowWidth;
  const minY = (catPos.y - 100) >=0 ? ((catPos.y - 100)) : 0;
  const maxY = (catPos.y + 100) <= windowHeight ? (catPos.y + 100) : windowHeight;
  if ( isBetween(mousePos.x, minX, maxX) &&
    isBetween(mousePos.y, minY, maxY)
  ) {
    successfulClick();
  } else {
    let distance = calculateDistance(mousePos, catPos);
    let volumeFactor = distance/maxDistance;
    playSound(volumeFactor);
  }
};

const successfulClick = () => {
  const catPopup = document.getElementById('success-popup');
  catPopup.style.display = 'block';
};

const playSound = (volumeFactor) => {
  var audio = new Audio('./assets/meow.wav');
  audio.volume = 1 - volumeFactor;
  audio.play();
};

const openHelpPopup = () => {
  const helpPopup = document.getElementById('help-popup');
  helpPopup.style.display = 'block';
}

const restartGame = () => {
  const xFactor = Math.random();
  const yFactor = Math.random();
  const xPos = windowWidth*xFactor;
  const yPos = headerHeight + (windowHeight-headerHeight)*yFactor;
  catPos.x = xPos;
  catPos.y = yPos;
  catPopup.style.display = 'none';
  maxDistance = findMaxDistance();
};

window.onclick = function(event) {
  if (event.target === catPopup || event.target === helpPopup) {
    event.target.style.display = 'none';
  } else if (event.target === cancelButton) {
    catPopup.style.display = 'none';
  }
};

restartGame();
catArea.addEventListener('click', handleClick);
