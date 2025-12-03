import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./FavoriteIcon.css";

export default function FavoriteIcon({ count, active, onClick }) {
    const [pop, setPop] = useState(false);
    const [pulse, setPulse] = useState(false);
    const [prevCount, setPrevCount] = useState(count);

    // === TRIGGER ANIMATIONS ===
    useEffect(() => {
        if (count !== prevCount) {
            setPop(true);

            if (count > prevCount) {
                setPulse(true);
            }

            setTimeout(() => setPop(false), 250);
            setTimeout(() => setPulse(false), 400);

            setPrevCount(count);
        }
    }, [count, prevCount]);

    return (
        <div className="fav-wrapper" onClick={onClick}>
            {/* === HEART ICON (with key to force re-render) === */}
            {active ? (
                <FaHeart
                    key={pulse ? "heart-pulse" : "heart-static"}
                    className={`fav-icon filled ${pulse ? "pulse" : ""}`}
                />
            ) : (
                <FaRegHeart
                    key={pulse ? "heart-pulse" : "heart-static"}
                    className={`fav-icon outline ${pulse ? "pulse" : ""}`}
                />
            )}

            {/* === BADGE (with key to force pop) === */}
            {/* === BADGE === */}
            {count > 0 && !active && (
                <span
                    key={pop ? "badge-pop" : `badge-static-${count}`}
                    className={`fav-badge ${pop ? "pop" : ""}`}
                >
                    {count}
                </span>
            )}

        </div>
    );
}
