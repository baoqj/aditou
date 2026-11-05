import { ActivityTracker } from "./ActivityTracker";
import { hasAnswer } from "../answers";
import { questionSkill } from "../skills";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  ClipboardList,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { api, type Data } from "../api";
import { t } from "../i18n";
import { QuestionPreparation } from "./QuestionPreparation";
import { QuestionAudio } from "./QuestionAudio";
type AnswerProps = {
  question: Data;
  answer: string;
  onChange: (s: string) => void;
  onError: (s: string) => void;
};
export function AssessmentPlayer({
  runId,
  accountKey,
  renderAnswer,
  onBack,
  onSubmitted,
  onError,
}: {
  runId: string;
  accountKey: string;
  renderAnswer: (props: AnswerProps) => ReactNode;
  onBack: () => void;
  onSubmitted: () => Promise<void>;
  onError: (s: string) => void;
}) {
  const [data, setData] = useState<Data | null>(null),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [source, setSource] = useState("none"),
    [busy, setBusy] = useState(false),
    [navExpanded, setNavExpanded] = useState(false),
    [confirmation, setConfirmation] = useState<"exit" | "submit" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirmation) {
      dialog.current?.showModal();
      cancelButton.current?.focus();
    } else dialog.current?.close();
  }, [confirmation]);
  const panel = useRef<HTMLDivElement>(null),
    revision = useRef(0),
    answerRef = useRef(""),
    sourceRef = useRef("none");
  const draftKey = "aditou.run-draft:" + accountKey + ":" + runId;
  function show(next: Data, i: number) {
    const q = next.questions[i];
    let a = next.answers[q.id] || { answer: "", audio_source: "none" };
    if (next.run.status === "draft") {
      try {
        const cached = JSON.parse(localStorage.getItem(draftKey) || "{}");
        if (cached[q.id]) a = cached[q.id];
      } catch {}
    }
    setIndex(i);
    setAnswer(a.answer);
    answerRef.current = a.answer;
    setSource(a.audio_source);
    sourceRef.current = a.audio_source;
  }
  useEffect(() => {
    let live = true;
    api("/runs/" + runId)
      .then((d) => {
        if (live) {
          setData(d);
          revision.current = d.run.revision;
          show(d, 0);
        }
      })
      .catch((e) => onError(e.message));
    return () => {
      live = false;
    };
  }, [runId]);
  useEffect(() => {
    if (!data || busy || confirmation) return;
    const frame = requestAnimationFrame(() => {
      const input = panel.current?.querySelector<HTMLElement>(
        data.run.status === "draft"
          ? "input:not([type=checkbox]):not([type=file]):not([disabled]),textarea:not([disabled]),select:not([disabled])"
          : "[data-review-next]",
      );
      (
        input ||
        panel.current?.querySelector<HTMLElement>(
          ".question-response input,.question-response button:not([disabled])",
        )
      )?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [index, data?.run.status, busy, confirmation]);
  function update(value: string) {
    setAnswer(value);
    answerRef.current = value;
    if (data?.run.status === "draft") {
      try {
        const cache = JSON.parse(localStorage.getItem(draftKey) || "{}");
        cache[data.questions[index].id] = {
          answer: value,
          audio_source: sourceRef.current,
        };
        localStorage.setItem(draftKey, JSON.stringify(cache));
      } catch {}
    }
  }
  async function save() {
    if (!data || data.run.status !== "draft") return;
    const q = data.questions[index];
    const result = await api(
      "/runs/" + runId,
      {
        revision: revision.current,
        question_id: q.id,
        answer: answerRef.current,
        audio_source: sourceRef.current,
      },
      "PUT",
    );
    revision.current = result.revision;
    data.answers[q.id] = {
      answer: answerRef.current,
      audio_source: sourceRef.current,
    };
    data.run.revision = result.revision;
  }
  async function move(i: number) {
    if (!data || busy) return;
    setBusy(true);
    try {
      await save();
      show(data, i);
    } catch (e: any) {
      onError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (!data || busy) return;
    setBusy(true);
    try {
      await save();
      const next = await api("/runs/" + runId + "/submit", {
        revision: revision.current,
      });
      setConfirmation(null);
      setData(next);
      revision.current = next.run.revision;
      localStorage.removeItem(draftKey);
      show(next, 0);
      await onSubmitted();
    } catch (e: any) {
      onError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function leave() {
    if (busy) return;
    setBusy(true);
    try {
      await save();
      onBack();
    } catch (e: any) {
      onError(e.message);
      setBusy(false);
    }
  }
  function requestSubmit() {
    if (data?.run.mode === "exam") setConfirmation("submit");
    else void submit();
  }
  if (!data) return <div className="loading">{t("learn.loadingSet")}</div>;
  const q = data.questions[index],
    locked = data.run.status !== "draft",
    summary = data.summary;
  const isExam = data.run.mode === "exam";
  const unanswered = data.questions.filter(
    (item: Data) =>
      !hasAnswer(
        item,
        String(item.id === q.id ? answer : data.answers[item.id]?.answer || ""),
      ),
  ).length;
  const finished = unanswered === 0;
  return (
    <div className="assessment-page">
      <div className="player-top">
        <button
          className="text-button"
          disabled={busy}
          onClick={() => {
            if (isExam && !locked) setConfirmation("exit");
            else void leave();
          }}
        >
          <ArrowLeft size={17} />
          {t("Retour à mon atelier")}
        </button>
        {isExam && !locked && (
          <button
            type="button"
            className="btn secondary exam-exit"
            disabled={busy}
            onClick={() => setConfirmation("exit")}
          >
            <LogOut size={16} />
            {t("exam.exit")}
          </button>
        )}
        <span className="badge neutral">
          {t(
            data.run.mode === "exam"
              ? "learn.mode.exam"
              : "learn.mode.homework",
          )}
        </span>
      </div>
      <div className="assessment-heading">
        <div>
          <h1>
            {data.run.mode === "homework"
              ? data.run.title
              : t("learn.examTitle")}
          </h1>
          <p>{t(locked ? "learn.readOnly" : "learn.setInstructions")}</p>
        </div>
        <span className="badge neutral">
          {index + 1} / {data.questions.length}
        </span>
      </div>
      {locked && (
        <section
          className="assessment-summary card"
          aria-label={t("learn.setResult")}
        >
          {summary ? (
            <>
              <h2>
                {t(
                  summary.pending
                    ? "learn.provisionalResult"
                    : "learn.setResult",
                )}
              </h2>
              <div className="assessment-statistics">
                <div>
                  <strong>
                    {summary.score} / {summary.max_score}
                  </strong>
                  <span>{t("learn.score")}</span>
                </div>
                <div>
                  <strong>{summary.correct}</strong>
                  <span>{t("learn.correctCount")}</span>
                </div>
                <div>
                  <strong>{summary.incorrect}</strong>
                  <span>{t("learn.incorrectCount")}</span>
                </div>
                <div>
                  <strong>{summary.partial}</strong>
                  <span>{t("learn.partialCount")}</span>
                </div>
                <div>
                  <strong>{summary.pending}</strong>
                  <span>{t("learn.pendingCount")}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <LockKeyhole size={23} />
              <h2>{t("learn.homeworkSubmitted")}</h2>
              <p>{t("learn.teacherWillGrade")}</p>
            </>
          )}
        </section>
      )}
      <div className="assessment-body">
        <aside
          className={
            "assessment-nav-panel " + (navExpanded ? "is-expanded" : "")
          }
        >
          <h2>{t("layout.questions")}</h2>
          <button
            type="button"
            className="assessment-nav-toggle"
            aria-expanded={navExpanded}
            aria-controls="assessment-question-numbers"
            onClick={() => setNavExpanded(!navExpanded)}
          >
            {t("layout.questions")}{" "}
            <span>
              {index + 1}/{data.questions.length}
            </span>
            <ChevronDown size={15} />
          </button>
          <nav
            id="assessment-question-numbers"
            className="assessment-question-nav"
            aria-label={t("learn.paperNavigation")}
          >
            {data.questions.map((item: Data, i: number) => (
              <button
                key={item.id}
                type="button"
                disabled={busy}
                aria-current={i === index ? "step" : undefined}
                className={
                  (i === index ? "current " : "") +
                  (hasAnswer(
                    item,
                    String(
                      item.id === q.id
                        ? answer
                        : data.answers[item.id]?.answer || "",
                    ),
                  )
                    ? "answered"
                    : "")
                }
                onClick={() => {
                  void move(i);
                  setNavExpanded(false);
                }}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </aside>
        <section
          className="card player-card assessment-question"
          ref={panel}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.altKey &&
              !e.ctrlKey &&
              !e.metaKey
            ) {
              const target = e.target as HTMLElement;
              if (
                target.closest(".question-audio-tools,.question-preparation") ||
                target.tagName === "BUTTON" ||
                target.tagName === "SELECT"
              )
                return;
              e.preventDefault();
              if (!locked) {
                if (index < data.questions.length - 1) void move(index + 1);
                else if (isExam || finished) requestSubmit();
              } else if (index < data.questions.length - 1)
                void move(index + 1);
            }
          }}
        >
          <ActivityTracker questionId={q.id} context={isExam ? "private" : "assignment"} contextId={data.run.assignment_id || ""} enabled={!locked}/>
          <div className="section-head">
            <span className="eyebrow">
              {t(questionSkill(q))} · {q.locale}
            </span>
            <QuestionAudio
              key={q.id}
              questionId={q.id}
              accountKey={accountKey}
              onSource={(s) => {
                setSource(s);
                sourceRef.current = s;
              }}
            />
          </div>
          <div className="assessment-question-content">
            <h2>{q.title}</h2>
            <div className="assessment-question-reading">
              <div className="question-prompt">{q.prompt}</div>
              <QuestionPreparation
                preparation={q.preparation}
                teacherOnly={q.audio_policy === "teacher_only"}
              />
            </div>
            {locked ? (
              <div className="assessment-saved-answer">
                <strong>{t("Ta réponse")}</strong>
                {answer.startsWith("data:image/") ? (
                  <img
                    className="answer-image"
                    src={answer}
                    alt={t("Mon travail")}
                  />
                ) : (
                  <p className="answer-text">{answer || t("exam.noAnswer")}</p>
                )}
                {q.reference && (
                  <div className="feedback neutral">
                    <h3>{t("Réponse de référence :")}</h3>
                    <p>{q.reference.answer}</p>
                    <p>{q.reference.explanation}</p>
                    {data.results.find((a: Data) => a.question_id === q.id)
                      ?.feedback && (
                      <p>
                        {
                          data.results.find((a: Data) => a.question_id === q.id)
                            .feedback
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <fieldset disabled={busy}>
                <div key={q.id}>
                  {renderAnswer({
                    question: q,
                    answer,
                    onChange: update,
                    onError,
                  })}
                </div>
              </fieldset>
            )}
          </div>
          <div className="assessment-actions">
            <button
              type="button"
              className="btn secondary"
              disabled={busy || index === 0}
              onClick={() => move(index - 1)}
            >
              <ArrowLeft size={16} />
              {t("Précédent")}
            </button>
            {index < data.questions.length - 1 ? (
              <button
                type="button"
                data-review-next
                className="btn"
                disabled={busy}
                onClick={() => move(index + 1)}
              >
                {t("Suivant")}
                <ArrowRight size={16} />
              </button>
            ) : !locked ? (
              <button
                type="button"
                className="btn"
                disabled={busy || (!isExam && !finished)}
                onClick={requestSubmit}
              >
                <Check size={17} />
                {t(busy ? "Envoi…" : "learn.submitSet")}
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                data-review-next
                onClick={onBack}
              >
                {t("learn.finishReview")}
                <Check size={17} />
              </button>
            )}
          </div>
          {!locked && (
            <p className="assessment-save-note">
              {t(
                index === data.questions.length - 1 && !finished
                  ? isExam
                    ? "exam.blanksAllowed"
                    : "learn.answerAll"
                  : "learn.enterNext",
              )}
            </p>
          )}
        </section>
      </div>
      <dialog
        ref={dialog}
        className="exam-confirm-dialog"
        aria-labelledby="exam-confirm-title"
        aria-describedby="exam-confirm-description"
        onCancel={(e) => {
          e.preventDefault();
          if (!busy) setConfirmation(null);
        }}
      >
        <h2 id="exam-confirm-title">
          {t(confirmation === "exit" ? "exam.exitTitle" : "exam.submitTitle")}
        </h2>
        <p id="exam-confirm-description">
          {t(
            confirmation === "exit"
              ? "exam.exitDescription"
              : "exam.submitDescription",
          )}
        </p>
        <p>{t("exam.irreversible")}</p>
        {unanswered > 0 && (
          <p className="exam-blank-warning" role="status">
            {t("exam.blankWarning", { count: unanswered })}
          </p>
        )}
        <div className="exam-confirm-actions">
          <button
            type="button"
            ref={cancelButton}
            className="btn secondary"
            disabled={busy}
            onClick={() => setConfirmation(null)}
          >
            {t("exam.keepWorking")}
          </button>
          {confirmation === "exit" && (
            <button
              type="button"
              className="btn secondary"
              disabled={busy}
              onClick={() => void leave()}
            >
              {t("exam.exitWithoutSubmitting")}
            </button>
          )}
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() => void submit()}
          >
            {t(busy ? "Envoi…" : "exam.confirmSubmit")}
          </button>
        </div>
      </dialog>
    </div>
  );
}
export function AssessmentHistory({
  accountKey,
  onOpen,
}: {
  accountKey: string;
  onOpen: (id: string) => void;
}) {
  const [runs, setRuns] = useState<Data[]>([]);
  useEffect(() => {
    let live = true;
    api("/runs")
      .then((b) => {
        if (live) setRuns(b.runs);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [accountKey]);
  if (!runs.length) return null;
  return (
    <section className="assessment-history">
      <div className="section-head">
        <h2>
          <ClipboardList size={20} />
          {t("learn.mySets")}
        </h2>
      </div>
      {runs.map((r) => (
        <div className="card assessment-run-card" key={r.id} data-run-id={r.id}>
          <div>
            <span className="eyebrow">
              {t(r.mode === "exam" ? "learn.mode.exam" : "learn.mode.homework")}
            </span>
            <h3>{r.mode === "exam" ? t("learn.examTitle") : r.title}</h3>
            <span className="badge neutral">
              {t(
                r.status === "draft"
                  ? "Brouillon"
                  : r.status === "graded"
                    ? "learn.graded"
                    : "learn.waitingGrade",
              )}
            </span>
          </div>
          <button className="btn secondary" onClick={() => onOpen(r.id)}>
            {t(r.status === "draft" ? "Continuer" : "learn.reviewSet")}
            <ArrowRight size={16} />
          </button>
        </div>
      ))}
    </section>
  );
}
