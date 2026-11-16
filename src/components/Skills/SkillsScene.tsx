import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
  type RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';
import { CAP_MATERIAL, SIDE_MATERIAL, loadLogoModel, type LogoModel } from './logoModel';
import type { Skill } from '../../data/skills';

const ENVIRONMENT = '/env/city_512.hdr'; // drei's "city" preset (Poly Haven, CC0), downsized and self-hosted
const FOV = 30; // units are CSS px: z = 0 is drawn at 1 unit = 1px
const ICON_SIZE = 50; // largest side of a logo on screen
const ICON_RADIUS = ICON_SIZE * 0.6; // collider a bit bigger than the logo: logos never touch
const HOVER_SCALE = 1.25;
const GLOBE_RADIUS = 80; // the 🌐 in the middle (160px); its collider is its visible outline
const GLOBE_TILT = THREE.MathUtils.degToRad(20); // 🌐 tilted towards the viewer
const MIN_SPEED = 35; // px/s
const MAX_SPEED = 120;
const DRAG = 1.5; // 1/s: how fast a logo thrown in slows down to a drift
const MIN_SPIN = 0.5; // rad/s: logos always tumble…
const MAX_SPIN = 2.6; // …but never whirl
const OUT = ICON_SIZE; // a logo this far past a side is out of sight
const SWEEP_TIME = 1.1; // s: the broom crossing the stage on a tab switch
const BROOM_DEPTH = 600; // px: thick, so even a fast step never jumps over a logo
const PARKED = 1e5; // where the broom waits between sweeps
const THROW_START = 0.3; // s after the click: the first new logo is thrown in…
const THROW_SPREAD = 0.45; // …the last one this much later, always behind the broom
const WIND = 400; // px/s²: logos being swept drift towards the exit…
const GUST = 1500; // …and the stragglers left once the broom has passed are blown out
const TWO_PI = Math.PI * 2;
const FACING = new THREE.Quaternion(); // identity: logo facing the screen

const GROUP = { current: 0, old: 1, sides: 2, floor: 3, globe: 4, broom: 5 }; // old and new sets never meet; the broom only pushes old logos
const COLLIDES = {
  waiting: interactionGroups(GROUP.current, []),
  entering: interactionGroups(GROUP.current, [GROUP.current, GROUP.floor, GROUP.globe]),
  settled: interactionGroups(GROUP.current, [GROUP.current, GROUP.sides, GROUP.floor, GROUP.globe]),
  leaving: interactionGroups(GROUP.old, [GROUP.old, GROUP.floor, GROUP.globe, GROUP.broom]),
  sides: interactionGroups(GROUP.sides, [GROUP.current]),
  floor: interactionGroups(GROUP.floor, [GROUP.current, GROUP.old]),
  globe: interactionGroups(GROUP.globe, [GROUP.current, GROUP.old]),
  broom: interactionGroups(GROUP.broom, [GROUP.old]),
};

const CIRCLE = new THREE.BufferGeometry().setFromPoints( // 64-point unit circle, reused for every globe line
  Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * TWO_PI;
    return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  })
);
const MERIDIANS = [0, 30, 60, 90, 120, 150].map(THREE.MathUtils.degToRad);
const PARALLELS = [-60, -30, 0, 30, 60].map(THREE.MathUtils.degToRad);

const random = (min: number, max: number) => min + Math.random() * (max - min);

const randomVector = (min: number, max: number): [number, number, number] => {
  const v = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1)).normalize().multiplyScalar(random(min, max));
  return [v.x, v.y, v.z];
};

const randomVelocity = (): [number, number, number] => {
  const angle = random(0, TWO_PI);
  const speed = random(MIN_SPEED, (MIN_SPEED + MAX_SPEED) / 2);
  return [Math.cos(angle) * speed, Math.sin(angle) * speed, 0];
};

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

interface Sweep {
  dir: 1 | -1; // broom direction: old logos leave that way, new ones come from behind
  time: number; // s, physics time
  width: number; // stage width at the start
  lead: number; // x of the broom's leading face
  active: boolean;
}

interface Flight {
  id: string;
  skill: Skill;
  dir: 1 | -1; // throw direction
  start: [number, number, number]; // waiting spot, just past the entry side
  delay: number; // s after the switch
  speed: number; // px/s
  leaving: boolean;
}

const makeFlights = (skills: Skill[], dir: 1 | -1, width: number, height: number, batch: number): Flight[] => {
  const lanes = shuffle(skills.map((_, i) => i));
  const span = height - 2 * (ICON_RADIUS + 6);
  const last = Math.max(skills.length - 1, 1);
  return skills.map((skill, i) => ({
    id: `${batch}:${skill.name}`,
    skill,
    dir,
    start: [-dir * (width / 2 + OUT + 10), skills.length > 1 ? -span / 2 + (lanes[i] / last) * span : 0, 0],
    delay: THROW_START + (i / last) * THROW_SPREAD,
    speed: MAX_SPEED + DRAG * random(0.15, 0.85) * width,
    leaving: false,
  }));
};

const useLogoModel = (url: string) => {
  const [model, setModel] = useState<LogoModel | null>(null);
  useEffect(() => {
    let alive = true;
    loadLogoModel(url).then(
      (loaded) => alive && setModel(loaded),
      () => undefined // a broken logo simply stays invisible
    );
    return () => {
      alive = false;
    };
  }, [url]);
  return model;
};

const PixelCamera = () => {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const distance = size.height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)); // z = 0 drawn at 1 unit = 1px
    perspective.fov = FOV;
    perspective.position.set(0, 0, distance);
    perspective.near = distance / 10;
    perspective.far = distance * 4;
    perspective.updateProjectionMatrix();
  }, [camera, size]);
  return null;
};

const CoreGlobe = () => {
  const spin = useRef<THREE.Group>(null);
  const materials = useMemo(
    () => ({
      lines: new THREE.LineBasicMaterial({ color: '#f2f2f2', transparent: true, opacity: 0.5 }),
      equator: new THREE.LineBasicMaterial({ color: '#ff2a2a' }),
    }),
    []
  );

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += 0.25 * Math.min(delta, 1 / 20);
  });

  return (
    <RigidBody type="fixed" colliders={false}>
      <BallCollider args={[GLOBE_RADIUS]} collisionGroups={COLLIDES.globe} restitution={1} friction={0.3} />
      <lineLoop geometry={CIRCLE} material={materials.lines} scale={GLOBE_RADIUS} />
      <group rotation={[-GLOBE_TILT, 0, 0]}>
        <group ref={spin}>
          {MERIDIANS.map((angle) => (
            <lineLoop key={`m${angle}`} geometry={CIRCLE} material={materials.lines} rotation={[0, angle, 0]} scale={GLOBE_RADIUS} />
          ))}
          {PARALLELS.map((latitude) => (
            <lineLoop
              key={`p${latitude}`}
              geometry={CIRCLE}
              material={latitude === 0 ? materials.equator : materials.lines}
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, Math.sin(latitude) * GLOBE_RADIUS, 0]}
              scale={Math.cos(latitude) * GLOBE_RADIUS}
            />
          ))}
        </group>
      </group>
    </RigidBody>
  );
};

const LogoMesh = ({ model }: { model: LogoModel }) => ( // flipped: SVG y points down
  <group rotation={[Math.PI, 0, 0]} scale={ICON_SIZE / model.extent}>
    <mesh geometry={model.caps} material={CAP_MATERIAL} />
    <mesh geometry={model.sides} material={SIDE_MATERIAL} />
  </group>
);

type Stage = 'waiting' | 'entering' | 'settled';

interface FloatingLogoProps {
  flight: Flight;
  bounds: { width: number; height: number };
  sweep: MutableRefObject<Sweep>;
  onHover: (name: string | null) => void;
  onGone: (id: string) => void;
  labelRef: RefObject<HTMLSpanElement>;
}

const FloatingLogo = ({ flight, bounds, sweep, onHover, onGone, labelRef }: FloatingLogoProps) => {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const [stage, setStage] = useState<Stage>('waiting');
  const [pointed, setPointed] = useState(false);
  const model = useLogoModel(flight.skill.logo);
  const phase = flight.leaving ? 'leaving' : stage;
  const hovered = pointed && !flight.leaving; // a logo being swept away isn't held by the pointer

  const motion = useMemo( // own start, tumble and rhythm: no two move alike
    () => ({
      rotation: [random(0, TWO_PI), random(0, TWO_PI), random(0, TWO_PI)] as [number, number, number],
      clock: 0,
      nextKick: random(0.3, 1.5),
      sinceKick: 0,
      gone: false,
      turn: new THREE.Quaternion(),
    }),
    []
  );

  useEffect(() => {
    if (flight.leaving && pointed) onHover(null); // its name goes away with it
  }, [flight.leaving, pointed, onHover]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const rigidBody = body.current;
    if (!visual.current || !rigidBody) return;

    visual.current.scale.setScalar(THREE.MathUtils.damp(visual.current.scale.x, hovered ? HOVER_SCALE : 1, 12, dt));
    const position = rigidBody.translation();
    const edge = bounds.width / 2;

    if (phase === 'leaving') {
      if (Math.abs(position.x) > edge + OUT) { // out of sight: unloaded
        if (!motion.gone) {
          motion.gone = true;
          onGone(flight.id);
        }
        return;
      }
      const velocity = rigidBody.linvel();
      const pull = (sweep.current.active ? WIND : GUST) * sweep.current.dir * dt; // light wind: none stays behind
      rigidBody.setLinvel({ x: velocity.x + pull, y: velocity.y, z: 0 }, true);
      return;
    }

    if (phase === 'waiting') {
      motion.clock += dt;
      if (motion.clock >= flight.delay && model) { // thrown in once its 3D model is ready
        rigidBody.setLinvel({ x: flight.dir * flight.speed, y: random(-40, 40), z: 0 }, true);
        const [x, y, z] = randomVector(MIN_SPIN, MAX_SPIN);
        rigidBody.setAngvel({ x, y, z }, true);
        setStage('entering');
      }
      return;
    }

    if (hovered) {
      const r = rigidBody.rotation();
      motion.turn.set(r.x, r.y, r.z, r.w).slerp(FACING, 1 - Math.exp(-10 * dt)); // hovered: turns to face the screen
      rigidBody.setNextKinematicRotation(motion.turn);
      const label = labelRef.current;
      if (label) {
        const half = label.offsetWidth / 2;
        const x = THREE.MathUtils.clamp(position.x, -edge + half + 4, edge - half - 4);
        const gap = ICON_RADIUS * HOVER_SCALE + 6;
        const y = position.y < -bounds.height / 2 + 80 ? `calc(${-position.y - gap}px - 100%)` : `${-position.y + gap}px`;
        label.style.transform = `translate(${x - half}px, ${y})`;
      }
      return;
    }

    if (phase === 'entering') {
      if (Math.abs(position.x) <= edge - ICON_RADIUS - 2) { // fully in: the sides hold it from now on
        setStage('settled');
      } else {
        const velocity = rigidBody.linvel();
        if (velocity.x * flight.dir < 80) rigidBody.setLinvel({ x: flight.dir * 80, y: velocity.y, z: 0 }, true); // still crossing the side: keep it coming in
      }
    } else {
      motion.sinceKick += dt;
      if (motion.sinceKick >= motion.nextKick) {
        motion.sinceKick = 0;
        motion.nextKick = random(0.4, 1.8); // s
        const angle = random(0, TWO_PI);
        const kick = random(20, 55) * rigidBody.mass();
        rigidBody.applyImpulse({ x: Math.cos(angle) * kick, y: Math.sin(angle) * kick, z: 0 }, true);
        const spin = rigidBody.angvel();
        const [x, y, z] = randomVector(0.3, 1.2);
        rigidBody.setAngvel({ x: spin.x + x, y: spin.y + y, z: spin.z + z }, true);
      }

      const maxX = edge - ICON_RADIUS; // after a resize: back inside the walls
      const maxY = bounds.height / 2 - ICON_RADIUS;
      if (Math.abs(position.x) > maxX || Math.abs(position.y) > maxY) {
        rigidBody.setTranslation(
          { x: THREE.MathUtils.clamp(position.x, -maxX, maxX), y: THREE.MathUtils.clamp(position.y, -maxY, maxY), z: 0 },
          true
        );
      }
    }

    const velocity = rigidBody.linvel();
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed > MAX_SPEED) { // thrown in: glides down to a drift
      const k = (MAX_SPEED + (speed - MAX_SPEED) * Math.exp(-DRAG * dt)) / speed;
      rigidBody.setLinvel({ x: velocity.x * k, y: velocity.y * k, z: 0 }, true);
    } else if (phase === 'settled' && speed < 1) {
      const [x, y] = randomVelocity();
      rigidBody.setLinvel({ x, y, z: 0 }, true);
    } else if (phase === 'settled' && speed < MIN_SPEED) {
      const k = MIN_SPEED / speed;
      rigidBody.setLinvel({ x: velocity.x * k, y: velocity.y * k, z: 0 }, true);
    }

    const spin = rigidBody.angvel();
    const spinSpeed = Math.hypot(spin.x, spin.y, spin.z);
    if (spinSpeed < 0.01) {
      const [x, y, z] = randomVector(MIN_SPIN, MAX_SPIN);
      rigidBody.setAngvel({ x, y, z }, true);
    } else if (spinSpeed < MIN_SPIN || spinSpeed > MAX_SPIN) {
      const k = THREE.MathUtils.clamp(spinSpeed, MIN_SPIN, MAX_SPIN) / spinSpeed;
      rigidBody.setAngvel({ x: spin.x * k, y: spin.y * k, z: spin.z * k }, true);
    }
  });

  const setHover = (value: boolean) => {
    setPointed(value);
    onHover(value ? flight.skill.name : null);
  };

  return (
    <RigidBody
      ref={body}
      type={hovered ? 'kinematicPosition' : 'dynamic'} // hovered: holds still, the others bounce off it
      position={flight.start}
      rotation={motion.rotation}
      colliders={false}
      gravityScale={0}
      linearDamping={0}
      angularDamping={0}
      enabledTranslations={[true, true, false]} // moves in the screen plane, tumbles freely
    >
      <BallCollider
        args={[hovered ? ICON_RADIUS * HOVER_SCALE : ICON_RADIUS]}
        collisionGroups={COLLIDES[phase]}
        restitution={0.95}
        friction={0.4} // hits also set the logos spinning
      />
      <group ref={visual}>
        {model && <LogoMesh model={model} />}
        <mesh
          onPointerOver={(event) => {
            if (phase !== 'settled') return;
            event.stopPropagation();
            setHover(true);
          }}
          onPointerOut={() => hovered && setHover(false)}
        >
          <sphereGeometry args={[ICON_RADIUS, 16, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </RigidBody>
  );
};

const Walls = ({ width, height }: { width: number; height: number }) => {
  const t = 40;
  const reach = width / 2 + 3 * OUT; // past the sides, for logos coming in or swept out
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[reach, t / 2, 200]} position={[0, height / 2 + t / 2, 0]} collisionGroups={COLLIDES.floor} restitution={1} friction={0.3} />
      <CuboidCollider args={[reach, t / 2, 200]} position={[0, -height / 2 - t / 2, 0]} collisionGroups={COLLIDES.floor} restitution={1} friction={0.3} />
      <CuboidCollider args={[t / 2, height / 2 + t, 200]} position={[-width / 2 - t / 2, 0, 0]} collisionGroups={COLLIDES.sides} restitution={1} friction={0.3} />
      <CuboidCollider args={[t / 2, height / 2 + t, 200]} position={[width / 2 + t / 2, 0, 0]} collisionGroups={COLLIDES.sides} restitution={1} friction={0.3} />
    </RigidBody>
  );
};

const Broom = ({ sweep }: { sweep: MutableRefObject<Sweep> }) => {
  const body = useRef<RapierRigidBody>(null);
  const { size } = useThree();

  useBeforePhysicsStep((world) => { // per physics step, not per frame: can't skip over a logo
    const s = sweep.current;
    const broom = body.current;
    if (!s.active || !broom) return;

    const from = -s.dir * (s.width / 2 + OUT);
    if (s.time === 0) broom.setTranslation({ x: from - (s.dir * BROOM_DEPTH) / 2, y: 0, z: 0 }, true);
    s.time += world.timestep;
    const progress = Math.min(s.time / SWEEP_TIME, 1);
    s.lead = from + s.dir * (s.width + 2 * OUT) * ((1 - Math.cos(Math.PI * progress)) / 2);

    if (progress < 1) {
      broom.setNextKinematicTranslation({ x: s.lead - (s.dir * BROOM_DEPTH) / 2, y: 0, z: 0 });
    } else {
      s.active = false;
      broom.setTranslation({ x: PARKED, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[PARKED, 0, 0]}>
      <CuboidCollider args={[BROOM_DEPTH / 2, size.height, 200]} collisionGroups={COLLIDES.broom} restitution={0} friction={0.5} />
    </RigidBody>
  );
};

interface LogosProps {
  skills: Skill[];
  upcoming: Skill[];
  tab: string;
  direction: 1 | -1;
  active: boolean;
  onHover: (name: string | null) => void;
  labelRef: RefObject<HTMLSpanElement>;
}

const Logos = ({ skills, upcoming, tab, direction, active, onHover, labelRef }: LogosProps) => {
  const { size } = useThree();
  const [flights, setFlights] = useState<Flight[]>([]);
  const sweep = useRef<Sweep>({ dir: direction, time: 0, width: size.width, lead: 0, active: false });
  const shown = useRef<string | null>(null);
  const batch = useRef(0);

  useEffect(() => {
    if (!active || shown.current === tab) return; // first reveal and every tab switch
    shown.current = tab;
    batch.current += 1;
    sweep.current = { dir: direction, time: 0, width: size.width, lead: -direction * (size.width / 2 + OUT), active: true };
    const next = makeFlights(skills, direction, size.width, size.height, batch.current);
    setFlights((current) => [...current.map((flight) => (flight.leaving ? flight : { ...flight, leaving: true })), ...next]);
  }, [active, tab, direction, skills, size.width, size.height]);

  useEffect(() => {
    const id = window.setTimeout(() => { // builds the other tab's models in the background
      upcoming.forEach((skill) => loadLogoModel(skill.logo).catch(() => undefined));
    }, 2500);
    return () => window.clearTimeout(id);
  }, [upcoming]);

  const onGone = useCallback((id: string) => setFlights((current) => current.filter((flight) => flight.id !== id)), []);

  return (
    <>
      <Walls width={size.width} height={size.height} />
      <Broom sweep={sweep} />
      {flights.map((flight) => (
        <FloatingLogo
          key={flight.id}
          flight={flight}
          bounds={size}
          sweep={sweep}
          onHover={onHover}
          onGone={onGone}
          labelRef={labelRef}
        />
      ))}
    </>
  );
};

interface SkillsSceneProps {
  skills: Skill[];
  upcoming: Skill[]; // other tab, prepared in the background
  tab: string;
  direction: 1 | -1; // broom direction; new logos come from the other side
  active: boolean; // stage seen: the first logos are thrown in
  running: boolean; // false off screen: rendering and physics pause
}

const SkillsScene = ({ skills, upcoming, tab, direction, active, running }: SkillsSceneProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: FOV, position: [0, 0, 1200], near: 100, far: 5000 }}
        dpr={[1, 1.5]}
        frameloop={running ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
      >
        <PixelCamera />
        <ambientLight intensity={0.6} />
        <directionalLight position={[250, 300, 500]} intensity={1.4} />
        <Suspense fallback={null}>
          <Environment files={ENVIRONMENT} />
          <Physics gravity={[0, 0, 0]} paused={!running}>
            <CoreGlobe />
            <Logos
              skills={skills}
              upcoming={upcoming}
              tab={tab}
              direction={direction}
              active={active}
              onHover={setHovered}
              labelRef={labelRef}
            />
          </Physics>
        </Suspense>
      </Canvas>
      <span ref={labelRef} className={`skills__name${hovered ? ' is-visible' : ''}`}>
        {hovered}
      </span>
    </>
  );
};

export default SkillsScene;
