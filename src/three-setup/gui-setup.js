import {GUI} from "three/examples/jsm/libs/dat.gui.module";
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter";
import {addBrick, clearScene, overwrites} from "../geometry/three/brick-to-scene";
import {PATTERN_LIST} from "../geometry/clayBrick/clay-patterns";

export function createGUI(scene) {
    const gui = new GUI({ autoPlace: true, width: 150 });

    for (const patternName in PATTERN_LIST) {
        const localPatternGUI = gui.addFolder(patternName);

        console.log(PATTERN_LIST);

        for (const patternParameter in PATTERN_LIST[patternName].patternParameters) {
            addPatternOverwrites(localPatternGUI, patternParameter, patternName);
        }
    }

    const defaultParameters = gui.addFolder("constructionParameters");

    for (const overwrite in overwrites) {
        if (overwrite !== "pattern") {
            addAllOverwrites(defaultParameters, overwrite);
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
        addBrick();
    });
}

function addPatternOverwrites(guiElement, overwritePatternElement, patternName) {
    overwrites.pattern.patternFunction = PATTERN_LIST[patternName].patternFunction;

    guiElement.add(

        overwrites.pattern.patternParameters,
        overwritePatternElement,
        overwrites.pattern.patternParameters[overwritePatternElement].min,
        overwrites.pattern.patternParameters[overwritePatternElement].max
    ).onChange(function (value) {
        overwrites.pattern.patternParameters[overwritePatternElement] = value;
        addBrick();
    });
}
