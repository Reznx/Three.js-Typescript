import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import Stats from "/jsm/libs/stats.module";
import { GUI } from "/jsm/libs/dat.gui.module";
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
const sphereGeometry = new THREE.SphereGeometry(1, 42, 42);
const circleGeometry = new THREE.CylinderGeometry(2, 2, 0.01, 32);
const material = new THREE.MeshStandardMaterial();
const lambertMaterial = new THREE.MeshLambertMaterial();
const loader = new THREE.TextureLoader();
const texture = loader.load("img/skybox.jpg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt;
});
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
scene.add(sphere);
const circle = new THREE.Mesh(circleGeometry, lambertMaterial);
sphere.position.x = 0;
circle.rotation.x = Math.PI / 180;
scene.add(circle);
camera.position.z = 5;
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
const stats = Stats();
document.body.appendChild(stats.dom);
var options = {
    side: {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
    },
};
const gui = new GUI();
var data = {
    lightColor: light.color.getHex(),
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
};
const lightFolder = gui.addFolder("THREE.Light");
lightFolder.addColor(data, "lightColor").onChange(() => {
    light.color.setHex(Number(data.lightColor.toString().replace("#", "0x")));
});
lightFolder.add(light, "intensity", 0, 4);
const materialFolder = gui.addFolder("THREE.lambertMaterial");
materialFolder.addColor(data, "color").onChange(() => {
    lambertMaterial.color.setHex(Number(data.color.toString().replace("#", "0x")));
});
materialFolder.addColor(data, "emissive").onChange(() => {
    lambertMaterial.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")));
});
materialFolder.add(lambertMaterial, "transparent");
materialFolder.add(lambertMaterial, "opacity", 0, 1, 0.01);
materialFolder.add(lambertMaterial, "depthTest");
materialFolder.add(lambertMaterial, "depthWrite");
materialFolder
    .add(lambertMaterial, "alphaTest", 0, 1, 0.01)
    .onChange(() => updateMaterial());
materialFolder.add(lambertMaterial, "visible");
materialFolder.add(lambertMaterial, "reflectivity", 0, 1, 0.1);
materialFolder.add(lambertMaterial, 'refractionRatio', 0, 1);
materialFolder
    .add(lambertMaterial, "side", options.side)
    .onChange(() => updateMaterial());
materialFolder.open();
function updateMaterial() {
    lambertMaterial.side = Number(lambertMaterial.side);
    lambertMaterial.combine = Number(lambertMaterial.combine);
    lambertMaterial.needsUpdate = true;
}
var animate = function () {
    requestAnimationFrame(animate);
    circle.rotation.y += 0.005;
    render();
    stats.update();
};
function render() {
    renderer.render(scene, camera);
}
animate();
