import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Edit3,
  ExternalLink,
  Globe2,
  KeyRound,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "movieverse_api_providers";

const defaultForm = {
  name: "",
  type: "REST API",
  baseUrl: "",
  apiKey: "",
  method: "GET",
  priority: 1,
  enabled: true,
  primary: false,
  headers: "",
  params: "",
  description: "",
};

const starterProviders = [
  {
    id: "tmdb",
    name: "TMDB",
    type: "REST API",
    baseUrl: "https://api.themoviedb.org/3",
    apiKey: "",
    method: "GET",
    priority: 1,
    enabled: true,
    primary: true,
    headers: "",
    params: "language=en-US",
    description: "Movie and TV metadata provider",
    status: "unknown",
    lastTested: null,
  },
  {
    id: "omdb",
    name: "OMDb",
    type: "REST API",
    baseUrl: "https://www.omdbapi.com/",
    apiKey: "",
    method: "GET",
    priority: 2,
    enabled: false,
    primary: false,
    headers: "",
    params: "",
    description: "Movie information provider",
    status: "unknown",
    lastTested: null,
  },
];

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getInitialProviders() {
  if (typeof window === "undefined") return starterProviders;

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProviders));
    return starterProviders;
  }

  const parsed = safeParse(saved, starterProviders);

  return Array.isArray(parsed) ? parsed : starterProviders;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function maskKey(key) {
  if (!key) return "Not configured";
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

function parseLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((result, line) => {
      const separator = line.indexOf(":");

      if (separator === -1) return result;

      const key = line.slice(0, separator).trim();
      const val = line.slice(separator + 1).trim();

      if (key) result[key] = val;

      return result;
    }, {});
}

export default function ApiProviders() {
  const [providers, setProviders] = useState(getInitialProviders);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [testingId, setTestingId] = useState(null);
  const [testMessage, setTestMessage] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  }, [providers]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.baseUrl.toLowerCase().includes(search.toLowerCase()) ||
        provider.type.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "enabled" && provider.enabled) ||
        (filter === "disabled" && !provider.enabled) ||
        (filter === "primary" && provider.primary);

      return matchesSearch && matchesFilter;
    });
  }, [providers, search, filter]);

  const stats = useMemo(() => {
    const enabled = providers.filter((p) => p.enabled).length;
    const primary = providers.filter((p) => p.primary).length;
    const healthy = providers.filter((p) => p.status === "online").length;

    return {
      total: providers.length,
      enabled,
      primary,
      healthy,
    };
  }, [providers]);

  function openAdd() {
    setEditingId(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(provider) {
    setEditingId(provider.id);
    setForm({
      name: provider.name || "",
      type: provider.type || "REST API",
      baseUrl: provider.baseUrl || "",
      apiKey: provider.apiKey || "",
      method: provider.method || "GET",
      priority: provider.priority || 1,
      enabled: provider.enabled ?? true,
      primary: provider.primary ?? false,
      headers: provider.headers || "",
      params: provider.params || "",
      description: provider.description || "",
    });
    setShowModal(true);
    setShowMenu(null);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveProvider(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.baseUrl.trim()) {
      alert("API Name and Base URL are required.");
      return;
    }

    if (editingId) {
      setProviders((current) =>
        current.map((provider) =>
          provider.id === editingId
            ? {
                ...provider,
                ...form,
                name: form.name.trim(),
                baseUrl: form.baseUrl.trim(),
              }
            : provider
        )
      );
    } else {
      const newProvider = {
        id: makeId(),
        ...form,
        name: form.name.trim(),
        baseUrl: form.baseUrl.trim(),
        status: "unknown",
        lastTested: null,
      };

      setProviders((current) => [...current, newProvider]);
    }

    if (form.primary) {
      setProviders((current) =>
        current.map((provider) => ({
          ...provider,
          primary:
            editingId && provider.id === editingId
              ? true
              : !editingId && provider.id === provider.id
                ? provider.primary
                : false,
        }))
      );
    }

    closeModal();
  }

  function toggleProvider(id) {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === id
          ? { ...provider, enabled: !provider.enabled }
          : provider
      )
    );
    setShowMenu(null);
  }

  function setPrimary(id) {
    setProviders((current) =>
      current.map((provider) => ({
        ...provider,
        primary: provider.id === id,
      }))
    );
    setShowMenu(null);
  }

  function deleteProvider(id) {
    const provider = providers.find((item) => item.id === id);

    if (!provider) return;

    const confirmed = window.confirm(
      `Delete "${provider.name}" API provider?`
    );

    if (!confirmed) return;

    setProviders((current) => current.filter((item) => item.id !== id));
    setShowMenu(null);
  }

  async function testProvider(provider) {
    if (!provider.baseUrl) return;

    setTestingId(provider.id);
    setTestMessage((current) => ({
      ...current,
      [provider.id]: null,
    }));

    try {
      const url = new URL(provider.baseUrl);

      const params = new URLSearchParams(provider.params || "");

      if (provider.apiKey && !params.has("apikey") && !params.has("api_key")) {
        params.set("apikey", provider.apiKey);
      }

      const headers = parseLines(provider.headers || "");

      const requestUrl =
        provider.method === "GET" && params.toString()
          ? `${url.toString()}${url.search ? "&" : "?"}${params.toString()}`
          : url.toString();

      const response = await fetch(requestUrl, {
        method: provider.method || "GET",
        headers,
        ...(provider.method !== "GET"
          ? {
              body:
                provider.params && provider.params.trim()
                  ? provider.params
                  : undefined,
            }
          : {}),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setProviders((current) =>
        current.map((item) =>
          item.id === provider.id
            ? {
                ...item,
                status: "online",
                lastTested: new Date().toISOString(),
              }
            : item
        )
      );

      setTestMessage((current) => ({
        ...current,
        [provider.id]: {
          type: "success",
          text: `Connection successful • HTTP ${response.status}`,
        },
      }));
    } catch (error) {
      setProviders((current) =>
        current.map((item) =>
          item.id === provider.id
            ? {
                ...item,
                status: "offline",
                lastTested: new Date().toISOString(),
              }
            : item
        )
      );

      setTestMessage((current) => ({
        ...current,
        [provider.id]: {
          type: "error",
          text:
            error?.message ||
            "Connection failed. Provider may block browser CORS requests.",
        },
      }));
    } finally {
      setTestingId(null);
    }
  }

  async function copyProvider(provider) {
    try {
      await navigator.clipboard.writeText(provider.baseUrl);
      setCopiedId(provider.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  function resetProviders() {
    const confirmed = window.confirm(
      "Reset API providers to the default configuration?"
    );

    if (!confirmed) return;

    setProviders(starterProviders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProviders));
  }

  return (
    <div className="api-page">
      <div className="api-background" />

      <div className="api-container">
        <header className="api-header">
          <div>
            <div className="api-eyebrow">
              <span className="api-eyebrow-dot" />
              SYSTEM / API INFRASTRUCTURE
            </div>

            <h1>API Providers</h1>

            <p>
              Manage metadata providers, fallback sources and external API
              connections from one centralized control panel.
            </p>
          </div>

          <div className="api-header-actions">
            <button
              className="api-secondary-button"
              onClick={resetProviders}
              type="button"
            >
              <RefreshCw size={17} />
              Reset
            </button>

            <button
              className="api-primary-button"
              onClick={openAdd}
              type="button"
            >
              <Plus size={18} />
              Add Provider
            </button>
          </div>
        </header>

        <section className="api-stat-grid">
          <StatCard
            icon={<Server size={19} />}
            label="Total Providers"
            value={stats.total}
            detail="Configured sources"
          />

          <StatCard
            icon={<Zap size={19} />}
            label="Active Providers"
            value={stats.enabled}
            detail="Currently enabled"
          />

          <StatCard
            icon={<ShieldCheck size={19} />}
            label="Healthy"
            value={stats.healthy}
            detail="Successful tests"
          />

          <StatCard
            icon={<Globe2 size={19} />}
            label="Primary"
            value={stats.primary}
            detail="Main data source"
          />
        </section>

        <section className="api-toolbar">
          <div className="api-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search providers..."
            />
          </div>

          <div className="api-filters">
            {[
              ["all", "All"],
              ["enabled", "Enabled"],
              ["disabled", "Disabled"],
              ["primary", "Primary"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "active" : ""}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="api-content">
          <div className="api-content-heading">
            <div>
              <h2>Provider Registry</h2>
              <p>
                {filteredProviders.length} provider
                {filteredProviders.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="api-secure-status">
              <ShieldCheck size={16} />
              Configuration stored locally
            </div>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="api-empty">
              <div className="api-empty-icon">
                <Server size={28} />
              </div>

              <h3>No providers found</h3>

              <p>
                Add your first API provider or change the current search
                filters.
              </p>

              <button
                className="api-primary-button"
                onClick={openAdd}
                type="button"
              >
                <Plus size={17} />
                Add Provider
              </button>
            </div>
          ) : (
            <div className="api-provider-list">
              {filteredProviders.map((provider) => (
                <article className="api-provider-card" key={provider.id}>
                  <div className="api-provider-main">
                    <div className="api-provider-logo">
                      <Server size={22} />
                    </div>

                    <div className="api-provider-info">
                      <div className="api-provider-title">
                        <h3>{provider.name}</h3>

                        {provider.primary && (
                          <span className="api-badge primary">
                            <Zap size={12} />
                            Primary
                          </span>
                        )}

                        <span
                          className={`api-badge ${
                            provider.enabled ? "enabled" : "disabled"
                          }`}
                        >
                          {provider.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>

                      <div className="api-provider-url">
                        <Globe2 size={14} />
                        <span>{provider.baseUrl}</span>

                        <button
                          type="button"
                          title="Copy URL"
                          onClick={() => copyProvider(provider)}
                        >
                          {copiedId === provider.id ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>

                        <a
                          href={provider.baseUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open provider"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>

                      {provider.description && (
                        <p className="api-provider-description">
                          {provider.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="api-provider-meta">
                    <div className="api-meta-item">
                      <span>TYPE</span>
                      <strong>{provider.type}</strong>
                    </div>

                    <div className="api-meta-item">
                      <span>METHOD</span>
                      <strong>{provider.method}</strong>
                    </div>

                    <div className="api-meta-item">
                      <span>PRIORITY</span>
                      <strong>#{provider.priority}</strong>
                    </div>

                    <div className="api-meta-item">
                      <span>API KEY</span>
                      <strong>
                        <KeyRound size={13} />
                        {maskKey(provider.apiKey)}
                      </strong>
                    </div>
                  </div>

                  <div className="api-provider-actions">
                    {testMessage[provider.id] && (
                      <div
                        className={`api-test-message ${testMessage[provider.id].type}`}
                      >
                        {testMessage[provider.id].type === "success" ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <AlertCircle size={15} />
                        )}

                        <span>{testMessage[provider.id].text}</span>
                      </div>
                    )}

                    <button
                      className="api-test-button"
                      type="button"
                      disabled={testingId === provider.id}
                      onClick={() => testProvider(provider)}
                    >
                      {testingId === provider.id ? (
                        <>
                          <RefreshCw className="api-spin" size={16} />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Activity size={16} />
                          Test Connection
                        </>
                      )}
                    </button>

                    <div className="api-menu-wrap">
                      <button
                        className="api-icon-button"
                        type="button"
                        onClick={() =>
                          setShowMenu(
                            showMenu === provider.id ? null : provider.id
                          )
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {showMenu === provider.id && (
                        <div className="api-dropdown">
                          <button
                            type="button"
                            onClick={() => openEdit(provider)}
                          >
                            <Edit3 size={15} />
                            Edit Provider
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleProvider(provider.id)}
                          >
                            {provider.enabled ? (
                              <>
                                <X size={15} />
                                Disable Provider
                              </>
                            ) : (
                              <>
                                <Check size={15} />
                                Enable Provider
                              </>
                            )}
                          </button>

                          {!provider.primary && (
                            <button
                              type="button"
                              onClick={() => setPrimary(provider.id)}
                            >
                              <Zap size={15} />
                              Make Primary
                            </button>
                          )}

                          <button
                            className="danger"
                            type="button"
                            onClick={() => deleteProvider(provider.id)}
                          >
                            <Trash2 size={15} />
                            Delete Provider
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="api-modal-backdrop" onMouseDown={closeModal}>
          <div
            className="api-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="api-modal-header">
              <div>
                <div className="api-modal-icon">
                  <Settings2 size={20} />
                </div>

                <h2>{editingId ? "Edit Provider" : "Add API Provider"}</h2>

                <p>
                  Configure an external data source for your MovieVerse
                  application.
                </p>
              </div>

              <button
                className="api-close-button"
                type="button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form className="api-form" onSubmit={saveProvider}>
              <div className="api-form-section">
                <div className="api-form-section-title">
                  <span>01</span>
                  Provider Identity
                </div>

                <div className="api-form-grid two">
                  <FormField label="API Name" required>
                    <input
                      value={form.name}
                      onChange={(event) =>
                        updateForm("name", event.target.value)
                      }
                      placeholder="e.g. TMDB"
                    />
                  </FormField>

                  <FormField label="API Type">
                    <div className="api-select">
                      <select
                        value={form.type}
                        onChange={(event) =>
                          updateForm("type", event.target.value)
                        }
                      >
                        <option>REST API</option>
                        <option>GraphQL</option>
                        <option>JSON API</option>
                        <option>XML API</option>
                        <option>Custom</option>
                      </select>

                      <ChevronDown size={16} />
                    </div>
                  </FormField>
                </div>

                <FormField label="Base URL" required>
                  <div className="api-input-with-icon">
                    <Globe2 size={17} />
                    <input
                      value={form.baseUrl}
                      onChange={(event) =>
                        updateForm("baseUrl", event.target.value)
                      }
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                </FormField>

                <FormField label="Description">
                  <input
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="Short description of this provider"
                  />
                </FormField>
              </div>

              <div className="api-form-section">
                <div className="api-form-section-title">
                  <span>02</span>
                  Authentication
                </div>

                <FormField label="API Key">
                  <div className="api-input-with-icon">
                    <KeyRound size={17} />
                    <input
                      type="password"
                      value={form.apiKey}
                      onChange={(event) =>
                        updateForm("apiKey", event.target.value)
                      }
                      placeholder="Enter API key"
                      autoComplete="off"
                    />
                  </div>
                </FormField>

                <div className="api-form-grid two">
                  <FormField label="Request Method">
                    <div className="api-select">
                      <select
                        value={form.method}
                        onChange={(event) =>
                          updateForm("method", event.target.value)
                        }
                      >
                        <option>GET</option>
                        <option>POST</option>
                      </select>

                      <ChevronDown size={16} />
                    </div>
                  </FormField>

                  <FormField label="Priority">
                    <input
                      type="number"
                      min="1"
                      value={form.priority}
                      onChange={(event) =>
                        updateForm(
                          "priority",
                          Math.max(1, Number(event.target.value) || 1)
                        )
                      }
                    />
                  </FormField>
                </div>
              </div>

              <div className="api-form-section">
                <div className="api-form-section-title">
                  <span>03</span>
                  Request Configuration
                </div>

                <div className="api-form-grid two">
                  <FormField label="Headers">
                    <textarea
                      value={form.headers}
                      onChange={(event) =>
                        updateForm("headers", event.target.value)
                      }
                      placeholder={"Authorization: Bearer YOUR_TOKEN\nAccept: application/json"}
                    />
                    <small>One header per line: Name: Value</small>
                  </FormField>

                  <FormField label="Query Parameters">
                    <textarea
                      value={form.params}
                      onChange={(event) =>
                        updateForm("params", event.target.value)
                      }
                      placeholder="language=en-US&page=1"
                    />
                    <small>Example: key=value&amp;page=1</small>
                  </FormField>
                </div>
              </div>

              <div className="api-form-section">
                <div className="api-form-section-title">
                  <span>04</span>
                  Routing
                </div>

                <div className="api-toggle-row">
                  <div>
                    <strong>Enable provider</strong>
                    <span>
                      Allow the application to use this provider for requests.
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`api-toggle ${form.enabled ? "on" : ""}`}
                    onClick={() => updateForm("enabled", !form.enabled)}
                    aria-label="Toggle provider"
                  >
                    <span />
                  </button>
                </div>

                <div className="api-toggle-row">
                  <div>
                    <strong>Primary provider</strong>
                    <span>
                      Use this source as the preferred data provider.
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`api-toggle ${form.primary ? "on" : ""}`}
                    onClick={() => updateForm("primary", !form.primary)}
                    aria-label="Toggle primary provider"
                  >
                    <span />
                  </button>
                </div>
              </div>

              <div className="api-form-note">
                <ShieldCheck size={17} />

                <span>
                  Browser-side requests only work when the provider permits
                  CORS. For protected APIs, use a server-side Worker/proxy and
                  keep secret keys out of client-side code.
                </span>
              </div>

              <div className="api-modal-footer">
                <button
                  type="button"
                  className="api-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="api-primary-button">
                  <Check size={17} />
                  {editingId ? "Save Changes" : "Create Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="api-stat-card">
      <div className="api-stat-icon">{icon}</div>

      <div className="api-stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="api-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>

      {children}
    </label>
  );
}
