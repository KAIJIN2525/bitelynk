const FloatingParticle = ({ count = 40 }) => {
  const particle = Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particle.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40 "
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animation: `float ${p.duration}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticle;
