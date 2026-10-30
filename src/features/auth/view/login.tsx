import { Coffee } from "lucide-react";
import { LoginForm } from "../components/login-form";

export const Login = ()=> {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream p-6">
        <div className="w-full max-w-md rounded-2xl bg-card px-8 py-9 shadow-[0_24px_60px_-30px_rgba(69,43,27,0.45)] space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-espresso text-cream">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">
                  Bean&nbsp;Counter
                </p>
                <p className="text-xs text-muted-foreground">Staff terminal</p>
              </div>
            </div>
            <span className="-rotate-6 rounded-lg border-2 border-roast px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-roast opacity-80">
              Staff only
            </span>
          </div>

          <div className="relative -mx-8 my-7 border-t border-dashed border-input">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cream" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cream" />
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">
            {"Good coffee awaits."}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to run the counter.
          </p>
          <LoginForm />
          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            The till, the menu and the orders stay behind this door — this
            terminal is for staff.
          </p>
        </div>
      </div>
    );
}