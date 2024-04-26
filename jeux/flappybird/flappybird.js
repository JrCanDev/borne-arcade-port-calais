var canvas,
  ctx,
  width,
  height,
  fgpos = 0,
  frames = 0,
  score = 0,
  currentstate,
  lastFrameTime = Date.now(),
  deltaTime = 0,
  goalDeltaTime = 1000 / 60, // 60 FPS
  states = {
    Splash: 0,
    Game: 1,
    Score: 2,
  },
  bird = {
    x: 60,
    y: 100,
    frameCounter: 0,
    velocity: 0,
    animation: [0, 1, 2, 1],
    rotation: 0,
    gravity: 0.25,
    _jump: 4.6,
    radius: 12,

    jump: function () {
      this.velocity = -this._jump;
    },

    update: function () {
      this.frameCounter += 1 / 8;

      this.frameCounter = this.frameCounter % this.animation.length;

      if (currentstate === states.Splash) {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
      } else {
        this.velocity += this.gravity * deltaTime;

        this.y += this.velocity * deltaTime;
        if (this.y >= height - s_fg.height - 10) {
          this.y = height - s_fg.height - 10;
          if (currentstate === states.Game) currentstate = states.Score;
          this.velocity = this._jump;
        }

        if (this.velocity >= this._jump) {
          this.frameCounter = 1;
          this.rotation = Math.min(Math.PI / 6, this.rotation + 0.3);
        } else {
          this.rotation = -0.3;
        }
      }
    },

    draw: function (ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      let n = this.animation[Math.floor(this.frameCounter)];
      s_bird[n].draw(ctx, -s_bird[n].width / 2, -s_bird[n].height / 2);

      ctx.restore();
    },
  },
  pipes = {
    _pipes: [],
    reset: function () {
      this._pipes = [];
    },
    update: function () {
      if (frames % 90 <= 1) {
        var _y =
          height -
          (s_pipeSouth.height + s_fg.height + 120 + 200 * Math.random());
        this._pipes.push({
          x: 500,
          y: _y,
          width: s_pipeSouth.width,
          height: s_pipeSouth.height,
          scored: false,
        });
      }

      for (var i = 0, len = this._pipes.length; i < len; i++) {
        var p = this._pipes[i];

        if (!p.scored && bird.x > p.x + p.width) {
          score++;
          p.scored = true;
        }

        if (i === 0) {
          var cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
          var cy1 = Math.min(Math.max(bird.y, p.y), p.y + p.height);
          var cy2 = Math.min(
            Math.max(bird.y, p.y + p.height + 80),
            p.y + 2 * p.height + 80
          );

          var dx = bird.x - cx;
          var dy1 = bird.y - cy1;
          var dy2 = bird.y - cy2;

          var d1 = dx * dx + dy1 + dy1;
          var d2 = dx * dx + dy2 * dy2;

          var r = bird.radius + bird.radius;
          if (r > d1 || r > d2) {
            currentstate = states.Score;
          }
        }

        p.x -= 2 * deltaTime;
        if (p.x < -50) {
          this._pipes.splice(i, 1);
          i--;
          len--;
        }
      }
    },

    draw: function (ctx) {
      for (var i = 0, len = this._pipes.length; i < len; i++) {
        var p = this._pipes[i];
        s_pipeSouth.draw(ctx, p.x, p.y);
        s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
      }
    },
  };

function restart() {
  pipes.reset();
  score = 0;
  currentstate = states.Splash;
}

function onpress(evt) {
  switch (currentstate) {
    case states.Splash:
      currentstate = states.Game;
      bird.jump();
      break;
    case states.Game:
      bird.jump();
      break;
    case states.Score:
      restart();
      break;
  }
}

function main() {
  currentstate = states.Splash;
  canvas = document.getElementById("viewport");
  width = canvas.width;
  height = canvas.height;

  canvas.addEventListener("touchstart", onpress);

  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  var img = new Image();

  img.onload = function () {
    initSprites(this);
    ctx.fillStyle = s_bg.color;
    okbtn = {
      x: (width - s_buttons.Ok.width) / 2,
      y: height - 200,
      width: s_buttons.Ok.width,
      height: s_buttons.Ok.height,
    };
    run();
  };

  img.src = "sheet.png";
}

function run() {
  var loop = function () {
    update();
    render();
    window.requestAnimationFrame(loop, canvas);
  };
  window.requestAnimationFrame(loop, canvas);
}

function update() {
  var now = Date.now();
  deltaTime = (now - lastFrameTime) / goalDeltaTime;
  lastFrameTime = now;

  frames += deltaTime;

  if (currentstate !== states.Score) {
    fgpos = (fgpos - 2 * deltaTime) % 14;
  }
  if (currentstate === states.Game) {
    pipes.update();
  }

  bird.update();
}

function render() {
  ctx.fillRect(0, 0, width, height);
  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);

  bird.draw(ctx);
  pipes.draw(ctx);

  s_fg.draw(ctx, fgpos, height - s_fg.height);
  s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);

  var width2 = width / 2;
  if (currentstate === states.Splash) {
    s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
    s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 400);
  }

  if (currentstate === states.Score) {
    showGameOver();
  } else {
    updateScore("flappybird", score);
  }
}

main();
