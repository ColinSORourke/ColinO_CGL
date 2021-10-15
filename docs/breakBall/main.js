title = "BreakBall";

description = `
Rotate
`;

characters = [
`
RR  RR
RR  RR
  RR  
  RR  
RR  RR
RR  RR
`
];

/**
 * @typedef {{
 * center: Vector,
 * size: number,
 * topAngle: number,
 * topPoint: Vector,
 * rightAngle: number,
 * rightPoint: Vector,
 * leftAngle: number,
 * leftPoint: Vector,
 * lives: number,
 * }} Player
 */

/**
 * @type { Player }
 */
let obj;

/**
 * @typedef {{
 * pos: Vector,
 * age: number,
 * score: number,
 * color: string,
 * }} Score
 */

/**
 * @type { Score []}
 */
let scores;

/**
 * @typedef {{
 * pos: Vector,
 * hits: number,
 * velocity: Vector,
 * }} Ball
 */

/**
 * @type { Ball []}
 */
let balls;

const G = {
  WIDTH: 150,
  HEIGHT: 150
}
let centerS = 0;
let modRate = 0.15;

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 3,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "pixel", 
  isDrawingParticleFront: true
};

function update() {
  if (!ticks) {
    scores = [];
    balls = [];
    obj = {
      center: vec(G.WIDTH/2, G.HEIGHT/2),
      size: 30,
      topAngle: -PI/2,
      topPoint: vec(G.WIDTH/2 + cos(-PI/2)*30, G.HEIGHT/2 + sin(-PI/2)*30),
      rightAngle: PI/6,
      rightPoint: vec(G.WIDTH/2 + cos(PI/6)*30, G.HEIGHT/2 + sin(PI/6)*30),
      leftAngle: (PI/6) * 5,
      leftPoint: vec(G.WIDTH/2 + cos((PI/6)*5)*30, G.HEIGHT/2 + sin((PI/6)*5)*30),
      lives: 4
    }
  }

  if (obj.lives <= 0){
    end();
  }

  if (floor((ticks + 20)/40) == (ticks + 20)/40){
    modRate *= -1
    if (balls.length < 2 + difficulty && modRate > 0){
      let x;
      let y;
      let rndSeed = rnd();
      if (rndSeed < 0.25){
        x = 0 + rndi(6,24)
        y = rndi(6,G.HEIGHT-6)
      } else if (rndSeed < 0.5){
        x = G.WIDTH - rndi(6,24)
        y = rndi(6,G.HEIGHT-6)
      } else if (rndSeed < 0.75){
        x = rndi(6,G.WIDTH-6)
        y = 0 + rndi(6,24)
      } else {
        x = rndi(6,G.WIDTH-6)
        y = G.HEIGHT - rndi(6,24)
      }
      let newB = {
        pos: vec(x,y),
        hits: -5,
        velocity: vec(0,0)
      }
      balls.push(newB)
    }
  }
  centerS += modRate;
  if (input.isPressed){
    obj.topAngle += 0.05
    obj.rightAngle = obj.topAngle + (PI * 2 / 3)
    obj.leftAngle = obj.topAngle + (PI * 4 / 3)
    obj.topPoint = vec(obj.center.x + cos(obj.topAngle)*obj.size, obj.center.y + sin(obj.topAngle)*obj.size)
    obj.rightPoint = vec(obj.center.x + cos(obj.rightAngle)*obj.size, obj.center.y + sin(obj.rightAngle)*obj.size)
    obj.leftPoint = vec(obj.center.x + cos(obj.leftAngle)*obj.size, obj.center.y + sin(obj.leftAngle)*obj.size)
  }
  
  

  let i = 0;
  let leftEdge = (obj.lives - 1) * 4;
  color("black")
  while (i < obj.lives){
    char('a', G.WIDTH/2 - leftEdge, G.HEIGHT - 4)
    i += 1
    leftEdge -= 8
  }

  color("black")
  box(obj.center, obj.size/2 + centerS)
  partialLine(obj.topPoint, obj.rightPoint, 0.5, 2, "green")
  partialLine(obj.topPoint, obj.leftPoint, 0.5, 2, "red")
  partialLine(obj.rightPoint, obj.leftPoint, 0.5, 2, "blue")

  remove(balls, (b) => {
    let angle = b.pos.angleTo(obj.center)
    let remove = false

    b.velocity.add(vec(0.01 * cos(angle), 0.01 * sin(angle)))
    //b.velocity.clamp(-1, 1, -1, 1)
    b.pos.add(b.velocity)
    
    let myColor = (b.hits >= 0)
        ? "light_black"
        : "yellow"

    color(myColor);
    let bColl = box(b.pos, 4).isColliding.rect;
    if(bColl.light_blue || bColl.light_red || bColl.light_green){
      b.velocity.rotate(PI)
      b.pos.add(b.velocity)
      b.hits += 1;
    }
    else if (bColl.red){
      let w = vec(obj.topPoint.x - obj.leftPoint.x, obj.topPoint.y - obj.leftPoint.y)
      w.rotate(PI/2)
      w.normalize()
      let dot = w.x * b.velocity.x + w.y * b.velocity.y
      w.mul(2)
      w.mul(dot)
      b.velocity.sub(w)
      b.pos.add(b.velocity)
      b.hits += 1;
      //b.velocity.rotate(PI)
    }
    else if (bColl.blue){
      let w = vec(obj.rightPoint.x - obj.leftPoint.x, obj.rightPoint.y - obj.leftPoint.y)
      w.rotate(PI/2)
      w.normalize()
      let dot = w.x * b.velocity.x + w.y * b.velocity.y
      w.mul(2)
      w.mul(dot)
      b.velocity.sub(w)
      b.pos.add(b.velocity)
      b.hits += 1;
    }
    else if (bColl.green){
      let w = vec(obj.topPoint.x - obj.rightPoint.x, obj.topPoint.y - obj.rightPoint.y)
      w.rotate(PI/2)
      w.normalize()
      let dot = w.x * b.velocity.x + w.y * b.velocity.y
      w.mul(2)
      w.mul(dot)
      b.velocity.sub(w)
      b.pos.add(b.velocity)
      b.hits += 1;
    }
    
    if (bColl.black){
      if (b.hits >= 0){
        myAddScore(1, obj.center.x-2, obj.center.y - 15)
        color("black")
        particle(obj.center, 10, 5)
        play("coin")
        remove = true
      } else {
        obj.lives -= 1
        color("yellow")
        particle(obj.center, 10, 5)
        play("hit")
        remove = true
      }
    }

    if (b.hits >= 6){
      remove = true
    }
    return remove;
  })

  remove(scores, (s) => {
    color(s.color)
    s.pos.y -= 0.1
    text("+" + s.score, s.pos)
    s.age -= 1
    let disappear = (s.age <= 0)
    return disappear
  })
}

function partialLine(pntA, pntB, percentCut, thick, myColor){
  let xA = pntA.x + ((pntB.x - pntA.x) * (percentCut * 0.5));
  let xB = pntB.x - ((pntB.x - pntA.x) * (percentCut * 0.5));
  let yA = pntA.y + ((pntB.y - pntA.y) * (percentCut * 0.5));
  let yB = pntB.y - ((pntB.y - pntA.y) * (percentCut * 0.5));
  let newA = vec(xA, yA);
  let newB = vec(xB, yB);
  color(myColor);
  line(newA, newB, thick);
  color("light_"+myColor)
  box(newA, thick+1)
  box(newB, thick+1)
}

function myAddScore(value, x = G.WIDTH/2, y = G.HEIGHT/2, color = "black", time = 60){
  let score = {
    pos: vec(x,y),
    age: time,
    score: value,
    color: color
  }
  scores.push(score)
  addScore(value);
}