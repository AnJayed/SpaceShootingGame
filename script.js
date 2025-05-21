"use strict";

// Ottieni il riferimento al canvas e al suo contesto 2D
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

// Suono dello sparo
let suonoSparoPlayer = new Audio("sparo.wav");

// Imposta le dimensioni del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let testoPunteggio = document.createElement("div");
testoPunteggio.textContent = "Punteggio : 0";
document.body.appendChild(testoPunteggio);
testoPunteggio.style.color = "white";
testoPunteggio.style.position = "absolute"; // Posiziona il div sopra il canvas
testoPunteggio.style.top = "20px"; // Distanza dal top
testoPunteggio.style.left = "20px"; // Distanza dalla sinistra
testoPunteggio.style.fontSize = "24px"; // Font più grande per visibilità

let punteggio = 0;

function aggiornaPunteggio() {
  testoPunteggio.textContent = "Punteggio : " + punteggio;
}

function creaNavicella() {
  let navicella = {
    vita: 100,
    velocita: { x: 0, y: 0 },
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
    posizione: {...posizione },
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
      this.posizione.x += this.velocita.x;
      this.posizione.y += this.velocita.y;
      this.draw();
    },
  };
}

function creaMostro(x, y) {
  let immagine = new Image();
  immagine.src = "spaceinvader.png";

  return {
    posizione: { x, y },
    width: 100,
    height: 100,
    velocita: 2,
    immagine: immagine,
    draw() {
      c.drawImage(this.immagine, this.posizione.x, this.posizione.y, this.width, this.height);
    },
    update() {
      this.posizione.y += this.velocita;
      this.draw();
    }
  };
}

function rettangoliCollidono(proiettile, mostro) {
  return (
    proiettile.posizione.x > mostro.posizione.x &&
    proiettile.posizione.x < mostro.posizione.x + mostro.width &&
    proiettile.posizione.y > mostro.posizione.y &&
    proiettile.posizione.y < mostro.posizione.y + mostro.height
  );
}

let player = creaNavicella();
let listaProiettili = [];
let mostri = [];

let tasti = {
  tastoSinistro: false,
  tastoDestro: false,
};

function animazione() {
  requestAnimationFrame(animazione);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  player.aggiorna();
  player.genera();

  // Proiettili
  listaProiettili.forEach((proiettile, i) => {
    proiettile.update();

    // Collisione con mostri
    mostri.forEach((mostro, j) => {
      if (rettangoliCollidono(proiettile, mostro)) {
        listaProiettili.splice(i, 1);
        mostri.splice(j, 1);
        punteggio += 10;
        aggiornaPunteggio();
      
      }
    });
  });
  // Mostri
  mostri.forEach((mostro) => {
    mostro.update();
  });
}
function aumentaVelocita(){
  if(punteggio==50){
    //TO DO
  };
}

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
          velocita: { x: 0, y: -7 },
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

setInterval(() => {
  let x = Math.random() * (canvas.width - 100);
  mostri.push(creaMostro(x, -100));
}, 2000);

animazione();