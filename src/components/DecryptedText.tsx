import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface DecryptedTextProps {
  text: string;
  className?: string;
  animateOn?: 'load' | 'view' | 'hover';
  speed?: number;
  revealDirection?: 'left' | 'right' | 'center';
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className = '',
  animateOn = 'hover',
  speed = 30,
  revealDirection = 'left',
}) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ' '));
  const intervals = useRef<NodeJS.Timeout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const scrambleAndReveal = () => {
    if (hasAnimated.current && (animateOn === 'view' || animateOn === 'load')) return;
    hasAnimated.current = true;

    const letters = text.split('');
    let revealOrder = Array.from({ length: letters.length }, (_, i) => i);

    if (revealDirection === 'right') {
      revealOrder.reverse();
    } else if (revealDirection === 'center') {
      revealOrder.sort((a, b) => {
        const mid = Math.floor(letters.length / 2);
        return Math.abs(a - mid) - Math.abs(b - mid);
      });
    }

    intervals.current.forEach(clearInterval);
    intervals.current = [];

    letters.forEach((_, index) => {
      const interval = setInterval(() => {
        setDisplayText(prev => {
          const newText = [...prev];
          newText[index] = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          return newText;
        });
      }, speed);
      intervals.current[index] = interval;
    });

    revealOrder.forEach((index, i) => {
      setTimeout(() => {
        clearInterval(intervals.current[index]);
        setDisplayText(prev => {
          const newText = [...prev];
          newText[index] = letters[index];
          return newText;
        });
      }, (i + 1) * (speed * 2));
    });
  };

  useEffect(() => {
    if (animateOn === 'load') {
      scrambleAndReveal();
    }

    if (animateOn === 'view') {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          scrambleAndReveal();
        }
      }, { threshold: 0.5 });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    }

    return () => intervals.current.forEach(clearInterval);
  }, [text, animateOn]);

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={animateOn === 'hover' ? scrambleAndReveal : undefined}
      className={`font-mono tracking-wider ${className}`}
    >
      {displayText.map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </motion.div>
  );
};

export default DecryptedText;
