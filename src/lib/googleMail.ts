/**
 * Neev Privacy Architecture: Gmail Read/Write Features Blocked
 * Specification: Neev_Family_Network_Privacy_and_Implementation_Master.md (Section 48)
 *
 * POLICY DIRECTIVE:
 * Neev is a multigenerational family operating system and privacy graph.
 * In accordance with our non-negotiable privacy boundary, Neev strictly blocks
 * reading, parsing, indexing, or writing personal emails.
 *
 * All function interfaces and data contracts are preserved to prevent runtime breaks,
 * but direct Gmail access is intercepted and blocked.
 */

export interface GMailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
    parts?: { mimeType: string; body: { data?: string } }[];
    body?: { data?: string };
    mimeType?: string;
  };
  internalDate: string;
  labelIds: string[];
}

export interface GMailListItem {
  id: string;
  threadId: string;
}

export interface GMailLabel {
  id: string;
  name: string;
  type: string;
}

export interface ParsedMail {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  fromName: string;
  date: Date;
  snippet: string;
  isUnread: boolean;
  labelIds: string[];
}

export const GMAIL_BLOCKED_NOTICE =
  "Gmail access is blocked by Neev Sanctuary Privacy Policy (Section 48). Neev operates strictly on family graph and calendar logistics, never reading or writing personal email communications.";

export async function listMessages(
  _token: string,
  _opts: { q?: string; maxResults?: number; labelIds?: string[] } = {}
): Promise<GMailListItem[]> {
  console.info("[Neev Sanctuary Privacy] listMessages blocked by policy.");
  return [];
}

export async function getMessage(_token: string, messageId: string): Promise<GMailMessage> {
  console.info(`[Neev Sanctuary Privacy] getMessage(${messageId}) blocked by policy.`);
  return {
    id: messageId,
    threadId: "blocked",
    snippet: GMAIL_BLOCKED_NOTICE,
    payload: { headers: [{ name: "subject", value: "Gmail Blocked by Privacy Policy" }] },
    internalDate: String(Date.now()),
    labelIds: ["BLOCKED"],
  };
}

export async function parsedMessage(_token: string, _messageId: string): Promise<ParsedMail | null> {
  return null;
}

export async function fetchInbox(_token: string, _maxResults = 25): Promise<ParsedMail[]> {
  console.info("[Neev Sanctuary Privacy] fetchInbox blocked by policy.");
  return [];
}

export async function searchMail(_token: string, _query: string, _maxResults = 20): Promise<ParsedMail[]> {
  console.info("[Neev Sanctuary Privacy] searchMail blocked by policy.");
  return [];
}

export async function fetchSchoolMails(_token: string): Promise<ParsedMail[]> {
  console.info("[Neev Sanctuary Privacy] fetchSchoolMails blocked by policy.");
  return [];
}

export async function listLabels(_token: string): Promise<GMailLabel[]> {
  return [
    { id: "SANCTUARY", name: "Sanctuary (Protected)", type: "user" },
  ];
}

export async function getProfile(_token: string): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number }> {
  return {
    emailAddress: "sanctuary-protected@neev.internal",
    messagesTotal: 0,
    threadsTotal: 0,
  };
}
