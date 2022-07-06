import * as THREE from '../src/build/three.module.js';

import { PointerLockControls } from '../src/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let mesh1;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new PointerLockControls( camera, document.body );

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    const onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

    const poleGeo = new THREE.BoxGeometry( 5, 375, 5 );
    const poleMat = new THREE.MeshLambertMaterial();
    const wallMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(0, 13, 20)" )});
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});


    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );

// Thuantv8 add floor custom
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load( '../assets/images/woodground2.jpg' );
    // const groundTexture = loader.load( '../assets/images/woodground2.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;
    const groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    // wall texture
    const wallTexture = loader.load( '../src/examples/textures/terrain/wall.jpg' );
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 10 );
    wallTexture.anisotropy = 16;
    wallTexture.encoding = THREE.sRGBEncoding;

    const wallMaterial = new THREE.MeshLambertMaterial( { map: wallTexture } );

    // frame texture
    const frameTexture1 = loader.load( '../assets/images/puppy.jpg' );
    frameTexture1.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
    frameTexture1.repeat.set(1, 1 );
    frameTexture1.anisotropy = 16;
    frameTexture1.encoding = THREE.sRGBEncoding;

    const frameMaterial1 = new THREE.MeshLambertMaterial( { map: frameTexture1 } );

    const frameTexture2 = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture2.wrapS = frameTexture2.wrapT = THREE.RepeatWrapping;
    frameTexture2.repeat.set(1, 1 );
    frameTexture2.anisotropy = 16;
    frameTexture2.encoding = THREE.sRGBEncoding;

    const frameMaterial2 = new THREE.MeshLambertMaterial( { map: frameTexture2 } );


// End Thuantv8 add floor custom


    // vertex displacement

    let position = floorGeometry.attributes.position;

    for ( let i = 0, l = position.count; i < l; i ++ ) {

        vertex.fromBufferAttribute( position, i );

        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

        position.setXYZ( i, vertex.x, vertex.y, vertex.z );

    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for ( let i = 0, l = position.count; i < l; i ++ ) {

        color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        colorsFloor.push( color.r, color.g, color.b );

    }

    floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

    const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

    //const floor = new THREE.Mesh( floorGeometry, floorMaterial ); // origin


    const floor = new THREE.Mesh( floorGeometry, groundMaterial ); // thuantv8 add


    scene.add( floor );

    // objects
/*
    const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();

    position = boxGeometry.attributes.position;
    const colorsBox = [];

    for ( let i = 0, l = position.count; i < l; i ++ ) {

        color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        colorsBox.push( color.r, color.g, color.b );

    }

    boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

    for ( let i = 0; i < 500; i ++ ) {

        const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
        boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

        const box = new THREE.Mesh( boxGeometry, boxMaterial );
        box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
        box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
        box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

        scene.add( box );
        objects.push( box );

    }
*/
    //
    // Wall

    const wall1 = new THREE.BoxGeometry( 200, 50, 3 );
    mesh1 = new THREE.Mesh( wall1, poleMat );
    mesh1.position.x = -20;
    mesh1.position.y = 20;
    mesh1.position.z = -50;//Math.floor( Math.random() * 20 - 10 ) * 20;
    console.log(mesh1.position.z);
    mesh1.receiveShadow = true;
    mesh1.castShadow = true;

    scene.add( mesh1 );

    const wall2 = new THREE.BoxGeometry( 3, 50, 200 );
    mesh1 = new THREE.Mesh( wall2, poleMat );
    mesh1.position.x = 0;
    mesh1.position.y = 20;
    mesh1.position.z = 200;//Math.floor( Math.random() * 20 - 10 ) * 20;
    // console.log(mesh1.position.z);
    mesh1.receiveShadow = true;
    mesh1.castShadow = true;

    scene.add( mesh1 );
    // end add Wall



    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects( objects );
        const intersections1 = raycaster.intersectObjects( mesh1 );

        const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

    }

    prevTime = time;

    renderer.render( scene, camera );

}