/**
 * Navigation shim.
 *
 * The CULT FUN pages were written against react-router-dom. This module exposes the
 * same small surface (`Link`, `NavLink`, `useParams`) on top of TanStack Router so the
 * pages keep their original markup and class names.
 */
import {
  Link as RouterLink,
  useParams as useRouterParams,
  useRouterState,
  useNavigate as useRouterNavigate,
} from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "className">;

export type LinkProps = AnchorProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export function Link({ to, ...rest }: LinkProps) {
  // Paths are plain strings here (e.g. `/coin/${id}`), so bypass TanStack's literal route typing.
  const Any = RouterLink as unknown as (props: Record<string, unknown>) => ReactNode;
  return <Any to={to} {...rest} />;
}

export type NavLinkProps = AnchorProps & {
  to: string;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode;
};

export function NavLink({ to, className, ...rest }: NavLinkProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || pathname.startsWith(to + "/");
  const resolved = typeof className === "function" ? className({ isActive }) : className;
  return <Link to={to} className={resolved} {...rest} />;
}

export function useParams(): Record<string, string | undefined> {
  return useRouterParams({ strict: false }) as Record<string, string | undefined>;
}

/** react-router-dom style `navigate('/some/path')`. */
export function useNavigate(): (to: string) => void {
  const navigate = useRouterNavigate();
  return (to: string) => {
    void (navigate as unknown as (opts: { to: string }) => Promise<void>)({ to });
  };
}
