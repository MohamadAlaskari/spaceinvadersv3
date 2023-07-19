//nur 4 level auswählen
export const MAX_LEVEL = 4;
export const LEVEL_SCORE = 15;
export const MAX_SCORE = LEVEL_SCORE * MAX_LEVEL;
export const MONSTER_LIFE_TIME = 10;
export const MONSTER_SHOW = MAX_LEVEL;
//nur bei monster tot gewinnen un abhängig von maxscore
export const NUR_BY_DEAD_WIN = false;

// du kannst nur zwei rocket anzeigen und wenn Monszter ist sichbar
export const SHOWROCKET_IN_SCORE_1 = MAX_SCORE - Math.floor(LEVEL_SCORE / 2);
export const SHOWROCKET_IN_SCORE_2 = (MAX_SCORE - LEVEL_SCORE) + 2;


//assets

export const PLAYERS = [...new Array(8)].map(
  (_, idx) => `assets/images/player/player${idx + 1}.png`
)

export const ENEMIES = [...new Array(6)].map(
  (_, idx) => `assets/images/enemy/enemy${idx + 1}.png`
);

export const BUBBLES_UPDATE_PLAYER = [...new Array(8)].map(
  (_, idx) => ` assets/images/bubble/bublle-Update-Player_${idx + 2}.png`
)

export const BULLETS = [...new Array(4)].map(
  (_, idx) => `assets/images/bullet/bullet${idx + 1}.png`
)