const Ship = {
  flyingEngaged = false,
  booster = false,
  boosterAcceleration = 0.05,

  defaultSpd = 1,
  currentAltitude = 0,

  maxSpd = 80,
  maxSpdNoBooster = 80,
  maxSpdBooster = 150,

// old acceleration with multiply was 1.03
  acceleration = 0.5,
  currentSpd = this.defaultSpd,
  isAccelerating = false,

  defaultRollSpeed = 0.8,
  maxRollSpeed = 4,
  rollAcceleration = 1.02,
  currentRollSpeed = this.defaultRollSpeed,
  isRolling = false,
  engineSound = false,
  brake = false,
  slowingFactor = 0.07,

  defaultDiminish = 1.001,
  currentDiminish = 1,

}