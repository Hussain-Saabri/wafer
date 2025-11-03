import { ScaleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "1750px",
        marginRight: "150px",
        position: "relative",
        margin: "auto",
      }}
    >
      <ScaleLoader
        height={100}
        width={10}
        color="#2563eb"
        aria-label="loading" // ✅ correct ARIA format
      />
      <h1
        style={{
          marginTop: "15px",
          fontSize: "1.5rem",
          fontWeight: "700",
          background: "linear-gradient(to right, #eab308, #9333ea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "1px",
        }}
      >
        Loading
      </h1>
    </div>
  );
}
