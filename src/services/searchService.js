import { INGREDIENTS } from "../data/ingredients";
import { getAllRecipes } from "./recipesService";

// Індекси словника
const nameToId = new Map();
const aliasToId = new Map();
const ingredientById = new Map();

INGREDIENTS.forEach(it => {
  ingredientById.set(it.id, it);
  nameToId.set(norm(it.name), it.id);
  it.aliases.forEach(a => aliasToId.set(norm(a), it.id));
});

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\d+(\,\d+)?\s*(грам\w*|г|гр|мл|шт|склянк\w*|ложк\w*|чайн\w*|стол\w*)/g,"")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitInput(s) {
  if (!s) return [];
  return s
    .toLowerCase()
    .split(/[,;/|+]+|\bта\b|\bі\b|\bабо\b|\bчи\b|\band\b/gi)
    .map(part => norm(part))
    .filter(Boolean);
}

// схожість за включенням + довжиною
function fuzzyFindId(token) {
  let best = null;
  const t = norm(token);
  for (const it of INGREDIENTS) {
    const cand = [it.name, ...it.aliases].map(norm);
    for (const c of cand) {
      if (c === t) return { id: it.id, source: "exact", score: 1 };
      if (c.includes(t) || t.includes(c)) {
        const score = Math.min(c.length, t.length) / Math.max(c.length, t.length);
        if (!best || score > best.score) best = { id: it.id, source: "fuzzy", score };
      }
    }
  }
  return best && best.score >= 0.6 ? best : null;
}

// Resolve (вільний текст -> id)
export function resolveInputToIds(input) {
  const tokens = splitInput(input);
  const resolved = [];
  const unknown = [];

  tokens.forEach(tok => {
    const t = norm(tok);
    const exact =
      nameToId.get(t) || aliasToId.get(t);
    if (exact) {
      resolved.push({ id: exact, source: "exact" });
      return;
    }
    const fuzzy = fuzzyFindId(t);
    if (fuzzy) {
      resolved.push({ id: fuzzy.id, source: fuzzy.source });
      return;
    }
    unknown.push(tok);
  });

  const seen = new Set();
  const uniq = resolved.filter(x => !seen.has(x.id) && seen.add(x.id));

  return { recognized: uniq, unknown };
}

// Побудова індексу рецептів
let built = false;
let buildingPromise = null;
const ingredientIndex = new Map();
const recipeById = new Map();

async function ensureIndex() {
  if (built) return;
  if (buildingPromise) {
    await buildingPromise;
    return;
  }

  buildingPromise = (async () => {
    const ALL_RECIPES = await getAllRecipes();

    ALL_RECIPES.forEach(r => {
      recipeById.set(r.id, r);

      let ids = [];

      if (Array.isArray(r.ingredientIds)) {
        ids = r.ingredientIds;
      } else {
        const rawList = Array.isArray(r.ingredientsRaw)
          ? r.ingredientsRaw
          : Array.isArray(r.ingredients)
          ? r.ingredients
          : [];

        if (rawList.length) {
          const joined = rawList.join(", ");
          const { recognized } = resolveInputToIds(joined);
          ids = recognized.map(x => x.id);
        }

        r.ingredientIds = ids;
      }

      // індекс ingredientId -> recipeId
      ids.forEach(id => {
        if (!ingredientIndex.has(id)) ingredientIndex.set(id, new Set());
        ingredientIndex.get(id).add(r.id);
      });
    });

    built = true;
  })();

  await buildingPromise;
}

export async function searchRecipes(query) {
  await ensureIndex();

  const {
    includeIds = [],
    excludeIds = [],
    timeRanges = [],
    vegetarian = false
  } = query || {};

  // стартовий набір
  let candidateIds = new Set(recipeById.keys());

  if (includeIds.length) {
    candidateIds = includeIds.reduce((acc, ing) => {
      const set = ingredientIndex.get(ing) || new Set();
      return intersect(acc, set);
    }, new Set(recipeById.keys()));
  }

  if (excludeIds.length) {
    const bad = excludeIds.reduce(
      (acc, ing) => union(acc, ingredientIndex.get(ing) || new Set()),
      new Set()
    );
    candidateIds = diff(candidateIds, bad);
  }

  // фільтри за часом/вегетарі
  let result = Array.from(candidateIds).map(id => recipeById.get(id));

  function fitsRange(t, range) {
    if (range === "<15") return t < 15;
    if (range === "15-30") return t >= 15 && t <= 30;
    if (range === "30-45") return t > 30 && t <= 45;
    if (range === ">45") return t > 45;
    return true;
  }

  if (timeRanges && timeRanges.length) {
    result = result.filter(r => {
      let t = r.timeMin;
      if (t == null) {
        const m =
          typeof r.time === "string" ? r.time.match(/\d+/) : null;
        t = m ? Number(m[0]) : 0;
      }
      return timeRanges.some(range => fitsRange(t, range));
    });
  }

  if (vegetarian) {
    result = result.filter(r => {
      const ids = r.ingredientIds || [];
      return !ids.some(id =>
        (ingredientById.get(id)?.tags || []).includes("non_vegetarian")
      );
    });
  }

  // режим EXACT (штраф за "зайві") + рейтинг
  const scored = result
    .map(r => {
      const ids = new Set(r.ingredientIds || []);
      const matches = includeIds.filter(x => ids.has(x)).length;
      const extra = Math.max(0, ids.size - includeIds.length);
      const score = 3 * matches + (r.rating ? 0.5 * r.rating : 0);
      return { recipe: r, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.map(x => x.recipe);
}

function intersect(a, b) {
  const out = new Set();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}
function union(a, b) {
  const out = new Set(a);
  for (const x of b) out.add(x);
  return out;
}
function diff(a, b) {
  const out = new Set();
  for (const x of a) if (!b.has(x)) out.add(x);
  return out;
}

export function suggestIngredients(q) {
  const t = norm(q);
  if (!t) return [];
  const seen = new Set();
  const items = [];

  INGREDIENTS.forEach(it => {
    const all = [it.name, ...it.aliases].map(norm);
    if (all.some(s => s.startsWith(t) || s.includes(t))) {
      if (!seen.has(it.id)) {
        items.push({ id: it.id, label: it.name });
        seen.add(it.id);
      }
    }
  });

  return items.slice(0, 8);
}
