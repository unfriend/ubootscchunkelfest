pc.script.create('fueltrigger', function (context) {
    // Creates a new FuelTrigger instance
    var FuelTrigger = function (entity) {
        this.entity = entity;
    };

    FuelTrigger.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
            this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
        },

        onTriggerEnter: function (entity) {
            if (entity.getName() === 'Sub') {
                entity.script.submarine.refuelling = true;
            }
        },

        onTriggerLeave: function (entity) {
            if (entity.getName() === 'Sub') {
                entity.script.submarine.refuelling = false;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return FuelTrigger;
});