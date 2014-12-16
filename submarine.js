pc.script.attribute('diveThrust', 'number', 200, {
    displayName: 'Dive Thrust'
});
pc.script.attribute('linearThrust', 'number', 500, {
    displayName: 'Linear Thrust'
});
pc.script.attribute('turnThrust', 'number', 100, {
    displayName: 'Turn Thrust'
});
pc.script.attribute('grappleDistance', 'number', 3, {
    displayName: 'Grapple Distance'
});

pc.script.create('submarine', function (context) {
    // Creates a new Submarine instance
    var Submarine = function (entity) {
        this.entity = entity;

        this.fuel = 100;
        this.refuelling = false;

        this.diveForce = new pc.Vec3();
        this.leftForce = new pc.Vec3();
        this.rightForce = new pc.Vec3();
        this.relPos = new pc.Vec3();
        
        this.initialPos = this.entity.getPosition().clone();
        this.initialRot = this.entity.getRotation().clone();
    };

    Submarine.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.leftEngine = this.entity.findByName('Left Engine');
            this.rightEngine = this.entity.findByName('Right Engine');
            this.grapple = this.entity.findByName('Grapple');
            this.pipes = context.root.findByName('Pipes');
            this.game = context.root.findByName('Pipe Wars');
            this.grappledPipe = null;

            var fuelUI = context.root.findByName('UI').findByName('Fuel');
            setInterval(function () {
                if (this.fuel > 0 && !this.refuelling) {
                    this.fuel -= 1;
                    fuelUI.script.font_renderer.text = 'Fuel: ' + this.fuel + '%';
                }
            }.bind(this), 1000);
            
            setInterval(function () {
                if (this.fuel < 100 && this.refuelling) {
                    this.fuel += 1;
                    fuelUI.script.font_renderer.text = 'Fuel: ' + this.fuel + '%';
                }
            }.bind(this), 50);
        },
        
        reset: function () {
            this.fuel = 100;
            this.refuelling = false;
            
            this.grappleDisable();
            
            this.entity.setPosition(this.initialPos);
            this.entity.setRotation(this.initialRot);
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.syncEntityToBody();
        },
        
        grappleDisable: function () {
            if (this.grappledPipe) {
                if (this.grappledPipe.ballsocketjoint) {
                    context.systems.ballsocketjoint.removeComponent(this.grappledPipe);
                }
                this.grappledPipe = null;
            }
        },

        getClosestPipe: function () {
            var closestPipe = null;
            var closestDist = this.grappleDistance;
            var grappleToPipe = new pc.Vec3();
            var pipes = this.pipes.getChildren();
            for (var i = 0; i < pipes.length; i++) {
                var pipe = pipes[i];
                var dist = grappleToPipe.sub2(pipe.getPosition(), this.grapple.getPosition()).length();
                if (dist < this.grappleDistance && dist < closestDist) {
                    closestPipe = pipe;
                }
            }
            return closestPipe;
        },

        grappleEnable: function () {
            if (this.grappledPipe === null) {
                var pipe = this.getClosestPipe();
                if (pipe) {
                    context.systems.ballsocketjoint.addComponent(pipe, {
                        pivot: new pc.Vec3(0.5, 0, 0)
                    });
                    this.grappledPipe = pipe;
                }
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.game.script.game.state !== 'game') return;
            
            var leftEngine = 0;
            var rightEngine = 0;
            var dive = 0;

            if (context.keyboard.isPressed(pc.input.KEY_A)) {
                dive += this.diveThrust;
            }
            if (context.keyboard.isPressed(pc.input.KEY_Z)) {
                dive -= this.diveThrust;
            }

            if (context.keyboard.isPressed(pc.input.KEY_UP)) {
                leftEngine += this.linearThrust;
                rightEngine += this.linearThrust;
            }
            if (context.keyboard.isPressed(pc.input.KEY_DOWN)) {
                leftEngine -= this.linearThrust;              
                rightEngine -= this.linearThrust;
            }
            if (context.keyboard.isPressed(pc.input.KEY_LEFT)) {
                rightEngine += this.turnThrust;
            }
            if (context.keyboard.isPressed(pc.input.KEY_RIGHT)) {
                leftEngine += this.turnThrust;
            }

            if (dive !== 0) {
                this.diveForce.copy(this.entity.up).scale(dive);
                this.entity.rigidbody.applyForce(this.diveForce);
            }

            if (leftEngine < 0) {
                this.leftEngine.script.propeller.speed = -20;
            } else if (leftEngine === 0) {
                this.leftEngine.script.propeller.speed = 0;
            } else if (leftEngine > 0) {
                this.leftEngine.script.propeller.speed = 20;
            }

            if (rightEngine < 0) {
                this.rightEngine.script.propeller.speed = -20;
            } else if (rightEngine === 0) {
                this.rightEngine.script.propeller.speed = 0;
            } else if (rightEngine > 0) {
                this.rightEngine.script.propeller.speed = 20;
            }

            if (leftEngine !== 0) {
                this.leftForce.copy(this.entity.forward).scale(leftEngine);
                this.relPos.sub2(this.leftEngine.getPosition(), this.entity.getPosition());
                this.entity.rigidbody.applyForce(this.leftForce, this.relPos);
            }
            if (rightEngine !== 0) {
                this.rightForce.copy(this.entity.forward).scale(rightEngine);
                this.relPos.sub2(this.rightEngine.getPosition(), this.entity.getPosition());
                this.entity.rigidbody.applyForce(this.rightForce, this.relPos);
            }

            if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                if (this.grappledPipe) {
                    this.grappleDisable();
                } else {
                    this.grappleEnable();
                }
            }
            if (this.grappledPipe && this.grappledPipe.ballsocketjoint) {
                this.grappledPipe.rigidbody.activate();
                this.grappledPipe.ballsocketjoint.position = this.grapple.getPosition();
            }
        }
    };

    return Submarine;
});