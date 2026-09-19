import React, { useRef, useEffect, useState } from 'react';

/**
 * A highly optimized generic Canvas engine for running scientific simulations.
 * Handles resize, devicePixelRatio, requestAnimationFrame, IntersectionObserver pausing,
 * and mouse tracking.
 */
export const SimulationEngine = ({ simulation, isDetail, params, onUpdateParams }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const reqRef = useRef(null);
  const stateRef = useRef(null);
  
  const [isVisible, setIsVisible] = useState(false);

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, clickX: null, clickY: null });

  // Intersection Observer for performance pausing
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for opaque backgrounds
    if (!ctx) return;

    // Resize function
    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Cap DPI to 2 to save performance on ultra-high-res displays, or 1 for preview mode
      const dpr = isDetail ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
      return { width: rect.width, height: rect.height };
    };

    let { width, height } = resize();

    // Init simulation state if needed
    if (!stateRef.current && simulation.init) {
      stateRef.current = simulation.init(ctx, width, height, isDetail, params);
    }

    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // seconds, capped at 0.1s to prevent huge jumps
      lastTime = time;

      // Ensure width/height are still accurate
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width !== width || rect.height !== height) {
          const dims = resize();
          width = dims.width;
          height = dims.height;
          if (simulation.onResize) {
            simulation.onResize(stateRef.current, width, height, isDetail);
          }
        }
      }

      // Clear background
      ctx.fillStyle = '#0a0a0f'; // Dark premium background
      ctx.fillRect(0, 0, width, height);

      // Execute simulation mathematical model
      if (simulation.update) {
        simulation.update(ctx, width, height, dt, stateRef.current, mouseRef.current, isDetail, params, onUpdateParams);
      }

      // Reset one-frame click registers
      mouseRef.current.clickX = null;
      mouseRef.current.clickY = null;

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, [isVisible, simulation, isDetail, params, onUpdateParams]);

  // Event Listeners for Interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handlePointerDown = (e) => {
      updateMousePos(e);
      mouseRef.current.isDown = true;
      mouseRef.current.clickX = mouseRef.current.x;
      mouseRef.current.clickY = mouseRef.current.y;
    };

    const handlePointerMove = (e) => {
      updateMousePos(e);
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Cleanup simulation state on total unmount
  useEffect(() => {
    return () => {
      if (stateRef.current && simulation.cleanup) {
        simulation.cleanup(stateRef.current);
      }
      stateRef.current = null;
    };
  }, [simulation]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', borderRadius: 'inherit' }}>
      <canvas 
        ref={canvasRef} 
        style={{ touchAction: 'none' }} // Prevent scrolling while interacting with simulation
      />
    </div>
  );
};
