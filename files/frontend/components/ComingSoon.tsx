export default function ComingSoon({ title, phase, children }: { title: string; phase: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      <p><span className="soon">Coming soon · {phase}</span></p>
      <div className="card"><p style={{ margin: 0, maxWidth: "62ch" }}>{children}</p></div>
    </div>
  );
}
