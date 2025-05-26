
import React, { useEffect, useRef, useState } from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  animate?: boolean;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', title, subtitle, animate = false, id }) => {
  const [isVisible, setIsVisible] = useState(!animate);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, 
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current && observer) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animate]);

  const animationClass = animate ? (isVisible ? 'animate-premium-slide-in-up' : 'opacity-0') : '';
  // Added subtle gradient for a more premium feel to sections
  const baseBg = className?.includes('bg-brand-gray-950') || className?.includes('bg-brand-premium-blue') ? '' : 'bg-gradient-to-b from-brand-gray-900 to-brand-gray-850';


  return (
    <section 
      ref={sectionRef} 
      id={id} 
      className={`py-12 md:py-16 ${baseBg} ${animationClass} ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-50 mb-3">{title}</h2>}
            {subtitle && <p className="text-lg text-brand-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;