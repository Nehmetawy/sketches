import p5 from 'p5';
import { P5 } from './sketch';
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @TYPES  
`                                                         `
```````````````````````````````````````````````````````````
*/
type I_LINE_WORM = {
  r: number;
  a: number;
  dir: 1;
  targetAngle?: number;
  targetRadius?: number;
  die?: boolean;
};
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @CONSTANTS
`                                                         `
```````````````````````````````````````````````````````````
*/
var lineWorm: I_LINE_WORM[] = [];
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @INITIATE
`                                                         `
```````````````````````````````````````````````````````````
*/
export function WormInitiate() {
  for (let i = 0; i < 5; i++) {
    lineWorm.push({
      r: 0,
      a: 90 * i,
      dir: 1,
    });
  }
}
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @DRAW
`                                                         `
```````````````````````````````````````````````````````````
*/
export function DrawWorm() {
  for (let worm of lineWorm) {
    let x = worm.r * P5.cos(worm.a);
    let y = worm.r * P5.sin(worm.a);
    let d = P5.map(worm.r, 0, 800, 5, 30);

    if (worm.targetAngle) {
      // generate a new angle
      const newAngle = worm.a + P5.random(1, 2) * worm.dir;
      if (worm.dir === 1) {
        P5.arc(0, 0, worm.r * 2, worm.r * 2, worm.a, newAngle, 'open');
      } else {
        P5.arc(0, 0, worm.r * 2, worm.r * 2, newAngle, worm.a, 'open');
      }
      // target reached
      if (P5.abs(worm.targetAngle - newAngle) < 2) {
        worm.targetAngle = undefined;
      }
      worm.a = newAngle;
    } else {
      // assign a target angle / assign a target distance
      const lineprob = P5.random() < 0.7;
      if (lineprob) {
        // adds radius to our worm
        worm.r += d * P5.random(0.8, 1.5);
        //   draw the line
        let nx = worm.r * P5.cos(worm.a);
        let ny = worm.r * P5.sin(worm.a);
        P5.line(x, y, nx, ny);
      } else {
        // give it a new target angle
        worm.dir = P5.random([-1, 1]);
        worm.targetAngle = worm.a + P5.random(10, 30) * worm.dir;
      }
      if (x > 1000 || x < -300 || y > 800 || y < -1000) {
        worm.die = true;
        continue;
      }
    }
  }
  lineWorm = lineWorm.filter((worm) => !worm.die);
}
