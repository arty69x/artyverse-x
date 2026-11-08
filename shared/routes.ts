/** Pure route metadata; importing this never initializes document validators. */
export const kindRoutes: Record<string, string> = {
  document: "create",
  conversation: "chat",
  note: "research",
  recording: "library",
  session: "live",
  workflow: "automate",
  preset: "design",
  project: "projects",
  code: "code",
  composition: "sound",
  scene: "dynamics",
  story: "story",
  "agent-run": "agents",
};

/** One resolver for saved records, including specialized interview sessions. */
export function routeForItem(item:{kind:string;data:Record<string,any>}){if(item.kind==='session'&&['copilot','practice'].includes(item.data.sessionType))return item.data.sessionType;if(item.kind==='note'&&item.data.noteType==='question')return 'questions';return kindRoutes[item.kind]||'library'}
