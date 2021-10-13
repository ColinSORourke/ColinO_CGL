title = "Light Switch";

description = `
[Hold] to stop 
moving and 
turn on lights
`;

characters = [
`
  LL
  LL
 yyyy
yywwyy
yyyyyy
 yyyy 
`,
`
llllll
llblbl
llblbl
llllll
 l  l 
 l  l 
`,`
      
llllll
llblbl
llblbl
llllll
ll  ll
`,
`
gg  gg
gggggg
 glgg 
 gggg 
gggggg
gg  gg
`,
`
  rr
 rrrr
rrlrrr
rrrrrr
 rrrr
  rr 
`,
`
 ccccc
clc
cc
cc
ccc
 ccccc
`,`
 pppp 
pplppp
 pppp 
 pppp
  pp  
  pp  
`
];

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * char: string,
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;


/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * facing: boolean,
 * match: string,
 * streak: number,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

const G = {
  WIDTH: 100,
  HEIGHT: 150,

  STAR_SPEED_MIN: 0.12,
  STAR_SPEED_MAX: 0.24,
}

let colors = {
  bg: "white",
  bulb: "light_black",
  ground: "light_green",
  items: "white"
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 7,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "dark",
};

function update() {
  if (!ticks) {
    stars = []
    player = {
        pos: vec(G.WIDTH * 0.5, G.HEIGHT -19),
        speed: 0.5,
        facing: true,
        match: "z",
        streak: 0,
    }
  }

  if (floor(ticks/80) == ticks/80){
    const posX = rnd(0, G.WIDTH);
    const posY = 10;
    let i = rnd()
    let char;
    if (i < 0.25){
      char = "d"
    } else if (i < 0.5){
      char = "e"
    } else if (i < 0.75){
      char = "f"
    } else {
      char = "g"
    }
    let newObj = {
      pos: vec(posX, posY),
      speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
      char: char
    }
    stars.push(newObj)
  }

  if (input.isJustPressed){
    colors.bg = "light_blue"
    colors.bulb = "black"
    colors.ground = "green"
    colors.items = "black"
    play("laser")
  }

  if (input.isJustReleased){
    colors.bg = "transparent"
    colors.bulb = "light_black"
    colors.ground = "light_green"
    colors.items = "white"
  }

  if (!input.isPressed){
    if (player.pos.x > 100 || player.pos.x < 0){
      player.facing = !player.facing
    }
    if (player.facing){
      player.pos.x += player.speed
    } else {
      player.pos.x -= player.speed
    }
  }

  // Background Box
  color(colors.bg);
  rect(0, 7, 100, 133);

  // 'Rows'
  color('light_blue')
  rect(0, 35, 100, 2)
  rect(0, 70, 100, 2)
  rect(0, 105, 100, 2)

  // Draw Player
  const side = (player.facing)
            ? 1
            : -1;

  color('black')
  char(addWithCharCode("b", (floor(ticks / 20) % 2 && !input.isPressed)), player.pos, {
    // @ts-ignore
    mirror: {x: side},
  })

  // Draw and remove stars
  remove(stars, (s) => {
    s.pos.y += s.speed;
    
    let belowGround = s.pos.y > 135


    color(colors.items);
    const bColl = char(s.char, s.pos).isColliding.char;
    let collidePlayer = bColl.b || bColl.c
    if (collidePlayer){
      if (s.char == player.match){
        player.streak += 1;
        addScore(player.streak)
        if (player.streak > 5){
          play("coin")
        } else {
          play("jump")
        }
      } else {
        player.match = s.char;
        player.streak = 1;
        addScore(player.streak)
        play("jump")
      }
    }

    return(belowGround || collidePlayer)
  })

  // light bulb
  color(colors.bulb)
  char("a", G.WIDTH/2, 10)  

  // ground
  color(colors.ground)
  rect(0, 134, 100, 6)
}
