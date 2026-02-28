declare const process: {
  env: Record<string, string | undefined>;
  exit: (code?: number) => never;
};

declare module 'node:child_process' {
  export function execFile(
    file: string,
    args: string[],
    options: { maxBuffer?: number },
    callback: (error: Error | null, stdout: string, stderr: string) => void
  ): void;
}
