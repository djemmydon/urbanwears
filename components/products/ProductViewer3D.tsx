"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

type ProductType = "polo" | "tshirt" | "hoodie";

function ClothingModel({
    type,
    color = "#ffffff",
}: {
    type: ProductType;
    color?: string;
}) {
    return (
        <group>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.3} />

            {/* Base Torso */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[1.05, 0.95, 2.1, 32]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.75}
                    metalness={0.1}
                />
            </mesh>

            {type === "hoodie" && (
                <>
                    {/* Hood */}
                    <mesh position={[0, 1.35, -0.4]} rotation={[0.6, 0, 0]}>
                        <sphereGeometry
                            args={[0.95, 32, 32, 0, Math.PI * 2, 0, 2.2]}
                        />
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </mesh>
                    {/* Kangaroo Pocket */}
                    <mesh position={[0, -0.4, 0.8]}>
                        <sphereGeometry
                            args={[0.7, 32, 32, 0, Math.PI * 2, 1.8, 1.8]}
                        />
                        <meshStandardMaterial color={color} roughness={0.9} />
                    </mesh>
                </>
            )}

            {type === "polo" && (
                <>
                    {/* Collar */}
                    <mesh position={[0, 1.25, 0]}>
                        <torusGeometry
                            args={[1.1, 0.15, 16, 32, Math.PI * 1.6]}
                        />
                        <meshStandardMaterial color="#111" roughness={0.6} />
                    </mesh>
                    {/* Buttons line */}
                    <mesh position={[0.3, 0.8, 1.05]}>
                        <planeGeometry args={[0.15, 1.2]} />
                        <meshStandardMaterial color="#ddd" />
                    </mesh>
                </>
            )}

            {type === "tshirt" && (
                <>
                    {/* Crew Neck */}
                    <mesh position={[0, 1.1, 0]}>
                        <torusGeometry
                            args={[1.08, 0.22, 16, 32, Math.PI * 1.8]}
                        />
                        <meshStandardMaterial color={color} roughness={0.7} />
                    </mesh>
                </>
            )}

            {/* Sleeves - Common to all */}
            <mesh position={[-1.45, 0.4, 0]} rotation={[0, 0, 1.1]}>
                <cylinderGeometry args={[0.38, 0.32, 1.9, 24]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[1.45, 0.4, 0]} rotation={[0, 0, -1.1]}>
                <cylinderGeometry args={[0.38, 0.32, 1.9, 24]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
        </group>
    );
}

export default function ProductViewer3D({
    type = "tshirt",
    color = "#ffffff",
}: {
    type: ProductType;
    color?: string;
}) {
    return (
        <div className="w-full aspect-[4/4.2] bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden relative border border-gray-100 dark:border-zinc-800 shadow-inner">
            <Canvas camera={{ position: [0, 0.8, 5.5], fov: 42 }}>
                <Suspense fallback={null}>
                    <ClothingModel type={type} color={color} />
                    <Environment preset="studio" />
                    <ContactShadows
                        position={[0, -2.8, 0]}
                        opacity={0.5}
                        scale={10}
                        blur={2}
                    />
                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={9}
                        autoRotate
                        autoRotateSpeed={0.35}
                        target={[0, 0.4, 0]}
                    />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-5 left-5 bg-black/70 backdrop-blur-md text-white/90 text-xs px-4 py-2 rounded-full">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    );
}
