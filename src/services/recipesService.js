import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

import { recipeImages } from "../data/recipes";

// БЛОК 1. Saved-рецепти

function ensureUser(userId) {
  if (!userId) throw new Error("Треба увійти в акаунт, щоб зберігати рецепти");
}

function savedDocRef(userId) {
  ensureUser(userId);
  return doc(db, "savedRecipes", userId);
}

export async function getSavedIds(userId) {
  const ref = savedDocRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return new Set();
  }

  const data = snap.data();
  const ids = Array.isArray(data.ids) ? data.ids : [];
  return new Set(ids);
}

export async function isSaved(id, userId) {
  const ids = await getSavedIds(userId);
  return ids.has(id);
}

export async function toggleSaved(id, userId) {
  const ref = savedDocRef(userId);
  const snap = await getDoc(ref);

  const currentIds =
    snap.exists() && Array.isArray(snap.data().ids)
      ? new Set(snap.data().ids)
      : new Set();

  if (currentIds.has(id)) {
    currentIds.delete(id);
  } else {
    currentIds.add(id);
  }

  // записуємо масив id у Firestore
  await setDoc(ref, { ids: Array.from(currentIds) });

  return currentIds;
}

// БЛОК 2. Рецепти з Firestore

function recipesCollection() {
  return collection(db, "recipes");
}

// підставляємо локальну картинку по slug
function attachImage(recipe) {
  const imgFromDoc = recipe.mainPhoto || null;
  const imgFromLocal = recipeImages[recipe.slug] ?? null;

  return {
    ...recipe,
    image: imgFromDoc || imgFromLocal || null,
  };
}

export async function createRecipe(data) {
  const base = (data.name || "").toLowerCase().trim();
  const slugBase = base
    .replace(/[^a-z0-9а-яіїєґё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  const slug =
    slugBase || `recipe-${Date.now().toString(36)}`;

  const docRef = await addDoc(recipesCollection(), {
    ...data,
    slug,
    rating: 0,
    authorId: data.authorId ?? null,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    slug,
    ...data,
  };
}

export async function deleteRecipeById(id) {
  const ref = doc(db, "recipes", id);
  await deleteDoc(ref);
}

export async function getAllRecipes() {
  const snap = await getDocs(recipesCollection());

  const result = snap.docs.map((docSnap) => {
    const data = docSnap.data();

    return attachImage({
      id: data.id ?? docSnap.id,
      ...data,
    });
  });

  return result;
}

export async function getRecipeBySlug(slug) {
  const q = query(recipesCollection(), where("slug", "==", slug));
  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  const docSnap = snap.docs[0];
  const data = docSnap.data();

  return attachImage({
    id: data.id ?? docSnap.id,
    ...data,
  });
}

export async function getRandomRecipe() {
  const all = await getAllRecipes();
  if (!all.length) return null;

  const idx = Math.floor(Math.random() * all.length);
  return all[idx];
}