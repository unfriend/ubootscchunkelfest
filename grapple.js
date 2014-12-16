pc.script.create('grapple', function (context) {
    // Creates a new Grapple instance
    var Grapple = function (entity) {
        this.entity = entity;
    };

    Grapple.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            setInterval(function() {
//                this.entity.light.enabled = !this.entity.light.enabled;
            }.bind(this), 3000);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Grapple;
});