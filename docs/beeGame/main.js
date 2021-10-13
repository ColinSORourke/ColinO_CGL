title = "BEE";

description = `[Click] to move
`;

characters = [
`
 w  w 
  ww  
 lyly
llylyl
llylyl
 lyly
`,
`
 wwww 
 lyly
llylyl
llylyl
 lyly
      
`,`
R R R
RRRRR
  g
  ggg
ggg
  g
`,`
  BB
  BB
 BBBB
BBbbwB
BBbbBB
 BBBB
`
];

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * facing: boolean,
 * target: Vector,
 * drawTarget: boolean,
 * angle: number,
 * pCount: number,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * time: number,
 * }} Flower
 */

/**
 * @type { Flower []}
 */
let f;

const G = {
  WIDTH: 128,
  HEIGHT: 128
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 3,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "simple"
};

function update() {
  if (!ticks) {
    f = []
    player = {
        pos: vec(G.WIDTH * 0.5, G.HEIGHT*0.5),
        speed: 0.4,
        facing: true,
        target: vec(G.WIDTH * 0.5, G.HEIGHT*0.5),
        drawTarget: false,
        angle: 0,
        pCount: 0,
    }
  }

  color("black");
  rect(0,6, 128, 6)
  color("light_blue")
  rect(0,12, 128, 12)
  color("light_green")
  rect(0,24,128, 104)
  
  color("yellow")
  rect(58, 58, 12, 12).isColliding.char
  color("light_yellow")
  rect(58,58, 12, 1)
  rect(58,62, 12, 1)
  rect(58,65, 12, 1)
  rect(58,69, 12, 1)
  
  if (floor(ticks/80) == ticks/80){
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(24, G.HEIGHT - 5);
    if (posX > 45 && posX < 79 && posY > 45 && posY < 79){
      // Don't do anything
    } else {
      let newObj = {
        pos: vec(posX, posY),
        time: 450,
      }
      f.push(newObj)
    }
    
  }
  
  if (input.isJustPressed){
    player.target = vec(input.pos.x, input.pos.y);
    if (player.target.x > player.pos.x){
      player.facing = true
    } else {
      player.facing = false
    }
    player.drawTarget = true;
    player.angle = player.pos.angleTo(player.target)
    play("coin")
  }
  
  // Draw Player
  const side = (player.facing)
            ? -1
            : 1;
  
  color("light_yellow")
  if (player.pCount > 0){
    let offset = Math.max( ceil(3 - player.pCount/3), 1)
    box(player.pos.x + offset*side, player.pos.y + 2, ceil(player.pCount/3))
  }          
  color("black")
  char(addWithCharCode("a", (floor(ticks / 20) % 2)), player.pos, {
    // @ts-ignore
    mirror: {x: side},
  })
  
  color("transparent")
  let hiveColl = rect(58, 58, 12, 12).isColliding.char

  if (hiveColl.a || hiveColl.b){
    addScore(player.pCount * ceil(player.pCount/3))
    player.pCount = 0
  }
  
  remove( f, (flower) => {
    color("black")
    let fColl = char("c", flower.pos).isColliding.char
    let hitBee = fColl.a || fColl.b
    if (hitBee && player.pCount <= 15){
      player.pCount += 1
    }
    color("white")
    rect(flower.pos.x - 4, flower.pos.y + 4, 9* (flower.time / 450), 1)
    flower.time -= 1
    
    return (flower.time <= 0 || hitBee)
  })
  
  
  
  if (player.drawTarget){
    color("white")
    let boxColl = box(player.target, 2).isColliding.char
    if (boxColl.a || boxColl.b){
      player.drawTarget = false
    }
    line(player.pos, player.target, 1)
    player.pos.x += player.speed * ((18-player.pCount) / 12) * Math.cos(player.angle);
    player.pos.y += player.speed * ((18-player.pCount) / 12) * Math.sin(player.angle);
  }
  
}