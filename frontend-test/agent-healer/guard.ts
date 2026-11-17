import path from "node:path";
import { config } from "./config";

const DRIVE = /^([a-zA-Z]):/;

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, "/").replace(DRIVE, (_, drive: string) => `${drive.toLowerCase()}:`);
}

function isAbsolute(p: string): boolean {
  return p.startsWith("/") || /^[a-z]:\//.test(p);
}

function stripTrailingSlash(p: string): string {
  return p.length > 1 && p.endsWith("/") && !/^[a-z]:\/$/.test(p) ? p.slice(0, -1) : p;
}

export function toRepoPath(filePath: string, repoRoot: string): string | null {
  const root = stripTrailingSlash(path.posix.normalize(normalizeSlashes(repoRoot)));
  const file = normalizeSlashes(filePath);
  const full = path.posix.normalize(isAbsolute(file) ? file : `${root}/${file}`);
  if (full === root) return "";
  const prefix = root.endsWith("/") ? root : `${root}/`;
  return full.startsWith(prefix) ? full.slice(prefix.length) : null;
}

export function isEditableRepoPath(repoPath: string): boolean {
  const rel = path.posix.normalize(normalizeSlashes(repoPath));
  if (rel.startsWith("../") || isAbsolute(rel)) return false;
  return config.editableDirs.some((dir) => rel.startsWith(dir) && rel.length > dir.length);
}

export function isEditAllowed(filePath: string, repoRoot: string): boolean {
  const rel = toRepoPath(filePath, repoRoot);
  return rel !== null && isEditableRepoPath(rel);
}
