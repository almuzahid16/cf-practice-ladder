'use client';

import { useEffect, useMemo, useState } from 'react';

const DEFAULT_FORM = {
  userHandle: '',
  expertHandle: '',
  count: 10000
};

function numberFormat(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

export default function HomePage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [ladder, setLadder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [rating, setRating] = useState('all');
  const [tag, setTag] = useState('all');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cf-practice-ladder-form') || '{}');
      setForm((current) => ({ ...current, ...saved }));
    } catch {
      // Ignore invalid local storage data.
    }
  }, []);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function clearSavedHandles() {
    localStorage.removeItem('cf-practice-ladder-form');
    setForm(DEFAULT_FORM);
    setLadder(null);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setLadder(null);
    setSearch('');
    setStatus('all');
    setRating('all');
    setTag('all');

    try {
      localStorage.setItem('cf-practice-ladder-form', JSON.stringify(form));
      const response = await fetch('/api/ladder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not build ladder.');
      setLadder(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const filteredProblems = useMemo(() => {
    const problems = ladder?.problems || [];
    const needle = search.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch =
        !needle ||
        problem.name.toLowerCase().includes(needle) ||
        problem.index.toLowerCase().includes(needle) ||
        problem.tags.some((problemTag) => problemTag.toLowerCase().includes(needle));

      const matchesStatus =
        status === 'all' || (status === 'solved' ? problem.solved : !problem.solved);

      const matchesRating = rating === 'all' || String(problem.rating) === String(rating);
      const matchesTag = tag === 'all' || problem.tags.includes(tag);

      return matchesSearch && matchesStatus && matchesRating && matchesTag;
    });
  }, [ladder, search, status, rating, tag]);

  const completionPercent = ladder?.totalProblems
    ? Math.round((ladder.solvedCount / ladder.totalProblems) * 100)
    : 0;

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-card">
          <span className="badge">Codeforces mentor ladder builder</span>
          <h1>Build your next CF practice list.</h1>
          <p className="lead">
            Enter your Codeforces handle and an expert handle. The app finds rated problems solved by the expert,
            then marks which ones you have already solved and which ones should be your next practice targets.
          </p>
        </div>

        <form className="form-panel hero-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Your Codeforces handle
              <input
                value={form.userHandle}
                onChange={(event) => updateForm('userHandle', event.target.value)}
                placeholder="example: your_handle"
                autoComplete="off"
                required
              />
            </label>

            <label>
              Expert Codeforces handle
              <input
                value={form.expertHandle}
                onChange={(event) => updateForm('expertHandle', event.target.value)}
                placeholder="example: tourist"
                autoComplete="off"
                required
              />
            </label>

            <label>
              Submission scan limit
              <select value={form.count} onChange={(event) => updateForm('count', Number(event.target.value))}>
                <option value={1000}>1,000 submissions, faster</option>
                <option value={5000}>5,000 submissions</option>
                <option value={10000}>10,000 submissions, recommended</option>
                <option value={20000}>20,000 submissions, slower</option>
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="primary" type="submit" disabled={loading}>
              {loading ? 'Building ladder...' : 'Generate Ladder'}
            </button>
            <a className="button-link secondary" href="https://codeforces.com/problemset" target="_blank" rel="noreferrer">
              Open Problemset
            </a>
            <button className="secondary ghost-button" type="button" onClick={clearSavedHandles}>
              Clear saved
            </button>
          </div>

          <p className="helper">
            Note: Codeforces API has a public rate limit, so the first result may take a few seconds.
          </p>

          {error ? <div className="alert">{error}</div> : null}
        </form>
      </section>

      {ladder ? (
        <>
          <section className="stats">
            <div className="stat-card">
              <span>Total expert problems</span>
              <strong>{numberFormat(ladder.totalProblems)}</strong>
            </div>
            <div className="stat-card">
              <span>Your solved</span>
              <strong>{numberFormat(ladder.solvedCount)}</strong>
            </div>
            <div className="stat-card">
              <span>Your unsolved</span>
              <strong>{numberFormat(ladder.unsolvedCount)}</strong>
            </div>
            <div className="stat-card">
              <span>Completion</span>
              <strong>{completionPercent}%</strong>
            </div>
          </section>

          <section className="panel filters">
            <label>
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, tag or index"
              />
            </label>

            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">All</option>
                <option value="unsolved">Unsolved</option>
                <option value="solved">Solved</option>
              </select>
            </label>

            <label>
              Rating
              <select value={rating} onChange={(event) => setRating(event.target.value)}>
                <option value="all">All</option>
                {(ladder.ratings || []).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tag
              <select value={tag} onChange={(event) => setTag(event.target.value)}>
                <option value="all">All</option>
                {(ladder.uniqueTags || []).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Visible
              <input value={`${numberFormat(filteredProblems.length)} problems`} readOnly />
            </label>
          </section>

          <section className="table-wrap">
            <div className="table-head">
              <div>
                <h2>
                  {ladder.userHandle} vs {ladder.expertHandle}
                </h2>
                <p>Sorted from easier to harder by Codeforces rating.</p>
              </div>
            </div>

            {filteredProblems.length ? (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Expert code</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem, index) => (
                    <tr key={problem.key}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Problem">
                        <div className="problem-title">
                          <a href={problem.problemUrl} target="_blank" rel="noreferrer">
                            {problem.contestId ? `${problem.contestId}${problem.index}. ` : ''}
                            {problem.name}
                          </a>
                          <div className="tags">
                            {problem.tags.slice(0, 5).map((item) => (
                              <span className="tag" key={item}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td data-label="Rating">
                        <span className="rating-pill">{problem.rating}</span>
                      </td>
                      <td data-label="Status">
                        <span className={problem.solved ? 'status solved' : 'status unsolved'}>
                          {problem.solved ? 'Solved' : 'Unsolved'}
                        </span>
                      </td>
                      <td data-label="Expert code">
                        <a className="submission-link" href={problem.submissionUrl} target="_blank" rel="noreferrer">
                          View submission
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No problems match your filters.</h3>
                <p>Try changing status, rating, tag or search text.</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="empty-state">
          <h3>Ready when you are.</h3>
          <p>Try your handle with an expert handle like tourist, jiangly, Benq, Errichto or SecondThread.</p>
        </section>
      )}

      <footer className="creator-footer">
        <p>
          Built by <strong>Muhammad Al-Muzahid</strong> · Codeforces Practice Ladder
        </p>

        <p className="creator-subtitle">
          A clean educational tool using public Codeforces API data. It does not submit anything for users.
        </p>

        <div className="creator-links">
          <a
            href="https://github.com/almuzahid16"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/almuzahid/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>

          <a
            href="https://www.facebook.com/muhammadalmuzahid/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook profile"
          >
            Facebook
          </a>
        </div>
      </footer>
    </main>
  );
}
