export const molecularDynamics = {
  id: "molecular-dynamics",
  title: "Molecular Dynamics",
  category: "Chemistry",
  description: "Lennard-Jones potential simulating atomic attraction and repulsion.",
  defaultParams: { temperature: 1, epsilon: 5, sigma: 20 },
  init: (ctx, width, height, isDetail) => {
    let atoms = [];
    for(let i=0; i<(isDetail?60:30); i++) {
      atoms.push({x: Math.random()*width, y: Math.random()*height, vx: Math.random()-0.5, vy: Math.random()-0.5});
    }
    return { atoms };
  },
  update: (ctx, width, height, dt, state, mouse, isDetail, params) => {
    const { epsilon, sigma } = params;
    
    // Calculate forces
    for(let i=0; i<state.atoms.length; i++) {
      let fx = 0, fy = 0;
      let a1 = state.atoms[i];
      for(let j=0; j<state.atoms.length; j++) {
        if(i===j) continue;
        let a2 = state.atoms[j];
        let dx = a1.x - a2.x, dy = a1.y - a2.y;
        let r2 = dx*dx + dy*dy;
        if(r2 < 4000) { // cutoff
          let r6 = (sigma*sigma*sigma*sigma*sigma*sigma) / (r2*r2*r2);
          let r12 = r6*r6;
          // Force magnitude using derivative of Lennard-Jones
          let fMag = 24 * epsilon * (2*r12 - r6) / r2;
          fx += fMag * dx; fy += fMag * dy;
          
          // Draw bonds if close enough
          if(r2 < sigma*sigma*4 && i < j) {
            ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${1 - r2/(sigma*sigma*4)})`;
            ctx.stroke();
          }
        }
      }
      
      // Mouse interaction
      if(mouse.isDown) {
        let dx = a1.x - mouse.x, dy = a1.y - mouse.y;
        let r2 = dx*dx + dy*dy;
        if(r2 < 10000) {
          fx += (1000 / r2) * dx; fy += (1000 / r2) * dy; // repel
        }
      }
      
      a1.vx += fx * 0.01; a1.vy += fy * 0.01;
      
      // Thermostat (simple velocity rescaling)
      let v2 = a1.vx*a1.vx + a1.vy*a1.vy;
      if(v2 > params.temperature*4) {
        a1.vx *= 0.9; a1.vy *= 0.9;
      }
    }
    
    // Move and draw
    state.atoms.forEach(a => {
      a.x += a.vx; a.y += a.vy;
      // Wrap
      if(a.x < 0) a.x = width; if(a.x > width) a.x = 0;
      if(a.y < 0) a.y = height; if(a.y > height) a.y = 0;
      
      ctx.beginPath(); ctx.arc(a.x, a.y, 4, 0, 7);
      ctx.fillStyle = '#10b981'; ctx.fill();
    });
  }
};
