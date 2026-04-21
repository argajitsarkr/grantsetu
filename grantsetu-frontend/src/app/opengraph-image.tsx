import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GrantSetu - India's Research Grants Hub for Life Sciences & Biotechnology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFFFFF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Red top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            background: "#E9283D",
          }}
        />

        {/* Logo wordmark */}
        <span
          style={{
            fontSize: "40px",
            fontWeight: 900,
            color: "#E9283D",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          GrantSetu
        </span>

        {/* Label */}
        <span
          style={{
            marginTop: "48px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#E9283D",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Life Sciences · Biotechnology
        </span>

        {/* Main heading */}
        <h1
          style={{
            fontSize: "84px",
            fontWeight: 900,
            color: "#0A0A0A",
            lineHeight: 1.0,
            margin: 0,
            marginTop: "20px",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            maxWidth: "1050px",
          }}
        >
          India&apos;s Grant Engine
          <br />
          for <span style={{ color: "#E9283D" }}>Life Sciences</span>
          <br />
          &amp; Biotech.
        </h1>

        {/* Agency pills */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          {["DBT", "BIRAC", "ICMR", "CSIR", "AYUSH", "DST", "ANRF"].map((agency, i) => (
            <span
              key={agency}
              style={{
                background: i < 3 ? "#0A0A0A" : "#FFFFFF",
                color: i < 3 ? "#FFFFFF" : "#0A0A0A",
                border: "2px solid #0A0A0A",
                borderRadius: "999px",
                padding: "8px 18px",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {agency}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "72px",
            right: "72px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#0A0A0A",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderTop: "2px solid #0A0A0A",
            paddingTop: "20px",
          }}
        >
          <span>grantsetu.in</span>
          <span>Free · Updated Daily · Made in India</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
