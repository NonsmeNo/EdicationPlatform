const slogans = [
    "Добро пожаловать в MathHelper!",
    "Ваш цифровой ассистент в мире математики!",
    "Отличный помощник для учителя!"
];

const images = [
    "static/img/main/preview1.png",
    "static/img/main/preview2.png",
    "static/img/main/preview3.png"
];

let currentIndex = 0;

setInterval(() => {
    currentIndex = (currentIndex + 1) % slogans.length;
    document.getElementById("slogan").textContent = slogans[currentIndex];
    document.getElementById("sloganImage").src = images[currentIndex];
}, 10000);