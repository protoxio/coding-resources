
### This template should help get you started developing your own shaders for shader skins in Protox.io

## Requirements
- Node.js

## Usage

- Run `npm i`
- Run `npm start`
- Navigate to `http://localhost:5156/`

You can add your skins in the /public/shaders, the folder name is the shader name and the structure should look like in the example shader folder.

After you added your shader files, replace the `exampleShader` string with your shader name in the /src/main.ts file

## Uniforms

The game will provide the following uniforms to your shader

- uTime - used for time based animations
- uResolution - the screen resolution
- uChannel0 - utility texture needed for some shaders

If needed feel free to add your own uniforms, but we can't guarantee that they will be added into the game, contact us on discord, and we try figure something out to make your shader work 
