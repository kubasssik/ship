var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var aster = [];
var fire = [];
var expl = [];
var timer = 0;
var ship = { x: 300, y: 300, }

var fonimg = new Image();
fonimg.src = 'static/img/fon.png';

var shipimg = new Image();
shipimg.src = 'static/img/ship.png';

var fireimg = new Image();
fireimg.src = 'static/img/ship.png';

var explimg = new Image();
explimg.src = 'static/img/expl.png';

var asterimg = new Image();
asterimg.src = 'static/img/meteor.png';



canvas.addEventListener('mousemove', function (evevnt) {
    ship.x = evevnt.offsetX - 25;
    ship.y = evevnt.offsetY - 50;
})



fonimg.onload = function () {
    game()
}

//Игровой цикл
function game() {
    update()
    render()
    requestAnimFrame(game)
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function update() {
    //Чистим канвас
    context.clearRect(0, 0, canvas.width, canvas.height);
    //Генерация астероидов
    timer++
    if (timer % 1 === 0) {
        aster.push({
            x: getRandomArbitrary(50, 550),
            //x: 300,
            y: -50,
            dx: getRandomArbitrary(-3, 3),
            //dx: 0,
            dy: getRandomArbitrary(-2, 4),
            s: getRandomArbitrary(20, 50),
            del: 0,
        })
    }
    //Выстрел
    if (timer % 1 === 0) {
        fire.push({ x: ship.x + 10, y: ship.y, dx: 0, dy: -5.2 });
        fire.push({ x: ship.x + 10, y: ship.y, dx: 0.5, dy: -5.2 });
        fire.push({ x: ship.x + 10, y: ship.y, dx: -0.5, dy: -5.2 });
    }
    //Движение пули
    for (let i in fire) {
        fire[i].x = fire[i].x + fire[i].dx
        fire[i].y = fire[i].y + fire[i].dy
        if (fire[i].y < -30) fire.splice(i, 1)
    }

    //Анимация взрыва
   for(let i in expl){
    expl[i].animx = expl[i].animx+0.5;
    if(expl[i].animx > 7){expl[i].animy++; expl[i].animx = 0}
    if(expl[i].animy > 7)
    expl.splice(i, 1)
   }

    //Физика
    for (let i in aster) {
        aster[i].x = aster[i].x + aster[i].dx
        aster[i].y = aster[i].y + aster[i].dy

        //Границы
        if (aster[i].x >= 550 || aster[i].x < 0) aster[i].dx = -aster[i].dx
        // if(aster[i].y >= 550 || aster[i].y < 0) aster[i].dy = -aster[i].dy;//
        if (aster[i].y >= 600) aster.splice(i, 1)

        for (let j in fire) {
            //Проверяет столкновение
            //Если размер астероида(aster[i].x) +(плюс) половина астероида(aster[i].s /2 )
            //пуля(fire[j].x) -(минус)  половина размера высота(fire[j].x - 5)
            // меньше половина астероида(aster[i].s /2 ) И(&&) 
            // ширина астероида(aster[i].x) -(минус) ширина пули(fire[j].y) меньше половина астероида(aster[i].s /2 )
            if (Math.abs(aster[i].x + aster[i].s / 2  - fire[j].x - 7.5) < aster[i].s / 2 && Math.abs(aster[i].y - fire[j].y) < aster[i].s / 4) {

                //Спавн взрыва
                expl.push({x:aster[i].x - 25,y:aster[i].y -25, animx:0, animy:0})
                //Помечаем астероид на удаление
                aster[i].del = 1;
                //удаление
                fire.splice(j, 1); break;
            }
        }
        //Удаляем астероид
        if (aster[i].del === 1) aster.splice(i, 1)

    }

}

function render() {
    //Фон
    context.drawImage(fonimg, 0, 0, 600, 600);
    //Корабль
    context.drawImage(shipimg, ship.x, ship.y, 30, 50);
    //Выстрел
    for (let i in fire) context.drawImage(fireimg, fire[i].x, fire[i].y, 10, 15);
    //Астероиды
    for (let i in aster) context.drawImage(asterimg, aster[i].x, aster[i].y, aster[i].s, aster[i].s,);

    for(let i in expl){
        context.drawImage(
            explimg, 
            200*Math.floor(expl[i].animx), //Позиция фрагмента
            200*Math.floor(expl[i].animy),//Позиция фрагмента
            200,//размер фрагмента
            200,//размер фрагмента
            expl[i].x,//координаты взрыва
            expl[i].y,//координаты взрыва
            100,//размер взрыва
            100//размер взрыва
            )
    }
}

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20)
        };
})();
