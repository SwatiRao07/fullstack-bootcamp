export {};

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function isCircle(s: Shape): s is { kind: "circle"; radius: number } {
  return s.kind === "circle";
}

function areaWithGuard(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2;
  }

  if ("size" in shape) {
    return shape.size ** 2;
  }

  if ("width" in shape && "height" in shape) {
    return shape.width * shape.height;
  }

  return 0;
}
