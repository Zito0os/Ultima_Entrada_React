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
        bolas: 0,
        countdown: 0,
        animation: "Idle"
    });
    const readyTimerRef = useRef(null);
    const objetivoTimerRef = useRef(null);
    const inicioCierreCirculoRef = useRef(null);
    const animationTimerRef = useRef(null);
    const startPitchRef = useRef(() => {});
    const startPitcherAnimationRef = useRef(() => {});
    const batearRef = useRef(() => {});
    const lanzamientoPendienteRef = useRef(false);
    const lanzamientoAnticipadoRef = useRef(false);
    const strikeTerminadoRef = useRef(true);
    const tiempoAntesDeLanzar = 1.7;
    const TIEMPO_CIRCULO_ANTES_DE_LANZAR = 0.7;
    const [gameState, setGameState] = useState({
        phase: "ready",
        strikes: 0,
        bolas: 0,
        countdown: 0,
        animation: "Idle"
    });
    const [lanzamientos, setLanzamientos] = useState(0);

    // Cuadro real de strike (la cuadrícula 3x3 donde el umpire canta strike si no bateas).
    // Más pequeño y con proporción real (más alto que ancho, como la zona de strike de verdad).
    const ZONA_STRIKE = { columnas: 3, filas: 3, ancho: 120, alto: 120};
    // Margen alrededor del cuadro de strike donde el pitcher puede tirar "bolas malas"
    const MARGEN_BOLA = 44;
    // Área total donde puede caer cualquier lanzamiento (strike o bola)
    const ZONA_TOTAL = {
        ancho: ZONA_STRIKE.ancho + MARGEN_BOLA * 2,
        alto: ZONA_STRIKE.alto + MARGEN_BOLA * 2
    };
    // Probabilidad de que un lanzamiento sea bola (fuera del cuadro de strike)
    const PROBABILIDAD_BOLA = 0.35;
    // Bolas necesarias para que el bateador se gane la base (igual que en beisbol real)
    const BOLAS_PARA_BASE = 4;
    const PROBABILIDAD_LANZAMIENTO_CURVO = 0.70;
    const DESVIACION_MAXIMA_CURVA = 0.65;
    const FACTOR_CURVA = 12;

    const RADIO_CIRCULO_OBJETIVO = 34;
    const TAMANO_CIRCULO_MAX = 210;
    const TAMANO_CIRCULO_MIN = 50;
    const MULTIPLICADOR_CIERRE_CIRCULO = 2;
    const RADIO_PUNTO_CONTACTO = 9;
    const VELOCIDAD_JOYSTICK = 400;

    // ---- Mapeo del punto 2D (círculo de predicción) a una posición 3D real ----
    // Altura a la que vive el centro de la zona de strike: la altura real
    // aproximada de la zona de bateo (entre la rodilla y el pecho del bateador).
    const ALTURA_ZONA_STRIKE_CENTRO = 0.85;
    // Medio ancho / medio alto reales (unidades del mundo 3D) que representan el
    // borde del cuadro de strike. Una bola (fuera del cuadro 2D) se traduce en un
    // desplazamiento mayor a estos valores, así que el lanzamiento se ve claramente
    // más arriba, más abajo, más a la izquierda o más a la derecha.
    const MEDIO_ANCHO_ZONA_3D = 0.42;
    const MEDIO_ALTO_ZONA_3D = 0.5;
    // Profundidad (eje Z) donde el bate realmente contacta la pelota, y de dónde
    // parte/hasta dónde llega su trayectoria.
    const Z_LANZAMIENTO = 0.5;
    const Z_CONTACTO = 8.0;
    const Z_LLEGADA = 14.2;
    // Altura a la que el pitcher suelta la pelota (hombro), para que el
    // lanzamiento baje realmente hacia la zona en vez de ir en línea recta.
    const ALTURA_LIBERACION_PITCHER = 1.55;

    // Convierte el punto 2D del círculo de predicción (en px, dentro de
    // ZONA_TOTAL) en la posición 3D real donde la pelota debe cruzar el plato.
    function calcularPuntoContactoDesdeObjetivo(objetivo2D) {
        const centroX = ZONA_TOTAL.ancho / 2;
        const centroY = ZONA_TOTAL.alto / 2;
        const offsetXNorm = (objetivo2D.x - centroX) / (ZONA_STRIKE.ancho / 2);
        const offsetYNorm = (objetivo2D.y - centroY) / (ZONA_STRIKE.alto / 2);

        return new THREE.Vector3(
            offsetXNorm * MEDIO_ANCHO_ZONA_3D,
            // En pantalla Y crece hacia abajo; en Three.js Y crece hacia arriba, se invierte.
            ALTURA_ZONA_STRIKE_CENTRO - offsetYNorm * MEDIO_ALTO_ZONA_3D,
            Z_CONTACTO
        );
    }

    const puntoContactoRef = useRef(null);
    const circuloObjetivoRef = useRef(null);
    const joystickBaseRef = useRef(null);
    const joystickStickRef = useRef(null);
    const contactoPosRef = useRef({
        x: ZONA_TOTAL.ancho / 2,
        y: ZONA_TOTAL.alto / 2
    });
    const objetivoPosRef = useRef({
        x: ZONA_TOTAL.ancho / 2,
        y: ZONA_TOTAL.alto / 2
    });
    // Marca si el lanzamiento actual es una bola (cae fuera del cuadro de strike) o no
    const pitchEsBolaRef = useRef(false);
    const joystickVectorRef = useRef({ x: 0, y: 0 });
    const joystickActivoRef = useRef(false);

    function generarObjetivoAleatorio() {
        const esBola = Math.random() < PROBABILIDAD_BOLA;
        pitchEsBolaRef.current = esBola;

        let x;
        let y;

        if (!esBola) {
            // Lanzamiento dentro de la zona de strike: se elige una celda al azar de la cuadrícula 3x3
            const { columnas, filas, ancho, alto } = ZONA_STRIKE;
            const col = Math.floor(Math.random() * columnas);
            const fila = Math.floor(Math.random() * filas);
            x = MARGEN_BOLA + (ancho / columnas) * col + ancho / columnas / 2;
            y = MARGEN_BOLA + (alto / filas) * fila + alto / filas / 2;
        } else {
            // Bola: se sortean puntos dentro del área total hasta que caiga
            // fuera del rectángulo del cuadro de strike.
            do {
                x = Math.random() * ZONA_TOTAL.ancho;
                y = Math.random() * ZONA_TOTAL.alto;
            } while (
                x >= MARGEN_BOLA &&
                x <= MARGEN_BOLA + ZONA_STRIKE.ancho &&
                y >= MARGEN_BOLA &&
                y <= MARGEN_BOLA + ZONA_STRIKE.alto
            );
        }

        objetivoPosRef.current = { x, y };
        inicioCierreCirculoRef.current = null;
        if (circuloObjetivoRef.current) {
            circuloObjetivoRef.current.style.left = `${x}px`;
            circuloObjetivoRef.current.style.top = `${y}px`;
            circuloObjetivoRef.current.style.width = `${TAMANO_CIRCULO_MAX}px`;
            circuloObjetivoRef.current.style.height = `${TAMANO_CIRCULO_MAX}px`;
            circuloObjetivoRef.current.style.opacity = "0";
        }

        console.log("[JuegoFinal] Nuevo lanzamiento generado.", {
            esBola,
            x,
            y
        });
    }

    function ocultarObjetivo() {
        inicioCierreCirculoRef.current = null;
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
            x: ZONA_TOTAL.ancho / 2,
            y: ZONA_TOTAL.alto / 2
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
                lanzamientos,
                strikes: gameRef.current.strikes,
                bolas: gameRef.current.bolas
            }
        });
    }

    function updateGameState(changes) {
        Object.assign(gameRef.current, changes);
        setGameState({ ...gameRef.current });
    }

    function prepararLanzamiento() {
        if (gameRef.current.phase !== "ready") return;

        if (objetivoTimerRef.current) {
            window.clearTimeout(objetivoTimerRef.current);
        }

        startPitcherAnimationRef.current();
        lanzamientoPendienteRef.current = true;
        reiniciarContacto();
        generarObjetivoAleatorio();
        const esperaParaMostrarObjetivo = Math.max(
            0,
            tiempoAntesDeLanzar - TIEMPO_CIRCULO_ANTES_DE_LANZAR
        );
        objetivoTimerRef.current = window.setTimeout(() => {
            objetivoTimerRef.current = null;
            if (
                lanzamientoPendienteRef.current &&
                gameRef.current.phase !== "lost" &&
                circuloObjetivoRef.current
            ) {
                circuloObjetivoRef.current.style.opacity = "1";
                inicioCierreCirculoRef.current = performance.now();
            }
        }, esperaParaMostrarObjetivo * 1000);
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


        // Punto fijo de liberación del pitcher (arriba, como un brazo real).
        const pitchStart = new THREE.Vector3(0, ALTURA_LIBERACION_PITCHER, Z_LANZAMIENTO);
        // pitchEnd y puntoContactoPelota se recalculan en cada lanzamiento
        // (ver startPitchRef.current) según hacia dónde apunte el círculo de
        // predicción, para que la pelota realmente vaya más arriba, más abajo,
        // más a la izquierda o más a la derecha, y pase por ese punto exacto.
        let pitchEnd = new THREE.Vector3(0, ALTURA_ZONA_STRIKE_CENTRO, Z_LLEGADA);
        let puntoContactoPelota = new THREE.Vector3(0, ALTURA_ZONA_STRIKE_CENTRO, Z_CONTACTO);

        ball.position.copy(pitchStart);
        ball.visible = false;

        const pitchSpeed = 0.8; // Velocidad de la pelota (ajustable)
        let pitchProgress = 0;
        const duracionCierreCirculo = .8;
        const progresoContacto =
            (Z_CONTACTO - pitchStart.z) / (Z_LLEGADA - pitchStart.z);
        let curvaLanzamiento = { eje: null, direccion: 0, intensidad: 0 };

        function calcularPosicionPelota(progreso) {
            const posicion = new THREE.Vector3().lerpVectors(
                pitchStart,
                pitchEnd,
                progreso
            );

            if (curvaLanzamiento.eje) {
                const desviacion = progreso * (1 - progreso) *
                    (progreso - progresoContacto) * FACTOR_CURVA *
                    curvaLanzamiento.direccion * curvaLanzamiento.intensidad;
                posicion[curvaLanzamiento.eje] += desviacion;
            }

            return posicion;
        }

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
                color: 0x404040
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

        function registrarBola() {
            const bolas = gameRef.current.bolas + 1;

            console.log("[JuegoFinal] Bola cantada (lanzamiento fuera de zona, sin swing).", {
                bolas
            });

            if (bolas >= BOLAS_PARA_BASE) {
                // Base por bolas: el bateador se gana la base.
                updateGameState({ phase: "won", bolas });
                return;
            }

            updateGameState({ phase: "ball", bolas });

            animationTimerRef.current = window.setTimeout(() => {
                if (!componentUnmounted && gameRef.current.phase === "ball") {
                    updateGameState({ phase: "ready" });
                }
            }, 1000);
        }

        function resolverPelotaDejadaPasar() {
            ocultarObjetivo();
            const esBola = pitchEsBolaRef.current;

            ballInFlight = false;
            pitchActive = false;
            strikeTerminadoRef.current = true;
            ball.position.copy(pitchEnd);

            reproducirAnimacion("Idle");

            if (esBola) {
                // La pelota cayó fuera del cuadro de strike y el jugador no bateó: BOLA.
                registrarBola();
                return;
            }

            // La pelota cayó dentro del cuadro de strike y el jugador no bateó: STRIKE cantado.
            const strikes = gameRef.current.strikes + 1;
            console.log("[JuegoFinal] Pelota dejada pasar dentro de la zona: strike cantado.", {
                strikes
            });
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

            if (objetivoTimerRef.current) {
                window.clearTimeout(objetivoTimerRef.current);
                objetivoTimerRef.current = null;
            }

            lanzamientoPendienteRef.current = false;

            const esLanzamientoCurvo =
                Math.random() < PROBABILIDAD_LANZAMIENTO_CURVO;
            curvaLanzamiento = esLanzamientoCurvo
                ? {
                    eje: Math.random() < 0.5 ? "x" : "y",
                    direccion: Math.random() < 0.5 ? -1 : 1,
                    intensidad: 0.45 + Math.random() * 0.55
                }
                : { eje: null, direccion: 0, intensidad: 0 };

            // Se traduce el punto del círculo de predicción (2D) a la posición
            // real en el mundo 3D donde la pelota debe cruzar el plato, y se
            // extiende esa misma línea (desde donde el pitcher suelta la
            // pelota) para que la trayectoria completa pase literalmente por
            // ahí, ya sea que el lanzamiento vaya más arriba, más abajo, más a
            // la izquierda o más a la derecha.
            puntoContactoPelota = calcularPuntoContactoDesdeObjetivo(objetivoPosRef.current);
            const fraccionLlegada =
                (Z_LLEGADA - pitchStart.z) / (puntoContactoPelota.z - pitchStart.z);
            pitchEnd = new THREE.Vector3().lerpVectors(
                pitchStart,
                puntoContactoPelota,
                fraccionLlegada
            );

            console.log("[JuegoFinal] Lanzamiento iniciado.", {
                esBola: pitchEsBolaRef.current,
                tipo: curvaLanzamiento.eje === "x"
                    ? "curva horizontal"
                    : curvaLanzamiento.eje === "y"
                        ? "curva vertical"
                        : "recta",
                direccionCurva: curvaLanzamiento.direccion,
                puntoContactoPelota,
                pitchEnd
            });

            pitchProgress = 0;
            if (circuloObjetivoRef.current) {
                circuloObjetivoRef.current.style.opacity = "1";
            }
            if (inicioCierreCirculoRef.current === null) {
                inicioCierreCirculoRef.current = performance.now();
            }
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
                // No se cancela el timer ni se lanza de inmediato: el pitcher
                // debe completar su lanzamiento en el tiempo que ya estaba
                // previsto (el mismo timer de prepararLanzamiento se encarga
                // de llamar a startPitchRef.current() cuando corresponda).
                lanzamientoAnticipadoRef.current = true;
                registrarStrike(true);
                return;
            }

            bateoPendiente = true;
            swing = true;
            swingTimer = swingDuration;
            pitchActive = false;

            // El punto de contacto real de ESTE lanzamiento (calculado en
            // startPitchRef a partir del círculo de predicción), no uno fijo,
            // para que el timing se evalúe contra la trayectoria verdadera.
            const progresoPrevisto = Math.min(
                1,
                pitchProgress + pitchSpeed * (retardoLogicaBateo / 1000)
            );
            const posicionPrevista = calcularPosicionPelota(progresoPrevisto);
            const distanciaPrevista = posicionPrevista.distanceTo(
                puntoContactoPelota
            );
            const seraHit = distanciaPrevista < hitDistance;

            // Sea bola o strike, si tu punto de contacto cae dentro del círculo
            // de predicción y el timing es correcto, es hit (igual que en beisbol
            // real, puedes conectar una bola mala si decides perseguirla).
            const golpeEnCirculo = estaDentroDelCirculo();
            const golpeValido = seraHit && golpeEnCirculo;

            reproducirAnimacion(golpeValido ? "Hit" : "Strike");
            console.log("[JuegoFinal] Resultado previsto del bateo", {
                esBola: pitchEsBolaRef.current,
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

                // Swing y falla: siempre es strike, sin importar si el
                // lanzamiento era bola o estaba en la zona.
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

            if (
                inicioCierreCirculoRef.current !== null &&
                circuloObjetivoRef.current
            ) {
                const tiempoTranscurrido =
                    (performance.now() - inicioCierreCirculoRef.current) / 1000;
                const progresoCierreCirculo = Math.min(
                    1,
                    tiempoTranscurrido / duracionCierreCirculo
                );
                const tamanoCirculo = TAMANO_CIRCULO_MAX -
                    (TAMANO_CIRCULO_MAX - TAMANO_CIRCULO_MIN) * progresoCierreCirculo;
                circuloObjetivoRef.current.style.width = `${tamanoCirculo}px`;
                circuloObjetivoRef.current.style.height = `${tamanoCirculo}px`;

                if (progresoCierreCirculo >= 1) {
                    inicioCierreCirculoRef.current = null;
                }
            }

            // Mover el punto de contacto según el joystick
            const vector = joystickVectorRef.current;
            if (vector.x !== 0 || vector.y !== 0) {
                const { ancho, alto } = ZONA_TOTAL;
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

                ball.position.copy(calcularPosicionPelota(pitchProgress));

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

            if (objetivoTimerRef.current) {
                window.clearTimeout(objetivoTimerRef.current);
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
                        {[0, 1, 2, 3].map((i) => (
                            <span
                                key={i}
                                className={`dot bola ${i < gameState.bolas ? "activo" : ""}`}
                            />
                        ))}
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
                {gameState.phase === "ball" && <p>¡BOLA!</p>}
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
                    className="zona-lanzamiento-total"
                    style={{ width: ZONA_TOTAL.ancho, height: ZONA_TOTAL.alto, position: "relative" }}
                >
                    <div
                        className="zona-lanzamiento"
                        style={{
                            position: "absolute",
                            left: MARGEN_BOLA,
                            top: MARGEN_BOLA,
                            width: ZONA_STRIKE.ancho,
                            height: ZONA_STRIKE.alto
                        }}
                    >
                        {Array.from({ length: ZONA_STRIKE.columnas * ZONA_STRIKE.filas }).map((_, i) => (
                            <div key={i} className="zona-celda" />
                        ))}
                    </div>
                    <div className="zona-circulo-objetivo" ref={circuloObjetivoRef} />
                    <div className="zona-punto-contacto" ref={puntoContactoRef} />
                </div>
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