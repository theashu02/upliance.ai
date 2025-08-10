import { Eye, FileCheck2 } from "lucide-react"

export default function LandingPage() {
  const baseButtonStyles =
    "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-4"
  const primaryButtonStyles =
    "bg-stone-800 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-indigo-300 active:scale-95"
  const secondaryButtonStyles =
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-slate-200 active:scale-95"

  return (
    <main className="min-h-screen bg-[#f8f2dc] font-poppins">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" aria-hidden="true" />
        <div className="container mx-auto flex px-6 py-16 lg:py-24 h-screen justify-center items-center">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#f4f4f4] px-3 py-1 text-xl font-medium text-indigo-700 mb-4">
            Upliance.ai Form Builder
            </span>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build dynamic forms in minutes
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              A dynamic form builder using React, TypeScript, MUI, and localStorage. Create forms with customizable
              fields and validations, preview the end-user experience, and manage a list of saved forms—all in your
              browser.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/preview"
                className={`${baseButtonStyles} ${primaryButtonStyles}`}
                aria-label="Preview a form"
              >
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </a>
              <a
                href="/my-forms"
                className={`${baseButtonStyles} ${secondaryButtonStyles}`}
                aria-label="View my saved forms"
              >
                <FileCheck2 className="h-5 w-5" />
                <span>My Forms</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}