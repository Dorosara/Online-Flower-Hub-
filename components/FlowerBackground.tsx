import React, { useEffect, useState } from 'react';

const FLOWERS = ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼', '🪷', '💐', '🌿', '🌾', '🍃', '🍂'];

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
    // Increased count slightly for better coverage
    const newFlowers = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position 0-100%
      duration: 15 + Math.random() * 25, // Slower, more graceful fall (15-40s)
      delay: Math.random() * -40, // Negative delay to start mid-animation
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
            10% { opacity: 0.8; }
            25% { transform: translate(20px, 25vh) rotate(45deg); }
            50% { transform: translate(-15px, 50vh) rotate(90deg); }
            75% { transform: translate(20px, 75vh) rotate(135deg); }
            100% { transform: translate(0, 110vh) rotate(180deg); opacity: 0; }
          }

          /* Wider sway with counter-rotation */
          @keyframes flower-fall-2 {
            0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            33% { transform: translate(-35px, 30vh) rotate(-30deg); }
            66% { transform: translate(25px, 70vh) rotate(-60deg); }
            100% { transform: translate(0, 110vh) rotate(-100deg); opacity: 0; }
          }

          /* Spiral/Spin fall */
          @keyframes flower-fall-3 {
            0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            50% { transform: translate(15px, 50vh) rotate(180deg); }
            100% { transform: translate(-15px, 110vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute top-0 transition-all duration-300 ease-in-out"
          style={{
            left: `${flower.left}%`,
            fontSize: `${flower.size}rem`,
            animation: `${flower.animationName} ${flower.duration}s linear infinite`,
            animationDelay: `${flower.delay}s`,
            opacity: 0.6, 
            willChange: 'transform',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' // Slight shadow for depth
          }}
        >
          {flower.symbol}
        </div>
      ))}
    </div>
  );
};