(function () {
    drawTable();

    var level = [
        '**************',
        '**************',
        '**************',
        '**************'
    ];

    var gameLoop;
    var gameSpeed = 20;
    var ballMovementSpeed = 5;

    var bricks = [];
    var bricksMargin = 1;
    var bricksWidth = 0;
    var bricksHeight = 18;

    var ball = {
        width: 6,
        height: 6,
        left: 0,
        top: 0,
        speedLeft: 0,
        speedTop: 0
    };


    var score = 0;
    var highestScore = 0;
    var highestScore2 = 0;
    var highestScore3 = 0;
    var life = 3;

    let xDirection = 2;
    let yDirection = 2;

    var paddle = {
        width: 100,
        height: 6,
        left: (document.getElementById('breakout').offsetWidth / 2) - 30,
        top: document.getElementById('breakout').offsetHeight - 40
    };

    document.getElementById("highestScore").innerHTML = localStorage.getItem("highestScore");


    function startGame () {
        score = 0;
        document.getElementById("life").innerHTML = life;
        document.getElementById('gameover').innerHTML = "GAME HAS STARTED"

        document.getElementById("score").innerHTML = score;
        
        resetBall();
        buildLevel();
        createBricks();
        updateObjects();
        
    };

    function drawTable() {
        document.body.style.background = '#0E5CAD';
        document.body.style.font = '18px Orbitron';
        document.body.style.color = '#FFF';
        
        var breakout = document.createElement('div');
        var paddle = document.createElement('div');
        var ball = document.createElement('div');
        var cloud = document.createElement('div');
        
        breakout.id = 'breakout';
        breakout.style.width = '800px';
        breakout.style.height = '600px';
        breakout.style.position = 'fixed';
        breakout.style.left = '50%';
        breakout.style.top = '50%';
        breakout.style.transform = 'translate(-50%, -50%)';
        breakout.style.background = '#000000';
        
        paddle.id = 'paddle';
        paddle.style.background = '#E80505';
        paddle.style.position = 'absolute';
        paddle.style.boxShadow = '0 15px 6px -2px rgba(0,0,0,.6)';

        ball.className = 'ball';
        ball.style.position = 'absolute';
        ball.style.background = '#FFF';
        ball.style.boxShadow = '0 15px 6px -1px rgba(0,0,0,.6)';
        ball.style.borderRadius = '50%';
        ball.style.zIndex = '9';



        
        breakout.appendChild(paddle);
        breakout.appendChild(ball);
        
        document.body.appendChild(breakout);
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function buildLevel () {
        var arena = document.getElementById('breakout');
    
        bricks = [];
    
        for (var row = 0; row < level.length; row ++) {
            for (var column = 0; column <= level[row].length; column ++) {
    
                if (!level[row][column] || level[row][column] === ' ') {
                    continue;
                }
    
                bricksWidth = (arena.offsetWidth - bricksMargin * 2) / level[row].length;
    
                bricks.push({
                    left: bricksMargin * 2 + (bricksWidth * column),
                    top: bricksHeight * row + 60,
                    width: bricksWidth - bricksMargin * 2,
                    height: bricksHeight - bricksMargin * 2
                });
            }
        }
    }

    function removeBricks () {
        document.querySelectorAll('.brick').forEach(function (brick) {
            removeElement(brick);
        });
    }

    function createBricks () {
        removeBricks();

        var arena = document.getElementById('breakout');

        bricks.forEach(function (brick, index) {
            var element = document.createElement('div');

            element.id = 'brick-' + index;
            element.className = 'brick';
            element.style.left = brick.left + 'px';
            element.style.top = brick.top + 'px';
            element.style.width = brick.width + 'px';
            element.style.height = brick.height + 'px';
            element.style.background = '#FFFFFF';
            element.style.position= 'absolute';
            element.style.boxShadow= '0 15px 20px 0px rgba(0,0,0,.4)';

            arena.appendChild(element)
        });
    }

    function updateObjects () {
        document.getElementById('paddle').style.width = paddle.width + 'px';
        document.getElementById('paddle').style.height = paddle.height + 'px';
        document.getElementById('paddle').style.left = paddle.left + 'px';
        document.getElementById('paddle').style.top = paddle.top + 'px';

        document.querySelector('.ball').style.width = ball.width + 'px';
        document.querySelector('.ball').style.height = ball.height + 'px';
        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
    }

    function resetBall () {

     
        var arena = document.getElementById('breakout');

        ball.left = (arena.offsetWidth / 2) - (ball.width / 2);
        ball.top = (arena.offsetHeight / 1.6) - (ball.height / 2);
        ball.speedLeft = 1;
        ball.speedTop = ballMovementSpeed;
    
        if (Math.round(Math.random() * 1)) {
            ball.speedLeft = -ballMovementSpeed;
        }

        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
        


    }

    function movePaddle (clientX) {
        var arena = document.getElementById('breakout');
        var arenaRect = arena.getBoundingClientRect();
        var arenaWidth = arena.offsetWidth;
        var mouseX = clientX - arenaRect.x;
        var halfOfPaddle = document.getElementById('paddle').offsetWidth / 2;

        if (mouseX <= halfOfPaddle) {
            mouseX = halfOfPaddle;
        }

        if (mouseX >= arenaWidth - halfOfPaddle) {
            mouseX = arenaWidth - halfOfPaddle;
        }

        paddle.left = mouseX - halfOfPaddle;
    }


    function movePaddleKey(e){

        switch(e.key){
            case "ArrowLeft":
                if (paddle.left > 0) {
                paddle.left -= 8;
                updateObjects();
            }
                break;
            case "ArrowRight":
                if (paddle.left<700) {
                paddle.left += 8;
                updateObjects();
            }
                break;
        }
    }

    function moveBall () {
        
        detectCollision();

        var arena = document.getElementById('breakout');
    
        ball.top += ball.speedTop;
        ball.left += yDirection;

    
        if (ball.left <= 0 || ball.left + ball.width >= arena.offsetWidth) {
            ball.speedLeft = -ball.speedLeft;
            changeDirection()
            ball.left += yDirection;

        }
    
        if (ball.top <= 0 || ball.top + ball.height >= arena.offsetHeight) {
            ball.speedTop = -ball.speedTop;
            //changeDirection();
            ball.left += yDirection;
        }

        if (ball.top + ball.height >= arena.offsetHeight) {
            if (life > 0) {
                life -= 1;
                resetBall();
                document.getElementById("life").innerHTML = life;
            }
            else {
                document.getElementById('gameover').innerHTML = "GAME OVER"
                gameOverStopGame();
                life = 3;

            }
        }
    }

    function detectCollision () {
        if (ball.top + ball.height >= paddle.top
         && ball.top + ball.height <= paddle.top + paddle.height
         && ball.left >= paddle.left
         && ball.left <= paddle.left + paddle.width
        ) {
            ball.speedTop = -ball.speedTop;
            ball.left += yDirection;
            
        }
        
        for (var i = 0; i < bricks.length; i++) {



            var brick = bricks[i];

            if (brick == 69) {
                continue
            }
            else{
    
            if (ball.top + ball.height >= brick.top
             && ball.top <= brick.top + brick.height
             && ball.left + ball.width >= brick.left
             && ball.left <= brick.left + brick.width
             && !brick.removed
            ) {

                
                var nene = document.getElementById("brick-" + i);

                removeElement(nene);

                bricks[i] = 69;



                ball.speedTop = -ball.speedTop;

                if (ball.speedTop < 11 && ball.speedTop > 0) {ball.speedTop += 2;} //NEDENSE TAM BU ŞARTLARI SAĞLAMAZSA 4-5 vuruştan sonra topa vuramıyoruz.
                

                score += 1;
                document.getElementById("score").innerHTML = score;
                updateObjects();
                
                
                //BULUT YAPAMADIM 10da 1 olasılıkla extra can veriyor bunu da yanda gösteriyor.

                if (Math.floor(Math.random() * 10) == 2) {
                    
                    life += 1;
                    document.getElementById("life").innerHTML = life;
                    document.getElementById("gotLife").innerHTML = "+1 LIFE!!!";

                    setTimeout(function() {
                        $('#gotLife').fadeIn('fast');
                    }, 150);

                    setTimeout(function() {
                        $('#gotLife').fadeOut('fast');
                    }, 2000);
                  

                }


                 
                break;
            }

        }
    }

    }




    function changeDirection(){
        if (yDirection === 2 && yDirection === 2) {
            yDirection = -2;
            return
        }
        else {
            yDirection = 2;
        }
        


    }

    function setEvents () {
        document.addEventListener('mousemove', function (event) {
            movePaddle(event.clientX);
        });

        document.addEventListener('keydown', movePaddleKey);
        
    }

    function startGameLoop () {
        gameLoop = setInterval(function () {
            moveBall();
            updateObjects();
        }, gameSpeed);
    }

    document.getElementById("life").innerHTML = life;
    document.getElementById("start").onclick = startGameAll;

    function startGameAll(){
        setEvents();
        startGame();
        startGameLoop();
    }

    function gameOverStopGame(){
        clearInterval(gameLoop);
        document.getElementById("start").innerHTML = "START AGAIN";
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
        }
        


        
        document.getElementById("highestScore").innerHTML = localStorage.getItem("highestScore");
    }


    document.addEventListener('keyup', function(event){
        if (event.keyCode === 80) {
            clearInterval(gameLoop);
        }
    })

    document.addEventListener('keyup', function(event){
        if (event.keyCode === 82) {
            startGameLoop();
        }
    })




   

})();