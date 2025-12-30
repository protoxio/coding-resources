## Protox.io Shader Development Template

This template will help you get started developing your own shaders for shader skins for **Protox.io**.

## Requirements
- Node.js

## Usage

1. Run `npm install`
2. Run `npm start`
3. Navigate to `http://localhost:5156/`

You can add your shaders to **/public/shaders**. The folder name must match your shaders name, and the file structure should mirror the `exampleShader` folder.

After adding your shader files, replace the `exampleShader` string with your own shader name in **/src/main.ts**.

## Uniforms

The game provides the following uniforms to your shader:

- `uTime`: used for time based animations
- `uResolution`: the screen resolution
- `uChannel0`: utility texture needed for some shaders

Feel free to add your own uniforms, but be aware that **we cannot guarantee they will be added to the game**. Contact us on Discord, and we can try to figure out a solution to make your shader work.

If your shader requires a texture by default, and you don't want to import it everytime, you can simply name it uTexture0.png and put it into the folder of your shader for it to be loaded automatically
