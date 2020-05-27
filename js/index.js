"use strict";

const catPopup = document.getElementById('success-popup');
const helpPopup = document.getElementById('help-popup');
const catArea = document.getElementById('cat-area');
const cancelButton = document.getElementById('cancel-btn');
const restartButton = document.getElementById('restart-btn');
const clickCount = document.getElementById('click-count');
const catPeek = document.getElementById('cat-peek');
const catSize = catPeek.height;

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

const openHelpPopup = () => {
  const helpPopup = document.getElementById('help-popup');
  helpPopup.style.display = 'block';
}

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

window.onclick = function(event) {
  if (event.target === catPopup || event.target === helpPopup) {
    event.target.style.display = 'none';
  } else if (event.target === cancelButton) {
    catPopup.style.display = 'none';
  } else if (event.target === catPeek) {
    numberOfClicks = numberOfClicks + 1;
    successfulClick();
  } else if (event.target === catArea) {
    numberOfClicks = numberOfClicks + 1;
    const mousePos = {
      x: event.clientX,
      y: event.clientY,
    };
    let distance = calculateDistance(mousePos, catPos);
    let volumeFactor = distance/maxDistance;
    playSound(volumeFactor);
  }
};

startGame();

// TODO: Difficulty level
// TODO: max number of clicks
// TODO: with this difficulty level won't come into picture or the size of cat can determine difficulty level.
