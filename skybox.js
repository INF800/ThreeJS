/**
 * Source: SimonDev (YouTube)
 * ==========================
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class BasicWorld {
    constructor() {
        this._init()
    }

    _setupRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            antialias: true, // smooth edges
        });

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._renderer.domElement);
    }

    _setupPerspectiveCamera(props) {
        this._camera = new THREE.PerspectiveCamera(props.fov, props.aspect, props.near, props.far);
        this._camera.position.set(props.positionX, props.positionY, props.positionY);
    }

    _setupDynamicWindowResize() {
        const _onWindowResize = () => {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', () => {
            _onWindowResize();
        }, false);
    }

    _setupScene() {
        this._scene = new THREE.Scene();
    }

    _setupAmbientLight() {
        this._scene.add(new THREE.AmbientLight(0x101010));
    }

    _setupDirectionalLight() {
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);
    }

    _setupLights() {
        this._setupAmbientLight()
        this._setupDirectionalLight()
    }

    _setupBGTexture() {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './assets/skybox-terrain/posx.jpeg',
            './assets/skybox-terrain/negx.jpeg',
            './assets/skybox-terrain/posy.jpeg',
            './assets/skybox-terrain/negy.jpeg',
            './assets/skybox-terrain/posz.jpeg',
            './assets/skybox-terrain/negz.jpeg',
        ]);
        this._scene.background = texture;
    }

    _setupPlane() {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
    }

    _addSphereToScene() {
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(2, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                wireframe: true,
                wireframeLinewidth: 4,
            }));
        sphere.position.set(0, 0, 0);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this._scene.add(sphere);
    }

    _addBoxesToScene() {
        const addBoxAt = (x, y, z) => {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.MeshStandardMaterial({
                    color: 0x808080,
                }));
            box.position.set(x, y, z);
            box.castShadow = true;
            box.receiveShadow = true;
            this._scene.add(box);
        }

        for (let x = -8; x < 8; x += 3) {
            for (let y = -8; y < 8; y++) {
                addBoxAt(
                    Math.random() + x * 5,
                    Math.random() * 4.0 + 2.0,
                    Math.random() + y * 5
                )
            }
        }
    }

    // animation frame loop
    _RAF() {
        requestAnimationFrame(() => {
            this._renderer.render(this._scene, this._camera);
            this._RAF();
        });
    }

    _init() {
        // setup basic world
        this._setupRenderer()
        this._setupPerspectiveCamera({
            positionX: 75, positionY: 20, positionZ: 0,
            fov: 60, aspect: (1920 / 1080), near: 1.0, far: 1000.0
        })
        this._setupDynamicWindowResize()
        this._setupScene()
        this._setupLights()
        this._setupBGTexture()
        this._setupPlane()

        // add objects. note that some above setups are 
        // also "added" to scene but their position
        // remains more or less constant (as in real world)
        this._addSphereToScene()
        this._addBoxesToScene()


        // setup camera control
        // donesn't need to be in loop
        const controls = new OrbitControls(this._camera, this._renderer.domElement);
        controls.target.set(0, 20, 0);
        controls.update();

        // start the loop
        this._RAF()
    }
}


let _APP;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new BasicWorld();
});