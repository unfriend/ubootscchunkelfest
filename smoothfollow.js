pc.script.attribute('distance', 'number', 10, {
    displayName: 'Distance'
});
pc.script.attribute('height', 'number', 5, {
    displayName: 'Height'
});
pc.script.attribute('heightDamping', 'number', 2, {
    displayName: 'Height Damping'
});
pc.script.attribute('rotationDamping', 'number', 3, {
    displayName: 'Rotation Damping'
});

pc.script.create('smoothfollow', function (context) {
    // Creates a new Smoothfollow instance
    var Smoothfollow = function (entity) {
        this.entity = entity;
        this.target = null;
        
        this.currentRotation = new pc.Quat();
        this.cameraOffset = new pc.Vec3();
        this.rotatedOffset = new pc.Vec3();
        this.targetVec = new pc.Vec2();
        this.cameraVec = new pc.Vec2();
    };

    Smoothfollow.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.target = context.root.findByName('Sub');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (!this.target)
                return;

            // Lerp towards the desired height
            var targetPos = this.target.getPosition();
            var cameraPos = this.entity.getPosition();

            var wantedHeight = targetPos.y + this.height;
            var currentHeight = cameraPos.y;

            currentHeight = pc.math.lerp(currentHeight, wantedHeight, this.heightDamping * dt);

            // Lerp towards the desired heading
            var targetWtm = this.target.getWorldTransform();
            var cameraWtm = this.entity.getWorldTransform();

            this.targetVec.set(targetWtm.data[8], targetWtm.data[10]).normalize();
            var targetAngle = Math.atan2(-this.targetVec.x, -this.targetVec.y) * pc.math.RAD_TO_DEG;

            this.cameraVec.set(cameraWtm.data[8], cameraWtm.data[10]).normalize();
            var currentAngle = Math.atan2(-this.cameraVec.x, -this.cameraVec.y) * pc.math.RAD_TO_DEG;

            currentAngle = pc.math.lerpAngle(currentAngle, targetAngle, this.rotationDamping * dt);

            // Calculate the updated position of the camera and look at the target
            this.cameraOffset.set(0, 0, -this.distance);
            this.currentRotation.setFromEulerAngles(0, currentAngle, 0);
            this.currentRotation.transformVector(this.cameraOffset, this.rotatedOffset);

            this.entity.setPosition(targetPos.x + this.rotatedOffset.x,
                                    currentHeight,
                                    targetPos.z + this.rotatedOffset.z);
            this.entity.lookAt(targetPos);
        }
    };

    return Smoothfollow;
});