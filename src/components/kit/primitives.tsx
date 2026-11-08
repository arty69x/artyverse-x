import { conceptMotion } from "../../../shared/concept";
/** Adapted shadcn/ui Switch/Tabs composition (MIT, copyright 2023 shadcn).
 * Source refs and modifications: docs/v3/COMPONENT_LIBRARY_DECISIONS.md.
 * Uses scoped ARTYVERSE tokens and 44px targets, not a global theme replacement. */
import type { ComponentProps, ReactNode } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
const cn = (...values: (string | undefined)[]) =>
  values.filter(Boolean).join(" ");
export function KitSwitch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn("ax-switch inline-flex shrink-0 items-center", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ax-switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}
export function KitTabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("ax-tabs", className)}
      {...props}
    />
  );
}
export function KitTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("ax-tabs-list", className)}
      {...props}
    />
  );
}
export function KitTabsTrigger({
  className,
  active = false,
  calm = false,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> & {
  active?: boolean;
  calm?: boolean;
  children: ReactNode;
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "ax-tab relative inline-flex items-center justify-center gap-2",
        className,
      )}
      {...props}
    >
      {active && (
        <motion.span
          aria-hidden="true"
          className="ax-tab-highlight"
          layoutId="active-tab"
          transition={calm ? { duration: 0 } : conceptMotion.spring}
        />
      )}
      <span className="ax-tab-label">{children}</span>
    </TabsPrimitive.Trigger>
  );
}
export function KitTabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("ax-tab-content", className)}
      {...props}
    />
  );
}
