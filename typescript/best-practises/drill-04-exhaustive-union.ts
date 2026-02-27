type Circle   = { kind: "circle";   radius: number };
type Square   = { kind: "square";   side: number };
type Triangle = { kind: "triangle"; base: number; height: number };
type Polygon  = { kind: "polygon";  sides: number; sideLength: number }; // ← new variant

type Shape = Circle | Square | Triangle | Polygon;

// never helper – if we forget to handle a variant, TypeScript errors here
function assertNever(x: never): never {
  throw new Error("Unhandled variant: " + JSON.stringify(x));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return 0.5 * shape.base * shape.height;
    case "polygon":  return (shape.sides * shape.sideLength ** 2) / (4 * Math.tan(Math.PI / shape.sides));
    default:         return assertNever(shape);
   
    // Without the "polygon" case above, TypeScript would error:
    // "Argument of type 'Polygon' is not assignable to parameter of type 'never'"
  }
}

const shapes: Shape[] = [
  { kind: "circle",   radius: 5 },
  { kind: "square",   side: 4 },
  { kind: "triangle", base: 6, height: 3 },
  { kind: "polygon",  sides: 5, sideLength: 4 },
];

for (const s of shapes) {
  console.log(s.kind, "→ area:", area(s).toFixed(2));
}
