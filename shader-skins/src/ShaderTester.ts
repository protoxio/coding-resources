import {
    FileLoader,
    Mesh,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    SkinnedMesh,
    SRGBColorSpace,
    Texture,
    Vector2,
    WebGLRenderer
} from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Weapon} from "./Weapons";
import GuiManager from "./GuiManager";

export default class ShaderTester {

    shaderName: string;

    canvas: HTMLCanvasElement;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    scene: Scene;

    guiManager: GuiManager;

    fileLoader: FileLoader;
    glbLoader: GLTFLoader;

    mesh: Mesh | SkinnedMesh | undefined; // the weapon models are a SkinnedMesh, because they are rigged for animations

    lastTime: number;
    deltaTime: number;


    constructor(shaderName: string) {

        this.shaderName = shaderName;

        this.canvas = document.getElementById("threeCanvas") as HTMLCanvasElement;

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            powerPreference: "high-performance",
            precision: "lowp",
            alpha: false,
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.renderer.setPixelRatio(window.devicePixelRatio);


        this.camera = new PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = -10;

        this.scene = new Scene();
        this.scene.add(this.camera);

        new OrbitControls(this.camera, this.canvas);


        const resize = () => {
            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";

            this.renderer.setSize(window.innerWidth, window.innerHeight, false);

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };

        window.onresize = resize;
        resize();

        this.fileLoader = new FileLoader();
        this.glbLoader = new GLTFLoader();

        // this.mesh = new Mesh(new PlaneGeometry(4.5, 4.5));
        // this.mesh = new Mesh(new DodecahedronGeometry(1, 1));
        // this.mesh = new Mesh(new BoxGeometry(2, 2, 2));

        this.guiManager = new GuiManager(async (weapon: string) => {
            this.loadModel(weapon).catch(console.error);
        });


        this.lastTime = performance.now();
        this.deltaTime = 0;

        this.animate();
    }

    animate = () => {

        window.requestAnimationFrame(this.animate);

        const now = performance.now();
        this.deltaTime = (now - this.lastTime) * 0.001; // deltaTime in seconds
        this.lastTime = now;

        this.renderer.render(this.scene, this.camera);

    }

    async createMaterial() {

        const vertexShader = await this.fileLoader.loadAsync(`./shaders/${this.shaderName}/vertex.vert`) as string;
        const fragmentShader = await this.fileLoader.loadAsync(`./shaders/${this.shaderName}/fragment.frag`) as string;

        const uniforms = {
            uTime: {value: 1}, // start with 1 to avoid potential divisions by 0
            uResolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
            uChannel0: {value: new Texture()},
        };

        const shaderMaterial = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.mesh.onBeforeRender = () => {
            // do not adjust this multiplier and scale the time in the shader instead
            uniforms.uTime.value += 1.2 * this.deltaTime;
        }

        this.mesh.material = shaderMaterial;

    }

    async loadModel(name: string) {

        this.glbLoader.load(`/models/${name}.glb`, async (glb) => {

            const model = glb.scene.children[0];
            const skinnedMesh = (model.children[0] ? model.children[0] : model) as SkinnedMesh;

            //cleanup of previous model
            if (this.mesh) {
                this.mesh.geometry.dispose();
                if (Array.isArray(this.mesh.material)) {
                    this.mesh.material.forEach(m => m.dispose());
                } else {
                    this.mesh.material.dispose();
                }
                this.scene.remove(this.mesh);
            }

            this.mesh = skinnedMesh;
            await this.createMaterial();

            this.mesh.rotateY(-Math.PI * 0.5);
            this.mesh.scale.setScalar(0.4);

            this.scene.add(this.mesh);
        });

    }

}
