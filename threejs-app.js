var scene, camera, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry1 = new THREE.BoxGeometry( 100, 100, 100 );
    geometry2 = new THREE.BoxGeometry( 500, 500, 500 );
    
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh1 = new THREE.Mesh( geometry1, material );

    mesh2 = new THREE.Mesh( geometry2, material );
    
    scene.add( mesh1 );
    scene.add( mesh2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    requestAnimationFrame( animate );

    mesh1.rotation.z += 0.05;
    mesh1.rotation.x -= 0.04;
    //mesh1.rotation.y -= 0.06;

    //mesh2.rotation.z += 0.05;
    mesh2.rotation.x -= 0.04;
    mesh2.rotation.y -= 0.06;

    renderer.render( scene, camera );

}