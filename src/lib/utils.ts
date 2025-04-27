
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasOnboarded(): boolean {
  return localStorage.getItem("evolight-onboarded") === "true";
}

export function setOnboarded(): void {
  localStorage.setItem("evolight-onboarded", "true");
}
