pc.script.create('reset', function (context) {
    // Creates a new Reset instance
    var Reset = function (entity) {
        this.entity = entity;
    };

    Reset.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.initialPos = this.entity.getPosition().clone();
            this.initialRot = this.entity.getRotation().clone();
        },
        
        reset: function () {
            this.entity.setPosition(this.initialPos);
            this.entity.setRotation(this.initialRot);
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.syncEntityToBody();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Reset;
});