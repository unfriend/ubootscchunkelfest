pc.script.attribute('gravity', 'number', -100, {
    displayName: 'Gravity'
});

pc.script.create('gravity', function (context) {
    // Creates a new Gravity instance
    var Gravity = function (entity) {
        this.entity = entity;
    };

    Gravity.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.rigidbody.applyForce(0, this.gravity, 100);
        }
    };

    return Gravity;
});