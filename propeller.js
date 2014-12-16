pc.script.create('propeller', function (context) {
    // Creates a new Propeller instance
    var Propeller = function (entity) {
        this.entity = entity;
        
        this.speed = 0;
    };

    Propeller.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.speed !== 0) {
                this.entity.rotateLocal(0, 0, this.speed);
            }
        }
    };

    return Propeller;
});