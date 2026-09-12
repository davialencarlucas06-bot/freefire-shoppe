// =====================================================
// MINI BATTLE
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let largura;
let altura;

function ajustarTela() {

  largura = window.innerWidth;
  altura = window.innerHeight;

  canvas.width = largura;
  canvas.height = altura;
}

window.addEventListener("resize", ajustarTela);

ajustarTela();


// =====================================================
// ESTADO DO JOGO
// =====================================================

let jogoIniciado = false;

let gameOver = false;


// =====================================================
// JOGADOR
// =====================================================

const jogador = {

  x: 0,
  y: 0,

  vida: 100,

  velocidade: 4,

  angulo: 0,

  ultimoTiro: 0

};


// =====================================================
// CÂMERA
// =====================================================

const camera = {

  x: 0,
  y: 0

};


// =====================================================
// ARMAS
// =====================================================

const armas = [

  {
    nome: "Pistola",
    dano: 18,
    cadencia: 350,
    carregador: 12,
    reserva: 60
  },

  {
    nome: "SMG",
    dano: 10,
    cadencia: 120,
    carregador: 30,
    reserva: 120
  },

  {
    nome: "Rifle",
    dano: 24,
    cadencia: 220,
    carregador: 25,
    reserva: 100
  },

  {
    nome: "Rifle Pesado",
    dano: 35,
    cadencia: 450,
    carregador: 20,
    reserva: 80
  },

  {
    nome: "Escopeta",
    dano: 50,
    cadencia: 650,
    carregador: 6,
    reserva: 36
  },

  {
    nome: "Precisão",
    dano: 65,
    cadencia: 900,
    carregador: 5,
    reserva: 25
  },

  {
    nome: "Plasma",
    dano: 30,
    cadencia: 280,
    carregador: 18,
    reserva: 72
  },

  {
    nome: "Laser",
    dano: 15,
    cadencia: 90,
    carregador: 40,
    reserva: 160
  },

  {
    nome: "Canhão",
    dano: 80,
    cadencia: 1100,
    carregador: 3,
    reserva: 15
  },

  {
    nome: "Blaster",
    dano: 27,
    cadencia: 180,
    carregador: 20,
    reserva: 100
  }

];


let armaAtual = 0;

let balas = armas[0].carregador;

let reserva = armas[0].reserva;


// =====================================================
// INIMIGOS
// =====================================================

const inimigos = [

  {
    x: -250,
    y: -180,
    vida: 100,
    vivo: true
  },

  {
    x: 280,
    y: -220,
    vida: 100,
    vivo: true
  },

  {
    x: -300,
    y: 250,
    vida: 100,
    vivo: true
  },

  {
    x: 350,
    y: 250,
    vida: 100,
    vivo: true
  }

];


// =====================================================
// PROJÉTEIS
// =====================================================

const tiros = [];


// =====================================================
// TECLAS
// =====================================================

const teclas = {};

window.addEventListener("keydown", function(event) {

  teclas[event.key.toLowerCase()] = true;

  if (event.key === " ") {

    atirar();

  }

  if (event.key.toLowerCase() === "q") {

    trocarArma();

  }

});

window.addEventListener("keyup", function(event) {

  teclas[event.key.toLowerCase()] = false;

});


// =====================================================
// MAPA
// =====================================================

const mapa = {

  tamanho: 1400

};


// =====================================================
// CONSTRUÇÕES
// =====================================================

const construcoes = [

  {
    x: -400,
    y: -250,
    largura: 180,
    altura: 140
  },

  {
    x: 300,
    y: -300,
    largura: 220,
    altura: 150
  },

  {
    x: -300,
    y: 300,
    largura: 160,
    altura: 180
  },

  {
    x: 350,
    y: 300,
    largura: 200,
    altura: 140
  }

];


// =====================================================
// ÁRVORES
// =====================================================

const arvores = [

  [-600, -500],
  [-500, 500],
  [600, -500],
  [600, 500],
  [0, -550],
  [-650, 0],
  [650, 0]

];


// =====================================================
// CONVERSÃO
// =====================================================

function converter(x, y) {

  return {

    x: largura / 2 +
      (x - camera.x) * 0.65,

    y: altura / 2 +
      (y - camera.y) * 0.65

  };

}


// =====================================================
// DESENHAR MAPA
// =====================================================

function desenharMapa() {

  ctx.fillStyle = "#72a653";

  ctx.fillRect(
    0,
    0,
    largura,
    altura
  );


  // ESTRADA

  ctx.fillStyle = "#46494a";

  const estrada =
    converter(0, -100);

  ctx.fillRect(
    0,
    estrada.y,
    largura,
    130
  );


  // LINHA DA ESTRADA

  ctx.strokeStyle = "#eeeeee";

  ctx.lineWidth = 4;

  ctx.setLineDash([
    30,
    30
  ]);

  ctx.beginPath();

  ctx.moveTo(
    0,
    estrada.y + 65
  );

  ctx.lineTo(
    largura,
    estrada.y + 65
  );

  ctx.stroke();

  ctx.setLineDash([]);


  // CAMINHO

  ctx.fillStyle = "#aaa69c";

  const caminho =
    converter(-700, 170);

  ctx.fillRect(
    caminho.x,
    0,
    80,
    altura
  );

}


// =====================================================
// CONSTRUÇÕES
// =====================================================

function desenharConstrucoes() {

  for (const casa of construcoes) {

    const pos =
      converter(
        casa.x,
        casa.y
      );

    const escala = 0.65;

    const w =
      casa.largura * escala;

    const h =
      casa.altura * escala;


    // sombra

    ctx.fillStyle =
      "rgba(0,0,0,.2)";

    ctx.fillRect(
      pos.x - w / 2 + 8,
      pos.y - h / 2 + 8,
      w,
      h
    );


    // casa

    ctx.fillStyle =
      "#c6b18c";

    ctx.fillRect(
      pos.x - w / 2,
      pos.y - h / 2,
      w,
      h
    );


    // telhado

    ctx.fillStyle =
      "#795548";

    ctx.beginPath();

    ctx.moveTo(
      pos.x - w / 2,
      pos.y - h / 2
    );

    ctx.lineTo(
      pos.x,
      pos.y - h / 2 - 35
    );

    ctx.lineTo(
      pos.x + w / 2,
      pos.y - h / 2
    );

    ctx.closePath();

    ctx.fill();


    // janelas

    ctx.fillStyle =
      "#65a6c7";

    ctx.fillRect(
      pos.x - w * .32,
      pos.y - h * .15,
      25,
      25
    );

    ctx.fillRect(
      pos.x + w * .12,
      pos.y - h * .15,
      25,
      25
    );


    // porta

    ctx.fillStyle =
      "#573b2b";

    ctx.fillRect(
      pos.x - 12,
      pos.y + h * .08,
      24,
      h * .42
    );

  }

}


// =====================================================
// ÁRVORES
// =====================================================

function desenharArvores() {

  for (const arvore of arvores) {

    const pos =
      converter(
        arvore[0],
        arvore[1]
      );


    // tronco

    ctx.fillStyle =
      "#65432d";

    ctx.fillRect(
      pos.x - 7,
      pos.y - 35,
      14,
      35
    );


    // copa

    ctx.fillStyle =
      "#276b35";

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y - 55,
      32,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
      "#388b40";

    ctx.beginPath();

    ctx.arc(
      pos.x - 12,
      pos.y - 65,
      20,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }

}


// =====================================================
// DESENHAR INIMIGOS
// =====================================================

function desenharInimigos() {

  for (const inimigo of inimigos) {

    if (!inimigo.vivo) continue;


    const pos =
      converter(
        inimigo.x,
        inimigo.y
      );


    // sombra

    ctx.fillStyle =
      "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
      pos.x,
      pos.y + 25,
      22,
      8,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // pernas

    ctx.fillStyle =
      "#252525";

    ctx.fillRect(
      pos.x - 12,
      pos.y,
      9,
      28
    );

    ctx.fillRect(
      pos.x + 3,
      pos.y,
      9,
      28
    );


    // corpo

    ctx.fillStyle =
      "#b52d35";

    ctx.fillRect(
      pos.x - 17,
      pos.y - 45,
      34,
      45
    );


    // cabeça

    ctx.fillStyle =
      "#d29a73";

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y - 60,
      15,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // vida

    ctx.fillStyle =
      "rgba(0,0,0,.5)";

    ctx.fillRect(
      pos.x - 25,
      pos.y - 88,
      50,
      5
    );

    ctx.fillStyle =
      "#42d65c";

    ctx.fillRect(
      pos.x - 25,
      pos.y - 88,
      50 *
      Math.max(
        0,
        inimigo.vida / 100
      ),
      5
    );

  }

}


// =====================================================
// DESENHAR JOGADOR
// =====================================================

function desenharJogador() {

  const x =
    largura / 2;

  const y =
    altura * .63;


  // sombra

  ctx.fillStyle =
    "rgba(0,0,0,.25)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y + 28,
    25,
    10,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // pernas

  ctx.fillStyle =
    "#17243b";

  ctx.fillRect(
    x - 14,
    y,
    10,
    30
  );

  ctx.fillRect(
    x + 4,
    y,
    10,
    30
  );


  // corpo

  ctx.fillStyle =
    "#2766b2";

  ctx.fillRect(
    x - 19,
    y - 48,
    38,
    52
  );


  // braços

  ctx.fillStyle =
    "#d7a27a";

  ctx.fillRect(
    x - 29,
    y - 43,
    10,
    35
  );

  ctx.fillRect(
    x + 19,
    y - 43,
    10,
    35
  );


  // cabeça

  ctx.fillStyle =
    "#e0ad82";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 65,
    17,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // cabelo

  ctx.fillStyle =
    "#202020";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 70,
    17,
    Math.PI,
    Math.PI * 2
  );

  ctx.fill();


  // arma visual

  ctx.fillStyle =
    "#20242a";

  ctx.fillRect(
    x + 22,
    y - 32,
    32,
    7
  );

}


// =====================================================
// MOVIMENTO
// =====================================================

function atualizarJogador() {

  let dx = 0;
  let dy = 0;


  if (teclas["w"])
    dy -= 1;

  if (teclas["s"])
    dy += 1;

  if (teclas["a"])
    dx -= 1;

  if (teclas["d"])
    dx += 1;


  if (joystickX !== 0 ||
      joystickY !== 0) {

    dx = joystickX;
    dy = joystickY;

  }


  const tamanho =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (tamanho > 0) {

    dx /= tamanho;
    dy /= tamanho;


    jogador.x +=
      dx * jogador.velocidade;

    jogador.y +=
      dy * jogador.velocidade;

  }


  const limite =
    mapa.tamanho / 2;


  jogador.x =
    Math.max(
      -limite,
      Math.min(
        limite,
        jogador.x
      )
    );


  jogador.y =
    Math.max(
      -limite,
      Math.min(
        limite,
        jogador.y
      )
    );


  // câmera segue o jogador

  camera.x +=
    (jogador.x - camera.x)
    * .12;

  camera.y +=
    (jogador.y - camera.y)
    * .12;

}


// =====================================================
// ATUALIZAR INIMIGOS
// =====================================================

function atualizarInimigos() {

  for (const inimigo of inimigos) {

    if (!inimigo.vivo)
      continue;


    const dx =
      jogador.x - inimigo.x;

    const dy =
      jogador.y - inimigo.y;


    const distancia =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    // inimigos se aproximam

    if (distancia > 110 &&
        distancia < 500) {

      inimigo.x +=
        (dx / distancia) * .5;

      inimigo.y +=
        (dy / distancia) * .5;

    }


    // dano simples por proximidade

    if (distancia < 70) {

      jogador.vida -= .08;

      atualizarVida();

    }

  }

}


// =====================================================
// ATIRAR
// =====================================================

function atirar() {

  if (!jogoIniciado)
    return;

  if (gameOver)
    return;


  const agora =
    Date.now();

  const arma =
    armas[armaAtual];


  if (
    agora - jogador.ultimoTiro
    < arma.cadencia
  ) {
    return;
  }


  if (balas <= 0) {

    recarregar();

    return;

  }


  jogador.ultimoTiro =
    agora;

  balas--;


  // projétil vai para frente da tela

  tiros.push({

    x: jogador.x,

    y: jogador.y,

    dx: 0,

    dy: -1,

    dano: arma.dano,

    distancia: 0

  });


  atualizarMunicao();

}


// =====================================================
// ATUALIZAR TIROS
// =====================================================

function atualizarTiros() {

  for (
    let i = tiros.length - 1;
    i >= 0;
    i--
  ) {

    const tiro =
      tiros[i];


    tiro.x +=
      tiro.dx * 15;

    tiro.y +=
      tiro.dy * 15;


    tiro.distancia += 15;


    // colisão com inimigos

    for (const inimigo of inimigos) {

      if (!inimigo.vivo)
        continue;


      const dx =
        tiro.x - inimigo.x;

      const dy =
        tiro.y - inimigo.y;


      const distancia =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (distancia < 40) {

        inimigo.vida -=
          tiro.dano;


        tiros.splice(i, 1);


        if (inimigo.vida <= 0) {

          inimigo.vida = 0;

          inimigo.vivo = false;

        }

        break;

      }

    }


    if (
      tiro.distancia > 800
    ) {

      if (tiros[i])
        tiros.splice(i, 1);

    }

  }

}


// =====================================================
// DESENHAR TIROS
// =====================================================

function desenharTiros() {

  for (const tiro of tiros) {

    const pos =
      converter(
        tiro.x,
        tiro.y
      );


    ctx.fillStyle =
      "#ffd43b";

    ctx.beginPath();

    ctx.arc(
      pos.x,
      pos.y,
      4,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }

}


// =====================================================
// RECARREGAR
// =====================================================

function recarregar() {

  const arma =
    armas[armaAtual];


  if (reserva <= 0)
    return;


  const necessario =
    arma.carregador - balas;


  const quantidade =
    Math.min(
      necessario,
      reserva
    );


  balas += quantidade;

  reserva -= quantidade;


  atualizarMunicao();

}


// =====================================================
// TROCAR ARMA
// =====================================================

function trocarArma() {

  armaAtual++;

  if (
    armaAtual >= armas.length
  ) {

    armaAtual = 0;

  }


  const arma =
    armas[armaAtual];


  balas =
    arma.carregador;

  reserva =
    arma.reserva;


  atualizarMunicao();

}


// =====================================================
// HUD DE MUNIÇÃO
// =====================================================

function atualizarMunicao() {

  document.getElementById(
    "armaNome"
  ).textContent =
    armas[armaAtual].nome;


  document.getElementById(
    "balas"
  ).textContent =
    balas;


  document.getElementById(
    "reserva"
  ).textContent =
    reserva;

}


// =====================================================
// VIDA
// =====================================================

function atualizarVida() {

  jogador.vida =
    Math.max(
      0,
      jogador.vida
    );


  document.getElementById(
    "vidaBarra"
  ).style.width =
    jogador.vida + "%";


  document.getElementById(
    "vidaNumero"
  ).textContent =
    Math.ceil(
      jogador.vida
    );


  if (
    jogador.vida <= 0
  ) {

    terminarJogo();

  }

}


// =====================================================
// GAME OVER
// =====================================================

function terminarJogo() {

  if (gameOver)
    return;


  gameOver = true;


  setTimeout(
    function() {

      alert(
        "Você foi derrotado!"
      );

      location.reload();

    },
    300
  );

}


// =====================================================
// JOYSTICK
// =====================================================

const joystick =
  document.getElementById(
    "joystick"
  );

const joystickCentro =
  document.getElementById(
    "joystickCentro"
  );


let joystickAtivo = false;

let joystickX = 0;

let joystickY = 0;


joystick.addEventListener(
  "pointerdown",
  function(event) {

    joystickAtivo = true;

    joystick.setPointerCapture(
      event.pointerId
    );

  }
);


joystick.addEventListener(
  "pointermove",
  function(event) {

    if (!joystickAtivo)
      return;


    const rect =
      joystick.getBoundingClientRect();


    const centroX =
      rect.left +
      rect.width / 2;

    const centroY =
      rect.top +
      rect.height / 2;


    let dx =
      event.clientX -
      centroX;

    let dy =
      event.clientY -
      centroY;


    const distancia =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    const limite = 40;


    if (
      distancia > limite
    ) {

      dx =
        dx / distancia *
        limite;

      dy =
        dy / distancia *
        limite;

    }


    joystickX =
      dx / limite;

    joystickY =
      dy / limite;


    joystickCentro.style.left =
      33 + dx + "px";

    joystickCentro.style.top =
      33 + dy + "px";

  }
);


function pararJoystick() {

  joystickAtivo = false;

  joystickX = 0;
  joystickY = 0;


  joystickCentro.style.left =
    "33px";

  joystickCentro.style.top =
    "33px";

}


joystick.addEventListener(
  "pointerup",
  pararJoystick
);

joystick.addEventListener(
  "pointercancel",
  pararJoystick
);


// =====================================================
// BOTÕES MOBILE
// =====================================================

document
  .getElementById("atirar")
  .addEventListener(
    "pointerdown",
    atirar
  );


document
  .getElementById("trocar")
  .addEventListener(
    "pointerdown",
    trocarArma
  );


document
  .getElementById("cameraEsq")
  .addEventListener(
    "pointerdown",
    function() {

      jogador.angulo -= .2;

    }
  );


document
  .getElementById("cameraDir")
  .addEventListener(
    "pointerdown",
    function() {

      jogador.angulo += .2;

    }
  );


// =====================================================
// MENU HUD
// =====================================================

const menuHUD =
  document.getElementById(
    "menuHUD"
  );


document
  .getElementById("botaoHUD")
  .addEventListener(
    "click",
    function() {

      menuHUD.style.display =
        "flex";

    }
  );


document
  .getElementById("fecharHUD")
  .addEventListener(
    "click",
    function() {

      menuHUD.style.display =
        "none";

    }
  );


// =====================================================
// PERSONALIZAÇÃO
// =====================================================

const mostrarVida =
  document.getElementById(
    "mostrarVida"
  );

const mostrarArma =
  document.getElementById(
    "mostrarArma"
  );

const mostrarMira =
  document.getElementById(
    "mostrarMira"
  );

const mostrarLogo =
  document.getElementById(
    "mostrarLogo"
  );

const mostrarMensagem =
  document.getElementById(
    "mostrarMensagem"
  );

const tamanhoHUD =
  document.getElementById(
    "tamanhoHUD"
  );


function salvarHUD() {

  const configuracao = {

    vida: mostrarVida.checked,

    arma: mostrarArma.checked,

    mira: mostrarMira.checked,

    logo: mostrarLogo.checked,

    mensagem:
      mostrarMensagem.checked,

    tamanho:
      tamanhoHUD.value

  };


  localStorage.setItem(
    "miniBattleHUD",
    JSON.stringify(
      configuracao
    )
  );

}


function aplicarHUD() {

  document.getElementById(
    "vidaBox"
  ).style.display =
    mostrarVida.checked
      ? "block"
      : "none";


  document.getElementById(
    "armaHud"
  ).style.display =
    mostrarArma.checked
      ? "block"
      : "none";


  document.getElementById(
    "mira"
  ).style.display =
    mostrarMira.checked
      ? "block"
      : "none";


  document.getElementById(
    "logo"
  ).style.display =
    mostrarLogo.checked
      ? "block"
      : "none";


  document.getElementById(
    "mensagem"
  ).style.display =
    mostrarMensagem.checked
      ? "block"
      : "none";


  document.getElementById(
    "hud"
  ).style.transform =
    `scale(${tamanhoHUD.value / 100})`;


  salvarHUD();

}


mostrarVida.addEventListener(
  "change",
  aplicarHUD
);

mostrarArma.addEventListener(
  "change",
  aplicarHUD
);

mostrarMira.addEventListener(
  "change",
  aplicarHUD
);

mostrarLogo.addEventListener(
  "change",
  aplicarHUD
);

mostrarMensagem.addEventListener(
  "change",
  aplicarHUD
);

tamanhoHUD.addEventListener(
  "input",
  aplicarHUD
);


// =====================================================
// RESTAURAR HUD
// =====================================================

document
  .getElementById("resetHUD")
  .addEventListener(
    "click",
    function() {

      mostrarVida.checked = true;

      mostrarArma.checked = true;

      mostrarMira.checked = true;

      mostrarLogo.checked = true;

      mostrarMensagem.checked = true;

      tamanhoHUD.value = 100;

      aplicarHUD();

    }
  );


// =====================================================
// CARREGAR HUD SALVO
// =====================================================

function carregarHUD() {

  const salvo =
    localStorage.getItem(
      "miniBattleHUD"
    );


  if (!salvo)
    return;


  try {

    const config =
      JSON.parse(salvo);


    mostrarVida.checked =
      config.vida;

    mostrarArma.checked =
      config.arma;

    mostrarMira.checked =
      config.mira;

    mostrarLogo.checked =
      config.logo;

    mostrarMensagem.checked =
      config.mensagem;

    tamanhoHUD.value =
      config.tamanho;


  } catch (erro) {

    console.log(
      "Configuração de HUD inválida."
    );

  }

}


// =====================================================
// INICIAR
// =====================================================

document
  .getElementById("iniciar")
  .addEventListener(
    "click",
    function() {

      jogoIniciado = true;

      document.getElementById(
        "inicio"
      ).style.display =
        "none";

    }
  );


// =====================================================
// LOOP PRINCIPAL
// =====================================================

function jogo() {

  if (jogoIniciado &&
      !gameOver) {

    atualizarJogador();

    atualizarInimigos();

    atualizarTiros();

    atualizarVida();

  }


  desenharMapa();

  desenharArvores();

  desenharConstrucoes();

  desenharTiros();

  desenharInimigos();

  desenharJogador();


  requestAnimationFrame(
    jogo
  );

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarHUD();

aplicarHUD();

atualizarMunicao();

atualizarVida();

jogo();