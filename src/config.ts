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
  providers: ["Claude", "Codex", "OpenRouter"],
} as const;

export const release = {
  version: "0.1.5",
  build: "7",
  published: "2026-08-22",
  downloadUrl:
    "https://llmleft-updates.ignacio-alley.workers.dev/releases/LLMLeft-0.1.5.dmg",
  archiveUrl:
    "https://llmleft-updates.ignacio-alley.workers.dev/releases/LLMLeft-0.1.5.zip",
  filename: "LLMLeft-0.1.5.dmg",
  size: "10.4 MB",
  sha256: "383e5d510f3b063be5132bb17769a2cd8ff752041f3209490b217e6d2b7da655",
  notes: [
    "Shows available Codex banked resets in the menu bar.",
    "Shows the next expiry date and the time that remains.",
    "Expands to show the expiry details for each available reset.",
  ],
} as const;

export const download = {
  primaryLabel: "Download for Mac",
  primaryHref: release.downloadUrl,
  secondaryLabel: "See how it works",
  secondaryHref: "/#how-it-works",
  iphonePublic: false,
} as const;

export const nav = {
  links: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Privacy", href: "/privacy/" },
    { label: "Changelog", href: "/changelog/" },
  ],
} as const;

export const faqs = [
  {
    question: "What does LLM Left track?",
    answer:
      "LLM Left shows the usage windows, remaining limits, reset times, and pace for supported Claude and Codex plans. It also shows Codex banked resets when they are available.",
  },
  {
    question: "Do my Claude or Codex credentials leave my Mac?",
    answer:
      "No. Credentials, prompts, conversations, bridge tokens, and detailed history stay on your Mac. Only a small usage snapshot can sync through your private CloudKit database.",
  },
  {
    question: "Can I see usage on my iPhone?",
    answer:
      "Yes. The companion app and widgets can show the private CloudKit usage snapshot. A public TestFlight or App Store download is not available yet.",
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

