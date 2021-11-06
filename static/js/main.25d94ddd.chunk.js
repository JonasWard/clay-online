(this["webpackJsonpclay-online"]=this["webpackJsonpclay-online"]||[]).push([[0],{160:function(n,e,t){},162:function(n,e,t){},166:function(n,e,t){},169:function(n,e,t){"use strict";t.r(e);var r=t(62),i=t.n(r),o=t(148),a=t.n(o),s=(t(160),t(30)),c=t(0),u=t(1),l=t(4),v=t(5),h=t(11);function f(n,e,t,r,i,o){var a=new h.p(n,e,t,r,i);return new h.h(a,o)}var d={vertexShader:"\n            varying vec3 v_Normal;\n            void main() {\n                v_Normal = normal;\n                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            }",fragmentShader:"\n            varying vec3 v_Normal;\n            void main() {\n                gl_FragColor = vec4(v_Normal * .8, .8);\n                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);\n    \n            }",transparent:!0,uniforms:{}},g={vertexShader:"\n            varying vec3 v_Position;\n            void main() {\n                v_Position = position;\n                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            }",fragmentShader:"\n            varying vec3 v_Position;\n            void main() {\n                vec3 grid = abs(fract(v_Position - .5) - .5) / fwidth(v_Position);\n                float line = min(min(grid.x, grid.y), grid.z);\n                float value = 2.5- min(line, 2.5);\n                float transparency = .1 + value * .9;\n\n                gl_FragColor = vec4(vec3(0.), transparency);\n                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);\n            }",transparent:!0,uniforms:{},extensions:{derivatives:!0}},m=t(154),y=t(150),w=t(96),p=t(79),b=(t(168),t(151));function j(n){var e=new m.a;e.setSites(n),e.setTolerance(.01);var t=e.getTriangles(new p.b);return console.log(t),t}function P(n){var e={},t={},r={};for(var i in n._geometries){var o=n.getGeometryN(i).getCoordinates();if(4===o.length){var a=[0,0,0];for(var s in[0,1,2]){var c=o[s],u=JSON.stringify({x:c.x,y:c.y,z:.1}),l=Object.keys(e).length;u in e?a[s]=e[u]:(e[u]=l,r[u]=new h.r(c.x,c.y,.1),a[s]=l)}for(var v in[0,1,2]){var f=a[v],d=a[(v+1)%3],g=Math.min(f,d),m=Math.max(f,d);t[JSON.stringify([g,m])]=[g,m]}}}var y={};for(var w in e){y[e[w]]=r[w]}var p=[];for(var b in t){var j=t[b][0],P=t[b][1],O=new h.e(y[j],y[P]);p.push(O)}return p}function O(n){var e=new h.b,t=[];for(var r in n._geometries){var i=n.getGeometryN(r).getCoordinates();if(4===i.length)for(var o in[0,1,2]){var a=i[o];t.push(a.x),t.push(a.y),t.push(.1)}}var s=new Float32Array(t);return e.setAttribute("position",new h.a(s,3)),e.computeVertexNormals(),e}function x(n){var e=function(n){return 1===n.length?n[0]:(new p.b).createGeometryCollection(n).union()}(n);return b.a.union(e)}function C(){var n,e=function(n){var e,t=new y.a,r=[],i=Object(s.a)(n);try{for(i.s();!(e=i.n()).done;){var o=e.value;r.push(t.read(o))}}catch(a){i.e(a)}finally{i.f()}return r}(["POINT (-20 0)","POINT (20 0)","POINT (0 15)"]),t=[],r=Object(s.a)(e);try{for(r.s();!(n=r.n()).done;){var i=n.value;t.push(w.a.bufferOp(i,30))}}catch(o){r.e(o)}finally{r.f()}return x(t)}function N(){return function(n){var e=j(n);return{buffer:O(e),edges:P(e)}}(C())}var k=function(){function n(e,t){Object(c.a)(this,n),this.origin=e,this.position=(new h.r).copy(e),this.direction=t}return Object(u.a)(n,[{key:"move",value:function(n){this.position=(new h.r).addVectors(this.position,(new h.r).addScaledVector(this.direction,n))}},{key:"set",value:function(n){this.position=(new h.r).addVectors(this.origin,(new h.r).addScaledVector(this.direction,n))}},{key:"toCoordinate",value:function(n){return new p.a(this.position.x,this.position.y,this.position.z)}}]),n}();var M=function(){function n(e){Object(c.a)(this,n),this.clayPoints=e}return Object(u.a)(n,[{key:"toPolygon",value:function(){var n,e=[],t=Object(s.a)(this.clayPoints);try{for(t.s();!(n=t.n()).done;){var r=n.value;e.push(r.toCoordinate())}}catch(i){t.e(i)}finally{t.f()}return e.push(e[0]),(new p.b).createPolygon(e)}}]),n}();var z=t(149),V=function(n){Object(l.a)(t,n);var e=Object(v.a)(t);function t(n){var r,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return Object(c.a)(this,t),(r=e.call(this)).points=n,r.closed=i,r.init(),r}return Object(u.a)(t,[{key:"init",value:function(){this.dirs=this.getDirs(),this.arcLengthDivisions=this.getPointCount()}},{key:"getPointCount",value:function(){return this.closed?this.points.length:this.points.length-1}},{key:"getDirs",value:function(){for(var n=[],e=0;e<this.getPointCount();e++){var t=this.points[e],r=this.points[(e+1)%this.getPointCount()],i=(new h.r).subVectors(r,t);n.push(i)}return n}},{key:"getLength",value:function(){var n=this.getLengths();return n[n.length-1]}},{key:"getLengths",value:function(){if(this.cacheArcLengths&&this.cacheArcLengths.length===this.getPointCount()+1&&!this.needsUpdate)return this.cacheArcLengths;var n=0;this.cacheArcLengths=[n];var e,t=Object(s.a)(this.dirs);try{for(t.s();!(e=t.n()).done;){n+=e.value.length(),this.cacheArcLengths.push(n)}}catch(r){t.e(r)}finally{t.f()}return this.cacheArcLengths}},{key:"getTangentAt",value:function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new h.r;return this.getTangent(n*this.getPointCount(),e)}},{key:"getTangent",value:function(n){var e,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new h.r,r=n%1,i=n-n%1;if(isNaN(n))return null;if(n>0&&n<this.getPointCount())if(r<1e-4){var o=(new h.r).copy(this.dirs[i]),a=(new h.r).copy(this.dirs[i-1]);a.normalize(),o.normalize(),e=(new h.r).addVectors(a,o)}else e=(new h.r).copy(this.dirs[i]);if(this.closed)if(i%=this.getPointCount(),r<1e-4){var s=(new h.r).copy(this.dirs[i]),c=(new h.r).copy(this.dirs[(i+this.getPointCount()-1)%this.getPointCount()]);c.normalize(),s.normalize(),e=(new h.r).addVectors(c,s)}else e=(new h.r).copy(this.dirs[i]);else e=n<1?(new h.r).copy(this.dirs[0]):(new h.r).copy(this.dirs[this.dirs.length-1]);return e.normalize(),t.set(e.x,e.y,e.z)}},{key:"computeFrenetFrames",value:function(n,e){for(var t=new h.r,r=[],i=[],o=[],a=new h.r,s=new h.g,c=0;c<=n;c++){var u=c/n;r[c]=this.getTangentAt(u,new h.r)}i[0]=new h.r,o[0]=new h.r;var l=Number.MAX_VALUE,v=Math.abs(r[0].x),f=Math.abs(r[0].y),d=Math.abs(r[0].z);v<=l&&(l=v,t.set(1,0,0)),f<=l&&(l=f,t.set(0,1,0)),d<=l&&t.set(0,0,1),a.crossVectors(r[0],t).normalize(),i[0].crossVectors(r[0],a),o[0].crossVectors(r[0],i[0]);for(var g=1;g<=n;g++){if(i[g]=i[g-1].clone(),o[g]=o[g-1].clone(),a.crossVectors(r[g-1],r[g]),a.length()>Number.EPSILON){a.normalize();var m=Math.acos(Object(z.a)(r[g-1].dot(r[g]),-1,1));i[g].applyMatrix4(s.makeRotationAxis(a,m))}o[g].crossVectors(r[g],i[g])}if(!0===e){var y=Math.acos(Object(z.a)(i[0].dot(i[n]),-1,1));y/=n,r[0].dot(a.crossVectors(i[0],i[n]))>0&&(y=-y);for(var w=1;w<=n;w++)i[w].applyMatrix4(s.makeRotationAxis(r[w],y*w)),o[w].crossVectors(r[w],i[w])}return console.log({tangents:r,normals:i,binormals:o}),{tangents:r,normals:i,binormals:o}}},{key:"_tConstraining",value:function(n){var e=n%1,t=n-e;return this.closed?t%=this.getPointCount():t<0?(e+=t,t=0):t>=this.getPointCount()&&(e+=t-this.getPointCount(),t=this.getPointCount()),{locT:e,t0:t}}},{key:"getPointAt",value:function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new h.r;return this.getPoint(n,e)}},{key:"getPoint",value:function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new h.r;n*=this.getPointCount();var t=this._tConstraining(n),r=t.locT,i=t.t0,o=this.points[i],a=this.dirs[i],s=(new h.r).addVectors(o,(new h.r).addScaledVector(a,r));return e.set(s.x,s.y,s.z)}},{key:"makeMeWave",value:function(){for(var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5,t=2*n*Math.PI/this.getPointCount(),r=0,i=0;i<this.getPointCount();i++)this.points[i].z+=e*Math.sin(r),r+=t;this.init()}}]),t}(h.c);(new p.b).createLinearRing();function A(n){var e;return e=isNaN(n.z)?0:n.z,new h.r(n.x,n.y,e)}function I(n){var e,t=[],r=Object(s.a)(n.getCoordinates());try{for(r.s();!(e=r.n()).done;){var i=e.value;t.push(A(i))}}catch(o){r.e(o)}finally{r.f()}return t.pop(),new V(t)}function _(n){var e,t=function(n){var e=[];e.push(n.getExteriorRing()),console.log(n);for(var t=0;t<n.getNumInteriorRing();t++)e.push(n.getInteriorRingN(t));return e}(n),r=[],i=Object(s.a)(t);try{for(i.s();!(e=i.n()).done;)for(var o=e.value,a=0;a<50;a++){var c,u=I(o),l=Object(s.a)(u.points);try{for(l.s();!(c=l.n()).done;){c.value.z=a}}catch(v){l.e(v)}finally{l.f()}r.push(u)}}catch(v){i.e(v)}finally{i.f()}return r}var L=function(n){Object(l.a)(t,n);var e=Object(v.a)(t);function t(){var n,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return Object(c.a)(this,t),(n=e.call(this)).scale=r,n}return Object(u.a)(t,[{key:"getPoint",value:function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new h.r,t=3*n-1.5,r=Math.sin(2*Math.PI*n),i=0;return e.set(t,r,i).multiplyScalar(this.scale)}}]),t}(h.c);h.c;function S(){return new h.m(g)}function R(){var n,e=_(C()),t=new h.m(d),r=[],i=Object(s.a)(e);try{for(i.s();!(n=i.n()).done;){var o=n.value;o.makeMeWave(4,10),r.push(f(o,o.getPointCount(),.5,6,!1,t))}}catch(a){i.e(a)}finally{i.f()}return r}function T(n){n.add(function(){var n=S();return f(new L(10),100,2,32,!1,n)}()),function(){var n=new h.r(0,0,0),e=new h.r(1,0,0),t=new k(n,e);t.move(1),t.set(10)}(),function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=[new k(new h.r(.5,.5,0),new h.r(1,1,0)),new k(new h.r(-.5,.5,0),new h.r(-1,1,0)),new k(new h.r(-.5,-.5,0),new h.r(-1,-1,0)),new k(new h.r(.5,-.5,0),new h.r(1,-1,0))],t=new M(e);console.log(t),console.log(t.toPolygon()),console.log(n),n||console.log("is null !!!")}(n);var e,t=Object(s.a)(R());try{for(t.s();!(e=t.n()).done;){var r=e.value;n.add(r)}}catch(i){t.e(i)}finally{t.f()}}function F(n,e,t){if(n&&e&&t){var r=n.current,i=r.clientWidth,o=r.clientHeight;t&&(t.aspect=i/o,t.updateProjectionMatrix()),e.setSize(i,o)}}var E=t(152);function D(n,e,t){var r={frameId:null};return r.frameId=requestAnimationFrame((function(){return J(n,e,t,r)})),r}function J(n,e,t,r){n.clear("#ddd"),n.render(e,t),r.frameId=requestAnimationFrame((function(){return J(n,e,t,r)}))}function W(n){var e=new h.l;T(e),N();var t=function(){var n=new h.s({antialias:!0,alpha:!0});return n.setClearColor("#ffff99"),n.setPixelRatio(window.devicePixelRatio),n}();n.current.appendChild(t.domElement);var r=function(n){var e=n.clientWidth,t=n.clientHeight,r=new h.j(45,e/t);return r.position.z=20,r}(n.current);e.add(r);var i=function(n,e){var t=new E.a(n,e.domElement);return t.enableRotate=!0,t.enableKeys=!0,t.target.set(0,0),t.update(),t}(r,t);return F(n,t,r),{scene:e,renderer:t,camera:r,frameId:D(t,e,r),orbitControls:i}}function G(n,e,t){!function(n){var e=n.frameId;cancelAnimationFrame(e)}(t.frameId),n.current.removeChild(e.domElement)}t(162);var q=t(155),B=(t(166),t(72));var H=function(){var n=Object(r.useRef)(null),e=Object(r.useRef)(null),t=Object(r.useRef)(null);return Object(r.useEffect)((function(){console.log(n);var r=W(n),i=(r.scene,r.camera),o=r.renderer,a=r.frameId;return e.current=o,t.current=i,function(){G(n,o,a)}}),[e,t]),Object(B.jsx)(q.a,{bounds:!0,onResize:function(){F(n,e.current,t.current)},children:function(e){var t=e.measureRef;return Object(B.jsx)("div",{className:"simple-3d",ref:t,children:Object(B.jsx)("div",{className:"three-canvas",ref:n,tabIndex:0})})}})};var U=function(){return Object(B.jsx)("div",{className:"app",children:Object(B.jsx)("div",{className:"container",children:Object(B.jsx)(H,{})})})},K=function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,170)).then((function(e){var t=e.getCLS,r=e.getFID,i=e.getFCP,o=e.getLCP,a=e.getTTFB;t(n),r(n),i(n),o(n),a(n)}))};a.a.render(Object(B.jsx)(i.a.StrictMode,{children:Object(B.jsx)(U,{})}),document.getElementById("root")),K()}},[[169,1,2]]]);
//# sourceMappingURL=main.25d94ddd.chunk.js.map