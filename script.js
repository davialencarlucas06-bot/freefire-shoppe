/* =========================================================
   BATTLE ZONE 3D
   Three.js — versão leve para GitHub Pages
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x91b7c9);

scene.fog = new THREE.Fog(
  0x91b7c9,
  55,
  240
);


/* =========================================================
   CÂMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

camera.position.set(0, 6, 10);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = false;

document
  .getElementById("game")
  .appendChild(renderer.domElement);


/* =========================================================
   ILUMINAÇÃO
========================================================= */

const hemi = new THREE.HemisphereLight(
  0xffffff,
  0x496273,
  2
);

scene.add(hemi);

const sun = new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(
  60,
  100,
  30
);

scene.add(sun);


/* =========================================================
   MAPA
========================================================= */

const WORLD_SIZE = 220;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(
    WORLD_SIZE,
    WORLD_SIZE
  ),
  new THREE.MeshStandardMaterial({
    color: 0x4f704f,
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


/* =========================================================
   ESTRADA
========================================================= */

function createBox(
  x,
  y,
  z,
  sx,
  sy,
  sz,
  color
) {

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(
      sx,
      sy,
      sz
    ),
    new THREE.MeshStandardMaterial({
      color
    })
  );

  mesh.position.set(
    x,
    y,
    z
  );

  scene.add(mesh);

  return mesh;
}


createBox(
  0,
  .03,
  0,
  220,
  .08,
  18,
  0x34383d
);

createBox(
  0,
  .04,
  0,
  18,
  .09,
  220,
  0x34383d
);


/* =========================================================
   PRÉDIOS
========================================================= */

const buildings = [];

function createBuilding(x,z,w,d,h) {

  const building = createBox(
    x,
    h / 2,
    z,
    w,
    h,
    d,
    0x9b9d9e
  );

  buildings.push(building);

  /* teto */

  createBox(
    x,
    h + .15,
    z,
    w + .3,
    .3,
    d + .3,
    0x3f454a
  );

  /* porta */

  createBox(
    x,
    1.2,
    z - d / 2 - .04,
    2,
    2.4,
    .15,
    0x26313a
  );

  /* janelas */

  for(let i=-1;i<=1;i++){

    createBox(
      x + i * 3,
      h * .6,
      z - d / 2 - .06,
      1.3,
      1.3,
      .12,
      0x5fa0c4
    );

  }

}


createBuilding(-35,-35,18,15,9);
createBuilding(35,-35,20,15,12);
createBuilding(-35,35,16,20,8);
createBuilding(35,35,18,18,10);

createBuilding(-65,0,16,17,7);
createBuilding(65,0,17,15,11);


/* =========================================================
   ÁRVORES
========================================================= */

function createTree(x,z){

  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      .7,
      .9,
      4,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x604532
    })
  );

  trunk.position.y = 2;

  group.add(trunk);


  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(
      3.3,
      10,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x2f743b
    })
  );

  crown.position.y = 6;

  group.add(crown);

  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);
}


for(let i=0;i<35;i++){

  const x =
    (Math.random()-.5)*190;

  const z =
    (Math.random()-.5)*190;

  if(Math.abs(x)<20 || Math.abs(z)<20)
    continue;

  createTree(x,z);
}


/* =========================================================
   CAIXAS / OBJETOS
========================================================= */

for(let i=0;i<35;i++){

  const x =
    (Math.random()-.5)*180;

  const z =
    (Math.random()-.5)*180;

  createBox(
    x,
    .7,
    z,
    1.5,
    1.4,
    1.5,
    0x725438
  );
}


/* =========================================================
   PLAYER
========================================================= */

const player = new THREE.Group();

player.position.set(
  0,
  0,
  15
);

scene.add(player);


/* corpo */

const body = new THREE.Mesh(
  new THREE.BoxGeometry(
    1.2,
    1.7,
    .65
  ),
  new THREE.MeshStandardMaterial({
    color: 0x2875c7
  })
);

body.position.y = 2;

player.add(body);


/* cabeça */

const head = new THREE.Mesh(
  new THREE.SphereGeometry(
    .55,
    12,
    10
  ),
  new THREE.MeshStandardMaterial({
    color: 0xd29a72
  })
);

head.position.y = 3.35;

player.add(head);


/* pernas */

const legL = new THREE.Mesh(
  new THREE.BoxGeometry(
    .45,
    1.3,
    .5
  ),
  new THREE.MeshStandardMaterial({
    color: 0x222831
  })
);

const legR = legL.clone();

legL.position.set(
  -.3,
  .65,
  0
);

legR.position.set(
  .3,
  .65,
  0
);

player.add(
  legL,
  legR
);


/* braços */

const armL = new THREE.Mesh(
  new THREE.BoxGeometry(
    .4,
    1.25,
    .4
  ),
  new THREE.MeshStandardMaterial({
    color: 0x2875c7
  })
);

const armR = armL.clone();

armL.position.set(
  -.85,
  2,
  0
);

armR.position.set(
  .85,
  2,
  0
);

player.add(
  armL,
  armR
);


/* arma visual */

const gun = createBox(
  0,
  0,
  0,
  1,
  .25,
  .25,
  0x171b20
);

gun.position.set(
  .8,
  2.1,
  -.55
);

player.add(gun);


/* =========================================================
   ESTADO DO PLAYER
========================================================= */

let health = 100;
let shield = 70;

let playerSpeed = 12;

let verticalVelocity = 0;
let grounded = true;

let crouching = false;
let running = false;

let kills = 0;


/* =========================================================
   ARMAS
========================================================= */

const weapons = [

  {
    name:"PISTOLA",
    damage:18,
    fireRate:350,
    magazine:12,
    ammo:12,
    reserve:60,
    spread:.01
  },

  {
    name:"SMG",
    damage:10,
    fireRate:100,
    magazine:30,
    ammo:30,
    reserve:120,
    spread:.05
  },

  {
    name:"RIFLE",
    damage:24,
    fireRate:170,
    magazine:25,
    ammo:25,
    reserve:100,
    spread:.025
  },

  {
    name:"RIFLE PESADO",
    damage:34,
    fireRate:300,
    magazine:20,
    ammo:20,
    reserve:80,
    spread:.02
  },

  {
    name:"ESCOPETA",
    damage:12,
    fireRate:650,
    magazine:6,
    ammo:6,
    reserve:30,
    spread:.16,
    pellets:7
  },

  {
    name:"PRECISÃO",
    damage:75,
    fireRate:900,
    magazine:5,
    ammo:5,
    reserve:25,
    spread:.005
  },

  {
    name:"PLASMA",
    damage:30,
    fireRate:230,
    magazine:20,
    ammo:20,
    reserve:80,
    spread:.03
  },

  {
    name:"LASER",
    damage:20,
    fireRate:80,
    magazine:40,
    ammo:40,
    reserve:160,
    spread:.01
  },

  {
    name:"CANHÃO",
    damage:90,
    fireRate:1200,
    magazine:3,
    ammo:3,
    reserve:15,
    spread:.04
  },

  {
    name:"BLASTER",
    damage:42,
    fireRate:400,
    magazine:10,
    ammo:10,
    reserve:40,
    spread:.02
  }

];

let weaponIndex = 0;

let weapon = weapons[weaponIndex];

let lastShot = 0;

let reloading = false;


/* =========================================================
   HUD
========================================================= */

function updateHUD(){

  document.getElementById("healthBar").style.width =
    Math.max(0,health) + "%";

  document.getElementById("shieldBar").style.width =
    Math.max(0,shield) + "%";

  document.getElementById("weaponName").textContent =
    weapon.name;

  document.getElementById("ammoCurrent").textContent =
    weapon.ammo;

  document.getElementById("ammoReserve").textContent =
    weapon.reserve;

  document.getElementById("killText").textContent =
    kills;

}

updateHUD();


/* =========================================================
   INIMIGOS
========================================================= */

const enemies = [];


function createEnemy(x,z){

  const enemy = new THREE.Group();

  enemy.position.set(
    x,
    0,
    z
  );

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(
      1.1,
      1.7,
      .65
    ),
    new THREE.MeshStandardMaterial({
      color: 0xd64a52
    })
  );

  body.position.y = 2;

  enemy.add(body);


  const head = new THREE.Mesh(
    new THREE.SphereGeometry(
      .52,
      10,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0xb97c5e
    })
  );

  head.position.y = 3.3;

  enemy.add(head);


  const healthBack = new THREE.Mesh(
    new THREE.PlaneGeometry(
      2,
      .18
    ),
    new THREE.MeshBasicMaterial({
      color:0x111111
    })
  );

  healthBack.position.y = 4.1;

  enemy.add(healthBack);


  const healthFront = new THREE.Mesh(
    new THREE.PlaneGeometry(
      1.8,
      .12
    ),
    new THREE.MeshBasicMaterial({
      color:0x55e875
    })
  );

  healthFront.position.set(
    0,
    4.1,
    -.01
  );

  enemy.add(healthFront);


  enemy.userData = {
    health:100,
    maxHealth:100,
    hpBar:healthFront,
    speed:2.5 + Math.random()*1.2,
    attackCooldown:0
  };

  scene.add(enemy);

  enemies.push(enemy);
}


[
  [-70,-60],
  [-20,-65],
  [30,-65],
  [75,-40],
  [70,30],
  [45,70],
  [-30,65],
  [-70,45],
  [75,75],
  [-80,0]
].forEach(p =>
  createEnemy(p[0],p[1])
);


/* =========================================================
   LOOT
========================================================= */

const loot = [];

function createLoot(x,z,type){

  const color =
    type === "ammo"
      ? 0xe7c44d
      : 0x55e87b;

  const item = new THREE.Mesh(
    new THREE.BoxGeometry(
      1,
      1,
      1
    ),
    new THREE.MeshStandardMaterial({
      color,
      emissive:color,
      emissiveIntensity:.2
    })
  );

  item.position.set(
    x,
    .7,
    z
  );

  item.userData.type = type;

  scene.add(item);

  loot.push(item);
}


for(let i=0;i<20;i++){

  createLoot(
    (Math.random()-.5)*170,
    (Math.random()-.5)*170,
    Math.random()>.5
      ? "ammo"
      : "med"
  );

}


/* =========================================================
   ZONA
========================================================= */

let zoneRadius = 100;

const zoneGeometry =
  new THREE.RingGeometry(
    zoneRadius-.5,
    zoneRadius,
    96
  );

const zoneMaterial =
  new THREE.MeshBasicMaterial({
    color:0x55aaff,
    transparent:true,
    opacity:.7,
    side:THREE.DoubleSide
  });

const zoneRing =
  new THREE.Mesh(
    zoneGeometry,
    zoneMaterial
  );

zoneRing.rotation.x =
  -Math.PI/2;

zoneRing.position.y =
  .15;

scene.add(zoneRing);


/* =========================================================
   MOVIMENTAÇÃO
========================================================= */

const keys = {};

window.addEventListener(
  "keydown",
  e => {

    keys[e.code] = true;

    if(e.code === "KeyR")
      reload();

    if(e.code === "Space")
      jump();

    if(e.code === "KeyC")
      crouching = !crouching;

    if(e.code === "ShiftLeft")
      running = true;

    if(e.code.startsWith("Digit")){

      const n =
        parseInt(e.code.replace("Digit",""));

      if(n>=1 && n<=9)
        switchWeapon(n-1);

      if(n===0)
        switchWeapon(9);
    }

  }
);


window.addEventListener(
  "keyup",
  e => {

    keys[e.code] = false;

    if(e.code === "ShiftLeft")
      running = false;

  }
);


/* =========================================================
   JOYSTICK
========================================================= */

let joyX = 0;
let joyY = 0;

const joystick =
  document.getElementById("joystick");

const knob =
  document.getElementById("joyKnob");

let joystickActive = false;

joystick.addEventListener(
  "pointerdown",
  e => {

    joystickActive = true;

    joystick.setPointerCapture(
      e.pointerId
    );

    moveJoystick(e);

  }
);

joystick.addEventListener(
  "pointermove",
  e => {

    if(joystickActive)
      moveJoystick(e);

  }
);

joystick.addEventListener(
  "pointerup",
  () => {

    joystickActive = false;

    joyX = 0;
    joyY = 0;

    knob.style.transform =
      "translate(-50%,-50%)";

  }
);


function moveJoystick(e){

  const rect =
    joystick.getBoundingClientRect();

  let x =
    e.clientX -
    (rect.left + rect.width/2);

  let y =
    e.clientY -
    (rect.top + rect.height/2);

  const max = 45;

  const length =
    Math.sqrt(x*x+y*y);

  if(length>max){

    x =
      x/length*max;

    y =
      y/length*max;

  }

  joyX = x/max;
  joyY = y/max;

  knob.style.transform =
    `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}


/* =========================================================
   CÂMERA 360°
========================================================= */

let cameraYaw = 0;
let cameraPitch = .25;

let cameraDistance = 8;

let looking = false;

let lastPointerX = 0;
let lastPointerY = 0;


renderer.domElement.addEventListener(
  "pointerdown",
  e => {

    if(e.pointerType === "mouse"){

      if(e.button === 2){

        looking = true;

        lastPointerX =
          e.clientX;

        lastPointerY =
          e.clientY;

      }

    } else {

      if(e.clientX >
        window.innerWidth*.45){

        looking = true;

        lastPointerX =
          e.clientX;

        lastPointerY =
          e.clientY;

      }

    }

  }
);


renderer.domElement.addEventListener(
  "pointermove",
  e => {

    if(!looking)
      return;

    const dx =
      e.clientX-lastPointerX;

    const dy =
      e.clientY-lastPointerY;

    cameraYaw -= dx*.006;

    cameraPitch -= dy*.004;

    cameraPitch =
      Math.max(
        -.2,
        Math.min(
          .8,
          cameraPitch
        )
      );

    lastPointerX =
      e.clientX;

    lastPointerY =
      e.clientY;

  }
);


window.addEventListener(
  "pointerup",
  () => {
    looking = false;
  }
);

renderer.domElement.addEventListener(
  "contextmenu",
  e => e.preventDefault()
);


/* =========================================================
   CÂMERA
========================================================= */

function updateCamera(){

  const target =
    new THREE.Vector3(
      player.position.x,
      player.position.y+2.2,
      player.position.z
    );

  const horizontal =
    Math.cos(cameraPitch) *
    cameraDistance;

  const vertical =
    Math.sin(cameraPitch) *
    cameraDistance;

  const x =
    target.x +
    Math.sin(cameraYaw) *
    horizontal;

  const z =
    target.z +
    Math.cos(cameraYaw) *
    horizontal;

  const y =
    target.y + vertical;

  camera.position.lerp(
    new THREE.Vector3(x,y,z),
    .12
  );

  camera.lookAt(target);

}


/* =========================================================
   MOVIMENTO PLAYER
========================================================= */

function updatePlayer(dt){

  let forward = 0;
  let side = 0;

  if(keys["KeyW"])
    forward += 1;

  if(keys["KeyS"])
    forward -= 1;

  if(keys["KeyA"])
    side -= 1;

  if(keys["KeyD"])
    side += 1;


  forward += -joyY;
  side += joyX;


  const length =
    Math.sqrt(
      forward*forward +
      side*side
    );

  if(length>1){

    forward/=length;
    side/=length;

  }


  let speed =
    playerSpeed;

  if(running)
    speed *= 1.55;

  if(crouching)
    speed *= .55;


  /* movimento relativo à câmera */

  const sin =
    Math.sin(cameraYaw);

  const cos =
    Math.cos(cameraYaw);

  const moveX =
    side*cos +
    forward*sin;

  const moveZ =
    side*-sin +
    forward*cos;


  player.position.x +=
    moveX*speed*dt;

  player.position.z +=
    moveZ*speed*dt;


  const limit =
    WORLD_SIZE/2-5;

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -limit,
      limit
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -limit,
      limit
    );


  /* rotação */

  if(length>.1){

    const targetRotation =
      Math.atan2(
        moveX,
        moveZ
      );

    player.rotation.y =
      THREE.MathUtils.lerp(
        player.rotation.y,
        targetRotation,
        .18
      );

  }


  /* pulo */

  verticalVelocity -=
    24*dt;

  player.position.y +=
    verticalVelocity*dt;


  if(player.position.y<=0){

    player.position.y=0;

    verticalVelocity=0;

    grounded=true;

  }


  /* animação */

  const moving =
    length>.1;

  if(moving){

    const walk =
      Math.sin(
        performance.now()*.012
      )*.25;

    legL.rotation.x =
      walk;

    legR.rotation.x =
      -walk;

  } else {

    legL.rotation.x=0;
    legR.rotation.x=0;

  }

}


/* =========================================================
   PULO
========================================================= */

function jump(){

  if(grounded){

    verticalVelocity=10;

    grounded=false;

  }

}


/* =========================================================
   TIRO
========================================================= */

function shoot(){

  if(!gameRunning)
    return;

  const now =
    performance.now();

  if(
    reloading ||
    now-lastShot <
    weapon.fireRate
  )
    return;

  if(weapon.ammo<=0){

    reload();

    return;

  }


  lastShot=now;

  weapon.ammo--;

  updateHUD();


  const pellets =
    weapon.pellets || 1;


  for(let i=0;i<pellets;i++){

    const ray =
      new THREE.Raycaster();

    const direction =
      new THREE.Vector3();

    camera.getWorldDirection(
      direction
    );


    direction.x +=
      (Math.random()-.5) *
      weapon.spread;

    direction.y +=
      (Math.random()-.5) *
      weapon.spread;

    direction.z +=
      (Math.random()-.5) *
      weapon.spread;

    direction.normalize();


    ray.set(
      camera.position,
      direction
    );


    const targets =
      [];

    enemies.forEach(
      e => {

        e.traverse(
          obj => {

            if(obj.isMesh)
              targets.push(obj);

          }
        );

      }
    );


    const hits =
      ray.intersectObjects(
        targets,
        false
      );


    if(hits.length){

      const object =
        hits[0].object;

      const enemy =
        findEnemy(object);


      if(enemy){

        damageEnemy(
          enemy,
          weapon.damage
        );

        showHit();

      }

    }

  }

}


/* =========================================================
   ENCONTRAR INIMIGO
========================================================= */

function findEnemy(object){

  let current =
    object;

  while(current){

    if(
      current.userData &&
      current.userData.maxHealth
    )
      return current;

    current =
      current.parent;

  }

  return null;

}


/* =========================================================
   DANO INIMIGO
========================================================= */

function damageEnemy(enemy,damage){

  enemy.userData.health -=
    damage;

  enemy.userData.hpBar.scale.x =
    Math.max(
      0,
      enemy.userData.health /
      enemy.userData.maxHealth
    );


  if(enemy.userData.health<=0){

    eliminateEnemy(enemy);

  }

}


/* =========================================================
   ELIMINAÇÃO
========================================================= */

function eliminateEnemy(enemy){

  const index =
    enemies.indexOf(enemy);

  if(index!==-1)
    enemies.splice(index,1);

  scene.remove(enemy);

  kills++;

  updateHUD();

  showMessage(
    "+1 ELIMINAÇÃO"
  );


  if(enemies.length===0){

    endGame(true);

  }

}


/* =========================================================
   HIT
========================================================= */

function showHit(){

  const marker =
    document.getElementById(
      "hitMarker"
    );

  marker.style.opacity=1;

  setTimeout(
    () => marker.style.opacity=0,
    100
  );

}


/* =========================================================
   RECARGA
========================================================= */

function reload(){

  if(
    reloading ||
    weapon.ammo>=weapon.magazine ||
    weapon.reserve<=0
  )
    return;


  reloading=true;

  showMessage(
    "RECARREGANDO..."
  );


  setTimeout(
    () => {

      const missing =
        weapon.magazine -
        weapon.ammo;

      const amount =
        Math.min(
          missing,
          weapon.reserve
        );

      weapon.ammo += amount;

      weapon.reserve -= amount;

      reloading=false;

      updateHUD();

    },
    1000
  );

}


/* =========================================================
   TROCAR ARMA
========================================================= */

function switchWeapon(index){

  if(index<0 || index>=weapons.length)
    return;

  weaponIndex=index;

  weapon =
    weapons[weaponIndex];

  reloading=false;

  updateHUD();

  showMessage(
    weapon.name
  );

}


/* =========================================================
   BOTÕES MOBILE
========================================================= */

document
  .getElementById("fireBtn")
  .addEventListener(
    "pointerdown",
    shoot
  );


document
  .getElementById("reloadBtn")
  .addEventListener(
    "pointerdown",
    reload
  );


document
  .getElementById("jumpBtn")
  .addEventListener(
    "pointerdown",
    jump
  );


document
  .getElementById("crouchBtn")
  .addEventListener(
    "pointerdown",
    () => {
      crouching=!crouching;
    }
  );


document
  .getElementById("runBtn")
  .addEventListener(
    "pointerdown",
    () => {
      running=true;
    }
  );


document
  .getElementById("runBtn")
  .addEventListener(
    "pointerup",
    () => {
      running=false;
    }
  );


document
  .getElementById("switchBtn")
  .addEventListener(
    "pointerdown",
    () => {

      switchWeapon(
        (weaponIndex+1) %
        weapons.length
      );

    }
  );


/* =========================================================
   CLIQUE PC
========================================================= */

renderer.domElement.addEventListener(
  "pointerdown",
  e => {

    if(e.pointerType==="mouse" &&
       e.button===0){

      shoot();

    }

  }
);


/* =========================================================
   INIMIGOS
========================================================= */

function updateEnemies(dt){

  enemies.forEach(enemy => {

    const dx =
      player.position.x -
      enemy.position.x;

    const dz =
      player.position.z -
      enemy.position.z;

    const distance =
      Math.sqrt(
        dx*dx+dz*dz
      );


    if(distance<35){

      const angle =
        Math.atan2(
          dx,
          dz
        );

      enemy.rotation.y =
        THREE.MathUtils.lerp(
          enemy.rotation.y,
          angle,
          .06
        );


      if(distance>5){

        enemy.position.x +=
          Math.sin(angle) *
          enemy.userData.speed *
          dt;

        enemy.position.z +=
          Math.cos(angle) *
          enemy.userData.speed *
          dt;

      } else {

        enemy.userData.attackCooldown -=
          dt;

        if(
          enemy.userData.attackCooldown<=0
        ){

          enemy.userData.attackCooldown=.8;

          takeDamage(7);

        }

      }

    }

    /* barra olha para câmera */

    enemy.userData.hpBar.parent.lookAt(
      camera.position
    );

  });

}


/* =========================================================
   DANO PLAYER
========================================================= */

function takeDamage(amount){

  if(shield>0){

    const absorbed =
      Math.min(
        shield,
        amount
      );

    shield -= absorbed;

    amount -= absorbed;

  }

  health -= amount;

  updateHUD();


  const flash =
    document.getElementById(
      "damageFlash"
    );

  flash.style.opacity=.8;

  setTimeout(
    () => flash.style.opacity=0,
    120
  );


  if(health<=0){

    health=0;

    updateHUD();

    endGame(false);

  }

}


/* =========================================================
   LOOT
========================================================= */

function updateLoot(){

  loot.forEach(
    (item,index) => {

      if(!item)
        return;

      item.rotation.y += .02;

      item.position.y =
        .7 +
        Math.sin(
          performance.now()*.003 +
          index
        )*.15;


      const distance =
        player.position.distanceTo(
          item.position
        );


      if(distance<2){

        if(item.userData.type==="ammo"){

          weapon.reserve += 30;

          showMessage(
            "+ MUNIÇÃO"
          );

        } else {

          health =
            Math.min(
              100,
              health+30
            );

          showMessage(
            "+ VIDA"
          );

        }

        scene.remove(item);

        loot[index]=null;

        updateHUD();

      }

    }
  );

}


/* =========================================================
   ZONA
========================================================= */

function updateZone(dt){

  if(!gameRunning)
    return;

  if(zoneRadius>25){

    zoneRadius -=
      dt*.7;

    zoneRing.scale.set(
      zoneRadius/100,
      zoneRadius/100,
      zoneRadius/100
    );

  }


  const distance =
    Math.sqrt(
      player.position.x *
      player.position.x +
      player.position.z *
      player.position.z
    );


  if(distance>zoneRadius){

    takeDamage(
      dt*4
    );

    document
      .getElementById("zoneText")
      .textContent =
      Math.round(zoneRadius)+"m";

  }

}


/* =========================================================
   MINI MAP
========================================================= */

const mapCanvas =
  document.getElementById(
    "mapCanvas"
  );

const mapCtx =
  mapCanvas.getContext("2d");


function updateMap(){

  mapCtx.clearRect(
    0,
    0,
    150,
    150
  );


  mapCtx.fillStyle =
    "#253b2c";

  mapCtx.fillRect(
    0,
    0,
    150,
    150
  );


  mapCtx.strokeStyle =
    "rgba(255,255,255,.2)";

  mapCtx.beginPath();

  mapCtx.moveTo(
    75,
    0
  );

  mapCtx.lineTo(
    75,
    150
  );

  mapCtx.moveTo(
    0,
    75
  );

  mapCtx.lineTo(
    150,
    75
  );

  mapCtx.stroke();


  enemies.forEach(enemy => {

    const x =
      75 +
      (enemy.position.x -
      player.position.x)*.5;

    const y =
      75 +
      (enemy.position.z -
      player.position.z)*.5;

    if(
      x>0 &&
      x<150 &&
      y>0 &&
      y<150
    ){

      mapCtx.fillStyle =
        "#ff5050";

      mapCtx.beginPath();

      mapCtx.arc(
        x,
        y,
        3,
        0,
        Math.PI*2
      );

      mapCtx.fill();

    }

  });

}


/* =========================================================
   MENSAGEM
========================================================= */

let messageTimeout;

function showMessage(text){

  const el =
    document.getElementById(
      "message"
    );

  el.textContent=text;

  el.style.opacity=1;

  clearTimeout(
    messageTimeout
  );

  messageTimeout =
    setTimeout(
      () => el.style.opacity=0,
      1000
    );

}


/* =========================================================
   HUD EDITOR
========================================================= */

const hudEditor =
  document.getElementById(
    "hudEditor"
  );


document
  .getElementById("hudOpenBtn")
  .onclick = () => {

    hudEditor.classList.remove(
      "hidden"
    );

  };


document
  .getElementById("closeHud")
  .onclick = () => {

    hudEditor.classList.add(
      "hidden"
    );

  };


document
  .getElementById("pauseHudBtn")
  .onclick = () => {

    document
      .getElementById("pauseMenu")
      .classList.add("hidden");

    hudEditor
      .classList.remove("hidden");

  };


document
  .querySelectorAll(
    "[data-toggle]"
  )
  .forEach(check => {

    check.addEventListener(
      "change",
      () => {

        const id =
          check.dataset.toggle;

        const el =
          document.getElementById(id);

        if(el)
          el.style.display =
            check.checked
              ? ""
              : "none";

      }
    );

  });


document
  .getElementById("hudScale")
  .addEventListener(
    "input",
    e => {

      document
        .getElementById("hud")
        .style.transform =
        `scale(${e.target.value})`;

      document
        .getElementById("hud")
        .style.transformOrigin =
        "center";

    }
  );


document
  .getElementById("hudOpacity")
  .addEventListener(
    "input",
    e => {

      document
        .getElementById("hud")
        .style.opacity =
        e.target.value;

    }
  );


document
  .getElementById("resetHud")
  .onclick = () => {

    localStorage.removeItem(
      "battleHud"
    );

    location.reload();

  };


document
  .getElementById("saveHud")
  .onclick = () => {

    localStorage.setItem(
      "battleHud",
      JSON.stringify({
        scale:
          document.getElementById(
            "hudScale"
          ).value,
        opacity:
          document.getElementById(
            "hudOpacity"
          ).value
      })
    );

    showMessage(
      "HUD SALVO"
    );

  };


/* =========================================================
   EDITAR POSIÇÕES
========================================================= */

let editingHUD=false;

document
  .getElementById("editPositions")
  .onclick = () => {

    editingHUD=!editingHUD;

    document
      .getElementById("hud")
      .classList.toggle(
        "hudEditing",
        editingHUD
      );

  };


/* =========================================================
   START / PAUSE
========================================================= */

let gameRunning=false;

let gameStartTime=0;


document
  .getElementById("startBtn")
  .onclick = startGame;


function startGame(){

  document
    .getElementById("startScreen")
    .classList.add(
      "hidden"
    );

  document
    .getElementById("endScreen")
    .classList.add(
      "hidden"
    );

  health=100;
  shield=70;
  kills=0;

  weaponIndex=0;
  weapon=weapons[0];

  weapon.ammo=weapon.magazine;

  player.position.set(
    0,
    0,
    15
  );

  zoneRadius=100;

  enemies.forEach(
    e => scene.remove(e)
  );

  enemies.length=0;

  [
    [-70,-60],
    [-20,-65],
    [30,-65],
    [75,-40],
    [70,30],
    [45,70],
    [-30,65],
    [-70,45],
    [75,75],
    [-80,0]
  ].forEach(p =>
    createEnemy(
      p[0],
      p[1]
    )
  );


  gameRunning=true;

  gameStartTime =
    performance.now();

  updateHUD();

}


/* =========================================================
   PAUSE
========================================================= */

window.addEventListener(
  "keydown",
  e => {

    if(
      e.code==="Escape" &&
      gameRunning
    ){

      gameRunning=false;

      document
        .getElementById("pauseMenu")
        .classList.remove(
          "hidden"
        );

    }

  }
);


document
  .getElementById("resumeBtn")
  .onclick = () => {

    gameRunning=true;

    document
      .getElementById("pauseMenu")
      .classList.add(
        "hidden"
      );

  };


document
  .getElementById("restartBtn")
  .onclick =
  startGame;


/* =========================================================
   FINAL
========================================================= */

function endGame(win){

  gameRunning=false;

  const screen =
    document.getElementById(
      "endScreen"
    );

  screen.classList.remove(
    "hidden"
  );


  document
    .getElementById("endTitle")
    .textContent =
    win
      ? "VITÓRIA!"
      : "DERROTA";


  document
    .getElementById("endText")
    .textContent =
    win
      ? "Você eliminou todos os adversários."
      : "Você foi eliminado.";


  document
    .getElementById("finalKills")
    .textContent =
    kills;


  const seconds =
    Math.floor(
      (performance.now() -
      gameStartTime)/1000
    );


  document
    .getElementById("finalTime")
    .textContent =
    `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;

}


document
  .getElementById("endRestart")
  .onclick =
  startGame;


/* =========================================================
   LOOP
========================================================= */

let lastTime =
  performance.now();


function animate(){

  requestAnimationFrame(
    animate
  );

  const now =
    performance.now();

  const dt =
    Math.min(
      (now-lastTime)/1000,
      .05
    );

  lastTime=now;


  if(gameRunning){

    updatePlayer(dt);

    updateEnemies(dt);

    updateLoot();

    updateZone(dt);

    updateCamera();

    updateMap();

  } else {

    updateCamera();

  }


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   HUD SALVO
========================================================= */

const savedHud =
  localStorage.getItem(
    "battleHud"
  );

if(savedHud){

  try{

    const data =
      JSON.parse(savedHud);

    if(data.scale){

      document
        .getElementById("hudScale")
        .value =
        data.scale;

      document
        .getElementById("hud")
        .style.transform =
        `scale(${data.scale})`;

    }

    if(data.opacity){

      document
        .getElementById("hudOpacity")
        .value =
        data.opacity;

      document
        .getElementById("hud")
        .style.opacity =
        data.opacity;

    }

  }catch(e){}

}