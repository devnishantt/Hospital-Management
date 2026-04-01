## Problem 1


```ts

import express from "express";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

const app = express();
app.use(express.json());

type ContactType = "wallet" | "pda";

interface Contact {
  id: number;
  name: string;
  address: string;
  type: ContactType;
  createdAt: string;
}

let contacts: Contact[] = [];
let currentId = 1;

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

function isValidSolanaAddress(address: string): boolean {
  try {
    const decoded = bs58.decode(address);
    return decoded.length === 32;
  } catch {
    return false;
  }
}

function getAddressType(address: string): ContactType {
  const pubkey = new PublicKey(address);
  return PublicKey.isOnCurve(pubkey.toBytes()) ? "wallet" : "pda";
}

app.post("/api/contacts", (req, res) => {
  const { name, address } = req.body;

  if (!name || !address || !isValidSolanaAddress(address)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (contacts.find((c) => c.address === address)) {
    return res.status(409).json({ error: "Address already exists" });
  }

  const contact: Contact = {
    id: currentId++,
    name,
    address,
    type: getAddressType(address),
    createdAt: new Date().toISOString(),
  };

  contacts.push(contact);
  return res.status(201).json(contact);
});

app.get("/api/contacts", (req, res) => {
  const { type } = req.query;

  let result = contacts;

  if (type === "wallet" || type === "pda") {
    result = contacts.filter((c) => c.type === type);
  }

  return res.json(result.sort((a, b) => a.id - b.id));
});

app.get("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((c) => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ error: "Contact not found" });
  }

  return res.json(contact);
});

app.put("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((c) => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name required" });
  }

  contact.name = name;
  return res.json(contact);
});

app.delete("/api/contacts/:id", (req, res) => {
  const index = contacts.findIndex((c) => c.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Contact not found" });
  }

  contacts.splice(index, 1);
  return res.json({ message: "Contact deleted" });
});

app.post("/api/contacts/:id/derive-ata", (req, res) => {
  const contact = contacts.find((c) => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const { mintAddress } = req.body;

  if (!mintAddress || !isValidSolanaAddress(mintAddress)) {
    return res.status(400).json({ error: "Invalid mint address" });
  }

  const owner = new PublicKey(contact.address);
  const mint = new PublicKey(mintAddress);

  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  return res.json({
    ata: ata.toBase58(),
    owner: contact.address,
    mint: mintAddress,
  });
});

app.post("/api/verify-ownership", (req, res) => {
  const { address, message, signature } = req.body;

  if (!address || !message || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const pubkey = new PublicKey(address);
    const msgBytes = new TextEncoder().encode(message);
    const sigBytes = bs58.decode(signature);

    const valid = nacl.sign.detached.verify(
      msgBytes,
      sigBytes,
      pubkey.toBytes(),
    );

    return res.json({ valid });
  } catch {
    return res.status(400).json({ error: "Invalid input" });
  }
});
app.post("/api/derive-pda", (req, res) => {
  const { programId, seeds } = req.body;

  if (!programId || !Array.isArray(seeds)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const programKey = new PublicKey(programId);

    const buffers = seeds.map((s: string) => {
      const buf = Buffer.from(s, "utf-8");
      if (buf.length > 32) {
        throw new Error("Seed too long");
      }
      return buf;
    });

    const [pda, bump] = PublicKey.findProgramAddressSync(buffers, programKey);

    return res.json({
      pda: pda.toBase58(),
      bump,
    });
  } catch {
    return res.status(400).json({ error: "Invalid seeds or programId" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

```
---
---
----
----
----

## Problem 2

```ts
