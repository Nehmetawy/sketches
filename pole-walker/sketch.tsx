import p5 from 'p5';
import { WormInitiate, DrawWorm } from './walker';
export var P5: p5;

export class PoleWalkerManager {
  constructor(p: p5) {
    P5 = p;
    WormInitiate();
  }

  draw() {
    DrawWorm();
  }
}
