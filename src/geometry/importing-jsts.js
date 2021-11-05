import {DelaunayTriangulationBuilder} from "jsts/org/locationtech/jts/triangulate";
import {WKTReader} from "jsts/org/locationtech/jts/io";
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp";
import {Geometry, GeometryCollection, GeometryFactory} from "jsts/org/locationtech/jts/geom";
import "jsts/org/locationtech/jts/monkey.js";
import {BufferAttribute, BufferGeometry, LineCurve, Vector3} from "three";
import {CustomLine} from "./test-geo";
import {UnaryUnionOp} from "jsts/org/locationtech/jts/operation/union";

function triangulationFromPolygon(polygon) {
    const builder = new DelaunayTriangulationBuilder();

    builder.setSites(polygon);
    builder.setTolerance(.01);

    let triangulation = builder.getTriangles(new GeometryFactory());

    console.log(triangulation);

    return triangulation;
}

function polygonToBufferGeometry(polygon) {
    const triangulation = triangulationFromPolygon(polygon);
    return bufferFromTriangulation(triangulation);
}

function edgesFromTriangulation(triangulation) {
    let vertexDict = {};
    let vPairs = {};
    let pureVertices = {};

    for (const boundary in triangulation._geometries) {
        const bnd = triangulation.getGeometryN(boundary);
        const coords = bnd.getCoordinates();

        if (coords.length === 4) {
            let cMap = [0, 0, 0];
            for (const idx in [0,1,2]) {
                const coor = coords[idx];

                let coordinate = JSON.stringify({x: coor.x, y: coor.y, z: .1});

                const dictCount = Object.keys(vertexDict).length;

                if (!(coordinate in vertexDict)) {
                    // console.log(coordinate);

                    vertexDict[coordinate] = dictCount;
                    pureVertices[coordinate] = new Vector3(coor.x, coor.y, .1);
                    cMap[idx] = dictCount;
                } else {
                    cMap[idx] = vertexDict[coordinate];
                }
            }

            // console.log(cMap);

            for (const idx in [0,1,2]) {
                let a = cMap[idx];
                let b = cMap[(idx + 1) % 3];

                let v0 = Math.min(a, b);
                let v1 = Math.max(a, b);

                vPairs[JSON.stringify([v0, v1])] = [v0, v1];
            }
        }
    }

    let idxVertex = {};
    for(const v in vertexDict){
        const idx = vertexDict[v];
        idxVertex[idx] = pureVertices[v];
    }

    let lines = [];

    for (const idx in vPairs) {
        // console.log(vPairs[idx]);

        const a = vPairs[idx][0];
        const b = vPairs[idx][1];

        // console.log(vPairs);
        // console.log(a, b);
        // console.log(idxVertex[a], idxVertex[b]);

        const localLineCurve = new LineCurve(idxVertex[a], idxVertex[b]);

        // localLineCurve.arcLengthDivisions = 1;

        lines.push(localLineCurve);
    }

    return lines;
}

function bufferFromTriangulation(triangulation) {
    // let geoCollection = new GeometryCollection();

    let bufferGeo = new BufferGeometry();
    let coordinatesList = [];

    for (const boundary in triangulation._geometries) {
        const bnd = triangulation.getGeometryN(boundary);
        const coords = bnd.getCoordinates();

        if (coords.length === 4) {
            for (const idx in [0,1,2]) {
                const coor = coords[idx];
                coordinatesList.push(coor.x);
                coordinatesList.push(coor.y);
                coordinatesList.push(.1);
            }
        }
    }

    const vertices = new Float32Array( coordinatesList );

    bufferGeo.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
    bufferGeo.computeVertexNormals();

    return bufferGeo;
}

export function displayPoint(aString) {
    let reader = new WKTReader();

    let pt = reader.read(aString);

    let buffered = BufferOp.bufferOp(pt, 20);

    const triangulation = triangulationFromPolygon(buffered);

    return {
        buffer: bufferFromTriangulation(triangulation),
        edges: edgesFromTriangulation(triangulation)
    };
}

export function geometriesUnion(geos) {
    if (geos.length === 1){
        return geos[0];
    }

    const geoFac = new GeometryFactory();
    const geoCollection = geoFac.createGeometryCollection(geos).union();

    return geoCollection;
}

export function multiplePoints(){
    let reader = new WKTReader();

    const strings = [
        'POINT (-20 0)',
        'POINT (20 0)',
        'POINT (0 15)'
    ];

    let geos = [];

    for (const aString of strings) {
        const pt = reader.read(aString);
        const buffer = BufferOp.bufferOp(pt, 30)

        geos.push(buffer);
    }

    const collection = geometriesUnion(geos);

    let geom = UnaryUnionOp.union(collection);

    const triangulation = triangulationFromPolygon(geom);

    return {
        buffer: bufferFromTriangulation(triangulation),
        edges: edgesFromTriangulation(triangulation)
    };
}

export function testPolygon() {
    let reader = new WKTReader();

    const pt = reader.read('POINT (0 0)');
    const buffer = BufferOp.bufferOp(pt, 30)

    return buffer;
}

export function displayPointTest(){
    return multiplePoints();
}
