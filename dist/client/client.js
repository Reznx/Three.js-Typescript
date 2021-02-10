import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import { EffectComposer } from "/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "/jsm/postprocessing/ShaderPass";
import { RenderPass } from "/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "/jsm/postprocessing/UnrealBloomPass";
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
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
// strength, kernelSize, sigma, res
//
// resolution, strength, radius, threshold
const effectBloom = new UnrealBloomPass(128, 0.8, 2.0, 0.0);
const effectCopy = new ShaderPass(THREE.CopyShader);
effectCopy.renderToScreen = true;
composer.addPass(renderPass);
composer.addPass(effectBloom);
composer.addPass(effectCopy);
const controls = new OrbitControls(camera, renderer.domElement);
const uniforms = {
    time: { type: "f", value: 0.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
    accretion_disk: { type: "b", value: false },
    use_disk_texture: { type: "b", value: true },
    lorentz_transform: { type: "b", value: false },
    doppler_shift: { type: "b", value: false },
    beaming: { type: "b", value: false },
    cam_pos: { type: "v3", value: new THREE.Vector3() },
    cam_vel: { type: "v3", value: new THREE.Vector3() },
    cam_dir: { type: "v3", value: new THREE.Vector3() },
    cam_up: { type: "v3", value: new THREE.Vector3() },
    fov: { type: "f", value: 0.0 },
    bg_texture: { type: "t", value: null },
    star_texture: { type: "t", value: null },
    disk_texture: { type: "t", value: null },
};
const loader = new THREE.FileLoader();
const textureLoader = new THREE.TextureLoader();
const textures = [];
window.onbeforeunload = () => {
    for (let i = 0; i < textures.length; i++)
        textures[i].dispose();
};
const loadTexture = (name, image, interpolation, wrap = THREE.ClampToEdgeWrapping) => {
    textures[name] = null;
    textureLoader.load(image, (texture) => {
        texture.magFilter = interpolation;
        texture.minFilter = interpolation;
        texture.wrapT = wrap;
        texture.wrapS = wrap;
        textures[name] = texture;
    });
};
loadTexture("bg1", "https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fmilkyway.jpg?1545745139132", THREE.NearestFilter);
loadTexture("star", "https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fstars.png?1545722529872", THREE.LinearFilter);
loadTexture("disk", "https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2FdQ.png?1545846159297", THREE.LinearFilter);
const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
});
loader.load("0_main_tracer.glsl", (data) => {
    let defines = `#define STEP 0.05
#define NSTEPS 600
`;
    material.fragmentShader = defines + data;
    material.needsUpdate = true;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
});
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
const stats = Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
var animate = function () {
    requestAnimationFrame(animate);
    render();
    stats.update();
};
function render() {
    renderer.render(scene, camera);
}
animate();
