/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Aditya Builders — One-Time Project Data Fix Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Corrects saleableArea and status for the 3 existing projects per the
 * business owner's latest instructions (July 2026).
 *
 * Run ONCE: node utils/fixProjectData.js
 * ⚠️  Do NOT add this to the seed script — seed wipes all data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const corrections = [
  {
    titleMatch: /aaditya elegance/i,
    label: "Aaditya Elegance",
    update: {
      saleableArea: { minSqFt: 1336, maxSqFt: 1655 },
      status: "Ongoing",
    },
  },
  {
    titleMatch: /aaditya skyline/i,
    label: "Aaditya Skyline",
    update: {
      saleableArea: { minSqFt: 1060, maxSqFt: null },
      status: "Ongoing",
    },
  },
  {
    titleMatch: /shreeji aaditya/i,
    label: "Shreeji Aaditya",
    update: {
      saleableArea: { minSqFt: 1100, maxSqFt: 1500 },
      status: "Ongoing", // ← CRITICAL: was "Completed" / "Sold Out"
    },
  },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const col = mongoose.connection.db.collection("projects");

  for (const correction of corrections) {
    const doc = await col.findOne({ title: { $regex: correction.titleMatch } });

    if (!doc) {
      console.warn(`⚠️  [${correction.label}] — NOT FOUND in DB. Skipping.`);
      continue;
    }

    console.log(`📋 [${correction.label}] BEFORE:`);
    console.log(`   status       : ${doc.status}`);
    console.log(`   saleableArea : ${JSON.stringify(doc.saleableArea ?? "not set")}`);

    await col.updateOne(
      { _id: doc._id },
      { $set: correction.update }
    );

    const updated = await col.findOne({ _id: doc._id });
    console.log(`✅ [${correction.label}] AFTER:`);
    console.log(`   status       : ${updated.status}`);
    console.log(`   saleableArea : ${JSON.stringify(updated.saleableArea)}\n`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected. All done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
