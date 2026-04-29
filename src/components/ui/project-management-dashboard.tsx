import React, {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import {
    MoreHorizontal,
    LayoutGrid,
    List,
    Bell,
    Search,
    Moon,
    Sun,
    Laptop,
    Plus,
    Trash2,
    Home,
    BarChart3,
    CalendarDays,
    Settings,
    X,
    Hexagon,
    MessageSquare,
    Star,
    ChevronDown,
    ChevronUp,
    Edit2
} from "lucide-react";

/**
 * ===================================
 * Types & Interfaces
 * ===================================
 */
export type SidebarLink = {
    id: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
    active?: boolean;
};

export type Stat = {
    id: string;
    label: string;
    value: number | string;
};

export type ProjectStatus = "draft" | "published";

export type Project = {
    id: string;
    name: string;
    subtitle?: string;
    date?: string;
    progress?: number;
    status?: ProjectStatus;
    accentColor?: string;
    participants?: string[];
    daysLeft?: number | string;
    bgColorClass?: string;
};

export type Message = {
    id: string;
    name: string;
    avatarUrl: string;
    text: string;
    date: string;
    starred?: boolean;
};

export type SortBy = "manual" | "date" | "name" | "progress";
export type SortDir = "asc" | "desc";
export type ThemeMode = "light" | "dark" | "system";

export type ProjectDashboardProps = {
    title?: string;
    user?: { name?: string; avatarUrl?: string };
    sidebarLinks?: SidebarLink[];
    stats?: Stat[];
    projects: Project[];
    messages?: Message[];
    view?: "grid" | "list";
    defaultView?: "grid" | "list";
    onViewChange?: (view: "grid" | "list") => void;
    searchQuery?: string;
    defaultSearchQuery?: string;
    onSearchQueryChange?: (q: string) => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    messagesOpen?: boolean;
    defaultMessagesOpen?: boolean;
    onMessagesOpenChange?: (open: boolean) => void;
    sortBy?: SortBy;
    defaultSortBy?: SortBy;
    sortDir?: SortDir;
    defaultSortDir?: SortDir;
    onSortChange?: (by: SortBy, dir: SortDir) => void;
    statusFilter?: ProjectStatus | "all";
    defaultStatusFilter?: ProjectStatus | "all";
    onStatusFilterChange?: (status: ProjectStatus | "all") => void;
    pageSize?: number;
    initialPage?: number;
    onPageChange?: (page: number) => void;
    virtualizeList?: boolean;
    estimatedRowHeight?: number;
    onProjectClick?: (projectId: string) => void;
    onProjectAction?: (projectId: string, action: "open" | "edit" | "delete") => void;
    onProjectUpdate?: (project: Project) => void;
    onProjectsReorder?: (orderedIds: string[]) => void;
    allowCreate?: boolean;
    onProjectCreate?: (project: Project) => void;
    generateId?: () => string;
    onMessageStarChange?: (messageId: string, starred: boolean) => void;
    showThemeToggle?: boolean;
    onToggleTheme?: () => void;
    theme?: ThemeMode;
    defaultTheme?: ThemeMode;
    onThemeChange?: (mode: ThemeMode) => void;
    persistKey?: string;
    className?: string;
    loading?: boolean;
    emptyProjectsLabel?: string;
    emptyMessagesLabel?: string;
};

/**
 * ===================================
 * Spacing System
 * ===================================
 */
const spacing = {
    page: {
        header: "px-4 sm:px-6 lg:px-8 py-4",
        sidebar: "px-2 sm:px-3 py-4",
        main: "px-4 sm:px-6 lg:px-8 py-4",
        messages: "px-4 sm:px-6 py-4"
    },
    card: {
        base: "p-4 sm:p-5 lg:p-6",
        compact: "p-3 sm:p-4"
    },
    button: {
        sm: "px-2.5 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-2.5"
    },
    gap: {
        xs: "gap-2",
        sm: "gap-3",
        md: "gap-4",
        lg: "gap-6"
    }
};

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(" ");
};

const parseDateLike = (v?: string): number => {
    if (!v) return 0;
    const ts = Date.parse(v);
    return Number.isNaN(ts) ? 0 : ts;
};

const clamp = (n: number, min: number, max: number) => {
    return Math.min(Math.max(n, min), max);
};

const readLS = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

const writeLS = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
};

/**
 * ===================================
 * Component
 * ===================================
 */
export function ProjectDashboard({
    title = "Dashboard",
    user = {
        name: "Admin",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    sidebarLinks = [],
    stats,
    projects,
    messages = [],
    view,
    defaultView = "grid",
    onViewChange,
    searchQuery,
    defaultSearchQuery = "",
    onSearchQueryChange,
    showSearch = true,
    searchPlaceholder = "Search",
    messagesOpen,
    defaultMessagesOpen = false,
    onMessagesOpenChange,
    sortBy,
    defaultSortBy = "date",
    sortDir,
    defaultSortDir = "desc",
    onSortChange,
    statusFilter,
    defaultStatusFilter = "all",
    onStatusFilterChange,
    pageSize = 9,
    initialPage = 1,
    onPageChange,
    virtualizeList = false,
    estimatedRowHeight = 140,
    onProjectClick,
    onProjectAction,
    onProjectUpdate,
    onProjectsReorder,
    allowCreate = true,
    onProjectCreate,
    generateId,
    onMessageStarChange,
    showThemeToggle = true,
    onToggleTheme,
    theme,
    defaultTheme = "system",
    onThemeChange,
    persistKey,
    className = "",
    loading = false,
    emptyProjectsLabel = "No items match your search.",
    emptyMessagesLabel = "No messages yet.",
}: ProjectDashboardProps) {
    const lsKey = persistKey ? (k: string) => `pd:${persistKey}:${k}` : null;

    // State management
    const [internalView, setInternalView] = useState<"grid" | "list">(
        lsKey ? readLS(lsKey("view"), defaultView) : defaultView
    );
    const viewMode = view ?? internalView;

    const [internalQuery, setInternalQuery] = useState<string>(
        lsKey ? readLS(lsKey("query"), defaultSearchQuery) : defaultSearchQuery
    );
    const query = searchQuery ?? internalQuery;

    const [internalMessagesOpen, setInternalMessagesOpen] = useState<boolean>(
        lsKey ? readLS(lsKey("messagesOpen"), defaultMessagesOpen) : defaultMessagesOpen
    );
    const isMessagesOpen = messagesOpen ?? internalMessagesOpen;

    const [internalSortBy, setInternalSortBy] = useState<SortBy>(
        lsKey ? readLS(lsKey("sortBy"), defaultSortBy) : defaultSortBy
    );
    const [internalSortDir, setInternalSortDir] = useState<SortDir>(
        lsKey ? readLS(lsKey("sortDir"), defaultSortDir) : defaultSortDir
    );
    const activeSortBy = sortBy ?? internalSortBy;
    const activeSortDir = sortDir ?? internalSortDir;

    const [internalStatusFilter, setInternalStatusFilter] = useState<ProjectStatus | "all">(
        lsKey ? readLS(lsKey("statusFilter"), defaultStatusFilter) : defaultStatusFilter
    );
    const activeStatusFilter = statusFilter ?? internalStatusFilter;

    const [page, setPage] = useState<number>(
        lsKey ? readLS(lsKey("page"), initialPage) : initialPage
    );

    const [localProjects, setLocalProjects] = useState<Project[]>(projects);

    useEffect(() => {
        if (onProjectUpdate || onProjectsReorder) return;
        setLocalProjects(projects);
    }, [projects, onProjectUpdate, onProjectsReorder]);

    const dataProjects = onProjectUpdate || onProjectsReorder ? projects : localProjects;

    const searchInputId = useId();
    const statusSelectId = useId();

    // Compute stats
    const computedStats: Stat[] = useMemo(() => {
        if (stats) return stats;
        const total = dataProjects.length;
        const byStatus = dataProjects.reduce(
            (acc, p) => {
                const s = p.status || "draft";
                if (s in acc) acc[s as ProjectStatus]++;
                return acc;
            },
            { draft: 0, published: 0 } as Record<ProjectStatus, number>
        );
        return [
            { id: "draft", label: "Draft", value: byStatus.draft },
            { id: "published", label: "Published", value: byStatus.published },
            { id: "total", label: "Total", value: total },
        ];
    }, [stats, dataProjects]);

    const orderMap = useMemo(() => {
        const map = new Map<string, number>();
        dataProjects.forEach((p, i) => map.set(p.id, i));
        return map;
    }, [dataProjects]);

    const preparedProjects = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = dataProjects.slice();

        if (activeStatusFilter !== "all") {
            list = list.filter((p) => (p.status ?? "draft") === activeStatusFilter);
        }
        if (q) {
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    (p.subtitle?.toLowerCase().includes(q) ?? false)
            );
        }

        list.sort((a, b) => {
            let cmp = 0;
            switch (activeSortBy) {
                case "manual":
                    cmp = (orderMap.get(a.id)! - orderMap.get(b.id)!);
                    break;
                case "date":
                    cmp = parseDateLike(a.date) - parseDateLike(b.date);
                    break;
                case "name":
                    cmp = a.name.localeCompare(b.name);
                    break;
                case "progress":
                    cmp = (a.progress ?? 0) - (b.progress ?? 0);
                    break;
            }
            return activeSortBy === "manual" ? cmp : activeSortDir === "asc" ? cmp : -cmp;
        });

        return list;
    }, [dataProjects, query, activeSortBy, activeSortDir, activeStatusFilter, orderMap]);

    const totalPages = virtualizeList ? 1 : Math.max(1, Math.ceil(preparedProjects.length / pageSize));
    const currentPage = virtualizeList ? 1 : clamp(page, 1, totalPages);
    const pagedProjects = useMemo(() => {
        if (virtualizeList) return preparedProjects;
        const start = (currentPage - 1) * pageSize;
        return preparedProjects.slice(start, start + pageSize);
    }, [preparedProjects, currentPage, pageSize, virtualizeList]);

    useEffect(() => {
        if (!virtualizeList) setPage(1);
    }, [query, activeStatusFilter, activeSortBy, activeSortDir, pageSize, virtualizeList]);

    // Theme
    const [internalTheme, setInternalTheme] = useState<ThemeMode>(() => {
        if (theme) return theme;
        if (lsKey) return readLS(lsKey("theme"), "system");
        return defaultTheme;
    });
    const activeTheme = theme ?? internalTheme;

    const applyTheme = useCallback((mode: ThemeMode) => {
        const root = document.documentElement;
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
        const isDark = mode === "dark" || (mode === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
    }, []);

    useEffect(() => {
        applyTheme(activeTheme);
        if (lsKey) writeLS(lsKey("theme"), activeTheme);
    }, [activeTheme, applyTheme, lsKey]);

    const toggleTheme = () => {
        if (onToggleTheme) return onToggleTheme();
        const next: ThemeMode =
            activeTheme === "dark" ? "light" : activeTheme === "light" ? "system" : "dark";
        if (theme === undefined) setInternalTheme(next);
        onThemeChange?.(next);
    };

    // Local state for editing and creation
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<Project | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [createDraft, setCreateDraft] = useState<Project>({
        id: "",
        name: "",
        subtitle: "",
        date: "",
        progress: 0,
        status: "draft",
        accentColor: "#FFE500",
        participants: [],
    });
    const [detailProject, setDetailProject] = useState<Project | null>(null);
    const [dragId, setDragId] = useState<string | null>(null);
    const [reorderMode, setReorderMode] = useState(false);
    const [liveMsg, setLiveMsg] = useState("");

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const messagesPanelRef = useRef<HTMLDivElement | null>(null);
    const liveRef = useRef<HTMLDivElement | null>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const onScroll = useCallback(() => {
        const t = scrollRef.current?.scrollTop ?? 0;
        setScrollTop(t);
    }, []);

    useEffect(() => {
        if (!virtualizeList) return;
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [virtualizeList, onScroll]);

    const viewportH = scrollRef.current?.clientHeight ?? 0;
    const itemH = estimatedRowHeight;
    const overscan = 3;
    const totalCount = pagedProjects.length;
    const startIndex = virtualizeList && viewMode === "list"
        ? Math.max(0, Math.floor(scrollTop / itemH) - overscan) : 0;
    const endIndex = virtualizeList && viewMode === "list"
        ? Math.min(totalCount, Math.ceil((scrollTop + viewportH) / itemH) + overscan)
        : totalCount;
    const before = startIndex * itemH;
    const after = Math.max(0, (totalCount - endIndex) * itemH);
    const visibleProjects = virtualizeList && viewMode === "list"
        ? pagedProjects.slice(startIndex, endIndex)
        : pagedProjects;

    // Persistence
    useEffect(() => { if (lsKey) writeLS(lsKey("view"), viewMode); }, [lsKey, viewMode]);
    useEffect(() => { if (lsKey) writeLS(lsKey("query"), query); }, [lsKey, query]);
    useEffect(() => { if (lsKey) writeLS(lsKey("messagesOpen"), isMessagesOpen); }, [lsKey, isMessagesOpen]);
    useEffect(() => { if (lsKey) { writeLS(lsKey("sortBy"), activeSortBy); writeLS(lsKey("sortDir"), activeSortDir); } }, [lsKey, activeSortBy, activeSortDir]);
    useEffect(() => { if (lsKey) writeLS(lsKey("statusFilter"), activeStatusFilter); }, [lsKey, activeStatusFilter]);
    useEffect(() => { if (lsKey && !virtualizeList) writeLS(lsKey("page"), currentPage); }, [lsKey, currentPage, virtualizeList]);

    // Handlers
    const startEdit = (p: Project) => {
        setEditingId(p.id);
        setEditDraft({ ...p });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft(null);
    };

    const saveEdit = () => {
        if (!editDraft) return;
        if (onProjectUpdate) {
            onProjectUpdate(editDraft);
        } else {
            setLocalProjects((arr) => arr.map((x) => (x.id === editDraft.id ? editDraft : x)));
        }
        setEditingId(null);
        setEditDraft(null);
    };

    const mkId = () =>
        generateId?.() ??
        Math.random().toString(36).slice(2, 8) + "-" + Date.now().toString(36).slice(-4);

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const id = mkId();
        const proj: Project = { ...createDraft, id };
        if (onProjectCreate) {
            onProjectCreate(proj);
        } else {
            setLocalProjects((arr) => [proj, ...arr]);
        }
        setCreateOpen(false);
        setCreateDraft({
            id: "",
            name: "",
            subtitle: "",
            date: "",
            progress: 0,
            status: "draft",
            accentColor: "#FFE500",
            participants: [],
        });
    };

    const openDetail = (p: Project) => {
        if (onProjectClick) return onProjectClick(p.id);
        setDetailProject(p);
    };

    const handleDragStart = (id: string) => setDragId(id);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const doReorder = (ids: string[]) => {
        if (onProjectsReorder) {
            onProjectsReorder(ids);
        } else {
            setLocalProjects((arr) => {
                const map = new Map(arr.map((p) => [p.id, p]));
                return ids.map((id) => map.get(id)!).filter(Boolean);
            });
        }
    };

    const handleDrop = (targetId: string) => {
        if (!dragId || dragId === targetId) return;
        const ids = preparedProjects.map((p) => p.id);
        const from = ids.indexOf(dragId);
        const to = ids.indexOf(targetId);
        if (from < 0 || to < 0) return;
        ids.splice(to, 0, ids.splice(from, 1)[0]);

        const full = dataProjects.map((p) => p.id);
        const reordered = reorderWithinFull(full, ids);
        doReorder(reordered);
        setDragId(null);
        setLiveMsg(`Moved item to position ${to + 1}.`);
    };

    function reorderWithinFull(fullIds: string[], visibleIds: string[]) {
        const setVisible = new Set(visibleIds);
        const remaining = fullIds.filter((id) => !setVisible.has(id));
        return [...visibleIds, ...remaining];
    }

    const canReorder = activeSortBy === "manual" && !query && activeStatusFilter === "all" && viewMode === "list";

    const getNavIcon = (id?: string) => {
        switch ((id || "").toLowerCase()) {
            case "home": return <Home className="w-5 h-5" />;
            case "charts":
            case "analytics": return <BarChart3 className="w-5 h-5" />;
            case "calendar": return <CalendarDays className="w-5 h-5" />;
            case "settings":
            case "preferences": return <Settings className="w-5 h-5" />;
            default: return <Hexagon className="w-5 h-5" />;
        }
    };

    const toggleStar = (m: Message) => {
        if (onMessageStarChange) {
            onMessageStarChange(m.id, !m.starred);
        }
    };

    return (
        <div className={cx(
            "flex flex-col h-screen min-h-0 bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface transition-colors duration-200",
            className
        )}>
            {/* Live region for accessibility */}
            <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef}>
                {liveMsg}
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Main content */}
                <main className={cx(
                    "flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden",
                    spacing.page.main
                )}>
                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 shrink-0">
                        {/* Stats */}
                        <div className={cx("flex flex-wrap items-center", spacing.gap.md)}>
                            {computedStats.map((s, i) => (
                                <div key={s.id} className={cx("flex items-center", spacing.gap.xs)}>
                                    <span className="text-2xl font-bold">
                                        {s.value}
                                    </span>
                                    <span className="text-sm opacity-60">
                                        {s.label}
                                    </span>
                                    {i < computedStats.length - 1 && (
                                        <span className="ml-4 w-px h-8 bg-lathe-ink/20 dark:bg-lathe-surface/20" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Filters and view toggles */}
                        <div className={cx("flex items-center", spacing.gap.xs)}>
                            <label className="sr-only" htmlFor={statusSelectId}>Filter by status</label>
                            <select
                                id={statusSelectId}
                                value={activeStatusFilter}
                                onChange={(e) => {
                                    if (onStatusFilterChange) onStatusFilterChange(e.target.value as ProjectStatus | "all");
                                    else setInternalStatusFilter(e.target.value as ProjectStatus | "all");
                                }}
                                className={cx(
                                    "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20 font-medium text-sm",
                                    "bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface cursor-pointer",
                                    spacing.button.sm
                                )}
                            >
                                <option value="all">Semua</option>
                                <option value="draft">Draft</option>
                                <option value="published">Diterbitkan</option>
                            </select>

                            <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                                <label className="sr-only" htmlFor="sortBy">Sort by</label>
                                <select
                                    id="sortBy"
                                    value={activeSortBy}
                                    onChange={(e) => {
                                        const by = e.target.value as SortBy;
                                        if (onSortChange) onSortChange(by, activeSortDir);
                                        else setInternalSortBy(by);
                                    }}
                                    className={cx(
                                        "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20 font-medium text-sm",
                                        "bg-lathe-surface dark:bg-lathe-ink text-lathe-ink dark:text-lathe-surface cursor-pointer",
                                        spacing.button.sm
                                    )}
                                >
                                    <option value="manual">Manual</option>
                                    <option value="date">Date</option>
                                    <option value="name">Name</option>
                                    <option value="progress">Progress</option>
                                </select>
                                {activeSortBy !== "manual" && (
                                    <button
                                        className={cx(
                                            "p-2 rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                            "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                                        )}
                                        aria-label={`Sort direction: ${activeSortDir}`}
                                        onClick={() => {
                                            const dir = activeSortDir === "asc" ? "desc" : "asc";
                                            if (onSortChange) onSortChange(activeSortBy, dir);
                                            else setInternalSortDir(dir);
                                        }}
                                    >
                                        {activeSortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>

                            <div className="inline-flex rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20">
                                <button
                                    onClick={() => {
                                        if (onViewChange) onViewChange("list");
                                        else setInternalView("list");
                                    }}
                                    className={cx(
                                        "p-2 rounded-l-lg transition-colors border-r border-lathe-ink/20 dark:border-lathe-surface/20",
                                        viewMode === "list"
                                            ? "bg-lathe-ink text-lathe-surface dark:bg-lathe-surface dark:text-lathe-ink"
                                            : "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10"
                                    )}
                                    title="List view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (onViewChange) onViewChange("grid");
                                        else setInternalView("grid");
                                    }}
                                    className={cx(
                                        "p-2 rounded-r-lg transition-colors",
                                        viewMode === "grid"
                                            ? "bg-lathe-ink text-lathe-surface dark:bg-lathe-surface dark:text-lathe-ink"
                                            : "bg-transparent hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10"
                                    )}
                                    title="Grid view"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Projects */}
                    <section
                        aria-label="Projects"
                        ref={scrollRef}
                        className={cx(
                            "flex-1 overflow-y-auto h-full",
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max"
                                : cx("flex flex-col pb-4", spacing.gap.sm)
                        )}
                        style={virtualizeList && viewMode === "list" ? { position: "relative" } : undefined}
                    >
                        {loading && (
                            <div className="col-span-full">
                                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                                        <div key={i} className="h-44 rounded-xl bg-lathe-ink/10 dark:bg-lathe-surface/10" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {virtualizeList && viewMode === "list" && !loading && (
                            <div style={{ height: before, minHeight: before }} aria-hidden="true" />
                        )}

                        {!loading && visibleProjects.map((p) => {
                            const accent = p.accentColor || "#FFE500";
                            const isEditing = editingId === p.id;

                            return (
                                <article
                                    key={p.id}
                                    draggable={canReorder}
                                    onDragStart={() => canReorder && handleDragStart(p.id)}
                                    onDragOver={canReorder ? handleDragOver : undefined}
                                    onDrop={() => canReorder && handleDrop(p.id)}
                                    className={cx(
                                        "group rounded-xl transition-all",
                                        "ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                        p.bgColorClass || "bg-white dark:bg-lathe-ink/50",
                                        viewMode === "list"
                                            ? cx("flex items-center", spacing.card.compact, spacing.gap.md)
                                            : cx("flex flex-col h-full", spacing.card.base),
                                        "hover:shadow-md hover:ring-lathe-ink/40 dark:hover:ring-lathe-surface/40",
                                        canReorder && "cursor-grab active:cursor-grabbing",
                                        reorderMode && "ring-2 ring-lathe-yellow"
                                    )}
                                    style={virtualizeList && viewMode === "list" ? { height: estimatedRowHeight } : undefined}
                                    tabIndex={reorderMode && viewMode === "list" ? 0 : -1}
                                >
                                    {/* Card header */}
                                    <div className={cx(
                                        "flex items-start justify-between shrink-0",
                                        viewMode === "list" ? "w-full" : ""
                                    )}>
                                        <span className="text-xs opacity-60 font-medium">
                                            {p.date}
                                        </span>

                                        <div className={cx("flex items-center", spacing.gap.xs, "opacity-0 group-hover:opacity-100 transition-opacity")}>
                                            <button
                                                className="p-1.5 rounded-md hover:bg-lathe-ink/10 dark:hover:bg-lathe-surface/10 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onProjectAction) onProjectAction(p.id, "edit");
                                                    else startEdit(p);
                                                }}
                                                title="Edit"
                                                disabled={reorderMode}
                                            >
                                                <Edit2 className="w-4 h-4 opacity-60" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-md hover:bg-lathe-ink/10 dark:hover:bg-lathe-surface/10 transition-colors text-red-600 dark:text-red-400"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onProjectAction) onProjectAction(p.id, "delete");
                                                    else setLocalProjects((arr) => arr.filter((x) => x.id !== p.id));
                                                }}
                                                title="Delete"
                                                disabled={reorderMode}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-md hover:bg-lathe-ink/10 dark:hover:bg-lathe-surface/10 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onProjectAction) onProjectAction(p.id, "open");
                                                    else openDetail(p);
                                                }}
                                                title="More options"
                                                disabled={reorderMode}
                                            >
                                                <MoreHorizontal className="w-4 h-4 opacity-80" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    {!isEditing ? (
                                        <div className={cx(viewMode === "list" ? "flex-1 min-w-0" : "flex-1 mt-3")}>
                                            <button
                                                className="text-left w-full focus:outline-none"
                                                onClick={() => openDetail(p)}
                                                disabled={reorderMode}
                                            >
                                                <p className="font-bold text-base truncate">
                                                    {p.name}
                                                </p>
                                                {p.subtitle && (
                                                    <p className="text-sm opacity-60 truncate mt-0.5">
                                                        {p.subtitle}
                                                    </p>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            className={cx(
                                                "mt-3 grid gap-2",
                                                viewMode === "list" ? "w-full grid-cols-2" : "grid-cols-1"
                                            )}
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                saveEdit();
                                            }}
                                        >
                                            <input
                                                className={cx(
                                                    "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                                    "bg-transparent text-sm",
                                                    spacing.button.sm
                                                )}
                                                value={editDraft?.name ?? ""}
                                                onChange={(e) => setEditDraft((d) => ({ ...(d as Project), name: e.target.value }))}
                                                placeholder="Project name"
                                                required
                                            />
                                            <input
                                                className={cx(
                                                    "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                                    "bg-transparent text-sm",
                                                    spacing.button.sm
                                                )}
                                                value={editDraft?.subtitle ?? ""}
                                                onChange={(e) => setEditDraft((d) => ({ ...(d as Project), subtitle: e.target.value }))}
                                                placeholder="Subtitle"
                                            />
                                            <div className={cx("col-span-full flex items-center mt-2", spacing.gap.xs)}>
                                                <button type="submit" className={cx(
                                                    "rounded-lg lathe-signal text-lathe-ink font-bold hover:brightness-105",
                                                    spacing.button.sm
                                                )}>
                                                    Save
                                                </button>
                                                <button type="button" onClick={cancelEdit} className={cx(
                                                    "rounded-lg ring-1 ring-lathe-ink/40 dark:ring-lathe-surface/40 font-medium",
                                                    spacing.button.sm
                                                )}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Footer */}
                                    {!isEditing && (
                                        <div className="shrink-0 mt-4">
                                            <div className={cx(
                                                "flex items-center justify-between pt-3 border-t border-lathe-ink/10 dark:border-lathe-surface/10",
                                                viewMode === "list" ? "w-full" : ""
                                            )}>
                                                <div className="flex -space-x-2">
                                                    {(p.participants ?? []).slice(0, 3).map((url, i) => (
                                                        <img
                                                            key={i}
                                                            src={url}
                                                            alt=""
                                                            className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-lathe-ink object-cover"
                                                        />
                                                    ))}
                                                    <button
                                                        className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-lathe-surface dark:bg-lathe-ink ring-2 ring-white dark:ring-lathe-ink border border-lathe-ink/20 dark:border-lathe-surface/20 transition-colors"
                                                        title="Add participant"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startEdit(p);
                                                        }}
                                                        disabled={reorderMode}
                                                    >
                                                        <Plus className="w-3 h-3 opacity-60" />
                                                    </button>
                                                </div>

                                                <div className={cx("flex items-center truncate", spacing.gap.xs)}>
                                                    {p.status && (
                                                        <span className={cx(
                                                            "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ring-1",
                                                            "ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                                            "bg-white/50 dark:bg-lathe-surface/5"
                                                        )}>
                                                            {p.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                        {virtualizeList && viewMode === "list" && !loading && (
                            <div style={{ height: after, minHeight: after }} aria-hidden="true" />
                        )}

                        {!loading && visibleProjects.length === 0 && (
                            <div className="col-span-full text-center py-12 opacity-60 font-medium">
                                {emptyProjectsLabel}
                            </div>
                        )}
                    </section>

                    {/* Pagination */}
                    {!loading && !virtualizeList && preparedProjects.length > pageSize && (
                        <div className={cx(
                            "flex shrink-0 items-center justify-between mt-4 border-t border-lathe-ink/10 dark:border-lathe-surface/10 pt-4",
                            "text-sm font-medium opacity-80"
                        )}>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className={cx("inline-flex items-center", spacing.gap.xs)}>
                                <button
                                    className={cx(
                                        "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                        "bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
                                        "hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors",
                                        spacing.button.sm
                                    )}
                                    onClick={() => {
                                        const p = currentPage - 1;
                                        setPage(p);
                                        if (onPageChange) onPageChange(p);
                                    }}
                                    disabled={currentPage <= 1}
                                >
                                    Prev
                                </button>
                                <button
                                    className={cx(
                                        "rounded-lg ring-1 ring-lathe-ink/20 dark:ring-lathe-surface/20",
                                        "bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
                                        "hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors",
                                        spacing.button.sm
                                    )}
                                    onClick={() => {
                                        const p = currentPage + 1;
                                        setPage(p);
                                        if (onPageChange) onPageChange(p);
                                    }}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Messages Panel */}
                <aside
                    ref={messagesPanelRef}
                    className={cx(
                        "fixed md:relative inset-y-0 right-0 z-40 w-80 md:w-96",
                        "bg-white dark:bg-lathe-ink border-l border-lathe-ink/10 dark:border-lathe-surface/10",
                        "transform transition-transform duration-300 md:transform-none flex flex-col min-h-0",
                        isMessagesOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
                        "md:flex",
                        messages.length === 0 ? "hidden md:hidden" : ""
                    )}
                    aria-label="Messages"
                >
                    <div className={cx(
                        "flex items-center justify-between border-b border-lathe-ink/10 dark:border-lathe-surface/10 shrink-0",
                        spacing.page.messages
                    )}>
                        <p className="font-bold">Recent Messages</p>
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10 transition-colors"
                            onClick={() => {
                                if (onMessagesOpenChange) onMessagesOpenChange(false);
                                else setInternalMessagesOpen(false);
                            }}
                        >
                            <X className="w-5 h-5 opacity-60" />
                        </button>
                    </div>

                    <div className={cx(
                        "overflow-y-auto flex-1",
                        spacing.page.messages,
                        "space-y-3"
                    )}>
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={cx(
                                    "flex items-start rounded-lg",
                                    "ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10",
                                    "bg-lathe-surface dark:bg-lathe-ink",
                                    spacing.card.compact,
                                    spacing.gap.sm
                                )}
                            >
                                <img
                                    src={m.avatarUrl}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-lathe-ink/20 dark:border-lathe-surface/20"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="font-bold text-sm">
                                            {m.name}
                                        </div>
                                        <button
                                            onClick={() => toggleStar(m)}
                                            className="p-1 focus:outline-none"
                                        >
                                            <Star
                                                className={cx(
                                                    "w-4 h-4 transition-colors",
                                                    m.starred
                                                        ? "text-lathe-yellow fill-lathe-yellow"
                                                        : "opacity-30 hover:opacity-60"
                                                )}
                                            />
                                        </button>
                                    </div>
                                    <p className="text-sm opacity-80 mt-1">
                                        {m.text}
                                    </p>
                                    <p className="text-xs opacity-50 font-medium mt-2">
                                        {m.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div >
        </div >
    );
}

export default ProjectDashboard;
