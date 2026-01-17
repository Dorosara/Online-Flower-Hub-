import React, { useEffect, useState } from 'react';

const FLOWERS = ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼', '🪷', '🍃', '🍂', '🌿'];

interface FlowerProps {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  symbol: string;
  animationName: string;
}

export const FlowerBackground = () => {
  const [flowers, setFlowers] = useState<FlowerProps[]>([]);

  useEffect(() => {
    // Generate random flowers with varying properties
    const newFlowers = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position 0-100%
      duration: 10 + Math.random() * 20, // Duration between 10s and 30s
      delay: Math.random() * -30, // Negative delay to start mid-animation
      size: 1 + Math.random() * 2, // Size between 1rem and 3rem
      symbol: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
      animationName: `flower-fall-${(i % 3) + 1}` // Cycle through 3 animation types
    }));
    setFlowers(newFlowers);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      <style>
        {`
          /* Gentle swaying from left to right */
          @keyframes flower-fall-1 {
            0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            25% { transform: translate(15px, 25vh) rotate(45deg); }
            50% { transform: translate(-10px, 50vh) rotate(90deg); }
            75% { transform: translate(15px, 75vh) rotate(135deg); }
            100% { transform: translate(0, 110vh) rotate(180deg); opacity: 0; }
          }

          /* Wider sway with counter-rotation */
          @keyframes flower-fall-2 {
            0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.7; }
            33% { transform: translate(-25px, 30vh) rotate(-30deg); }
            66% { transform: translate(20px, 70vh) rotate(-60deg); }
            100% { transform: translate(0, 110vh) rotate(-100deg); opacity: 0; }
          }

          /* Slow spin and steady fall */
          @keyframes flower-fall-3 {
            0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.5; }
            50% { transform: translate(10px, 50vh) rotate(180deg); }
            100% { transform: translate(-10px, 110vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute top-0 transition-opacity duration-300"
          style={{
            left: `${flower.left}%`,
            fontSize: `${flower.size}rem`,
            animation: `${flower.animationName} ${flower.duration}s linear infinite`,
            animationDelay: `${flower.delay}s`,
            opacity: 0.5, // Base opacity to keep it subtle but visible
            willChange: 'transform'
          }}
        >
          {flower.symbol}
        </div>
      ))}
    </div>
  );
};