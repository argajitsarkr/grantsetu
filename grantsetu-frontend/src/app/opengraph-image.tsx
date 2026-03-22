import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GrantSetu — Discover Indian Research Grants from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC & AYUSH";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #141414 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#E44A32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "white",
            }}
          >
            G
          </div>
          <span style={{ fontSize: "36px", fontWeight: 700, color: "white" }}>
            GrantSetu
          </span>
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          Discover Indian Research Grants
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#a0aec0",
            textAlign: "center",
            marginTop: "20px",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Browse active grant calls from DBT, DST, ICMR, ANRF, BIRAC, CSIR, UGC & AYUSH — updated daily
        </p>

        {/* Agency pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["DBT", "DST", "ICMR", "ANRF", "BIRAC", "CSIR", "UGC", "AYUSH"].map(
            (agency) => (
              <span
                key={agency}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {agency}
              </span>
            )
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#718096",
            fontSize: "16px",
          }}
        >
          <span>grantsetu.in</span>
          <span>•</span>
          <span>Free & Open Access</span>
          <span>•</span>
          <span>Made in India</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
