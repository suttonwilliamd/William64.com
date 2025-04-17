// src/components/TokenViewer.jsx
import React, { useState, useEffect } from "react";
import { decode, encode } from "@nem035/gpt-3-encoder";

export default function TokenViewer() {
  const [tokenId, setTokenId] = useState(0);
  const [token, setToken] = useState("");
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState([]);

  const MIN_TOKEN = 0;
  const MAX_TOKEN = 50256;

  // Clamp helper
  const clamp = (num) => Math.max(MIN_TOKEN, Math.min(MAX_TOKEN, num));

  // Helper to visualize whitespace
  const visualize = (str) =>
    str
      .replace(/ /g, "·")
      .replace(/\t/g, "→")
      .replace(/\n/g, "⏎\n");

  // Decode single token whenever tokenId changes
  useEffect(() => {
    const decoded = decode([tokenId]);
    setToken(decoded);
  }, [tokenId]);

  // Encode full text whenever text changes
  useEffect(() => {
    try {
      const ids = encode(text);
      setEncoded(ids);
    } catch {
      setEncoded([]);
    }
  }, [text]);

  // Handlers with clamping
  const handleTokenInput = (e) => {
    const val = clamp(Number(e.target.value));
    setTokenId(val);
  };
  const handleSliderChange = (e) => {
    const val = clamp(Number(e.target.value));
    setTokenId(val);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "limegreen",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      {/* NOTE block */}
      <div
        style={{
          width: "80%",
          background: "#333",
          color: "#ff5555",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
          fontSize: "1rem",
          lineHeight: "1.4",
          textAlign: "center",
        }}
      >
        <strong>NOTE:</strong> This is a useless toy, a stupid little thing.
        <br />
        If you have the urge to try to make something useful with this,
        reconsider.
        <br />
        You&apos;re not stupid for being here, it&apos;s awesome to be curious.
        <br />
        I built this because I was curious.
        <br />
        Thanks for visiting.
      </div>

      {/* Single-token display */}
      <div
        style={{
          fontSize: "4rem",
          border: "2px solid limegreen",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "1rem",
          maxWidth: "80%",
          wordBreak: "break-word",
          textAlign: "center",
          minHeight: "4rem",
        }}
      >
        {visualize(token) || " "}
      </div>

      {/* Token ID input */}
      <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        <input
          type="number"
          min={MIN_TOKEN}
          max={MAX_TOKEN}
          value={tokenId}
          onChange={handleTokenInput}
          style={{
            width: "5rem",
            marginRight: "1rem",
            fontFamily: "monospace",
            fontSize: "1rem",
          }}
        />
        Token ID
      </div>

      {/* Whitespace legend */}
      <fieldset
        style={{
          margin: "1rem 0",
          border: "1px dashed #444",
          padding: "0.5rem 1rem",
          color: "#888",
          fontSize: "0.9rem",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <legend style={{ padding: "0 0.5rem" }}>Whitespace Legend</legend>
        <code style={{ color: "#ccc" }}>·</code> = space,&nbsp;
        <code style={{ color: "#ccc" }}>→</code> = tab,&nbsp;
        <code style={{ color: "#ccc" }}>⏎</code> = newline
      </fieldset>

      {/* Token range legend */}
      <fieldset
        style={{
          margin: "1rem 0",
          border: "1px dashed #444",
          padding: "0.5rem 1rem",
          color: "#888",
          fontSize: "0.9rem",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <legend style={{ padding: "0 0.5rem" }}>Token Range</legend>
        <code style={{ color: "#ccc" }}>{MIN_TOKEN}</code> = min,&nbsp;
        <code style={{ color: "#ccc" }}>{MAX_TOKEN}</code> = max
      </fieldset>

      {/* Slider */}
      <input
        type="range"
        min={MIN_TOKEN}
        max={MAX_TOKEN}
        value={tokenId}
        onChange={handleSliderChange}
        style={{ width: "80%", marginBottom: "2rem" }}
      />

      {/* Text input for full encoding */}
      <div style={{ width: "80%", marginBottom: "1rem" }}>
        <textarea
          rows="4"
          placeholder="Type text to encode..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: "1rem",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #444",
            background: "#222",
            color: "limegreen",
          }}
        />
      </div>

      {/* Encoded output */}
      <div
        style={{
          width: "80%",
          minHeight: "4rem",
          background: "#222",
          border: "1px solid #555",
          borderRadius: "0.5rem",
          padding: "1rem",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        [{encoded.join(", ")}]
      </div>
    </div>
  );
}