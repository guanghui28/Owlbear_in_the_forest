/** @type {HTMLCanvasElement} */
window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1280;
    canvas.height = 720;

    class InputHandler {
        constructor(game) {
            this.game = game;

            window.addEventListener("keydown", (e) => {
                this.game.lastKey = "P" + e.key;
            });
            window.addEventListener("keyup", (e) => {
                this.game.lastKey = "R" + e.key;
            });
        }
    }

    class OwlBear {
        constructor(game) {
            this.game = game;
            this.image = owlbearImg;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 200;
            this.y = 300;
            this.maxSpeed = 3;
            this.speedX = 0;
            this.speedY = 0;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 30;
            this.fps = 60;
            this.frameInterval = 1000 / this.fps;
            this.frameTimer = 0;
        }
        draw(ctx) {
            // ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        setSpeed(speedX, speedY) {
            this.speedX = speedX;
            this.speedY = speedY;
        }
        update(deltaTime) {
            // move
            if (this.game.lastKey === "PArrowLeft") {
                this.setSpeed(-this.maxSpeed, 0);
                this.frameY = 3;
            } else if (this.game.lastKey === "RArrowLeft" && this.speedX < 0) {
                this.setSpeed(0, 0);
                this.frameY = 2;
            } else if (this.game.lastKey === "PArrowRight") {
                this.setSpeed(this.maxSpeed, 0);
                this.frameY = 5;
            } else if (this.game.lastKey === "RArrowRight" && this.speedX > 0) {
                this.setSpeed(0, 0);
                this.frameY = 4;
            } else if (this.game.lastKey === "PArrowUp") {
                this.setSpeed(0, -this.maxSpeed * 0.6);
                this.frameY = 7;
            } else if (this.game.lastKey === "RArrowUp" && this.speedY < 0) {
                this.setSpeed(0, 0);
                this.frameY = 6;
            } else if (this.game.lastKey === "PArrowDown") {
                this.setSpeed(0, this.maxSpeed * 0.6);
                this.frameY = 1;
            } else if (this.game.lastKey === "RArrowDown" && this.speedY > 0) {
                this.setSpeed(0, 0);
                this.frameY = 0;
            } else {
                this.setSpeed(0, 0);
            }
            this.x += this.speedX;
            this.y += this.speedY;
            // boundaries
            // horizontal boundaries
            if (this.x <= 0) this.x = 0;
            else if (this.x + this.width >= this.game.width)
                this.x = this.game.width - this.width;
            // vertical boundaries
            if (this.y <= this.game.topMargin) this.y = this.game.topMargin;
            else if (this.y + this.height >= this.game.height)
                this.y = this.game.height - this.height;
            // sprite Animation
            if (this.frameTimer > this.frameInterval) {
                this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
                this.frameTimer = 0;
            } else this.frameTimer += deltaTime;
        }
    }

    class Object {
        constructor(game) {
            this.game = game;
        }
        draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    class Bush extends Object {
        constructor(game) {
            super(game);
            this.image = bushImg;
            this.spriteWidth = 216;
            this.spriteHeight = 100;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random() * (this.game.width - this.width);
            this.y =
                this.game.topMargin +
                Math.random() *
                    (this.game.height - this.height - this.game.topMargin);
        }
    }
    class Grass extends Object {
        constructor(game) {
            super(game);
            this.image = grassImg;
            this.spriteWidth = 103;
            this.spriteHeight = 182;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random() * (this.game.width - this.width);
            this.y =
                this.game.topMargin +
                Math.random() *
                    (this.game.height - this.height - this.game.topMargin);
        }
    }
    class Plant extends Object {
        constructor(game) {
            super(game);
            this.image = plantImg;
            this.spriteWidth = 212;
            this.spriteHeight = 118;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random() * (this.game.width - this.width);
            this.y =
                this.game.topMargin +
                Math.random() *
                    (this.game.height - this.height - this.game.topMargin);
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.topMargin = 200;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.player = new OwlBear(this);
            this.numberOfPlants = 10;
            this.plants = [];
            this.init();
            console.log(this.plants);
        }
        init() {
            for (let i = 0; i < this.numberOfPlants; i++) {
                const randomize = Math.random();
                if (randomize < 0.3) {
                    this.plants.push(new Bush(this));
                } else if (randomize < 0.6) {
                    this.plants.push(new Grass(this));
                } else {
                    this.plants.push(new Plant(this));
                }
            }
        }
        render(ctx, deltaTime) {
            [...this.plants, this.player]
                .sort((a, b) => a.y + a.height - b.y - b.height)
                .forEach((obj) => {
                    obj.draw(ctx);
                });
            this.player.update(deltaTime);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
});
