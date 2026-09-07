import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = "CROSS · Adolescentes e Jovens da IBB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadAnton() {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Anton&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|woff)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const anton = await loadAnton();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#f3f0e8",
          padding: 64,
          fontFamily: anton ? "Anton" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#ffc91f" }}>
          <span>[ ADOLESCENTES + JOVENS · IBB ]</span>
          <span style={{ display: "flex", gap: 16 }}>
            <span style={{ background: "#e8262a", padding: "8px 20px", borderRadius: 999, color: "#fff", transform: "rotate(-4deg)" }}>UP</span>
            <span style={{ background: "#1b4fe0", padding: "8px 20px", borderRadius: 999, color: "#fff", transform: "rotate(3deg)" }}>GO</span>
          </span>
        </div>
        <div style={{ fontSize: 300, lineHeight: 0.9, letterSpacing: 4, color: "#ffc91f" }}>CROSS</div>
        <div style={{ fontSize: 34, color: "#f3f0e8", opacity: 0.9 }}>{site.tagline}</div>
      </div>
    ),
    { ...size, fonts: anton ? [{ name: "Anton", data: anton, style: "normal", weight: 400 }] : undefined },
  );
}
