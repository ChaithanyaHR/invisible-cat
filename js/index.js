"use strict";

let cowPos = {
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
  const leftTopDistance = calculateDistance(leftTop, cowPos);
  const rightTopDistance = calculateDistance(rightTop, cowPos);
  const leftBottomDistance = calculateDistance(leftBottom, cowPos);
  const rightBottomDistance = calculateDistance(rightBottom, cowPos);
  return Math.max(leftTopDistance, rightTopDistance, leftBottomDistance, rightBottomDistance);
}

const maxDistance = findMaxDistance();

const handleClick = (e) => {
  const mousePos = {
    x: e.clientX,
    y: e.clientY,
  };
  if ( isBetween(mousePos.x, cowPos.x - 50, cowPos.x + 50) &&
    isBetween(mousePos.y, cowPos.y - 50, cowPos.y + 50)
  ) {
    successfulClick();
  } else {
    let distance = calculateDistance(mousePos, cowPos);
    let volumeFactor = distance/maxDistance;
    playSound(volumeFactor);
  }
};

const successfulClick = () => {
  const cowDiv = document.createElement('div');
  const catImg = document.createElement('img');
  catImg.src = './assets/cat.png';
  cowDiv.appendChild(catImg);
  cowArea.appendChild(cowDiv);
  alert('You won!!!');
};

const playSound = (volumeFactor) => {
  var audio = new Audio('./assets/meow.wav');
  audio.volume = 1 - volumeFactor;
  audio.play();
};

let cowArea = document.getElementById('cow-area');
cowArea.addEventListener('click', handleClick);
