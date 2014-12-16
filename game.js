pc.script.attribute('numPipes', 'number', 10, {
    displayName: 'Num Pipes'
});

pc.script.create('game', function (context) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        this.state = 'intro';
        this.pipesDelivered = 0;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.setState('intro');
            
            context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        },
        
        newGame: function () {
            this.timer = 0;
            
            context.root.findByName('Sub').script.submarine.reset();
            
            for (var i = 1; i <= 10; i++) {
                context.root.findByName('Pipe' + i).script.reset.reset();
            }

            this.pipesDelivered = 0;
        },
        
        updatePipesDelivered: function (delta) {
            this.pipesDelivered += delta;
            // On a restart, you can get a negative number so let's hack...
            if (this.pipesDelivered < 0)
                this.pipesDelivered = 0;
            var pipesUi = this.entity.findByName('UI').findByName('Game').findByName('Pipes');
            pipesUi.script.font_renderer.text = 'Pipes: ' + this.pipesDelivered + '/10';
            
            if (this.pipesDelivered >= 10) {
                this.setState('congratulations');
            }
        },
        
        onMouseDown: function (event) {
            if (event.button === pc.input.MOUSEBUTTON_LEFT) {
                if (this.state === 'intro') {
                    this.setState('instructions');
                } else if (this.state === 'instructions') {
                    this.setState('game');
                } else if ((this.state === 'gameover') || (this.state === 'congratulations')) {
                    this.setState('intro');
                }
            }
        },

        setState: function (state) {
            var ui;
            this.state = state;
            
            switch (state) {
                case 'intro':
                    this.entity.findByName('Game Camera').enabled = false;
                    this.entity.findByName('Intro Camera').enabled = true;
                    
                    ui = this.entity.findByName('UI');
                    ui.findByName('Intro').enabled = true;
                    ui.findByName('Instructions').enabled = false;
                    ui.findByName('Game').enabled = false;
                    ui.findByName('Game Over').enabled = false;
                    ui.findByName('Congratulations').enabled = false;
                    
                    context.root.findByName('Sub').script.submarine.reset();
                    break;
                case 'instructions':                    
                    ui = this.entity.findByName('UI');
                    ui.findByName('Intro').enabled = false;
                    ui.findByName('Instructions').enabled = true;
                    ui.findByName('Game').enabled = false;
                    break;
                case 'game':
                    this.entity.findByName('Intro Camera').enabled = false;
                    this.entity.findByName('Game Camera').enabled = true;
                    
                    ui = this.entity.findByName('UI');
                    ui.findByName('Intro').enabled = false;
                    ui.findByName('Instructions').enabled = false;
                    ui.findByName('Game').enabled = true;

                    this.newGame();
                    break;
                case 'gameover':
                    ui = this.entity.findByName('UI');
                    ui.findByName('Game').enabled = false;
                    ui.findByName('Game Over').enabled = true;
                    break;
                case 'congratulations':
                    ui = this.entity.findByName('UI');
                    ui.findByName('Game').enabled = false;
                    ui.findByName('Congratulations').enabled = true;
                    break;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            switch (this.state) {
                case 'intro':
                    if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                        this.setState('instructions');
                    }
                    break;
                case 'instructions':
                    if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                        this.setState('game');
                    }
                    if (context.keyboard.wasPressed(pc.input.KEY_ESCAPE)) {
                        this.setState('intro');
                    }
                    break;
                case 'game':
                    this.timer += dt;
                    var totalSec = Math.floor(this.timer);
                    var hours = '' + parseInt( totalSec / 3600 ) % 24;
                    if (hours.length === 1) {
                        hours = '0' + hours;
                    }
                    var minutes = '' + parseInt( totalSec / 60 ) % 60;
                    if (minutes.length === 1) {
                        minutes = '0' + minutes;
                    }
                    var seconds = '' + totalSec % 60;
                    if (seconds.length === 1) {
                        seconds = '0' + seconds;
                    }
                    var timerUi = this.entity.findByName('UI').findByName('Game').findByName('Timer');
                    timerUi.script.font_renderer.text = 'Time: ' + hours + ':' + minutes + ':' + seconds;
                    
                    if (context.root.findByName('Sub').script.submarine.fuel <= 0) {
                        this.setState('gameover');
                    }
                    
                    break;
                case 'gameover':
                case 'congratulations':
                    if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                        this.setState('intro');
                    }
                    break;
            }
        }
    };

    return Game;
});