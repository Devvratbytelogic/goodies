import type { ReactNode } from "react";
import AccountNav from "@/components/account/AccountNav";
import { AccountProfileProvider } from "@/components/account/AccountProfileProvider";

export default function MyAccountLayout({ children }: { children: ReactNode }) {
  return (
    <AccountProfileProvider>
      <div className="container section_y_space">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AccountProfileProvider>
  );
}
