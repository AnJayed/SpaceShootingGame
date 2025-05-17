"use strict";

// Ottieni il riferimento al canvas e al suo contesto 2D
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let suonoSparoPlayer = new Audio("sparo.wav");



// Imposta le dimensioni del canvas pari a quelle della finestra
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function creaNavicella() {
  let navicella = {
    vita : 100,
    velocita: {
      x: 0,
      y: 0,
    },
    immagine: new Image(),
    dimensioneNavicella: 0.55,
    width: 100,
    height: 100,
    posizione: {
      x: canvas.width / 2 - 50,
      y: canvas.height - 150,
    },
    
    genera() {
      c.drawImage(
        this.immagine,
        this.posizione.x,
        this.posizione.y,
        this.width,
        this.height
      );
    },
    aggiorna() {
      this.posizione.x += this.velocita.x;
      this.posizione.y += this.velocita.y;

      if (this.posizione.x < 0) this.posizione.x = 0;
      if (this.posizione.x + this.width > canvas.width)
        this.posizione.x = canvas.width - this.width;
      if (this.posizione.y < 0) this.posizione.y = 0;
      if (this.posizione.y + this.height > canvas.height)
        this.posizione.y = canvas.height - this.height;
    },
  };

  navicella.immagine.src = "navicella.png";
  navicella.immagine.onload = function () {
    navicella.width = navicella.immagine.width * navicella.dimensioneNavicella;
    navicella.height = navicella.immagine.height * navicella.dimensioneNavicella;
    navicella.posizione.x = canvas.width / 2 - navicella.width / 2;
    navicella.posizione.y = canvas.height - navicella.height - 50;
  };

  return navicella;
}



function creaProiettile({ posizione, velocita }) {
  return {
    posizione,
    velocita,
    radius: 5,
    draw() {
      c.beginPath();
      c.arc(this.posizione.x, this.posizione.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    },
    update() {
      this.draw();
      this.posizione.x += this.velocita.x;
      this.posizione.y += this.velocita.y;
    },
  };
}



let player = creaNavicella();
let listaProiettili = [];

function animazione() {
  requestAnimationFrame(animazione);
  c.clearRect(0, 0, canvas.width, canvas.height);

  player.aggiorna();
  player.genera();

  listaProiettili.forEach((proiettile) => {
    proiettile.update();
  });
}


let tasti = {
  tastoSinistro: false,
  tastoDestro: false,
};

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      tasti.tastoSinistro = true;
      player.velocita.x = -5;
      break;
    case "ArrowRight":
      tasti.tastoDestro = true;
      player.velocita.x = 5;
      break;
    case " ":
      listaProiettili.push(
        creaProiettile({
          posizione: {
            x: player.posizione.x + player.width / 2,
            y: player.posizione.y,
          },
          velocita: {
            x: 0,
            y: -7,
          },
        })
      );
      suonoSparoPlayer.currentTime = 0;
      suonoSparoPlayer.play();
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      tasti.tastoSinistro = false;
      if (!tasti.tastoDestro) player.velocita.x = 0;
      break;
    case "ArrowRight":
      tasti.tastoDestro = false;
      if (!tasti.tastoSinistro) player.velocita.x = 0;
      break;
  }
});


function creaMostro() {
  let mostro = document.createElement("img");
  mostro.src = "spaceinvader.png";
  mostro.className = "mostro";
  mostro.style.position = "absolute";
  mostro.style.width = "100px";
  mostro.style.height = "100px";
  mostro.style.left = Math.random() * (window.innerWidth - 100) + "px";
  mostro.style.top = "-100px";
  

  document.body.appendChild(mostro);
}

function aggiornaMostri() {
  let mostri = document.querySelectorAll(".mostro");
  mostri.forEach((mostro) => {
    let y = parseInt(mostro.style.top);
    y += 9;
    mostro.style.top = y + "px";
  });
}

setInterval(() => {
  creaMostro();
}, 2000);

setInterval(() => {
  aggiornaMostri();
}, 300);



animazione();
