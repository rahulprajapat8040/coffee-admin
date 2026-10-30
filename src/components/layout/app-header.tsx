import { Menu } from "lucide-react";

export const AppHeader = ()=> {
    return (
      <header className="flex h-16 items-center gap-3 border-b bg-card px-5 lg:px-8">
        <button
          className="lg:hidden"
          //   onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-muted-foreground">Bilzen, Tanjungbalai</p>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">Rahul P.</p>
            <p className="text-xs text-muted-foreground">Owner</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-cream-active font-display text-sm font-semibold text-roast">
            R
          </div>
        </div>
      </header>
    );
}