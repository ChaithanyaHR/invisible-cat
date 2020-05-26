"use strict";

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

let catArea = document.getElementById('cat-area');
catArea.addEventListener('click', handleClick);

window.onclick = function(event) {
  const catPopup = document.getElementsByClassName('popup')[0];
  if (event.target == catPopup) {
    catPopup.style.display = 'none';
  }
}

const successfulClick = () => {
  const catPopup = document.getElementsByClassName('popup')[0];
  catPopup.style.display = 'block';
};

const playSound = (volumeFactor) => {
  var audio = new Audio('./assets/meow.wav');
  audio.volume = 1 - volumeFactor;
  audio.play();
};
