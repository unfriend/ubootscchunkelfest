pc.script.create('deliveryzonetrigger', function (context) {
    // Creates a new Deliveryzonetrigger instance
    var Deliveryzonetrigger = function (entity) {
        this.entity = entity;
    };

    Deliveryzonetrigger.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
            this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
        },

        onTriggerEnter: function (entity) {
            if (entity.getName().indexOf('Pipe') !== -1) {
                context.root.findByName('Pipe Wars').script.game.updatePipesDelivered(1);
            }
        },

        onTriggerLeave: function (entity) {
            if (entity.getName().indexOf('Pipe') !== -1) {
                context.root.findByName('Pipe Wars').script.game.updatePipesDelivered(-1);
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Deliveryzonetrigger;
});