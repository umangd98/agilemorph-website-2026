import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "default" | "pill";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-signal text-bg font-medium hover:opacity-90",
  secondary: "bg-fg text-bg font-medium hover:opacity-90",
  outline:
    "border border-line bg-transparent text-fg hover:border-line-strong hover:bg-bg-elevated",
  ghost: "bg-transparent text-fg-muted hover:bg-bg-elevated hover:text-fg",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const shapeClasses: Record<ButtonShape, string> = {
  default: "rounded-lg",
  pill: "rounded-pill",
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  className = "",
  iconRight,
  iconLeft,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`;

  const inner = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {inner}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {inner}
    </button>
  );
}
