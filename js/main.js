var game =
{
  init : function()
  {
    //get canvas
    game.canvas = document.getElementById('canvas');

    //game setup
    game.soundSetup();
    game.objectSetup();

    //event listeners
    canvas.addEventListener( "mousemove", game.mouseMove );
    canvas.addEventListener( "mousedown", game.mouseDown );
    canvas.addEventListener( "mouseup", game.mouseUp );

    //start the loop
    game.fps = 60;
    game.loop = setInterval(game.run, 1000 / game.fps);
  },

  run : function()
  {
    game.updateSound();

    if(game.mouse.state == 0)
    {
      game.moveBall(game.ball);
    }

    game.updatePosition(game.ball.el);
    game.player.el.style.width = (40 - (game.player.charge / 5)) + "px";

  },


  ///////////////////////
  //  SETUP FUNCTIONS  //
  ///////////////////////

  soundSetup : function()
  {
    //setup synth 
    game.ctx = new window.AudioContext();

    //create sounds
    game.chargeSound = game.ctx.createOscillator();
    game.chargeSound.frequency.value = 0;
    game.chargeSound.start(0);


    //scale
    game.a = game.ctx.createOscillator();
    game.a.frequency.value = 110.00;
    game.a.start(0);

    game.b = game.ctx.createOscillator();
    game.b.frequency.value = 123.47;
    game.b.start(0);

    game.c = game.ctx.createOscillator();
    game.c.frequency.value = 130.81;
    game.c.start(0);

    game.d = game.ctx.createOscillator();
    game.d.frequency.value = 146.83;
    game.d.start(0);

    game.e = game.ctx.createOscillator();
    game.e.frequency.value = 164.81;
    game.e.start(0);

    game.f = game.ctx.createOscillator();
    game.f.frequency.value = 174.61;
    game.f.start(0);

    game.g = game.ctx.createOscillator();
    game.g.frequency.value = 196.00;
    game.g.start(0);



    //samples
    soundManager.setup(
    {
      url: '/sound/', onready: function()
      {
        var laser = soundManager.createSound(
        {
          id: 'laser',
          url: '/sound/laser.wav'
        });
      },
      ontimeout: function()
      {
      // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
      }
    });
  },

  objectSetup : function()
  {
    //player
    game.player =
    {
      el: document.getElementById('player'), 

      x: 512,
      y: 768,
      charge: 0,
      maxCharge: 199,
      angle: 0
    }
    //mouse
    game.mouse =
    {
      state: 0,
      x: 0,
      y: 0
    },
    //ball

    //create ball
    game.ball =
    {
      el: document.getElementById('ball'),
      x: 512,
      y: 768,
      speed: 0,
      angle: 0,
      state: 0
    }
  },


  ///////////////////
  //  GAME EVENTS  //
  ///////////////////


  mouseMove : function(e)
  {
    game.mouse.x = e.offsetX;
    game.mouse.y = e.offsetY;

    game.player.angle = game.getAngle( game.player.x, game.player.y, game.mouse.x, game.mouse.y );
    game.rotateElement( game.player.el, game.player.angle );
  },


  mouseDown : function(e)
  {
    //charge sound
    game.chargeSound.frequency.value = 0;
    game.chargeSound.connect(game.ctx.destination);

    //start charging if not already
    if(game.mouse.state == 0)
    {
      game.ball.state = 0;
      game.mouse.state = setInterval(game.charge, 10);
      game.ball.el.style.display = "none";
    }
  },

  mouseUp : function(e)
  {
    //stop charging if charging
    if(game.mouse.state != 0)
    {
      clearInterval(game.mouse.state);
      soundManager.play('laser');
      game.ball.speed = game.player.charge + 10;
      game.ball.angle = game.player.angle;
      game.ball.el.style.display = "block";
      game.ball.state = 1;
    }
    game.mouse.state = 0;
  },


  ////////////////////////
  //  PLAYER FUNCTIONS  //
  ////////////////////////

  charge : function()
  {
    game.player.charge += 1;

    //reset ball
    game.ball.x = 512;
    game.ball.y = 768;

    //max charge
    if(game.player.charge > game.player.maxCharge)
    {
      clearInterval(game.mouse.state);
      soundManager.play('laser');
      game.mouse.state = 0;
      game.ball.speed = game.player.charge + 10;
      game.ball.angle = game.player.angle;
      game.ball.el.style.display = "block";
      game.ball.state = 1;
    }
  },

  updateSound : function()
  {
    //change player sound pitch
    game.chargeSound.frequency.value = ( game.player.charge * 5 );
    if( game.mouse.state == 0 )
    {
      if( game.player.charge > 0 )
      {
        game.player.charge -= 20;
      }

      if( game.player.charge < 0 )
      {
        game.player.charge = 0;
        game.chargeSound.disconnect(game.ctx.destination);
      }
    }
  },

  moveBall : function(object)
  {
    v = object.speed;

    pi = 3.1415;
    angle = (object.angle * ( pi / 180 ));

    vx = v * Math.cos(angle);
    vy = v * Math.sin(angle);

    object.x += ( vx / 10 );
    object.y += ( vy / 10 );


    //check the note hit
    if(object.y < 0)
    {
      if(game.ball.state == 1 && object.x < 149)
      {
        game.a.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 149 && object.x < 298)
      {
        game.b.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 298 && object.x < 447)
      {
        game.c.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 447 && object.x < 596)
      {
        game.d.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 596 && object.x < 745)
      {
        game.e.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 745 && object.x < 894)
      {
        game.f.connect(game.ctx.destination);
        game.ball.state = 0;
      }
      else if(game.ball.state == 1 && object.x >= 894 && object.x < 1042)
      {
        game.g.connect(game.ctx.destination);
        game.ball.state = 0;
      }
    }

    if(object.x < 0 && game.ball.state == 1)
    {
      game.a.frequency.value = (game.a.frequency.value * 2);
      game.b.frequency.value = (game.b.frequency.value * 2);
      game.c.frequency.value = (game.c.frequency.value * 2);
      game.d.frequency.value = (game.d.frequency.value * 2);
      game.e.frequency.value = (game.e.frequency.value * 2);
      game.f.frequency.value = (game.f.frequency.value * 2);
      game.g.frequency.value = (game.g.frequency.value * 2);
      game.ball.state = 0;
    }
    if(object.x > 1024 && game.ball.state == 1)
    {
      game.a.frequency.value = (game.a.frequency.value / 2);
      game.b.frequency.value = (game.b.frequency.value / 2);
      game.c.frequency.value = (game.c.frequency.value / 2);
      game.d.frequency.value = (game.d.frequency.value / 2);
      game.e.frequency.value = (game.e.frequency.value / 2);
      game.f.frequency.value = (game.f.frequency.value / 2);
      game.g.frequency.value = (game.g.frequency.value / 2);
      game.ball.state = 0;
    }

  },

  updatePosition : function(object)
  {
    object.style.left = game.ball.x + "px";
    object.style.top = game.ball.y + "px";
  },


  ////////////////////////
  //  GLOBAL FUNCTIONS  //
  ////////////////////////

  rotateElement : function(element,angle)
  {
    element.style.transform = "rotate(" + angle + "deg)";
  },

  getAngle : function(x1,y1,x2,y2)
  {
    var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return angle;
  }
}



