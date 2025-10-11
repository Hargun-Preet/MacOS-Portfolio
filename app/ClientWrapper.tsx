"use client";

import { useSettings } from "@/components/Settings/SettingsContext";
import { PartyModeOverlay } from "@/components/Settings/PartyModeOverlay";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  return (
    <>
      {children}
      
      {settings.partyMode && <PartyModeOverlay />}
    </>
  );
}