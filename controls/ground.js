import * as THREE from '../src/build/three.module.js';
import { OrbitControls } from '../src/examples/jsm/controls/OrbitControls.js';
import { StereoEffect } from '../src/examples/jsm/effects/StereoEffect.js';
import { TrackballControls } from '../src/examples/jsm/controls/TrackballControls.js';
import { RectAreaLightHelper } from '../src/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '../src/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { FontLoader } from '../src/examples/jsm/loaders/FontLoader.js';
// import CameraControls from '../assets/js/dist/camera-controls.js';
//import { TWEEN } from '../assets/js/dist/tween.umd.js';

//import * as TWEEN from '../assets/js/dist/tween.amd.js';

import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

CameraControls.install({ THREE: THREE });

// const TWEEN = require('@tweenjs/tween.js');


let container, stats;
let camera, scene, renderer, cameraControls;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
let clothGeometry;
let sphere;
let object, effect;

let radius = 0,
    phi, theta, lon, lat;

const spheres = [];

let mouseX = 0,
    mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let controls;
let clientX;
let clientY;
let clientZ;

let nameObject = "";
let timeout1, timeout2, timeout3;
let mesh, mesh1, mesh2;
let totalPic = 16; //
let cameraRig, cameraPerspectiveHelper, cameraOrthoHelper;

const fov = 45;
const near = 1;
const far = 15000;


const clock = new THREE.Clock();

const video = document.getElementById('video');
video.volume = 0.000; // volumn video




init();

animate(0);

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // scene

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);

    // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    //scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 ); // using

    // camera

    // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.5, 10000 );
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.set( 1000, 50, 1500 );//default
    // camera.position.set( 1000, 0, 2000 );
    // camera.fov=10;

    const loaderImg = new THREE.TextureLoader();
    loaderImg.load('assets/images/sky2.jpg', function(texture) {
        scene.background = texture;
    });

    camera.position.set(0, 250, 8000);
    cameraRig = new THREE.Group();

    cameraRig.add(camera);
    // cameraRig.add( cameraOrtho );
    scene.add(cameraRig);
    // lights

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.SpotLight(0xf8f8ff, 0.5);
    light.position.set(0, -200, 500);
    light.position.multiplyScalar(5);

    light.castShadow = true;

    light.shadow.mapSize.width = 124;
    light.shadow.mapSize.height = 2024;

    scene.add(light);

    // const light2 = new THREE.DirectionalLight(0xdfebff, 0.5);
    // light2.position.set(0, 0, -5000);
    // light2.position.multiplyScalar(5);

    // light2.castShadow = true;

    // light2.shadow.mapSize.width = 1024;
    // light2.shadow.mapSize.height = 1024;
    // scene.add(light2);


    const light3 = new THREE.SpotLight(0xdfebff, 0.5);
    light3.position.set(5000, 0, 0);
    light3.position.multiplyScalar(5);

    light3.castShadow = true;

    light3.shadow.mapSize.width = 1024;
    light3.shadow.mapSize.height = 1024;

    scene.add(light3);

    // const light4 = new THREE.DirectionalLight(0xdfebff, 0.5);
    // light4.position.set(-5000, 0, 0);
    // light4.position.multiplyScalar(5);

    // light4.castShadow = true;

    // light4.shadow.mapSize.width = 1024;
    // light4.shadow.mapSize.height = 1024;

    // scene.add(light4);



    const d = 300;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.far = 500;
    light.shadow.camera.near = 30;

    scene.fog = new THREE.Fog(0xffffff, 5000, 19000);

    //scene.fog = new THREE.FogExp2(0xffffff, 0.001);


    RectAreaLightUniformsLib.init();

    // const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 1000, 900 );
    // rectLight1.position.set(  500, 5, -2000 );
    // rectLight1.rotation.y = -300;
    // scene.add( rectLight1 );
    const rectLight1 = new THREE.RectAreaLight(0xff0000, 150, 1500, 100);
    rectLight1.position.set(-4959, 1000, -4000);
    rectLight1.rotation.y = -1000;
    rectLight1.rotation.x = 300;
    rectLight1.rotation.z = -300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight1);

    // const rectLight2 = new THREE.RectAreaLight( 0xff0000, 150, 1500, 100 );
    // rectLight2.position.set(  -1950, 600, -5000 );
    // rectLight2.rotation.y = -1000;
    // rectLight2.rotation.x = 300;
    // rectLight2.rotation.z = -300;
    // // rectLight1.lookAt(0, 0, 0);
    // scene.add( rectLight2 );

    // const rectLight3 = new THREE.RectAreaLight( 0xff0000, 150, 1500, 100 );
    // rectLight3.position.set(  2050, 600, -5000 );
    // rectLight3.rotation.y = -1000;
    // rectLight3.rotation.x = 300;
    // rectLight3.rotation.z = -300;
    // // rectLight1.lookAt(0, 0, 0);
    // scene.add( rectLight3 );

    const rectLight3 = new THREE.RectAreaLight(0xFF6400, 150, 1500, 100);
    rectLight3.position.set(1000, 900, -3000);
    // rectLight7.rotation.y = 1000;
    rectLight3.rotation.x = 300;
    // rectLight7.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight3);

    const rectLight4 = new THREE.RectAreaLight(0xff0000, 150, 1500, 100);
    rectLight4.position.set(3050, 900, 500);
    rectLight4.rotation.y = -1000;
    rectLight4.rotation.x = 300;
    rectLight4.rotation.z = -300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight4);

    const rectLight5 = new THREE.RectAreaLight(0xFF9B00, 150, 1500, 100);
    rectLight5.position.set(4900, 1000, -4000);
    rectLight5.rotation.y = 1000;
    rectLight5.rotation.x = 300;
    rectLight5.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight5);

    const rectLight6 = new THREE.RectAreaLight(0xFF9B00, 150, 1500, 100);
    rectLight6.position.set(2950, 900, 500);
    rectLight6.rotation.y = 1000;
    rectLight6.rotation.x = 300;
    rectLight6.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight6);

    const rectLight7 = new THREE.RectAreaLight(0xFF6400, 150, 1500, 100);
    rectLight7.position.set(-500, 900, 4000);
    // rectLight7.rotation.y = 1000;
    rectLight7.rotation.x = 300;
    // rectLight7.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight7);

    const rectLight8 = new THREE.RectAreaLight(0xFF6400, 150, 1500, 100);
    rectLight8.position.set(-2250, 900, 500);
    rectLight8.rotation.y = 1000;
    rectLight8.rotation.x = 300;
    rectLight8.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight8);

    const rectLight9 = new THREE.RectAreaLight(0xff0000, 150, 1500, 100);
    rectLight9.position.set(-500, 900, 100);
    // rectLight7.rotation.y = 1000;
    rectLight9.rotation.x = 300;
    // rectLight7.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    //scene.add(rectLight9);

    // scene.add(new RectAreaLightHelper(rectLight1));
    // // scene.add( new RectAreaLightHelper( rectLight2 ) );
    // scene.add(new RectAreaLightHelper(rectLight3));
    // scene.add(new RectAreaLightHelper(rectLight4));
    // scene.add(new RectAreaLightHelper(rectLight5));
    // scene.add(new RectAreaLightHelper(rectLight6));
    // scene.add(new RectAreaLightHelper(rectLight7));
    // scene.add(new RectAreaLightHelper(rectLight8));
    // scene.add(new RectAreaLightHelper(rectLight9));


    // ground
    const loader = new THREE.TextureLoader();

    //Get your video element:


    //Create your video texture:
    const videoTexture = new THREE.VideoTexture(video);

    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.FrontSide, toneMapped: false });
    //Create screen
    // const screen = new THREE.PlaneGeometry(1, 1, 0);
    // const videoScreen = new THREE.Mesh(screen, videoMaterial);
    // scene.add(videoScreen);

    //const groundTexture = loader.load( '../src/examples/textures/terrain/grasslight-big.jpg' );
    const groundTexture = loader.load('../assets/images/woodground.jpg');
    // const groundTexture = loader.load( '../assets/images/woodground2.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(45, 45);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    // wall texture
    const wallTexture = loader.load('../src/examples/textures/terrain/wall.jpg');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 10);
    wallTexture.anisotropy = 16;
    wallTexture.encoding = THREE.sRGBEncoding;

    const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

    // frame texture
    const frameTexture1 = loader.load('../assets/images/fpt_1.png');
    frameTexture1.wrapS = frameTexture1.wrapT = THREE.RepeatWrapping;
    frameTexture1.repeat.set(1, 1);
    frameTexture1.anisotropy = 16;
    frameTexture1.encoding = THREE.sRGBEncoding;

    const frameMaterial1 = new THREE.MeshLambertMaterial({ map: frameTexture1 });

    const frameTexture2 = loader.load('../assets/images/puppy2.jpg');
    frameTexture2.wrapS = frameTexture2.wrapT = THREE.RepeatWrapping;
    frameTexture2.repeat.set(1, 1);
    frameTexture2.anisotropy = 16;
    frameTexture2.encoding = THREE.sRGBEncoding;

    const frameMaterial2 = new THREE.MeshLambertMaterial({ map: frameTexture2 });


    const frameTexture3 = loader.load('../assets/images/nen_1.jpg');
    frameTexture3.wrapS = frameMaterial2.wrapT = THREE.RepeatWrapping;
    frameTexture3.repeat.set(1, 1);
    frameTexture3.anisotropy = 16;
    frameTexture3.encoding = THREE.sRGBEncoding;


    const frameMaterial3 = new THREE.MeshLambertMaterial({ map: frameTexture3 });


    //let mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(30000, 30000), groundMaterial);
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // poles
    // set skin

    const poleGeo = new THREE.BoxGeometry(5, 375, 5);
    const poleMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("245, 245, 245"), transparent: false });
    const wallMat = new THREE.MeshStandardMaterial();
    const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("rgb(36, 36, 36)"), transparent: false });

    // const texture2 = new THREE.TextureLoader().load('assets/images/geometry.jpg');
    // const wallMat = new THREE.MeshBasicMaterial({ map: texture2 });
    // scene.fog = new THREE.Fog( 0xffffff, 3000, 10000 ); 
    /*
    mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = - 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
    mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
    mesh = new THREE.Mesh( new THREE.BoxGeometry( 255, 5, 5 ), poleMat );
    mesh.position.y = - 250 + ( 750 / 2 );
    mesh.position.x = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
    //const gg = new THREE.BoxGeometry( 10, 10, 10 );
    const gg = new THREE.BoxGeometry( 100, 100, 20 );
    mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
    mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = - 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );*/
    // ******* end pole


    //wall wellcome
    const box_wellcome_top = new THREE.BoxGeometry(855, 665, 20);
    mesh = new THREE.Mesh(box_wellcome_top, poleMat);
    mesh.position.y = 50;
    mesh.position.x = -900;
    mesh.position.z = 6000;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    //wall custom new THREE.BoxGeometry( width x, height y, thickness z )

    const wallmaxleft = new THREE.BoxGeometry(70, 5000, 12000);
    mesh = new THREE.Mesh(wallmaxleft, poleMat);
    mesh.position.y = -250;
    mesh.position.x = -5000;
    mesh.position.z = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallmaxright = new THREE.BoxGeometry(70, 5000, 12000);
    mesh = new THREE.Mesh(wallmaxright, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 5000;
    mesh.position.z = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wallmaxbottom = new THREE.BoxGeometry(7000, 5000, 70);
    mesh = new THREE.Mesh(wallmaxbottom, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 0;
    mesh.position.z = -5500;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wall1left = new THREE.BoxGeometry(3200, 4000, 70);
    mesh = new THREE.Mesh(wall1left, poleMat);
    mesh.position.y = 750;
    mesh.position.x = -3495;
    mesh.position.z = 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wall1right = new THREE.BoxGeometry(3200, 4000, 70);
    mesh = new THREE.Mesh(wall1right, poleMat);
    mesh.position.y = 750;
    mesh.position.x = 3495;
    mesh.position.z = 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    //tuong gan tranh phia truoc

    // const wallpic1right = new THREE.BoxGeometry(1000, 1500, 30);
    // mesh = new THREE.Mesh(wallpic1right, poleMat);
    // mesh.position.y = 250;
    // mesh.position.x = 2200;
    // mesh.position.z = 4000;
    // mesh.receiveShadow = true;
    // mesh.castShadow = true;

    // scene.add(mesh);


    const wallpic1left = new THREE.BoxGeometry(3500, 2000, 70);
    mesh = new THREE.Mesh(wallpic1left, poleMat);
    mesh.position.y = 250;
    mesh.position.x = 900;
    mesh.position.z = 3000;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallpic1bet_ver1 = new THREE.BoxGeometry(3000, 2000, 70);
    mesh = new THREE.Mesh(wallpic1bet_ver1, poleMat);
    mesh.position.y = 250;
    mesh.position.x = -700;
    mesh.position.z = -1250;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wallpic1bet_ver3 = new THREE.BoxGeometry(70, 2000, 3500);
    mesh = new THREE.Mesh(wallpic1bet_ver3, poleMat);
    mesh.position.y = 250;
    mesh.position.x = -2200;
    mesh.position.z = 500;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    //tuong gan tranh phia trong

    const wallpic_ho_1 = new THREE.BoxGeometry(70, 2000, 4000);
    mesh = new THREE.Mesh(wallpic_ho_1, poleMat);
    mesh.position.y = 250;
    mesh.position.x = 3000;
    mesh.position.z = 0;

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    //renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio) ? window.devicePixelRatio : 1;
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;


    // effect = new StereoEffect( renderer );
    // effect.setSize( window.innerWidth, window.innerHeight );
    // controls
    // move mouse
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minPolarAngle = Math.PI * 0.5;

    controls.target.set(0, 450, 8000);
    // controls.minDistance = 1000;
    // controls.maxDistance = 5000;
    controls.minDistance = 10;
    controls.maxDistance = 8000;
    controls.keyPanSpeed = 800;

    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    // controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    // controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;

    controls.listenToKeyEvents(window); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    // controls.enablePan = true;
    controls.enableZoom = true;
    //controls.rotateSpeed = 100;
    controls.panSpeed = 100;



    //controls.screenSpacePanning = false;
    controls.screenSpacePanning = false; // false key up go to, key down go back
    //controls.autoRotate = true;

    // controls.update();
    // performance monitor

    // cameraControls = new CameraControls( camera, renderer.domElement );
    // cameraControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
    // cameraControls.touches.one        = CameraControls.ACTION.TOUCH_ROTATE;
    // cameraControls.touches.two        = CameraControls.ACTION.TOUCH_DOLLY_OFFSET;
    // cameraControls.touches.three      = CameraControls.ACTION.TOUCH_OFFSET;


    window.addEventListener('resize', onWindowResize);

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);

    window.requestAnimationFrame(render);

    // // div detail pic
    document.getElementById('details-pic').style.width = '0px';
    document.getElementById('details-pic').style.height = '0px';

    document.getElementById('view-pic').style.width = '0px';
    document.getElementById('view-pic').style.height = '0px';




    // add pic to wall
    //addPicturesBigBackWall(totalPic);

    addPictureBigWallMiddel1(0);
    addPictureBigWallMiddel2(0);
    addPictureBigWallMiddel3(0);
    addPictureBigWallMiddel4(0);
    addPictureBigWallMiddel5(0);
    addPictureBigWallMiddel6(0);
    addPictureBigWallMiddel7(0);
    addPictureBigWallMiddel8(0);

    addPictureBigWallLeft1(-5000);
    addPictureBigWallLeft2(-5000);
    addPictureBigWallLeft3(-5000);
    addPictureBigWallLeft4(-5000);
    addPictureBigWallLeft5(-5000);
    addPictureBigWallLeft6(-5000);
    addPictureBigWallLeft7(-5000);
    addPictureBigWallLeft8(-5000);
    addPictureBigWallLeft9(-5000);
    addPictureBigWallLeft10(-5000);
    addPictureBigWallLeft11(-5000);


    addPictureBigWallRight1(5000);
    addPictureBigWallRight2(5000);
    addPictureBigWallRight3(5000);
    addPictureBigWallRight4(5000);
    addPictureBigWallRight5(5000);
    addPictureBigWallRight6(5000);
    addPictureBigWallRight7(5000);
    addPictureBigWallRight8(5000);
    addPictureBigWallRight9(5000);
    addPictureBigWallRight10(5000);
    addPictureBigWallRight11(5000);

    addPicturesWallVer1(-200);
    addPicturesWallVer2(400);
    addPicturesWallVer3(1000);
    addPicturesWallVer4(1700);

    addPicturesWallVer5(-2200);
    addPicturesWallVer6(-2200);
    addPicturesWallVer7(-2200);

    addPictureWellcome(-900);


    addPicturesWallVer8(-1700);
    addPicturesWallVer9(-1700);
    addPicturesWallVer10(-1700);
    addPicturesWallVer11(-1700);

    addPicturesWallVer12(3000);
    addPicturesWallVer13(3000);

    addPicturesWallVer14(900);
    addPicturesWallVer15(900);
    addPicturesWallVer16(900);

    addPicturesWallVer17(-2200);
    addPicturesWallVer18(-2200);
    addPicturesWallVer19(-2200);
    addPicturesWallVer20(-2200);
    addPicturesWallVer21(-2200);

    addPicturesWallVer22(-700);
    addPicturesWallVer23(-700);
    addPicturesWallVer24(-700);

    addPicturesWallVer25(3000);
    addPicturesWallVer26(3000);
    addPicturesWallVer27(3000);
    addPicturesWallVer28(3000);
}

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //console.log(mouse.x);


}

function onMouseClick(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    var timer1 = 5000;
    var timer2 = 5000;
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;


    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    console.log(clientX);
    console.log(clientY);
    console.log(clientZ);

    //console.log("Mesh name: "+nameObject);

    var styleDetails = document.getElementById('details-pic').style;
    var styleViewPic = document.getElementById('view-pic').style;
    // cameraControls.setFocalOffset(150, 0, 0, true );
    //var cameraControl = cameraControls.dolly(  1, true );
    // console.log(cameraControl);
    if (nameObject != "") {
        //clearTimeout(timeout1);
        //clearTimeout(timeout2);
        //clearTimeout(timeout3);


        // let position1 = {
        //     cameraPositionX: clientX,
        //     //   cameraPositionY: event.clientY,
        //     cameraPositionZ: clientZ,
        // };
        // // console.log(position1);
        // // //console.log(event.clientz);
        // cameraToMarker(position1);

        /**/
        styleDetails.width = '300px';
        styleDetails.height = '500px';
        styleDetails.color = 'white';
        styleDetails.right = "10px";
        styleDetails.top = "10px";
        styleDetails.fontSize = '1.2rem';

        styleViewPic.width = '1080px';
        styleViewPic.height = '450px';
        styleViewPic.color = 'white';
        styleViewPic.left = "10px";
        styleViewPic.top = "10px";
        styleViewPic.fontSize = '1.2rem';


        // styleDetails.width='0px';
        // styleDetails.height='0px';
        // styleDetails.fontSize = '0rem';   

        // styleViewPic.width='0px';
        // styleViewPic.height='0px';
        // styleViewPic.fontSize = '0rem';   

        timeout1 = setTimeout(() => {
            //camera.position.set( event.clientX, event.clientY, clientZ);    
            styleDetails.width = '0px';
            styleDetails.height = '0px';
            styleDetails.fontSize = '0rem';

            styleViewPic.width = '0px';
            styleViewPic.height = '0px';
            styleViewPic.fontSize = '0rem';


        }, timer1);
        timeout2 = setTimeout(() => {
            styleDetails.right = '-99999999px';
            styleViewPic.left = '-99999999px';

        }, timer2);

        //cameraRig.lookAt( [clientX,clientY,clientZ]);
        // cameraRig.lookAt(mesh1.position);

        nameObject = "";

        clientZ += 150;
        clientX += -100;
        // console.log(controls.getDistance());
        // camera.lookAt();

        timeout3 = setTimeout(() => {


        }, 1000);


        // var position = { x : 1000, y: 0 };
        // var target = { x : 400, y: 50 };
        // var tween = new TWEEN.Tween(position).to(target, 2000);
        // // Create a tween for position first
        // // var tween = new TWEEN.Tween(position)
        // tween.start();
    }


    // // Then tell the tween we want to animate the x property over 1000 milliseconds
    // tween.to({x: 200}, 1000)
}


function addPictureWellcome(positionX) {
    let frame_v_out, frame_ver;

    let posX = positionX,
        posY = 50,
        posZ = 6000;

    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/L.png');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // frame
    frame_v_out = new THREE.BoxGeometry(855, 655, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 5;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(850, 650, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 10;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    // mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)


}

function addPictureBigWallMiddel1(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 3000;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 3000;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallMiddel2(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 2200;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 2200;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallMiddel3(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 1400;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 1400;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallMiddel4(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(350, 655, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 600;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(355, 650, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 600;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallMiddel5(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1,
        frame_v_out_2, frame_ver_2;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 200;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(555, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 200;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallMiddel6(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1,
        frame_v_out_2, frame_ver_2;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 1100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(555, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 1100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallMiddel7(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 2000;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 2000;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallMiddel8(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -5500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(350, 655, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 2700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(355, 650, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 2700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}



function addPictureBigWallLeft1(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 550,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft2(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 550,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallLeft3(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 555, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft4(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 655, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 2900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 650, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 2900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallLeft5(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 655, 350);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 3700;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 650, 350);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 3700;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallLeft6(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 4600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 4600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallLeft7(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 5600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 5600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft8(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 6600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 6600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft9(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 7600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 7600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft10(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 8600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 8600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallLeft11(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1
        /*  position wall ver 2
            mesh.position.y = - 250;
            mesh.position.x = 900;
            mesh.position.z = -375;
            ver 2
            positionX = 930
        */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 9600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 9600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}



function addPictureBigWallRight1(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(2, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(2, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight2(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallRight3(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1800;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1800;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight4(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 655, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 2600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 650, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 2600;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight5(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 3500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 555);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 3500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPictureBigWallRight6(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 555, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 4500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 4500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight7(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 555, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 5500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 5500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight8(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 655, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 6500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 650, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 6500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight9(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 655, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 650, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight10(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 8300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 8300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPictureBigWallRight11(positionX) { //max pic: 3
    let frame_v_out_1, frame_ver_1

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = 5400;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    //for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out_1 = new THREE.BoxGeometry(55, 455, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 9100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(5, 450, 355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 9100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}

// hang tranh phia truoc 1

function addPicturesWallVer1(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(455, 450, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(455, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer2(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(555, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer3(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(350, 655, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(350, 655, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer4(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 450, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(555, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

//hang tranh ben trai
function addPicturesWallVer5(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer6(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ + 100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ + 100;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer7(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 900;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

//hang tranh giua

function addPicturesWallVer8(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(350, 655, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(350, 655, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer9(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 750,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 500;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 500;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer10(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(455, 355, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 1100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(455, 350, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 1100;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer11(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(655, 555, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 1800;
    mesh.position.y = posY;
    mesh.position.z = posZ + 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(655, 550, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 1800;
    mesh.position.y = posY;
    mesh.position.z = posZ + 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


//hang tranh ben phai

function addPicturesWallVer12(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = -800;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 750, 1355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 750, 1355);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer13(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 1000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 755);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 40;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 755);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 70;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

//hang tranh phia truoc 2
function addPicturesWallVer14(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(655, 555, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(655, 550, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer15(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(555, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer16(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 3000;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(350, 655, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(350, 655, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


//hang tranh ben trai 2


function addPicturesWallVer17(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 80;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1000;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 120;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1000;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer18(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 950,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 80;
    mesh.position.y = posY;
    mesh.position.z = posZ + 300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 120;
    mesh.position.y = posY;
    mesh.position.z = posZ + 300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer19(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 80;
    mesh.position.y = posY;
    mesh.position.z = posZ + 300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 120;
    mesh.position.y = posY;
    mesh.position.z = posZ + 300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer20(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 655, 350);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 80;
    mesh.position.y = posY;
    mesh.position.z = posZ + -300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 655, 350);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 120;
    mesh.position.y = posY;
    mesh.position.z = posZ - 300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


function addPicturesWallVer21(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 500;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 80;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1000;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 120;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1000;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


//hang tranh giua 2

function addPicturesWallVer22(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(550, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer23(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(550, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer24(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = -1250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(555, 455, 55);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 40;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(550, 450, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 1000;
    mesh.position.y = posY;
    mesh.position.z = posZ - 70;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


//hang tranh phai 2

function addPicturesWallVer25(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 0;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 550, 655);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 1300;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer26(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 650,
        posZ = 0;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ - 500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ - 500;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer27(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 450,
        posZ = 0;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/tranh1.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ + 200;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 350, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ + 200;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesWallVer28(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 550,
        posZ = 0;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 6; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(55, 650, 755);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 40;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1200;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(5, 650, 755);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 70;
    mesh.position.y = posY;
    mesh.position.z = posZ + 1200;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}


//resize window

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    // effect.setSize( window.innerWidth, window.innerHeight );

}

function animate(now) {

    requestAnimationFrame(animate);


    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    //const updated = cameraControls.update( delta );

    TWEEN.update();

    controls.update();
    render();

}

function render() {
    const timer = 0.0001 * Date.now();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    // console.log(scene.children);  



    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[0].object;

            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex( 0xff0000 );
            clientX = INTERSECTED.position.x;
            clientY = INTERSECTED.position.y;
            clientZ = INTERSECTED.position.z;
            nameObject = INTERSECTED.name;
            if (nameObject != "") {
                //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                //INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        }

    } else {

        // try {
        //     //if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        //     if (INTERSECTED != intersects[0].object) {
        //         INTERSECTED = intersects[0].object;
        //         //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        //         nameObject = INTERSECTED.name;
        //         INTERSECTED = null;
        //     }
        // } catch (error) {
        //     console.log(error);
        // }


    }



    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    // // camera.lookAt( scene.position );

    // for ( let i = 0, il = spheres.length; i < il; i ++ ) {

    //     const sphere = spheres[ i ];

    //     sphere.position.x = 5000 * Math.cos( timer + i );
    //     sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

    // }

    //console.log(clientX);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    renderer.render(scene, camera);
    // effect.render( scene, camera );
}



//rotate camera around object
const getNewPointOnVector = (p1, p2) => {
    let distAway = 200;
    let vector = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    let vl = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
    let vectorLength = { x: vector.x / vl, y: vector.y / vl, z: vector.z / vl };
    let v = { x: distAway * vectorLength.x, y: distAway * vectorLength.y, z: distAway * vectorLength.z };
    return { x: p2.x + v.x, y: p2.y + v.y, z: p2.z + v.z };
}


function cameraToMarker(marker) {
    const currentCamPosition = { x: marker.cameraPositionX, y: camera.position.y, z: marker.cameraPositionZ };
    const storedMarkerPosition = new THREE.Vector3(marker.positionX, marker.positionY, marker.positionZ);
    const newCameraTarget = getNewPointOnVector(currentCamPosition, storedMarkerPosition);
    const markerPosition = new THREE.Vector3(...Object.values(newCameraTarget));
    const startRotation = new THREE.Euler().copy(camera.rotation);
    camera.lookAt(storedMarkerPosition);
    const endRotation = new THREE.Euler().copy(camera.rotation);
    camera.rotation.copy(startRotation);

    new TWEEN.Tween(camera.rotation)
        .to({
            x: endRotation.x,
            y: endRotation.y,
            z: endRotation.z,
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            new TWEEN.Tween(camera.position)
                .to({
                    x: marker.cameraPositionX,
                    y: camera.position.y,
                    z: marker.cameraPositionZ,
                }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    camera.lookAt(storedMarkerPosition);
                })
                .onComplete(() => {
                    camera.lookAt(storedMarkerPosition);
                    radius = Math.hypot(...Object.values(markerPosition));
                    phi = Math.acos(markerPosition.y / radius);
                    theta = Math.atan2(markerPosition.z, markerPosition.x);
                    lon = THREE.Math.radToDeg(theta);
                    lat = 90 - THREE.Math.radToDeg(phi);
                })
                .start();
        })
        .start();
}