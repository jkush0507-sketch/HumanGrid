import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { HumanGridAI } from "../components/ai/HumanGridAI";
import type { ServiceMode } from "../types";

const SERVICE_MODES: ServiceMode[] = [
  "hospital",
  "blood_bank",
  "police",
  "ambulance",
  "women_safety",
  "child_safety",
  "food_support",
  "shelter",
  "general_emergency",
];

function isServiceMode(
  value: string | null
): value is ServiceMode {
  return (
    value !== null &&
    SERVICE_MODES.includes(value as ServiceMode)
  );
}

export default function AIChat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlMode = searchParams.get("mode");

  const initialMode: ServiceMode = isServiceMode(urlMode)
    ? urlMode
    : "general_emergency";

  const [mode, setMode] =
    useState<ServiceMode>(initialMode);

  function handleModeChange(
    nextMode: ServiceMode
  ): void {
    setMode(nextMode);

    setSearchParams(
      {
        mode: nextMode,
      },
      {
        replace: true,
      }
    );
  }

  function handleClose(): void {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/dashboard", {
      replace: true,
    });
  }

  function handleOpenSOS(): void {
    navigate("/sos");
  }

  return (
    <HumanGridAI
      mode={mode}
      onModeChange={handleModeChange}
      onClose={handleClose}
      onOpenSOS={handleOpenSOS}
    />
  );
}