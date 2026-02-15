'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const generateOrthogonalPath = () => {
  const startX = random(100, 1100);
  const startY = random(100, 700);
  const numSegments = Math.floor(random(4, 8));
  let path = `M${startX},${startY}`;
  let currentX = startX;
  let currentY = startY;
  const startHorizontal = Math.random() > 0.5;

  for (let i = 0; i < numSegments; i++) {
    const isHorizontal = startHorizontal ? i % 2 === 0 : i % 2 !== 0;
    if (isHorizontal) {
      const segLength = random(100, 450) * (Math.random() > 0.5 ? 1 : -1);
      const newX = Math.max(0, Math.min(1200, currentX + segLength));
      path += ` L${newX},${currentY}`;
      currentX = newX;
    } else {
      const segLength = random(80, 350) * (Math.random() > 0.5 ? 1 : -1);
      const newY = Math.max(0, Math.min(800, currentY + segLength));
      path += ` L${currentX},${newY}`;
      currentY = newY;
    }
  }

  return path;
};

interface PathElement {
  d: string;
  duration: number;
  delay: number;
  strokeWidth: number;
  rotateX: number[];
  rotateY: number[];
  rotateZ: number[];
  moveX: number[];
  moveY: number[];
  scale: number[];
  offsetX: number;
  offsetY: number;
}

interface RandomElements {
  paths: PathElement[];
  planes: { x: number; y: number; width: number; height: number; duration: number; delay: number; moveX: number; moveY: number }[];
}

export default function AbstractAnimation() {
  const [elements, setElements] = useState<RandomElements | null>(null);

  useEffect(() => {
    // クライアントサイドでのみランダム値を生成
    setElements({
      paths: Array.from({ length: 10 }, () => {
        const rx1 = random(-15, 15), rx2 = random(-20, 20), rx3 = random(-10, 10);
        const ry1 = random(-20, 20), ry2 = random(-25, 25), ry3 = random(-15, 15);
        const rz1 = random(-8, 8), rz2 = random(-12, 12);
        const mx1 = random(-80, 80), mx2 = random(-60, 60);
        const my1 = random(-60, 60), my2 = random(-40, 40);
        const s1 = random(0.85, 1.15), s2 = random(0.9, 1.2);
        return {
          d: generateOrthogonalPath(),
          duration: random(5, 16),
          delay: random(0, 10),
          strokeWidth: random(0.5, 2.5),
          rotateX: [0, rx1, rx2, rx3, 0],
          rotateY: [0, ry1, ry2, ry3, 0],
          rotateZ: [0, rz1, rz2, 0],
          moveX: [0, mx1, mx2, 0],
          moveY: [0, my1, my2, 0],
          scale: [1, s1, s2, 1],
          offsetX: random(-10, 10),
          offsetY: random(-10, 10),
        };
      }),
      planes: Array.from({ length: 4 }, () => ({
        x: random(500, 1000),
        y: random(100, 500),
        width: random(100, 300),
        height: random(80, 200),
        duration: random(15, 25),
        delay: random(0, 3),
        moveX: random(-50, 50),
        moveY: random(-40, 40),
      })),
    });
  }, []);

  // 初期レンダリング時は何も表示しない（ハイドレーションエラー回避）
  if (!elements) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '1000px' }}>
      {/* 各パスが独立した3D空間で動く */}
      {elements.paths.map((path, i) => (
        <motion.div
          key={`path-wrapper-${i}`}
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            left: `${path.offsetX}%`,
            top: `${path.offsetY}%`,
          }}
          animate={{
            rotateX: path.rotateX,
            rotateY: path.rotateY,
            rotateZ: path.rotateZ,
            x: path.moveX,
            y: path.moveY,
            scale: path.scale,
          }}
          transition={{
            duration: path.duration * 1.5,
            delay: path.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id={`grad-${i}`} x1={i % 2 === 0 ? '0%' : '100%'} y1="0%" x2={i % 2 === 0 ? '100%' : '0%'} y2="100%">
                <motion.stop
                  offset="0%"
                  animate={{
                    stopColor: [
                      `rgba(${Math.floor(random(0, 40))},${Math.floor(random(0, 40))},${Math.floor(random(0, 40))},0.04)`,
                      `rgba(${Math.floor(random(60, 120))},${Math.floor(random(60, 120))},${Math.floor(random(60, 120))},0.14)`,
                      `rgba(${Math.floor(random(20, 60))},${Math.floor(random(20, 60))},${Math.floor(random(20, 60))},0.06)`,
                      `rgba(${Math.floor(random(0, 40))},${Math.floor(random(0, 40))},${Math.floor(random(0, 40))},0.04)`,
                    ],
                  }}
                  transition={{ duration: random(6, 12), repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.stop
                  offset="100%"
                  animate={{
                    stopColor: [
                      `rgba(${Math.floor(random(60, 100))},${Math.floor(random(60, 100))},${Math.floor(random(60, 100))},0.1)`,
                      `rgba(0,0,0,0.02)`,
                      `rgba(${Math.floor(random(40, 80))},${Math.floor(random(40, 80))},${Math.floor(random(40, 80))},0.15)`,
                      `rgba(${Math.floor(random(60, 100))},${Math.floor(random(60, 100))},${Math.floor(random(60, 100))},0.1)`,
                    ],
                  }}
                  transition={{ duration: random(6, 12), repeat: Infinity, ease: 'easeInOut' }}
                />
              </linearGradient>
            </defs>
            <motion.path
              d={path.d}
              fill="none"
              stroke={`url(#grad-${i})`}
              strokeWidth={path.strokeWidth}
              strokeLinecap="square"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                times: [0, 0.4, 0.6, 1],
                ease: [
                  [0.55, 0.055, 0.675, 0.19],
                  'linear',
                  [0.55, 0.055, 0.675, 0.19],
                ],
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* 独立して3D回転する平面要素 */}
      {elements.planes.map((plane, i) => (
        <motion.div
          key={`plane-${i}`}
          className="absolute border border-neutral-200/20"
          style={{
            left: plane.x,
            top: plane.y,
            width: plane.width,
            height: plane.height,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: [0, 45, -30, 20, 0],
            rotateY: [0, -60, 40, -20, 0],
            rotateZ: [0, 15, -10, 5, 0],
            x: [0, plane.moveX, plane.moveX * 0.5, 0],
            y: [0, plane.moveY, plane.moveY * 0.5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
            opacity: [0.1, 0.3, 0.15, 0.25, 0.1],
          }}
          transition={{
            duration: plane.duration,
            delay: plane.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* グラデーションオーバーレイも3D的に動く */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 65% 35%, rgba(0,0,0,0.03) 0%, transparent 50%)',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [-5, 5, -5],
          rotateY: [5, -5, 5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
