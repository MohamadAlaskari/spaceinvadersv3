


const gamebtn = document.getElementById('game');
const main = document.getElementById('main');
const backArrow = document.getElementById('backArrow')
const vid_bg = document.querySelector('.vid-bg')
const start_game = document.getElementById('start-game')



window.onload = function () {
    var introVideo = document.getElementById('intro-video');

    introVideo.onended = function () {
        introVideo.style.opacity = 0;
        setTimeout(function(){

            introVideo.style.display = 'none';
        },2000);
     
        vid_bg.style.display = 'block';
        document.getElementById('main').style.display = 'block';
        document.querySelector('.gameMenue').style.display = 'block';
    };
};



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