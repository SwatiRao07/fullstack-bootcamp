type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

  function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;

    case "square":
      return shape.size * shape.size;

    case "rectangle":
      return shape.width * shape.height;

    default:
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}

