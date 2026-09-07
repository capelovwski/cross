import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Cross Store: vitrine oficial do CROSS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function StoreOpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/img/logos/store-white-yellow.png"))
    .then((b) => `data:image/png;base64,${b.toString("base64")}`)
    .catch(() => null);
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#ffc91f", fontWeight: 700 }}>
          <span>[ CROSS STORE ]</span>
          <span style={{ background: "#e8262a", padding: "10px 22px", borderRadius: 999, color: "#fff", transform: "rotate(-4deg)" }}>SÓ PRESENCIAL</span>
        </div>
        {logo ? (
          <img src={logo} alt="" width={700} height={380} style={{ width: 700, height: 380, objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 220, fontWeight: 900, color: "#ffc91f" }}>CROSS STORE</div>
        )}
        <div style={{ fontSize: 32, opacity: 0.9 }}>Camisetas, moletons e acessórios do CROSS, UP e GO. Compra nos encontros e eventos.</div>
      </div>
    ),
    size,
  );
}
