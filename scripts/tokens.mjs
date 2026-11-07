import { theme } from "../shared/schema.ts";
import { writeFileSync } from "node:fs";
writeFileSync("DESIGN_TOKENS.json", JSON.stringify(theme, null, 2) + "\n");

writeFileSync(
  "src/tokens.css",
  ":root{" +
    Object.entries(theme.primitive)
      .map(([key, value]) => "--" + key + ":" + value)
      .join(";") +
    "}\n",
);
