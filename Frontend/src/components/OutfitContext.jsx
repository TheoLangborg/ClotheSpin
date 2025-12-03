// src/components/OutfitContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"
import { auth, db } from "./firebase";
import {
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


function safeId(link) {
  return btoa(link)
    .replace(/=/g, "_")
    .replace(/\//g, "-")
    .replace(/\+/g, "");
}

const OutfitContext = createContext();

export function OutfitProvider({ children }) {
  // ========== GLOBALA STATES ==========
  const [outfitResults, setOutfitResults] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [tryOnSelection, setTryOnSelection] = useState({
    top: null,
    bottom: null,
    shoes: null,
    accessories: null
  });

  const [isChoosing, setIsChoosing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // ------------------------------------------------------
  // 🔥 Reset Try-On när man lämnar generate/favorites tabs
  // ------------------------------------------------------
  useEffect(() => {
    const allowed = ["/generate", "/favorites"];

    // Om vi INTE är i en av tabbarna där man får välja → rensa val
    if (!allowed.includes(location.pathname)) {
      setTryOnSelection({
        top: null,
        bottom: null,
        shoes: null,
        accessories: null
      });

      setIsChoosing(false);
    }
  }, [location.pathname]);

  const saveOutfitHistory = async (data) => {
    if (!auth.currentUser) return; // bara om inloggad
    if (!data || !data.meta || !data.results) return;

    try {
      const colRef = collection(db, "users", auth.currentUser.uid, "outfits");
      await addDoc(colRef, {
        prompt: data.meta.prompt || "",
        gender: data.meta.gender || "unisex",
        style: data.meta.style || "other",
        season: data.meta.season || "all-year",
        budget: data.meta.budget || "medium",
        colorScheme: data.meta.colorScheme || [],
        counts: {
          top: data.results.top?.length || 0,
          bottom: data.results.bottom?.length || 0,
          shoes: data.results.shoes?.length || 0,
          accessories: data.results.accessories?.length || 0,
        },
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Could not save outfit history:", err);
    }
  };

  // ========== AUTH LISTENER ==========
  useEffect(() => {
    return onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser || null);
    });
  }, []);


  // ========== LOAD LOCALSTORAGE ==========
  useEffect(() => {
    const savedPrompt = localStorage.getItem("outfitPrompt");
    const savedResults = localStorage.getItem("outfitResults");
    const savedFavorites = localStorage.getItem("favorites");

    if (savedPrompt) setPrompt(savedPrompt);
    if (savedResults && savedResults !== "null") {
      const parsed = JSON.parse(savedResults);
      setOutfitResults(parsed);
    } else {
      setOutfitResults(null);
    }

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // ========== SAVE TO LOCALSTORAGE ==========
  useEffect(() => {
    if (prompt) localStorage.setItem("outfitPrompt", prompt);
  }, [prompt]);

  useEffect(() => {
    if (outfitResults === null) {
      localStorage.removeItem("outfitResults");
    } else {
      localStorage.setItem("outfitResults", JSON.stringify(outfitResults));
    }
  }, [outfitResults]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


  // ========== LOAD FIRESTORE FAVORITES ==========
  // ========== LOAD FIRESTORE FAVORITES ==========
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const colRef = collection(db, "users", user.uid, "favorites");
        const snap = await getDocs(colRef);

        const firestoreFavs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Merge firestore + local + SPARA
        setFavorites((prev) => {
          const map = new Map();
          [...prev, ...firestoreFavs].forEach((f) => map.set(f.id, f));

          const merged = Array.from(map.values());
          localStorage.setItem("favorites", JSON.stringify(merged));

          return merged;
        });

      } catch (err) {
        console.error("Could not load Firestore favorites:", err);
      }
    };

    load();
  }, [user]);



  // ========== FAVORITES FUNKTIONER ==========
  const addFavorite = async (item) => {
    if (!item?.link) return console.warn("Item missing link:", item);

    const id = safeId(item.link);

    const formatted = {
      ...item,
      id,
      addedAt: Date.now(),                        // behövs för newest/oldest
      category: item.category || "uncategorized", // FIX: kategori följer med
    };


    setFavorites((prev) => {
      if (prev.some((f) => f.id === id)) return prev;

      const updated = [...prev, formatted];

      // Spara korrekt
      localStorage.setItem("favorites", JSON.stringify(updated));

      // Event för badge
      window.dispatchEvent(new Event("favorites-updated"));

      return updated;
    });

    // Firestore
    if (auth.currentUser) {
      try {
        const favRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "favorites",
          id
        );
        await setDoc(favRef, formatted);
      } catch (err) {
        console.error("Could not save to Firestore:", err);
      }
    }
  };


  const removeFavorite = async (id) => {
    // 1. Ta bort lokalt
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);

    // 2. Uppdatera localStorage
    localStorage.setItem("favorites", JSON.stringify(updated));

    // 3. Ta bort från Firestore om inloggad
    if (auth.currentUser) {
      try {
        const favRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "favorites",
          id
        );
        await deleteDoc(favRef);
      } catch (err) {
        console.error("Could not delete Firestore favorite:", err);
      }
    }

    // 4. Uppdatera UI
    window.dispatchEvent(new Event("favorites-updated"));
  };




  // ========== RESET ==========
  const resetOutfits = () => {
    setOutfitResults(null);
    setPrompt("");
    localStorage.removeItem("outfitPrompt");
    localStorage.removeItem("outfitResults");
  };


  return (
    <OutfitContext.Provider
      value={{
        outfitResults,
        setOutfitResults,
        prompt,
        setPrompt,
        resetOutfits,

        tryOnSelection,
        setTryOnSelection,
        isChoosing,
        setIsChoosing,

        favorites,
        addFavorite,
        removeFavorite,

        user,

        saveOutfitHistory,
      }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit() {
  return useContext(OutfitContext);
}
