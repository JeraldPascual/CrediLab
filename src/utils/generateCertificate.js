/**
 * generateCertificate.js
 *
 * Draws a CrediLab certificate on an HTML5 Canvas and triggers a PNG download.
 * Pure browser-side — no backend, no third-party library needed.
 *
 * @param {Object} opts
 * @param {string} opts.studentName     - Full name of the student
 * @param {string} opts.tierTitle       - e.g. "Junior Programmer"
 * @param {number} opts.credits         - Total CLB earned
 * @param {number} opts.completedCount  - Number of challenges completed
 * @param {string} opts.issueDate       - Formatted date string
 * @param {string} opts.verifyUrl       - Public verification URL
 */
export async function generateCertificate({
  studentName,
  tierTitle,
  credits,
  completedCount,
  issueDate,
  verifyUrl,
}) {
  const W = 1200;
  const H = 850;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // ── Background ──────────────────────────────────────────────────────────
  // Deep dark gradient matching app dark mode
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#0d1117");
  bgGrad.addColorStop(1, "#161b22");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Outer border ────────────────────────────────────────────────────────
  const borderInset = 24;
  ctx.strokeStyle = "#22c55e"; // green-primary
  ctx.lineWidth = 3;
  roundRect(ctx, borderInset, borderInset, W - borderInset * 2, H - borderInset * 2, 20, false, true);

  // Inner subtle border
  ctx.strokeStyle = "rgba(34,197,94,0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, borderInset + 8, borderInset + 8, W - (borderInset + 8) * 2, H - (borderInset + 8) * 2, 16, false, true);

  // ── Corner decorations ───────────────────────────────────────────────────
  drawCornerOrn(ctx, borderInset + 4, borderInset + 4, 40, "#22c55e");
  drawCornerOrn(ctx, W - borderInset - 4, borderInset + 4, 40, "#22c55e", true, false);
  drawCornerOrn(ctx, borderInset + 4, H - borderInset - 4, 40, "#22c55e", false, true);
  drawCornerOrn(ctx, W - borderInset - 4, H - borderInset - 4, 40, "#22c55e", true, true);

  // ── Subtle radial glow behind center ────────────────────────────────────
  const glow = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 420);
  glow.addColorStop(0, "rgba(34,197,94,0.06)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Header label ─────────────────────────────────────────────────────────
  ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#22c55e";
  ctx.letterSpacing = "6px";
  ctx.textAlign = "center";
  ctx.fillText("C R E D I L A B", W / 2, 100);

  // ── Title ────────────────────────────────────────────────────────────────
  ctx.font = "bold 52px 'Georgia', serif";
  ctx.fillStyle = "#ffffff";
  ctx.letterSpacing = "0px";
  ctx.fillText("Certificate of Achievement", W / 2, 175);

  // ── Divider line ─────────────────────────────────────────────────────────
  drawGradientLine(ctx, W / 2 - 280, 200, W / 2 + 280, 200);

  // ── Subtitle ─────────────────────────────────────────────────────────────
  ctx.font = "18px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("This is to certify that", W / 2, 248);

  // ── Student name ─────────────────────────────────────────────────────────
  ctx.font = "bold 58px 'Georgia', serif";
  ctx.fillStyle = "#22c55e";
  ctx.fillText(studentName || "Student", W / 2, 330);

  // ── Body text ────────────────────────────────────────────────────────────
  ctx.font = "18px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("has successfully demonstrated coding competency and earned the rank of", W / 2, 385);

  // ── Tier badge area ──────────────────────────────────────────────────────
  const badgeY = 420;
  const badgeW = 340;
  const badgeH = 70;
  const badgeX = W / 2 - badgeW / 2;

  const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
  badgeGrad.addColorStop(0, "rgba(34,197,94,0.15)");
  badgeGrad.addColorStop(1, "rgba(34,197,94,0.05)");
  ctx.fillStyle = badgeGrad;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 12, true, false);
  ctx.strokeStyle = "rgba(34,197,94,0.4)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 12, false, true);

  // Tier title — centered in badge
  ctx.font = "bold 28px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#22c55e";
  ctx.textAlign = "center";
  ctx.fillText(tierTitle, W / 2, badgeY + 46);

  // ── Stats row ────────────────────────────────────────────────────────────
  const statsY = 545;
  drawStat(ctx, W / 2 - 200, statsY, `${credits}`, "CLB Earned");
  drawStatDivider(ctx, W / 2, statsY - 20, 60);
  drawStat(ctx, W / 2 + 200, statsY, `${completedCount}`, "Challenges Solved");

  // ── Second divider ────────────────────────────────────────────────────────
  drawGradientLine(ctx, W / 2 - 280, 610, W / 2 + 280, 610);

  // ── Footer row ────────────────────────────────────────────────────────────
  // Left: Issue date
  ctx.textAlign = "left";
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("Issued", borderInset + 60, 660);
  ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(issueDate, borderInset + 60, 680);

  // Center: Seal
  drawSeal(ctx, W / 2, 668);

  // Right: Verification note
  ctx.textAlign = "right";
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("Verified by", W - borderInset - 60, 660);
  ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#22c55e";
  ctx.fillText("CrediLab Platform", W - borderInset - 60, 680);

  // ── Verify URL ────────────────────────────────────────────────────────────
  if (verifyUrl) {
    ctx.textAlign = "center";
    ctx.font = "11px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "rgba(34,197,94,0.5)";
    ctx.fillText(`Verify: ${verifyUrl}`, W / 2, H - borderInset - 38);
  }

  // ── Bottom tagline ────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.font = "italic 13px 'Georgia', serif";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillText("CrediLab — Learn to Earn. Code to Prove.", W / 2, H - borderInset - 20);

  // ── Download ──────────────────────────────────────────────────────────────
  const safeName = (studentName || "student").replace(/\s+/g, "_");
  const link = document.createElement("a");
  link.download = `CrediLab_Certificate_${safeName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawGradientLine(ctx, x1, y1, x2, y2) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, "rgba(34,197,94,0)");
  grad.addColorStop(0.5, "rgba(34,197,94,0.6)");
  grad.addColorStop(1, "rgba(34,197,94,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCornerOrn(ctx, x, y, size, color, flipX = false, flipY = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.5);
  ctx.lineTo(0, 8);
  ctx.quadraticCurveTo(0, 0, 8, 0);
  ctx.lineTo(size * 0.5, 0);
  ctx.stroke();
  ctx.restore();
}

function drawStat(ctx, cx, cy, value, label) {
  ctx.textAlign = "center";
  ctx.font = "bold 40px 'Georgia', serif";
  ctx.fillStyle = "#22c55e";
  ctx.fillText(value, cx, cy);
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText(label, cx, cy + 22);
}

function drawStatDivider(ctx, cx, cy, height) {
  ctx.strokeStyle = "rgba(34,197,94,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + height);
  ctx.stroke();
}

function drawSeal(ctx, cx, cy) {
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(34,197,94,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(34,197,94,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // CLB text
  ctx.textAlign = "center";
  ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#22c55e";
  ctx.fillText("CLB", cx, cy - 4);
  ctx.font = "9px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(34,197,94,0.7)";
  ctx.fillText("VERIFIED", cx, cy + 9);

  // Tick marks around the ring
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r1 = 28;
    const r2 = i % 3 === 0 ? 35 : 31;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = i % 3 === 0 ? "rgba(34,197,94,0.6)" : "rgba(34,197,94,0.2)";
    ctx.lineWidth = i % 3 === 0 ? 1.5 : 1;
    ctx.stroke();
  }
}
