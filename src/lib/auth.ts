/**
 * Membership / identity layer.
 *
 * Auth is Privy: email / Google / X / passkey with an auto-created embedded
 * wallet. A member is one Privy user id plus one or more addresses (the
 * embedded wallet and any linked external EVM wallets).
 */
import { usePrivy, useLinkAccount, type User } from "@privy-io/react-auth";

export const PRIVY_APP_ID: string = import.meta.env['VITE_PRIVY_APP_ID'] ?? "";
export const privyEnabled = PRIVY_APP_ID.length > 0;

export type Member = {
  user: User | null;
  ready: boolean;
  authenticated: boolean;
  /** Embedded wallet first, then linked external wallets. */
  addresses: string[];
  embeddedAddress: string;
  handle: string;
  avatarUrl: string;
  login: () => void;
  logout: () => void;
  linkWallet: () => void;
  /** Privy access token, verified server-side before any profile write. */
  getAccessToken: () => Promise<string | null>;
};

const disabled: Member = {
  user: null,
  ready: false,
  authenticated: false,
  addresses: [],
  embeddedAddress: "",
  handle: "",
  avatarUrl: "",
  login: () => {},
  logout: () => {},
  linkWallet: () => {},
  getAccessToken: async () => null,
};

function accounts(user: User | null): { addresses: string[]; embedded: string } {
  if (!user) return { addresses: [], embedded: "" };
  const wallets = user.linkedAccounts.filter(
    (a): a is Extract<User["linkedAccounts"][number], { type: "wallet" }> => a.type === "wallet",
  );
  const embedded = wallets.find((w) => w.walletClientType === "privy")?.address ?? "";
  const rest = wallets.map((w) => w.address).filter((a) => a && a !== embedded);
  return { addresses: [embedded, ...rest].filter(Boolean), embedded };
}

function displayHandle(user: User | null): string {
  if (!user) return "";
  return (
    user.twitter?.username ??
    user.google?.name ??
    user.email?.address ??
    user.google?.email ??
    ""
  );
}

/** Never call Privy hooks when no app id is configured — the provider is absent. */
export function useMember(): Member {
  if (!privyEnabled) return disabled;
  // eslint-disable-next-line react-hooks/rules-of-hooks -- privyEnabled is constant for the app's lifetime
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { linkWallet } = useLinkAccount();
  const { addresses, embedded } = accounts(user ?? null);
  return {
    user: user ?? null,
    ready,
    authenticated,
    addresses,
    embeddedAddress: embedded,
    handle: displayHandle(user ?? null),
    avatarUrl: user?.twitter?.profilePictureUrl ?? "",
    login: () => login(),
    logout: () => void logout(),
    linkWallet: () => linkWallet(),
    getAccessToken: () => getAccessToken(),
  };
}
