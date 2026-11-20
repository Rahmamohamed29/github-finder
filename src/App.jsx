import { useState, useEffect } from "react";

const QUICK_PICKS = [
  "Rahmamohamed29",
  "torvalds",
  "gaearon",
  "sindresorhus",
];

function GitHubLogo({ isLight }) {
  return (
    <span
      className={`text-xl ${isLight ? "text-violet-700" : "text-violet-300"}`}
      aria-hidden="true"
    >
      💻
    </span>
  );
}

function SearchIcon() {
  return <span aria-hidden="true">🔍</span>;
}

function SunIcon() {
  return <span aria-hidden="true">☀️</span>;
}

function MoonIcon() {
  return <span aria-hidden="true">🌙</span>;
}

function RepoList({ repos, isLight }) {
  const [selectedLang, setSelectedLang] = useState("All");

  const languages = [
    "All",
    ...new Set(repos.map((repo) => repo.language).filter(Boolean)),
  ];

  const activeLang = languages.includes(selectedLang) ? selectedLang : "All";

  const filteredRepos =
    activeLang === "All"
      ? repos
      : repos.filter((repo) => repo.language === activeLang);

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h3 className="text-base font-bold">
          Repositories ({filteredRepos.length})
        </h3>

        {languages.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {languages.map((lang) => {
              const isActive = activeLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-violet-500 text-white"
                      : isLight
                      ? "bg-violet-50 border border-violet-200 text-violet-800 hover:bg-violet-100"
                      : "bg-slate-800/80 border border-violet-500/25 text-violet-200 hover:border-violet-400/50 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filteredRepos.length === 0 ? (
        <p
          className={
            isLight ? "text-slate-600 text-sm" : "text-slate-400 text-sm"
          }
        >
          No public repositories found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className={`block rounded-xl border p-4 transition ${
                isLight
                  ? "bg-violet-50/40 border-violet-200/80 hover:border-violet-400 text-slate-900"
                  : "bg-slate-950/70 border-violet-500/20 hover:border-violet-400/50 text-slate-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`font-bold text-sm truncate ${
                    isLight ? "text-violet-700" : "text-violet-300"
                  }`}
                >
                  {repo.name}
                </h4>
                <span className="text-xs shrink-0">
                  ⭐ {repo.stargazers_count}
                </span>
              </div>

              <p
                className={`mt-2 text-xs line-clamp-2 ${
                  isLight ? "text-slate-600" : "text-slate-300"
                }`}
              >
                {repo.description || "No description"}
              </p>

              <div
                className={`mt-3 flex items-center justify-between text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <span>{repo.language || "—"}</span>
                <span>Forks: {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user, repos, isLight }) {
  return (
    <div
      className={`mt-5 rounded-2xl border p-6 transition-colors ${
        isLight
          ? "bg-white border-violet-200 text-slate-900"
          : "bg-slate-900/90 border-violet-500/25 text-slate-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={user.avatar_url}
          alt={user.name || user.login}
          className="h-20 w-20 rounded-full border-2 border-violet-400/70 object-cover shrink-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">{user.name || user.login}</h2>
              <p
                className={`text-sm font-mono ${
                  isLight ? "text-violet-600" : "text-violet-300"
                }`}
              >
                @{user.login}
              </p>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isLight
                  ? "bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100"
                  : "bg-violet-500/15 border-violet-400/40 text-violet-200 hover:bg-violet-500/25"
              }`}
            >
              Open on GitHub ↗
            </a>
          </div>

          <p
            className={`mt-3 text-sm ${
              isLight ? "text-slate-600" : "text-slate-300"
            }`}
          >
            {user.bio || "No bio available."}
          </p>

          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
            <p>
              Followers: <strong>{user.followers}</strong>
            </p>
            <p>
              Public Repos: <strong>{user.public_repos}</strong>
            </p>
          </div>
        </div>
      </div>

      <RepoList repos={repos} isLight={isLight} />
    </div>
  );
}

export default function GitHubFinder() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  // "idle" | "loading" | "error" | "done"
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (!query) {
      setUser(null);
      setRepos([]);
      setStatus("idle");
      setErrorMsg("");
      document.title = "GitHub Finder";
      return;
    }

    let ignore = false;
    setStatus("loading");
    setErrorMsg("");

    Promise.all([
      fetch(`https://api.github.com/users/${query}`).then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error(
              "GitHub API rate limit reached. Please try again in a bit."
            );
          }
          throw new Error("User not found (404)");
        }
        return res.json();
      }),
      fetch(
        `https://api.github.com/users/${query}/repos?sort=updated&per_page=100`
      ).then((res) => {
        if (!res.ok) {
          return [];
        }
        return res.json();
      }),
    ])
      .then(([userData, reposData]) => {
        if (ignore) return;
        setUser(userData);
        setRepos(Array.isArray(reposData) ? reposData : []);
        setStatus("done");
        document.title = userData.name || userData.login;
        localStorage.setItem("lastUser", query);
      })
      .catch((err) => {
        if (ignore) return;
        setUser(null);
        setRepos([]);
        setStatus("error");
        setErrorMsg(err.message);
        document.title = "GitHub Finder";
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    setQuery(input.trim());
  }

  function handleClear() {
    setInput("");
    setQuery("");
  }

  function handleQuickPick(username) {
    setInput(username);
    setQuery(username);
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        isLight
          ? "bg-violet-50/50 text-slate-900"
          : "bg-slate-950 text-slate-100"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 py-7">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                isLight
                  ? "bg-white border-violet-200"
                  : "bg-slate-900 border-violet-500/30"
              }`}
            >
              <GitHubLogo isLight={isLight} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                GitHub Radar
              </h1>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Developer Profile & Repository Explorer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLight(!isLight)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition cursor-pointer ${
              isLight
                ? "bg-white border-violet-200 text-violet-900 hover:bg-violet-50"
                : "bg-slate-900 border-violet-500/30 text-violet-200 hover:bg-slate-800"
            }`}
          >
            {isLight ? <MoonIcon /> : <SunIcon />}
            <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </header>

        {/* Search Panel */}
        <section
          className={`rounded-2xl border p-5 transition-colors ${
            isLight
              ? "bg-white border-violet-200"
              : "bg-slate-900/80 border-violet-500/25"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1 flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-sm">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search GitHub username (e.g. Rahmamohamed29)..."
                className={`w-full rounded-xl border py-2.5 pl-10 text-sm outline-none transition ${
                  input ? "pr-9" : "pr-4"
                } ${
                  isLight
                    ? "bg-violet-50/40 border-violet-200 text-slate-900 placeholder-slate-400 focus:border-violet-500"
                    : "bg-slate-950/80 border-violet-500/25 text-white placeholder-slate-500 focus:border-violet-400"
                }`}
              />
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className={`absolute right-3 text-xs px-1 transition cursor-pointer ${
                    isLight
                      ? "text-slate-500 hover:text-violet-700"
                      : "text-slate-400 hover:text-violet-200"
                  }`}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-xl bg-violet-500 hover:bg-violet-400 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Picks */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className={isLight ? "text-slate-500" : "text-slate-400"}>
              Quick picks:
            </span>
            {QUICK_PICKS.map((username) => {
              const isSelected =
                query.toLowerCase() === username.toLowerCase();
              return (
                <button
                  key={username}
                  type="button"
                  onClick={() => handleQuickPick(username)}
                  className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-violet-500 text-white"
                      : isLight
                      ? "bg-violet-50 border border-violet-200 text-violet-800 hover:bg-violet-100"
                      : "bg-slate-800/80 border border-violet-500/25 text-violet-200 hover:border-violet-400/50 hover:text-white"
                  }`}
                >
                  @{username}
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading State */}
        {status === "loading" && (
          <p
            className={`mt-5 text-sm ${
              isLight ? "text-violet-600" : "text-violet-300"
            }`}
          >
            Loading...
          </p>
        )}

        {/* Error Banner */}
        {status === "error" && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-rose-500/35 bg-rose-950/60 px-4 py-3.5 text-center text-sm text-rose-300"
          >
            {errorMsg}
          </div>
        )}

        {/* Result Card + Repos */}
        {status === "done" && user && (
          <UserCard user={user} repos={repos} isLight={isLight} />
        )}
      </div>
    </div>
  );
}