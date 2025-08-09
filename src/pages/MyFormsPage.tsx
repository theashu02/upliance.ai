import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setForms, openForm, type Field } from "../store/slices/previewSlice";
import { Inbox, ArrowRight, FileText } from "lucide-react";

export default function MyFormsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { forms } = useAppSelector((s) => s.preview);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => {
      try {
        return Array.isArray(JSON.parse(localStorage.getItem(k) || ""));
      } catch {
        return false;
      }
    });
    dispatch(setForms(keys));
  }, [dispatch]);

  const handleOpen = (name: string) => {
    const raw = localStorage.getItem(name);
    if (!raw) return;
    const schema: Field[] = JSON.parse(raw);
    dispatch(openForm({ name, fields: schema }));
    navigate("/preview");
  };

  return (
    <>
      <section className="w-full">
        <div className="p-3">
          <header className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-medium font-poppins tracking-tight">
              Saved Forms
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Browse your saved schemas and click to open.
            </p>
          </header>

          {forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-[#f8f2dc]/80 dark:bg-[#f8f2dc]/90 p-10 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Inbox className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-base font-medium">No saved schemas.</p>
              <p className="mt-1 text-sm text-neutral-800">
                When you save a form, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {forms.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleOpen(name)}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-none"
                  aria-label={`Open ${name}`}
                >
                  {/* subtle gradient edge */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
                  />

                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-emerald-600 ring-1 ring-inset ring-emerald-100 bg-emerald-700/30 dark:text-emerald-300 dark:ring-emerald-800/50">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold leading-6 text-gray-200">
                        {name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-200">
                        {"Click to open this saved schema."}
                      </p>
                    </div>

                    <ArrowRight
                      className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                      aria-hidden="true"
                    />
                  </div>

                  {/* hover halo */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "radial-gradient(600px circle at var(--x, 0px) var(--y, 0px), rgba(16,185,129,0.07), transparent 40%)",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
