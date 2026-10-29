import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseCatalogue,
  parseSourcesCsv,
} from "../src/data/validateCatalogue";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relativePath: string): unknown {
  const text = readFileSync(join(root, relativePath), "utf8");
  return JSON.parse(text) as unknown;
}

function main(): void {
  const catalogue = parseCatalogue({
    courses: readJson("data/catalogue/courses.json"),
    scholarships: readJson("data/catalogue/scholarships.json"),
    costs: readJson("data/catalogue/costs.json"),
  });
  const sources = parseSourcesCsv(
    readFileSync(join(root, "data/catalogue/sources.csv"), "utf8"),
  );

  const summary = [
    `${catalogue.courses.length} course(s)`,
    `${catalogue.scholarships.length} scholarship policy(ies)`,
    `costs ${catalogue.costs.academicYear}`,
    `${sources.length} source row(s)`,
  ].join(", ");

  console.log(`Catalogue valid: ${summary}`);
}

main();
