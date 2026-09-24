
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import './Juego_Final.css'

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
    const startPitcherAnimationRef = useRef(() => {});
    const batearRef = useRef(() => {});
    const lanzamientoPendienteRef = useRef(false);
    const lanzamientoAnticipadoRef = useRef(false);
    const strikeTerminadoRef = useRef(true);
    const tiempoAntesDeLanzar = 1.7;
    const [gameState, setGameState] = useState({
        phase: "ready",
        strikes: 0,
        countdown: 0,
        animation: "Idle"
    });
    const [lanzamientos, setLanzamientos] = useState(0);

    const ZONA_LANZAMIENTO = { columnas: 3, filas: 3, ancho: 180, alto: 180 };
    const RADIO_CIRCULO_OBJETIVO = 34;
    const RADIO_PUNTO_CONTACTO = 9;
    const VELOCIDAD_JOYSTICK = 150;

    const puntoContactoRef = useRef(null);
    const circuloObjetivoRef = useRef(null);
    const joystickBaseRef = useRef(null);
    const joystickStickRef = useRef(null);
    const contactoPosRef = useRef({
        x: ZONA_LANZAMIENTO.ancho / 2,
        y: ZONA_LANZAMIENTO.alto / 2
    });
    const objetivoPosRef = useRef({
        x: ZONA_LANZAMIENTO.ancho / 2,
        y: ZONA_LANZAMIENTO.alto / 2
    });
    const joystickVectorRef = useRef({ x: 0, y: 0 });
    const joystickActivoRef = useRef(false);

    function generarObjetivoAleatorio() {
        const { columnas, filas, ancho, alto } = ZONA_LANZAMIENTO;
        const col = Math.floor(Math.random() * columnas);
        const fila = Math.floor(Math.random() * filas);
        const x = (ancho / columnas) * col + ancho / columnas / 2;
        const y = (alto / filas) * fila + alto / filas / 2;
        objetivoPosRef.current = { x, y };
        if (circuloObjetivoRef.current) {
            circuloObjetivoRef.current.style.left = `${x}px`;
            circuloObjetivoRef.current.style.top = `${y}px`;
            circuloObjetivoRef.current.style.opacity = "1";
        }
    }

    function ocultarObjetivo() {
        if (circuloObjetivoRef.current) circuloObjetivoRef.current.style.opacity = "0";
    }

    function estaDentroDelCirculo() {
        return Math.hypot(
            contactoPosRef.current.x - objetivoPosRef.current.x,
            contactoPosRef.current.y - objetivoPosRef.current.y
        ) <= RADIO_CIRCULO_OBJETIVO - RADIO_PUNTO_CONTACTO / 2;
    }

    function reiniciarContacto() {
        contactoPosRef.current = {
            x: ZONA_LANZAMIENTO.ancho / 2,
            y: ZONA_LANZAMIENTO.alto / 2
        };
        if (puntoContactoRef.current) {
            puntoContactoRef.current.style.left = `${contactoPosRef.current.x}px`;
            puntoContactoRef.current.style.top = `${contactoPosRef.current.y}px`;
        }
    }

    function manejarJoystickInicio(event) {
        joystickActivoRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function manejarJoystickMover(event) {
        if (!joystickActivoRef.current || !joystickBaseRef.current) return;
        const rect = joystickBaseRef.current.getBoundingClientRect();
        const radioMax = rect.width / 2;
        let dx = event.clientX - (rect.left + radioMax);
        let dy = event.clientY - (rect.top + rect.height / 2);
        const distancia = Math.hypot(dx, dy);
        if (distancia > radioMax) {
            dx = (dx / distancia) * radioMax;
            dy = (dy / distancia) * radioMax;
        }
        joystickVectorRef.current = { x: dx / radioMax, y: dy / radioMax };
        if (joystickStickRef.current) {
            joystickStickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
        }
    }

    function manejarJoystickFin(event) {
        joystickActivoRef.current = false;
        joystickVectorRef.current = { x: 0, y: 0 };
        if (event?.currentTarget?.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (joystickStickRef.current) joystickStickRef.current.style.transform = "translate(0px, 0px)";
    }

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

        startPitcherAnimationRef.current();
        lanzamientoPendienteRef.current = true;
        reiniciarContacto();
        generarObjetivoAleatorio();
        updateGameState({
            phase: "countdown",
            countdown: tiempoAntesDeLanzar,
            bateoBloqueado: false
    });
        readyTimerRef.current = window.setTimeout(() => {
            readyTimerRef.current = null;
            startPitchRef.current();
        }, tiempoAntesDeLanzar * 1000);
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

        const pitchSpeed = 0.8; // Velocidad de la pelota (ajustable)
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
        const pitcherLoader = new GLTFLoader();
        let loadedPitcher = null;
        let pitcherMixer = null;
        const pitcherAnimationActions = {};
        const pitcherAnimationMeshes = new Map();
        let pitcherSkinnedMeshes = [];
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

                animationMixer.addEventListener("finished", (event) => {
                    const strikeAction = obtenerAccion("Strike");
                    if (event.action !== strikeAction || componentUnmounted) {
                        return;
                    }

                    strikeTerminadoRef.current = true;
                    reproducirAnimacion("Idle");
                    if (
                        gameRef.current.phase === "strike" &&
                        !lanzamientoPendienteRef.current
                    ) {
                        updateGameState({
                            phase: "ready",
                            bateoBloqueado: false
                        });
                    }
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


        
        // ==========================================
        // PITCHER
        // ==========================================




        function obtenerAccionPitcher(nombre) {
            const nombreBuscado = normalizarNombreAnimacion(nombre);
            const clave = Object.keys(pitcherAnimationActions).find((item) => {
                return normalizarNombreAnimacion(item) === nombreBuscado;
            });

            return clave ? pitcherAnimationActions[clave] : null;
        }

        function reproducirAnimacionPitcher(nombre) {
            const action = obtenerAccionPitcher(nombre);
            if (!action || !pitcherMixer) return;

            pitcherMixer.stopAllAction();
            action.reset();
            action.enabled = true;
            action.paused = false;
            action.setLoop(
                nombre === "Idle_Pitching" ? THREE.LoopRepeat : THREE.LoopOnce,
                nombre === "Idle_Pitching" ? Infinity : 1
            );
            action.clampWhenFinished = nombre !== "Idle_Pitching";
            action.play();

            const visibleMeshes = pitcherAnimationMeshes.get(action);
            if (visibleMeshes && visibleMeshes.length > 0) {
                pitcherSkinnedMeshes.forEach((mesh) => {
                    mesh.visible = visibleMeshes.includes(mesh);
                });
            } else {
                pitcherSkinnedMeshes.forEach((mesh) => {
                    mesh.visible = true;
                });
            }
        }

        startPitcherAnimationRef.current = () => {
            reproducirAnimacionPitcher("Pitching");
        };

        pitcherLoader.load(
            `${import.meta.env.BASE_URL}modelos/Pitcher_anim.glb`,
            (gltf) => {
                if (componentUnmounted) return;

                loadedPitcher = gltf.scene;
                //ROTAR 180 GRADOS PARA QUE MIRE AL BATEADOR
                //loadedPitcher.rotation.y = Math.PI;
                pitcherMixer = new THREE.AnimationMixer(loadedPitcher);

                pitcherSkinnedMeshes = [];
                loadedPitcher.traverse((child) => {
                    if (child.isSkinnedMesh) pitcherSkinnedMeshes.push(child);
                });

                gltf.animations.forEach((clip) => {
                    const preparedClip = prepararClipParaRigVisible(clip);
                    const action = pitcherMixer.clipAction(preparedClip);
                    const trackNodes = new Set(
                        preparedClip.tracks.flatMap((track) => (
                            track.name.match(/mixamorig[A-Za-z0-9_]+/g) || []
                        ))
                    );
                    const matchingMeshes = pitcherSkinnedMeshes.filter((mesh) =>
                        mesh.skeleton.bones.some((bone) => trackNodes.has(bone.name))
                    );
                    const meshesForClip = matchingMeshes.length > 0
                        ? matchingMeshes
                        : pitcherSkinnedMeshes;

                    pitcherAnimationActions[clip.name] = action;
                    pitcherAnimationMeshes.set(action, meshesForClip);
                });

                pitcherMixer.addEventListener("finished", (event) => {
                    const pitchingAction = obtenerAccionPitcher("Pitching");
                    if (event.action === pitchingAction && !componentUnmounted) {
                        reproducirAnimacionPitcher("Idle_Pitching");
                    }
                });

                const modelBounds = new THREE.Box3().setFromObject(loadedPitcher);
                const modelSize = modelBounds.getSize(new THREE.Vector3());
                const alturaPitcher = 0.3;

                if (modelSize.y > 0) {
                    loadedPitcher.scale.setScalar(alturaPitcher / modelSize.y);
                }

                loadedPitcher.updateMatrixWorld(true);

                const fittedBounds = new THREE.Box3().setFromObject(loadedPitcher);
                const fittedCenter = fittedBounds.getCenter(new THREE.Vector3());

                loadedPitcher.position.set(
                    -fittedCenter.x,
                    0.2 - fittedBounds.min.y,
                    1 - fittedCenter.z
                );
                loadedPitcher.traverse((child) => {
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

                loadedPitcher.traverse((child) => {
                    if (!child.isMesh) return;

                    child.castShadow = true;
                    child.receiveShadow = true;
                });

                stadium.add(loadedPitcher);
                reproducirAnimacionPitcher("Idle_Pitching");
            },
            undefined,
            (error) => {
                console.error(
                    "[JuegoFinal] No se pudo cargar Pitcher_anim.glb.",
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
            strikeTerminadoRef.current = false;

            if (reproducirStrike) {
                reproducirAnimacion("Strike");
            }

            updateGameState({
                phase: strikes >= 3 ? "lost" : "strike",
                strikes,
                bateoBloqueado: false
            });
        }

        function resolverPelotaDejadaPasar() {
            ocultarObjetivo();
            const strikes = gameRef.current.strikes + 1;

            ballInFlight = false;
            pitchActive = false;
            strikeTerminadoRef.current = true;
            ball.position.copy(pitchEnd);

            console.log("[JuegoFinal] Pelota dejada pasar: strike sin animacion Strike.", {
                strikes
            });
            reproducirAnimacion("Idle");
            updateGameState({
                phase: strikes >= 3 ? "lost" : "strike",
                strikes
            });

            if (strikes < 3) {
                animationTimerRef.current = window.setTimeout(() => {
                    if (!componentUnmounted && gameRef.current.phase === "strike") {
                        updateGameState({ phase: "ready" });
                    }
                }, 1000);
            }
        }

        startPitchRef.current = () => {
            if (
                !lanzamientoPendienteRef.current ||
                gameRef.current.phase === "lost"
            ) return;

            lanzamientoPendienteRef.current = false;

            console.log("[JuegoFinal] Lanzamiento iniciado.");

            pitchProgress = 0;
            setLanzamientos((total) => total + 1);
            hit = false;
            swing = false;
            bateoPendiente = false;
            pitchActive = !lanzamientoAnticipadoRef.current;
            ballInFlight = true;
            ball.position.copy(pitchStart);
            ball.visible = true;
            if (gameRef.current.animation !== "Strike") {
                reproducirAnimacion("Idle");
            }
            updateGameState({
                phase: "pitching",
                countdown: 0,
                bateoBloqueado: lanzamientoAnticipadoRef.current
            });
        };

        batearRef.current = () => {
            if (
                !["countdown", "pitching"].includes(gameRef.current.phase) ||
                swing ||
                hit ||
                bateoPendiente
            ) return;

            if (gameRef.current.phase === "countdown") {
                if (readyTimerRef.current) {
                    window.clearTimeout(readyTimerRef.current);
                    readyTimerRef.current = null;
                }

                lanzamientoPendienteRef.current = false;
                lanzamientoAnticipadoRef.current = true;
                registrarStrike(true);
                return;
            }

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

            const golpeEnCirculo = estaDentroDelCirculo();
            const golpeValido = seraHit && golpeEnCirculo;

            reproducirAnimacion(golpeValido ? "Hit" : "Strike");
            console.log("[JuegoFinal] Resultado previsto del bateo", {
                progresoActual: pitchProgress,
                progresoPrevisto,
                distanciaPrevista,
                seraHit
            });

            bateoTimer = window.setTimeout(() => {
                bateoPendiente = false;
                bateoTimer = null;

                if (componentUnmounted || gameRef.current.phase !== "pitching") return;

                ocultarObjetivo();

                if (golpeValido) {
                    hit = true;
                    ballInFlight = false;
                    hitDirection = (Math.random() - 0.5) * 2;
                    updateGameState({ phase: "won" });
                    return;
                }

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
        /*
        renderer.domElement.addEventListener(
            "mousemove",
            mouseMove
        );
        */


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
            // Mover el punto de contacto según el joystick
            const vector = joystickVectorRef.current;
            if (vector.x !== 0 || vector.y !== 0) {
                const { ancho, alto } = ZONA_LANZAMIENTO;
                let nuevaX = contactoPosRef.current.x + vector.x * VELOCIDAD_JOYSTICK * delta;
                let nuevaY = contactoPosRef.current.y + vector.y * VELOCIDAD_JOYSTICK * delta;

                nuevaX = Math.min(ancho, Math.max(0, nuevaX));
                nuevaY = Math.min(alto, Math.max(0, nuevaY));

                contactoPosRef.current = { x: nuevaX, y: nuevaY };

                if (puntoContactoRef.current) {
                    puntoContactoRef.current.style.left = `${nuevaX}px`;
                    puntoContactoRef.current.style.top = `${nuevaY}px`;
                }
            }

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

                if (pitchProgress >= 1) {
                    if (pitchActive) {
                        resolverPelotaDejadaPasar();
                    } else if (lanzamientoAnticipadoRef.current) {
                        ball.visible = false;
                        lanzamientoAnticipadoRef.current = false;

                        if (strikeTerminadoRef.current) {
                            updateGameState({
                                phase: "ready",
                                bateoBloqueado: false
                            });
                        } else {
                            updateGameState({
                                phase: "strike",
                                bateoBloqueado: false
                            });
                        }
                    }
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

            if (pitcherMixer) {
                pitcherMixer.update(delta);
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

        function resize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
        }

        window.addEventListener("resize", resize);

        return () => {
            componentUnmounted = true;

            if (readyTimerRef.current) {
                window.clearTimeout(readyTimerRef.current);
            }

            if (animationTimerRef.current) {
                window.clearTimeout(animationTimerRef.current);
            }

            if (bateoTimer) {
                window.clearTimeout(bateoTimer);
            }

            startPitchRef.current = () => {};
            startPitcherAnimationRef.current = () => {};
            batearRef.current = () => {};
            lanzamientoPendienteRef.current = false;
            lanzamientoAnticipadoRef.current = false;
            manejarJoystickFin();

            window.removeEventListener("keydown", teclaBatear);
            renderer.domElement.removeEventListener("click", clickBatear);
            cancelAnimationFrame(animationId);
            renderer.domElement.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("resize", resize);

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

            if (loadedPitcher) {
                loadedPitcher.traverse((child) => {
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
            <div className="marcador-header">
                <span className="marcador-liga">MLB · FINAL</span>
                <span className="marcador-entrada">
                    <span className="marcador-entrada-num">9</span>
                    <span className="marcador-entrada-txt">ÚLTIMA ENTRADA</span>
                </span>
            </div>
            <div className="marcador-conteo">
                <div className="marcador-fila">
                    <span className="marcador-label">B</span>
                    <div className="marcador-dots">
                        <span className="dot bola" />
                        <span className="dot bola" />
                        <span className="dot bola" />
                    </div>
                </div>
                <div className="marcador-fila">
                    <span className="marcador-label">S</span>
                    <div className="marcador-dots">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className={`dot strike ${i < gameState.strikes ? "activo" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

            <div className="juego-final-actions">
                {gameState.phase === "ready" && (
                    <button type="button" onClick={prepararLanzamiento}>
                        LISTO
                    </button>
                )}
                {gameState.phase === "strike" && <p>¡STRIKE!</p>}
                {gameState.phase === "countdown" || (
                    gameState.phase === "pitching" && !gameState.bateoBloqueado
                ) ? (
                    <button type="button" onClick={() => batearRef.current()}>
                        BATEAR
                    </button>
                ) : null}
                {gameState.phase === "lost" && (
                    <>
                        <p>3 STRIKES: JUEGO TERMINADO</p>
                        <button type="button" onClick={irAlResultado}>
                            VER RESULTADO
                        </button>
                    </>
                )}
            </div>
            <div className="zona-lanzamiento-wrapper">
                <div
                    className="zona-lanzamiento"
                    style={{ width: ZONA_LANZAMIENTO.ancho, height: ZONA_LANZAMIENTO.alto }}
                >
                    {Array.from({ length: ZONA_LANZAMIENTO.columnas * ZONA_LANZAMIENTO.filas }).map((_, i) => (
                        <div key={i} className="zona-celda" />
                    ))}
                    <div className="zona-circulo-objetivo" ref={circuloObjetivoRef} />
                    <div className="zona-punto-contacto" ref={puntoContactoRef} />
                </div>

                <div
                    className="joystick-base"
                    ref={joystickBaseRef}
                    onPointerDown={manejarJoystickInicio}
                    onPointerMove={manejarJoystickMover}
                    onPointerUp={manejarJoystickFin}
                    onPointerCancel={manejarJoystickFin}
                >
                    <div className="joystick-stick" ref={joystickStickRef} />
                </div>
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

