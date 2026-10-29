import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Lead } from "@/domain/types";

const FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/leads/leads.json",
);

const memory = new Map<string, Lead>();
let loaded = false;

function loadFromDisk(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = readFileSync(FILE, "utf8");
    const rows = JSON.parse(raw) as Lead[];
    for (const lead of rows) memory.set(lead.id, lead);
  } catch {
    // First run, or no file yet.
  }
}

function persist(): void {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify([...memory.values()], null, 2), "utf8");
}

export function saveLead(lead: Lead): Lead {
  loadFromDisk();
  memory.set(lead.id, lead);
  try {
    persist();
  } catch {
    // Vercel and similar may not allow writes. Memory still holds it.
  }
  return lead;
}

export function getLead(id: string): Lead | undefined {
  loadFromDisk();
  return memory.get(id);
}

export function findLeadByPhone(phone: string): Lead | undefined {
  loadFromDisk();
  for (const lead of memory.values()) {
    if (lead.phone === phone) return lead;
  }
  return undefined;
}
