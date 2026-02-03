import "../styles/Landingpage.css";

export default function Landingpage() {
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-avatar">U</div>

        <div className="icon alert">
          <BellIcon />
        </div>
        <div className="icon">
          <SettingsIcon />
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">Fleet Monitor</div>

          <nav className="nav-links">
            <span className="active">Home</span>
            <span>Reports</span>
            <span>Workers Management</span>
          </nav>

          <span className="live-dot">Live</span>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h1>Welcome back!</h1>

          {/* STATS CONTAINER CARD */}
          <div className="stats-container">
            <div className="stats">
              <Stat title="Total Vehicles" value="150" type="total" />
              <Stat title="Active Vehicles" value="120" type="active" />
              <Stat title="Charging Vehicles" value="15" type="charging" />
              <Stat title="Under Maintenance" value="5" type="maintenance" />
            </div>

            <div className="last-sync">
              Last synced <span>2 min ago</span>
            </div>
          </div>

          {/* FORKLIFT STATUS SECTION */}
          <section className="forklift-section">
            <h2 className="section-title">Vehicle Status</h2>

            <div className="forklift-grid">
              <ForkliftCard
                name="Forklift-01"
                mac="00:1B:44:11:3A:B7"
                status="active"
                progress={90}
              />
              <ForkliftCard
                name="Forklift-02"
                mac="00:1B:44:11:3A:B8"
                status="low"
                progress={30}
              />
              <ForkliftCard
                name="Forklift-03"
                mac="00:1B:44:11:3A:B9"
                status="charging"
                progress={60}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ===== STAT CARD ===== */
function Stat({ title, value, type }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-glass">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

/* ===== FORKLIFT CARD ===== */
function ForkliftCard({ name, mac, status, progress }) {
  return (
    <div className={`forklift-card ${status}`}>
      <div className="forklift-header">
        <h3>{name}</h3>
        <span className={`status-pill ${status}`}>
          {status === "active"
            ? "Active"
            : status === "charging"
            ? "Charging"
            : "Low Battery"}
        </span>
      </div>

      <p className="mac">MAC ID: {mac}</p>

      <div className="progress-bar">
        <span
          className={`progress ${status}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ===== ICONS ===== */
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 17a3 3 0 0 0 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
