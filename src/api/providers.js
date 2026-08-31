const STORAGE_KEY = "movieverse_api_providers";

const DEFAULT_PROVIDERS = [
  {
    id: "tmdb",
    name: "TMDB",
    type: "metadata",
    enabled: true,
    priority: 1,
  },
  {
    id: "omdb",
    name: "OMDb",
    type: "metadata",
    enabled: true,
    priority: 2,
  },
];

function readProviders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_PROVIDERS;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : DEFAULT_PROVIDERS;
  } catch {
    return DEFAULT_PROVIDERS;
  }
}

function writeProviders(providers) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(providers)
  );
}

export function getProviders() {
  return readProviders().sort(
    (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
  );
}

export function getEnabledProviders() {
  return getProviders().filter(
    (provider) => provider.enabled !== false
  );
}

export function addProvider(provider) {
  const providers = getProviders();

  const newProvider = {
    id:
      provider.id ||
      crypto.randomUUID(),

    name: provider.name || "Unnamed Provider",

    type: provider.type || "metadata",

    baseUrl: provider.baseUrl || "",

    apiKey: provider.apiKey || "",

    headers: provider.headers || {},

    enabled: provider.enabled !== false,

    priority:
      provider.priority ??
      providers.length + 1,

    createdAt:
      new Date().toISOString(),
  };

  const updated = [
    ...providers,
    newProvider,
  ];

  writeProviders(updated);

  return newProvider;
}

export function updateProvider(id, changes) {
  const providers = getProviders();

  const updated = providers.map((provider) =>
    provider.id === id
      ? {
          ...provider,
          ...changes,
          id: provider.id,
        }
      : provider
  );

  writeProviders(updated);

  return updated.find(
    (provider) => provider.id === id
  );
}

export function removeProvider(id) {
  const providers = getProviders();

  const updated = providers.filter(
    (provider) => provider.id !== id
  );

  writeProviders(updated);

  return updated;
}

export function toggleProvider(id) {
  const providers = getProviders();

  const updated = providers.map((provider) =>
    provider.id === id
      ? {
          ...provider,
          enabled: !provider.enabled,
        }
      : provider
  );

  writeProviders(updated);

  return updated;
}

export function resetProviders() {
  writeProviders(DEFAULT_PROVIDERS);

  return DEFAULT_PROVIDERS;
}
