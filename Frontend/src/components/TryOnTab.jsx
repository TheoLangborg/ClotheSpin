// src/components/TryOnTab.jsx
import React, { useEffect, useRef } from "react";
import { useOutfit } from "./OutfitContext";
import TryOnViewer from "./TryOnViewer";

export default function TryOnTab() {
    const { tryOnSelection, setTryOnSelection } = useOutfit();

    const hasLogged = useRef(false);

    const frames = [
        "/tryon/frame0.png",
        "/tryon/frame1.png",
        "/tryon/frame2.png",
        "/tryon/frame3.png",
        "/tryon/frame4.png",
        "/tryon/frame5.png",
        "/tryon/frame6.png",
        "/tryon/frame7.png",
        "/tryon/frame8.png",
        "/tryon/frame9.png",
        "/tryon/frame10.png",
        "/tryon/frame11.png",
    ];

    useEffect(() => {
        if (hasLogged.current) return;
        hasLogged.current = true;

        console.group("🟦 Try-On Items Selected");
        Object.entries(tryOnSelection).forEach(([cat, item]) => {
            if (item) console.log(`${cat.toUpperCase()}: ${item.name}`);
        });
        console.groupEnd();

        // Rensa global selection efter användning
        setTryOnSelection({
            top: null,
            bottom: null,
            shoes: null,
            accessories: null,
        });
    }, []);

    return (
        <div>
            <TryOnViewer frames={frames} />
        </div>
    );
}
