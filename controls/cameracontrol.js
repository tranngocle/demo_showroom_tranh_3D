CameraControls.install( { THREE: THREE } );

const width  = window.innerWidth;
const height = window.innerHeight;
const clock = new THREE.Clock();
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 100 );
camera.position.set( 0, 0, 5 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

const cameraControls = new CameraControls( camera, renderer.domElement );

const mesh = new THREE.Mesh(
	new THREE.BoxGeometry( 1, 1, 1 ),
	new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
);
scene.add( mesh );

const gridHelper = new THREE.GridHelper( 50, 50 );
gridHelper.position.y = - 1;
scene.add( gridHelper );

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
const pathAnimation = new TWEEN.Tween( { progress: 0 } )
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

function moveToStartPoint() {

	curve.getPoint ( 0, _tmp );
	cameraControls.setLookAt( _tmp.x, _tmp.y, _tmp.z, 0, 0, 0, true );

}

renderer.render( scene, camera );

( function anim () {

	const delta = clock.getDelta();
	const elapsed = clock.getElapsedTime();
	const updated = cameraControls.update( delta );

	// if ( elapsed > 30 ) { return; }

	requestAnimationFrame( anim );

	TWEEN.update( elapsed * 1000 );

	if ( updated ) {

		renderer.render( scene, camera );
		console.log( 'rendered' );

	}

} )();