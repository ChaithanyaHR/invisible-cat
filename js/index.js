"use strict";

const catPopup = document.getElementById('success-popup');
const helpPopup = document.getElementById('help-popup');
const catArea = document.getElementById('cat-area');
const cancelButton = document.getElementById('cancel-btn');
const restartButton = document.getElementById('restart-btn');

let catPos = {
  x: 150,
  y: 150,
};

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

const maxDistance = findMaxDistance();

const handleClick = (e) => {
  const mousePos = {
    x: e.clientX,
    y: e.clientY,
  };
  if ( isBetween(mousePos.x, catPos.x - 50, catPos.x + 50) &&
    isBetween(mousePos.y, catPos.y - 50, catPos.y + 50)
  ) {
    successfulClick();
  } else {
    let distance = calculateDistance(mousePos, catPos);
    let volumeFactor = distance/maxDistance;
    playSound(volumeFactor);
  }
};

window.onclick = function(event) {
  if (event.target === catPopup || event.target === helpPopup) {
    event.target.style.display = 'none';
  } else if (event.target === cancelButton) {
    catPopup.style.display = 'none';
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
  debugger;
  const xFactor = Math.random();
  const yFactor = Math.random();
  const xPos = windowWidth*xFactor;
  const yPos = headerHeight + (windowHeight-headerHeight)*yFactor;
  catPos.x = xPos;
  catPos.y = yPos;
  catPopup.style.display = 'none';
};

catArea.addEventListener('click', handleClick);
