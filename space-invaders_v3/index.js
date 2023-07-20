


const gamebtn = document.getElementById('game');
const main = document.getElementById('main');
const backArrow = document.getElementById('backArrow')
const vid_bg = document.querySelector('.vid-bg')
const start_game = document.getElementById('start-game')







gamebtn.addEventListener('click', (e) => {
    main.style.display = 'none';
    start_game.style.display = 'inline-block';
    backArrow.style.display = 'flex';
});


start_game.addEventListener('click', (e) => {
    start_game.style.display = 'none';
    backArrow.style.display = 'none';
    vid_bg.style.display = 'none';
});


backArrow.addEventListener('click', (e) => {
    backArrow.style.display = 'none';
    start_game.style.display = 'none';
    main.style.display = 'block';
})