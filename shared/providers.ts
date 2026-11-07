export type ProviderStatus = "unavailable" | "ready";
export type AIRequest = {
  messages: { role: "user" | "assistant"; content: string }[];
  signal: AbortSignal;
};
export interface AIProvider {
  readonly id: string;
  readonly status: ProviderStatus;
  generate(request: AIRequest): AsyncIterable<string>;
}
export class UnavailableAIProvider implements AIProvider {
  readonly id = "not-connected";
  readonly status = "unavailable" as const;
  async *generate(_request: AIRequest): AsyncIterable<string> {
    throw new Error("AI provider not connected. Your input remains available.");
  }
}
export interface AutomationProvider {
  readonly status: ProviderStatus;
  execute(
    action: string,
    input: unknown,
    signal: AbortSignal,
  ): Promise<unknown>;
}
export const unavailableAutomation: AutomationProvider = {
  status: "unavailable",
  async execute() {
    throw Error("External automation is not connected. Use a local workflow.");
  },
};
