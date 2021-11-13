import {GUI} from "three/examples/jsm/libs/dat.gui.module";
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter";

export function createGUI(scene) {
    const gui = new GUI();

    const exportUSDZ = { usdz:function(){
        console.log("export USDZ !?");

        // const exporter = new USDZExporter();
        // const arrayBuffer = exporter.parse( scene, function ( ucsd ) {
        //     console.log(ucsd);
        //     console.log("nothing ?");
        //
        // }, {} );
        //
        // const blob = new Blob( [ arrayBuffer ], { type: 'application/octet-stream' } );
        //
        // // console.log(ucsd);
        // console.log(document);
        //
        // const link = document.getElementById( 'link' );
        //
        // console.log(link);
        //
        // link.href = URL.createObjectURL( blob );

    }};

    gui.add(exportUSDZ,'usdz');

    return gui;
}
