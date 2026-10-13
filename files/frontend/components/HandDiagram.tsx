const P: [number, number][] = [
  [150,330],[108,292],[78,250],[58,210],[42,172],[112,190],[104,140],[98,102],[94,68],
  [146,180],[148,122],[150,82],[151,46],[180,188],[194,140],[202,106],[208,76],
  [210,208],[232,172],[244,146],[254,122],
];
const CHAINS = [[0,1,2,3,4],[0,5,6,7,8],[9,10,11,12],[13,14,15,16],[0,17,18,19,20],[5,9,13,17]];

/** Static illustration of MediaPipe's 21 hand landmarks. Not live data. */
export default function HandDiagram() {
  return (
    <svg className="hand" viewBox="0 0 300 370" role="img" aria-label="Illustration of a hand with 21 tracked landmarks connected by a skeleton">
      <rect className="box" x="26" y="30" width="246" height="326" rx="14" />
      <text x="32" y="24">hand box</text>
      {CHAINS.map((c, i) => (
        <polyline key={i} className="bone" pathLength={1} points={c.map((k) => P[k].join(",")).join(" ")} />
      ))}
      {P.map(([x, y], i) => (
        <circle key={i} className="pt" cx={x} cy={y} r={i % 4 === 0 && i > 0 ? 6 : 4.5} style={{ animationDelay: `${0.4 + i * 0.07}s` }} />
      ))}
    </svg>
  );
}
