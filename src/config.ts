export const site = {
  name: "LLM Left",
  url: "https://llmleft.com",
  title: "LLM Left — Claude and Codex usage tracker for Mac & iPhone",
  description:
    "Track Claude and Codex limits, reset times, and remaining usage from your Mac menu bar, iPhone, and widgets—without syncing credentials or prompts.",
  ogImage: "/og.png",
  locale: "en_US",
  themeColor: "#050706",
} as const;

export const product = {
  minimumMacOS: "macOS 14 or later",
  architecture: "Apple silicon",
  iOSRequirement: "iOS 18 or later",
  operatingSystem: "macOS 14 or later on Apple silicon",
  applicationCategory: "UtilitiesApplication",
  providers: ["Codex", "Claude", "Grok", "OpenRouter"],
  maximumAccounts: 20,
} as const;

/** Public release notes, newest first. Each entry mirrors the notes shipped in the Sparkle feed. */
export const releases = [
  {
    version: "0.1.14",
    published: "2026-09-05",
    headline: "One Mac publishes. The rest just read.",
    notes: [
      "New in Settings > iCloud Sync: choose whether this Mac publishes usage to iCloud. Turn it off on a second Mac so the iPhone app and widgets follow one machine.",
      "A Mac that does not publish keeps reading usage for its own menu bar and no longer asks you to sign in to iCloud.",
    ],
  },
  {
    version: "0.1.13",
    published: "2026-09-04",
    headline: "Several accounts, one menu.",
    notes: [
      "Manage several Codex and Claude accounts, each with its own sign-in, quota, history, and reset alerts.",
      "New menu: one row per account showing its tightest window, the CLI's own login badged as default, and a per-provider choice of which account new sessions use.",
      "New Settings window with a sidebar and an Accounts pane, including automatic selection and its reserve.",
      "The status item can show the tightest window or one number per account in use. OpenRouter credit joins the provider rows.",
    ],
  },
  {
    version: "0.1.12",
    published: "2026-09-01",
    headline: "The Claude usage screen, read reliably.",
    notes: [
      "Shows the Claude Fable weekly limit again.",
      "Reads the Claude Code usage screen through a terminal model, so partial repaints no longer hide limits or shift reset times.",
    ],
  },
  {
    version: "0.1.11",
    published: "2026-08-25",
    headline: "One alert per cycle.",
    notes: [
      "Sends each quota warning only once for its reset cycle.",
      "Treats one-minute provider reset-time changes as the same quota cycle.",
    ],
  },
  {
    version: "0.1.10",
    published: "2026-08-25",
    headline: "Clearer warnings.",
    notes: [
      "Shows the exhausted quota limit name correctly in the Mac menu-bar warning.",
      "Prevents Swift source text from appearing in quota warnings.",
    ],
  },
  {
    version: "0.1.9",
    published: "2026-08-24",
    headline: "The official Grok mark.",
    notes: [
      "Replaces the temporary Grok star symbol with the official xAI-provided Grok logomark.",
      "Uses the official black and white Grok assets in the Mac app and iPhone widgets.",
    ],
  },
  {
    version: "0.1.8",
    published: "2026-08-24",
    headline: "Grok and OpenRouter join the snapshot.",
    notes: [
      "Adds Grok subscription usage with the weekly limit, reset time, and X subscription label.",
      "Adds Grok and OpenRouter widgets for iPhone.",
      "Adds an All Providers widget for Codex, Claude, Grok, and OpenRouter.",
      "Syncs sanitized OpenRouter credit and spend totals through the private iCloud database.",
    ],
  },
  {
    version: "0.1.6 – 0.1.7",
    published: "2026-08-24",
    headline: "Fresher checks and the first alerts.",
    notes: [
      "Checks Claude usage every five minutes and every minute near the session limit.",
      "Warns when quota data is stale instead of showing it as current.",
      "Sends notifications when an active quota reaches 10% remaining or is exhausted.",
      "Shows the most constrained active limit in the menu bar.",
    ],
  },
  {
    version: "0.1.5",
    published: "2026-08-22",
    headline: "Banked resets, at a glance.",
    notes: [
      "Shows available Codex banked resets in the menu bar.",
      "Shows the next expiry date and the time that remains.",
      "Expands to show the expiry details for each available reset.",
    ],
  },
] as const;

const latest = releases[0];

/** The signed release the site links to. Verify the artifacts before changing these values. */
export const release = {
  version: latest.version,
  build: "16",
  published: latest.published,
  downloadUrl:
    "https://llmleft-updates.ignacio-alley.workers.dev/releases/LLMLeft-0.1.14.dmg",
  archiveUrl:
    "https://llmleft-updates.ignacio-alley.workers.dev/releases/LLMLeft-0.1.14.zip",
  filename: "LLMLeft-0.1.14.dmg",
  size: "11.5 MB",
  sha256: "8c59de0a79f8fb630ac045127ade38e4ed50df3bf009d9b96e7960978518faae",
  notes: latest.notes,
} as const;

/** Formats an ISO date without letting the build machine's time zone shift the day. */
export function formatReleaseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const download = {
  primaryLabel: "Download for Mac",
  primaryHref: release.downloadUrl,
  secondaryLabel: "See how it works",
  secondaryHref: "/#how-it-works",
  iphonePublic: false,
} as const;

export const nav = {
  links: [
    { label: "Accounts", href: "/#accounts" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Privacy", href: "/privacy/" },
    { label: "Changelog", href: "/changelog/" },
  ],
} as const;

export const faqs = [
  {
    question: "What does LLM Left track?",
    answer:
      "The usage windows, remaining limits, reset times, and pace for Codex, Claude, and Grok subscriptions, plus OpenRouter prepaid credit and spend. It also shows Codex banked resets when they are available.",
  },
  {
    question: "Can I track more than one Claude or Codex account?",
    answer:
      "Yes. Add up to 20 Codex and Claude profiles in Settings > Accounts. Each one signs in with the official CLI in Terminal and keeps its own quota, history, and alerts. The menu lists one row per account, and you choose which account new sessions use, or let Automatic pick the one with the most room.",
  },
  {
    question: "Do my Claude or Codex credentials leave my Mac?",
    answer:
      "No. Provider credentials, login files, prompts, conversations, bridge tokens, and detailed history stay on your Mac. Only a small usage snapshot, including account names and states, can sync through your private CloudKit database.",
  },
  {
    question: "Can I see usage on my iPhone?",
    answer:
      "Yes. The companion app and widgets can show the private CloudKit usage snapshot. A public TestFlight or App Store download is not available yet.",
  },
  {
    question: "I use two Macs. Which one does the iPhone follow?",
    answer:
      "The Mac with publishing turned on in Settings > iCloud Sync. Turn it off on the other Mac: it keeps reading usage for its own menu bar and leaves the shared snapshot alone.",
  },
  {
    question: "Which Macs are supported?",
    answer:
      "The current signed release requires macOS 14 or later and an Apple silicon Mac.",
  },
  {
    question: "Does the website or app use analytics?",
    answer:
      "No. The website has no analytics script, and LLM Left does not send app-usage analytics.",
  },
] as const;

export const analytics = {
  enabled: false,
  reason: "Omitted to match the product privacy boundary.",
} as const;
