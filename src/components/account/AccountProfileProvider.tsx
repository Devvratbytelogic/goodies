"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { sampleProfile } from "@/data/sampleAccount";

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

const initialProfile: AccountProfile = {
  firstName: sampleProfile.firstName,
  lastName: sampleProfile.lastName,
  email: sampleProfile.email,
  phone: sampleProfile.phone,
  photo: null,
};

export function AccountProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(initialProfile);
  const [password, setPassword] = useState("Goodies1!");

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
