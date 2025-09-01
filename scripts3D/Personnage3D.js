import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { degToRad } from "./utile.js";

export default class Personnage3D {
    constructor({ globalScene, name, gltfPath, cubeTexture, coordonnees = { x: 0, y: 0, z: 0 }, coordonneesMobile = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 } }) {
        this.globalScene = globalScene;
        this.name = name;
        this.coordonnees = coordonnees;
        this.coordonneesMobile = coordonneesMobile;
        this.rotation = rotation;

        this.animationsAction = {};
        this.initAnimation = null;

        this.clock = new THREE.Clock();

        this.clignoActive = { left: false, right: false };
        this.clignoInterval = null;
        this.leftClignos = [];
        this.rightClignos = [];

        this.wheels = [];
        this.frontLightsOn = false;
        this.headLightsOn = false;

        this.importGLTF(gltfPath, cubeTexture);

        this.animate();
    }

    importGLTF(gltfPath, cubeTexture) {
        const loader = new GLTFLoader();

        loader.load(gltfPath, (gltf) => {
            this.gltf = gltf;

            this.globalScene.objectsLoaded++;
            this.globalScene.scene.add(gltf.scene);

            this.updateTextureSceneGltf(gltf.scene, cubeTexture);

            if (window.innerWidth < this.globalScene.sizeMobile) {
                this.setPositionMobileVersion();
            } else {
                this.setPositionLaptopVersion();
            }

            gltf.scene.rotation.y = degToRad(this.rotation.y);

            this.wheels = [];
            const essieuAV = gltf.scene.getObjectByName("essieu_AV");
            const essieuAR = gltf.scene.getObjectByName("essieu_AR");
            [essieuAV, essieuAR].forEach(essieu => {
                essieu.traverse(child => {
                    if (child.isMesh && child.name.toLowerCase().includes("wheel")) {
                        this.wheels.push(child);
                        console.log("Roue détectée :", child.name);
                    }
                });


            });

            this.leftClignos = this.getMeshesByName(gltf.scene, ["indicatorleft", "indicatorLeft"]);
            this.rightClignos = this.getMeshesByName(gltf.scene, ["indicatorright", "indicatorRight"]);

            this.headLights = this.getMeshesByName(gltf.scene, ["headlight", "headLight"]);
            this.frontLights = this.getMeshesByName(gltf.scene, ["frontlight", "frontLight"]);
            this.stopLights = this.getMeshesByName(gltf.scene, ["stoplight", "stopLight"]);

            this.globalScene.onceGltfAreLoaded();
        });
    }

    setPositionMobileVersion() {
        this.gltf.scene.position.set(
            this.coordonneesMobile.x,
            this.coordonneesMobile.y,
            this.coordonneesMobile.z
        );
    }

    setPositionLaptopVersion() {
        this.gltf.scene.position.set(
            this.coordonnees.x,
            this.coordonnees.y,
            this.coordonnees.z
        );
    }

    updateTextureSceneGltf(sceneGltf, cubeTexture) {
        sceneGltf.traverse((node) => {
            if (!node.isMesh) return;

            node.material.envMap = cubeTexture;
            node.material.envMapIntensity = 0.8;

            const lname = node.name.toLowerCase();


            // HEADLIGHT
            if (lname.includes("headlight") || lname.includes("headLight")) {
                node.material = new THREE.MeshStandardMaterial({
                    color: 0xE7E3E6FF,
                    emissive: 0x000000,
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0.0,
                    roughness: 0.0,
                    envMapIntensity: 1.0
                });

            }

            // FRONTLIGHT
            if (lname.includes("frontlight") || lname.includes("frontLight")) {
                node.material = new THREE.MeshStandardMaterial({
                    color: 0xE7E3E6FF,
                    emissive: 0x000000,
                    emissiveIntensity: 2,
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0.0,
                    roughness: 0.0,
                    envMapIntensity: 1.0
                });
            }

            // STOPLIGHT
            if (lname.includes("stoplight")) {
                node.material = new THREE.MeshStandardMaterial({
                    color: 0xaa0000,
                    emissive: 0x000000,
                    emissiveIntensity: 2,
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0.0,
                    roughness: 0.0,
                    envMapIntensity: 1.0
                });
            }

            // CLIGNO
            if (lname.includes("indicatorleft") || lname.includes("indicatorLeft") ||
                lname.includes("indicatorright") || lname.includes("indicatorRight")) {
                node.material = new THREE.MeshStandardMaterial({
                    color: 0xffa500,
                    emissive: 0x000000,
                    emissiveIntensity: 2,
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0.0,
                    roughness: 0.0,
                    envMapIntensity: 1.0
                });
            }
        });
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        if (this.wheelsActive && this.wheels && this.wheels.length > 0) {
            this.animateWheels(0.1);
        }

    }

    // -------------------
    // ROUES
    // -------------------


    animateWheels(speed = 0.1) {
        if (!this.wheels) return;
        this.wheels.forEach((wheel) => {
            wheel.rotation.z -= speed;
        });
    }

    // -------------------
    // CLIGNOTANTS
    // -------------------
    getMeshesByName(root, namePatterns) {
        const meshes = [];
        root.traverse((node) => {
            if (node.isMesh) {
                const lname = node.name.toLowerCase();
                if (namePatterns.some((pat) => lname.includes(pat))) {
                    meshes.push(node);
                }
            }
        });
        return meshes;
    }

    toggleCligno(side = "left") {
        const meshes = side === "left" ? this.leftClignos : this.rightClignos;
        if (!meshes.length) return;

        if (this.clignoActive[side]) {
            this.stopClignoBlink();
            return;
        }

        this.stopClignoBlink();

        this.clignoActive[side] = true;
        this.clignoInterval = setInterval(() => {
            meshes.forEach(mesh => {
                const isOn = mesh.material.emissiveIntensity > 0;
                mesh.material.emissive.set(isOn ? 0x000000 : 0xffa500);
                mesh.material.emissiveIntensity = isOn ? 0 : 2;
            });
        }, 500);
    }


    stopClignoBlink() {
        if (this.clignoInterval) {
            clearInterval(this.clignoInterval);
            this.clignoInterval = null;
        }
        this.clignoActive.left = false;
        this.clignoActive.right = false;

        [...this.leftClignos, ...this.rightClignos].forEach(mesh => {
            mesh.material.emissive.set(0x000000);
            mesh.material.emissiveIntensity = 0;
        });
    }


    // -------------------
    // FEUX AVANT
    // -------------------
    toggleFrontLights() {
        this.frontLightsOn = !this.frontLightsOn;

        this.frontLights.forEach(light => {
            light.material.emissive.set(this.frontLightsOn ? 0xffffff : 0x000000);
            light.material.emissiveIntensity = this.frontLightsOn ? 2 : 0;
        });

        console.log("Phares :", this.frontLightsOn ? "ON" : "OFF");
    }

    // -------------------
    // FEUX AVANT pleins phare
    // -------------------
    toggleHeadLights() {
        this.headLightsOn = !this.headLightsOn;

        this.headLights.forEach(light => {
            light.material.emissive.set(this.headLightsOn ? 0xffffff : 0x000000);
            light.material.emissiveIntensity = this.headLightsOn ? 2 : 0;
        });

        console.log("Phares pleins :", this.headLightsOn ? "ON" : "OFF");
    }

    // -------------------
    // STOPLIGHT
    // -------------------
    activateStopLights(duration = 1000) {
        if (!this.stopLights || this.stopLights.length === 0) return;

        this.stopLights.forEach(light => {
            light.material.emissive.set(0xff0000);
            light.material.emissiveIntensity = 2;
        });

        setTimeout(() => {
            this.stopLights.forEach(light => {
                light.material.emissive.set(0x000000);
                light.material.emissiveIntensity = 0;
            });
        }, duration);
    }


}
