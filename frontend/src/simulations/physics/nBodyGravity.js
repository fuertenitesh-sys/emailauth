export const nBodyGravity = {
  id: "n-body-gravity",
  title: "N-Body Gravity",
  category: "Physics",
  description: "Explore gravitational interactions between multiple bodies using Newtonian mechanics.",
  defaultParams: {
    G: 0.1,
    friction: 0.99,
    particleCount: 200,
  },
  init: (ctx, width, height, isDetail, params) => {
    const pCount = isDetail ? params.particleCount : 50;
    const particles = [];
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        mass: Math.random() * 5 + 1,
        color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)` // Blueish
      });
    }
    // Add one super massive black hole at the center
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      mass: 500,
      color: '#ffffff',
      isFixed: true
    });
    return { particles };
  },
  update: (ctx, width, height, dt, state, mouse, isDetail, params) => {
    const { particles } = state;
    const { G, friction } = params;
    
    // Mouse interaction: acts as a temporary massive body
    let mouseBody = null;
    if (mouse.isDown) {
      mouseBody = { x: mouse.x, y: mouse.y, mass: 1000 };
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }

    // Calculate forces
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      if (p1.isFixed) continue;

      let fx = 0;
      let fy = 0;

      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx*dx + dy*dy;
        if (distSq < 100) continue; // Prevent infinite forces

        const force = (G * p1.mass * p2.mass) / distSq;
        const dist = Math.sqrt(distSq);
        fx += (force * dx) / dist;
        fy += (force * dy) / dist;
      }

      if (mouseBody) {
        const dx = mouseBody.x - p1.x;
        const dy = mouseBody.y - p1.y;
        const distSq = dx*dx + dy*dy;
        if (distSq > 100) {
          const force = (G * p1.mass * mouseBody.mass) / distSq;
          const dist = Math.sqrt(distSq);
          fx += (force * dx) / dist;
          fy += (force * dy) / dist;
        }
      }

      p1.vx += (fx / p1.mass);
      p1.vy += (fy / p1.mass);
    }

    // Move and draw
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p.isFixed) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= friction;
        p.vy *= friction;
        
        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.sqrt(p.mass), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
  }
};
