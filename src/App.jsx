import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

/* ─── tiny fetch helper ─── */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

/* ════════════════════════════════════
   AUTH  (Login / Register)
════════════════════════════════════ */
function Auth({ register, onSuccess, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = register ? "/auth/register" : "/auth/login";
      const body = register ? { name, email, password } : { email, password };
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-symbol">✓</div>
          <span>TaskFlow</span>
        </div>

        <div className="auth-copy">
          <span className="overline">SMARTER WORKFLOW</span>
          <h1>
            Turn your plans
            <br />
            into <span>progress.</span>
          </h1>
          <p>
            A simple and powerful workspace to organize your tasks, track your
            progress and achieve your goals.
          </p>
          <div className="auth-points">
            <div><b>✓</b><span>Organize everything in one place</span></div>
            <div><b>✓</b><span>Track your daily productivity</span></div>
            <div><b>✓</b><span>Stay focused on what matters</span></div>
          </div>
        </div>

        <small className="auth-footer">© 2026 TaskFlow</small>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="mobile-brand">
            <div className="brand-symbol">✓</div>
            TaskFlow
          </div>

          <div className="auth-heading">
            <span>{register ? "GET STARTED" : "WELCOME BACK"}</span>
            <h2>{register ? "Create your account" : "Welcome back"}</h2>
            <p>
              {register
                ? "Start organizing your work with TaskFlow."
                : "Sign in to continue to your workspace."}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit}>
            {register && (
              <div className="field">
                <label>Full name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>

            {register && (
              <label className="terms">
                <input type="checkbox" required />
                I agree to the Terms &amp; Privacy Policy
              </label>
            )}

            {!register && (
              <div className="auth-options">
                <label><input type="checkbox" /> Remember me</label>
              </div>
            )}

            <button className="auth-button" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : register
                ? "Create account"
                : "Sign in"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="switch-auth">
            {register ? "Already have an account?" : "Don't have an account?"}
            <button type="button" onClick={onRegister}>
              {register ? "Sign in" : "Create account"}
            </button>
          </div>

          <div className="secure">🔒 Your information is securely protected</div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   DASHBOARD
════════════════════════════════════ */
function Dashboard({ logout }) {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userName = savedUser?.name || "User";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  /* fetch tasks from backend */
  const fetchTasks = useCallback(async () => {
    try {
      const data = await apiFetch("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const data = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description, priority }),
      });
      setTasks([data.task, ...tasks]);
      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const removeTask = async (id) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const data = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setTasks(tasks.map((t) => (t._id === id ? data.task : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
  };

  /* stats */
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  /* filtered list */
  const visibleTasks = tasks.filter((task) => {
    const q = search.toLowerCase();
    const matchSearch =
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q);
    const matchFilter = filter === "All" || task.status === filter;
    return matchSearch && matchFilter;
  });

  /* greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* date */
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand-symbol">✓</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Personal workspace</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav>
          <button className="side-link active">
            <span>⌂</span>Dashboard
          </button>
          <button className="side-link">
            <span>✓</span>My Tasks<small>{total}</small>
          </button>
          <button className="side-link">
            <span>◷</span>Activity
          </button>
          <button className="side-link">
            <span>⚙</span>Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="side-user">
            <div className="user-avatar">{initials}</div>
            <div>
              <strong>{userName}</strong>
              <span>Member</span>
            </div>
          </div>
          <button className="side-logout" onClick={handleLogout}>
            ↪ Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        {error && (
          <div className="dashboard-error" onClick={() => setError("")}>
            ⚠ {error} <span>✕</span>
          </div>
        )}

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <span className="header-date">{today}</span>
            <h1>{greeting}, {userName.split(" ")[0]} 👋</h1>
            <p>Here's what's happening with your tasks today.</p>
          </div>
          <div className="header-user">
            <button className="bell">♢</button>
            <div className="header-avatar">{initials}</div>
          </div>
        </header>

        {/* OVERVIEW BANNER */}
        <section className="overview">
          <div className="overview-copy">
            <span>YOUR PRODUCTIVITY</span>
            <h2>
              Keep going,<br />
              <strong>you're doing great.</strong>
            </h2>
            <p>You've completed {completed} out of {total} tasks.</p>
          </div>

          <div className="completion">
            <div
              className="completion-ring"
              style={{
                background: `conic-gradient(#ffffff ${percentage}%, rgba(255,255,255,.15) 0)`,
              }}
            >
              <div>
                <strong>{percentage}%</strong>
                <span>done</span>
              </div>
            </div>
            <div>
              <strong>Overall progress</strong>
              <span>Keep building momentum</span>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="stat-row">
          <div className="stat-box">
            <div className="stat-icon purple">▦</div>
            <div><span>Total tasks</span><strong>{total}</strong></div>
          </div>
          <div className="stat-box">
            <div className="stat-icon green">✓</div>
            <div><span>Completed</span><strong>{completed}</strong></div>
          </div>
          <div className="stat-box">
            <div className="stat-icon orange">◷</div>
            <div><span>In progress</span><strong>{inProgress}</strong></div>
          </div>
          <div className="stat-box">
            <div className="stat-icon blue">○</div>
            <div><span>To do</span><strong>{todo}</strong></div>
          </div>
        </section>

        {/* WORKSPACE GRID */}
        <section className="workspace-grid">
          {/* CREATE TASK */}
          <div className="create-card">
            <div className="section-heading">
              <span className="heading-icon">+</span>
              <div>
                <h2>Create new task</h2>
                <p>Add a task and keep your work moving.</p>
              </div>
            </div>

            <form onSubmit={createTask}>
              <label>Task title</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Add some details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Priority</label>
              <select
                className="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button className="create-task-btn" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create task"}
                {!creating && <span>→</span>}
              </button>
            </form>
          </div>

          {/* TASK LIST */}
          <div className="tasks-card">
            <div className="tasks-top">
              <div>
                <h2>My tasks</h2>
                <p>Everything you need to get done.</p>
              </div>
              <span className="task-total">{visibleTasks.length} tasks</span>
            </div>

            <div className="filters">
              <div className="search">
                <span>⌕</span>
                <input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>All</option>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="tasks">
              {loadingTasks ? (
                <div className="empty">
                  <div>◷</div>
                  <h3>Loading tasks...</h3>
                </div>
              ) : visibleTasks.length === 0 ? (
                <div className="empty">
                  <div>✓</div>
                  <h3>No tasks found</h3>
                  <p>
                    {tasks.length === 0
                      ? "Create your first task to get started."
                      : "Try changing your search or filter."}
                  </p>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <div className="task-card" key={task._id}>
                    <div className={`task-circle ${task.status === "Completed" ? "done" : ""}`}>
                      {task.status === "Completed" && "✓"}
                    </div>

                    <div className="task-details">
                      <div className="task-name">
                        <h3>{task.title}</h3>
                        <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                          {task.status}
                        </span>
                      </div>

                      {task.description && <p>{task.description}</p>}

                      <div className="task-footer">
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          {task.priority} priority
                        </span>

                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        >
                          <option>To Do</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>

                        <button className="delete" onClick={() => removeTask(task._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ════════════════════════════════════
   ROOT
════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState(() => {
    // if token exists, go straight to dashboard
    return localStorage.getItem("token") ? "dashboard" : "login";
  });

  return page === "dashboard" ? (
    <Dashboard logout={() => setPage("login")} />
  ) : page === "register" ? (
    <Auth
      register
      onSuccess={() => setPage("dashboard")}
      onRegister={() => setPage("login")}
    />
  ) : (
    <Auth
      register={false}
      onSuccess={() => setPage("dashboard")}
      onRegister={() => setPage("register")}
    />
  );
}
