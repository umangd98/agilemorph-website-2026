export function polarToXY(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function pathToHub(
  x: number,
  y: number,
  cx: number,
  cy: number,
  nodeInset = 32,
  hubInset = 28,
): string {
  const dx = cx - x;
  const dy = cy - y;
  const len = Math.hypot(dx, dy) || 1;
  const start = { x: x + (dx / len) * nodeInset, y: y + (dy / len) * nodeInset };
  const end = { x: cx - (dx / len) * hubInset, y: cy - (dy / len) * hubInset };
  const mx = (start.x + end.x) / 2 + (dy / len) * 6;
  const my = (start.y + end.y) / 2 - (dx / len) * 6;
  return `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`;
}
