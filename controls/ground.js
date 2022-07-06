import * as THREE from '../src/build/three.module.js';
import { OrbitControls } from '../src/examples/jsm/controls/OrbitControls.js';
import { StereoEffect } from '../src/examples/jsm/effects/StereoEffect.js';
import { TrackballControls } from '../src/examples/jsm/controls/TrackballControls.js';
import { RectAreaLightHelper } from '../src/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '../src/examples/jsm/lights/RectAreaLightUniformsLib.js';
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
    scene.background = new THREE.Color(0xcce0ff);
    // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    //scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 ); // using

    // camera

    // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.5, 10000 );
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    //camera.position.set( 1000, 50, 1500 );//default
    // camera.position.set( 1000, 0, 2000 );
    // camera.fov=10;

    camera.position.set(0, 200, 10000);
    cameraRig = new THREE.Group();

    cameraRig.add(camera);
    // cameraRig.add( cameraOrtho );
    scene.add(cameraRig);
    // lights

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.far = 1000;

    scene.add(light);

    RectAreaLightUniformsLib.init();

    // const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 1000, 900 );
    // rectLight1.position.set(  500, 5, -200 );
    // rectLight1.rotation.y = -300;
    // scene.add( rectLight1 );
    const rectLight1 = new THREE.RectAreaLight(0xff0000, 150, 1500, 100);
    rectLight1.position.set(-4959, 1000, -5500);
    rectLight1.rotation.y = -1000;
    rectLight1.rotation.x = 300;
    rectLight1.rotation.z = -300;
    // rectLight1.lookAt(0, 0, 0);
    scene.add(rectLight1);

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

    const rectLight4 = new THREE.RectAreaLight(0xff0000, 150, 1500, 100);
    rectLight4.position.set(230, 600, -5000);
    rectLight4.rotation.y = -1000;
    rectLight4.rotation.x = 300;
    rectLight4.rotation.z = -300;
    // rectLight1.lookAt(0, 0, 0);
    scene.add(rectLight4);

    const rectLight5 = new THREE.RectAreaLight(0xFF9B00, 150, 1500, 100);
    rectLight5.position.set(4900, 1000, -5000);
    rectLight5.rotation.y = 1000;
    rectLight5.rotation.x = 300;
    rectLight5.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    scene.add(rectLight5);

    const rectLight6 = new THREE.RectAreaLight(0xFF9B00, 150, 1500, 100);
    rectLight6.position.set(170, 600, -5000);
    rectLight6.rotation.y = 1000;
    rectLight6.rotation.x = 300;
    rectLight6.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    scene.add(rectLight6);

    const rectLight7 = new THREE.RectAreaLight(0xFF6400, 150, 1500, 100);
    rectLight7.position.set(0, 1000, -2100);
    // rectLight7.rotation.y = 1000;
    rectLight7.rotation.x = 300;
    // rectLight7.rotation.z = 300;
    // rectLight1.lookAt(0, 0, 0);
    scene.add(rectLight7);

    scene.add(new RectAreaLightHelper(rectLight1));
    // scene.add( new RectAreaLightHelper( rectLight2 ) );
    // scene.add( new RectAreaLightHelper( rectLight3 ) );
    scene.add(new RectAreaLightHelper(rectLight4));
    scene.add(new RectAreaLightHelper(rectLight5));
    scene.add(new RectAreaLightHelper(rectLight6));
    scene.add(new RectAreaLightHelper(rectLight7));


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
    const groundTexture = loader.load('../assets/images/floor6.jpg');
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
    const poleMat = new THREE.MeshStandardMaterial();
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

    const box_wellcome_bottom = new THREE.BoxGeometry(100, 30, 100);
    mesh = new THREE.Mesh(box_wellcome_bottom, poleMat);
    mesh.position.y = -250;
    mesh.position.x = -500;
    mesh.position.z = 7000;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const box_wellcome_middel = new THREE.BoxGeometry(30, 250, 30);
    mesh = new THREE.Mesh(box_wellcome_middel, poleMat);
    mesh.position.y = -220;
    mesh.position.x = -500;
    mesh.position.z = 7000;

    scene.add(mesh);

    const box_wellcome_top = new THREE.BoxGeometry(300, 300, 20);
    mesh = new THREE.Mesh(box_wellcome_top, poleMat);
    mesh.position.y = 50;
    mesh.position.x = -500;
    mesh.rotation.x = -500;
    mesh.position.z = 7000;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    //wall custom new THREE.BoxGeometry( width x, height y, thickness z )


    const floor_g_o = new THREE.BoxGeometry(10500, 50, 15000);
    mesh = new THREE.Mesh(floor_g_o, poleMat);
    mesh.position.y = 2300;
    mesh.rotation.x = 0;
    mesh.position.z = 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    // const floor_g_o_1 = new THREE.BoxGeometry(10000, 50, 5800);
    // mesh = new THREE.Mesh(floor_g_o_1, poleMat);
    // mesh.position.y = 2000;
    // mesh.position.x = 0;
    // mesh.position.z = -4650;
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;

    // scene.add(mesh);


    //wall on floor
    const floor_w_5 = new THREE.BoxGeometry(500, 5500, 300);
    mesh = new THREE.Mesh(floor_w_5, poleMat);
    mesh.position.y = 50;
    mesh.position.x = -2500;
    mesh.position.z = 2500;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);



    const floor_w_6 = new THREE.BoxGeometry(500, 5500, 300);
    mesh = new THREE.Mesh(floor_w_6, poleMat);
    mesh.position.y = 50;
    mesh.position.x = 2500;
    mesh.position.z = 2500;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    const floor_w_7 = new THREE.BoxGeometry(500, 5500, 300);
    mesh = new THREE.Mesh(floor_w_7, poleMat);
    mesh.position.y = 50;
    mesh.position.x = -2500;
    mesh.position.z = -400;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);



    const floor_w_8 = new THREE.BoxGeometry(500, 5500, 300);
    mesh = new THREE.Mesh(floor_w_8, poleMat);
    mesh.position.y = 50;
    mesh.position.x = 2500;
    mesh.position.z = -400;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    // wall horizontal gama
    const wall1 = new THREE.BoxGeometry(2000, 3000, 40);
    mesh = new THREE.Mesh(wall1, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 0;
    mesh.position.z = -2100;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wallmaxleft = new THREE.BoxGeometry(40, 5000, 15000);
    mesh = new THREE.Mesh(wallmaxleft, poleMat);
    mesh.position.y = -250;
    mesh.position.x = -5000;
    mesh.position.z = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallmaxright = new THREE.BoxGeometry(40, 5000, 15000);
    mesh = new THREE.Mesh(wallmaxright, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 5000;
    mesh.position.z = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wallmaxbottom = new THREE.BoxGeometry(10000, 5000, 40);
    mesh = new THREE.Mesh(wallmaxbottom, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 0;
    mesh.position.z = -7500;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallmaxtop = new THREE.BoxGeometry(10000, 700, 40);
    mesh = new THREE.Mesh(wallmaxtop, poleMat);
    mesh.position.y = 2100;
    mesh.position.x = 0;
    mesh.position.z = 7500;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);



    const wall1left = new THREE.BoxGeometry(3200, 3000, 40);
    mesh = new THREE.Mesh(wall1left, poleMat);
    mesh.position.y = 750;
    mesh.position.x = -3495;
    mesh.position.z = 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wall1right = new THREE.BoxGeometry(3200, 3000, 40);
    mesh = new THREE.Mesh(wall1right, poleMat);
    mesh.position.y = 750;
    mesh.position.x = 3495;
    mesh.position.z = 7400;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    //tuong gan tranh phia truoc

    const wallpic1right = new THREE.BoxGeometry(1300, 1000, 30);
    mesh = new THREE.Mesh(wallpic1right, poleMat);
    mesh.position.y = 300;
    mesh.position.x = 2500;
    mesh.position.z = -200;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallpic1left = new THREE.BoxGeometry(1300, 1000, 30);
    mesh = new THREE.Mesh(wallpic1left, poleMat);
    mesh.position.y = 300;
    mesh.position.x = -2500;
    mesh.position.z = -200;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    const wallpic1bet_ver1 = new THREE.BoxGeometry(50, 2000, 1500);
    mesh = new THREE.Mesh(wallpic1bet_ver1, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 800;
    mesh.position.z = 900;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    const wallpic1bet_ver3 = new THREE.BoxGeometry(50, 2000, 1500);
    mesh = new THREE.Mesh(wallpic1bet_ver3, poleMat);
    mesh.position.y = -250;
    mesh.position.x = -700;
    mesh.position.z = 900;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);


    //tuong gan tranh phia trong

    const wallpic_ho_1 = new THREE.BoxGeometry(50, 2000, 2000);
    mesh = new THREE.Mesh(wallpic_ho_1, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 200;
    mesh.position.z = -5000;

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);



    const wallpic_ho_2 = new THREE.BoxGeometry(50, 2000, 2000);
    mesh = new THREE.Mesh(wallpic_ho_2, poleMat);
    mesh.position.y = -250;
    mesh.position.x = 2000;
    mesh.position.z = -5000;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);


    const wallpic_ho_3 = new THREE.BoxGeometry(50, 2000, 2000);
    mesh = new THREE.Mesh(wallpic_ho_3, poleMat);
    mesh.position.y = -250;
    mesh.position.x = -2000;
    mesh.position.z = -5000;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);

    //renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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
    // controls.minDistance = 1000;
    // controls.maxDistance = 5000;
    controls.minDistance = 1000;
    controls.maxDistance = 8000;
    controls.listenToKeyEvents(window); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    // controls.enablePan = true;
    controls.enableZoom = true;


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
    addPicturesBigBackWall(totalPic);

    //addPicturesWallVer1(-2400);

    addPicturesWallLeft(-2900);
    addPicturesWallRight1(2900);

    addPictureBigWallMiddel(4000);

    addPictureBigWallLeft(-4950);

    addPictureBigWallRight(4950);

    addPicturesWallVer1(-700);

    addPicturesWallVer2(800);

    addPicturesWallVer3(-700);

    addPicturesWallVer4(800);

    addPicturesOppositeWallVer1(-2000);

    addPicturesOppositeWallVer2(-2000);

    addPicturesOppositeWallVer3(200);

    addPicturesOppositeWallVer4(200);

    addPicturesOppositeWallVer5(2000);

    addPicturesOppositeWallVer6(2000);
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
    var timer2 = 7000;
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
        // console.log(position1);
        // //console.log(event.clientz);
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


function addPicturesBigBackWall(totalPic) { //max pic: 16
    let frame_v_out_1, frame_ver_1, frame_v_out_2, frame_ver_2;

    /*  position wall 1
        mesh.position.y = - 250;
        mesh.position.x = 0;
        mesh.position.z = - 1500;
    */
    let posX = 0,
        posY = 400,
        posZ = -2050;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/fpt_1.png');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= totalPic; i++) {
    // frame
    frame_v_out_1 = new THREE.BoxGeometry(1400, 1000, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX; //+ (-172);
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);

    // posZ = posZ + (170);

    /*
     frame_v_out = new THREE.BoxGeometry( 255, 155, 2 );
    //console.log(poleMat);
    mesh = new THREE.Mesh( frame_v_out, frameMat );
    mesh.position.x = posX;
    mesh.position.y = posY;        
    mesh.position.z = posZ-5 ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    scene.add( mesh );*/

    // image show
    frame_ver_1 = new THREE.BoxGeometry(1000, 500, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = 350;
    mesh.position.z = posZ + 15;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "bigbackwall_1"; //+ i;
    scene.add(mesh);


    posX += (-300);

    //}


}


function addPicturesWallLeft(positionX) { //max pic: 3
    let frame_v_out1, frame_ver1, frame_v_out2, frame_ver2, frame_v_out3, frame_ver3;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
    */
    let posX = positionX,
        posY = 500,
        posZ = 100;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out1 = new THREE.BoxGeometry(200, 155, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out1, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 280;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver1 = new THREE.BoxGeometry(400, 450, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver1, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 260;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "PiVL1"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}

    //frame pic 2 ver 1 left
    frame_v_out2 = new THREE.BoxGeometry(400, 300, 2);

    mesh = new THREE.Mesh(frame_v_out2, frameMat);
    mesh.position.x = posX + 700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 20;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    //image show pic 2 ver 1 left

    frame_ver2 = new THREE.BoxGeometry(500, 400, 2);

    mesh = new THREE.Mesh(frame_ver2, frameMaterial);
    mesh.position.x = posX + 700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 30;
    mesh.name = "PiVL2";

    scene.add(mesh);
    posZ += (-300);


    //frame pic 3 ver 1 left
    frame_v_out3 = new THREE.BoxGeometry(400, 300, 2);

    mesh = new THREE.Mesh(frame_v_out3, frameMat);
    mesh.position.x = posX + 700;
    mesh.position.y = posY - 450;
    mesh.position.z = posZ + 330;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    //image show pic 3 ver 1 left

    frame_ver3 = new THREE.BoxGeometry(500, 400, 2);

    mesh = new THREE.Mesh(frame_ver3, frameMaterial);
    mesh.position.x = posX + 700;
    mesh.position.y = posY - 450;
    mesh.position.z = posZ + 350;
    mesh.name = "PiVL3";

    scene.add(mesh);
    posZ += (-300);


}

function addPicturesWallRight1(positionX) {



    let frame_v_out1, frame_ver1, frame_v_out2, frame_ver2, frame_v_out3, frame_ver3;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
    */
    let posX = positionX,
        posY = 500,
        posZ = 100;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });


    // frame
    frame_v_out1 = new THREE.BoxGeometry(200, 155, 5);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out1, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 280;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver1 = new THREE.BoxGeometry(400, 450, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver1, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ - 260;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "PiVR1"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}

    //frame pic 2 ver 1 left
    frame_v_out2 = new THREE.BoxGeometry(400, 300, 2);

    mesh = new THREE.Mesh(frame_v_out2, frameMat);
    mesh.position.x = posX - 700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 20;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    //image show pic 2 ver 1 left

    frame_ver2 = new THREE.BoxGeometry(500, 400, 2);

    mesh = new THREE.Mesh(frame_ver2, frameMaterial);
    mesh.position.x = posX - 700;
    mesh.position.y = posY;
    mesh.position.z = posZ + 30;
    mesh.name = "PiVR2";

    scene.add(mesh);
    posZ += (-300);


    //frame pic 3 ver 1 left
    frame_v_out3 = new THREE.BoxGeometry(400, 300, 2);

    mesh = new THREE.Mesh(frame_v_out3, frameMat);
    mesh.position.x = posX - 700;
    mesh.position.y = posY - 450;
    mesh.position.z = posZ + 330;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    //image show pic 3 ver 1 left

    frame_ver3 = new THREE.BoxGeometry(500, 400, 2);

    mesh = new THREE.Mesh(frame_ver3, frameMaterial);
    mesh.position.x = posX - 700;
    mesh.position.y = posY - 450;
    mesh.position.z = posZ + 350;
    mesh.name = "PiVR3";

    scene.add(mesh);
    posZ += (-300);

}

function addPictureBigWallMiddel(positionX) { //max pic: 3
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
        posY = 500,
        posZ = -7450;
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
    frame_v_out_1 = new THREE.BoxGeometry(455, 255, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(450, 250, 2);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ + 5;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; // + i;
    //  console.log(mesh.name);
    scene.add(mesh);
    posZ += (-300)
        //}
}



function addPictureBigWallLeft(positionX) { //max pic: 3
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
        posY = 500,
        posZ = -6000;
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
    frame_v_out_1 = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX + 10;
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



function addPictureBigWallRight(positionX) { //max pic: 3
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
        posY = 500,
        posZ = -6000;
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
    frame_v_out_1 = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out_1, frameMat);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.receiveShadow = true;
    mesh.castShadow = false;


    scene.add(mesh);
    // image show
    frame_ver_1 = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver_1, frameMaterial);
    mesh.position.x = posX - 10;
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
        posY = 500,
        posZ = 900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 5;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 30;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
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
        posY = 500,
        posZ = 900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 5;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 30;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
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
        posY = 500,
        posZ = 900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 25;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 30;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
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
        posY = 500,
        posZ = 900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 25;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 30;
    mesh.position.y = posY;
    mesh.position.z = posZ + 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "wallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}



function addPicturesOppositeWallVer1(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_2_"; //+ i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesOppositeWallVer2(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load('../assets/images/puppy2.jpg');
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1);
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;
    const frameMaterial = new THREE.MeshLambertMaterial({ map: frameTexture });
    const frameMat = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(36, 36, 36)") });

    // for (var i = 1; i <= 3; i++) {

    // frame
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_1_"; // + i;

    scene.add(mesh);
    posZ += (-300)
        // }
}

function addPicturesOppositeWallVer3(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_2_"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPicturesOppositeWallVer4(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_2_"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}
}


function addPicturesOppositeWallVer5(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX - 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX - 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_2_"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}
}

function addPicturesOppositeWallVer6(positionX) { //max pic: 3
    let frame_v_out, frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
mesh.position.x = 900;
        mesh.position.z = -375;
        ver 2
        positionX = 930
    */
    let posX = positionX,
        posY = 500,
        posZ = -3900;
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
    frame_v_out = new THREE.BoxGeometry(2, 255, 455);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_v_out, frameMat);
    mesh.position.x = posX + 30;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    scene.add(mesh);
    // image show
    frame_ver = new THREE.BoxGeometry(2, 250, 450);
    //console.log(poleMat);
    mesh = new THREE.Mesh(frame_ver, frameMaterial);
    mesh.position.x = posX + 35;
    mesh.position.y = posY;
    mesh.position.z = posZ - 400;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = "opwallver_2_"; // + i;

    scene.add(mesh);
    posZ += (-300)
        //}
}


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