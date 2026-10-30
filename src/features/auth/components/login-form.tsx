import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Eye, LucideEyeClosed, LucideLock } from "lucide-react";
import { useState } from "react";

export const LoginForm = ()=> {
    const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <form className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input placeholder="you@youcafe.com" />
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input placeholder="••••••••" type={open ? "text" : "password"} />
            <Button
              onClick={() => setOpen((open) => !open)}
              type="button"
              size={"icon"}
              variant={"ghost"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              {!open ? <Eye className="size-4" /> : <LucideEyeClosed />}
            </Button>
          </div>
        </div>
        <Button className="mt-5 flex w-full">
          <LucideLock /> Unlock the counter
        </Button>
      </form>
    </div>
  );
}