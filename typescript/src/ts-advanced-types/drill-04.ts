type Shapes =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area1(shape: Shape) {
//   return shape.radius; 
}

function isCircle(s: Shape): s is { kind: "circle"; radius: number } {
  return s.kind === "circle";
}

