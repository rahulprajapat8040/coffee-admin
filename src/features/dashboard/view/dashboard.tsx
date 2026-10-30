import { PageHeader } from "@/components/common/page/page-header"
import { Stat } from "../components/dashboard-stat";

export const Dashboard = ()=> {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Good evening"
          title="Here's how the counter looks"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl bg-espresso p-6 md:col-span-1">
            <p className="text-sm text-cream-active">Revenue</p>
            <p className="mt-3 font-display text-4xl font-semibold text-cream">
              {100}
            </p>
            <p className="mt-2 text-xs text-cream-active">
              {12} orders all time
            </p>
            <span className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full border-18 border-roast" />
          </div>
          <Stat
            label="Open orders"
            value={5}
            hint="pending · brewing · ready"
          />
          <Stat label="Menu" value={10} hint={`${10} categories`} />
        </div>
      </div>
    );
}