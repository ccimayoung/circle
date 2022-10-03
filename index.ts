let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d");

var window_height = 500;
var window_width = 1000;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#FDD8E2";
let randomNumber = function (min: number, max: number): number {
  var result = Math.random() * (max - min) + min;
  return result;
};
let oldTime = Date.now();
let fps: number;
let renderCount = 0;
class Circle {
  position_x: number;
  position_y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;
  color: string;
  constructor(
    xpos: number,
    ypos: number,
    radius: number,
    speed: number,
    angle: number,
    color: string
  ) {
    this.position_x = xpos;
    this.position_y = ypos;

    this.radius = radius;

    this.speed = speed;

    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;

    this.color = color;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.position_x, this.position_y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = this.color;
    context.closePath();
  }

  update() {
    context && this.draw(context);

    if (this.position_x + this.radius > window_width) {
      this.position_x = window_width - this.radius;
      this.dx = -this.dx;
    }

    if (this.position_x - this.radius < 0) {
      this.position_x = this.radius;

      this.dx = -this.dx;
    }

    if (this.position_y - this.radius < 0) {
      this.position_y = this.radius;
      this.dy = -this.dy;
    }

    if (this.position_y + this.radius > window_height) {
      this.position_y = window_height - this.radius;
      this.dy = -this.dy;
    }

    this.position_x += this.dx / fps;
    this.position_y += this.dy / fps;
  }

  calculateDistance(other: Circle) {
    const xDistance = Math.abs(this.position_x - other.position_x);
    const yDistance = Math.abs(this.position_y - other.position_y);
    const currentDistance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
    return { cur: currentDistance };
  }

  calculateAngle(other: Circle) {
    const xDistance = Math.abs(this.position_x - other.position_x);
    const yDistance = Math.abs(this.position_y - other.position_y);
    const check =
      (this.position_x - other.position_x) *
        (this.position_y - other.position_y) <
      0
        ? false
        : true;
    const angle = Math.atan(yDistance / xDistance);
    const thisVn = check
      ? this.dx * Math.cos(angle) + this.dy * Math.sin(angle)
      : this.dx * Math.cos(angle) - this.dy * Math.sin(angle);
    const thisVt = check
      ? -this.dx * Math.sin(angle) + this.dy * Math.cos(angle)
      : this.dx * Math.sin(angle) + this.dy * Math.cos(angle);
    const otherVn = check
      ? other.dx * Math.cos(angle) + other.dy * Math.sin(angle)
      : other.dx * Math.cos(angle) - other.dy * Math.sin(angle);
    const otherVt = check
      ? -other.dx * Math.sin(angle) + other.dy * Math.cos(angle)
      : other.dx * Math.sin(angle) + other.dy * Math.cos(angle);
    const newThisVn = otherVn;
    const newOtherVn = thisVn;
    const nx = check
      ? newThisVn * Math.cos(angle) - thisVt * Math.sin(angle)
      : newThisVn * Math.cos(angle) + thisVt * Math.sin(angle);
    const ny = check
      ? newThisVn * Math.sin(angle) + thisVt * Math.cos(angle)
      : -newThisVn * Math.sin(angle) + thisVt * Math.cos(angle);
    const nOtherX = check
      ? newOtherVn * Math.cos(angle) - otherVt * Math.sin(angle)
      : newOtherVn * Math.cos(angle) + otherVt * Math.sin(angle);
    const nOtherY = check
      ? -newOtherVn * Math.sin(angle) + otherVt * Math.cos(angle)
      : -newOtherVn * Math.sin(angle) + otherVt * Math.cos(angle);

    return { nx, ny, nOtherX, nOtherY };
  }

  checkAngleRange(ang: number) {
    if (ang >= 360) {
      ang -= 360;
    } else if (ang < 0) {
      ang += 360;
    }
    return ang;
  }

  calcualateDistance(aa: Circle, ab: Circle) {
    const distancX = Math.pow(aa.position_x - ab.position_x, 2);
    const distancY = Math.pow(aa.position_y - ab.position_y, 2);

    const After = {
      MoveBetween: Math.sqrt(distancX + distancY),
      Between: ab.radius + this.radius,
    };

    return { After };
  }

  bounceBall(other: Circle) {
    const { cur } = this.calculateDistance(other);
    const { nx, ny, nOtherX, nOtherY } = this.calculateAngle(other);
    if (cur <= this.radius + other.radius) {
      this.dx = nx;
      this.dy = ny;
      other.dx = nOtherX;
      other.dy = nOtherY;
    }
  }
}
let getDistance = function (
  xpos1: number,
  ypos1: number,
  xpos2: number,
  ypos2: number
) {
  var result = Math.sqrt(
    Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2)
  );
  return result;
};

var all_circles: Circle[] = [];
let random_number = Math.floor(randomNumber(10, 20));

for (var i = 0; i < random_number; i++) {
  var radius = randomNumber(10, 20);
  var random_x = randomNumber(radius, window_width - radius);
  var random_y = randomNumber(radius, window_height - radius);
  var random_speed = randomNumber(200, 400);
  var random_angle = randomNumber(0, 2 * Math.PI);

  for (var a = 0; a < all_circles.length; a++) {
    if (
      getDistance(
        random_x,
        random_y,
        all_circles[a].position_x,
        all_circles[a].position_y
      ) -
        (radius + all_circles[a].radius) <
      4
    ) {
      random_x = randomNumber(radius, window_width - radius);
      random_y = randomNumber(radius, window_height - radius);
    }
  }

  let my_circle = new Circle(
    random_x,
    random_y,
    radius,
    random_speed,
    random_angle,
    `rgb(
      ${Math.floor(Math.random() * 255)}, 
      ${Math.floor(Math.random() * 255)},
      ${Math.floor(Math.random() * 255)}
      )`
  );
  all_circles.push(my_circle);
}

let updateCircle = () => {
  requestAnimationFrame(updateCircle);
  const newTime = Date.now();
  const deltaTime = newTime - oldTime;
  renderCount++;
  fps = (renderCount * 1000) / deltaTime;

  context?.clearRect(0, 0, window_width, window_height);
  all_circles.forEach((element, idx) => {
    all_circles.forEach((element2) => {
      if (all_circles.indexOf(element2) !== idx) {
        element.bounceBall(element2);
      }
    });
    element.update();
  });
};

updateCircle();
