import React, { useState } from "react";
import { decode, encode } from "@nem035/gpt-3-encoder";

const MAX_TOKEN = 50256;
const visualize = (value) =>
  value.replace(/ /g, "·").replace(/\t/g, "→").replace(/\n/g, "⏎\n");

export default function TokenViewer() {
  const [tokenId, setTokenId] = useState(0);
  const [text, setText] = useState("");
  // Keep derived state synchronous and distinguish failure from an empty encoding.
  let encoded = [];
  let error = "";
  try {
    encoded = encode(text);
  } catch {
    error = "This text could not be encoded. Try removing invalid characters.";
  }
  const token = decode([tokenId]);
  const changeToken = (event) => {
    const value = Number(event.target.value);
    if (Number.isFinite(value))
      setTokenId(Math.max(0, Math.min(MAX_TOKEN, Math.trunc(value))));
  };
  return (
    <div className="token-tool stack">
      <section className="card" aria-labelledby="decode-heading">
        <p className="eyebrow">01 / Decode a token</p>
        <h2 id="decode-heading">One ID, one vocabulary entry.</h2>
        <output
          className="token-display"
          htmlFor="token-id token-range"
          aria-label="Decoded token"
        >
          {visualize(token) || "\u00a0"}
        </output>
        <div className="token-field">
          <label htmlFor="token-id">Token ID (0–50,256)</label>
          <input
            id="token-id"
            type="number"
            min="0"
            max={MAX_TOKEN}
            step="1"
            value={tokenId}
            onChange={changeToken}
          />
        </div>
        <div className="token-field">
          <label htmlFor="token-range">Browse the vocabulary</label>
          <input
            id="token-range"
            type="range"
            min="0"
            max={MAX_TOKEN}
            value={tokenId}
            onChange={changeToken}
          />
        </div>
        <p className="token-legend">
          Whitespace key: <code>·</code> space / <code>→</code> tab /{" "}
          <code>⏎</code> newline. Some vocabulary entries represent partial byte
          sequences.
        </p>
      </section>
      <section className="card" aria-labelledby="encode-heading">
        <p className="eyebrow">02 / Encode some text</p>
        <h2 id="encode-heading">Words become a sequence.</h2>
        <div className="token-field">
          <label htmlFor="token-text">Text to encode</label>
          <textarea
            id="token-text"
            rows="4"
            placeholder="Type a sentence…"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
        <p className="meta" role="status">
          {error
            ? "Encoding unavailable"
            : `${encoded.length} token${encoded.length === 1 ? "" : "s"}`}
        </p>
        {error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : (
          <output
            className="token-output"
            htmlFor="token-text"
            aria-label="Encoded token IDs"
          >
            [{encoded.join(", ")}]
          </output>
        )}
        <p className="token-legend">
          Encoding happens in your browser. This tool does not send your text to
          a server.
        </p>
      </section>
    </div>
  );
}
