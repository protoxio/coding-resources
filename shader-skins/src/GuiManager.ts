import {Weapon} from "./Weapons";

export default class GuiManager {

    elements: { [id: string]: HTMLElement | undefined } = {
        weaponSelector: undefined,
        textureDropZone: undefined,
        textureInput: undefined,
    }

    constructor(
        onModelChange: (weapon: string) => Promise<void>,
        onTextureChange: (texture: string) => void,
    ) {

        for (let elementId in this.elements) {
            this.elements[elementId] = document.getElementById(elementId);
        }

        const weaponSelector = this.elements.weaponSelector as HTMLSelectElement;

        for (let weaponId in Weapon) {
            if (!isNaN(Number.parseInt(weaponId))) continue;

            const listElement = document.createElement("option");
            listElement.innerText = listElement.value = weaponId;
            weaponSelector.appendChild(listElement);
        }

        const lastUsedWeapon = localStorage.getItem("lastUsedWeapon");
        if (lastUsedWeapon && lastUsedWeapon in Weapon) weaponSelector.value = lastUsedWeapon;

        const onChangeCallback = async () => {
            const value = weaponSelector.value;
            await onModelChange(value);
            localStorage.setItem("lastUsedWeapon", value);
        };

        weaponSelector.addEventListener("change", onChangeCallback);
        onChangeCallback();

        const textureDropZone = this.elements.textureDropZone as HTMLDivElement;
        const textureInput = this.elements.textureInput as HTMLInputElement;

        // prevent the window from catching the drop instead of the drop zone
        window.addEventListener("drop", (event) => {
            if ([...event.dataTransfer.items].some((item) => item.kind === "file")) {
                event.preventDefault();
            }
        });

        window.addEventListener("dragover", (event) => {
            if (Array.from(event.dataTransfer.items).some((item) => item.kind === "file")) {
                event.preventDefault();
                if (!textureDropZone.contains(event.target as Node)) {
                    event.dataTransfer.dropEffect = "none";
                }
            }
        });

        textureDropZone.addEventListener("dragover", (event) => {
            const items = Array.from(event.dataTransfer.items);
            if (items.some((item) => item.kind === "file")) {
                event.preventDefault();
                event.dataTransfer.dropEffect = items.some((item) => item.type.startsWith("image/")) ? "copy" : "none";
            }
        })

        const fileCallback = (file: File) => {
            const url = URL.createObjectURL(file);
            textureDropZone.style.backgroundImage = `url(${url})`;
            textureDropZone.classList.add("has-image");
            onTextureChange(url);
        };

        textureDropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            const file = Array.from(event.dataTransfer.items).find((item) => item.kind === "file" && item.type.startsWith("image/")).getAsFile();
            fileCallback(file);
        });

        textureInput.addEventListener("change", () => {
            if (textureInput.files[0] && textureInput.files[0].type.startsWith("image/")) {
                fileCallback(textureInput.files[0]);
            }
        })
    }


}
