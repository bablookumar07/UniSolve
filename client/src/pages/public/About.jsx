const About = () => {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          About UniSolve
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          A better way to manage campus issues
        </h1>
      </div>

      <div className="mt-12 space-y-6 text-lg leading-8 text-slate-600">
        <p>
          UniSolve is designed around a simple idea: campus complaints should
          be easy to report, transparent to track and structured to resolve.
        </p>

        <p>
          The platform connects students, maintenance teams and administrators
          through a shared complaint workflow.
        </p>

        <p>
          Instead of relying on disconnected messages or verbal requests,
          UniSolve provides a centralized system where every complaint can
          move from submission to resolution with a clear history.
        </p>
      </div>
    </section>
  );
};

export default About;