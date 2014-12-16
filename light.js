pc.script.attribute('shadowBias', 'number', -0.0005, {
    displayName: 'Shadow Bias',
    decimalPrecision: 5
});

pc.script.create('light', function (context) {
    // Creates a new Light instance
    var Light = function (entity) {
        this.entity = entity;
    };

    Light.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.light.model.lights[0].setShadowBias(this.shadowBias);
        }
    };

    return Light;
});