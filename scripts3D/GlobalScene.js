
import * as THREE from "three";
import Loader from "./Loader.js";
import { OrbitControls } from "OrbitControls";
import Personnage3D from "./Personnage3D.js";


export default class GlobalScene {
    constructor({ jeu, idCanvas, divCanvasCssSelector, gltfPersonnages, colorLights, isOrbitControls, cameraCoordonnees, cameraCoordonneesMobile } = {}) {
        this.jeu = jeu;
        this.divCanvas = document.querySelector(divCanvasCssSelector);
        this.gltfPersonnages = gltfPersonnages;
        this.personnages3D = {};
        this.cameraCoordonnees = cameraCoordonnees;
        this.cameraCoordonneesMobile = cameraCoordonneesMobile;

        this.sizeMobile = 1200;

        this.createScene();
        this.createCamera();
        this.createRenderer(idCanvas);
        if (isOrbitControls) {
            this.createControls();
            this.addCursorGrabbingOnClick();
        }
        this.loadAsyncResources(divCanvasCssSelector);
        this.createLights(colorLights);
        this.addEventOnResize();
    }


    async loadAsyncResources(divCanvasCssSelector) {
        this.loader = new Loader(divCanvasCssSelector);
        this.loader.add();

        const texture = await this.createCubeTexture();

        this.scene.environment = texture;

        this.renderer.toneMappingExposure = 0.2;

        this.createObjects(texture);


        const interval = setInterval(() => {
            if (this.objectsLoaded === this.gltfPersonnages.length) {
                clearInterval(interval);
                this.loader.remove();
                this.animate();
            }
        }, 100);
    }


    createScene() {
        this.scene = new THREE.Scene();
    }

    createRenderer(idCanvas) {
        const canvas = document.getElementById(idCanvas);
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas, alpha: true, antialias: true
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        //this.renderer.encoding = THREE.sRGBEncoding;
        this.setSizeRenderer();
    }

    setSizeRenderer() {
        this.renderer.setSize(this.divCanvas.clientWidth, this.divCanvas.clientHeight);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(50, this.getRatio(), 0.1, 1000);
        if (window.innerWidth < 1200) {
            this.setCameraPositionMobile();
        } else {
            this.setCameraPosition();
        }
    }

    setCameraPositionMobile() {
        this.camera.position.z = this.cameraCoordonneesMobile.z;
        this.camera.position.y = this.cameraCoordonneesMobile.y;
        this.camera.position.x = this.cameraCoordonneesMobile.x;
    }

    setCameraPosition() {
        this.camera.position.z = this.cameraCoordonnees.z;
        this.camera.position.y = this.cameraCoordonnees.y;
        this.camera.position.x = this.cameraCoordonnees.x;
    }


    getRatio() {
        return this.divCanvas.clientWidth / this.divCanvas.clientHeight;
    }

    createControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableZoom = false;
        controls.target.set(0, 2.5, 0);
        controls.update();
    }

    createCubeTexture() {
        return new Promise((resolve) => {
            const cubeTextureLoader = new THREE.CubeTextureLoader();
            cubeTextureLoader.setPath("../../asset/hdri/")
                .load([
                    'px.png',
                    'nx.png',
                    'py.png',
                    'ny.png',
                    'pz.png',
                    'nz.png'
                ], (texture) => {
                    resolve(texture);
                });
        });
    }

    createLights(colorLights) {
        this.isDay = true;

        // jour
        this.sunLight = new THREE.DirectionalLight(colorLights, 7);
        this.sunLight.position.set(0, 50, 0);
        this.sunLight.castShadow = true;

        //const helper = new THREE.DirectionalLightHelper(this.sunLight, 5, 0xffcc00);
        //this.scene.add(helper);

        // nuit
        this.nightLight = new THREE.PointLight(0x000000, 0.02, 200);
        this.nightLight.position.set(0, 50, 0);

        //const nightHelper = new THREE.PointLightHelper(this.nightLight, 1);
        //this.scene.add(nightHelper);

        this.scene.add(this.sunLight);

        const isDark = document.body.classList.contains('dark-mode');
        this.applyThemeModeToScene(isDark);
    }

    setEnvMapIntensity(intensity) {
        this.scene.traverse((node) => {
            if (node.isMesh && node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach((mat) => {
                        if (mat.envMap) {
                            mat.envMapIntensity = intensity;
                            mat.needsUpdate = true;
                        }
                    });
                } else {
                    if (node.material.envMap) {
                        node.material.envMapIntensity = intensity;
                        node.material.needsUpdate = true;
                    }
                }
            }
        });
    }

    applyThemeModeToScene(isDark) {
        if (isDark) {
            if (this.sunLight) this.scene.remove(this.sunLight);
            if (this.nightLight) this.scene.add(this.nightLight);

            this.renderer.toneMappingExposure = 0.01;
            this.isDay = false;

            this.setEnvMapIntensity(0.01);
        } else {
            if (this.nightLight) this.scene.remove(this.nightLight);
            if (this.sunLight) this.scene.add(this.sunLight);

            this.renderer.toneMappingExposure = 0.8;
            this.isDay = true;

            this.setEnvMapIntensity(1);
        }
    }



    createObjects(texture) {
        this.objectsLoaded = 0;

        for (let personnage of this.gltfPersonnages) {
            this.personnages3D[personnage.name] = new Personnage3D({
                globalScene: this,
                name: personnage.name,
                gltfPath: personnage.gltf,
                cubeTexture: texture,
                coordonnees: personnage.coordonnees,
                coordonneesMobile: personnage.coordonneesMobile,
                rotation: personnage.rotation,
                initAnimation: personnage.initAnimation
            });

        }
    }


    onceGltfAreLoaded() {
        if (this.gltfPersonnages.length === this.objectsLoaded) {
            this.loader.remove();
        }
    }


    setPositionPersonnage() {
        for (let personnage of this.personnages3D) {
            if (window.innerWidth < this.sizeMobile) {
                personnage.setCameraPositionMobileVersion();
            } else {
                personnage.setCameraPositionLaptopVersion();
            }
        }
    }


    onResize(event) {
        this.setSizeRenderer();
        this.camera.aspect = this.getRatio();
        this.camera.updateProjectionMatrix();
        if (event.target.innerWidth < this.sizeMobile) {
            this.setCameraPositionMobile();
        } else {
            this.setCameraPosition();
        }
        this.setPositionPersonnage();
    }

    addEventOnResize() {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    addCursorGrabbingOnClick() {
        this.renderer.domElement.addEventListener("pointerdown", (event) => {
            event.target.style.cursor = "grabbing";
        }
        );

        this.renderer.domElement.addEventListener("pointerup", (event) => {
            event.target.style.cursor = "grab";
        }
        );
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }



}