import { nBodyGravity } from './physics/nBodyGravity';
import { doublePendulum } from './physics/doublePendulum';
import { mandelbrotExplorer } from './mathematics/advancedMath';
import { molecularDynamics } from './chemistry/advancedChemistry';

export const simulationsRegistry = [
  nBodyGravity,
  doublePendulum,
  mandelbrotExplorer,
  molecularDynamics
];
