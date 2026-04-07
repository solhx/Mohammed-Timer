// components/ui/AnimatedBackground.tsx - COMPLETE COMPONENT
'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface AnimatedBackgroundProps {
  variant?: 'none' | 'particles' | 'aurora' | 'mesh' | 'gradient' | 'waves';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const AnimatedBackground = memo(function AnimatedBackground({
  variant = 'none',
  intensity = 'medium',
  className,
}: AnimatedBackgroundProps) {
  const { theme } = useThemeContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const particleCount = {
    low: 20,
    medium: 40,
    high: 80,
  }[intensity];

  // Particle animation
  useEffect(() => {
    if (variant !== 'particles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle =
          index % 2 === 0
            ? `rgba(var(--color-primary-500) / ${particle.opacity})`
            : `rgba(var(--color-accent-500) / ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((other, otherIndex) => {
          if (index === otherIndex) return;
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(var(--color-primary-500) / ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, particleCount]);

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden z-0',
        className
      )}
      aria-hidden="true"
    >
      {/* Particles Canvas */}
      {variant === 'particles' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />
      )}

      {/* Aurora Effect */}
      {variant === 'aurora' && (
        <div className="absolute inset-0">
          <div
            className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-aurora"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgb(var(--color-primary-500) / 0.15), transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 60%, rgb(var(--color-accent-500) / 0.12), transparent 50%),
                radial-gradient(ellipse 50% 30% at 40% 80%, rgb(var(--color-primary-400) / 0.1), transparent 50%)
              `,
            }}
          />
        </div>
      )}

      {/* Mesh Gradient */}
      {variant === 'mesh' && (
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: `
              radial-gradient(at 40% 20%, rgb(var(--color-primary-500) / 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 0%, rgb(var(--color-accent-400) / 0.1) 0px, transparent 50%),
              radial-gradient(at 0% 50%, rgb(var(--color-primary-600) / 0.08) 0px, transparent 50%),
              radial-gradient(at 80% 50%, rgb(var(--color-accent-500) / 0.1) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgb(var(--color-primary-400) / 0.12) 0px, transparent 50%),
              radial-gradient(at 80% 100%, rgb(var(--color-accent-600) / 0.08) 0px, transparent 50%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      )}

      {/* Simple Gradient */}
      {variant === 'gradient' && (
        <div
          className="absolute inset-0 animate-gradient-fast"
          style={{
            background: `linear-gradient(
              135deg,
              rgb(var(--color-primary-500) / 0.08),
              rgb(var(--color-accent-500) / 0.08),
              rgb(var(--color-primary-500) / 0.08)
            )`,
            backgroundSize: '400% 400%',
          }}
        />
      )}

      {/* Wave Effect */}
      {variant === 'waves' && (
        <svg
          className="absolute bottom-0 left-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--color-primary-500))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="rgb(var(--color-accent-500))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(var(--color-primary-500))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            className="animate-[wave_10s_ease-in-out_infinite]"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="url(#waveGradient)"
            className="animate-[wave_8s_ease-in-out_infinite_reverse]"
            style={{ opacity: 0.5 }}
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      )}
    </div>
  );
});