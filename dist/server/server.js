"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, "../client")));
        app.use("/build/three.module.js", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/build/three.module.js")));
        app.use("/jsm/controls/OrbitControls", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/controls/OrbitControls.js")));
        app.use("/jsm/libs/stats.module", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/libs/stats.module.js")));
        app.use("/jsm/libs/dat.gui.module", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/libs/dat.gui.module.js")));
        app.use("/jsm/postprocessing/EffectComposer", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/js/postprocessing/EffectComposer.js")));
        app.use("/jsm/postprocessing/ShaderPass", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/js/postprocessing/ShaderPass.js")));
        app.use("/jsm/postprocessing/RenderPass", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/js/postprocessing/RenderPass.js")));
        app.use("/jsm/postprocessing/UnrealBloomPass", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/js/postprocessing/UnrealBloomPass.js")));
        this.server = new http_1.default.Server(app);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on Port ${this.port}.`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map