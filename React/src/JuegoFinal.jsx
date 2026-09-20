
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function JuegoFinal() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        // ==========================================
        // ESCENA
        // ==========================================

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(0x87ceeb);

        // ==========================================
        // CÁMARA - VISTA DEL BATEADOR
        // ==========================================

        const camera = new THREE.PerspectiveCamera(
            65,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );

        // La cámara está detrás de Home Plate,
        // como si fueran los ojos del bateador.
        camera.position.set(
            0,
            2.1,
            12
        );

        // Mirar hacia el pitcher
        camera.lookAt(
            0,
            1.8,
            1
        );

        // ==========================================
        // RENDERER
        // ==========================================

        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.shadowMap.enabled = true;

        container.appendChild(renderer.domElement);

        // ==========================================
        // LUCES
        // ==========================================

        const ambientLight = new THREE.AmbientLight(
            0xE3E3FF,
            1
        );

        scene.add(ambientLight);

        const sun = new THREE.DirectionalLight(
            0xE3E3FF,
            2
        );

        sun.position.set(
            10,
            30,
            15
        );

        sun.castShadow = true;

        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;

        scene.add(sun);

        // ==========================================
        // ESTADIO
        // ==========================================

        const stadium = new THREE.Group();

        scene.add(stadium);

        // ==========================================
        // PELOTA
        // ==========================================

        const ballGeometry = new THREE.SphereGeometry(0.08, 32, 32);

        const ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        const ball = new THREE.Mesh(
            ballGeometry,
            ballMaterial
        );

        ball.castShadow = true;
        stadium.add(ball);                                  


        //donde empieza y donde termina la pelota
        const pitchStart = new THREE.Vector3(0, 0.7, 0.5);
        const pitchEnd = new THREE.Vector3(0, 0.7, 14.2);

        ball.position.copy(pitchStart);

        const pitchSpeed = 1.5; // Velocidad de la pelota (ajustable)
        let pitchProgress = 0;

        const clock = new THREE.Clock();


        // ==========================================
        // SISTEMA DE BATEO VARIABLES
        // ==========================================

        let swing = false;
        let swingTimer = 0;
        let hit = false;
        let hitDirection = 0;

        const swingDuration = 0.20;
        const hitDistance = 1.0;




        

        // ==========================================
        // CÉSPED
        // ==========================================

        const grassGeometry =
            new THREE.PlaneGeometry(
                60,
                60
            );

        const grassMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x194c1f
            });

        const grass = new THREE.Mesh(
            grassGeometry,
            grassMaterial
        );

        grass.rotation.x =
            -Math.PI / 2;

        grass.receiveShadow = true;

        stadium.add(grass);

        // ==========================================
        // DIAMANTE DE TIERRA
        // ==========================================

        const dirtGeometry =
            new THREE.PlaneGeometry(
                14,
                14
            );

        const dirtMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x412406
            });

        const dirt = new THREE.Mesh(
            dirtGeometry,
            dirtMaterial
        );

        dirt.rotation.x =
            -Math.PI / 2;

        dirt.rotation.z =
            Math.PI / 4;

        dirt.position.y =
            0.02;

        dirt.receiveShadow = true;

        stadium.add(dirt);

        // ==========================================
        // CÉSPED DEL INTERIOR
        // ==========================================

        const infieldGeometry =
            new THREE.CircleGeometry(
                5.7,
                64
            );

        const infieldMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x194c1f
            });

        const infield = new THREE.Mesh(
            infieldGeometry,
            infieldMaterial
        );

        infield.rotation.x =
            -Math.PI / 2;

        infield.position.y =
            0.04;

        stadium.add(infield);

        // ==========================================
        // FUNCIÓN BASE
        // ==========================================

        function crearBase(x, z) {
            const geometry =
                new THREE.BoxGeometry(
                    1,
                    0.15,
                    1
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0xffffff
                });

            const base =
                new THREE.Mesh(
                    geometry,
                    material
                );

            base.position.set(
                x,
                0.12,
                z
            );

            base.rotation.y =
                Math.PI / 4;

            base.castShadow = true;

            stadium.add(base);
        }

        // ==========================================
        // BASES
        // ==========================================

        crearBase(4.5, 1.8);

        crearBase(0, -2.7);

        crearBase(-4.5, 1.8);

        // ==========================================
        // HOME PLATE
        // ==========================================

        const homeShape =
            new THREE.Shape();

        homeShape.moveTo(
            -0.8,
            0.5
        );

        homeShape.lineTo(
            0.8,
            0.5
        );

        homeShape.lineTo(
            0.8,
            -0.2
        );

        homeShape.lineTo(
            0,
            -0.8
        );

        homeShape.lineTo(
            -0.8,
            -0.2
        );

        homeShape.closePath();

        const homeGeometry =
            new THREE.ShapeGeometry(
                homeShape
            );

        const homeMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            });

        const home =
            new THREE.Mesh(
                homeGeometry,
                homeMaterial
            );

        home.rotation.x =
            -Math.PI / 2;

        home.position.set(
            0,
            0.13,
            6.4
        );

        stadium.add(home);

        
        // ==========================================
        // JUGADOR
        // ==========================================


        // El modelo se coloca a la izquierda de la placa original.
        const homePlateLoader = new GLTFLoader();
        let loadedHomePlate = null;
        let componentUnmounted = false;

        homePlateLoader.load(
            `${import.meta.env.BASE_URL}modelos/Modelo_base.glb`,
            (gltf) => {
                if (componentUnmounted) return;

                loadedHomePlate = gltf.scene;

                const modelBounds = new THREE.Box3().setFromObject(
                    loadedHomePlate
                );
                const modelSize = modelBounds.getSize(
                    new THREE.Vector3()
                );
                const largestDimension = Math.max(
                    modelSize.x,
                    modelSize.y,
                    modelSize.z
                );

                if (largestDimension > 0) {
                    loadedHomePlate.scale.setScalar(
                        1.6 / largestDimension
                    );
                }

                loadedHomePlate.updateMatrixWorld(true);

                const fittedBounds = new THREE.Box3().setFromObject(
                    loadedHomePlate
                );
                const fittedCenter = fittedBounds.getCenter(
                    new THREE.Vector3()
                );

                loadedHomePlate.position.set(
                    -0.8 - fittedCenter.x,
                    0.13 - fittedBounds.min.y,
                    8.4 - fittedCenter.z
                );

                loadedHomePlate.traverse((child) => {
                    if (!child.isMesh) return;

                    child.castShadow = true;
                    child.receiveShadow = true;
                });

                stadium.add(loadedHomePlate);
            },
            undefined,
            (error) => {
                console.error(
                    "No se pudo cargar el modelo GLB del home plate. Se conserva la placa de respaldo.",
                    error
                );
            }
        );

        // ==========================================
        // PITCHER'S MOUND
        // ==========================================

        const moundGeometry =
            new THREE.CylinderGeometry(
                0.8,
                0.8,
                0.10,
                64
            );

        const moundMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x31230c
            });

        const mound =
            new THREE.Mesh(
                moundGeometry,
                moundMaterial
            );

        mound.position.set(
            0,
            0.15,
            1
        );

        mound.castShadow = true;

        stadium.add(mound);




        // ==========================================
        // PLACA DEL PITCHER
        // ==========================================
/*
        const pitcherPlateGeometry =
            new THREE.BoxGeometry(
                0.8,
                0.08,
                0.3
            );

        const pitcherPlateMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2a8034
            });

        const pitcherPlate =
            new THREE.Mesh(
                pitcherPlateGeometry,
                pitcherPlateMaterial
            );

        pitcherPlate.position.set(
            0,
            0.3,
            1
        );

        stadium.add(
            pitcherPlate
        );
*/




        // ==========================================
        // LÍNEAS DEL CAMPO
        // ==========================================

        function crearLinea(
            x,
            z,
            rotation
        ) {
            const geometry =
                new THREE.PlaneGeometry(
                    0.12,
                    9
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0xffffff
                });

            const line =
                new THREE.Mesh(
                    geometry,
                    material
                );

            line.rotation.x =
                -Math.PI / 2;

            line.rotation.z =
                rotation;

            line.position.set(
                x,
                0.08,
                z
            );

            stadium.add(line);
        }

        crearLinea(
            2.5,
            4.2,
            -Math.PI / 4
        );

        crearLinea(
            -2.5,
            4.2,
            Math.PI / 4
        );

        // ==========================================
        // CÍRCULO DEL PITCHER
        // ==========================================
        /*
        const ringGeometry =
            new THREE.RingGeometry(
                1.35,
                1.45,
                64
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.rotation.x =
            -Math.PI / 2;

        ring.position.set(
            0,
            0.31,
            1
        );

        stadium.add(ring);
        */
        // ==========================================
        // GRADAS
        // ==========================================

        function crearGrada(
            x,
            y,
            z,
            width,
            depth
        ) {
            const geometry =
                new THREE.BoxGeometry(
                    width,
                    1,
                    depth
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0x555555
                });

            const grada =
                new THREE.Mesh(
                    geometry,
                    material
                );

            grada.position.set(
                x,
                y,
                z
            );

            grada.castShadow = true;

            grada.receiveShadow = true;

            stadium.add(grada);
        }

        for (
            let i = 0;
            i < 5;
            i++
        ) {
            crearGrada(
                0,
                0.5 + i * 0.6,
                -18 - i * 1.2,
                35,
                1
            );
        }

        // ==========================================
        // PEQUEÑO MOVIMIENTO DE CÁMARA
        // ==========================================

        let mouseX = 0;

        let mouseY = 0;

        function mouseMove(event) {
            const rect =
                renderer.domElement.getBoundingClientRect();

            mouseX =
                ((event.clientX - rect.left) /
                    rect.width) *
                    2 -
                1;

            mouseY =
                ((event.clientY - rect.top) /
                    rect.height) *
                    2 -
                1;
        }

        renderer.domElement.addEventListener(
            "mousemove",
            mouseMove
        );


        // ==========================================
        // CONTROL DE BATEO
        // ==========================================

        function batear() {
            if (swing || hit) return;

            swing = true;
            swingTimer = swingDuration;


            //aqui es el punto donde si hace contacto es hit
            const distanceToBall =
                ball.position.distanceTo(
                    new THREE.Vector3(
                        0,
                        0.7 ,
                        8.0
                    )
                );

            if (distanceToBall < hitDistance) {
                hit = true;

                hitDirection =
                    (Math.random() - 0.5) * 2;

                console.log("HIT");
            } else {
                console.log("MISS");
            }
        }

        function teclaBatear(event) {
            if (event.code === "Space") {
                event.preventDefault();
                batear();
            }
        }

        window.addEventListener(
            "keydown",
            teclaBatear
        );

        renderer.domElement.addEventListener(
            "click",
            batear
        );






        // ==========================================
        // ANIMACIÓN
        // ==========================================

        let animationId;

        function animate() {
            animationId =
                requestAnimationFrame(
                    animate
                );
            const delta = clock.getDelta();

            if (!hit) {

                pitchProgress +=
                    delta * pitchSpeed;

                if (pitchProgress >= 1) {
                    pitchProgress = 0;
                }

                ball.position.lerpVectors(
                    pitchStart,
                    pitchEnd,
                    pitchProgress
                );

            } else {

                ball.position.x +=
                    hitDirection * delta * 8;

                ball.position.z -=
                    delta * 12;

                ball.position.y +=
                    delta * 4;
            }

            if (swing) {

                swingTimer -= delta;

                if (swingTimer <= 0) {
                    swing = false;
                }
            }
            // Movimiento muy pequeño
            // para dar sensación de cámara viva
            const targetX =
                mouseX * 0.8;

            const targetY =
                1.8 - mouseY * 0.3;

            camera.lookAt(
                targetX,
                targetY,
                1
            );

            renderer.render(
                scene,
                camera
            );
        }

        animate();

        // ==========================================
        // RESPONSIVE
        // ==========================================

        function resize() {
            camera.aspect =
                container.clientWidth /
                container.clientHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
        }

        window.addEventListener(
            "resize",
            resize
        );

        // ==========================================
        // LIMPIEZA
        // ==========================================

        return () => {
            componentUnmounted = true;

            window.removeEventListener(
                "keydown",
                teclaBatear
            );

            renderer.domElement.removeEventListener(
                "click",
                batear
            );

            cancelAnimationFrame(
                animationId
            );

            renderer.domElement.removeEventListener(
                "mousemove",
                mouseMove
            );

            window.removeEventListener(
                "resize",
                resize
            );

            renderer.dispose();

            if (loadedHomePlate) {
                loadedHomePlate.traverse((child) => {
                    if (!child.isMesh) return;

                    child.geometry.dispose();

                    if (Array.isArray(child.material)) {
                        child.material.forEach((material) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                });
            }

            if (
                container.contains(
                    renderer.domElement
                )
            ) {
                container.removeChild(
                    renderer.domElement
                );
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                position: "relative"
            }}
        />
    );
}

export default JuegoFinal;

