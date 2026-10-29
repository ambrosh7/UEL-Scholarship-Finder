import coursesJson from "../../data/catalogue/courses.json";
import scholarshipsJson from "../../data/catalogue/scholarships.json";
import costsJson from "../../data/catalogue/costs.json";
import { parseCatalogue } from "./validateCatalogue";
import type { Catalogue } from "@/domain/types";

export function loadCatalogue(): Catalogue {
  return parseCatalogue({
    courses: coursesJson,
    scholarships: scholarshipsJson,
    costs: costsJson,
  });
}
