const nameInput = document.getElementById("nameInput");
const previewName = document.getElementById("previewName");
const previewBadge = document.getElementById("previewBadge");

const sizeRange = document.getElementById("sizeRange");
const spacingRange = document.getElementById("spacingRange");

const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const badgeButton = document.getElementById("badgeButton");

const status = document.getElementById("status");


// -----------------------------
// UPDATE NAME
// -----------------------------

nameInput.addEventListener("input", () => {
  previewName.textContent = nameInput.value || "Harrison";
});


// -----------------------------
// BADGE SIZE
// -----------------------------

sizeRange.addEventListener("input", () => {

  const size = Number(sizeRange.value);

  previewBadge.style.width = `${size}px`;
  previewBadge.style.height = `${size}px`;

  previewBadge.style.fontSize = `${Math.round(size * 0.63)}px`;
});


// -----------------------------
// BADGE SPACING
// -----------------------------

spacingRange.addEventListener("input", () => {

  const spacing = Number(spacingRange.value);

  previewBadge.style.marginLeft = `${spacing}px`;
});


// -----------------------------
// BADGE BUTTON
// -----------------------------

badgeButton.addEventListener("click", () => {

  status.textContent = "✓ Badge added to the preview";

  setTimeout(() => {
    status.textContent = "";
  }, 2000);

});


// -----------------------------
// COPY NAME
// -----------------------------

copyButton.addEventListener("click", async () => {

  const name = nameInput.value.trim() || "Harrison";

  /*
    Clipboard text cannot contain our custom graphic.
    We therefore copy the name plus a Unicode approximation.
  */

  const text = `${name} 🔵✓`;

  try {

    await navigator.clipboard.writeText(text);

    status.textContent = "✓ Copied!";

  } catch (error) {

    status.textContent = "Copy failed. Try again.";

  }

  setTimeout(() => {
    status.textContent = "";
  }, 2000);

});


// -----------------------------
// DOWNLOAD PNG
// -----------------------------

downloadButton.addEventListener("click", () => {

  const name = nameInput.value.trim() || "Harrison";

  const badgeSize = Number(sizeRange.value);
  const spacing = Number(spacingRange.value);

  const fontSize = 42;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `700 ${fontSize}px Arial`;

  const textWidth = ctx.measureText(name).width;

  const badgeWidth = badgeSize;
  const totalWidth =
    textWidth +
    spacing +
    badgeWidth +
    30;

  const totalHeight =
    Math.max(fontSize, badgeSize) + 30;

  canvas.width = totalWidth;
  canvas.height = totalHeight;

  // Transparent background
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Draw name
  ctx.font = `700 ${fontSize}px Arial`;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";

  ctx.fillText(
    name,
    15,
    totalHeight / 2
  );


  // -----------------------------
  // DRAW BLUE VERIFICATION BADGE
  // -----------------------------

  const centerX =
    15 +
    textWidth +
    spacing +
    badgeSize / 2;

  const centerY =
    totalHeight / 2;

  const radius =
    badgeSize / 2;

  ctx.beginPath();

  const points = 24;

  for (let i = 0; i < points; i++) {

    const angle =
      (Math.PI * 2 * i) / points -
      Math.PI / 2;

    const variation =
      i % 2 === 0
        ? radius
        : radius * 0.88;

    const x =
      centerX +
      Math.cos(angle) * variation;

    const y =
      centerY +
      Math.sin(angle) * variation;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  ctx.fillStyle = "#1877f2";
  ctx.fill();


  // -----------------------------
  // DRAW WHITE CHECK
  // -----------------------------

  ctx.beginPath();

  ctx.moveTo(
    centerX - radius * 0.42,
    centerY
  );

  ctx.lineTo(
    centerX - radius * 0.10,
    centerY + radius * 0.30
  );

  ctx.lineTo(
    centerX + radius * 0.48,
    centerY - radius * 0.34
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, badgeSize * 0.14);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.stroke();


  // -----------------------------
  // DOWNLOAD
  // -----------------------------

  canvas.toBlob((blob) => {

    if (!blob) {
      status.textContent = "Could not create image.";
      return;
    }

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${name}-verified.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    status.textContent =
      "✓ PNG downloaded";

    setTimeout(() => {
      status.textContent = "";
    }, 2500);

  }, "image/png");

});
