export const LEVEL_SCORE = 15;
export const MAX_SCORE = LEVEL_SCORE * 4;
export const Monsterlifetime = 10;

export const PLAYERS = [
  "assets/images/player/level1_player1.png",
  "assets/images/player/level1_player2.png",
  "assets/images/player/level1_player3.png",
  "assets/images/player/level1_player4.png",
  "assets/images/player/level2_player1.png",
  "assets/images/player/level2_player2.png",
  "assets/images/player/level2_player3.png",
  "assets/images/player/level2_player4.png",
];
export const ENEMIES = [...new Array(6)].map(
  (_, idx) => `assets/images/enemy/enemy${idx + 1}.png`
);

export const BUBBLES_UPDATE_PLAYER = [
  "assets/images/bubble/bublle-Update-Player_L1_2.png",
  "assets/images/bubble/bublle-Update-Player_L1_3.png",
  "assets/images/bubble/bublle-Update-Player_L1_4.png",
  "assets/images/bubble/bublle-Update-Player_L2_1.png",
  "assets/images/bubble/bublle-Update-Player_L2_2.png",
  "assets/images/bubble/bublle-Update-Player_L2_3.png",
  "assets/images/bubble/bublle-Update-Player_L2_4.png",
];

export const BULLETS = [
  "assets/images/bullet/bullet1.png",
  "assets/images/bullet/bullet2.png",
  "assets/images/bullet/bullet3.png",
  "assets/images/bullet/bullet4.png",
]