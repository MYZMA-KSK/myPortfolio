'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const generateRandomPath = () => {
  const points = [];
  const numPoints = Math.floor(random(4, 7));
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: random(0, 1200),
      y: random(0, 800),
    });
  }
  return `M${points[0].x},${points[0].y} ${points.slice(1).map(p => `Q${random(0, 1200)},${random(0, 800)} ${p.x},${p.y}`).join(' ')}`;
};

interface RandomElements {
  paths: { d: string; duration: number; delay: number; strokeWidth: number; z: number }[];
  circles: { cx: number; cy: number; r: number; duration: number; delay: number; z: number; moveX: number; moveY: number }[];
  dots: { cx: number; cy: number; r: number; duration: number; delay: number; z: number; moveX: number; moveY: number }[];
  planes: { x: number; y: number; width: number; height: number; duration: number; delay: number; moveX: number; moveY: number }[];
}

export default function AbstractAnimation() {
  const [elements, setElements] = useState<RandomElements | null>(null);

  useEffect(() => {
    // クライアントサイドでのみランダム値を生成
    setElements({
      paths: Array.from({ length: 6 }, () => ({
        d: generateRandomPath(),
        duration: random(12, 20),
        delay: random(0, 3),
        strokeWidth: random(0.5, 2),
        z: random(-200, 200),
      })),
      circles: Array.from({ length: 10 }, () => ({
        cx: random(400, 1100),
        cy: random(100, 600),
        r: random(40, 180),
        duration: random(8, 16),
        delay: random(0, 4),
        z: random(-300, 300),
        moveX: random(-60, 60),
        moveY: random(-50, 50),
      })),
      dots: Array.from({ length: 20 }, () => ({
        cx: random(300, 1150),
        cy: random(50, 650),
        r: random(2, 8),
        duration: random(4, 10),
        delay: random(0, 5),
        z: random(-150, 150),
        moveX: random(-100, 100),
        moveY: random(-80, 80),
      })),
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
      {/* 3D回転するコンテナ全体 */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: [0, 3, -2, 1, 0],
          rotateY: [0, -4, 3, -2, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <motion.stop
                offset="0%"
                animate={{
                  stopColor: [
                    'rgba(0,0,0,0.03)',
                    'rgba(80,80,80,0.12)',
                    'rgba(40,40,40,0.06)',
                    'rgba(0,0,0,0.03)',
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.stop
                offset="100%"
                animate={{
                  stopColor: [
                    'rgba(100,100,100,0.1)',
                    'rgba(0,0,0,0.02)',
                    'rgba(60,60,60,0.15)',
                    'rgba(100,100,100,0.1)',
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </linearGradient>

            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <motion.stop
                offset="0%"
                animate={{
                  stopColor: [
                    'rgba(50,50,50,0.08)',
                    'rgba(120,120,120,0.05)',
                    'rgba(0,0,0,0.1)',
                    'rgba(50,50,50,0.08)',
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.stop
                offset="100%"
                animate={{
                  stopColor: [
                    'rgba(0,0,0,0.05)',
                    'rgba(80,80,80,0.12)',
                    'rgba(30,30,30,0.03)',
                    'rgba(0,0,0,0.05)',
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
            </linearGradient>

            <radialGradient id="radGrad" cx="50%" cy="50%" r="50%">
              <motion.stop
                offset="0%"
                animate={{
                  stopColor: [
                    'rgba(0,0,0,0.1)',
                    'rgba(60,60,60,0.15)',
                    'rgba(0,0,0,0.1)',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* 3D空間で動くパス */}
          {elements.paths.map((path, i) => (
            <motion.path
              key={`path-${i}`}
              d={path.d}
              fill="none"
              stroke={i % 2 === 0 ? 'url(#grad1)' : 'url(#grad2)'}
              strokeWidth={path.strokeWidth}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.7, 0.7, 0],
              }}
              style={{
                transform: `translateZ(${path.z}px)`,
              }}
              transition={{
                duration: path.duration,
                delay: path.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* 3D回転する円 */}
          {elements.circles.map((circle, i) => (
            <motion.circle
              key={`circle-${i}`}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke={i % 2 === 0 ? 'url(#grad1)' : 'url(#grad2)'}
              strokeWidth={0.7}
              animate={{
                scale: [0.8, 1.2, 0.9, 1.1, 0.8],
                opacity: [0.3, 0.7, 0.5, 0.8, 0.3],
                cx: [circle.cx, circle.cx + circle.moveX, circle.cx + circle.moveX * 0.5, circle.cx],
                cy: [circle.cy, circle.cy + circle.moveY, circle.cy + circle.moveY * 0.5, circle.cy],
              }}
              style={{
                transform: `translateZ(${circle.z}px)`,
              }}
              transition={{
                duration: circle.duration,
                delay: circle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* 浮遊するドット */}
          {elements.dots.map((dot, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="url(#radGrad)"
              animate={{
                scale: [0.5, 1.5, 0.8, 1.2, 0.5],
                opacity: [0.2, 0.9, 0.4, 0.7, 0.2],
                cx: [dot.cx, dot.cx + dot.moveX, dot.cx + dot.moveX * 0.5, dot.cx],
                cy: [dot.cy, dot.cy + dot.moveY, dot.cy + dot.moveY * 0.5, dot.cy],
              }}
              style={{
                transform: `translateZ(${dot.z}px)`,
              }}
              transition={{
                duration: dot.duration,
                delay: dot.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>

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

      {/* 浮遊する3D円形 */}
      <motion.div
        className="absolute rounded-full border border-neutral-300/15"
        style={{
          left: '60%',
          top: '20%',
          width: 200,
          height: 200,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, -90, -180, -270, -360],
          scale: [1, 1.2, 0.8, 1.1, 1],
          x: [0, 30, -20, 10, 0],
          y: [0, -40, 20, -10, 0],
          opacity: [0.2, 0.4, 0.15, 0.35, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute rounded-full border border-neutral-400/10"
        style={{
          left: '70%',
          top: '40%',
          width: 150,
          height: 150,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, -120, -240, -360],
          rotateY: [0, 60, 120, 180, 240, 300, 360],
          scale: [0.9, 1.15, 0.85, 1.05, 0.9],
          x: [0, -40, 25, -15, 0],
          y: [0, 30, -25, 15, 0],
          opacity: [0.15, 0.35, 0.1, 0.3, 0.15],
        }}
        transition={{
          duration: 20,
          delay: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

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
