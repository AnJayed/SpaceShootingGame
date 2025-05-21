"use strict";

let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let suonoSparoPlayer = new Audio("sparo.wav");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let testoPunteggio = document.createElement("div");
testoPunteggio.textContent = "Punteggio : 0";
document.body.appendChild(testoPunteggio);
testoPunteggio.style.position = "absolute";
testoPunteggio.style.top = "20px";
testoPunteggio.style.left = "20px";
testoPunteggio.style.fontSize = "24px";
testoPunteggio.style.transition = "all 1s ease";
testoPunteggio.style.zIndex = "10";

let punteggio = 0;

let velocitaAumentata = false;
let velocitaMostri = 2;

let giocoFinito = false;

function aggiornaPunteggio() {
  testoPunteggio.textContent = "Punteggio : " + punteggio;
}

function creaNavicella() {
  let navicella = {
    vita: 100,
    velocita: { x: 0, y: 0 },
    immagine: new Image(),
    dimensioneNavicella: 0.35,
    width: 100,
    height: 100,
    posizione: {
      x: canvas.width / 2 + 50,
      y: canvas.height + 150,
    },

    genera: function() {
      c.drawImage(
        this.immagine,
        this.posizione.x,
        this.posizione.y,
        this.width,
        this.height
      );
    },

    aggiorna: function() {
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
    navicella.height =
      navicella.immagine.height * navicella.dimensioneNavicella;
    navicella.posizione.x = canvas.width / 2 - navicella.width / 2;
    navicella.posizione.y = canvas.height - navicella.height - 50;
  };

  return navicella;
}

function creaProiettile(parametri) {
  return {
    posizione: {
      x: parametri.posizione.x,
      y: parametri.posizione.y
    },
    velocita: parametri.velocita,
    radius: 5,
    draw: function() {
      c.beginPath();
      c.arc(this.posizione.x, this.posizione.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    },
    update: function() {
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
    posizione: { x: x, y: y },
    width: 100,
    height: 100,
    velocita: velocitaMostri,
    immagine: immagine,
    draw: function() {
      c.drawImage(
        this.immagine,
        this.posizione.x,
        this.posizione.y,
        this.width,
        this.height
      );
    },
    update: function() {
      this.posizione.y += this.velocita;
      this.draw();
    },
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

let animazioneId;

function animazione() {
  animazioneId = requestAnimationFrame(animazione);
  c.clearRect(0, 0, canvas.width, canvas.height);

  player.aggiorna();
  player.genera();

  listaProiettili.forEach(function(proiettile, i) {
    proiettile.update();

    mostri.forEach(function(mostro, j) {
      if (rettangoliCollidono(proiettile, mostro)) {
        listaProiettili.splice(i, 1);
        mostri.splice(j, 1);
        punteggio += 10;
        aggiornaPunteggio();
        aumentaVelocita();
      }
    });
  });

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

function aumentaVelocita() {
  if (punteggio >= 50 && !velocitaAumentata) {
    velocitaMostri = 2.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
    velocitaAumentata = true;
  }
  if (punteggio >= 100) {
    velocitaMostri = 3;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 150) {
    velocitaMostri = 3.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 200) {
    velocitaMostri = 4;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 250) {
    velocitaMostri = 4.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 300) {
    velocitaMostri = 5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 350) {
    velocitaMostri = 5.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 400) {
    velocitaMostri = 6;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 450) {
    velocitaMostri = 6.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 500) {
    velocitaMostri = 7;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
  if (punteggio >= 550) {
    velocitaMostri = 7.5;
    mostri.forEach(function(mostro) {
      mostro.velocita = velocitaMostri;
    });
  }
}

addEventListener("keydown", function(event) {
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

addEventListener("keyup", function(event) {
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

setInterval(function() {
  let x = Math.random() * (canvas.width - 100);
  mostri.push(creaMostro(x, -100));
}, 2000);

function mostraGameOver() {
  testoPunteggio.textContent = "Il tuo punteggio è: " + punteggio;
  testoPunteggio.style.top = "50%";
  testoPunteggio.style.left = "50%";
  testoPunteggio.style.transform = "translate(-50%, -50%)";
  testoPunteggio.style.fontSize = "48px";
  testoPunteggio.style.color = "white";
}

animazione();