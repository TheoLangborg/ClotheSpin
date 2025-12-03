// src/components/FilterPanel.jsx
import React, { useState } from "react";
import "./FilterPanel.css";
import { Slider, TextField, Checkbox } from "@mui/material";
import { ChevronDown, X } from "lucide-react";

export default function FilterPanel({ filters, setFilters, onClose, onApply }) {
  const CATEGORY_ORDER = ["top", "bottom", "shoes", "accessories"];

  const [openSection, setOpenSections] = useState(["categories"]);
  const [isClosing, setIsClosing] = useState(false);

  // Format 1000 -> "1 000"
  const formatPrice = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    return new Intl.NumberFormat("sv-SE").format(num);
  };

  // Öppna/stäng sektioner
  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Stäng panel med animation
  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250);
  };

  // Toggle category
  const toggleCategory = (cat) => {
    const selected = [...filters.selectedCategories];
    const idx = selected.indexOf(cat);
    idx === -1 ? selected.push(cat) : selected.splice(idx, 1);

    setFilters({ ...filters, selectedCategories: selected });
  };

  const visibleCategories = CATEGORY_ORDER.filter((cat) =>
    filters.selectedCategories.includes(cat)
  );

  // --------------------------------------------------
  //  GLOBAL MAX PRICE
  // --------------------------------------------------

  const handleGlobalMaxSlider = (value) => {
    // Sätt ALLA kategorier till samma som global max
    const newCategoryPrices = {};
    CATEGORY_ORDER.forEach((cat) => (newCategoryPrices[cat] = value));

    setFilters((prev) => ({
      ...prev,
      maxPriceAll: value,
      categoryPrices: newCategoryPrices,
    }));
  };

  const handleGlobalMaxInput = (value) => {
    const clean = value.replace(/\s+/g, "");
    if (!/^\d*$/.test(clean)) return;

    const num = clean === "" ? "" : Number(clean);

    setFilters((prev) => ({
      ...prev,
      maxPriceAll: num,
    }));
  };

  const validateGlobalMax = () => {
    let val = filters.maxPriceAll;
    let num = Number(val);

    if (val === "" || isNaN(num)) num = 0;
    if (num > 10000) num = 10000; // hårdgräns

    // Sätt ALLA categories till nya max
    const newPrices = {};
    CATEGORY_ORDER.forEach((cat) => (newPrices[cat] = num));

    setFilters((prev) => ({
      ...prev,
      maxPriceAll: num,
      categoryPrices: newPrices,
    }));
  };

  // --------------------------------------------------
  //  PER CATEGORY
  // --------------------------------------------------

  const handleCategorySliderChange = (cat, value) => {
    const clamped = Math.min(value, filters.maxPriceAll);

    setFilters((prev) => ({
      ...prev,
      categoryPrices: {
        ...prev.categoryPrices,
        [cat]: clamped,
      },
    }));
  };

  const handleCategoryPriceInput = (cat, value) => {
    const clean = value.replace(/\s+/g, "");
    if (!/^\d*$/.test(clean)) return;

    setFilters((prev) => ({
      ...prev,
      categoryPrices: {
        ...prev.categoryPrices,
        [cat]: clean === "" ? "" : Number(clean),
      },
    }));
  };

  const validateCategoryPrice = (cat) => {
    const val = filters.categoryPrices[cat];
    let num = Number(val);

    if (val === "" || isNaN(num)) num = 0;
    if (num > filters.maxPriceAll) num = filters.maxPriceAll;

    setFilters((prev) => ({
      ...prev,
      categoryPrices: {
        ...prev.categoryPrices,
        [cat]: num,
      },
    }));
  };

  // --------------------------------------------------
  //  RENDER
  // --------------------------------------------------

  return (
    <div
      className={
        "filter-overlay " + (isClosing ? "overlay-hide" : "overlay-show")
      }
      onClick={closeWithAnimation}
    >
      <div
        className={
          "filter-panel " + (isClosing ? "panel-hide" : "panel-show")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={closeWithAnimation}>
          <X size={22} />
        </button>

        <h3 className="filter-title">Filter</h3>

        <div className="filter-content">
          {/* ===============================================================
              CATEGORY SECTION
          =============================================================== */}
          <div className="filter-section">
            <button
              className="filter-section-header"
              onClick={() => toggleSection("categories")}
            >
              <span>Categories</span>
              <ChevronDown
                size={18}
                className={
                  "chevron " +
                  (openSection.includes("categories") ? "chevron-open" : "")
                }
              />
            </button>

            {openSection.includes("categories") && (
              <div className="filter-section-body">
                {CATEGORY_ORDER.map((cat) => (
                  <label key={cat} className="check-row">
                    <Checkbox
                      size="small"
                      checked={filters.selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span>{cat.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ===============================================================
              GLOBAL PRICE SECTION
          =============================================================== */}
          <div className="filter-section">
            <button
              className="filter-section-header"
              onClick={() => toggleSection("globalPrice")}
            >
              <span>Max price for all items</span>
              <ChevronDown
                size={18}
                className={
                  "chevron " +
                  (openSection.includes("globalPrice") ? "chevron-open" : "")
                }
              />
            </button>

            {openSection.includes("globalPrice") && (
              <div className="filter-section-body">
                <Slider
                  value={filters.maxPriceAll ?? 0}
                  min={0}
                  max={10000}
                  step={50}
                  onChange={(_, v) => handleGlobalMaxSlider(v)}
                />

                <TextField
                  type="text"
                  inputMode="numeric"
                  value={
                    filters.maxPriceAll === "" ||
                      filters.maxPriceAll === null ||
                      filters.maxPriceAll === undefined
                      ? ""
                      : formatPrice(filters.maxPriceAll)
                  }
                  onChange={(e) => handleGlobalMaxInput(e.target.value)}
                  onBlur={validateGlobalMax}
                  onFocus={(e) => e.target.select()}
                  InputProps={{
                    endAdornment: (
                      <span
                        style={{
                          marginLeft: "6px",
                          color: "#555",
                          fontSize: "0.9rem",
                        }}
                      >
                        kr
                      </span>
                    ),
                  }}
                  sx={{
                    "& input": { textAlign: "left" },
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>

          {/* ===============================================================
              PER CATEGORY SECTION
          =============================================================== */}
          <div className="filter-section">
            <button
              className="filter-section-header"
              onClick={() => toggleSection("perCategory")}
            >
              <span>Max price per category</span>
              <ChevronDown
                size={18}
                className={
                  "chevron " +
                  (openSection.includes("perCategory") ? "chevron-open" : "")
                }
              />
            </button>

            {openSection.includes("perCategory") && (
              <div className="filter-section-body">
                {visibleCategories.map((cat) => (
                  <div key={cat} className="category-price-block">
                    <p className="category-label">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </p>

                    <Slider
                      value={filters.categoryPrices[cat] ?? 0}
                      min={0}
                      max={filters.maxPriceAll ?? 0}
                      step={50}
                      onChange={(_, v) => handleCategorySliderChange(cat, v)}
                    />

                    <TextField
                      type="text"
                      inputMode="numeric"
                      value={
                        filters.categoryPrices[cat] === "" ||
                          filters.categoryPrices[cat] === null ||
                          filters.categoryPrices[cat] === undefined
                          ? ""
                          : formatPrice(filters.categoryPrices[cat])
                      }
                      onChange={(e) =>
                        handleCategoryPriceInput(cat, e.target.value)
                      }
                      onBlur={() => validateCategoryPrice(cat)}
                      onFocus={(e) => e.target.select()}
                      InputProps={{
                        endAdornment: (
                          <span
                            style={{
                              marginLeft: "6px",
                              color: "#555",
                              fontSize: "0.9rem",
                            }}
                          >
                            kr
                          </span>
                        ),
                      }}
                      sx={{
                        "& input": { textAlign: "left" },
                        marginTop: "10px",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="apply-btn" onClick={onApply}>
          Apply filters
        </button>
      </div>
    </div>
  );
}
