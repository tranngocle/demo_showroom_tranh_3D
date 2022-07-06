import * as THREE from '../src/build/three.module.js';
import { OrbitControls } from '../src/examples/jsm/controls/OrbitControls.js';
import { StereoEffect } from '../src/examples/jsm/effects/StereoEffect.js';
// import CameraControls from '../assets/js/dist/camera-controls.js';
// import { TWEEN } from '../assets/dist/tween.umd.js';


CameraControls.install( { THREE: THREE } );

// const TWEEN = require('@tweenjs/tween.js');


let container, stats;
let camera, scene, renderer,cameraControls;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
let clothGeometry;
let sphere;
let object,effect;

const spheres = [];

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let controls;
let clientX;
let clientY;
let clientZ;
let nameObject="";
let timeout1,timeout2, timeout3;
let mesh,mesh1,mesh2;
let totalPic=16; //
let cameraRig,cameraPerspectiveHelper, cameraOrthoHelper;

const clock = new THREE.Clock();
let  pathAnimation;
const video = document.getElementById('video');
video.volume = 0.001; // volumn video



init();

animate(0);

function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // scene

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xcce0ff );
        // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

        //scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 ); // using

        // camera

        // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.5, 10000 );
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        //camera.position.set( 1000, 50, 1500 );//default
        // camera.position.set( 1000, 0, 2000 );
        // camera.fov=10;
        
        camera.position.set( 0, 30, 2000 );

        


        // cameraRig = new THREE.Group();

        // cameraRig.add( camera );
        // // cameraRig.add( cameraOrtho );
        // scene.add( cameraRig );
        // lights

        scene.add( new THREE.AmbientLight( 0x666666 ) );










        const light = new THREE.DirectionalLight( 0xdfebff, 1 );
        light.position.set( 50, 200, 100 );
        light.position.multiplyScalar( 1.3 );

        light.castShadow = true;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        const d = 300;

        light.shadow.camera.left = - d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = - d;

        light.shadow.camera.far = 1000;

        scene.add( light );

        // ground
        const loader = new THREE.TextureLoader();
        
        //Get your video element:
        

        //Create your video texture:
        const videoTexture = new THREE.VideoTexture(video);
        
        const videoMaterial =  new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.FrontSide, toneMapped: false} );
        //Create screen
        // const screen = new THREE.PlaneGeometry(1, 1, 0);
        // const videoScreen = new THREE.Mesh(screen, videoMaterial);
        // scene.add(videoScreen);
        
        //const groundTexture = loader.load( '../src/examples/textures/terrain/grasslight-big.jpg' );
        const groundTexture = loader.load( '../assets/images/woodground.jpg' );
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
       


        //let mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
        mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
        mesh.position.y = - 250;
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        // poles
        // set skin

        const poleGeo = new THREE.BoxGeometry( 5, 375, 5 );
        const poleMat = new THREE.MeshLambertMaterial();
        const wallMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(0, 13, 20)" )});
        const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
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


        //wall custom new THREE.BoxGeometry( width x, height y, thickness z )


        // wall horizontal 
        const wall1 = new THREE.BoxGeometry( 5000, 1500, 50 );
        mesh = new THREE.Mesh( wall1, poleMat );
        mesh.position.y = - 250;
        mesh.position.x = 0;
        mesh.position.z = - 2100;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        scene.add( mesh );

        const wall2 = new THREE.BoxGeometry( 50, 1500, 2000 );
        mesh = new THREE.Mesh( wall2, poleMat );
        mesh.position.y = -250;
        mesh.position.x = -2475;
        mesh.position.z = -520;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        scene.add( mesh );

        const wall3 = new THREE.BoxGeometry( 50, 1500, 2000 );
        mesh = new THREE.Mesh( wall3, poleMat );
        mesh.position.y = -250;
        mesh.position.x = 2475;
        mesh.position.z = -520;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        scene.add( mesh );

        // wall vertical
        const wall_ver1 = new THREE.BoxGeometry( 50, 1000, 1000 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( wall_ver1, wallMat );
        mesh.position.y = - 250;
        mesh.position.x = 0 ;
        mesh.position.z = -375;
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        

        scene.add( mesh );

        const wall_ver2 = new THREE.BoxGeometry( 50, 1000, 1000 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( wall_ver2, wallMat );
        mesh.position.y = - 250;
        mesh.position.x = 1000;
        mesh.position.z = -375;
        mesh.receiveShadow = true;
        mesh.castShadow = false;

        scene.add( mesh );

        const wall_ver3 = new THREE.BoxGeometry( 50, 1000, 1000 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( wall_ver3, wallMat );
        mesh.position.y = - 250;
        mesh.position.x = -1000;
        mesh.position.z = -375;
        mesh.receiveShadow = true;
        mesh.castShadow = false;

        scene.add( mesh );

        // frame
        const frame_v_out1 = new THREE.BoxGeometry( 5, 155, 255 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_v_out1, frameMat );
        mesh.position.y = 0;
        mesh.position.x = 30;
        mesh.position.z = -55;
        mesh.receiveShadow = true;
        mesh.castShadow = false;

        scene.add( mesh );
        // image show
        const frame_ver1 = new THREE.BoxGeometry( 5, 150, 250 );
        //console.log(poleMat);
        mesh1 = new THREE.Mesh( frame_ver1, videoMaterial );
        mesh1.position.y = 0;
        mesh1.position.x = 33;
        mesh1.position.z = -55;
        mesh1.receiveShadow = true;
        mesh1.castShadow = false;
        mesh1.name="frame1";

        
        scene.add( mesh1 );
        //cameraRig.add(mesh1);
        // frame 1
        const frame_v_out2 = new THREE.BoxGeometry( 5, 155, 255 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_v_out2, frameMat );
        mesh.position.y = 0;
        mesh.position.x = 30;
        mesh.position.z = -370;
        mesh.receiveShadow = true;
        mesh.castShadow = false;

        scene.add( mesh );
        
        // image show
        const frame_ver2 = new THREE.BoxGeometry( 5, 150, 250 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_ver2, frameMaterial1 );
        mesh.position.y = 0;
        mesh.position.x = 33;
        mesh.position.z = -370;
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        mesh.name="frame2";

        scene.add( mesh );


        // frame 1
        const frame_v_out3 = new THREE.BoxGeometry( 5, 155, 255 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_v_out3, frameMat );
        mesh.position.y = 0;
        mesh.position.x = 30;
        mesh.position.z = -680;
        mesh.receiveShadow = true;
        mesh.castShadow = false;

        scene.add( mesh );
        // image show
        const frame_ver3 = new THREE.BoxGeometry( 5, 150, 250 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_ver3, videoMaterial );
        mesh.position.y = 0;
        mesh.position.x = 33;
        mesh.position.z = -680;
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        mesh.name="frame3";

        scene.add( mesh );

        
        //renderer

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container.appendChild( renderer.domElement );

        renderer.outputEncoding = THREE.sRGBEncoding;

        renderer.shadowMap.enabled = true;

        



        // effect = new StereoEffect( renderer );
        // effect.setSize( window.innerWidth, window.innerHeight );
        // controls
        // move mouse
        controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.5;
        // controls.minDistance = 1000;
        // controls.maxDistance = 5000;
        controls.minDistance = 1000;
        controls.maxDistance = 8000;
        controls.listenToKeyEvents( window ); // optional

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        // controls.enablePan = true;
        controls.enableZoom = true;
        //controls.screenSpacePanning = false;
        controls.screenSpacePanning = false;   // false key up go to, key down go back
        // controls.autoRotate = true;
        
        // controls.update();
        // performance monitor

        cameraControls = new CameraControls( camera, renderer.domElement );
        cameraControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        cameraControls.touches.one        = CameraControls.ACTION.TOUCH_ROTATE;
        cameraControls.touches.two        = CameraControls.ACTION.TOUCH_DOLLY_OFFSET;
        cameraControls.touches.three      = CameraControls.ACTION.TOUCH_OFFSET;




        const curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( - 3,   2, 1 ),
            new THREE.Vector3(   2,   2, 0 ),
            new THREE.Vector3( - 1,   0, 3 ),
            new THREE.Vector3(   2, - 1, 0 ),
        ] );

        const points = curve.getPoints( 50 );
        const pathMesh = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( points ),
            new THREE.LineBasicMaterial( { color: 0x00ffff } )
        );
        scene.add( pathMesh );

        const _tmp = new THREE.Vector3();
        pathAnimation = new TWEEN.Tween( { progress: 0 } )
            .to( { progress: 1 }, 3000 )
            .easing( TWEEN.Easing.Quadratic.Out )
            .onStart( function() {
                // disable user control while the animation
                cameraControls.enabled = false;
            } )
            .onUpdate( function( values ) {

                curve.getPoint ( values.progress, _tmp );
                const cameraX = _tmp.x;
                const cameraY = _tmp.y;
                const cameraZ = _tmp.z;
                const lookAtX = 0;
                const lookAtY = 0;
                const lookAtZ = 0;
                // let lookAtX = clientX;
                // let lookAtY = clientY;
                // let lookAtZ = clientZ;

                cameraControls.setLookAt( 
                    cameraX,
                    cameraY,
                    cameraZ,
                    lookAtX,
                    lookAtY,
                    lookAtZ,
                    false
                );

            } )
            .onComplete( function() {
                cameraControls.enabled = true;
            } );




        window.addEventListener( 'resize', onWindowResize );

        window.addEventListener( 'mousemove', onMouseMove, false );
        window.addEventListener( 'click', onMouseClick, false );

        window.requestAnimationFrame(render);

        // div detail pic
        document.getElementById('details-pic').style.width='0px';
        document.getElementById('details-pic').style.height='0px';

        document.getElementById('view-pic').style.width='0px';
        document.getElementById('view-pic').style.height='0px';

        

       
        // add pic to wall
        addPicturesBigBackWall(totalPic);
        
        addPicturesOppositeWallVer1(0);

        addPicturesWallVer2(1030);
        addPicturesOppositeWallVer2(1000);
        
        addPicturesWallVer2(-970);
        addPicturesOppositeWallVer2(-1000);
        // addPicturesWallVer2(-2450);
        addPicturesBigWallVer1(-2450)
        // addPicturesOppositeWallVer2(2480);
        addPicturesOppositeBigWallVer2(2480);
}

function moveToStartPoint() {

	//curve.getPoint ( 0, _tmp );
	// cameraControls.setLookAt( _tmp.x, _tmp.y, _tmp.z, 0, 0, 0, true );
    cameraControls.setLookAt( clientX, clientY, clientZ, clientX, 0, 0, true );
    // pathAnimation.start();
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //console.log(mouse.x);

}
function onMouseClick( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    moveToStartPoint() ;
    var timer1 = 5000;
    var timer2 = 7000;
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    

    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // console.log(clientX);
    // console.log(clientY);
    // console.log(clientZ);
    //console.log("Mesh name: "+nameObject);
    
    var styleDetails =  document.getElementById('details-pic').style;
    var styleViewPic =  document.getElementById('view-pic').style;
    // cameraControls.setFocalOffset(150, 0, 0, true );
    //var cameraControl = cameraControls.dolly(  1, true );
    // console.log(cameraControl);
    if (nameObject!=""){
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
           
/*
            styleDetails.width='300px';
            styleDetails.height='500px';
            styleDetails.color = 'white';
            styleDetails.right = "10px"; 
            styleDetails.top = "10px";    
            styleDetails.fontSize = '1.2rem';  

            styleViewPic.width='1080px';
            styleViewPic.height='450px';
            styleViewPic.color = 'white';
            styleViewPic.left = "10px"; 
            styleViewPic.top = "10px";    
            styleViewPic.fontSize = '1.2rem';  */
            

            // styleDetails.width='0px';
            // styleDetails.height='0px';
            // styleDetails.fontSize = '0rem';   
            
            // styleViewPic.width='0px';
            // styleViewPic.height='0px';
            // styleViewPic.fontSize = '0rem';   

            timeout1 = setTimeout(() => {
                camera.position.set( event.clientX, event.clientY, clientZ);    
                styleDetails.width='0px';
                styleDetails.height='0px';
                styleDetails.fontSize = '0rem';   
                
                styleViewPic.width='0px';
                styleViewPic.height='0px';
                styleViewPic.fontSize = '0rem';   
                
            
            }, timer1);
            timeout2 = setTimeout(() => {
                styleDetails.right = '-99999999px'; 
                styleViewPic.left = '-99999999px'; 
            
            }, timer2);

            //cameraRig.lookAt( [clientX,clientY,clientZ]);
            // cameraRig.lookAt(mesh1.position);

            nameObject="";

            // clientZ+=150;
            // clientX+=-100;
            // console.log(controls.getDistance());
            // camera.lookAt();
            
            timeout3 = setTimeout( () => {
                // // camera.fov+=35;
                // // console.log(camera.fov); // <- Outputs 90
                // // camera.zoom = 5;
                // // camera.updateProjectionMatrix();
                // gsap.to( controls.target, {
                //     duration: 2,
                //     x: clientX,
                //     // x: 0,
                //     y: 0,
                //     z: clientZ,                  
                //     onUpdate: function () {
                //         //camera.position.set( clientX, 0, clientZ );
                //         // camera.aspect = 0.5 * aspect;
                //         controls.update();
                        
                //     }
                // } );

                // gsap.to( camera, {
                //     duration: 3,
                //     zoom: 5,
                //     // x:clientX,
                //     // y:0,
                //     // z:clientZ,
                //     // focus:10,
                //     fov: 10,
                //     // far:10000,
                //     // aspect:0.5 * aspect,
                //     near:0.1,
                //     // far : 1500,
                    
                //     onUpdate: function () {
                //         // camera.aspect = 0.5 * aspect;
                //         // renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );                        
                //         // camera.setViewOffset( SCREEN_WIDTH, SCREEN_HEIGHT, clientX, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
                //         // camera.setRotationFromAxisAngle(500,100);
                //         camera.updateProjectionMatrix();
                    
                //     }
                // } );
                
                
                // gsap.to( controls, {
                //     duration: 3,
                //     autoRotate:true,
                //     // touches :{
                //     //     ONE: THREE.TOUCH.DOLLY_PAN,
	            //     //     TWO: THREE.TOUCH.ROTATE,
                //     // },
                //     autoRotateSpeed:1,
                //     enableZoom:true,                    
                //     // autoRotate:true,  
                //     onUpdate: function () {
                        
                //         //camera.position.set( clientX, 0, clientZ );
                //         // camera.aspect = 0.5 * aspect;
                //         controls.update();
                        
                //     }
                // } );
            
            }, 1000 );


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


function addPicturesBigBackWall(totalPic){ //max pic: 16
    let frame_v_out,frame_ver;

    /*  position wall 1
        mesh.position.y = - 250;
        mesh.position.x = 0;
        mesh.position.z = - 1500;
    */
    let posX=2250,posY=0,posZ= -2060;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=totalPic;i++){
        // frame
        // frame_v_out = new THREE.BoxGeometry( 205, 105, 5 );
        // //console.log(poleMat);
        // mesh = new THREE.Mesh( frame_v_out, frameMat );
        // mesh.position.x = posX + (-172);
        // mesh.position.y = posY;        
        // mesh.position.z = posZ ;
        // mesh.receiveShadow = true;
        // mesh.castShadow = false;

        // scene.add( mesh );
        
        
        //posZ = posZ + (-170);

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
        frame_ver = new THREE.BoxGeometry( 250, 150, 2 );
        //console.log(poleMat);
        mesh = new THREE.Mesh( frame_ver, frameMaterial );
        mesh.position.x = posX;
        mesh.position.y = 0;        
        mesh.position.z = posZ ;
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        mesh.name="bigbackwall_1"+i;
        scene.add( mesh );


        posX +=(-300);
    }
   
   
}

function addPicturesWallVer1(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;
    */
    let posX=positionX,posY=0,posZ= -55;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=3;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry( 2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX +3;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="wallver_1_"+i; 
         
         scene.add( mesh ); 
         posZ+=(-300)
    }
}  

function addPicturesWallVer2(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;

        ver 2
        positionX = 930
    */
    let posX=positionX,posY=0,posZ= -55;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=3;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry( 2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX +5;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="wallver_2_"+i; 
        //  console.log(mesh.name);
         scene.add( mesh ); 
         posZ+=(-300)
    }
}  

function addPicturesBigWallVer1(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;

        ver 2
        positionX = 930
    */
    let posX=positionX,posY=0,posZ= 250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=6;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry( 2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX +5;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="wallver_2_"+i; 
         
         scene.add( mesh ); 
         posZ+=(-300)
    }
}  
function addPicturesOppositeBigWallVer2(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;

        ver 2
        positionX = 930
    */
    let posX=positionX,posY=0,posZ= 250;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=6;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry(2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX-30;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX - 35;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="opwallver_2_"+i; 
         
         scene.add( mesh ); 
         posZ+=(-300)
    }
}
function addPicturesOppositeWallVer1(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;

        ver 2
        positionX = 930
    */
    let posX=positionX,posY=0,posZ= -55;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=3;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry( 2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX-30;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX - 35;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="opwallver_1_"+i; 
         
         scene.add( mesh ); 
         posZ+=(-300)
    }
}  

function addPicturesOppositeWallVer2(positionX){ //max pic: 3
    let frame_v_out,frame_ver;

    /*  position wall ver 2
        mesh.position.y = - 250;
        mesh.position.x = 900;
        mesh.position.z = -375;

        ver 2
        positionX = 930
    */
    let posX=positionX,posY=0,posZ= -55;
    const loader = new THREE.TextureLoader();
    const frameTexture = loader.load( '../assets/images/puppy2.jpg' );
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
    frameTexture.repeat.set(1, 1 );
    frameTexture.anisotropy = 16;
    frameTexture.encoding = THREE.sRGBEncoding;

    const frameMaterial = new THREE.MeshLambertMaterial( { map: frameTexture } );
    const frameMat = new THREE.MeshLambertMaterial({color:new THREE.Color("rgb(36, 36, 36)" )});
    
    for (var i=1;i<=3;i++){
       
         // frame
         frame_v_out = new THREE.BoxGeometry( 2, 155, 255 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_v_out, frameMat );
         mesh.position.x = posX-30;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
 
         scene.add( mesh );
         // image show
         frame_ver = new THREE.BoxGeometry( 2, 150, 250 );
         //console.log(poleMat);
         mesh = new THREE.Mesh( frame_ver, frameMaterial );
         mesh.position.x = posX - 35;
         mesh.position.y = posY;         
         mesh.position.z = posZ;
         mesh.receiveShadow = true;
         mesh.castShadow = false;
         mesh.name="opwallver_2_"+i; 
         
         scene.add( mesh ); 
         posZ+=(-300)
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    // effect.setSize( window.innerWidth, window.innerHeight );

}
function animate( now ) {

    
    const delta = clock.getDelta();
	const elapsed = clock.getElapsedTime();
	const updated = cameraControls.update( delta );
    
    requestAnimationFrame( animate );

    

	// if ( elapsed > 30 ) { return; }

	//requestAnimationFrame( anim );

	TWEEN.update( elapsed * 1000 );

	if ( updated ) {

		renderer.render( scene, camera );
		console.log( 'rendered' );

	}
      
    // TWEEN.update();

    controls.update();
    render();

    }

function render() {
    const timer = 0.0001 * Date.now();
    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
    // console.log(scene.children);  
    


    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            
            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex( 0xff0000 );
            clientX=INTERSECTED.position.x;
            clientY=INTERSECTED.position.y;
            clientZ=INTERSECTED.position.z;
            nameObject=INTERSECTED.name;
            if (nameObject!=""){
                //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                //INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        }

    } else {

        try {
            //if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            if ( INTERSECTED != intersects[ 0 ].object ) {
                INTERSECTED = intersects[ 0 ].object;
                //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                nameObject=INTERSECTED.name;
                INTERSECTED = null;
            }
        } catch (error) {
                console.log(error);
        }
       

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
    
    renderer.render( scene, camera );
    // effect.render( scene, camera );
}