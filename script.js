/* =========================================================
   BATTLE CITY 3D
   Protótipo de battle royale 3D original
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const canvas = document.getElementById("gameCanvas");

let scene;
let camera;
let renderer;

let clock;

let player;
let playerModel;

let enemies = [];
let bullets = [];
let loot = [];

let keys = {};

let gameRunning = false;
let paused = false;

let health = 100;
let shield = 100;

let kills = 0;

let matchTime = 0;

let weaponIndex = 0;

let cameraYaw = 0;
let cameraPitch = 0.35;

let cameraDistance = 7;

let sensitivity = 1;

let isAiming = false;
let isFiring = false;

let canShoot = true;

let velocityY = 0;

let grounded = true;

let zoneRadius = 95;

let zoneTimer = 60;


/* =========================================================
   ARMAS
========================================================= */

const weapons = [

    {
        name: "PISTOLA",
        damage: 20,
        fireRate: 350,
        magazine: 12,
        ammo: 12,
        reserve: 48
    },

    {
        name: "SMG",
        damage: 13,
        fireRate: 110,
        magazine: 30,
        ammo: 30,
        reserve: 90
    },

    {
        name: "RIFLE",
        damage: 25,
        fireRate: 180,
        magazine: 24,
        ammo: 24,
        reserve: 72
    },

    {
        name: "ESCOPETA",
        damage: 12,
        fireRate: 700,
        magazine: 6,
        ammo: 6,
        reserve: 30
    },

    {
        name: "PRECISÃO",
        damage: 70,
        fireRate: 900,
        magazine: 5,
        ammo: 5,
        reserve: 20
    }

];


/* =========================================================
   ELEMENTOS
========================================================= */

const healthEl =
    document.getElementById("health");

const shieldEl =
    document.getElementById("shield");

const ammoEl =
    document.getElementById("ammo");

const reserveEl =
    document.getElementById("reserve");

const weaponNameEl =
    document.getElementById("weaponName");

const killsEl =
    document.getElementById("kills");

const playersEl =
    document.getElementById("players");

const messageEl =
    document.getElementById("message");

const crosshair =
    document.getElementById("crosshair");

const hitMarker =
    document.getElementById("hitMarker");

const zoneTimerEl =
    document.getElementById("zoneTimer");

const mapCanvas =
    document.getElementById("mapCanvas");

const mapCtx =
    mapCanvas.getContext("2d");


/* =========================================================
   LOBBY
========================================================= */

document
    .getElementById("playBtn")
    .onclick = () => {

        document
            .getElementById("lobby")
            .classList.add("hidden");

        document
            .getElementById("game")
            .classList.remove("hidden");

        startGame();

    };


document
    .getElementById("settingsBtn")
    .onclick = () => {

        document
            .getElementById("settingsPanel")
            .classList.remove("hidden");

    };


document
    .getElementById("closeSettings")
    .onclick = closeSettings;


document
    .getElementById("saveSettings")
    .onclick = () => {

        sensitivity =
            Number(
                document
                    .getElementById("sensitivity")
                    .value
            );

        const showMap =
            document
                .getElementById("mapToggle")
                .checked;

        document
            .getElementById("miniMap")
            .style.display =
            showMap ? "block" : "none";


        const showCross =
            document
                .getElementById("crossToggle")
                .checked;

        crosshair.style.display =
            showCross ? "block" : "none";

        closeSettings();

    };


function closeSettings() {

    document
        .getElementById("settingsPanel")
        .classList.add("hidden");

}


/* =========================================================
   INICIALIZAR THREE.JS
========================================================= */

function startGame() {

    gameRunning = true;

    health = 100;
    shield = 100;

    kills = 0;

    matchTime = 0;

    zoneRadius = 95;

    zoneTimer = 60;

    enemies = [];
    bullets = [];
    loot = [];

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x8eb4c8);

    scene.fog =
        new THREE.Fog(
            0x8eb4c8,
            80,
            260
        );


    camera =
        new THREE.PerspectiveCamera(
            70,
            window.innerWidth /
            window.innerHeight,
            0.1,
            500
        );


    renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    clock =
        new THREE.Clock();


    createLighting();

    createWorld();

    createPlayer();

    createEnemies();

    createLoot();

    updateWeaponHud();

    updateHUD();

    animate();

}


/* =========================================================
   LUZ
========================================================= */

function createLighting() {

    const ambient =
        new THREE.HemisphereLight(
            0xffffff,
            0x557060,
            2
        );

    scene.add(ambient);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    sun.position.set(
        80,
        120,
        50
    );

    sun.castShadow = false;

    scene.add(sun);

}


/* =========================================================
   MUNDO
========================================================= */

function createWorld() {

    /* CHÃO */

    const groundGeo =
        new THREE.PlaneGeometry(
            240,
            240
        );

    const groundMat =
        new THREE.MeshStandardMaterial({
            color: 0x667b61
        });

    const ground =
        new THREE.Mesh(
            groundGeo,
            groundMat
        );

    ground.rotation.x =
        -Math.PI / 2;

    scene.add(ground);


    /* ESTRADAS */

    createRoad(
        0,
        0,
        240,
        16
    );

    createRoad(
        0,
        0,
        16,
        240
    );


    /* QUARTEIRÕES */

    for (let x = -90; x <= 90; x += 45) {

        for (let z = -90; z <= 90; z += 45) {

            if (
                Math.abs(x) < 30 &&
                Math.abs(z) < 30
            ) continue;

            createBuilding(
                x +
                (Math.random() * 12 - 6),

                z +
                (Math.random() * 12 - 6)
            );

        }

    }


    /* ÁRVORES */

    for (let i = 0; i < 55; i++) {

        let x =
            Math.random() * 200 - 100;

        let z =
            Math.random() * 200 - 100;

        if (
            Math.abs(x) < 12 ||
            Math.abs(z) < 12
        ) continue;

        createTree(x, z);

    }


    /* OBSTÁCULOS */

    for (let i = 0; i < 40; i++) {

        const x =
            Math.random() * 190 - 95;

        const z =
            Math.random() * 190 - 95;

        createCrate(x, z);

    }


    /* ZONA */

    const ringGeo =
        new THREE.RingGeometry(
            zoneRadius - .5,
            zoneRadius + .5,
            96
        );

    const ringMat =
        new THREE.MeshBasicMaterial({
            color: 0x4fb8ff,
            transparent: true,
            opacity: .65,
            side: THREE.DoubleSide
        });

    const zone =
        new THREE.Mesh(
            ringGeo,
            ringMat
        );

    zone.rotation.x =
        -Math.PI / 2;

    zone.position.y = .08;

    zone.name = "zone";

    scene.add(zone);

}


/* =========================================================
   ESTRADA
========================================================= */

function createRoad(
    x,
    z,
    width,
    depth
) {

    const geo =
        new THREE.BoxGeometry(
            width,
            .05,
            depth
        );

    const mat =
        new THREE.MeshStandardMaterial({
            color: 0x30363b
        });

    const road =
        new THREE.Mesh(
            geo,
            mat
        );

    road.position.set(
        x,
        .02,
        z
    );

    scene.add(road);

}


/* =========================================================
   PRÉDIOS
========================================================= */

function createBuilding(x, z) {

    const width =
        12 + Math.random() * 8;

    const depth =
        12 + Math.random() * 8;

    const height =
        5 + Math.random() * 10;


    const geo =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const colors = [
        0x777b7d,
        0x626b70,
        0x8b8274,
        0x555f66
    ];


    const mat =
        new THREE.MeshStandardMaterial({
            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]
        });


    const building =
        new THREE.Mesh(
            geo,
            mat
        );

    building.position.set(
        x,
        height / 2,
        z
    );


    scene.add(building);


    /* telhado */

    const roofGeo =
        new THREE.BoxGeometry(
            width + .3,
            .3,
            depth + .3
        );

    const roofMat =
        new THREE.MeshStandardMaterial({
            color: 0x30353a
        });

    const roof =
        new THREE.Mesh(
            roofGeo,
            roofMat
        );

    roof.position.set(
        x,
        height + .15,
        z
    );

    scene.add(roof);

}


/* =========================================================
   ÁRVORE
========================================================= */

function createTree(x, z) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .35,
                .5,
                3,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x65452d
            })
        );

    trunk.position.set(
        x,
        1.5,
        z
    );

    scene.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.4,
                8,
                6
            ),

            new THREE.MeshStandardMaterial({
                color: 0x3f7544
            })
        );

    leaves.position.set(
        x,
        4,
        z
    );

    scene.add(leaves);

}


/* =========================================================
   CAIXAS
========================================================= */

function createCrate(x, z) {

    const geo =
        new THREE.BoxGeometry(
            2.2,
            2.2,
            2.2
        );

    const mat =
        new THREE.MeshStandardMaterial({
            color: 0x88643d
        });

    const crate =
        new THREE.Mesh(
            geo,
            mat
        );

    crate.position.set(
        x,
        1.1,
        z
    );

    crate.rotation.y =
        Math.random();

    scene.add(crate);

}


/* =========================================================
   PLAYER
========================================================= */

function createPlayer() {

    player =
        new THREE.Group();

    player.position.set(
        0,
        0,
        30
    );


    /* PERNAS */

    const legMat =
        new THREE.MeshStandardMaterial({
            color: 0x202733
        });


    const legGeo =
        new THREE.BoxGeometry(
            .65,
            1.8,
            .65
        );


    const leg1 =
        new THREE.Mesh(
            legGeo,
            legMat
        );

    leg1.position.set(
        -.45,
        .9,
        0
    );


    const leg2 =
        new THREE.Mesh(
            legGeo,
            legMat
        );

    leg2.position.set(
        .45,
        .9,
        0
    );


    /* CORPO */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.55,
                1.8,
                .9
            ),

            new THREE.MeshStandardMaterial({
                color: 0x33465d
            })
        );

    body.position.y = 2.25;


    /* CABEÇA */

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .58,
                12,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0xb77c58
            })
        );

    head.position.y = 3.55;


    /* CABELO */

    const hair =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .6,
                12,
                6
            ),

            new THREE.MeshStandardMaterial({
                color: 0x202020
            })
        );

    hair.position.y = 3.82;


    /* BRAÇO DIREITO */

    const arm =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .45,
                1.5,
                .45
            ),

            legMat
        );

    arm.position.set(
        .95,
        2.35,
        -.05
    );

    arm.rotation.z = -.2;


    /* ARMA VISUAL */

    const gun =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .35,
                .35,
                1.8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x161a1e
            })
        );

    gun.position.set(
        1.05,
        2.45,
        -.85
    );

    gun.rotation.x =
        Math.PI / 2;


    player.add(
        leg1,
        leg2,
        body,
        head,
        hair,
        arm,
        gun
    );

    scene.add(player);

    playerModel = player;

}


/* =========================================================
   INIMIGOS
========================================================= */

function createEnemies() {

    for (let i = 0; i < 9; i++) {

        createEnemy();

    }

}


function createEnemy() {

    const enemy =
        new THREE.Group();


    enemy.position.set(
        Math.random() * 170 - 85,
        0,
        Math.random() * 170 - 85
    );


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                1.8,
                .9
            ),

            new THREE.MeshStandardMaterial({
                color: 0x7b3440
            })
        );

    body.position.y = 2.2;


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .58,
                10,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0xb87f5b
            })
        );

    head.position.y = 3.5;


    const leg1 =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .55,
                1.7,
                .55
            ),

            new THREE.MeshStandardMaterial({
                color: 0x202329
            })
        );

    leg1.position.set(
        -.4,
        .85,
        0
    );


    const leg2 =
        leg1.clone();

    leg2.position.x = .4;


    enemy.add(
        body,
        head,
        leg1,
        leg2
    );


    enemy.userData = {

        health: 100,

        maxHealth: 100,

        speed:
            .8 +
            Math.random() * .5,

        attackCooldown: 0

    };


    scene.add(enemy);

    enemies.push(enemy);

}


/* =========================================================
   LOOT
========================================================= */

function createLoot() {

    for (let i = 0; i < 15; i++) {

        const box =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    .8,
                    .8,
                    .8
                ),

                new THREE.MeshStandardMaterial({
                    color: 0xd5a93c
                })
            );


        box.position.set(
            Math.random() * 180 - 90,
            .5,
            Math.random() * 180 - 90
        );


        box.userData.type =
            Math.random() > .5
                ? "ammo"
                : "shield";


        scene.add(box);

        loot.push(box);

    }

}


/* =========================================================
   MOVIMENTO
========================================================= */

function updatePlayer(delta) {

    if (!player) return;


    let forward = 0;
    let side = 0;


    if (keys["KeyW"])
        forward += 1;

    if (keys["KeyS"])
        forward -= 1;

    if (keys["KeyA"])
        side -= 1;

    if (keys["KeyD"])
        side += 1;


    const moving =
        forward !== 0 ||
        side !== 0;


    if (moving) {

        const speed =
            keys["ShiftLeft"] ||
            keys["ShiftRight"]
                ? 10
                : 5.5;


        const direction =
            new THREE.Vector3(
                side,
                0,
                forward
            );


        direction.normalize();


        const angle =
            cameraYaw;


        const cos =
            Math.cos(angle);

        const sin =
            Math.sin(angle);


        const dx =
            direction.x * cos -
            direction.z * sin;

        const dz =
            direction.x * sin +
            direction.z * cos;


        player.position.x +=
            dx * speed * delta;

        player.position.z +=
            dz * speed * delta;


        /* rotação */

        player.rotation.y =
            Math.atan2(
                dx,
                dz
            );


    }


    /* gravidade */

    velocityY -=
        22 * delta;

    player.position.y +=
        velocityY * delta;


    if (player.position.y <= 0) {

        player.position.y = 0;

        velocityY = 0;

        grounded = true;

    }


    /* limite do mapa */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -112,
            112
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -112,
            112
        );

}


/* =========================================================
   CÂMERA
========================================================= */

function updateCamera() {

    if (!player) return;


    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 2.4,
            player.position.z
        );


    const horizontal =
        cameraDistance *
        Math.cos(cameraPitch);


    const x =
        target.x -
        Math.sin(cameraYaw) *
        horizontal;

    const z =
        target.z -
        Math.cos(cameraYaw) *
        horizontal;

    const y =
        target.y +
        cameraDistance *
        Math.sin(cameraPitch);


    camera.position.set(
        x,
        y,
        z
    );


    camera.lookAt(target);

}


/* =========================================================
   TIRO
========================================================= */

function shoot() {

    if (!gameRunning || paused)
        return;

    if (!canShoot)
        return;


    const weapon =
        weapons[weaponIndex];


    if (weapon.ammo <= 0) {

        showMessage("SEM MUNIÇÃO");

        reload();

        return;

    }


    weapon.ammo--;

    updateWeaponHud();


    canShoot = false;


    setTimeout(
        () => {
            canShoot = true;
        },
        weapon.fireRate
    );


    const raycaster =
        new THREE.Raycaster();


    const direction =
        new THREE.Vector3();


    camera.getWorldDirection(
        direction
    );


    raycaster.set(
        camera.position,
        direction
    );


    const objects = [];


    enemies.forEach(
        enemy => {

            enemy.traverse(
                child => {

                    if (child.isMesh)
                        objects.push(child);

                }
            );

        }
    );


    const hits =
        raycaster.intersectObjects(
            objects,
            false
        );


    if (hits.length > 0) {

        let enemy =
            hits[0].object;


        while (
            enemy.parent &&
            !enemies.includes(enemy)
        ) {

            enemy =
                enemy.parent;

        }


        if (enemies.includes(enemy)) {

            enemy.userData.health -=
                weapon.damage;


            showHitMarker();


            if (
                enemy.userData.health <= 0
            ) {

                eliminateEnemy(enemy);

            }

        }

    }

}


/* =========================================================
   ELIMINAR INIMIGO
========================================================= */

function eliminateEnemy(enemy) {

    const index =
        enemies.indexOf(enemy);


    if (index !== -1) {

        enemies.splice(
            index,
            1
        );

    }


    scene.remove(enemy);

    kills++;

    killsEl.textContent =
        kills;


    playersEl.textContent =
        Math.max(
            1,
            enemies.length + 1
        );


    showMessage(
        "ELIMINAÇÃO!"
    );


    if (enemies.length === 0) {

        endGame(true);

    }

}


/* =========================================================
   IA DOS BOTS
========================================================= */

function updateEnemies(delta) {

    enemies.forEach(
        enemy => {

            const distance =
                enemy.position.distanceTo(
                    player.position
                );


            if (distance > 4) {

                const direction =
                    new THREE.Vector3()
                        .subVectors(
                            player.position,
                            enemy.position
                        )
                        .normalize();


                enemy.position.x +=
                    direction.x *
                    enemy.userData.speed *
                    delta;

                enemy.position.z +=
                    direction.z *
                    enemy.userData.speed *
                    delta;


                enemy.lookAt(
                    player.position.x,
                    enemy.position.y + 2,
                    player.position.z
                );

            }


            enemy.userData.attackCooldown -=
                delta;


            if (
                distance < 18 &&
                enemy.userData.attackCooldown <= 0
            ) {

                enemy.userData.attackCooldown =
                    1.3 +
                    Math.random();


                damagePlayer(
                    5 +
                    Math.random() * 5
                );

            }

        }
    );

}


/* =========================================================
   DANO NO PLAYER
========================================================= */

function damagePlayer(amount) {

    if (!gameRunning)
        return;


    let remaining =
        amount;


    if (shield > 0) {

        const absorbed =
            Math.min(
                shield,
                remaining
            );

        shield -= absorbed;

        remaining -= absorbed;

    }


    if (remaining > 0) {

        health -= remaining;

    }


    updateHUD();


    if (health <= 0) {

        health = 0;

        endGame(false);

    }

}


/* =========================================================
   RECARREGAR
========================================================= */

function reload() {

    const weapon =
        weapons[weaponIndex];


    if (
        weapon.ammo >=
        weapon.magazine
    )
        return;


    if (weapon.reserve <= 0)
        return;


    const needed =
        weapon.magazine -
        weapon.ammo;


    const amount =
        Math.min(
            needed,
            weapon.reserve
        );


    weapon.ammo += amount;

    weapon.reserve -= amount;


    updateWeaponHud();

}


/* =========================================================
   TROCAR ARMA
========================================================= */

function nextWeapon() {

    weaponIndex++;

    if (
        weaponIndex >=
        weapons.length
    ) {

        weaponIndex = 0;

    }


    updateWeaponHud();

    showMessage(
        weapons[
            weaponIndex
        ].name
    );

}


function updateWeaponHud() {

    const weapon =
        weapons[weaponIndex];


    weaponNameEl.textContent =
        weapon.name;


    ammoEl.textContent =
        weapon.ammo;


    reserveEl.textContent =
        "/ " +
        weapon.reserve;

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    healthEl.style.width =
        Math.max(
            0,
            health
        ) + "%";


    shieldEl.style.width =
        Math.max(
            0,
            shield
        ) + "%";


    killsEl.textContent =
        kills;


    playersEl.textContent =
        enemies.length + 1;

}


/* =========================================================
   HIT MARKER
========================================================= */

function showHitMarker() {

    hitMarker.style.opacity =
        "1";

    setTimeout(
        () => {

            hitMarker.style.opacity =
                "0";

        },
        120
    );

}


/* =========================================================
   MENSAGEM
========================================================= */

let messageTimeout;

function showMessage(text) {

    messageEl.textContent =
        text;

    messageEl.style.opacity =
        "1";


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(
            () => {

                messageEl.style.opacity =
                    "0";

            },
            1200
        );

}


/* =========================================================
   ZONA
========================================================= */

function updateZone(delta) {

    zoneTimer -= delta;


    if (zoneTimer <= 0) {

        zoneTimer = 60;

        zoneRadius =
            Math.max(
                15,
                zoneRadius - 10
            );


        const zone =
            scene.getObjectByName(
                "zone"
            );


        if (zone) {

            zone.scale.set(
                zoneRadius / 95,
                zoneRadius / 95,
                zoneRadius / 95
            );

        }

    }


    zoneTimerEl.textContent =
        Math.ceil(zoneTimer);


    const distance =
        Math.sqrt(
            player.position.x *
            player.position.x +

            player.position.z *
            player.position.z
        );


    if (
        distance >
        zoneRadius
    ) {

        damagePlayer(
            delta * 4
        );

    }

}


/* =========================================================
   LOOT
========================================================= */

function updateLoot() {

    loot.forEach(
        item => {

            if (!item)
                return;


            item.rotation.y +=
                .02;


            item.position.y =
                .6 +
                Math.sin(
                    performance.now() *
                    .003
                ) *
                .15;


            const distance =
                item.position.distanceTo(
                    player.position
                );


            if (distance < 2) {

                if (
                    item.userData.type ===
                    "ammo"
                ) {

                    weapons.forEach(
                        weapon => {

                            weapon.reserve +=
                                15;

                        }
                    );

                    showMessage(
                        "+ MUNIÇÃO"
                    );

                } else {

                    shield =
                        Math.min(
                            100,
                            shield + 35
                        );

                    showMessage(
                        "+ ESCUDO"
                    );

                }


                scene.remove(item);

                loot[
                    loot.indexOf(item)
                ] = null;

                updateHUD();

            }

        }
    );

}


/* =========================================================
   MINIMAPA
========================================================= */

function updateMiniMap() {

    mapCtx.clearRect(
        0,
        0,
        180,
        180
    );


    mapCtx.fillStyle =
        "#172019";

    mapCtx.fillRect(
        0,
        0,
        180,
        180
    );


    /* estradas */

    mapCtx.fillStyle =
        "#41484a";

    mapCtx.fillRect(
        80,
        0,
        20,
        180
    );

    mapCtx.fillRect(
        0,
        80,
        180,
        20
    );


    const scale =
        180 / 240;


    /* inimigos */

    enemies.forEach(
        enemy => {

            const x =
                90 +
                enemy.position.x *
                scale;

            const y =
                90 +
                enemy.position.z *
                scale;


            mapCtx.fillStyle =
                "#e85a5a";

            mapCtx.fillRect(
                x - 2,
                y - 2,
                4,
                4
            );

        }
    );


    /* player */

    const px =
        90 +
        player.position.x *
        scale;

    const py =
        90 +
        player.position.z *
        scale;


    mapCtx.fillStyle =
        "#ffffff";

    mapCtx.beginPath();

    mapCtx.arc(
        px,
        py,
        5,
        0,
        Math.PI * 2
    );

    mapCtx.fill();

}


/* =========================================================
   INPUT DESKTOP
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (
            event.code ===
            "Space"
        ) {

            jump();

        }


        if (
            event.code ===
            "KeyR"
        ) {

            reload();

        }


        if (
            event.code ===
            "KeyQ"
        ) {

            nextWeapon();

        }


        if (
            event.code ===
            "Escape"
        ) {

            togglePause();

        }


        if (
            event.code === "Digit1"
        ) weaponIndex = 0;

        if (
            event.code === "Digit2"
        ) weaponIndex = 1;

        if (
            event.code === "Digit3"
        ) weaponIndex = 2;

        if (
            event.code === "Digit4"
        ) weaponIndex = 3;

        if (
            event.code === "Digit5"
        ) weaponIndex = 4;


        updateWeaponHud();

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


/* =========================================================
   MOUSE
========================================================= */

let mouseDown = false;

window.addEventListener(
    "mousedown",
    event => {

        if (
            event.button === 0
        ) {

            mouseDown = true;

        }

    }
);


window.addEventListener(
    "mouseup",
    event => {

        if (
            event.button === 0
        ) {

            mouseDown = false;

        }

    }
);


window.addEventListener(
    "mousemove",
    event => {

        if (!gameRunning)
            return;

        if (
            document
                .getElementById("mobileControls")
                .style.display ===
                "block"
        )
            return;


        cameraYaw -=
            event.movementX *
            0.002 *
            sensitivity;


        cameraPitch -=
            event.movementY *
            0.0015 *
            sensitivity;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.1,
                1.15
            );

    }
);


/* =========================================================
   PULO
========================================================= */

function jump() {

    if (!grounded)
        return;


    velocityY = 8;

    grounded = false;

}


/* =========================================================
   BOTÕES HUD
========================================================= */

document
    .getElementById("reloadBtn")
    .onclick = reload;


document
    .getElementById("weaponBtn")
    .onclick = nextWeapon;


/* =========================================================
   PAUSA
========================================================= */

function togglePause() {

    if (!gameRunning)
        return;


    paused = !paused;


    document
        .getElementById("pauseScreen")
        .classList.toggle(
            "hidden",
            !paused
        );

}


document
    .getElementById("continueBtn")
    .onclick = togglePause;


document
    .getElementById("exitBtn")
    .onclick = () => {

        location.reload();

    };


/* =========================================================
   FINAL
========================================================= */

function endGame(victory) {

    gameRunning = false;

    document
        .getElementById("endScreen")
        .classList.remove(
            "hidden"
        );


    document
        .getElementById("endTitle")
        .textContent =
        victory
            ? "VITÓRIA!"
            : "DERROTA";


    document
        .getElementById("endText")
        .textContent =
        victory
            ? "Você eliminou todos os adversários."
            : "Você foi eliminado.";


    document
        .getElementById("endIcon")
        .textContent =
        victory
            ? "🏆"
            : "💥";


    document
        .getElementById("finalKills")
        .textContent =
        kills;


    document
        .getElementById("finalTime")
        .textContent =
        formatTime(matchTime);

}


function formatTime(seconds) {

    const min =
        Math.floor(
            seconds / 60
        );

    const sec =
        Math.floor(
            seconds % 60
        );

    return (
        min +
        ":" +
        String(sec).padStart(
            2,
            "0"
        )
    );

}


/* =========================================================
   RESTART
========================================================= */

document
    .getElementById("restartBtn")
    .onclick = () => {

        document
            .getElementById("endScreen")
            .classList.add(
                "hidden"
            );

        if (renderer) {

            renderer.dispose();

        }

        startGame();

    };


document
    .getElementById("backLobbyBtn")
    .onclick = () => {

        location.reload();

    };


/* =========================================================
   CONTROLES MOBILE
========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );

const stick =
    document.getElementById(
        "stick"
    );

let joystickX = 0;
let joystickY = 0;

let joystickActive = false;


joystick.addEventListener(
    "touchstart",
    event => {

        joystickActive = true;

        event.preventDefault();

    },
    { passive: false }
);


joystick.addEventListener(
    "touchmove",
    event => {

        if (!joystickActive)
            return;


        const touch =
            event.touches[0];


        const rect =
            joystick.getBoundingClientRect();


        let x =
            touch.clientX -
            (rect.left +
                rect.width / 2);


        let y =
            touch.clientY -
            (rect.top +
                rect.height / 2);


        const max =
            45;


        const length =
            Math.sqrt(
                x * x +
                y * y
            );


        if (length > max) {

            x =
                x /
                length *
                max;

            y =
                y /
                length *
                max;

        }


        joystickX =
            x / max;

        joystickY =
            y / max;


        stick.style.transform =
            `translate(
                calc(-50% + ${x}px),
                calc(-50% + ${y}px)
            )`;


        event.preventDefault();

    },
    { passive: false }
);


joystick.addEventListener(
    "touchend",
    () => {

        joystickActive = false;

        joystickX = 0;
        joystickY = 0;

        stick.style.transform =
            "translate(-50%,-50%)";

    }
);


/* movimentação mobile */

function updateMobileMovement() {

    if (
        Math.abs(joystickX) < .05 &&
        Math.abs(joystickY) < .05
    )
        return;


    const speed = 5.5;

    const direction =
        new THREE.Vector3(
            joystickX,
            0,
            joystickY
        );


    direction.normalize();


    const cos =
        Math.cos(cameraYaw);

    const sin =
        Math.sin(cameraYaw);


    const dx =
        direction.x * cos -
        direction.z * sin;

    const dz =
        direction.x * sin +
        direction.z * cos;


    player.position.x +=
        dx *
        speed *
        clock.getDelta();


    player.position.z +=
        dz *
        speed *
        clock.getDelta();


    player.rotation.y =
        Math.atan2(
            dx,
            dz
        );

}


/* ================= BOTÕES ================= */

document
    .getElementById("fireButton")
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            isFiring = true;

        },
        { passive: false }
    );


document
    .getElementById("fireButton")
    .addEventListener(
        "touchend",
        () => {

            isFiring = false;

        }
    );


document
    .getElementById("jumpButton")
    .onclick = jump;


document
    .getElementById("reloadMobile")
    .onclick = reload;


document
    .getElementById("switchMobile")
    .onclick = nextWeapon;


document
    .getElementById("aimButton")
    .onclick = () => {

        isAiming =
            !isAiming;

        cameraDistance =
            isAiming
                ? 4
                : 7;

    };


/* =========================================================
   LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    if (!gameRunning)
        return;


    if (paused)
        return;


    const delta =
        Math.min(
            clock.getDelta(),
            .05
        );


    matchTime += delta;


    updatePlayer(delta);

    updateMobileMovement();

    updateEnemies(delta);

    updateLoot();

    updateZone(delta);

    updateCamera();

    updateMiniMap();


    if (mouseDown ||
        isFiring) {

        shoot();

    }


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (!camera ||
            !renderer)
            return;


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