
import * as THREE from "three";
import { AnimationAction } from "three";
import { GLTFLoader } from "GLTFLoader";
import { degToRad } from "./utile.js";

export default class Personnage3D {
    constructor({ globalScene, name, gltfPath, cubeTexture, coordonnees = { x: 0, y: 0, z: 0 }, coordonneesMobile = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, initAnimation}) {
        this.globalScene = globalScene;
        this.name = name;
        this.coordonnees = coordonnees;
        this.coordonneesMobile = coordonneesMobile;
        this.rotation = rotation;

        this.animationsAction = {};
        this.initAnimation = initAnimation;

        this.clock = new THREE.Clock();

        this.importGLTF(gltfPath, cubeTexture);
        this.animate();
    }

    importGLTF(gltfPath, cubeTexture) {
        const loader = new GLTFLoader();

        loader.load(gltfPath, (gltf) => {
            console.log(gltf);
            this.globalScene.objectsLoaded++;
            this.globalScene.scene.add(gltf.scene);
            this.updateTextureSceneGltf(gltf.scene, cubeTexture);

            this.gltf = gltf;

            if (window.innerWidth < this.globalScene.sizeMobile) {
                this.setPositionMobileVersion();
            } else {
                this.setPositionLaptopVersion();
            }

            gltf.scene.rotation.y = degToRad(this.rotation.y);
            this.setAnimations(gltf.animations, gltf.scene);
            this.globalScene.onceGltfAreLoaded();
        })
    }


    setPositionMobileVersion() {
        this.gltf.scene.position.x = this.coordonneesMobile.x;
        this.gltf.scene.position.y = this.coordonneesMobile.y;
        this.gltf.scene.position.z = this.coordonneesMobile.z;
    }

    setPositionLaptopVersion() {
        this.gltf.scene.position.x = this.coordonnees.x;
        this.gltf.scene.position.y = this.coordonnees.y;
        this.gltf.scene.position.z = this.coordonnees.z;
    }

    updateTextureSceneGltf(sceneGltf, cubeTexture) {
        sceneGltf.traverse((node) => {
            if (node.isMesh) {
                node.material.envMap = cubeTexture;
                node.material.envMapIntensity = 0.8;
            }
        });
    }


    setAnimations(animationsGltf, sceneGltf) {
        this.mixer = new THREE.AnimationMixer(sceneGltf);

        for (let animationClip of animationsGltf) {
            this.animationsAction[animationClip.name] = this.mixer.clipAction(animationClip);
            this.animationsAction[animationClip.name].clampWhenFinished = true;
        }

        this.currentAction = this.animationsAction[this.initAnimation];
        this.animationsAction[this.initAnimation].play();

    }



  

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
    }


    async playAnimation(animationName) {
    if (!this.animationsAction[animationName]) {
        console.warn(`⚠️ Animation introuvable : ${animationName}`);
        return;
    }

    // stop anim avant jouer nouvelle
    Object.values(this.animationsAction).forEach(action => action.stop());

    const action = this.animationsAction[animationName];
    action.reset();
    action.play();

    // attend fin
    return new Promise((resolve) => {
        this.mixer.addEventListener("finished", () => resolve());
    });
}

async lancerAttaquePersonnage(attaque) {
    this.personnage.desactiverTousLesBoutons();

    const lancerEnnemiAttaque =
        await this.personnage.attaquerPersonnage(attaque.animationName, attaque);

    if (lancerEnnemiAttaque) {
        this.apresAttaquePersonnage();
    }
}

}
