export const doublePendulum = {
  id: "double-pendulum",
  title: "Double Pendulum",
  category: "Physics",
  description: "Experience chaos theory with a highly sensitive double pendulum simulation.",
  defaultParams: {
    g: 1,
    m1: 10,
    m2: 10,
    l1: 150,
    l2: 150,
  },
  init: (ctx, width, height, isDetail, params) => {
    return {
      a1: Math.PI / 2, // angle 1
      a2: Math.PI / 2, // angle 2
      a1_v: 0,
      a2_v: 0,
      trail: [],
      cx: width / 2,
      cy: height / 3
    };
  },
  onResize: (state, width, height) => {
    state.cx = width / 2;
    state.cy = height / 3;
  },
  update: (ctx, width, height, dt, state, mouse, isDetail, params) => {
    const { g, m1, m2, l1, l2 } = params;
    let { a1, a2, a1_v, a2_v, cx, cy, trail } = state;

    // Runge-Kutta or Euler integration (we'll use a scaled time step for stability)
    // The equations of motion for a double pendulum are complex. 
    // We compute accelerations a1_a and a2_a:
    const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    const num3 = -2 * Math.sin(a1 - a2) * m2;
    const num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2);
    const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a1_a = (num1 + num2 + num3 * num4) / den;

    const n1 = 2 * Math.sin(a1 - a2);
    const n2 = a1_v * a1_v * l1 * (m1 + m2);
    const n3 = g * (m1 + m2) * Math.cos(a1);
    const n4 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a2_a = (n1 * (n2 + n3 + n4)) / den2;

    // Update velocities and angles
    // Use a fixed smaller dt for stability, run multiple steps per frame if needed
    const steps = 2;
    const stepDt = 0.1;
    
    for(let i=0; i<steps; i++) {
        state.a1_v += a1_a * stepDt;
        state.a2_v += a2_a * stepDt;
        state.a1 += state.a1_v * stepDt;
        state.a2 += state.a2_v * stepDt;
    }

    // Dampening
    state.a1_v *= 0.999;
    state.a2_v *= 0.999;

    if (mouse.isDown && mouse.clickX !== null) {
      // Small perturbation
      state.a2_v += 0.1;
    }

    const x1 = cx + l1 * Math.sin(state.a1);
    const y1 = cy + l1 * Math.cos(state.a1);

    const x2 = x1 + l2 * Math.sin(state.a2);
    const y2 = y1 + l2 * Math.cos(state.a2);

    trail.push({ x: x2, y: y2 });
    if (trail.length > (isDetail ? 200 : 50)) {
      trail.shift();
    }

    // Draw trail
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)'; // Pinkish trail
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw arms
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw bobs
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x1, y1, m1, 0, Math.PI * 2);
    ctx.fillStyle = '#60a5fa'; // Blue
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x2, y2, m2, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899'; // Pink
    ctx.fill();
  }
};
