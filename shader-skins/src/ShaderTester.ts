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

export default class ShaderTester {

    shaderName: string;

    canvas: HTMLCanvasElement;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    scene: Scene;

    fileLoader: FileLoader;
    glbLoader: GLTFLoader;

    mesh: Mesh | SkinnedMesh;

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

        this.glbLoader.load("/models/mac10.glb", async (data) => {
            const model = data.scene.children[0].children[0];

            this.mesh = model as SkinnedMesh;
            await this.createMaterial();

            this.mesh.rotateY(-Math.PI * 0.5);
            this.mesh.scale.setScalar(0.4);

            this.scene.add(this.mesh);
        });


        this.lastTime = performance.now();
        this.deltaTime = 0;

        this.animate();
    }

    animate = () => {

        window.requestAnimationFrame(this.animate);

        const now = performance.now();
        this.deltaTime = 1 / (now - this.lastTime);
        this.lastTime = now;


        this.renderer.render(this.scene, this.camera);

    }

    async createMaterial() {

        const vertexShader = await this.fileLoader.loadAsync(`./shaders/${this.shaderName}/vertex.vert`) as string;
        const fragmentShader = await this.fileLoader.loadAsync(`./shaders/${this.shaderName}/fragment.frag`) as string;

        const uniforms = {
            uTime: {value: 0},
            uResolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
            uChannel0: {value: new Texture()},
        };

        const shaderMaterial = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.mesh.onBeforeRender = () => {
            uniforms.uTime.value += 0.01 * this.deltaTime;
        }

        this.mesh.material = shaderMaterial;

    }

}
