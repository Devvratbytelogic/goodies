"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string | null;
};

type AccountProfileContextValue = {
  profile: AccountProfile;
  password: string;
  updateProfile: (profile: AccountProfile) => void;
  changePassword: (password: string) => void;
};

const AccountProfileContext = createContext<AccountProfileContextValue | null>(null);

function profileFromUser(name: string, email: string, phone: string, photo: string | null): AccountProfile {
  const [firstName, ...rest] = name.trim().split(/\s+/);

  return {
    firstName: firstName || name,
    lastName: rest.join(" "),
    email,
    phone,
    photo,
  };
}

export function AccountProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() =>
    profileFromUser(user?.name ?? "", user?.email ?? "", user?.phone ?? "", user?.photo ?? null),
  );
  const [password, setPassword] = useState("");

  function updateProfile(next: AccountProfile) {
    setProfile((current) => {
      if (current.photo && current.photo !== next.photo && current.photo.startsWith("blob:")) {
        URL.revokeObjectURL(current.photo);
      }

      return next;
    });
  }

  return (
    <AccountProfileContext.Provider value={{ profile, password, updateProfile, changePassword: setPassword }}>
      {children}
    </AccountProfileContext.Provider>
  );
}

export function useAccountProfile() {
  const profile = useContext(AccountProfileContext);

  if (!profile) {
    throw new Error("useAccountProfile must be used within AccountProfileProvider");
  }

  return profile;
}
