import GlobalScene from "./GlobalScene.js";

const scenes = [];

const carScene = new GlobalScene({
    idCanvas: "canvas-car",
    divCanvasCssSelector: "#div-canvas-car",
    gltfPersonnages: [
        { name: "car", gltf: "../asset/gltf/car.gltf", initAnimation: "idle" }
    ],
    colorLights: 0xffffff,
    isOrbitControls: true,
    cameraCoordonnees: { x: -30, y: 30, z: 50 },
    cameraCoordonneesMobile: { x: 0, y: 1, z: 3 }
});

const ringScene = new GlobalScene({
    idCanvas: "canvas-ring",
    divCanvasCssSelector: "#div-canvas-ring",
    gltfPersonnages: [
        { name: "ring", gltf: "../asset/gltf/bague.gltf", initAnimation: "Idle" }
    ],
    colorLights: 0xffffff,
    isOrbitControls: true,
    cameraCoordonnees: { x: 1, y: 4, z: 3 },
    cameraCoordonneesMobile: { x: 0, y: 1, z: 3 }
});

scenes.push(carScene, ringScene);
window.globalScenes = scenes;

function attachAnimationButtons() {
    document.querySelectorAll(".buttons button").forEach(btn => {
        btn.addEventListener("click", () => {
            const char = btn.dataset.char;
            const anim = btn.dataset.animation;

            let targetScene;
            if (char === "car") {
                targetScene = carScene.personnages3D["car"];
            } else if (char === "ring") {
                targetScene = ringScene.personnages3D["ring"];
            }

            if (targetScene) {
                targetScene.playAnimation(anim);
            }
        });
    });
}

setTimeout(attachAnimationButtons, 2000);
