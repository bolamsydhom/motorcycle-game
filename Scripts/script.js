var audio = document.getElementById("song");
var audio2 = document.getElementById("motorcycle-song");
var audio3 = document.getElementById("coin-song");
var audio4 = document.getElementById("gas-song");
var audio5 = document.getElementById("over-song");
window.addEventListener('click', function () {

    audio.play();
})


//localStorage
var playerName = document.getElementById("player-name-input");
var newPlayer = document.getElementById("new-player");
var cont = document.querySelector('.continue');
var checked = false;
var score;
var name;



cont.addEventListener("click", () => {
    if (localStorage.key(localStorage.length - 1) != null) {
        playerName.value = localStorage.key(localStorage.length - 1);
        checked = true;
    } else {
        alert("please enter your name");
    }
})
// end localStorage

document.querySelector(".start").addEventListener('click', function () {
    var n = playerName.value;
    if (localStorage.getItem(n) === null) {
        name = n;
        score = 0;
        localStorage.setItem(n, score);

        checked = true;
    } else {
        
        document.getElementById("nameHelp").classList.remove('hide');
    }

    if (checked) {

        document.querySelector("#welcome-page").classList.add("hide");
        document.querySelector(".game").classList.remove("hide");
        audio2.play();
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        // var coin = {x: 0, y:0, size:35,collected: false};
        var coinDraw = c.getContext("2d");
        var gasDraw = c.getContext("2d");
        c.width = screen.availWidth - 1;
        c.height = screen.availHeight - 200;

        document.body.appendChild(c);

        var perm = [];
        while (perm.length < 255) {
            while (perm.includes(val = Math.floor(Math.random() * 255)));
            perm.push(val);
        }
        var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
        var noise = x => {
            x = x * 0.01 % 255;
            return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
        }
        var grounded = 0;
        var player = new function () {
            this.x = c.width / 2;
            this.y = 0;
            //player speed
            this.ySpeed = 0;
            //rotation
            this.rot = 0;
            //rotation speed
            this.rotSpeed = 0;

            this.img = new Image();
            this.img.src = "./assets/Asset 3@0.5x.png";
            this.draw = function () {
                // var grounded = 0;
                var p1 = (c.height / 1.5) - noise(movingSpeed + this.x) * 0.35;
                var p2 = (c.height / 1.5) - noise(movingSpeed + 5 + this.x) * 0.35;
                if (p1 - 14 > this.y) {
                    //    debugger;
                    grounded = 0;
                    this.ySpeed += 0.05;
                } else {
                    this.ySpeed -= (this.y - (p1 - 14)) / 2;
                    this.y = p1 - 14;
                    // debugger;
                    grounded = 1;
                }
                this.y += this.ySpeed;

                var angle = Math.atan2((p2 - 14) - this.y, (this.x + 5) - this.x);

                // angle = 2*0.65;
                // this.rotSpeed = 2;
                if (grounded) {

                    if (this.rot > 2.5) {
                        this.rot = 0.5;
                    }
                    this.rot -= (this.rot - angle) * 0.65;
                    this.rotSpeed = this.rotSpeed - (angle - this.rot);
                }
                // console.log(angle)

                this.rot -= this.rotSpeed * 0.1;
                ctx.save();
                ctx.translate(this.x - 2, this.y - 3);
                ctx.rotate(this.rot);
                ctx.drawImage(this.img, -15, -15, 42, 30);
                ctx.restore();
            }
        }
        var position = 1500;
        var coinMovingSpeed = 2;


        var coin = new function () {
            this.x = c.width / 2;
            this.y = 0;
            //player speed
            this.ySpeed = 0;


            this.image = new Image();
            this.image.src = "./assets/coin.png";
            this.draw = function () {

                var c1 = (c.height / 1.5) - noise(5 + this.x) * 0.35;

                if (c1 - 11 > this.y) {
                    //    debugger;
                    this.ySpeed += 0.1;
                } else {
                    this.ySpeed -= this.y - (c1 - 11);
                    this.y = c1 - 11;
                }
                this.y += this.ySpeed;


                coinDraw.save();
                coinDraw.translate(position, c1);
                if (position >= 1000) {
                    position -= coinMovingSpeed;
                }

                coinDraw.drawImage(this.image, -15, -15, 35, 35);
                coinDraw.restore();
                // coinDraw.closePath();
                // coinDraw.resetTransform();
            }
        }


        var gasPosition = 1400;
        var gasMovingSpeed = 5;
        var gas = new function () {
            this.x = c.width / 2;
            this.y = 0;
            //player speed
            this.ySpeed = 0;


            this.image = new Image();
            this.image.src = "./assets/gas.png";
            this.draw = function () {

                var g1 = (c.height / 1.5) - noise(5 + c.width / 2) * 0.35;

                gasDraw.save();
                gasDraw.translate(gasPosition, (g1));
                if (gasPosition >= 900) {
                    gasPosition -= gasMovingSpeed;
                }
                gasDraw.drawImage(this.image, -15, -15, 35, 35);
                gasDraw.restore();
            }
        }

        //movingSpeed is variable responible for speed of background moving
        var movingSpeed = 0;
        /////////mai////////////////////////////
        var movingSpeedScale = 0;
        var keydownFlag = 0;
        document.addEventListener('keydown', function (event) {
            if (event.key == 'ArrowRight') {
                keydownFlag = 1
                event.preventDefault()
                movingSpeedScale = 10;
                console.log(grounded);
                console.log("position: ", position);
                console.log("Gas x: ", gasPosition);
                console.log(player.x);
                console.log("coin.y :", coin.y);
                console.log("gas.y :", gas.y);
                console.log(player.y);

            } else if (event.key == 'ArrowLeft' && movingSpeed > 0) {
                keydownFlag = 1
                event.preventDefault()
                movingSpeedScale = -10;
            }

        })
        var amountOfGas = 100;
        var coinsEarned = 0;
        ///////////////////////////////////////////////
        function loop() {
            // //changing amount of Gas {Change --amountOfGas--} with your values
            if (amountOfGas <= 0) {
                audio.pause();
                audio2.pause();
                audio5.play();
                document.querySelector(".game").classList.add('hide');
                document.querySelector(".gameover").classList.remove('hide');
            }
            console.log(amountOfGas);
            var width = new function () {
                //  document.querySelector('.gas-container').dataset.width;
                if (grounded && (Math.abs(gasPosition - player.x) < 35)) {
                    audio4.play();
                    amountOfGas = 100;
                    gasPosition = 2500;
                    gas.draw();

                } else if (gasPosition >= 0 && gasPosition <= 5) {
                    gasPosition = 2500;
                    gas.draw();
                }
                document.querySelector('.gas-container__value').style.width = amountOfGas + "%";
                amountOfGas -= 0.1;


            }();
            var score = new function () {
                // console.log(player.x)
                // console.log(position)
                if (grounded && (Math.abs(position - player.x) < 35)) {
                    audio3.play();
                    coinsEarned++;
                    document.querySelector(".score").innerHTML = coinsEarned + '<img class = "score__coin" src = "./assets/coin.png" alt = ""srcset = "" >';
                    // coinDraw.closePath();
                    position = 1600;
                    coin.draw();

                } else if (position >= 0 && position <= 5) {
                    position = 1600;
                    coin.draw();
                }
            }
            ////////mai///////
            if (keydownFlag == 1) {
                movingSpeed += movingSpeedScale;
                gasPosition -= movingSpeedScale;
                position -= movingSpeedScale;
                // console.log(movingSpeed)
                keydownFlag = 0
            }
            /////mai///////////
            // movingSpeed += 5;
            // doCoin(300,500);
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.fillStyle = "#605858"
            ctx.beginPath();
            ctx.moveTo(0, c.height);
            for (let index = 0; index < c.width; index++) {
                // doCoin(index, (c.height / 1.5));
                ctx.lineTo(index, (c.height / 1.5) - noise(movingSpeed + index) * 0.35);
                // console.log((c.height / 1.5) - noise(movingSpeed + index) * 0.35);
            }

            ctx.lineTo(c.width, c.height);
            ctx.fill();


            //shadow
            ctx.fillStyle = " rgba(195, 195, 195, 0.15)"
            ctx.beginPath();
            ctx.moveTo(0, c.height);
            for (let index = 0; index < c.width; index++) {
                ctx.lineTo(index, 200 - noise(movingSpeed + index) * 0.75);
            }

            ctx.lineTo(c.width, c.height);
            ctx.fill();


            player.draw();

            ////////mai///////
            if (movingSpeed > 3000) {
                //movingSpeed=Math.floor(movingSpeed/5)
                movingSpeed = 1
            }
            //////////mai/////////////////////


            coin.draw();
            gas.draw();


            requestAnimationFrame(loop);
        }



        // //changing number of coins collected {Change --coinsEarned--} with your values
        // var score = new function () {
        //     document.querySelector(".score").innerHTML = coinsEarned + '<img class = "score__coin" src = "./assets/coin.png" alt = ""srcset = "" >';

        // }

        //changing player name
        document.querySelector(".player-name").textContent = playerName.value;




        loop();
        // var i = 0

        // while (i < 5) {
        // setInterval(() => {
        //             coin.draw();
        //     }, 3000);
        //     i++;
        // }

    }
})

//  loader js

function transition() {
    var tl = new TimelineMax();
    setTimeout(() => {
        tl = new TimelineMax();
    }, 1000);

    tl
        .to(
            CSSRulePlugin.getRule("body:before"),
            0.2, {
                cssRule: {
                    top: "50%"
                },
                ease: Power2.easeOut
            },
            "close"
        )
        .to(
            CSSRulePlugin.getRule("body:after"),
            0.2, {
                cssRule: {
                    bottom: "50%"
                },
                ease: Power2.easeOut
            },
            "close"
        )
        .to($(".loader"), 0.2, {
            opacity: 1
        })
        .to(
            CSSRulePlugin.getRule("body:before"),
            0.2, {
                cssRule: {
                    top: "0%"
                },
                ease: Power2.easeOut
            },
            "+=1.5",
            "open"
        )
        .to(
            CSSRulePlugin.getRule("body:after"),
            0.2, {
                cssRule: {
                    bottom: "0%"
                },
                ease: Power2.easeOut
            },
            "-=0.2",
            "open"
        )
        .to($(".loader"), 0.2, {
            opacity: 0
        }, "-=0.2");

    document.querySelector("#welcome-page").classList.remove("hide");

}
transition();
setTimeout(() => {

    document.getElementById("welcome-page-content").classList.remove("hide");
}, 2000);

//end loader//

//background//
var canvas = $("#wrapper-canvas").get(0);

var dimensions = {
    width: $(window).width(),
    height: $(window).height()
};


Matter.use('matter-attractors');
Matter.use('matter-wrap');

function runMatter() {
    // module aliases
    var Engine = Matter.Engine,
        Events = Matter.Events,
        Runner = Matter.Runner,
        Render = Matter.Render,
        World = Matter.World,
        Body = Matter.Body,
        Mouse = Matter.Mouse,
        Common = Matter.Common,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create();

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.1;

    // create renderer
    var render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            showVelocity: false,
            width: dimensions.width,
            height: dimensions.height,
            wireframes: false,
            background: 'rgb(240,240,240)'
        }
    });



    // create runner
    var runner = Runner.create();

    // Runner.run(runner, engine);
    // Render.run(render);

    // create demo scene
    var world = engine.world;
    world.gravity.scale = 0;

    // create a body with an attractor
    var attractiveBody = Bodies.circle(
        render.options.width / 2,
        render.options.height / 2,
        Math.max(dimensions.width / 4, dimensions.height / 4) / 2, {
            render: {
                fillStyle: `rgb(240,240,240)`,
                strokeStyle: `rgb(240,240,240)`,
                lineWidth: 0
            },

            isStatic: true,
            plugin: {
                attractors: [
                    function (bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            y: (bodyA.position.y - bodyB.position.y) * 1e-6
                        };

                    }
                ]
            }
        });




    World.add(world, attractiveBody);

    // add some bodies that to be attracted
    for (var i = 0; i < 60; i += 1) {
        // if (window.CP.shouldStopExecution(0)) break;
        let x = Common.random(0, render.options.width);
        let y = Common.random(0, render.options.height);
        let s = Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
        let poligonNumber = Common.random(3, 6);
        var body = Bodies.polygon(
            x, y,
            poligonNumber,
            s,

            {
                mass: s / 20,
                friction: 0,
                frictionAir: 0.02,
                angle: Math.round(Math.random() * 360),
                render: {
                    fillStyle: '#FFFFFF',
                    strokeStyle: `#DDDDDD`,
                    lineWidth: 2
                }
            });




        World.add(world, body);


        let r = Common.random(0, 1);
        var circle = Bodies.circle(x, y, Common.random(2, 8), {
            mass: 0.1,
            friction: 0,
            frictionAir: 0.01,
            render: {
                fillStyle: r > 0.3 ? `#FF2D6A` : `rgb(240,240,240)`,
                strokeStyle: `#E9202E`,
                lineWidth: 2
            }
        });


        World.add(world, circle);

        var circle = Bodies.circle(x, y, Common.random(2, 20), {
            mass: 6,
            friction: 0,
            frictionAir: 0,
            render: {
                fillStyle: r > 0.3 ? `#4267F8` : `rgb(240,240,240)`,
                strokeStyle: `#3257E8`,
                lineWidth: 4
            }
        });


        World.add(world, circle);

        var circle = Bodies.circle(x, y, Common.random(2, 30), {
            mass: 0.2,
            friction: 0.6,
            frictionAir: 0.8,
            render: {
                fillStyle: `rgb(240,240,240)`,
                strokeStyle: `#FFFFFF`,
                lineWidth: 3
            }
        });

        World.add(world, circle);
    }

    // add mouse control
    // window.CP.exitedLoop(0);
    var mouse = Mouse.create(render.canvas);

    Events.on(engine, 'afterUpdate', function () {
        if (!mouse.position.x) return;
        // smoothly move the attractor body towards the mouse
        Body.translate(attractiveBody, {
            x: (mouse.position.x - attractiveBody.position.x) * 0.12,
            y: (mouse.position.y - attractiveBody.position.y) * 0.12
        });

    });


    // return a context for MatterDemo to control
    let data = {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        },
        play: function () {
            Matter.Runner.run(runner, engine);
            Matter.Render.run(render);
        }
    };

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    return data;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function setWindowSize() {
    let dimensions = {};
    dimensions.width = $(window).width();
    dimensions.height = $(window).height();

    m.render.canvas.width = $(window).width();
    m.render.canvas.height = $(window).height();
    return dimensions;
}

let m = runMatter();
setWindowSize();
$(window).resize(debounce(setWindowSize, 250));
//endbackground

//music

function volMuted() {
    if (audio.volume === 0) {
        audio.volume = 1;
        audio2.volume = 1;
    } else {

        audio.volume = 0;
        audio2.volume = 0;
    }
    document.querySelector('#muted').classList.toggle('muted');

}