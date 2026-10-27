"use client";

import { useId, useState, type FormEvent } from "react";
import {
  AuiConfig,
  AuiProvider,
  Suggestions,
  ThreadListPrimitive,
  ThreadListItemPrimitive,
  ThreadListItemMorePrimitive,
  useAui,
  useAuiState,
  type AssistantRuntime,
} from "@assistant-ui/react";
import {
  MessageSquare,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Search,
  SquarePen,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Thread } from "@/components/zh-ui/thread.aui";
import { MapWorkspace } from "@/components/map/map-workspace";
import { WeatherDashboard } from "@/components/weather/weather-dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/zh-ui/dialog";

type WorkspaceProps = { runtime: AssistantRuntime; storageError: boolean };

function ThreadWithSuggestions() {
  const aui = useAui();
  const config = AuiConfig({
    suggestions: Suggestions([
      {
        title: "现在东京",
        label: "天气怎么样？",
        prompt: "东京现在的天气怎么样？",
      },
      {
        title: "讲一个有趣的小知识",
        label: "什么主题都可以",
        prompt: "给我讲一个关于太空的有趣小知识。",
      },
    ]),
  });
  return (
    <AuiProvider extends={aui} config={config}>
      <Thread />
    </AuiProvider>
  );
}

function FloatingChat() {
  const [openedFor, setOpenedFor] = useState<string | null>(null);
  const [closedFor, setClosedFor] = useState<string | null>(null);
  const count = useAuiState((s) => s.thread.messages.length);
  const threadId = useAuiState((s) => s.threads.mainThreadId);
  const title = useAuiState((s) => s.threadListItem.title) || "与枫松客聊聊";
  const context = `${threadId}:${count}`;
  const expanded =
    openedFor === context || (count > 0 && closedFor !== context);
  function setExpanded(open: boolean) {
    setOpenedFor(open ? context : null);
    setClosedFor(open ? null : context);
  }
  return (
    <section
      className={`weather-chat-dock ${expanded ? "is-expanded" : ""}`}
      aria-label="景区聊天助手"
    >
      {expanded ? (
        <div className="weather-chat-heading">
          <MessageSquare size={14} />
          <span>{title}</span>
          <button
            className="history-icon-button"
            onClick={() => setExpanded(false)}
            aria-label="收起聊天窗口"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      ) : (
        <button
          className="weather-chat-expand"
          onClick={() => setExpanded(true)}
          aria-label="展开聊天窗口"
          title="展开聊天窗口"
        >
          <ChevronUp size={15} />
        </button>
      )}
      <div className="weather-chat-thread">
        <ThreadWithSuggestions />
      </div>
    </section>
  );
}

function HistoryItem({
  runtime,
  query,
  onSelect,
}: {
  runtime: AssistantRuntime;
  query: string;
  onSelect: () => void;
}) {
  const item = useAuiState((s) => s.threadListItem);
  const title = item.title || "新对话";
  const [action, setAction] = useState<"rename" | "delete">("rename");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();
  if (query && !title.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    return null;
  function openAction(next: "rename" | "delete") {
    setDraft(title);
    setError("");
    setAction(next);
    setDialogOpen(true);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || (action === "rename" && !draft.trim())) return;
    setBusy(true);
    setError("");
    try {
      const target = runtime.threads.getItemById(item.id);
      if (action === "rename") await target.rename(draft.trim());
      else await target.delete();
      setDialogOpen(false);
    } catch {
      setError("操作未完成，请重试。");
    } finally {
      setBusy(false);
    }
  }
  return (
    <ThreadListItemPrimitive.Root className="history-item">
      <ThreadListItemPrimitive.Trigger
        className="history-item-trigger"
        onClick={onSelect}
        title={title}
      >
        <span className="history-item-title">{title}</span>
        {item.isRunning && (
          <span
            className="history-running"
            role="status"
            aria-label="正在回复"
          />
        )}
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemMorePrimitive.Root>
        <ThreadListItemMorePrimitive.Trigger
          className="history-item-more"
          aria-label={`更多操作：${title}`}
        >
          <MoreHorizontal size={16} />
        </ThreadListItemMorePrimitive.Trigger>
        <ThreadListItemMorePrimitive.Content
          className="history-menu"
          align="start"
          sideOffset={6}
        >
          <ThreadListItemMorePrimitive.Item
            className="history-menu-item"
            onSelect={() => openAction("rename")}
          >
            <Pencil size={14} />
            重命名
          </ThreadListItemMorePrimitive.Item>
          <ThreadListItemMorePrimitive.Item
            className="history-menu-item history-danger"
            onSelect={() => openAction("delete")}
          >
            <Trash2 size={14} />
            删除对话
          </ThreadListItemMorePrimitive.Item>
        </ThreadListItemMorePrimitive.Content>
      </ThreadListItemMorePrimitive.Root>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && !busy) setDialogOpen(false);
        }}
      >
        <DialogContent>
          <form onSubmit={submit} className="history-dialog-form">
            <DialogTitle>
              {action === "rename" ? "重命名对话" : "删除这段对话？"}
            </DialogTitle>
            <DialogDescription>
              {action === "rename"
                ? "为这段对话起一个便于查找的名字。"
                : `将永久删除「${title}」及其中的聊天记录，删除后无法恢复。`}
            </DialogDescription>
            {action === "rename" && (
              <div className="history-name-field">
                <label htmlFor={inputId}>对话名称</label>
                <input
                  id={inputId}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>
            )}
            {error && (
              <p className="history-action-error" role="alert">
                {error}
              </p>
            )}
            <DialogFooter>
              <button
                type="button"
                className="history-dialog-button"
                disabled={busy}
                onClick={() => setDialogOpen(false)}
              >
                取消
              </button>
              <button
                type="submit"
                className={`history-dialog-button ${action === "delete" ? "is-danger" : "is-primary"}`}
                disabled={busy || (action === "rename" && !draft.trim())}
              >
                {busy ? "处理中…" : action === "rename" ? "保存" : "确认删除"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ThreadListItemPrimitive.Root>
  );
}

function Sidebar({
  runtime,
  onClose,
  onSelect = onClose,
}: {
  runtime: AssistantRuntime;
  onClose: () => void;
  onSelect?: () => void;
}) {
  const [query, setQuery] = useState("");
  const items = useAuiState((s) => s.threads.threadItems);
  const loading = useAuiState((s) => s.threads.isLoading);
  const loadError = useAuiState((s) => s.threads.loadError);
  const savedItems = items.filter((item) => item.status === "regular");
  const hasMatches = savedItems.some((item) =>
    (item.title || "新对话")
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  return (
    <div className="history-sidebar-content">
      <div className="history-brand">
        <MessageSquare size={21} strokeWidth={1.7} />
        <strong>枫松客</strong>
        <button
          className="history-icon-button"
          onClick={onClose}
          aria-label="收起历史侧栏"
          title="收起历史侧栏"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
      <ThreadListPrimitive.Root className="history-list-root">
        <ThreadListPrimitive.New className="history-new" onClick={onSelect}>
          <SquarePen size={17} />
          <span>新建对话</span>
        </ThreadListPrimitive.New>
        <div className="history-search">
          <Search size={15} />
          <input
            aria-label="搜索历史对话"
            placeholder="搜索对话"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="history-clear-search"
              onClick={() => setQuery("")}
              aria-label="清空搜索"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="history-section-label">历史对话</div>
        <nav className="history-items" aria-label="历史对话">
          <ThreadListPrimitive.Items>
            {() => (
              <HistoryItem
                runtime={runtime}
                query={query.trim()}
                onSelect={onSelect}
              />
            )}
          </ThreadListPrimitive.Items>
          {loading && (
            <p className="history-empty" role="status">
              正在加载历史记录…
            </p>
          )}
          {!loading && !!loadError && (
            <div className="history-empty" role="alert">
              历史记录加载失败。
              <button onClick={() => void runtime.threads.reload()}>
                重新加载
              </button>
            </div>
          )}
          {!loading && !loadError && !hasMatches && (
            <div className="history-empty">
              <MessageSquare size={22} strokeWidth={1.3} />
              <p>
                {savedItems.length ? "没有找到匹配的对话" : "还没有历史对话"}
              </p>
              <span>
                {items.length
                  ? "试试其他关键词"
                  : "发送第一条消息后，会自动保存在这里"}
              </span>
            </div>
          )}
        </nav>
      </ThreadListPrimitive.Root>
      <div className="history-local-note">
        <span className="history-local-dot" />
        记录保存在当前浏览器
      </div>
    </div>
  );
}

export function HistoryWorkspace({ runtime, storageError }: WorkspaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div
      className={`history-workspace ${sidebarOpen ? "" : "sidebar-collapsed"}`}
    >
      <aside
        className="history-sidebar"
        aria-label="聊天侧栏"
        inert={!sidebarOpen}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar
          runtime={runtime}
          onClose={() => setSidebarOpen(false)}
          onSelect={() => {}}
        />
      </aside>
      <main className="history-main">
        <header className="history-header">
          <button
            className="history-mobile-toggle history-icon-button"
            onClick={() => setMobileOpen(true)}
            aria-label="打开历史侧栏"
          >
            <PanelLeftOpen size={19} />
          </button>
          {!sidebarOpen && (
            <button
              className="history-desktop-toggle history-icon-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="展开历史侧栏"
            >
              <PanelLeftOpen size={19} />
            </button>
          )}
          <span className="history-current-title">栖霞山 · 地图伴游</span>
          <WeatherDashboard />
          <div className="history-header-dock" id="qixia-location-dock" />
        </header>
        {storageError && (
          <div className="history-storage-error" role="alert">
            浏览器无法保存聊天记录，请检查存储空间或浏览器权限。
          </div>
        )}
        <MapWorkspace />
        <FloatingChat />
      </main>
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="history-mobile-panel" showCloseButton={false}>
          <DialogTitle className="sr-only">历史聊天记录</DialogTitle>
          <DialogDescription className="sr-only">
            新建、查找或切换历史对话。
          </DialogDescription>
          <Sidebar runtime={runtime} onClose={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
