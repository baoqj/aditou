import { AdminDirectory } from "./components/AdminDirectory";
import { GoogleIcon } from "./components/GoogleIcon";
import { OrganizationSettings } from "./components/OrganizationSettings";
import { EmailActions } from "./components/EmailActions";
import { FullscreenButton } from "./components/FullscreenButton";
import { SKILLS, questionSkill } from "./skills";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Search,
  LogOut,
  Users,
  BarChart3,
  Mic,
  Play,
  Square,
  Volume2,
  ClipboardList,
  Radio,
  Monitor,
  Settings,
  ShieldCheck,
  Clock,
  ChevronRight,
  X,
  RefreshCw,
  Download,
  PenLine,
  Home,
  Heart,
  Send,
  Pause,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api, Data } from "./api";
import "./style.css";
import i18n, { t, dateLocale, formatDate } from "./i18n";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { PublicHeader } from "./components/PublicHeader";
import { MarketingPage } from "./components/MarketingPage";
import { authDestination } from "./routing";
import { AccountMenu } from "./components/AccountMenu";
import { QuestionPreparation } from "./components/QuestionPreparation";
import { QuestionAudio } from "./components/QuestionAudio";
import {
  AssessmentPlayer,
  AssessmentHistory,
} from "./components/AssessmentPlayer";
let draftAccount = "";
const roles: Data = {
  admin: "Administration",
  teacher: "Espace enseignant",
  student: "Espace élève",
  parent: "Espace parent",
};
const statusText: Data = {
  correct: "Validé",
  incorrect: "À revoir",
  pending_manual: "À confirmer",
  partial: "Partiellement validé",
  submitted: "Réponse reçue",
  published: "Publié",
  draft: "Brouillon",
  retired: "Archivé",
  withdrawn: "Retiré",
};
function Badge({ value }: { value: string }) {
  return (
    <span className={"badge " + value}>{t(statusText[value] || value)}</span>
  );
}
function IconTile({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className={"icon-tile " + color}>{children}</span>;
}
function Empty({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <BookOpen size={34} />
      <h3>{t(title)}</h3>
      <p>{children}</p>
    </div>
  );
}
function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={close}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={t(title)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-head">
          <h2>{t(title)}</h2>
          <button
            className="icon-button"
            aria-label={t("Fermer")}
            onClick={close}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const labelId = React.useId();
  return (
    <label className="field">
      <span id={labelId}>{t(label)}</span>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            "aria-labelledby": labelId,
          })
        : children}
    </label>
  );
}
function App() {
  useTranslation();
  const [user, setUser] = useState<Data | null>(null),
    [loading, setLoading] = useState(true),
    [boot, setBoot] = useState<Data>({
      classes: [],
      assignments: [],
      classrooms: [],
      children: [],
    }),
    [questions, setQuestions] = useState<Data[]>([]),
    [assets, setAssets] = useState<Data[]>([]),
    [attempts, setAttempts] = useState<Data[]>([]),
    [tab, setTab] = useState(
      () => location.pathname.split("/").filter(Boolean).at(-1) || "home",
    ),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [active, setActive] = useState<Data | null>(null),
    [activity, setActivity] = useState<Data | null>(null),
    [roomId, setRoomId] = useState(""),
    [runId, setRunId] = useState(""),
    [modal, setModal] = useState("");
  draftAccount = user?.id || "";
  const staff = user && ["admin", "teacher"].includes(user.role);
  async function refresh() {
    const b = await api("/bootstrap");
    setBoot(b);
    setUser(b.user);
    const [q, a] = await Promise.all([api("/questions"), api("/audio")]);
    setQuestions(q.questions);
    setAssets(a.assets);
    if (b.user.role !== "parent") {
      const h = await api("/attempts");
      setAttempts(h.attempts);
    }
  }
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    api("/auth/me")
      .then(async (b) => {
        setUser(b.user);
        await refresh();
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 6000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  function navigate(t: string) {
    setTab(t);
    setActive(null);
    setRoomId("");
    setRunId("");
    setError("");
    history.replaceState(
      null,
      "",
      t === "home"
        ? "/learn"
        : staff
          ? "/org/main/manage/" + t
          : user?.role === "parent"
            ? "/family"
            : "/learn/" + t,
    );
  }
  if (loading)
    return (
      <div className="loading">
        <BookOpen size={40} />
        <p>{t("Ouverture de ton atelier…")}</p>
      </div>
    );
  if (!user) return <LoginRedirect />;
  const published = questions.filter((q) => q.status === "published");
  const nav = staff
    ? [
        ...(user.role === "admin" ? [["users", "admin.users", Users], ["organizations", "admin.organizations", Home]] : []),
        ["bank", "Banque d’exercices", BookOpen],
        ["roster", "Élèves et classes", Users],
        ["class", "Classe en direct", Radio],
        ["studio", "Studio audio", Mic],
        ["homework", "Devoirs et corrections", ClipboardList],
        ["reports", "Rapports", BarChart3],
      ]
    : user.role === "parent"
      ? [
          ["family", "Mes enfants", Heart],
          ["settings", "Mon compte", Settings],
        ]
      : [
          ["home", "Mes devoirs", ClipboardList],
          ["practice", "M’entraîner", BookOpen],
          ["progress", "Mes progrès", BarChart3],
        ];
  const allowedTabs = staff
    ? ["bank", "roster", "class", "studio", "homework", "reports", "settings", ...(user.role === "admin" ? ["users", "organizations"] : [])]
    : user.role === "parent"
      ? ["family", "settings"]
      : ["home", "practice", "progress", "settings"];
  const currentTab = allowedTabs.includes(tab)
    ? tab
    : staff
      ? "bank"
      : user.role === "parent"
        ? "family"
        : "home";
  const start = (q: Data, context: Data | null = null) => {
    if (context?.context === "assignment") {
      void action(async () => {
        const result = await api("/runs", {
          mode: "homework",
          assignment_id: context.id,
        });
        setRunId(result.run.id);
        setActive(null);
      });
      return;
    }
    setActive(q);
    setActivity(context);
    setError("");
  };
  return (
    <div
      className={
        "app " +
        (user.role === "student" ? "student-app" : "") +
        (user.role === "student" && (runId || active) ? " answering" : "")
      }
    >
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={24} />
          </span>
          <span>{t("brand.name")}</span>
        </a>
        {user.role === "student" && (
          <nav
            className="student-header-nav"
            aria-label={t("Navigation principale")}
          >
            {nav.map(([key, label, Icon]: any) => (
              <button
                key={key}
                title={t(label)}
                aria-label={t(label)}
                className={currentTab === key ? "selected" : ""}
                onClick={() => navigate(key)}
              >
                <Icon size={18} />
                <span>{t(label)}</span>
              </button>
            ))}
          </nav>
        )}
        <div className="header-right">
          <span className="workspace">
            <ShieldCheck size={15} />
            {t(roles[user.role])}
          </span>
          {user.role === "student" && <FullscreenButton />}
          <LanguageSwitcher compact={user.role === "student"} />
          <AccountMenu
            name={user.name}
            email={user.email}
            busy={busy}
            onSettings={() => navigate("settings")}
            onLogout={() =>
              action(async () => {
                await api("/auth/logout", {});
                setUser(null);
                setQuestions([]);
                setAttempts([]);
              })
            }
          />
        </div>
      </header>
      <div className={"app-body " + (staff ? "with-sidebar" : "")}>
        {user.role !== "student" && (
          <nav
            className={staff ? "sidebar" : "student-nav"}
            aria-label={t("Navigation principale")}
          >
            {staff && (
              <div className="side-intro">
                <small>{t("VOTRE ÉTABLISSEMENT")}</small>
                <strong>{t("Atelier Bilingue")}</strong>
                <span>{t("Enseigner, écouter, progresser.")}</span>
              </div>
            )}
            {nav.map(([key, label, Icon]: any) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className={currentTab === key ? "selected" : ""}
              >
                <Icon size={19} />
                {t(label)}
              </button>
            ))}
            {staff && (
              <button
                className={
                  "account-nav " + (currentTab === "settings" ? "selected" : "")
                }
                onClick={() => navigate("settings")}
              >
                <Settings size={19} />
                {t("Mon compte")}
              </button>
            )}
            {staff && (
              <div className="sidebar-note">
                <Headphones size={22} />
                <strong>{t("Le texte d’abord.")}</strong>
                <p>
                  {t(
                    "Votre voix guide la classe. L’audio accompagne l’apprentissage.",
                  )}
                </p>
              </div>
            )}
          </nav>
        )}
        <main className={staff ? "main staff-main" : "main"}>
          {error && (
            <div role="alert" className="alert error">
              <AlertCircle size={18} />
              {t(error)}
              <button
                onClick={() => setError("")}
                aria-label={t("Fermer l’erreur")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {notice && (
            <div role="status" className="alert success">
              <CheckCircle2 size={18} />
              {t(notice)}
            </div>
          )}
          {user.role === "admin" && ["users","organizations"].includes(currentTab) ? <AdminDirectory key={currentTab} kind={currentTab as "users" | "organizations"} selfId={user.id} /> : roomId ? (
            <LiveRoom
              id={roomId}
              staff={!!staff}
              questions={questions}
              onExit={() => {
                setRoomId("");
                refresh();
              }}
              onError={setError}
              onPractice={start}
            />
          ) : runId ? (
            <AssessmentPlayer
              key={runId}
              runId={runId}
              accountKey={user.id}
              renderAnswer={(props) => <QuestionInput {...props} />}
              onBack={() => {
                setRunId("");
                refresh();
              }}
              onSubmitted={refresh}
              onError={setError}
            />
          ) : active ? (
            <Player
              key={active.id + "-" + (activity?.id || "private")}
              question={active}
              assets={assets}
              activity={activity}
              onError={setError}
              onBack={() => {
                setActive(null);
                refresh();
              }}
              onDone={async () => {
                await refresh();
              }}
              onNext={() => {
                const ids =
                  activity?.question_ids || published.map((q) => q.id);
                const idx = ids.indexOf(active.id);
                if (idx < ids.length - 1) {
                  const q = questions.find((q) => q.id === ids[idx + 1]);
                  if (q) setActive(q);
                } else {
                  setActive(null);
                  refresh();
                }
              }}
            />
          ) : (
            <>
              {currentTab === "home" && (
                <>
                  <div className="welcome-row">
                    <div>
                      <div className="eyebrow">
                        {t("UN PETIT PAS CHAQUE JOUR")}
                      </div>
                      <h1>
                        {t("Bonjour,")} {user.name.split(" ")[0]}{" "}
                        <span className="wave">✦</span>
                      </h1>
                      <p>
                        {t(
                          "Prêt pour une nouvelle découverte ? Ton atelier t’attend.",
                        )}
                      </p>
                    </div>
                    <span className="learner-tag">
                      <GraduationCap size={18} />
                      {t("gradeLabel", { grade: boot.learner?.grade })}
                    </span>
                  </div>
                  <AssessmentHistory accountKey={user.id} onOpen={setRunId} />
                  <div className="student-grid">
                    <div>
                      <section className="hero">
                        <div>
                          <span className="hero-tag">
                            <span className="dot" />
                            {t("TON ESPACE D’APPRENTISSAGE")}
                          </span>
                          <h2>
                            {t("De petites découvertes.")}
                            <br />
                            {t("De grands progrès.")}
                          </h2>
                          <p>
                            {t("Des mots, des nombres et des idées.")}
                            <br />
                            {t("Prends ton temps et essaie à ton rythme.")}
                          </p>
                          <button
                            className="btn white"
                            onClick={() => navigate("practice")}
                          >
                            {t("C’est parti")} <ArrowRight size={17} />
                          </button>
                        </div>
                        <div className="hero-illustration" aria-hidden="true">
                          <div className="orbit" />
                          <span className="float-one">Aa</span>
                          <BookOpen size={104} strokeWidth={1.4} />
                          <span className="float-two">1 2 3</span>
                          <span className="spark">✦</span>
                        </div>
                      </section>
                      <div className="section-head">
                        <h2>
                          <ClipboardList size={22} /> {t("Mes devoirs")}
                        </h2>
                        <span className="count">
                          {t("activityCount", {
                            count: boot.assignments.length,
                          })}
                        </span>
                      </div>
                      {boot.assignments.length ? (
                        boot.assignments.map((hw: Data) => (
                          <HomeworkCard
                            key={hw.id}
                            hw={hw}
                            attempts={attempts}
                            onStart={() => {
                              const q =
                                questions.find(
                                  (q) =>
                                    q.id ===
                                    hw.question_ids.find(
                                      (i: string) =>
                                        !attempts.some(
                                          (a) =>
                                            a.question_id === i &&
                                            a.context_id === hw.id,
                                        ),
                                    ),
                                ) ||
                                questions.find(
                                  (q) => q.id === hw.question_ids[0],
                                );
                              if (q) start(q, { ...hw, context: "assignment" });
                            }}
                          />
                        ))
                      ) : (
                        <section className="card">
                          <Empty title={t("Tout est à jour !")}>
                            {t(
                              "Tes prochains devoirs apparaîtront ici. Tu peux déjà explorer les exercices.",
                            )}
                          </Empty>
                        </section>
                      )}
                      <div className="section-head">
                        <h2>
                          <Radio size={22} /> {t("Ma classe")}
                        </h2>
                      </div>
                      {boot.classrooms
                        .filter((c: Data) => c.phase !== "ended")
                        .map((c: Data) => (
                          <section className="card compact" key={c.id}>
                            <IconTile color="green">
                              <Radio />
                            </IconTile>
                            <div className="grow">
                              <h3>{c.title}</h3>
                              <p>
                                {c.code} {t("· Avec ton enseignant")}
                              </p>
                            </div>
                            <button
                              className="btn"
                              onClick={() => setRoomId(c.id)}
                            >
                              {t("Rejoindre")} <ArrowRight size={16} />
                            </button>
                          </section>
                        ))}
                      <JoinClass onJoin={setRoomId} onError={setError} />
                    </div>
                    <aside className="right-column">
                      <section className="card goal-card">
                        <div className="section-head">
                          <h3>{t("Mes découvertes")}</h3>
                          <span>✦</span>
                        </div>
                        <div className="goal-circle">
                          <strong>{attempts.length}</strong>
                          <span>{t("essais enregistrés")}</span>
                        </div>
                        <p>
                          {t("Chaque essai compte.")}
                          <br />
                          {t("Continue à explorer !")}
                        </p>
                        <button
                          className="text-button"
                          onClick={() => navigate("progress")}
                        >
                          {t("Voir mes progrès")} <ChevronRight size={16} />
                        </button>
                      </section>
                      <section className="tip-card">
                        <IconTile color="amber">
                          <Headphones />
                        </IconTile>
                        <h3>{t("Un coup de pouce ?")}</h3>
                        <p>
                          {t(
                            "Écoute la consigne, prends ton temps et demande à un adulte si tu en as besoin.",
                          )}
                        </p>
                        <span className="small">
                          {t("On apprend aussi en essayant.")}
                        </span>
                      </section>
                      <div className="privacy-note">
                        <ShieldCheck size={18} />
                        <span>
                          {t("Tes exercices personnels restent privés.")}
                        </span>
                      </div>
                    </aside>
                  </div>
                </>
              )}
              {currentTab === "practice" && (
                <>
                  <PageTitle
                    eyebrow={t("À TON RYTHME")}
                    title={t("Un monde à explorer")}
                    subtitle={t(
                      "Choisis une activité. Écoute, réfléchis et essaie !",
                    )}
                  />
                  <Catalog
                    questions={published}
                    onSelect={(q, scope) =>
                      start(q, {
                        context: "private",
                        question_ids: (scope || [q]).map((item) => item.id),
                      })
                    }
                    student
                    initialGrade={String(boot.learner?.grade || "")}
                    onStartExam={(qs) =>
                      action(async () => {
                        const result = await api("/runs", {
                          mode: "exam",
                          question_ids: qs.map((q) => q.id),
                        });
                        setRunId(result.run.id);
                      })
                    }
                  />
                  <AssessmentHistory accountKey={user.id} onOpen={setRunId} />
                </>
              )}
              {(currentTab === "progress" || currentTab === "reports") && (
                <>
                  <PageTitle
                    eyebrow={
                      staff
                        ? t("COMPRENDRE LES APPRENTISSAGES")
                        : t("CHAQUE ESSAI COMPTE")
                    }
                    title={
                      staff ? t("Rapports d’apprentissage") : t("Mes progrès")
                    }
                    subtitle={
                      staff
                        ? t(
                            "Uniquement les réponses des classes et des devoirs autorisés.",
                          )
                        : t(
                            "Tes découvertes, tes essais et les prochaines étapes.",
                          )
                    }
                  />
                  <Progress
                    attempts={attempts}
                    staff={!!staff}
                    onRetry={(a) => {
                      const q = questions.find(
                        (q) =>
                          q.id === a.question_id && q.status === "published",
                      );
                      if (q) start(q);
                    }}
                  />
                </>
              )}
              {currentTab === "bank" && (
                <>
                  <PageTitle
                    title={t("Banque d’exercices")}
                    action={
                      <button
                        className="btn"
                        onClick={() => setModal("question")}
                      >
                        <Plus size={18} />
                        {t("action.create")}
                      </button>
                    }
                  />
                  <Catalog
                    questions={questions}
                    onSelect={(q) => {
                      setActivity(q);
                      setModal("editQuestion");
                    }}
                  />
                </>
              )}
              {currentTab === "roster" && (
                <Roster
                  boot={boot}
                  busy={busy}
                  action={action}
                  refresh={refresh}
                  user={user}
                  notify={setNotice}
                />
              )}
              {currentTab === "homework" && (
                <>
                  <PageTitle
                    eyebrow={t("ACCOMPAGNER APRÈS LA CLASSE")}
                    title={t("Devoirs et corrections")}
                    subtitle={t(
                      "Préparez une activité, puis accompagnez chaque élève.",
                    )}
                    action={
                      <button
                        className="btn"
                        onClick={() => setModal("assignment")}
                      >
                        <Plus size={18} />
                        {t("Nouveau devoir")}
                      </button>
                    }
                  />
                  <div className="assignment-grid">
                    {boot.assignments.map((hw: Data) => (
                      <section className="card" key={hw.id}>
                        <div className="section-head">
                          <IconTile>
                            <ClipboardList />
                          </IconTile>
                          <Badge value={hw.status} />
                        </div>
                        <h3>{hw.title}</h3>
                        <p>
                          {
                            boot.classes.find((c: Data) => c.id === hw.class_id)
                              ?.name
                          }
                        </p>
                        <div className="meta">
                          <Clock size={15} />
                          {new Date(hw.due_at).toLocaleDateString(
                            dateLocale(),
                          )}{" "}
                          ·{" "}
                          {t("exerciseItems", {
                            count: hw.question_ids.length,
                          })}
                        </div>
                        <div className="card-bottom">
                          {
                            attempts.filter((a) => a.context_id === hw.id)
                              .length
                          }{" "}
                          {t("réponses enregistrées")}
                        </div>
                      </section>
                    ))}
                  </div>
                  {!boot.assignments.length && (
                    <section className="card">
                      <Empty title={t("Votre premier devoir commence ici")}>
                        {t("Choisissez une classe et des exercices publiés.")}
                      </Empty>
                    </section>
                  )}
                  <div className="section-head">
                    <h2>{t("Réponses à confirmer")}</h2>
                    <span className="count">
                      {
                        attempts.filter((a) => a.status === "pending_manual")
                          .length
                      }
                    </span>
                  </div>
                  <AttemptList
                    attempts={attempts.filter(
                      (a) => a.status === "pending_manual",
                    )}
                    staff
                    onGrade={(a, status, feedback) =>
                      action(async () => {
                        await api("/attempts/" + a.id + "/grade", {
                          status,
                          feedback,
                        });
                        await refresh();
                        setNotice("Évaluation enregistrée.");
                      })
                    }
                  />
                </>
              )}
              {currentTab === "class" && (
                <>
                  <PageTitle
                    eyebrow={t("ENSEIGNER ENSEMBLE")}
                    title={t("Classe en direct")}
                    subtitle={t(
                      "Votre texte, votre voix, le rythme de votre classe.",
                    )}
                    action={
                      <button
                        className="btn"
                        onClick={() => setModal("classroom")}
                      >
                        <Plus size={18} />
                        {t("Préparer une séance")}
                      </button>
                    }
                  />
                  <div className="info-banner">
                    <Mic size={20} />
                    {t(
                      "La lecture par l’enseignant est le mode par défaut. Aucun audio n’est nécessaire pour commencer.",
                    )}
                  </div>
                  <div className="assignment-grid">
                    {boot.classrooms.map((c: Data) => (
                      <section className="card" key={c.id}>
                        <div className="section-head">
                          <IconTile color="green">
                            <Radio />
                          </IconTile>
                          <Badge
                            value={
                              c.phase === "ended"
                                ? t("Terminée")
                                : t("En cours")
                            }
                          />
                        </div>
                        <h3>{c.title}</h3>
                        <p>
                          {
                            boot.classes.find((x: Data) => x.id === c.class_id)
                              ?.name
                          }
                        </p>
                        <div className="class-code">{c.code}</div>
                        <p>
                          {c.question_ids.length} {t("exercices · Ronde")}{" "}
                          {c.round}
                        </p>
                        <button className="btn" onClick={() => setRoomId(c.id)}>
                          {t("Ouvrir la console")} <ArrowRight size={16} />
                        </button>
                      </section>
                    ))}
                  </div>
                  {!boot.classrooms.length && (
                    <section className="card">
                      <Empty title={t("Préparez une première séance")}>
                        {t(
                          "Les élèves inscrits pourront la rejoindre avec leur compte.",
                        )}
                      </Empty>
                    </section>
                  )}
                </>
              )}
              {currentTab === "studio" && (
                <Studio
                  questions={questions}
                  assets={assets}
                  configured={boot.ttsConfigured}
                  refresh={refresh}
                  action={action}
                  busy={busy}
                  onError={setError}
                  notify={setNotice}
                />
              )}
              {currentTab === "family" && (
                <Family
                  boot={boot}
                  refresh={refresh}
                  action={action}
                  notify={setNotice}
                />
              )}
              {currentTab === "settings" && (
                <>
                  <PageTitle
                    eyebrow={t("VOTRE ESPACE")}
                    title={t("Mon compte")}
                    subtitle={t("Gérez vos informations de connexion.")}
                  />
                  <section className="card account-card">
                    <IconTile>
                      <ShieldCheck />
                    </IconTile>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <Badge value={t(roles[user.role])} />
                    {user.role === "teacher" && <OrganizationSettings/>}
                    <h3 className="spaced">{t("Changer mon mot de passe")}</h3>
                    <p><a href="/forgot-password">{t("email.forgotTitle")}</a></p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = new FormData(e.currentTarget);
                        action(async () => {
                          await api("/auth/password", {
                            current: f.get("current"),
                            password: f.get("password"),
                          });
                          setUser(null);
                        });
                      }}
                    >
                      <Field label={t("Mot de passe actuel")}>
                        <input
                          name="current"
                          type="password"
                          required
                          autoComplete="current-password"
                        />
                      </Field>
                      <Field
                        label={t(
                          "Nouveau mot de passe (10 caractères minimum)",
                        )}
                      >
                        <input
                          name="password"
                          type="password"
                          minLength={10}
                          maxLength={128}
                          required
                          autoComplete="new-password"
                        />
                      </Field>
                      <button className="btn" disabled={busy}>
                        {t("Enregistrer et me reconnecter")}
                      </button>
                    </form>
                  </section>
                </>
              )}
            </>
          )}
          <footer>
            {t("Atelier Bilingue")} <span>·</span>{" "}
            {t("Des exercices pour progresser, à son rythme.")}
            <span>·</span>{" "}
            {t("Pratique indépendante, sans affiliation à une école.")}
          </footer>
        </main>
      </div>
      {modal === "question" || modal === "editQuestion" ? (
        <QuestionEditor
          initial={modal === "editQuestion" ? activity : null}
          close={() => setModal("")}
          onSave={(q) =>
            action(async () => {
              await api("/questions", q);
              await refresh();
              setModal("");
              setNotice("Nouvelle version enregistrée.");
            })
          }
          busy={busy}
          error={t(error)}
        />
      ) : null}
      {(modal === "assignment" || modal === "classroom") && (
        <ActivityEditor
          kind={modal}
          classes={boot.classes}
          questions={questions.filter((q) => q.status === "published")}
          close={() => setModal("")}
          busy={busy}
          error={t(error)}
          onSave={(b) =>
            action(async () => {
              const result = await api(
                modal === "assignment" ? "/assignments" : "/classrooms",
                b,
              );
              await refresh();
              setModal("");
              setNotice("Activité créée.");
              if (modal === "classroom") setRoomId(result.id);
            })
          }
        />
      )}
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{t(eyebrow)}</div>}
        <h1>{t(title)}</h1>
        {subtitle && <p>{t(subtitle)}</p>}
      </div>
      {action}
    </div>
  );
}
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: React.ReactNode;
}) {
  return (
    <div className="stat">
      <IconTile>{icon}</IconTile>
      <div>
        <strong>{value}</strong>
        <span>{t(label)}</span>
      </div>
    </div>
  );
}
function Auth({
  mode,
  onLogin,
}: {
  mode: "login" | "signup";
  onLogin: (user: Data) => Promise<void>;
}) {
  const register = mode === "signup";
  const [verificationEmail, setVerificationEmail] = useState("");
  const [googleRole, setGoogleRole] = useState(new URLSearchParams(location.search).get("role") === "teacher" ? "teacher" : "student");
  const googleError = new URLSearchParams(location.search).get("error");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (verificationEmail) return <EmailActions mode="check-email" email={verificationEmail}/>;
  return (
    <>
      <PublicHeader />
      <div className="auth-page public-auth-page">
        <div className="auth-art">
          <a className="auth-brand" href="/">
            <BookOpen size={32} /> {t("Atelier Bilingue")}
          </a>
          <div className="auth-message">
            <span className="hero-tag">
              {t("FRANÇAIS & ENGLISH · 1re — 4e ANNÉE")}
            </span>
            <h1>
              {t("La confiance")}
              <br />{" "}
              {t("grandit avec")}
              <br />{" "}
              <em>{t("chaque essai.")}</em>
            </h1>
            <p>
              {t("Un atelier pour découvrir, écouter et apprendre.")}
              <br />{" "}
              {t("En classe et à la maison.")}
            </p>
            <div className="auth-art-icons">
              <span>Aa</span>
              <Headphones size={52} />
              <span>123</span>
            </div>
          </div>
          <small>{t("ENTRY EXAM · UNE PRATIQUE INDÉPENDANTE")}</small>
        </div>
        <div className="auth-panel">
          <div className="auth-form">
            <IconTile>
              <GraduationCap size={27} />
            </IconTile>
            <h2>
              {register
                ? t("Bienvenue dans l’atelier")
                : t("Heureux de vous retrouver")}
            </h2>
            <p>
              {register
                ? t("Créez votre espace pour commencer.")
                : t("Connectez-vous pour poursuivre vos découvertes.")}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                const f = Object.fromEntries(new FormData(e.currentTarget));
                try {
                  const result = await api(
                    "/auth/" + (register ? "register" : "login"),
                    {...f, locale: i18n.resolvedLanguage || "fr"},
                  );
                  if (result.verification_required) { setVerificationEmail(String(f.email)); return; }
                  await onLogin(result.user);
                } catch (e: any) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {register && (
                <>
                  <Field label={t("Votre prénom ou alias")}>
                    <input
                      name="name"
                      required
                      maxLength={100}
                      autoComplete="name"
                    />
                  </Field>
                  <fieldset className="signup-role-picker">
                    <legend>{t("signup.userRole")}</legend>
                    <div className="signup-role-cards">
                      {(["teacher", "student"] as const).map(role => <label key={role} className={"signup-role-card " + (googleRole === role ? "is-selected" : "")}>
                        <input type="radio" name="role" value={role} checked={googleRole === role} onChange={() => setGoogleRole(role)}/>
                        <img src={"/icons/"+role+".svg"} alt="" width="64" height="64"/>
                        <span>{t(role === "teacher" ? "signup.teacher" : "signup.student")}</span>
                        {googleRole === role && <Check className="role-check" size={15} aria-hidden="true"/>}
                      </label>)}
                    </div>
                    <p className="signup-role-note">{t("signup.roleNote")}</p>
                  </fieldset>
                </>
              )}
              <Field label={t("Courriel ou identifiant élève")}>
                <input
                  name="email"
                  required
                  autoComplete="username"
                  placeholder={t("votre@email.com")}
                />
              </Field>
              {!register && <>
              <Field label={t("Mot de passe")}>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={1}
                  maxLength={128}
                  autoComplete="current-password"
                  placeholder={
                    register
                      ? t("10 caractères minimum")
                      : t("Votre mot de passe")
                  }
                />
              </Field>
              </>}
              {error && (
                <div className="alert error" role="alert">
                  {t(error)}
                </div>
              )}
              <button className="btn full" disabled={busy}>
                {busy
                  ? t("Un instant…")
                  : register
                    ? t("Créer mon espace")
                    : t("Me connecter")}
                <ArrowRight size={18} />
              </button>
            </form>
            <a className="btn full google-login" href={"/api/auth/google/start?" + new URLSearchParams({signup: register ? "1" : "0", role: googleRole, locale: i18n.resolvedLanguage || "fr", next: new URLSearchParams(location.search).get("next") || ""}).toString()}><GoogleIcon/>{t("auth.google")}</a>
            {googleError && <div className="alert error" role="alert">{t(googleError === "google_signup_required" ? "auth.googleSignupRequired" : "auth.googleFailed")}</div>}
            {!register && <p className="auth-switch"><a href="/forgot-password">{t("email.forgotTitle")}</a>{" · "}<a href="/resend-verification">{t("email.resend")}</a></p>}
            <div className="auth-switch">
              {register ? t("Déjà un compte ?") : t("Première visite ?")}{" "}
              <a
                href={
                  (register ? "/login" : "/signup") +
                  (new URLSearchParams(location.search).get("next")
                    ? "?next=" +
                      encodeURIComponent(
                        new URLSearchParams(location.search).get("next")!,
                      )
                    : "")
                }
              >
                {register ? t("Se connecter") : t("Créer un compte")}
              </a>
            </div>
            <div className="auth-help">
              <ShieldCheck size={19} />
              <p>
                {t(
                  register ? "signup.emailNext" : "signup.roleNote",
                )}
              </p>
            </div>
          </div>
          <small className="auth-legal">
            {t(
              "Préparation indépendante · Ne constitue pas un examen officiel.",
            )}
          </small>
        </div>
      </div>
    </>
  );
}
function HomeworkCard({
  hw,
  attempts,
  onStart,
}: {
  hw: Data;
  attempts: Data[];
  onStart: () => void;
}) {
  const done = new Set(
    attempts.filter((a) => a.context_id === hw.id).map((a) => a.question_id),
  ).size;
  return (
    <section className="card homework-card">
      <IconTile>
        <ClipboardList size={26} />
      </IconTile>
      <div className="grow">
        <span className="eyebrow">{t("MON ATELIER")}</span>
        <h3>{hw.title}</h3>
        <div className="meta">
          <Clock size={14} />
          {t("Pour le")} {formatDate(hw.due_at)} <span>·</span>
          {t("exerciseItems", { count: hw.question_ids.length })}
        </div>
        <div className="progress-track">
          <span
            style={{ width: (100 * done) / hw.question_ids.length + "%" }}
          />
        </div>
        <small>
          {done} / {hw.question_ids.length} {t("exercices remis")}
        </small>
      </div>
      <button className="btn" onClick={onStart}>
        {done ? t("Continuer") : t("Commencer")}
        <ArrowRight size={16} />
      </button>
    </section>
  );
}
function JoinClass({
  onJoin,
  onError,
}: {
  onJoin: (s: string) => void;
  onError: (s: string) => void;
}) {
  const [code, setCode] = useState("");
  return (
    <form
      className="card join-form"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const r = await api("/classrooms/join", { code });
          onJoin(r.id);
        } catch (e: any) {
          onError(e.message);
        }
      }}
    >
      <div>
        <strong>{t("Un code de classe ?")}</strong>
        <p>{t("Connecte-toi à la séance de ton enseignant.")}</p>
      </div>
      <div className="inline-input">
        <input
          aria-label={t("Code de classe")}
          placeholder={t("Code de classe")}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="btn secondary">{t("Rejoindre")}</button>
      </div>
    </form>
  );
}
function Catalog({
  questions,
  onSelect,
  student = false,
  initialGrade = "",
  onStartExam,
}: {
  questions: Data[];
  onSelect: (q: Data, scope?: Data[]) => void;
  student?: boolean;
  initialGrade?: string;
  onStartExam?: (qs: Data[]) => void;
}) {
  const [search, setSearch] = useState(""),
    [grade, setGrade] = useState(initialGrade),
    [locale, setLocale] = useState(
      () => { if(!student) return ""; try { const saved=localStorage.getItem("aditou.exercise-language"); return saved === "en-CA" || saved === "" ? saved : "fr-CA"; } catch { return "fr-CA"; } },
    ),
    [status, setStatus] = useState(""),
    [module, setModule] = useState(""),
    [page, setPage] = useState(0);
  const filtered = questions.filter(
    (q) =>
      (!grade || q.grade === Number(grade)) &&
      (!locale || q.locale === locale) &&
      (!status || q.status === status) &&
      (!module || questionSkill(q) === module) &&
      [q.title, q.prompt, q.id, t(questionSkill(q))]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  useEffect(() => setPage(0), [search, grade, locale, status, module]);
  return (
    <>
      <div className="filters">
        <label className="search">
          <Search size={18} />
          <input
            aria-label={t("Rechercher un exercice")}
            placeholder={t("Rechercher un exercice, une compétence…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label={t("Année")}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">{t("Toutes les années")}</option>
          {[1, 2, 3, 4].map((g) => (
            <option key={g} value={g}>
              {t("gradeLabel", { grade: g })}
            </option>
          ))}
        </select>
        {
          <select
            aria-label={t("Langue")}
            value={locale}
            onChange={(e) => { setLocale(e.target.value); if(student) { try {localStorage.setItem("aditou.exercise-language",e.target.value)} catch {} } }}
          >
            <option value="">{t("FR & EN")}</option>
            <option value="fr-CA">{t("language.fr-CA")}</option>
            <option value="en-CA">{t("language.en-CA")}</option>
          </select>
        }
        <select
          aria-label={t("Compétence")}
          value={module}
          onChange={(e) => setModule(e.target.value)}
        >
          <option value="">{t("Toutes les compétences")}</option>
          {SKILLS.filter((s) =>
            questions.some((q) => questionSkill(q) === s.id),
          )
            .slice()
            .sort((a, b) => t(a.id).localeCompare(t(b.id), i18n.language))
            .map(({ id: m }) => (
              <option key={m} value={m}>
                {t(m)}
              </option>
            ))}
        </select>
        {!student && (
          <select
            aria-label={t("Statut")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">{t("Tous les statuts")}</option>
            <option value="draft">{t("Brouillons")}</option>
            <option value="published">{t("Publiés")}</option>
            <option value="retired">{t("Archivés")}</option>
          </select>
        )}
      </div>
      {onStartExam && (
        <div className="exam-launch-bar">
          <div>
            <strong>{t("learn.mode.practice")}</strong>
            <p>{t("learn.practiceInstructions")}</p>
          </div>
          <button
            className="btn secondary"
            disabled={
              !filtered.length ||
              filtered.length > 80 ||
              new Set(filtered.map((q) => q.locale)).size !== 1
            }
            onClick={() => onStartExam(filtered)}
          >
            <ClipboardList size={17} />
            {t("learn.startExam", { count: filtered.length })}
          </button>
        </div>
      )}
      <div className="result-label">
        {t("exerciseCount", { count: filtered.length })}
      </div>
      {student ? (
        <div className="exercise-grid">
          {filtered.slice(page * 12, page * 12 + 12).map((q, i) => (
            <button
              className="card exercise-card"
              key={q.id}
              onClick={() => onSelect(q, filtered)}
            >
              <div className="section-head">
                <IconTile color={["blue", "green", "amber"][i % 3]}>
                  {q.response_type === "drawing" ? <PenLine /> : <BookOpen />}
                </IconTile>
                <span className="badge neutral">
                  {t("gradeLabel", { grade: q.grade })}
                </span>
              </div>
              <span className="eyebrow">{t(questionSkill(q))}</span>
              <h3>{q.title}</h3>
              <p>
                {q.response_type === "drawing"
                  ? t("Je dessine et je découvre.")
                  : q.response_type === "numeric"
                    ? t("Je réfléchis avec les nombres.")
                    : t("Je partage mes idées.")}
              </p>
              <div className="exercise-bottom">
                {t("À mon rythme")} <ArrowRight size={18} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("EXERCICE")}</th>
                <th>{t("ANNÉE / LANGUE")}</th>
                <th>{t("RÉPONSE")}</th>
                <th>{t("STATUT")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(page * 20, page * 20 + 20).map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>{q.title}</strong>
                    <small>
                      {q.id} · v{q.version}
                    </small>
                  </td>
                  <td>
                    {t("gradeLabel", { grade: q.grade })}{" "}
                    <small>{q.locale}</small>
                  </td>
                  <td>{t("response." + q.response_type)}</td>
                  <td>
                    <Badge value={q.status} />
                  </td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => onSelect(q, filtered)}
                    >
                      {t("Réviser")} <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!filtered.length && (
        <section className="card">
          <Empty title={t("Aucun exercice pour ces filtres")}>
            {t("Essaie une autre année ou une autre recherche.")}
          </Empty>
        </section>
      )}
      <div className="pagination">
        <button
          className="btn secondary"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeft size={16} />
          {t("Précédent")}
        </button>
        <span>
          {page + 1} /{" "}
          {Math.max(1, Math.ceil(filtered.length / (student ? 12 : 20)))}
        </span>
        <button
          className="btn secondary"
          disabled={(page + 1) * (student ? 12 : 20) >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          {t("Suivant")}
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}
function Drawing({
  onChange,
  value,
}: {
  onChange: (s: string) => void;
  value: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null),
    down = useRef(false),
    [color, setColor] = useState("#00288e");
  useEffect(() => {
    const canvas = ref.current!;
    canvas.getContext("2d")!.clearRect(0, 0, 900, 500);
    let active = true;
    if (value.startsWith("data:image/")) {
      const img = new Image();
      img.onload = () => {
        if (active) canvas.getContext("2d")!.drawImage(img, 0, 0, 900, 500);
      };
      img.src = value;
    }
    return () => {
      active = false;
    };
  }, [value]);
  function point(e: React.PointerEvent) {
    const canvas = ref.current!,
      r = canvas.getBoundingClientRect();
    return [
      ((e.clientX - r.left) * canvas.width) / r.width,
      ((e.clientY - r.top) * canvas.height) / r.height,
    ] as const;
  }
  return (
    <div className="drawing">
      <div className="drawing-tools">
        <span>{t("Mon ardoise")}</span>
        <div>
          {["#00288e", "#148057", "#d34242", "#111827"].map((c) => (
            <button
              type="button"
              key={c}
              className={"color-dot " + (c === color ? "active" : "")}
              style={{ background: c }}
              aria-label={t("Couleur ") + c}
              onClick={() => setColor(c)}
            />
          ))}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              ref.current!.getContext("2d")!.clearRect(0, 0, 900, 500);
              onChange("");
            }}
          >
            <Trash2 size={16} />
            {t("Effacer")}
          </button>
        </div>
      </div>
      <canvas
        aria-label={t("Ardoise de dessin")}
        ref={ref}
        width={900}
        height={500}
        onPointerDown={(e) => {
          down.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          const ctx = ref.current!.getContext("2d")!;
          ctx.beginPath();
          ctx.moveTo(...point(e));
          ctx.strokeStyle = color;
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
        }}
        onPointerMove={(e) => {
          if (!down.current) return;
          const ctx = ref.current!.getContext("2d")!;
          ctx.lineTo(...point(e));
          ctx.stroke();
        }}
        onPointerUp={() => {
          down.current = false;
          onChange(ref.current!.toDataURL("image/png"));
        }}
        onPointerCancel={() => {
          down.current = false;
        }}
      />
      <small>
        {t("Tu peux aussi décrire ton dessin dans le champ de réponse.")}
      </small>
    </div>
  );
}
function QuestionInput({
  question: q,
  answer,
  onChange: setAnswer,
  onError,
}: {
  question: Data;
  answer: string;
  onChange: (s: string) => void;
  onError: (s: string) => void;
}) {
  return (
    <div className="question-response">
      {q.response_type === "qcm" ? (
        <div className="options">
          {q.options.map((o: string) => (
            <label
              key={o}
              className={"option " + (answer === o ? "chosen" : "")}
            >
              <input
                type="radio"
                name="answer"
                value={o}
                checked={answer === o}
                onChange={() => setAnswer(o)}
                required
              />
              {o}
            </label>
          ))}
        </div>
      ) : q.response_type === "multiple" ? (
        <div className="options">
          {q.options.map((o: string) => {
            let list: string[] = [];
            try {
              list = JSON.parse(answer);
            } catch {}
            return (
              <label className="option" key={o}>
                <input
                  type="checkbox"
                  checked={list.includes(o)}
                  onChange={(e) =>
                    setAnswer(
                      JSON.stringify(
                        e.target.checked
                          ? [...list, o].sort()
                          : list.filter((x) => x !== o).sort(),
                      ),
                    )
                  }
                />
                {o}
              </label>
            );
          })}
        </div>
      ) : q.response_type === "matching" ? (
        <MatchInput options={q.options} value={answer} onChange={setAnswer} />
      ) : q.response_type === "order" ? (
        <OrderInput options={q.options} value={answer} onChange={setAnswer} />
      ) : q.response_type === "drawing" ? (
        <>
          <Drawing onChange={setAnswer} value={answer} />
          <Field label={t("Ou ma réponse en mots / observation de l’adulte")}>
            <textarea
              value={answer.startsWith("data:") ? "" : answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("Décris ton dessin ou ton activité…")}
            />
          </Field>
          <Field
            label={t("Ou une photo de mon travail (une image, 1 Mo maximum)")}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 1000000) {
                  onError("Choisis une image de moins de 1 Mo.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setAnswer(String(reader.result));
                reader.readAsDataURL(f);
              }}
            />
          </Field>
          {answer.startsWith("data:") && (
            <img className="answer-image" src={answer} alt={t("Mon travail")} />
          )}
        </>
      ) : (
        <Field
          label={
            q.response_type === "numeric"
              ? t("Ta réponse")
              : t("Ta réponse ou les mots notés par un adulte")
          }
        >
          {q.response_type === "numeric" ? (
            <input
              className="numeric-input"
              inputMode="decimal"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?"
              required
            />
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              placeholder={t("Écris ici…")}
              maxLength={10000}
            />
          )}
        </Field>
      )}
    </div>
  );
}
function Player({
  question: q,
  assets,
  activity,
  onError,
  onBack,
  onDone,
  onNext,
}: {
  question: Data;
  assets: Data[];
  activity: Data | null;
  onError: (s: string) => void;
  onBack: () => void;
  onDone: () => Promise<void>;
  onNext: () => void;
}) {
  const key =
    "draft:" +
    draftAccount +
    ":" +
    q.id +
    ":" +
    (activity?.id || "private") +
    ":" +
    (activity?.round || 1);
  const [answer, setAnswer] = useState(() => localStorage.getItem(key) || ""),
    [result, setResult] = useState<Data | null>(null),
    [busy, setBusy] = useState(false),
    [audioId, setAudioId] = useState(""),
    [plays, setPlays] = useState(0);
  const request = useRef(crypto.randomUUID());
  const disabled =
    activity?.context === "classroom" && activity.phase !== "open";
  const formRef = useRef<HTMLFormElement>(null),
    continueRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(key, answer);
    } catch {}
  }, [answer, key]);
  useEffect(() => {
    if (disabled || (busy && !result)) return;
    const target = result
      ? continueRef.current
      : formRef.current?.querySelector<HTMLElement>(
          "input:not([type=checkbox]):not([type=file]),textarea,select",
        );
    (
      target ||
      formRef.current?.querySelector<HTMLElement>(
        ".question-response input,.question-response button:not([disabled])",
      )
    )?.focus({ preventScroll: true });
  }, [q.id, result, busy, disabled]);
  return (
    <div className="player-page">
      <div className="player-top">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={17} />
          {t("Retour à mon atelier")}
        </button>
        <span className="badge neutral">
          {activity?.context === "classroom"
            ? t("En classe")
            : activity?.context === "assignment"
              ? t("Mon devoir")
              : t("Mon entraînement privé")}
        </span>
      </div>
      <div className="player-layout">
        <section className="card player-card">
          <div className="section-head">
            <span className="eyebrow">
              {t(questionSkill(q))} · {q.locale}
            </span>
            <span className="badge neutral">
              {t("gradeLabel", { grade: q.grade })}
            </span>
            <QuestionAudio
              key={q.id}
              questionId={q.id}
              accountKey={draftAccount}
              onSource={setAudioId}
            />
          </div>
          <h1>{q.title}</h1>
          <div className="practice-question-reading">
            <div className="question-prompt">{q.prompt}</div>
            <QuestionPreparation
              preparation={q.preparation}
              teacherOnly={q.audio_policy === "teacher_only"}
            />
          </div>
          {disabled && !result && (
            <div className="info-banner">
              <Clock size={18} />
              {t("Attends le signal de ton enseignant pour répondre.")}
            </div>
          )}
          <form
            ref={formRef}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                e.target instanceof HTMLTextAreaElement &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
                e.currentTarget.requestSubmit();
              }
            }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy || result) return;
              setBusy(true);
              try {
                const r = await api("/attempts", {
                  question_id: q.id,
                  answer,
                  request_id: request.current,
                  context: activity?.context || "private",
                  context_id: activity?.id,
                  round: activity?.round,
                  audio_source: audioId || "none",
                  audio_plays: plays,
                });
                setResult(r);
                localStorage.removeItem(key);
                await onDone();
              } catch (e: any) {
                onError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy || !!result || disabled}>
              <QuestionInput
                question={q}
                answer={answer}
                onChange={setAnswer}
                onError={onError}
              />
              <div className="submit-bar">
                <span className="small">
                  <ShieldCheck size={14} />
                  {answer
                    ? t("Brouillon sauvegardé sur cet appareil")
                    : t("Une étape à la fois.")}
                </span>
                <button className="btn" disabled={!answer.trim() || disabled}>
                  <Check size={18} />{" "}
                  {busy ? t("Envoi…") : t("Valider ma réponse")}
                </button>
              </div>
            </fieldset>
          </form>
          {result && (
            <>
              <div
                role="status"
                className={
                  "feedback " +
                  (result.status === "correct" ? "correct" : "neutral")
                }
              >
                <div className="section-head">
                  <h3>
                    {result.status === "correct"
                      ? t("Bravo, bien joué !")
                      : result.status === "incorrect"
                        ? t("On apprend aussi en essayant !")
                        : result.status === "submitted"
                          ? t("Ta réponse est bien reçue.")
                          : t("C’est enregistré, merci !")}
                  </h3>
                  <Badge value={result.status} />
                </div>
                {result.status === "pending_manual" && (
                  <p>
                    {t(
                      "Cette activité sera confirmée par un adulte. Elle ne compte pas comme une erreur.",
                    )}
                  </p>
                )}
                {result.explanation && <p>{result.explanation}</p>}
                {result.answer && result.status !== "pending_manual" && (
                  <p>
                    <strong>{t("Réponse de référence :")}</strong>{" "}
                    {result.answer}
                  </p>
                )}
              </div>
              {result.status !== "submitted" && (
                <div className="feedback-actions">
                  <button
                    type="button"
                    className="btn"
                    ref={continueRef}
                    onClick={onNext}
                  >
                    {t("Continuer")}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
        <aside className="player-aside">
          <section className="tip-card">
            <span className="big-star">✦</span>
            <h3>{t("Tu peux y arriver.")}</h3>
            <p>
              {t(
                "Prends le temps de réfléchir. Tu n’as pas besoin d’aller vite pour bien apprendre.",
              )}
            </p>
          </section>
          <div className="privacy-note">
            <ShieldCheck size={18} />
            {activity?.context === "assignment"
              ? t("Ta réponse est partagée avec ton enseignant.")
              : activity?.context === "classroom"
                ? t("Ton enseignant reçoit ta réponse.")
                : t("Cet entraînement est privé.")}
          </div>
        </aside>
      </div>
    </div>
  );
}
function MatchInput({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  let selected: Record<string, string> = {};
  try {
    selected = JSON.parse(value);
  } catch {}
  const pairs = options.map((o) => o.split("|"));
  const targets = pairs.map((p) => p[1] || p[0]).sort();
  return (
    <div className="matching-list">
      {pairs.map(([left]) => (
        <Field key={left} label={left}>
          <select
            required
            value={selected[left] || ""}
            onChange={(e) =>
              onChange(JSON.stringify({ ...selected, [left]: e.target.value }))
            }
          >
            <option value="">{t("Choisir une correspondance")}</option>
            {targets.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      ))}
    </div>
  );
}
function OrderInput({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  let list = options;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) list = parsed;
  } catch {}
  useEffect(() => {
    if (!value) onChange(JSON.stringify(options));
  }, []);
  return (
    <div className="order-list">
      {list.map((o, i) => (
        <div key={o}>
          <span>
            {i + 1}. {o}
          </span>
          <button
            type="button"
            aria-label={t("Monter ") + o}
            disabled={!i}
            onClick={() => {
              const a = [...list];
              [a[i], a[i - 1]] = [a[i - 1], a[i]];
              onChange(JSON.stringify(a));
            }}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={t("Descendre ") + o}
            disabled={i === list.length - 1}
            onClick={() => {
              const a = [...list];
              [a[i], a[i + 1]] = [a[i + 1], a[i]];
              onChange(JSON.stringify(a));
            }}
          >
            ↓
          </button>
        </div>
      ))}
    </div>
  );
}
function Progress({
  attempts,
  staff,
  onRetry,
  onGrade,
}: {
  attempts: Data[];
  staff: boolean;
  onRetry?: (a: Data) => void;
  onGrade?: (a: Data, status: string, feedback: string) => void;
}) {
  const [context, setContext] = useState(""),
    [locale, setLocale] = useState("");
  const rows = attempts.filter(
    (a) =>
      (!context || a.context === context) && (!locale || a.locale === locale),
  );
  const correct = rows.filter((a) => a.status === "correct").length,
    graded = rows.filter((a) =>
      ["correct", "partial", "incorrect"].includes(a.status),
    ).length;
  return (
    <>
      <div className="stats-row">
        <Stat
          label={t("Essais enregistrés")}
          value={rows.length}
          icon={<PenLine />}
        />
        <Stat
          label={t("Réponses validées")}
          value={graded ? `${correct} / ${graded}` : "—"}
          icon={<CheckCircle2 />}
        />
        <Stat
          label={t("À confirmer par un adulte")}
          value={rows.filter((a) => a.status === "pending_manual").length}
          icon={<Clock />}
        />
      </div>
      <div className="filters">
        <select
          aria-label={t("Contexte des résultats")}
          value={context}
          onChange={(e) => setContext(e.target.value)}
        >
          <option value="">{t("Tous les contextes (comptages)")}</option>
          {!staff && <option value="private">{t("Entraînement privé")}</option>}
          <option value="assignment">{t("Devoirs")}</option>
          <option value="classroom">{t("En classe")}</option>
        </select>
        <select
          aria-label={t("Langue des résultats")}
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
        >
          <option value="">{t("FR & EN (comptages)")}</option>
          <option value="fr-CA">{t("language.fr-CA")}</option>
          <option value="en-CA">{t("language.en-CA")}</option>
        </select>
        <button
          className="btn secondary"
          onClick={() => {
            const blob = new Blob([JSON.stringify(rows, null, 2)], {
              type: "application/json",
            });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "entryexam-resultats.json";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          <Download size={16} />
          {t("Exporter")}
        </button>
      </div>
      <div className="info-banner">
        <BarChart3 size={20} />
        {t(
          "Les essais familiers, les langues et les contextes sont distingués. Ces résultats ne prédisent pas une admission.",
        )}
      </div>
      <AttemptList
        attempts={rows}
        staff={staff}
        onRetry={onRetry}
        onGrade={onGrade}
      />
    </>
  );
}
function AttemptList({
  attempts,
  staff,
  onRetry,
  onGrade,
}: {
  attempts: Data[];
  staff?: boolean;
  onRetry?: (a: Data) => void;
  onGrade?: (a: Data, status: string, feedback: string) => void;
}) {
  return !attempts.length ? (
    <section className="card">
      <Empty title={t("Une page prête à se remplir")}>
        {t("Les réponses enregistrées apparaîtront ici.")}
      </Empty>
    </section>
  ) : (
    <div className="attempt-list">
      {attempts.map((a) => (
        <section className="card attempt" key={a.id}>
          <div className="section-head">
            <div>
              <span className="eyebrow">
                {a.context === "private"
                  ? t("PRIVÉ")
                  : a.context === "assignment"
                    ? t("DEVOIR")
                    : t("CLASSE")}{" "}
                · {a.locale}{" "}
                {a.context === "classroom"
                  ? " " + t("· RONDE") + " " + a.round
                  : ""}
              </span>
              <h3>{a.title}</h3>
              <small>
                {staff && a.alias ? `${a.alias} · ` : ""}
                {new Date(a.created_at.replace(" ", "T") + "Z").toLocaleString(
                  dateLocale(),
                )}
              </small>
            </div>
            <div>
              <Badge value={a.status} />
              {a.score != null && (
                <small className="score-label">
                  {" "}
                  {a.score} / 2{" "}
                  {a.reviewer_role === "parent"
                    ? t("· Observation parentale")
                    : ""}
                </small>
              )}
            </div>
          </div>
          {a.answer.startsWith("data:image/") ? (
            <img
              src={a.answer}
              className="answer-image"
              alt={t("Dessin remis")}
            />
          ) : (
            <p className="answer-text">{a.answer}</p>
          )}
          {a.feedback && <p className="feedback-note">{a.feedback}</p>}
          {a.reference && (
            <details>
              <summary>{t("Référence et explication")}</summary>
              <p>{a.reference.answer}</p>
              <p>{a.reference.explanation}</p>
            </details>
          )}
          {onGrade && a.status === "pending_manual" && (
            <GradeForm
              onSave={(status, feedback) => onGrade(a, status, feedback)}
            />
          )}
          {!staff && a.status === "incorrect" && onRetry && (
            <button className="text-button" onClick={() => onRetry(a)}>
              <RefreshCw size={15} />
              {t("M’entraîner de nouveau")}
            </button>
          )}
        </section>
      ))}
    </div>
  );
}
function GradeForm({ onSave }: { onSave: (s: string, f: string) => void }) {
  return (
    <form
      className="grade-form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onSave(String(f.get("status")), String(f.get("feedback")));
      }}
    >
      <select name="status" aria-label={t("Évaluation")}>
        <option value="correct">{t("Validé · 2/2")}</option>
        <option value="partial">{t("Partiellement validé · 1/2")}</option>
        <option value="incorrect">{t("À revoir · 0/2")}</option>
        <option value="pending_manual">{t("À confirmer")}</option>
      </select>
      <input
        name="feedback"
        placeholder={t("Un retour pour l’élève…")}
        aria-label={t("Commentaire de l’enseignant")}
      />
      <button className="btn secondary">{t("Enregistrer")}</button>
    </form>
  );
}
function QuestionEditor({
  initial,
  close,
  onSave,
  busy,
  error,
}: {
  initial: Data | null;
  close: () => void;
  onSave: (d: Data) => void;
  busy: boolean;
  error: string;
}) {
  const [q, setQ] = useState<Data>(
    initial || {
      title: "",
      prompt: "",
      script: "",
      grade: 2,
      locale: "fr-CA",
      module: "skill.arithmetic",
      response_type: "numeric",
      options: [],
      answer: "",
      explanation: "",
      teacher_notes: "",
      text_policy: "full",
      status: "draft",
    },
  );
  const change = (key: string, v: any) => setQ({ ...q, [key]: v });
  return (
    <Modal
      title={
        initial
          ? t("Réviser l’exercice · nouvelle version")
          : t("Créer un exercice")
      }
      close={close}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(q);
        }}
      >
        <div className="form-grid">
          <Field label={t("Titre")}>
            <input
              value={q.title}
              onChange={(e) => change("title", e.target.value)}
              required
            />
          </Field>
          <Field label={t("Module / compétence")}>
            <select
              value={questionSkill(q)}
              onChange={(e) => change("module", e.target.value)}
              required
            >
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(s.id)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("Année d’entrée")}>
            <select
              value={q.grade}
              onChange={(e) => change("grade", Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((g) => (
                <option key={g} value={g}>
                  {t("gradeLabel", { grade: g })}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("Langue")}>
            <select
              value={q.locale}
              onChange={(e) => change("locale", e.target.value)}
            >
              <option value="fr-CA">{t("language.fr-CA")}</option>
              <option value="en-CA">{t("language.en-CA")}</option>
            </select>
          </Field>
        </div>
        <Field label={t("Contenu visible par l’élève (jamais les réponses)")}>
          <textarea
            required
            rows={5}
            value={q.prompt}
            onChange={(e) => change("prompt", e.target.value)}
          />
        </Field>
        <Field label={t("Texte à lire / script TTS")}>
          <textarea
            required
            rows={4}
            value={q.script}
            onChange={(e) => change("script", e.target.value)}
          />
        </Field>
        <Field label={t("Notes privées de l’enseignant et barème")}>
          <textarea
            rows={5}
            value={q.teacher_notes || ""}
            onChange={(e) => change("teacher_notes", e.target.value)}
          />
        </Field>
        <div className="form-grid">
          <Field label={t("Type de réponse")}>
            <select
              value={q.response_type}
              onChange={(e) => change("response_type", e.target.value)}
            >
              <option value="numeric">{t("Nombre (correction exacte)")}</option>
              <option value="qcm">{t("Choix unique")}</option>
              <option value="multiple">
                {t("Choix multiples (tableau JSON)")}
              </option>
              <option value="order">{t("Ordre (tableau JSON)")}</option>
              <option value="matching">{t("Association (objet JSON)")}</option>
              <option value="text">{t("Texte (validation adulte)")}</option>
              <option value="drawing">{t("Dessin / photo")}</option>
              <option value="observation">
                {t("Observation d’une action")}
              </option>
              <option value="oral">
                {t("Expression orale (note adulte)")}
              </option>
            </select>
          </Field>
          <Field label={t("Statut")}>
            <select
              value={q.status === "retired" ? "draft" : q.status}
              onChange={(e) => change("status", e.target.value)}
            >
              <option value="draft">{t("Brouillon")}</option>
              <option value="published">{t("Publié · contenu vérifié")}</option>
            </select>
          </Field>
        </div>
        {["qcm", "multiple", "order", "matching"].includes(q.response_type) && (
          <Field
            label={t("Options (une par ligne ; association : gauche|droite)")}
          >
            <textarea
              value={q.options.join("\n")}
              onChange={(e) => change("options", e.target.value.split("\n"))}
            />
          </Field>
        )}
        <Field label={t("Réponse de référence (privée avant validation)")}>
          <textarea
            value={q.answer}
            onChange={(e) => change("answer", e.target.value)}
          />
        </Field>
        <Field label={t("Explication après réponse")}>
          <textarea
            value={q.explanation}
            onChange={(e) => change("explanation", e.target.value)}
          />
        </Field>
        <Field label={t("Affichage du texte")}>
          <select
            value={q.text_policy}
            onChange={(e) => change("text_policy", e.target.value)}
          >
            <option value="full">{t("Texte élève autorisé")}</option>
            <option value="answer_area_only">
              {t("Consigne élève seulement · écoute")}
            </option>
          </select>
        </Field>
        <div className="info-banner">
          {t(
            "L’enregistrement crée une nouvelle version. Les devoirs, les classes et les réponses existantes conservent leur version d’origine.",
          )}
        </div>
        {error && <div className="alert error">{t(error)}</div>}
        <div className="modal-actions">
          {initial && (
            <button
              type="button"
              className="btn danger"
              disabled={busy}
              onClick={async () => {
                if (
                  confirm(
                    t("Archiver cet exercice pour les nouvelles activités ?"),
                  )
                ) {
                  await api("/questions/" + initial.id + "/retire", {});
                  location.reload();
                }
              }}
            >
              {t("Archiver")}
            </button>
          )}
          <button type="button" className="btn secondary" onClick={close}>
            {t("Annuler")}
          </button>
          <button className="btn" disabled={busy}>
            {busy ? t("Enregistrement…") : t("Enregistrer la version")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
function ActivityEditor({
  kind,
  classes,
  questions,
  close,
  onSave,
  busy,
  error,
}: {
  kind: string;
  classes: Data[];
  questions: Data[];
  close: () => void;
  onSave: (b: Data) => void;
  busy: boolean;
  error: string;
}) {
  const [ids, setIds] = useState<string[]>([]),
    [locale, setLocale] = useState("fr-CA");
  return (
    <Modal
      title={
        kind === "assignment" ? t("Nouveau devoir") : t("Préparer une séance")
      }
      close={close}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          onSave({ ...f, question_ids: ids });
        }}
      >
        <Field label={t("Titre")}>
          <input
            name="title"
            required
            placeholder={t("Les nombres et les consignes")}
          />
        </Field>
        <Field label={t("Classe")}>
          <select name="class_id" required>
            <option value="">{t("Choisir une classe")}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        {kind === "assignment" && (
          <Field label={t("Date conseillée")}>
            <input type="date" name="due_at" required />
          </Field>
        )}
        <Field label={t("Langue des exercices")}>
          <select
            value={locale}
            onChange={(e) => {
              setLocale(e.target.value);
              setIds([]);
            }}
          >
            <option value="fr-CA">{t("language.fr-CA")}</option>
            <option value="en-CA">{t("language.en-CA")}</option>
          </select>
        </Field>
        <strong>
          {t("Choisir et ordonner les exercices ·")} {ids.length}{" "}
          {t("sélectionné(s)")}
        </strong>
        <div className="question-picker">
          {questions
            .filter((q) => q.locale === locale)
            .map((q) => (
              <label key={q.id}>
                <input
                  type="checkbox"
                  checked={ids.includes(q.id)}
                  onChange={(e) =>
                    setIds(
                      e.target.checked
                        ? [...ids, q.id]
                        : ids.filter((i) => i !== q.id),
                    )
                  }
                />
                <span>
                  {ids.includes(q.id) ? `${ids.indexOf(q.id) + 1}. ` : ""}
                  {q.title}
                  <small>
                    {t("gradeLabel", { grade: q.grade })} ·{" "}
                    {t(questionSkill(q))}
                  </small>
                </span>
              </label>
            ))}
        </div>
        <p className="small">
          {t(
            "L’ordre de sélection définit l’ordre des exercices. Le devoir est partagé avec toute la classe.",
          )}
        </p>
        {error && <div className="alert error">{t(error)}</div>}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={close}>
            {t("Annuler")}
          </button>
          <button
            className="btn"
            disabled={busy || !ids.length || !classes.length}
          >
            {t("Publier")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
function Roster({
  boot,
  busy,
  action,
  refresh,
  user,
  notify,
}: {
  boot: Data;
  busy: boolean;
  action: (f: () => Promise<void>) => void;
  refresh: () => Promise<void>;
  user: Data;
  notify: (s: string) => void;
}) {
  const [roster, setRoster] = useState<Data>({ students: [], teachers: [] }),
    [modal, setModal] = useState(""),
    [invite, setInvite] = useState("");
  async function load() {
    setRoster(await api("/roster"));
  }
  useEffect(() => {
    action(load);
  }, []);
  return (
    <>
      <PageTitle
        eyebrow={t("UNE PLACE POUR CHAQUE ÉLÈVE")}
        title={t("Élèves et classes")}
        subtitle={t(
          "Des identités durables, des groupes pour apprendre ensemble.",
        )}
        action={
          <div className="button-row">
            <button className="btn secondary" onClick={() => setModal("class")}>
              <Plus size={17} />
              {t("Nouvelle classe")}
            </button>
            <button className="btn" onClick={() => setModal("student")}>
              <Plus size={17} />
              {t("Ajouter un compte")}
            </button>
          </div>
        }
      />
      <div className="stats-row">
        <Stat
          label={t("Élèves")}
          value={roster.students.length}
          icon={<Users />}
        />
        <Stat
          label={t("Classes")}
          value={boot.classes.length}
          icon={<BookOpen />}
        />
        <Stat
          label={t("Enseignants")}
          value={roster.teachers.length || 1}
          icon={<GraduationCap />}
        />
      </div>
      <div className="assignment-grid">
        {boot.classes.map((c: Data) => (
          <section className="card" key={c.id}>
            <IconTile color="green">
              <Users />
            </IconTile>
            <h3>{c.name}</h3>
            <p>
              {t("gradeLabel", { grade: c.grade })} · {c.locale}
            </p>
            <small>
              {c.teacher_name ||
                roster.teachers.find((t: Data) => t.id === c.teacher_id)
                  ?.name ||
                t("Enseignant attribué")}
            </small>
          </section>
        ))}
      </div>
      <div className="section-head">
        <h2>{t("Le carnet des élèves")}</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("ÉLÈVE")}</th>
              <th>{t("ANNÉE")}</th>
              <th>{t("CLASSE")}</th>
              <th>{t("ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {roster.students.map((s: Data) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.alias}</strong>
                  <small>{s.email}</small>
                </td>
                <td>{t("gradeLabel", { grade: s.grade })}</td>
                <td>{s.classes || t("Sans classe")}</td>
                <td>
                  <div className="button-row">
                    <button
                      className="text-button"
                      onClick={() => {
                        setModal("enroll:" + s.id);
                      }}
                    >
                      {t("Inscrire")}
                    </button>
                    <button
                      className="text-button"
                      onClick={() =>
                        action(async () => {
                          const r = await api("/invitations", {
                            learner_id: s.id,
                          });
                          setInvite(r.token);
                          setModal("invite");
                        })
                      }
                    >
                      {t("Invitation parent")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!roster.students.length && (
          <Empty title={t("Ajoutez votre premier élève")}>
            {t(
              "Un identifiant élève peut être utilisé sans adresse courriel personnelle.",
            )}
          </Empty>
        )}
      </div>
      {modal === "student" && (
        <Modal title={t("Créer un compte")} close={() => setModal("")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = Object.fromEntries(new FormData(e.currentTarget));
              action(async () => {
                await api("/roster", f);
                await load();
                await refresh();
                setModal("");
                notify("Compte créé. Transmettez les identifiants en privé.");
              });
            }}
          >
            <Field label={t("Prénom / alias")}>
              <input name="name" required />
            </Field>
            <Field label={t("Courriel ou identifiant de connexion")}>
              <input name="email" required />
            </Field>
            <Field label={t("Mot de passe initial (10 caractères minimum)")}>
              <input
                name="password"
                type="password"
                minLength={10}
                maxLength={128}
                required
              />
            </Field>
            <Field label={t("Rôle")}>
              <select name="role">
                <option value="student">{t("Élève")}</option>
                {user.role === "admin" && (
                  <option value="teacher">{t("Enseignant")}</option>
                )}
              </select>
            </Field>
            <Field label={t("Année")}>
              <select name="grade">
                {[1, 2, 3, 4].map((g) => (
                  <option key={g} value={g}>
                    {t("gradeLabel", { grade: g })}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("Inscription à une classe (élève)")}>
              <select name="class_id">
                <option value="">{t("Sans classe")}</option>
                {boot.classes.map((c: Data) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <button className="btn" disabled={busy}>
              {t("Créer le compte")}
            </button>
          </form>
        </Modal>
      )}
      {modal === "class" && (
        <Modal title={t("Nouvelle classe")} close={() => setModal("")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = Object.fromEntries(new FormData(e.currentTarget));
              action(async () => {
                await api("/classes", f);
                await refresh();
                setModal("");
                notify("Classe créée.");
              });
            }}
          >
            <Field label={t("Nom de la classe")}>
              <input name="name" required />
            </Field>
            <Field label={t("Année")}>
              <select name="grade">
                {[1, 2, 3, 4].map((g) => (
                  <option key={g} value={g}>
                    {t("gradeLabel", { grade: g })}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("Langue")}>
              <select name="locale">
                <option value="fr-CA">{t("language.fr-CA")}</option>
                <option value="en-CA">{t("language.en-CA")}</option>
              </select>
            </Field>
            {user.role === "admin" && (
              <Field label={t("Enseignant")}>
                <select name="teacher_id">
                  {roster.teachers.map((t: Data) => (
                    <option value={t.id} key={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <button className="btn" disabled={busy}>
              {t("Créer la classe")}
            </button>
          </form>
        </Modal>
      )}
      {modal.startsWith("enroll:") && (
        <Modal title={t("Inscrire à une classe")} close={() => setModal("")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              action(async () => {
                await api("/enrollments", {
                  class_id: f.get("class_id"),
                  learner_id: modal.split(":")[1],
                });
                await load();
                setModal("");
                notify("Inscription enregistrée.");
              });
            }}
          >
            <Field label={t("Classe")}>
              <select name="class_id" required>
                {boot.classes.map((c: Data) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <button className="btn" disabled={busy}>
              {t("Inscrire")}
            </button>
          </form>
        </Modal>
      )}
      {modal === "invite" && (
        <Modal
          title={t("Invitation de reconnaissance parentale")}
          close={() => setModal("")}
        >
          <p>
            {t(
              "Transmettez ce code uniquement au responsable légal déjà vérifié par votre établissement. Il est valable 7 jours et ne peut être utilisé qu’une fois.",
            )}
          </p>
          <textarea
            readOnly
            value={invite}
            aria-label={t("Code d’invitation parent")}
          />
          <button
            className="btn"
            onClick={() =>
              action(async () => {
                await navigator.clipboard.writeText(invite);
                notify("Code copié.");
              })
            }
          >
            {t("Copier le code")}
          </button>
        </Modal>
      )}
    </>
  );
}
function Family({
  boot,
  refresh,
  action,
  notify,
}: {
  boot: Data;
  refresh: () => Promise<void>;
  action: (f: () => Promise<void>) => void;
  notify: (s: string) => void;
}) {
  const [child, setChild] = useState(""),
    [attempts, setAttempts] = useState<Data[]>([]);
  useEffect(() => {
    if (child)
      action(async () => {
        const r = await api("/attempts?learner=" + encodeURIComponent(child));
        setAttempts(r.attempts);
      });
  }, [child]);
  return (
    <>
      <PageTitle
        eyebrow={t("GRANDIR, BIEN ENTOURÉ")}
        title={t("Le coin des parents")}
        subtitle={t(
          "Accompagnez les découvertes de votre enfant, sans pression.",
        )}
      />
      <section className="hero parent-hero">
        <Heart size={54} />
        <div>
          <h2>{t("Un lien, toute une histoire.")}</h2>
          <p>
            {t(
              "Retrouvez les apprentissages de votre enfant, en classe et à la maison.",
            )}
          </p>
        </div>
      </section>
      <section className="card account-card">
        <h3>{t("Relier le compte de mon enfant")}</h3>
        <p>
          {t(
            "Utilisez l’invitation privée remise par votre établissement après vérification de votre lien parental.",
          )}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            action(async () => {
              await api("/family/claim", { token: f.get("token") });
              await refresh();
              notify("Votre lien parental est enregistré.");
            });
          }}
        >
          <Field label={t("Code d’invitation parent")}>
            <input
              name="token"
              required
              placeholder={t("Le code privé fourni par votre établissement")}
            />
          </Field>
          <button className="btn">
            <ShieldCheck size={16} />
            {t("Relier le compte")}
          </button>
        </form>
      </section>
      {boot.children.length > 0 && (
        <>
          <div className="section-head">
            <h2>{t("Mes enfants")}</h2>
          </div>
          <div className="assignment-grid">
            {boot.children.map((c: Data) => (
              <button
                className="card child-card"
                key={c.id}
                onClick={() => setChild(c.id)}
              >
                <IconTile color="green">
                  <GraduationCap />
                </IconTile>
                <h3>{c.alias}</h3>
                <p>{t("gradeLabel", { grade: c.grade })}</p>
                <span className="text-button">
                  {t("Voir les découvertes")} <ArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {child && (
        <Progress
          attempts={attempts}
          staff={false}
          onGrade={(a, status, feedback) =>
            action(async () => {
              await api("/attempts/" + a.id + "/grade", { status, feedback });
              const r = await api(
                "/attempts?learner=" + encodeURIComponent(child),
              );
              setAttempts(r.attempts);
              notify("Observation parentale enregistrée.");
            })
          }
        />
      )}
      <div className="info-banner">
        <ShieldCheck size={19} />
        {t(
          "Les achats familiaux ne sont pas encore ouverts. Aucun paiement ni abonnement n’est activé.",
        )}
      </div>
    </>
  );
}
function LiveRoom({
  id,
  staff,
  onExit,
  onError,
}: {
  id: string;
  staff: boolean;
  questions: Data[];
  onExit: () => void;
  onError: (s: string) => void;
  onPractice: (q: Data, c: Data) => void;
}) {
  const [data, setData] = useState<Data | null>(null),
    [projector, setProjector] = useState(false),
    [connected, setConnected] = useState(true),
    [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  async function poll() {
    try {
      const r = await api("/classrooms/" + id);
      if (mounted.current) {
        setData(r);
        setConnected(true);
      }
    } catch (e: any) {
      if (mounted.current) {
        setConnected(false);
        onError(e.message);
      }
    }
  }
  useEffect(() => {
    mounted.current = true;
    poll();
    const t = setInterval(poll, 2500);
    return () => {
      mounted.current = false;
      clearInterval(t);
    };
  }, [id]);
  async function command(action: string) {
    setBusy(true);
    try {
      await api("/classrooms/" + id, {
        action,
        expected_round: data?.classroom.round,
        expected_index: data?.classroom.current_index,
      });
      await poll();
    } catch (e: any) {
      onError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return <div className="loading">{t("Ouverture de la séance…")}</div>;
  const c = data.classroom,
    q = data.question;
  const phases: Data = {
    reading: "Lecture de l’enseignant",
    open: "Les élèves répondent",
    closed: "Réponses fermées",
    revealed: "Référence partagée",
    ended: "Séance terminée",
  };
  return (
    <>
      <div className="player-top">
        <button className="text-button" onClick={onExit}>
          <ArrowLeft size={17} />
          {t("Quitter la console")}
        </button>
        <span className={"connection " + (!connected ? "offline" : "")}>
          <span className="dot" />
          {connected
            ? t("Actualisation toutes les 2,5 s")
            : t("Connexion interrompue")}
        </span>
      </div>
      <PageTitle
        eyebrow={"CLASSE EN DIRECT · CODE " + c.code}
        title={c.title}
        subtitle={t("sessionSummary", {
          current: c.current_index + 1,
          total: c.question_ids.length,
          round: c.round,
          phase: t(phases[c.phase]),
        })}
        action={
          staff ? (
            <button
              className="btn secondary"
              onClick={() => setProjector(true)}
            >
              <Monitor size={17} />
              {t("Projecteur")}
            </button>
          ) : undefined
        }
      />
      {staff ? (
        <>
          <div className="live-grid">
            <section className="card">
              <div className="section-head">
                <Badge value="Lecture enseignant" />
                <span className="small">{t("VUE PRIVÉE")}</span>
              </div>
              <h2>{q?.title}</h2>
              <div className="teacher-script">{q?.script}</div>
              <details>
                <summary>{t("Notes et référence privées")}</summary>
                <p className="prewrap">{q?.teacher_notes}</p>
                <p>{q?.answer}</p>
              </details>
              <div className="live-controls">
                <button
                  className="btn"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command("open")}
                >
                  <Play size={16} />
                  {t("Ouvrir les réponses")}
                </button>
                <button
                  className="btn secondary"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command("close")}
                >
                  <Pause size={16} />
                  {t("Fermer")}
                </button>
                <button
                  className="btn secondary"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command("reveal")}
                >
                  <Eye size={16} />
                  {t("Publier la référence")}
                </button>
                <button
                  className="btn secondary"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command("retry")}
                >
                  <RefreshCw size={16} />
                  {t("Nouvelle ronde")}
                </button>
                <button
                  className="btn secondary"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command(c.text_visible ? "hide" : "show")}
                >
                  {c.text_visible
                    ? t("Masquer le texte")
                    : t("Afficher le texte")}
                </button>
                <button
                  className="btn"
                  disabled={
                    busy ||
                    c.phase === "ended" ||
                    c.current_index === c.question_ids.length - 1
                  }
                  onClick={() => command("next")}
                >
                  {t("Exercice suivant")}
                  <ArrowRight size={16} />
                </button>
                <button
                  className="btn danger"
                  disabled={busy || c.phase === "ended"}
                  onClick={() => command("end")}
                >
                  {t("Terminer la séance")}
                </button>
              </div>
            </section>
            <section className="card">
              <h3>{t("Le pouls de la classe")}</h3>
              <div className="live-count">
                {data.attempts.length}
                <span>
                  {t("réponses reçues · ronde")} {c.round}
                </span>
              </div>
              <p>
                {t(
                  "Le nombre de réponses n’indique pas le nombre d’élèves connectés.",
                )}
              </p>
              {data.attempts.map((a: Data) => (
                <div className="live-answer" key={a.id}>
                  <strong>{a.alias}</strong>
                  <span>
                    {a.answer.startsWith("data:")
                      ? t("Dessin remis")
                      : a.answer}
                  </span>
                  <Badge value={a.status} />
                </div>
              ))}
            </section>
          </div>
        </>
      ) : c.phase === "ended" ? (
        <section className="card">
          <Empty title={t("Merci pour cette séance !")}>
            {t("Retrouve tes réponses dans Mes progrès.")}
          </Empty>
        </section>
      ) : c.phase === "revealed" && q ? (
        <section className="card">
          <div className="feedback neutral">
            <h2>{t("Écoutons l’explication ensemble.")}</h2>
            <p>{q.explanation}</p>
            <p>
              {t("Référence :")} {q.answer}
            </p>
          </div>
        </section>
      ) : q ? (
        <>
          {data.attempts.length > 0 ? (
            <section className="card">
              <div className="feedback neutral">
                <CheckCircle2 />
                <h2>{t("Ta réponse est enregistrée.")}</h2>
                <p>
                  {c.phase === "revealed"
                    ? q.explanation
                    : t("Écoute ton enseignant pour la suite.")}
                </p>
                {c.phase === "revealed" && (
                  <p>
                    {t("Référence :")} {q.answer}
                  </p>
                )}
              </div>
            </section>
          ) : (
            <ClassStudent
              key={q.id + "-" + c.round}
              q={q}
              c={c}
              onError={onError}
              onDone={poll}
            />
          )}
        </>
      ) : null}
      {projector && (
        <div className="projector">
          <div className="projector-top">
            <span>
              {t("ATELIER BILINGUE ·")} {c.code}
            </span>
            <button
              className="icon-button"
              onClick={() => setProjector(false)}
              aria-label={t("Fermer le projecteur")}
            >
              <X />
            </button>
          </div>
          <div>
            <span className="eyebrow">
              {t("EXERCICE")} {c.current_index + 1} {t("· RONDE")} {c.round}
            </span>
            <h1>{c.text_visible ? q?.prompt : t("Écoute ton enseignant.")}</h1>
            <span className="badge neutral">{t(phases[c.phase])}</span>
            {c.phase === "revealed" && (
              <p className="projector-answer">{q?.explanation}</p>
            )}
          </div>
          <small>
            {t("Prends ton temps. Chaque essai est une occasion d’apprendre.")}
          </small>
        </div>
      )}
    </>
  );
}
function ClassStudent({
  q,
  c,
  onError,
  onDone,
}: {
  q: Data;
  c: Data;
  onError: (s: string) => void;
  onDone: () => Promise<void>;
}) {
  return (
    <Player
      question={q}
      activity={{ ...c, context: "classroom" }}
      assets={[]}
      onError={onError}
      onBack={onDone}
      onDone={onDone}
      onNext={onDone}
    />
  );
}
function Studio({
  questions,
  assets,
  configured,
  refresh,
  action,
  busy,
  onError,
  notify,
}: {
  questions: Data[];
  assets: Data[];
  configured: boolean;
  refresh: () => Promise<void>;
  action: (f: () => Promise<void>) => void;
  busy: boolean;
  onError: (s: string) => void;
  notify: (s: string) => void;
}) {
  const [qid, setQid] = useState(
    questions.find((q) => q.status !== "retired")?.id || questions[0]?.id || "",
  );
  const [search, setSearch] = useState(""),
    [grade, setGrade] = useState(""),
    [locale, setLocale] = useState(""),
    [status, setStatus] = useState("active");
  const [draft, setDraft] = useState<Data | null>(() => {
      const initial = questions.find((item) => item.id === qid);
      return initial ? { ...initial } : null;
    }),
    [models, setModels] = useState<Data[]>([]),
    [preferences, setPreferences] = useState<Data[]>([]),
    [model, setModel] = useState("xai/grok-tts"),
    [voice, setVoice] = useState("ara");
  const [recording, setRecording] = useState(false),
    [permissionPending, setPermissionPending] = useState(false),
    [blob, setBlob] = useState<Blob | null>(null),
    [preview, setPreview] = useState(""),
    [seconds, setSeconds] = useState(0),
    [fileName, setFileName] = useState("");
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    chunks = useRef<Blob[]>([]),
    alive = useRef(true),
    editorRef = useRef<HTMLDivElement>(null);
  const q = questions.find((q) => q.id === qid),
    selectedModel = models.find((m) => m.id === model);
  const dirty = !!(
    q &&
    draft &&
    ["title", "prompt", "script", "teacher_notes"].some(
      (k) => String(q[k] || "") !== String(draft[k] || ""),
    )
  );
  const locked = busy || recording || permissionPending || !models.length;
  const filtered = questions.filter(
    (q) =>
      (status === "active"
        ? q.status !== "retired"
        : !status || q.status === status) &&
      (!grade || Number(grade) === q.grade) &&
      (!locale || q.locale === locale) &&
      [q.id, q.title, q.prompt, q.script, t(questionSkill(q))]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
  );
  const questionAssets = assets
    .filter((a) => a.question_id === qid)
    .slice()
    .reverse();
  useEffect(() => {
    let live = true;
    api("/audio/settings")
      .then((b) => {
        if (live) {
          setModels(b.models);
          setPreferences(b.settings);
          const saved = b.settings.find((p: Data) => p.question_id === qid);
          setModel(saved?.model || "xai/grok-tts");
          setVoice(saved?.voice || "ara");
        }
      })
      .catch((e) => onError(e.message));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);
  useEffect(() => {
    if (seconds >= 300 && recording) recorder.current?.stop();
  }, [seconds, recording]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    if (!dirty && !blob) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, blob]);
  function choose(next: Data) {
    if (locked || next.id === qid) return;
    if ((dirty || blob) && !confirm(t("studio.discard"))) return;
    setBlob(null);
    setPreview("");
    setFileName("");
    setQid(next.id);
    setDraft({ ...next });
    const preference = preferences.find((p) => p.question_id === next.id);
    setModel(preference?.model || "xai/grok-tts");
    setVoice(preference?.voice || "ara");
    if (innerWidth < 760)
      requestAnimationFrame(() =>
        editorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
  }
  async function saveVersion() {
    if (!q || !draft) throw new Error(t("studio.selectPrompt"));
    if (!draft.title.trim() || !draft.prompt.trim() || !draft.script.trim())
      throw new Error("Titre, contenu élève et texte à lire requis.");
    let current = { ...q, ...draft };
    if (dirty) {
      const saved = await api("/questions", current);
      current = { ...current, id: saved.id, version: q.version + 1 };
      setQid(saved.id);
      setDraft(current);
      await refresh();
    }
    return current;
  }
  async function saveAll() {
    const current = await saveVersion();
    await api("/audio/settings", { question_id: current.id, model, voice });
    setPreferences((p) => [
      ...p.filter((x) => x.question_id !== current.id),
      { question_id: current.id, model, voice },
    ]);
    notify("studio.saved");
  }
  async function generate() {
    const current = await saveVersion();
    await api("/audio/tts", {
      question_id: current.id,
      model,
      voice,
      regenerate: true,
      request_id: crypto.randomUUID(),
    });
    setPreferences((p) => [
      ...p.filter((x) => x.question_id !== current.id),
      { question_id: current.id, model, voice },
    ]);
    await refresh();
    notify("Synthèse enregistrée. Écoutez et publiez l’audio.");
  }
  async function record() {
    if (!q) return;
    setPermissionPending(true);
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder)
        throw new Error(
          "Ce navigateur ne permet pas l’enregistrement. Vous pouvez importer un fichier audio.",
        );
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (!alive.current) {
        audioStream.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = audioStream;
      const mime = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const rec = new MediaRecorder(
        audioStream,
        mime ? { mimeType: mime } : undefined,
      );
      recorder.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        audioStream.getTracks().forEach((track) => track.stop());
        if (!alive.current) return;
        const clip = new Blob(chunks.current, { type: rec.mimeType });
        setBlob(clip);
        setPreview(URL.createObjectURL(clip));
        setFileName("");
        setRecording(false);
      };
      rec.start();
      setSeconds(0);
      setRecording(true);
      setBlob(null);
      setPreview("");
    } catch (e: any) {
      stream.current?.getTracks().forEach((track) => track.stop());
      onError(
        e.name === "NotAllowedError" ? "studio.microphoneDenied" : e.message,
      );
    } finally {
      if (alive.current) setPermissionPending(false);
    }
  }
  async function upload() {
    if (!blob || !q) return;
    const current = await saveVersion();
    const response = await fetch(
      "/api/audio/upload?question=" + encodeURIComponent(current.id),
      { method: "POST", headers: { "Content-Type": blob.type }, body: blob },
    );
    const b: any = await response.json();
    if (!response.ok) throw new Error(b.error);
    await refresh();
    notify("Audio enregistré en brouillon. Écoutez-le avant publication.");
    setBlob(null);
    setPreview("");
    setFileName("");
  }
  return (
    <>
      <PageTitle title={t("Studio d’enregistrement")} />
      <div className="studio-workspace">
        <aside className="studio-library" aria-label={t("studio.library")}>
          <div className="studio-library-tools">
            <div className="section-head">
              <h2>
                <BookOpen size={18} />
                {t("studio.library")}
              </h2>
              <span className="count">
                {filtered.length} / {questions.length}
              </span>
            </div>
            <label className="search">
              <Search size={17} />
              <input
                aria-label={t("studio.search")}
                placeholder={t("studio.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="studio-filter-grid">
              <select
                aria-label={t("Année")}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">{t("Toutes les années")}</option>
                {[1, 2, 3, 4].map((g) => (
                  <option key={g} value={g}>
                    {t("gradeLabel", { grade: g })}
                  </option>
                ))}
              </select>
              <select
                aria-label={t("Langue des exercices")}
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                <option value="">{t("FR & EN")}</option>
                <option value="fr-CA">{t("language.fr-CA")}</option>
                <option value="en-CA">{t("language.en-CA")}</option>
              </select>
              <select
                aria-label={t("Statut")}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">{t("studio.currentVersions")}</option>
                <option value="">{t("Tous les statuts")}</option>
                <option value="published">{t("Publiés")}</option>
                <option value="draft">{t("Brouillons")}</option>
                <option value="retired">{t("Archivés")}</option>
              </select>
            </div>
          </div>
          <div
            className="studio-question-list"
            role="list"
            aria-label={t("studio.questionList")}
          >
            {filtered.map((item) => (
              <div role="listitem" key={item.id}>
                <button
                  className={
                    "studio-question-row " +
                    (qid === item.id ? "is-active" : "")
                  }
                  data-question-id={item.id}
                  aria-pressed={qid === item.id}
                  disabled={locked}
                  onClick={() => choose(item)}
                >
                  <span className="studio-question-row-top">
                    <span className="studio-question-code">
                      {item.locale} · {t("gradeLabel", { grade: item.grade })} ·
                      v{item.version}
                    </span>
                    <Badge value={item.status} />
                  </span>
                  <strong>{item.title}</strong>
                  <span className="studio-question-module">
                    {t(item.module)}
                  </span>
                  <span className="studio-question-row-bottom">
                    <span>
                      {assets.some((a) => a.question_id === item.id) ? (
                        <Volume2 size={13} />
                      ) : (
                        <PenLine size={13} />
                      )}{" "}
                      {t(
                        assets.some((a) => a.question_id === item.id)
                          ? "studio.hasAudio"
                          : "studio.noAudio",
                      )}
                    </span>
                    {qid === item.id ? <ChevronRight size={16} /> : <span />}
                  </span>
                </button>
              </div>
            ))}
            {!filtered.length && (
              <Empty title={t("Aucun exercice pour ces filtres")}>
                {t("Essaie une autre année ou une autre recherche.")}
              </Empty>
            )}
          </div>
        </aside>
        <div
          className="studio-editor"
          ref={editorRef}
          aria-label={t("studio.editor")}
        >
          {q && draft ? (
            <>
              <section className="studio-section studio-text-card">
                <div className="studio-editor-heading">
                  <div>
                    <div className="eyebrow">
                      {q.id} · v{q.version} · {q.locale}
                    </div>
                    <h2>{q.title}</h2>
                    <div className="button-row">
                      <Badge value={q.status} />
                      {dirty && (
                        <span className="badge pending_manual">
                          {t("studio.unsaved")}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn"
                    disabled={locked || !models.length}
                    onClick={() => action(saveAll)}
                  >
                    <Check size={16} />
                    {busy ? t("Enregistrement…") : t("studio.save")}
                  </button>
                </div>
                <div className="studio-section-label">
                  <span>01</span>
                  <h3>{t("studio.textTitle")}</h3>
                  <PenLine size={17} />
                </div>
                <fieldset disabled={locked}>
                  <Field label={t("Titre")}>
                    <input
                      value={draft.title}
                      maxLength={200}
                      onChange={(e) =>
                        setDraft({ ...draft, title: e.target.value })
                      }
                    />
                  </Field>
                  <Field
                    label={t(
                      "Contenu visible par l’élève (jamais les réponses)",
                    )}
                  >
                    <textarea
                      rows={3}
                      value={draft.prompt}
                      maxLength={10000}
                      onChange={(e) =>
                        setDraft({ ...draft, prompt: e.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("Texte à lire / script TTS")}>
                    <textarea
                      className="studio-script-input"
                      rows={5}
                      value={draft.script}
                      maxLength={5000}
                      onChange={(e) =>
                        setDraft({ ...draft, script: e.target.value })
                      }
                    />
                  </Field>
                  <div className="studio-script-meta">
                    <span>
                      <Headphones size={14} />
                      {t("studio.scriptOnly")}
                    </span>
                    <span>{draft.script.length} / 5000</span>
                  </div>
                  <details>
                    <summary>
                      {t("Notes privées de l’enseignant et barème")}
                    </summary>
                    <Field label={t("Notes privées de l’enseignant et barème")}>
                      <textarea
                        rows={4}
                        value={draft.teacher_notes || ""}
                        onChange={(e) =>
                          setDraft({ ...draft, teacher_notes: e.target.value })
                        }
                      />
                    </Field>
                  </details>
                </fieldset>
                <div className="studio-version-note">
                  <ShieldCheck size={15} />
                  {t("studio.versionNote")}
                </div>
              </section>
              <section className="studio-section studio-tts-card">
                <div className="studio-section-label">
                  <span>02</span>
                  <h3>{t("studio.ttsTitle")}</h3>
                  <Volume2 size={17} />
                </div>
                <p>{t("studio.ttsHelp")}</p>
                <fieldset disabled={locked || !configured}>
                  <div className="form-grid">
                    <Field label={t("studio.model")}>
                      <select
                        value={model}
                        onChange={(e) => {
                          const selected = models.find(
                            (m) => m.id === e.target.value,
                          );
                          setModel(e.target.value);
                          setVoice(selected?.defaultVoice || "default");
                        }}
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t("studio.voice")}>
                      <select
                        value={voice}
                        disabled={selectedModel?.voices.length === 1}
                        onChange={(e) => setVoice(e.target.value)}
                      >
                        {(selectedModel?.voices || [voice]).map((v: string) => (
                          <option key={v} value={v}>
                            {v === "default"
                              ? t("studio.defaultVoice")
                              : v.charAt(0).toUpperCase() + v.slice(1)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="studio-tts-action">
                    <span className="studio-provider">
                      <ShieldCheck size={14} />
                      {t("studio.gateway")}
                    </span>
                    <button
                      className="btn"
                      disabled={!models.length || !draft.script.trim()}
                      onClick={() => action(generate)}
                    >
                      <RefreshCw size={16} />
                      {busy ? t("studio.generating") : t("studio.regenerate")}
                    </button>
                  </div>
                </fieldset>
                {!configured && (
                  <p className="studio-config-note">
                    {t(
                      "La liaison Cloudflare AI Gateway attend sa configuration. Les enregistrements enseignants restent disponibles.",
                    )}
                  </p>
                )}
              </section>
              <section className="studio-section studio-recording-card">
                <div className="studio-section-label">
                  <span>03</span>
                  <h3>{t("studio.recordUpload")}</h3>
                  <Mic size={17} />
                </div>
                <p>{t("studio.recordHelp")}</p>
                <div className="studio-capture-grid">
                  <div className="studio-capture">
                    <div
                      className={"record-orb " + (recording ? "recording" : "")}
                    >
                      <Mic size={25} />
                    </div>
                    <strong>
                      {recording
                        ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                        : t("Prêt à enregistrer")}
                    </strong>
                    <small>
                      {t(
                        "Microphone enseignant uniquement · 5 minutes maximum",
                      )}
                    </small>
                    {recording ? (
                      <button
                        className="btn danger"
                        onClick={() => recorder.current?.stop()}
                      >
                        <Square size={15} />
                        {t("Arrêter")}
                      </button>
                    ) : (
                      <button
                        className="btn secondary"
                        disabled={locked}
                        onClick={record}
                      >
                        <Mic size={15} />
                        {permissionPending
                          ? t("studio.microphonePending")
                          : t("Enregistrer ma voix")}
                      </button>
                    )}
                  </div>
                  <div className="studio-capture studio-upload">
                    <IconTile>
                      <Download size={23} />
                    </IconTile>
                    <h3>{t("studio.uploadTitle")}</h3>
                    <p>{t("studio.uploadFormats")}</p>
                    <label
                      className={
                        "btn secondary studio-upload-button " +
                        (locked ? "is-disabled" : "")
                      }
                    >
                      {t("studio.chooseFile")}
                      <input
                        aria-label={t("studio.chooseFile")}
                        type="file"
                        disabled={locked}
                        accept="audio/webm,audio/mp4,audio/mpeg,audio/ogg,audio/wav"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 20 * 1024 * 1024) {
                            onError("Le fichier doit être inférieur à 20 Mo.");
                            e.target.value = "";
                            return;
                          }
                          if (
                            !/^audio\/(webm|mp4|mpeg|ogg|wav|x-wav)(;.*)?$/.test(
                              file.type,
                            )
                          ) {
                            onError("Format audio non pris en charge.");
                            e.target.value = "";
                            return;
                          }
                          setBlob(
                            file.type === "audio/x-wav"
                              ? new Blob([file], { type: "audio/wav" })
                              : file,
                          );
                          setPreview(URL.createObjectURL(file));
                          setFileName(file.name);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
                {preview && (
                  <div className="studio-preview">
                    <div className="section-head">
                      <strong>
                        {fileName || t("studio.recordingPreview")}
                      </strong>
                      <Badge value="draft" />
                    </div>
                    <audio controls src={preview} />
                    <div className="button-row">
                      <button
                        className="btn"
                        disabled={locked}
                        onClick={() => action(upload)}
                      >
                        <Check size={16} />
                        {t("Enregistrer le brouillon")}
                      </button>
                      <button
                        className="text-button"
                        disabled={locked}
                        onClick={() => {
                          setBlob(null);
                          setPreview("");
                          setFileName("");
                        }}
                      >
                        <Trash2 size={15} />
                        {t("Supprimer")}
                      </button>
                    </div>
                  </div>
                )}
              </section>
              <section className="studio-section studio-audio-history">
                <div className="section-head">
                  <h3>{t("Les versions audio de cet exercice")}</h3>
                  <span className="count">{questionAssets.length}</span>
                </div>
                {questionAssets.length ? (
                  questionAssets.map((a) => (
                    <div className="studio-audio-version" key={a.id}>
                      <div className="section-head">
                        <div>
                          <strong>
                            {t(
                              a.kind === "teacher"
                                ? "Voix de l’enseignant"
                                : "Voix IA · TTS",
                            )}
                          </strong>
                          <small>
                            {a.model || t("studio.uploadedRecording")}
                            {a.voice ? " · " + a.voice : ""}
                          </small>
                        </div>
                        <Badge value={a.status} />
                      </div>
                      <audio
                        src={"/api/audio/" + a.id + "/file"}
                        controls
                        preload="none"
                      />
                      <button
                        className="btn secondary"
                        disabled={locked}
                        onClick={() =>
                          action(async () => {
                            await api("/audio/" + a.id + "/publish", {
                              withdraw: a.status === "published",
                            });
                            await refresh();
                            notify(
                              a.status === "published"
                                ? "Audio retiré."
                                : "Audio publié pour les élèves.",
                            );
                          })
                        }
                      >
                        {t(
                          a.status === "published"
                            ? "Retirer"
                            : "Écouté et vérifié · Publier",
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="studio-audio-empty">
                    <Headphones size={26} />
                    <p>{t("studio.audioEmpty")}</p>
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="studio-section">
              <Empty title={t("studio.selectPrompt")} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
function LoginRedirect() {
  useEffect(() => {
    location.replace(
      "/login?next=" +
        encodeURIComponent(location.pathname + location.search + location.hash),
    );
  }, []);
  return <div className="loading">{t("Ouverture de ton atelier…")}</div>;
}
function Root() {
  const { i18n: current } = useTranslation();
  const path = location.pathname.replace(/\/+$/, "") || "/";
  useEffect(() => {
    const section =
      path === "/"
        ? "marketing"
        : path === "/login"
          ? "login"
          : path === "/signup"
            ? "signup"
            : "page";
    document.title = t(
      section === "page" ? "page.title" : section + ".metaTitle",
    );
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          section === "page"
            ? "page.description"
            : section + ".metaDescription",
        ),
      );
  }, [path, current.resolvedLanguage]);
  useEffect(() => {
    if (path === "/" && location.hash) {
      try {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: "start" });
      } catch {}
    }
  }, [path]);
  if (["/verify-email","/forgot-password","/reset-password","/resend-verification"].includes(path)) return <EmailActions mode={path === "/resend-verification" ? "check-email" : path.slice(1) as "verify-email"|"forgot-password"|"reset-password"}/>;
  if (path === "/") return <MarketingPage />;
  if (path === "/login" || path === "/signup")
    return (
      <Auth
        mode={path === "/signup" ? "signup" : "login"}
        onLogin={async (user) => {
          location.assign(
            authDestination(
              user.role,
              new URLSearchParams(location.search).get("next"),
              location.origin,
            ),
          );
        }}
      />
    );
  return <App />;
}
createRoot(document.getElementById("root")!).render(<Root />);
