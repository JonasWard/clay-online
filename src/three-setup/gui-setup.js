import {GUI} from "three/examples/jsm/libs/dat.gui.module";
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter";
import {
    addBrick,
    clearScene,
    OVERWRITE_SETTINGS,
    overwrites,
    updateEasingSettings
} from "../geometry/three/brick-to-scene";
import {PATTERN_LIST} from "../geometry/clayBrick/clay-patterns";

export function createGUI(scene) {
    const gui = new GUI({ autoPlace: true, width: 150 });

    for (const patternName in PATTERN_LIST) {
        const localPatternGUI = gui.addFolder(patternName);

        for (const patternParameter in PATTERN_LIST[patternName].patternParameters) {
            console.log(patternParameter);

            addPatternOverwrites(localPatternGUI, patternParameter, patternName);
        }
    }

    const defaultParameters = gui.addFolder("constructionParameters");

    for (const overwriteName in overwrites) {
        if (overwriteName !== "pattern" && OVERWRITE_SETTINGS.hasOwnProperty(overwriteName)) {
            addAllOverwrites(defaultParameters, overwriteName);
        }
    }
}

function addAllOverwrites(guiElement, overwriteElement) {
    guiElement.add(
        overwrites,
        overwriteElement,
        overwrites[overwriteElement].min,
        overwrites[overwriteElement].max
    ).onChange(function (value) {
        overwrites[overwriteElement] = value;
        // updateEasingSettings();

        addBrick();
    });
}

function addPatternOverwrites(guiElement, overwritePatternElement, patternName) {

    const patternParameters = PATTERN_LIST[patternName].patternParameters;

    console.log(patternName);

    overwrites.pattern.patternParameters[overwritePatternElement] = patternParameters[overwritePatternElement].default;

    const slider = guiElement.add(
        overwrites.pattern.patternParameters,
        overwritePatternElement,
        patternParameters[overwritePatternElement].min,
        patternParameters[overwritePatternElement].max
    );

    slider.onChange(function (value) {
        overwrites.pattern.patternFunction = PATTERN_LIST[patternName].patternFunction;
        overwrites.pattern.patternParameters[overwritePatternElement] = value;
        // updateEasingSettings();

        addBrick();
    });
}
