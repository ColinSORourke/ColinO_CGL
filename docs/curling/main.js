title = "Curling";

description = `
curlingGame
`;

characters = [
`
 LLLL 
LLLLLL
LLLLLL
LLLLLL
LLLLLL
 LLLL
`
];

const G = {
  WIDTH: 200,
  HEIGHT: 80,
  
  PUCKVERT: 1,
  PUCKPOSMAX: 70,
  PUCKPOSMIN: 10,
  
  PUCKANGLE: 0.01,
  DIRLENGTH: 25,
  PUCKANGLEMAX: Math.PI/4,
  PUCKANGLEMIN: -Math.PI/4,
}
// PUCK VERT is the speed the Puck moves up and down in vertical selection
// PUCK ANGLE is the speed the angle moves up and down in angle selection

const STATE = {
  POSITION: 0,
  ANGLE: 1,
  POWER: 2,
  FREE: 3
}

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * angle: number,
 * reverse: boolean,
 * state: number,
 * sprite: string,
 * target: Vector
 * }} Puck
 */
// Reverse is to reverse the direction of movement in Angle/Vertical selection
// When the puck reaches an 'edge'

/**
 * @type { Puck }
 */
let puck;

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 3,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "simple"
};

function update() {
  if (!ticks) {
    puck = {
      pos: vec(10, G.HEIGHT / 2),
      speed: 0,
      angle: 0,
      reverse: false,
      state: STATE.POSITION,
      sprite: "a",
      target: vec(10, G.HEIGHT / 2),
    }
  }
  // DRAW BACKGROUND
  color('black')
  char("a", puck.pos);

  color('light_cyan');
  rect(0,G.PUCKPOSMAX+3,200,1)
  rect(0,G.PUCKPOSMIN-3,200,-1)
  
  // UPDATE OBJECT INFOS DEPENDING ON STATE
  switch (puck.state) {
    case STATE.POSITION:
      // MOVE UP & DOWN, REVERSE WHEN HIT EDGE
      if ((puck.pos.y + puck.speed) > G.PUCKPOSMAX || (puck.pos.y - puck.speed) < G.PUCKPOSMIN) {
        puck.reverse = !puck.reverse;
      } 
      if (puck.reverse) {
        puck.pos.y += G.PUCKVERT
      } else {
        puck.pos.y -= G.PUCKVERT;
      }
      if (input.isJustPressed) {
        // do set position
        // switch to STATE.ANGLE
        puck.state = STATE.ANGLE
      }
      break;
    case STATE.ANGLE:
      // Change angle up and down, reverse when hit edge
      // Draw line forecasting direction of current angle
      if (puck.reverse) {
        puck.angle += G.PUCKANGLE 
      } else {
        puck.angle -= G.PUCKANGLE
      }
      puck.target.x = puck.pos.x + Math.cos(puck.angle)*G.DIRLENGTH;
      puck.target.y = puck.pos.y + Math.sin(puck.angle)*G.DIRLENGTH;
      line(puck.pos, puck.target, 1)
      if (puck.angle > G.PUCKANGLEMAX || puck.angle < G.PUCKANGLEMIN || puck.target.y > G.PUCKPOSMAX+3 || puck.target.y < G.PUCKPOSMIN-3){
        puck.reverse = !puck.reverse
      }
      if (input.isJustPressed) {
        // do set angle
        // switch to STATE.POWER
        puck.state = STATE.POWER
      }
    break;
    case STATE.POWER:
      // Keep drawing direction line
      line(puck.pos, puck.target, 1)
      // Charge speed up
      // Draw rectangle representing power
      if (input.isJustPressed) {
        // do set speed
        // switch to STATE.FREE
      }
    break;
    case STATE.FREE:
      // Update Puck position in the direction it is currently moving
      if (input.isJustPressed) {
        // add melted ice object to array at input position
      }
    break;
  }
  
  // DRAW UPDATED & PERSISTENT OBJECTS BELOW HERE
}
