import React, { useMemo, useState } from "react";
import "./DesignToolsPage.css";
const downloadFile = (filename, content, mime = "text/plain;charset=utf-8") => {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const mod = (n, m) => ((n % m) + m) % m;

const hexToRgb = (hex) => {
  const h = hex.replace("#", "").trim();
  if (![3, 6].includes(h.length)) return null;
  const f = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h;
  const int = parseInt(f, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
};

const rgbToHex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
    .join("");

const rgbToHsl = ({ r, g, b }) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = ({ h, s, l }) => {
  h = mod(h, 360) / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const hslStr = ({ h, s, l }) => `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
const rgbStr = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

const randomHex = () =>
  "#" + Array.from({ length: 6 }, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join("");

/* --------------------- Color Palette Generator --------------------- */
function ColorPaletteGenerator() {
  const [base, setBase] = useState("#7C3AED"); // purple-ish
  const [mode, setMode] = useState("analogous"); // analogous | complementary | triadic | tetradic | monochrome
  const [count, setCount] = useState(5);

  const validBase = useMemo(() => hexToRgb(base) ? base : "#7C3AED", [base]);
  const baseHsl = useMemo(() => rgbToHsl(hexToRgb(validBase)), [validBase]);

  const palette = useMemo(() => {
    const items = [];
    const pushHsl = (h, s, l) => {
      const hsl = { h: mod(h, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) };
      const rgb = hslToRgb(hsl);
      const hex = rgbToHex(rgb).toUpperCase();
      items.push({ hex, rgb, hsl });
    };

    if (mode === "monochrome") {
      const step = 60 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        pushHsl(baseHsl.h, baseHsl.s, clamp(20 + i * step, 0, 95));
      }
      return items;
    }

    // harmonic sets
    let seeds = [];
    if (mode === "analogous") {
      const spread = 30;
      const half = Math.floor(count / 2);
      for (let i = -half; i <= half; i++) seeds.push(mod(baseHsl.h + i * spread, 360));
      while (seeds.length > count) seeds.pop();
    } else if (mode === "complementary") {
      seeds = [baseHsl.h, baseHsl.h + 180];
      while (seeds.length < count) seeds.push(seeds[seeds.length % 2] + (Math.random() > 0.5 ? 10 : -10));
    } else if (mode === "triadic") {
      seeds = [baseHsl.h, baseHsl.h + 120, baseHsl.h + 240];
    } else if (mode === "tetradic") {
      seeds = [baseHsl.h, baseHsl.h + 90, baseHsl.h + 180, baseHsl.h + 270];
    }

    seeds = seeds.slice(0, count);
    const vary = (i) => ({
      s: clamp(baseHsl.s + (i % 2 ? -5 : 5), 30, 95),
      l: clamp(baseHsl.l + (i % 3 === 0 ? -5 : 5), 20, 90)
    });

    seeds.forEach((h, i) => {
      const { s, l } = vary(i);
      pushHsl(h, s, l);
    });

    // fill if fewer than count
    while (items.length < count) {
      const h = baseHsl.h + Math.random() * 360;
      pushHsl(h, baseHsl.s, baseHsl.l);
    }
    return items.slice(0, count);
  }, [baseHsl, count, mode]);

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const exportCss = () => {
    const lines = palette.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${hslStr(c.hsl)} */`);
    const css = `:root {\n${lines.join("\n")}\n}\n\n/* Example usage */\n.btn { background: var(--color-1); color: white; }`;
    downloadFile("palette.css", css, "text/css;charset=utf-8");
  };

  const exportJson = () => {
    const data = palette.map((c, i) => ({
      name: `color-${i + 1}`,
      hex: c.hex,
      rgb: c.rgb,
      hsl: c.hsl
    }));
    downloadFile("palette.json", JSON.stringify(data, null, 2), "application/json");
  };

  const randomizeBase = () => setBase(randomHex());

  return (
    <section style={cardStyle}>
      <h2 style={h2Style}>🎨 Color Palette Generator</h2>

      <div style={rowStyle}>
        <label style={labelStyle}>
          Base color&nbsp;
          <input
            type="color"
            value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(base) ? base : "#7C3AED"}
            onChange={(e) => setBase(e.target.value)}
          />
        </label>

        <input
          type="text"
          value={base.toUpperCase()}
          onChange={(e) => setBase(e.target.value)}
          placeholder="#7C3AED"
          style={inputStyle}
        />

        <select value={mode} onChange={(e) => setMode(e.target.value)} style={selectStyle}>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="triadic">Triadic</option>
          <option value="tetradic">Tetradic</option>
          <option value="monochrome">Monochrome</option>
        </select>

        <label style={labelStyle}>
          Count&nbsp;
          <input
            type="number"
            min={2}
            max={10}
            value={count}
            onChange={(e) => setCount(clamp(parseInt(e.target.value || "5", 10), 2, 10))}
            style={{ ...inputStyle, width: 80 }}
          />
        </label>

        <button style={btnStyle} onClick={randomizeBase}>Random</button>
        <button style={btnStyle} onClick={exportCss}>Export CSS</button>
        <button style={btnStyle} onClick={exportJson}>Export JSON</button>
      </div>

      <div style={swatchGridStyle}>
        {palette.map((c, i) => (
          <div key={i} style={{ ...swatchStyle, background: c.hex }}>
            <div style={swatchFooterStyle}>
              <div style={{ fontWeight: 700 }}>{c.hex}</div>
              <div style={{ fontSize: 12 }}>{rgbStr(c.rgb)}</div>
              <div style={{ fontSize: 12 }}>{hslStr(c.hsl)}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <button style={btnMini} onClick={() => copy(c.hex)}>Copy HEX</button>
                <button style={btnMini} onClick={() => copy(rgbStr(c.rgb))}>Copy RGB</button>
                <button style={btnMini} onClick={() => copy(hslStr(c.hsl))}>Copy HSL</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- CSS Grid / Flexbox Generator -------------------- */
function LayoutGenerator() {
  const [mode, setMode] = useState("grid"); // grid | flex
  const [items, setItems] = useState(6);

  // grid controls
  const [gridCols, setGridCols] = useState(3);
  const [gridRows, setGridRows] = useState(2);
  const [gridGap, setGridGap] = useState(12);
  const [gridJustifyItems, setGridJustifyItems] = useState("stretch");
  const [gridAlignItems, setGridAlignItems] = useState("stretch");
  const [gridJustifyContent, setGridJustifyContent] = useState("start");
  const [gridAlignContent, setGridAlignContent] = useState("start");
  const [gridAuto, setGridAuto] = useState("auto"); // size for rows/cols

  // flex controls
  const [flexDir, setFlexDir] = useState("row");
  const [flexWrap, setFlexWrap] = useState("wrap");
  const [flexJustify, setFlexJustify] = useState("flex-start");
  const [flexAlignItems, setFlexAlignItems] = useState("stretch");
  const [flexGap, setFlexGap] = useState(12);

  const previewStyle = useMemo(() => {
    if (mode === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${gridCols}, ${gridAuto})`,
        gridTemplateRows: `repeat(${gridRows}, ${gridAuto})`,
        gap: `${gridGap}px`,
        justifyItems: gridJustifyItems,
        alignItems: gridAlignItems,
        justifyContent: gridJustifyContent,
        alignContent: gridAlignContent,
        border: "1px solid #e5e7eb",
        padding: 12,
        minHeight: 240,
        background: "#fafafa",
        borderRadius: 12,
      };
    }
    return {
      display: "flex",
      flexDirection: flexDir,
      flexWrap,
      justifyContent: flexJustify,
      alignItems: flexAlignItems,
      gap: `${flexGap}px`,
      border: "1px solid #e5e7eb",
      padding: 12,
      minHeight: 240,
      background: "#fafafa",
      borderRadius: 12,
    };
  }, [
    mode,
    gridCols, gridRows, gridGap, gridJustifyItems, gridAlignItems, gridJustifyContent, gridAlignContent, gridAuto,
    flexDir, flexWrap, flexJustify, flexAlignItems, flexGap
  ]);

  const codeCss = useMemo(() => {
    if (mode === "grid") {
      return [
        `.container {`,
        `  display: grid;`,
        `  grid-template-columns: repeat(${gridCols}, ${gridAuto});`,
        `  grid-template-rows: repeat(${gridRows}, ${gridAuto});`,
        `  gap: ${gridGap}px;`,
        `  justify-items: ${gridJustifyItems};`,
        `  align-items: ${gridAlignItems};`,
        `  justify-content: ${gridJustifyContent};`,
        `  align-content: ${gridAlignContent};`,
        `}`,
        `.item {`,
        `  background: #EEF2FF;`,
        `  border: 1px solid #c7d2fe;`,
        `  border-radius: 10px;`,
        `  padding: 12px;`,
        `}`
      ].join("\n");
    }
    return [
      `.container {`,
      `  display: flex;`,
      `  flex-direction: ${flexDir};`,
      `  flex-wrap: ${flexWrap};`,
      `  justify-content: ${flexJustify};`,
      `  align-items: ${flexAlignItems};`,
      `  gap: ${flexGap}px;`,
      `}`,
      `.item {`,
      `  background: #EEF2FF;`,
      `  border: 1px solid #c7d2fe;`,
      `  border-radius: 10px;`,
      `  padding: 12px;`,
      `}`
    ].join("\n");
  }, [
    mode,
    gridCols, gridRows, gridGap, gridJustifyItems, gridAlignItems, gridJustifyContent, gridAlignContent, gridAuto,
    flexDir, flexWrap, flexJustify, flexAlignItems, flexGap
  ]);

  const copyCss = () => navigator.clipboard.writeText(codeCss);
  const downloadCss = () => downloadFile(`${mode}-layout.css`, codeCss, "text/css;charset=utf-8");

  return (
    <section style={cardStyle}>
      <h2 style={h2Style}>📐 CSS Grid / Flexbox Generator</h2>

      <div style={{ ...rowStyle, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>Mode:</strong>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={selectStyle}>
            <option value="grid">Grid</option>
            <option value="flex">Flexbox</option>
          </select>
        </div>

        <label style={labelStyle}>
          Items
          <input type="number" min={1} max={30} value={items}
                 onChange={(e) => setItems(clamp(parseInt(e.target.value || "6", 10), 1, 30))}
                 style={{ ...inputStyle, width: 90 }} />
        </label>

        {mode === "grid" ? (
          <>
            <label style={labelStyle}>
              Columns
              <input type="number" min={1} max={12} value={gridCols}
                     onChange={(e) => setGridCols(clamp(parseInt(e.target.value || "3", 10), 1, 12))}
                     style={{ ...inputStyle, width: 90 }} />
            </label>

            <label style={labelStyle}>
              Rows
              <input type="number" min={1} max={12} value={gridRows}
                     onChange={(e) => setGridRows(clamp(parseInt(e.target.value || "2", 10), 1, 12))}
                     style={{ ...inputStyle, width: 90 }} />
            </label>

            <label style={labelStyle}>
              Auto size
              <select value={gridAuto} onChange={(e) => setGridAuto(e.target.value)} style={selectStyle}>
                <option value="auto">auto</option>
                <option value="minmax(100px,1fr)">minmax(100px, 1fr)</option>
                <option value="150px">150px</option>
                <option value="1fr">1fr</option>
              </select>
            </label>

            <label style={labelStyle}>
              Gap
              <input type="number" min={0} max={48} value={gridGap}
                     onChange={(e) => setGridGap(clamp(parseInt(e.target.value || "12", 10), 0, 48))}
                     style={{ ...inputStyle, width: 90 }} />
            </label>

            <label style={labelStyle}>
              justify-items
              <select value={gridJustifyItems} onChange={(e) => setGridJustifyItems(e.target.value)} style={selectStyle}>
                <option>stretch</option><option>start</option><option>center</option><option>end</option>
              </select>
            </label>

            <label style={labelStyle}>
              align-items
              <select value={gridAlignItems} onChange={(e) => setGridAlignItems(e.target.value)} style={selectStyle}>
                <option>stretch</option><option>start</option><option>center</option><option>end</option>
              </select>
            </label>

            <label style={labelStyle}>
              justify-content
              <select value={gridJustifyContent} onChange={(e) => setGridJustifyContent(e.target.value)} style={selectStyle}>
                <option>start</option><option>center</option><option>end</option>
                <option>space-between</option><option>space-around</option><option>space-evenly</option>
              </select>
            </label>

            <label style={labelStyle}>
              align-content
              <select value={gridAlignContent} onChange={(e) => setGridAlignContent(e.target.value)} style={selectStyle}>
                <option>start</option><option>center</option><option>end</option>
                <option>space-between</option><option>space-around</option><option>space-evenly</option>
                <option>stretch</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label style={labelStyle}>
              direction
              <select value={flexDir} onChange={(e) => setFlexDir(e.target.value)} style={selectStyle}>
                <option>row</option><option>row-reverse</option>
                <option>column</option><option>column-reverse</option>
              </select>
            </label>

            <label style={labelStyle}>
              wrap
              <select value={flexWrap} onChange={(e) => setFlexWrap(e.target.value)} style={selectStyle}>
                <option>nowrap</option><option>wrap</option><option>wrap-reverse</option>
              </select>
            </label>

            <label style={labelStyle}>
              justify-content
              <select value={flexJustify} onChange={(e) => setFlexJustify(e.target.value)} style={selectStyle}>
                <option>flex-start</option><option>center</option><option>flex-end</option>
                <option>space-between</option><option>space-around</option><option>space-evenly</option>
              </select>
            </label>

            <label style={labelStyle}>
              align-items
              <select value={flexAlignItems} onChange={(e) => setFlexAlignItems(e.target.value)} style={selectStyle}>
                <option>stretch</option><option>flex-start</option><option>center</option><option>flex-end</option><option>baseline</option>
              </select>
            </label>

            <label style={labelStyle}>
              Gap
              <input type="number" min={0} max={48} value={flexGap}
                     onChange={(e) => setFlexGap(clamp(parseInt(e.target.value || "12", 10), 0, 48))}
                     style={{ ...inputStyle, width: 90 }} />
            </label>
          </>
        )}

        <button style={btnStyle} onClick={copyCss}>Copy CSS</button>
        <button style={btnStyle} onClick={downloadCss}>Download CSS</button>
      </div>

      <div style={previewStyle}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} style={boxStyle}>
            <span style={{ opacity: 0.75, fontWeight: 600 }}>{i + 1}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong style={{ display: "block", marginBottom: 6 }}>Generated CSS</strong>
        <textarea readOnly style={codeAreaStyle} value={codeCss} />
      </div>
    </section>
  );
}

/* ------------------------------- Page ------------------------------- */
export default function DesignToolsPage() {
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, margin: "6px 0" }}>Design Tools</h1>
        <p style={{ color: "#6b7280" }}>
          Color Palette Generator · CSS Grid/Flexbox Generator
        </p>
      </header>

      <ColorPaletteGenerator />
      <LayoutGenerator />

      <footer style={{ marginTop: 24, color: "#6b7280", fontSize: 13 }}>
        Built client-side. Copy/download snippets directly into your projects.
      </footer>
    </div>
  );
}

/* ------------------------------ styles ------------------------------ */
const cardStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  marginBottom: 18,
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
};

const h2Style = { fontSize: 20, margin: "4px 0 12px 0" };

const rowStyle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 12
};

const labelStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 14
};

const inputStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  padding: "8px 10px",
};

const btnStyle = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 14
};

const btnMini = {
  ...btnStyle,
  padding: "6px 8px",
  fontSize: 12,
  background: "#374151"
};

const swatchGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 12,
  marginTop: 6
};

const swatchStyle = {
  height: 140,
  borderRadius: 12,
  display: "flex",
  alignItems: "end",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.08)"
};

const swatchFooterStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(4px)",
  padding: 10,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 13,
  borderTop: "1px solid rgba(0,0,0,0.06)"
};

const boxStyle = {
  background: "#EEF2FF",
  border: "1px solid #c7d2fe",
  borderRadius: 10,
  padding: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const codeAreaStyle = {
  width: "100%",
  minHeight: 160,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 10,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 13,
  background: "#f9fafb"
};
