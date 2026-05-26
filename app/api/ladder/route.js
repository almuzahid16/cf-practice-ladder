export const dynamic = 'force-dynamic';

const CODEFORCES_API = 'https://codeforces.com/api/user.status';
const API_DELAY_MS = 2100;
const DEFAULT_SUBMISSION_COUNT = 10000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanHandle(value) {
  return String(value || '').trim();
}

function validateHandle(handle) {
  // Codeforces handles are usually 3-24 chars and may contain letters, digits, dot, hyphen and underscore.
  return /^[A-Za-z0-9_.-]{3,24}$/.test(handle);
}

function getProblemKey(problem) {
  if (problem?.contestId && problem?.index) return `${problem.contestId}-${problem.index}`;
  if (problem?.problemsetName && problem?.index) return `${problem.problemsetName}-${problem.index}`;
  return String(problem?.name || '').toLowerCase();
}

function getProblemUrl(problem) {
  if (problem?.contestId && problem?.index) {
    return `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
  }
  return 'https://codeforces.com/problemset';
}

function getSubmissionUrl(submission) {
  const contestId = submission?.problem?.contestId;
  if (contestId && submission?.id) {
    return `https://codeforces.com/contest/${contestId}/submission/${submission.id}`;
  }
  return 'https://codeforces.com/submissions';
}

async function fetchSubmissions(handle, count) {
  const params = new URLSearchParams({
    handle,
    from: '1',
    count: String(count)
  });

  const response = await fetch(`${CODEFORCES_API}?${params.toString()}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'cf-practice-ladder/1.0'
    }
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Codeforces did not return valid JSON. Please try again.');
  }

  if (!response.ok || data.status !== 'OK') {
    throw new Error(data.comment || `Could not fetch submissions for ${handle}.`);
  }

  return Array.isArray(data.result) ? data.result : [];
}

function buildSolvedSet(submissions) {
  const solved = new Set();

  for (const submission of submissions) {
    if (submission?.verdict !== 'OK') continue;
    const key = getProblemKey(submission.problem);
    if (key) solved.add(key);
  }

  return solved;
}

function buildLadder(expertSubmissions, userSolved) {
  const seen = new Set();
  const problems = [];

  for (const submission of expertSubmissions) {
    if (submission?.verdict !== 'OK') continue;
    const problem = submission.problem;
    if (!problem?.rating) continue;

    const key = getProblemKey(problem);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    problems.push({
      key,
      contestId: problem.contestId ?? null,
      index: problem.index ?? '',
      name: problem.name ?? 'Untitled problem',
      rating: problem.rating,
      tags: Array.isArray(problem.tags) ? problem.tags : [],
      solved: userSolved.has(key),
      problemUrl: getProblemUrl(problem),
      submissionUrl: getSubmissionUrl(submission)
    });
  }

  return problems.sort((a, b) => {
    if (a.rating !== b.rating) return a.rating - b.rating;
    return a.name.localeCompare(b.name);
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userHandle = cleanHandle(body.userHandle);
    const expertHandle = cleanHandle(body.expertHandle);
    const count = Number(body.count || DEFAULT_SUBMISSION_COUNT);
    const safeCount = Number.isFinite(count) ? Math.min(Math.max(count, 100), 20000) : DEFAULT_SUBMISSION_COUNT;

    if (!validateHandle(userHandle) || !validateHandle(expertHandle)) {
      return Response.json(
        { error: 'Please enter valid Codeforces handles. Example: tourist, Benq, jiangly.' },
        { status: 400 }
      );
    }

    const userSubmissions = await fetchSubmissions(userHandle, safeCount);

    // Codeforces public API allows about one request per two seconds.
    await sleep(API_DELAY_MS);

    const expertSubmissions = await fetchSubmissions(expertHandle, safeCount);
    const userSolved = buildSolvedSet(userSubmissions);
    const problems = buildLadder(expertSubmissions, userSolved);

    const solvedCount = problems.filter((problem) => problem.solved).length;
    const unsolvedCount = problems.length - solvedCount;
    const uniqueTags = [...new Set(problems.flatMap((problem) => problem.tags))].sort();
    const ratings = [...new Set(problems.map((problem) => problem.rating))].sort((a, b) => a - b);

    return Response.json({
      userHandle,
      expertHandle,
      count: safeCount,
      totalProblems: problems.length,
      solvedCount,
      unsolvedCount,
      uniqueTags,
      ratings,
      problems
    });
  } catch (error) {
    return Response.json(
      { error: error?.message || 'Something went wrong while building the ladder.' },
      { status: 500 }
    );
  }
}
