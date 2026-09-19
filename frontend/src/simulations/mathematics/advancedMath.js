export const mandelbrotExplorer = {
  id: "mandelbrot-explorer",
  title: "Mandelbrot Explorer",
  category: "Mathematics",
  description: "Interactive fractal zoom using complex numbers. Pure Canvas 2D.",
  defaultParams: {
    maxIterations: 50,
  },
  init: (ctx, width, height) => ({
    zoom: 1, offsetX: -0.5, offsetY: 0, imgData: null
  }),
  update: (ctx, width, height, dt, state, mouse, isDetail, params) => {
    // Only calculate when state changes for performance
    if (!state.imgData || mouse.isDown) {
      if(mouse.isDown) {
        state.offsetX += (mouse.x - width/2) * 0.01 / state.zoom;
        state.offsetY += (mouse.y - height/2) * 0.01 / state.zoom;
        state.zoom *= 1.05;
      } else {
        state.zoom *= 1.001; // slow zoom when idle
      }

      // Render at low res for preview, medium res for detail
      const res = isDetail ? 2 : 4; 
      const w = Math.floor(width / res);
      const h = Math.floor(height / res);
      const imgData = ctx.createImageData(w, h);
      const maxIter = isDetail ? params.maxIterations : 30;

      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let cx = (x - w/2.0) * 4.0 / (w * state.zoom) + state.offsetX;
          let cy = (y - h/2.0) * 4.0 / (w * state.zoom) + state.offsetY;
          let zx = 0, zy = 0, i = 0;
          
          while (zx*zx + zy*zy < 4 && i < maxIter) {
            let tmp = zx*zx - zy*zy + cx;
            zy = 2.0*zx*zy + cy;
            zx = tmp;
            i++;
          }
          
          const index = (x + y * w) * 4;
          if (i === maxIter) {
            imgData.data[index] = 0;
            imgData.data[index+1] = 0;
            imgData.data[index+2] = 0;
            imgData.data[index+3] = 255;
          } else {
            const hue = (i * 10) % 360;
            // Rough HSL to RGB approx for pure math
            imgData.data[index] = (i*5) % 255; 
            imgData.data[index+1] = (i*10) % 255; 
            imgData.data[index+2] = (i*20) % 255; 
            imgData.data[index+3] = 255;
          }
        }
      }
      state.imgData = imgData;
      
      // We must scale up the low-res image data.
      // Create offscreen canvas:
      state.offCanvas = document.createElement('canvas');
      state.offCanvas.width = w;
      state.offCanvas.height = h;
      state.offCanvas.getContext('2d').putImageData(imgData, 0, 0);
    }
    
    if (state.offCanvas) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(state.offCanvas, 0, 0, width, height);
    }
  }
};
