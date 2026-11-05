import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { t } from "../i18n";
export function AccountMenu({
  name,
  email,
  busy,
  onDashboard,
  onSettings,
  onContact,
  onLogout,
}: {
  name: string;
  email: string;
  busy: boolean;
  onDashboard?: () => void;
  onSettings: () => void;
  onContact?: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false),
    root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function focusItem(last = false) {
    requestAnimationFrame(() => {
      const items =
        root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      items?.[last ? items.length - 1 : 0]?.focus();
    });
  }
  return (
    <div
      className="account-menu"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className={"account-menu-trigger " + (open ? "is-open" : "")}
        aria-label={t("account.menu")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="account-dropdown"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            focusItem(e.key === "ArrowUp");
          }
        }}
      >
        <span className="account-avatar">
          <UserRound size={18} />
        </span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div
          className="account-dropdown"
          id="account-dropdown"
          role="menu"
          aria-label={t("account.menu")}
          onKeyDown={(e) => {
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              const items = Array.from(
                e.currentTarget.querySelectorAll<HTMLButtonElement>(
                  '[role="menuitem"]',
                ),
              );
              const current = items.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              items[
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? items.length - 1
                    : (current +
                        (e.key === "ArrowDown" ? 1 : -1) +
                        items.length) %
                      items.length
              ]?.focus();
            }
          }}
        >
          <div className="account-menu-identity" role="presentation">
            <strong>{name}</strong>
            <span>{email}</span>
          </div>
          {onDashboard && (
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDashboard();
              }}
            >
              <LayoutDashboard size={16} />
              {t("account.dashboard")}
            </button>
          )}
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSettings();
            }}
          >
            <Settings size={16} />
            {t("account.settings")}
          </button>
          {onContact && <button role="menuitem" onClick={()=>{setOpen(false);onContact();}}><Settings size={16}/>{t("feedback.title")}</button>}
          <button
            role="menuitem"
            className="account-menu-logout"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} />
            {t("account.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
