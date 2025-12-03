import { useState } from "react";
import "./TryOn.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TryOnViewer({ frames }) {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i - 1 + frames.length) % frames.length);
    const next = () => setIndex((i) => (i + 1) % frames.length);

    return (
        <div className="tryon-carousel">

            {/* PILAR I MITTENKORTET */}
            <button className="arrow left" onClick={prev}>
                <ChevronLeft size={42.5} strokeWidth={1.75} />
            </button>
            <button className="arrow right" onClick={next}>
                <ChevronRight size={42.5} strokeWidth={1.75} />
            </button>

            {/* FLEX TRACK */}
            <div className="carousel-track">

                {frames.map((frame, i) => {
                    const position = i - index;

                    // Normalize
                    let normalized = position;
                    if (position < -1) normalized += frames.length;
                    if (position > 1) normalized -= frames.length;

                    // ⛔ Om kortet inte är -1, 0 eller 1 → rendera inte
                    if (Math.abs(normalized) > 1) return null;

                    const isCenter = normalized === 0;

                    return (
                        <div
                            key={i}
                            className={`carousel-card ${isCenter
                                    ? "center-card"
                                    : normalized === -1
                                        ? "side-card left"
                                        : "side-card right"
                                }`}

                            style={{
                                "--offset": `${normalized * 75}px`,   // 💙 60px synlighet

                            }}
                        >
                            <img src={frame} draggable="false" />
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
