import GlobalScene from "./GlobalScene.js";

const scenes = [];

const carScene = new GlobalScene({
  idCanvas: "canvas-car",
  divCanvasCssSelector: "#div-canvas-car",
  gltfPersonnages: [
    { name: "car", gltf: "../../asset/gltf/car.gltf" }
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
    { name: "ring", gltf: "../../asset/gltf/bague.gltf" }
  ],
  colorLights: 0xffffff,
  isOrbitControls: true,
  cameraCoordonnees: { x: 1, y: 4, z: 3 },
  cameraCoordonneesMobile: { x: 0, y: 1, z: 3 }
});

function initAnimationButtons(globalScene) {
  document.addEventListener("click", (e) => {
    const button = e.target.closest(".buttons button");
    if (!button) return;

    const char = button.dataset.char;
    const action = button.dataset.animation;
    const perso = globalScene.personnages3D?.[char];

    if (!perso) {
      console.warn(`Aucun personnage trouvé pour : ${char}`);
      return;
    }

    switch (action) {
      case "essieuAction":
        const wasActive = perso.wheelsActive;
        perso.wheelsActive = !perso.wheelsActive;
        button.classList.toggle("active", perso.wheelsActive);

        // arret roues = feux stop
        if (wasActive && !perso.wheelsActive) {
          perso.activateStopLights();
        }
        break;


      case "leftClignoAction":
        perso.toggleCligno("left");
        button.classList.toggle("active", perso.clignoActive.left);
        break;

      case "rightClignoAction":
        perso.toggleCligno("right");
        button.classList.toggle("active", perso.clignoActive.right);
        break;

      case "headLightAction":
        perso.toggleHeadLights();
        button.classList.toggle("active", perso.headLightsOn);
        break;

      case "frontLightAction":
        perso.toggleFrontLights();
        button.classList.toggle("active", perso.frontLightsOn);
        break;

      default:
        console.warn(`Action inconnue : ${action}`);
    }
  });
}


initAnimationButtons(carScene);
