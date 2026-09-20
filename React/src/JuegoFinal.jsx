
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function JuegoFinal() {
    const containerRef = useRef(null);
    const { finalId } = useParams();
    const navigate = useNavigate();
    const gameRef = useRef({
        phase: "ready",
        strikes: 0,
        countdown: 0,
        animation: "Idle"
    });
    const readyTimerRef = useRef(null);
    const animationTimerRef = useRef(null);
    const startPitchRef = useRef(() => {});
    const batearRef = useRef(() => {});
    const [gameState, setGameState] = useState({
        phase: "ready",
        strikes: 0,
        countdown: 0,
        animation: "Idle"
    });
    const [lanzamientos, setLanzamientos] = useState(0);

    function irAlResultado() {
        navigate(`/finales/${finalId}/resultado`, {
            state: {
                ganada: gameRef.current.phase === "won",
                lanzamientos
            }
        });
    }

    function updateGameState(changes) {
        Object.assign(gameRef.current, changes);
        setGameState({ ...gameRef.current });
    }

    function prepararLanzamiento() {
        if (gameRef.current.phase !== "ready") return;

        let seconds = 3;
        updateGameState({ phase: "countdown", countdown: seconds });
        readyTimerRef.current = window.setInterval(() => {
            seconds -= 1;

            if (seconds <= 0) {
                window.clearInterval(readyTimerRef.current);
                readyTimerRef.current = null;
                startPitchRef.current();
                return;
            }

            updateGameState({ countdown: seconds });
        }, 1000);
    }

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
        ball.visible = false;

        const pitchSpeed = 0.7; // Velocidad de la pelota (ajustable)
        let pitchProgress = 0;

        const clock = new THREE.Clock();


        // ==========================================
        // SISTEMA DE BATEO VARIABLES
        // ==========================================

        let swing = false;
        let swingTimer = 0;
        let hit = false;
        let hitDirection = 0;
        let pitchActive = false;
        let ballInFlight = false;
        let bateoPendiente = false;
        let bateoTimer = null;
        let animationMixer = null;
        let mixerUpdateLogged = false;
        const animationActions = {};
        const animationMeshes = new Map();
        let skinnedMeshes = [];

        const swingDuration = 0.20;
        const hitDistance = 1.0;
        const retardoLogicaBateo = 500;
        const velocidadAnimaciones = 2.0;




        

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


        // El jugador se coloca a la izquierda de la placa original.
        const homePlateLoader = new GLTFLoader();
        let loadedHomePlate = null;
        let componentUnmounted = false;

        function prepararClipParaRigVisible(clip) {
            const tracks = clip.tracks.map((track) => {
                const clonedTrack = track.clone();
                clonedTrack.name = clonedTrack.name.replace(
                    /(mixamorig[^.]+)_[12](?=\.)/g,
                    "$1"
                );
                return clonedTrack;
            });

            const preparedClip = new THREE.AnimationClip(
                clip.name,
                clip.duration,
                tracks
            );

            preparedClip.blendMode = clip.blendMode;
            return preparedClip;
        }

        homePlateLoader.load(
            `${import.meta.env.BASE_URL}modelos/Modelo_base_anim.glb`,
            (gltf) => {
                if (componentUnmounted) return;

                loadedHomePlate = gltf.scene;
                loadedHomePlate.rotation.y = Math.PI;
                animationMixer = new THREE.AnimationMixer(loadedHomePlate);

                skinnedMeshes = [];
                loadedHomePlate.traverse((child) => {
                    if (child.isSkinnedMesh) skinnedMeshes.push(child);
                });

                console.log(
                    "[JuegoFinal] Modelo animado cargado. Clips encontrados:",
                    gltf.animations.map((clip) => ({
                        nombre: clip.name,
                        duracion: clip.duration,
                        tracks: clip.tracks.length,
                        ejemplosTracks: clip.tracks.slice(0, 5).map((track) => track.name)
                    }))
                );

                const huesos = [];
                loadedHomePlate.traverse((child) => {
                    if (child.isBone) huesos.push(child.name);
                });
                console.log("[JuegoFinal] Huesos encontrados en el modelo:", huesos);

                gltf.animations.forEach((clip) => {
                    const preparedClip = prepararClipParaRigVisible(clip);
                    const action = animationMixer.clipAction(preparedClip);
                    const trackNodes = new Set(
                        preparedClip.tracks.flatMap((track) => (
                            track.name.match(/mixamorig[A-Za-z0-9_]+/g) || []
                        ))
                    );
                    const matchingMeshes = skinnedMeshes.filter((mesh) =>
                        mesh.skeleton.bones.some((bone) => trackNodes.has(bone.name))
                    );
                    const meshesForClip = matchingMeshes.length > 0
                        ? matchingMeshes
                        : skinnedMeshes.slice(0, 1);

                    animationActions[clip.name] = action;
                    animationMeshes.set(action, meshesForClip);

                    console.log(
                        `[JuegoFinal] Rig para ${clip.name}:`,
                        {
                            meshes: meshesForClip.map((mesh) => mesh.name),
                            targets: [...trackNodes].slice(0, 10),
                            metodo: matchingMeshes.length > 0
                                ? "tracks-retargeteados"
                                : "rig-visible"
                        }
                    );
                });

                if (obtenerAccion("Idle")) {
                    console.log("[JuegoFinal] Reproduciendo Idle al cargar.");
                    reproducirAnimacion("Idle");
                } else {
                    console.error("[JuegoFinal] No existe una animacion llamada Idle.");
                }

                const modelBounds = new THREE.Box3().setFromObject(
                    loadedHomePlate
                );
                const modelSize = modelBounds.getSize(
                    new THREE.Vector3()
                );
                const alturaJugador = 0.3;

                // Se escala por altura para que el rig y el bate no reduzcan
                // visualmente al jugador frente al modelo anterior.
                if (modelSize.y > 0) {
                    loadedHomePlate.scale.setScalar(
                        alturaJugador / modelSize.y
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

                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];

                    materials.forEach((material) => {
                        material.transparent = false;
                        material.opacity = 1;
                        material.alphaTest = 0;
                        material.depthTest = true;
                        material.depthWrite = true;
                        material.blending = THREE.NoBlending;
                        material.needsUpdate = true;
                    });
                });

                stadium.add(loadedHomePlate);
            },
            undefined,
            (error) => {
                console.error(
                    "[JuegoFinal] No se pudo cargar Modelo_base_anim.glb.",
                    error
                );
            }
        );

        function normalizarNombreAnimacion(nombre) {
            return nombre.trim().toLowerCase().replace(/[._-]/g, "");
        }

        function obtenerAccion(nombre) {
            const nombreBuscado = normalizarNombreAnimacion(nombre);
            const clave = Object.keys(animationActions).find((item) => {
                const nombreDisponible = normalizarNombreAnimacion(item);
                return nombreDisponible === nombreBuscado ||
                    nombreDisponible.startsWith(`${nombreBuscado}0`);
            });

            return clave ? animationActions[clave] : null;
        }

        function reproducirAnimacion(nombre) {
            const action = obtenerAccion(nombre);
            if (!action) {
                console.error(
                    `[JuegoFinal] No existe la animacion solicitada: ${nombre}`,
                    Object.keys(animationActions)
                );
                return;
            }

            console.log(
                `[JuegoFinal] Entrando en animacion: ${nombre}`,
                `duracion: ${action.getClip().duration}s`
            );

            animationMixer.stopAllAction();
            action.reset();
            action.enabled = true;
            action.paused = false;
            action.setEffectiveTimeScale(velocidadAnimaciones);
            action.setEffectiveWeight(1);
            action.setLoop(
                nombre === "Idle" ? THREE.LoopRepeat : THREE.LoopOnce,
                nombre === "Idle" ? Infinity : 1
            );
            action.clampWhenFinished = nombre !== "Idle";
            action.play();
            animationMixer.update(0);

            const visibleMeshes = animationMeshes.get(action);
            if (visibleMeshes && visibleMeshes.length > 0) {
                skinnedMeshes.forEach((mesh) => {
                    mesh.visible = visibleMeshes.includes(mesh);
                });
            }

            console.log("[JuegoFinal] Estado de accion", {
                nombre,
                activo: action.isRunning(),
                peso: action.getEffectiveWeight(),
                tiempo: action.time,
                pausada: action.paused
            });
            updateGameState({ animation: nombre });
        }

        function registrarStrike(reproducirStrike = true) {
            const strikes = gameRef.current.strikes + 1;
            console.log(
                "[JuegoFinal] Strike registrado",
                { strikes, clipsDisponibles: Object.keys(animationActions) }
            );
            swing = false;
            pitchActive = false;

            if (reproducirStrike) {
                reproducirAnimacion("Strike");
            }

            updateGameState({
                phase: strikes >= 3 ? "lost" : "strike",
                strikes
            });

            if (strikes < 3) {
                const strikeAction = obtenerAccion("Strike");
                const duration = strikeAction
                    ? (strikeAction.getClip().duration * 1000) / velocidadAnimaciones
                    : 1000;

                animationTimerRef.current = window.setTimeout(() => {
                    if (!componentUnmounted && gameRef.current.phase === "strike") {
                        reproducirAnimacion("Idle");
                        updateGameState({ phase: "ready" });
                    }
                }, duration);
            }
        }

        startPitchRef.current = () => {
            if (gameRef.current.phase !== "countdown") return;

            console.log("[JuegoFinal] Lanzamiento iniciado.");

            pitchProgress = 0;
            setLanzamientos((total) => total + 1);
            hit = false;
            swing = false;
            bateoPendiente = false;
            pitchActive = true;
            ballInFlight = true;
            ball.position.copy(pitchStart);
            ball.visible = true;
            reproducirAnimacion("Idle");
            updateGameState({ phase: "pitching", countdown: 0 });
        };

        batearRef.current = () => {
            if (
                gameRef.current.phase !== "pitching" ||
                swing ||
                hit ||
                bateoPendiente
            ) return;

            bateoPendiente = true;
            swing = true;
            swingTimer = swingDuration;
            pitchActive = false;

            const puntoContacto = new THREE.Vector3(0, 0.7, 8.0);
            const progresoPrevisto = Math.min(
                1,
                pitchProgress + pitchSpeed * (retardoLogicaBateo / 1000)
            );
            const posicionPrevista = new THREE.Vector3().lerpVectors(
                pitchStart,
                pitchEnd,
                progresoPrevisto
            );
            const distanciaPrevista = posicionPrevista.distanceTo(
                puntoContacto
            );
            const seraHit = distanciaPrevista < hitDistance;

            console.log("[JuegoFinal] Resultado previsto del bateo", {
                progresoActual: pitchProgress,
                progresoPrevisto,
                distanciaPrevista,
                seraHit
            });

            /*
             * La animacion se decide ahora usando la posicion que tendra
             * la pelota cuando termine el retardo logico.
             */
            reproducirAnimacion(seraHit ? "Hit" : "Strike");

            bateoTimer = window.setTimeout(() => {
                bateoPendiente = false;
                bateoTimer = null;

                if (componentUnmounted || gameRef.current.phase !== "pitching") {
                    return;
                }

                if (seraHit) {
                    console.log("[JuegoFinal] Contacto HIT confirmado", {
                        distanciaPrevista
                    });
                    hit = true;
                    ballInFlight = false;
                    hitDirection = (Math.random() - 0.5) * 2;
                    updateGameState({ phase: "won" });
                    return;
                }

                console.log("[JuegoFinal] Bateo fallido confirmado", {
                    distanciaPrevista
                });
                registrarStrike(false);
            }, retardoLogicaBateo);
        };

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

        function teclaBatear(event) {
            if (event.code === "Space") {
                event.preventDefault();
                batearRef.current();
            }
        }

        window.addEventListener(
            "keydown",
            teclaBatear
        );

        const clickBatear = () => batearRef.current();

        renderer.domElement.addEventListener(
            "click",
            clickBatear
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

            if (ballInFlight && !hit) {
                pitchProgress +=
                    delta * pitchSpeed;

                if (pitchProgress >= 1) {
                    pitchProgress = 1;
                    ballInFlight = false;
                }

                ball.position.lerpVectors(
                    pitchStart,
                    pitchEnd,
                    pitchProgress
                );

                if (pitchProgress >= 1 && pitchActive) {
                    registrarStrike();
                }

            } else if (hit) {

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

            if (animationMixer) {
                animationMixer.update(delta);

                if (!mixerUpdateLogged) {
                    mixerUpdateLogged = true;
                    console.log("[JuegoFinal] AnimationMixer actualizado correctamente.");
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

            if (readyTimerRef.current) {
                window.clearInterval(readyTimerRef.current);
            }

            if (animationTimerRef.current) {
                window.clearTimeout(animationTimerRef.current);
            }

            if (bateoTimer) {
                window.clearTimeout(bateoTimer);
            }

            startPitchRef.current = () => {};
            batearRef.current = () => {};

            window.removeEventListener(
                "keydown",
                teclaBatear
            );

            renderer.domElement.removeEventListener(
                "click",
                clickBatear
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
            className="juego-final"
            style={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                position: "relative"
            }}
        >
            <div className="juego-final-scoreboard" aria-label="Marcador de la última entrada">
                <span>ÚLTIMA ENTRADA</span>
                <strong>STRIKES: {gameState.strikes} / 3</strong>
                
            </div>

            <div className="juego-final-actions">
                {gameState.phase === "ready" && (
                    <button type="button" onClick={prepararLanzamiento}>
                        LISTO
                    </button>
                )}
                {gameState.phase === "countdown" && (
                    <p>LANZAMIENTO EN {gameState.countdown}</p>
                )}
                {gameState.phase === "strike" && <p>¡STRIKE!</p>}
                {gameState.phase === "pitching" && (
                    <button type="button" onClick={() => batearRef.current()}>
                        BATEAR
                    </button>
                )}
                {gameState.phase === "lost" && <p>3 STRIKES: JUEGO TERMINADO</p>}
            </div>

            {gameState.phase === "won" && (
                <div className="juego-final-victoria" role="dialog" aria-modal="true">
                    <p>ÚLTIMA ENTRADA</p>
                    <h1>¡HOME RUN!</h1>
                    <strong>¡GANASTE EL JUEGO!</strong>
                    <button type="button" onClick={irAlResultado}>
                        VER RECOMPENSA
                    </button>
                </div>
            )}
        </div>
    );
}

export default JuegoFinal;

