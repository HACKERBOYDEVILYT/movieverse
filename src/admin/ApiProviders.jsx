import "./apiProviders.css";
import { useMemo, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  Copy,
  Edit3,
  Globe,
  KeyRound,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Server,
  Settings2,
  ShieldCheck,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import {
  addProvider,
  getProviders,
  removeProvider,
  resetProviders,
  toggleProvider,
  updateProvider,
} from "../api/providers";

const EMPTY_FORM = {
  name: "",
  type: "metadata",
  baseUrl: "",
  apiKey: "",
  method: "GET",
  enabled: true,
  priority: 1,
  headers: "",
  params: "",
};

const TYPE_OPTIONS = [
  {
    value: "metadata",
    label: "Metadata API",
  },
  {
    value: "search",
    label: "Search API",
  },
  {
    value: "image",
    label: "Image API",
  },
  {
    value: "catalog",
    label: "Catalog API",
  },
  {
    value: "custom",
    label: "Custom API",
  },
];

function safeJsonParse(value, fallback = {}) {
  if (!value?.trim()) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export default function ApiProviders() {
  const [providers, setProviders] = useState(() =>
    getProviders()
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});

  const [menuId, setMenuId] = useState(null);

  const activeCount = useMemo(
    () =>
      providers.filter(
        (provider) => provider.enabled !== false
      ).length,
    [providers]
  );

  const refresh = () => {
    setProviders([...getProviders()]);
  };

  const openAdd = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      priority: providers.length + 1,
    });

    setShowModal(true);
  };

  const openEdit = (provider) => {
    setEditingId(provider.id);

    setForm({
      name: provider.name || "",
      type: provider.type || "metadata",
      baseUrl: provider.baseUrl || "",
      apiKey: provider.apiKey || "",
      method: provider.method || "GET",
      enabled: provider.enabled !== false,
      priority: provider.priority || 1,
      headers: provider.headers
        ? JSON.stringify(provider.headers, null, 2)
        : "",
      params: provider.params
        ? JSON.stringify(provider.params, null, 2)
        : "",
    });

    setShowModal(true);
    setMenuId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const saveProvider = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Provider name is required.");
      return;
    }

    if (!form.baseUrl.trim()) {
      alert("API Base URL is required.");
      return;
    }

    const providerData = {
      name: form.name.trim(),
      type: form.type,
      baseUrl: form.baseUrl.trim(),
      apiKey: form.apiKey.trim(),
      method: form.method,
      enabled: form.enabled,
      priority: Number(form.priority) || 1,
      headers: safeJsonParse(form.headers),
      params: safeJsonParse(form.params),
    };

    if (editingId) {
      updateProvider(
        editingId,
        providerData
      );
    } else {
      addProvider(providerData);
    }

    refresh();
    closeModal();
  };

  const handleToggle = (id) => {
    toggleProvider(id);
    refresh();
  };

  const handleDelete = (id) => {
    const provider = providers.find(
      (item) => item.id === id
    );

    if (
      !window.confirm(
        `Delete "${provider?.name || "this provider"}"?`
      )
    ) {
      return;
    }

    removeProvider(id);
    refresh();
    setMenuId(null);
  };

  const handleDuplicate = (provider) => {
    addProvider({
      ...provider,
      id: undefined,
      name: `${provider.name} Copy`,
      priority: providers.length + 1,
    });

    refresh();
    setMenuId(null);
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Reset API providers to default settings?"
      )
    ) {
      return;
    }

    resetProviders();
    refresh();
  };

  const testProvider = async (provider) => {
    if (!provider.baseUrl) {
      setTestResults((current) => ({
        ...current,
        [provider.id]: {
          ok: false,
          message: "No API URL configured.",
        },
      }));

      return;
    }

    setTestingId(provider.id);

    try {
      const headers = {
        Accept: "application/json",
        ...(provider.headers || {}),
      };

      const response = await fetch(
        provider.baseUrl,
        {
          method: provider.method || "GET",
          headers,
        }
      );

      setTestResults((current) => ({
        ...current,
        [provider.id]: {
          ok: response.ok,
          message: response.ok
            ? `Connected · HTTP ${response.status}`
            : `HTTP ${response.status}`,
        },
      }));
    } catch (error) {
      setTestResults((current) => ({
        ...current,
        [provider.id]: {
          ok: false,
          message:
            error?.message ||
            "Connection failed",
        },
      }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="admin-providers-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">
            <span>Admin</span>
            <ChevronDown size={13} />
            <strong>API Providers</strong>
          </div>

          <h1>API Providers</h1>

          <p>
            Manage metadata, search, image and custom
            API integrations from one place.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={handleReset}
          >
            <RefreshCw size={17} />
            Reset
          </button>

          <button
            className="admin-btn admin-btn-primary"
            onClick={openAdd}
          >
            <Plus size={18} />
            Add Provider
          </button>
        </div>
      </div>

      <div className="provider-stats">
        <StatCard
          icon={<Server size={20} />}
          label="Total Providers"
          value={providers.length}
        />

        <StatCard
          icon={<Activity size={20} />}
          label="Active Providers"
          value={activeCount}
        />

        <StatCard
          icon={<Zap size={20} />}
          label="Priority Routing"
          value="Enabled"
        />

        <StatCard
          icon={<ShieldCheck size={20} />}
          label="Connection"
          value="Ready"
        />
      </div>

      <div className="provider-toolbar">
        <div>
          <h2>Configured Providers</h2>
          <p>
            Enable or disable providers without
            removing their configuration.
          </p>
        </div>

        <button
          className="provider-refresh"
          onClick={refresh}
          title="Refresh"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="provider-empty">
          <Server size={42} />

          <h3>No API providers</h3>

          <p>
            Add your first API provider to start
            connecting external data sources.
          </p>

          <button
            className="admin-btn admin-btn-primary"
            onClick={openAdd}
          >
            <Plus size={17} />
            Add Provider
          </button>
        </div>
      ) : (
        <div className="provider-list">
          {providers.map((provider) => {
            const result =
              testResults[provider.id];

            return (
              <div
                className={`provider-card ${
                  provider.enabled === false
                    ? "provider-disabled"
                    : ""
                }`}
                key={provider.id}
              >
                <div className="provider-icon">
                  <Globe size={22} />
                </div>

                <div className="provider-main">
                  <div className="provider-title-row">
                    <div>
                      <h3>{provider.name}</h3>

                      <div className="provider-meta">
                        <span>
                          {provider.type ||
                            "custom"}
                        </span>

                        <span>•</span>

                        <span>
                          Priority{" "}
                          {provider.priority ??
                            "—"}
                        </span>
                      </div>
                    </div>

                    <StatusBadge
                      enabled={
                        provider.enabled !==
                        false
                      }
                    />
                  </div>

                  <div className="provider-url">
                    <span>
                      {provider.method ||
                        "GET"}
                    </span>

                    <code>
                      {provider.baseUrl ||
                        "No endpoint configured"}
                    </code>
                  </div>

                  {result && (
                    <div
                      className={`provider-test-result ${
                        result.ok
                          ? "success"
                          : "failed"
                      }`}
                    >
                      {result.ok ? (
                        <Check size={15} />
                      ) : (
                        <X size={15} />
                      )}

                      {result.message}
                    </div>
                  )}
                </div>

                <div className="provider-actions">
                  <button
                    className="test-btn"
                    onClick={() =>
                      testProvider(provider)
                    }
                    disabled={
                      testingId ===
                      provider.id
                    }
                  >
                    {testingId ===
                    provider.id ? (
                      <RefreshCw
                        size={15}
                        className="spin"
                      />
                    ) : (
                      <Activity size={15} />
                    )}

                    Test
                  </button>

                  <button
                    className={`toggle ${
                      provider.enabled !==
                      false
                        ? "on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        provider.id
                      )
                    }
                    aria-label="Toggle provider"
                  >
                    <span />
                  </button>

                  <div className="provider-menu">
                    <button
                      className="more-btn"
                      onClick={() =>
                        setMenuId(
                          menuId ===
                            provider.id
                            ? null
                            : provider.id
                        )
                      }
                    >
                      <MoreVertical
                        size={18}
                      />
                    </button>

                    {menuId ===
                      provider.id && (
                      <div className="dropdown-menu">
                        <button
                          onClick={() =>
                            openEdit(
                              provider
                            )
                          }
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDuplicate(
                              provider
                            )
                          }
                        >
                          <Copy size={15} />
                          Duplicate
                        </button>

                        <button
                          className="danger"
                          onClick={() =>
                            handleDelete(
                              provider.id
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="provider-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Provider"
                    : "Add API Provider"}
                </h2>

                <p>
                  Configure an external API
                  endpoint.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveProvider}>
              <div className="form-grid">
                <FormField
                  label="Provider Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: TMDB"
                  icon={<Server size={16} />}
                />

                <div className="form-field">
                  <label>Provider Type</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    {TYPE_OPTIONS.map(
                      (option) => (
                        <option
                          value={
                            option.value
                          }
                          key={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <FormField
                  label="API Base URL"
                  name="baseUrl"
                  value={form.baseUrl}
                  onChange={handleChange}
                  placeholder="https://api.example.com"
                  icon={<Globe size={16} />}
                  full
                />

                <FormField
                  label="API Key"
                  name="apiKey"
                  type="password"
                  value={form.apiKey}
                  onChange={handleChange}
                  placeholder="Optional"
                  icon={
                    <KeyRound size={16} />
                  }
                />

                <div className="form-field">
                  <label>HTTP Method</label>

                  <select
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                  >
                    <option value="GET">
                      GET
                    </option>

                    <option value="POST">
                      POST
                    </option>
                  </select>
                </div>

                <FormField
                  label="Priority"
                  name="priority"
                  type="number"
                  value={form.priority}
                  onChange={handleChange}
                  min="1"
                  icon={
                    <Settings2
                      size={16}
                    />
                  }
                />

                <div className="form-field form-full">
                  <label>
                    Custom Headers
                  </label>

                  <textarea
                    name="headers"
                    value={form.headers}
                    onChange={handleChange}
                    placeholder={`{
  "Authorization": "Bearer YOUR_TOKEN"
}`}
                    rows={5}
                  />

                  <small>
                    JSON object. Optional.
                  </small>
                </div>

                <div className="form-field form-full">
                  <label>
                    Query Parameters
                  </label>

                  <textarea
                    name="params"
                    value={form.params}
                    onChange={handleChange}
                    placeholder={`{
  "language": "en-US"
}`}
                    rows={5}
                  />

                  <small>
                    JSON object. Optional.
                  </small>
                </div>

                <label className="enable-option">
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={form.enabled}
                    onChange={handleChange}
                  />

                  <span className="custom-checkbox">
                    {form.enabled && (
                      <Check size={13} />
                    )}
                  </span>

                  <span>
                    <strong>
                      Enable provider
                    </strong>

                    <small>
                      Include this provider
                      in API routing.
                    </small>
                  </span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  <Save size={17} />

                  {editingId
                    ? "Save Changes"
                    : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="provider-stat">
      <div className="provider-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function StatusBadge({ enabled }) {
  return (
    <span
      className={`status-badge ${
        enabled ? "active" : "inactive"
      }`}
    >
      <span />

      {enabled ? "Active" : "Disabled"}
    </span>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  full,
  min,
}) {
  return (
    <div
      className={`form-field ${
        full ? "form-full" : ""
      }`}
    >
      <label>{label}</label>

      <div className="input-wrap">
        {icon}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
        />
      </div>
    </div>
  );
}
