"use strict";

// Seleziona il canvas HTML e ottiene il contesto 2D per disegnare
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

// Carica il suono dello sparo
let suonoSparoPlayer = new Audio("sparo.wav");

// Imposta la larghezza e altezza del canvas in base alla finestra
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Crea e configura l'elemento DOM per mostrare il punteggio
let testoPunteggio = document.createElement("div");
testoPunteggio.textContent = "Punteggio : 0";
document.body.appendChild(testoPunteggio);
testoPunteggio.style.position = "absolute";
testoPunteggio.style.top = "20px";
testoPunteggio.style.left = "20px";
testoPunteggio.style.fontSize = "24px";
testoPunteggio.style.transition = "all 1s ease";

// Variabili iniziali di gioco
let punteggio = 0;
let velocitaAumentata = false;
let velocitaMostri = 2;
let giocoFinito = false;

// Aggiorna il testo del punteggio
function aggiornaPunteggio() {
  testoPunteggio.textContent = "Punteggio : " + punteggio;
}

// Crea l'oggetto navicella del giocatore
function creaNavicella() {
  let navicella = {
    velocita: { x: 0, y: 0 },
    immagine: new Image(),
    dimensioneNavicella: 0.35,
    width: 100,
    height: 100,
    posizione: {
      x: canvas.width / 2 + 50,
      y: 150,
    },

    // Disegna l'immagine della navicella
    genera: function () {
      c.drawImage(
        this.immagine,
        this.posizione.x,
        this.posizione.y,
        this.width,
        this.height
      );
    },

    // Aggiorna la posizione della navicella e impedisce che esca dai bordi
    aggiorna: function () {
      this.posizione.x += this.velocita.x;

      if (this.posizione.x < 0) this.posizione.x = 0;
      if (this.posizione.x + this.width > canvas.width)
        this.posizione.x = canvas.width - this.width;
      if (this.posizione.y < 0) this.posizione.y = 0;
      if (this.posizione.y + this.height > canvas.height)
        this.posizione.y = canvas.height - this.height;
    },
  };

  // Imposta l'immagine della navicella e calcola le dimensioni
  navicella.immagine.src = "navicella.png";
  navicella.immagine.onload = function () {
    navicella.width = navicella.immagine.width * navicella.dimensioneNavicella;
    navicella.height = navicella.immagine.height * navicella.dimensioneNavicella;
    navicella.posizione.x = canvas.width / 2 - navicella.width / 2;
    navicella.posizione.y = canvas.height - navicella.height - 50;
  };

  return navicella;
}

// Crea un nuovo proiettile sparato dal giocatore
function creaProiettile(parametri) {
  return {
    posizione: {
      x: parametri.posizione.x,
      y: parametri.posizione.y,
    },
    velocita: parametri.velocita,
    radius: 5,

    // Disegna il proiettile
    draw: function () {
      c.beginPath();
      c.arc(this.posizione.x, this.posizione.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    },

    // Aggiorna la posizione del proiettile
    update: function () {
      this.posizione.x += this.velocita.x;
      this.posizione.y += this.velocita.y;
      this.draw();
    },
  };
}

// Crea un nuovo mostro con posizione iniziale
function creaMostro(x, y) {
  let immagine = new Image();
  immagine.src = "spaceinvader.png";

  return {
    posizione: { x: x, y: y },
    width: 100,
    height: 100,
    velocita: velocitaMostri,
    immagine: immagine,

    // Disegna il mostro
    draw: function () {
      c.drawImage(
        this.immagine,
        this.posizione.x,
        this.posizione.y,
        this.width,
        this.height
      );
    },

    // Aggiorna la posizione del mostro verso il basso
    update: function () {
      this.posizione.y += this.velocita;
      this.draw();
    },
  };
}

// Verifica se un proiettile ha colpito un mostro
function rettangoliCollidono(proiettile, mostro) {
  return (
    proiettile.posizione.x > mostro.posizione.x &&
    proiettile.posizione.x < mostro.posizione.x + mostro.width &&
    proiettile.posizione.y > mostro.posizione.y &&
    proiettile.posizione.y < mostro.posizione.y + mostro.height
  );
}

// Inizializza oggetti e variabili di gioco
let player = creaNavicella();
let listaProiettili = [];
let mostri = [];

let tasti = {
  tastoSinistro: false,
  tastoDestro: false,
};

let animazioneId;

// Funzione principale del loop di animazione del gioco
function animazione() {
  animazioneId = requestAnimationFrame(animazione);
  c.clearRect(0, 0, canvas.width, canvas.height);

  player.aggiorna();
  player.genera();

  // Aggiorna e disegna ogni proiettile, controlla collisioni con i mostri
  listaProiettili.forEach(function (proiettile, i) {
    proiettile.update();

    mostri.forEach(function (mostro, j) {
      if (rettangoliCollidono(proiettile, mostro)) {
        listaProiettili.splice(i, 1);
        mostri.splice(j, 1);
        punteggio += 10;
        aggiornaPunteggio();
        aumentaVelocita();
      }
    });
  });

  // Aggiorna ogni mostro e controlla se uno di essi ha raggiunto il fondo
  for (let i = 0; i < mostri.length; i++) {
    let mostro = mostri[i];
    mostro.update();

    if (mostro.posizione.y > canvas.height) {
      giocoFinito = true;
      mostraGameOver();
      cancelAnimationFrame(animazioneId);
      break;
    }
  }
}

// Aumenta la velocità dei mostri in base al punteggio raggiunto
function aumentaVelocita() {
  if (punteggio >= 50 && !velocitaAumentata) {
    velocitaMostri = 2.5;
    mostri.forEach(function (mostro) {
      mostro.velocita = velocitaMostri;
    });
    velocitaAumentata = true;
  }
  
  // Continua ad aumentare progressivamente la velocità fino a 10
  if (punteggio >= 100) velocitaMostri = 3;
  if (punteggio >= 150) velocitaMostri = 3.5;
  if (punteggio >= 200) velocitaMostri = 4;
  if (punteggio >= 250) velocitaMostri = 4.5;
  if (punteggio >= 300) velocitaMostri = 5;
  if (punteggio >= 350) velocitaMostri = 5.5;
  if (punteggio >= 400) velocitaMostri = 6;
  if (punteggio >= 450) velocitaMostri = 6.5;
  if (punteggio >= 500) velocitaMostri = 7;
  if (punteggio >= 550) velocitaMostri = 7.5;
  if (punteggio >= 600) velocitaMostri = 8;
  if (punteggio >= 650) velocitaMostri = 8.5;
  if (punteggio >= 700) velocitaMostri = 9;
  if (punteggio >= 750) velocitaMostri = 9.5;
  if (punteggio >= 800) velocitaMostri = 10;

  mostri.forEach(function (mostro) {
    mostro.velocita = velocitaMostri;
  });
}

// Gestione degli input da tastiera per movimento e sparo
addEventListener("keydown", function (event) {
  let key = event.key;
  switch (key) {
    case "ArrowLeft":
      tasti.tastoSinistro = true;
      player.velocita.x = -10;
      break;
    case "ArrowRight":
      tasti.tastoDestro = true;
      player.velocita.x = 10;
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

// Ferma il movimento della navicella quando i tasti vengono rilasciati
addEventListener("keyup", function (event) {
  let key = event.key;
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

// Crea un nuovo mostro ogni 2 secondi con posizione casuale
setInterval(function () {
  let x = Math.random() * (canvas.width - 100);
  mostri.push(creaMostro(x, -100));
}, 2000);

// Mostra schermata di fine gioco con il punteggio finale
function mostraGameOver() {
  testoPunteggio.textContent = "Il tuo punteggio è: " + punteggio;
  testoPunteggio.style.top = "50%";
  testoPunteggio.style.left = "50%";
  testoPunteggio.style.transform = "translate(-50%, -50%)";
  testoPunteggio.style.fontSize = "48px";
  testoPunteggio.style.color = "white";
}

// Avvia l'animazione principale del gioco
animazione();
