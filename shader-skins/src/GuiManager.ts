import {Weapon} from "./Weapons";

export default class GuiManager {

    elements: { [id: string]: HTMLElement | undefined } = {
        weaponSelector: undefined,
    }

    constructor(onModelChange: (weapon: string) => Promise<void>) {

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
        if(lastUsedWeapon && lastUsedWeapon in Weapon) weaponSelector.value = lastUsedWeapon;

        const onChangeCallback = async () => {
            const value = weaponSelector.value;
            await onModelChange(value);
            localStorage.setItem("lastUsedWeapon", value);
        };

        weaponSelector.onchange = onChangeCallback;
        onChangeCallback();

    }


}
