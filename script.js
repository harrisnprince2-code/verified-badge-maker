const nameInput = document.getElementById("nameInput");
const previewName = document.getElementById("previewName");
const previewBadge = document.getElementById("previewBadge");

const sizeRange = document.getElementById("sizeRange");
const spacingRange = document.getElementById("spacingRange");

const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const badgeButton = document.getElementById("badgeButton");

const status = document.getElementById("status");


// ========================================
// UPDATE NAME
// ========================================

nameInput.addEventListener("input", () => {
  previewName.textContent = nameInput.value || "Harrison";
});


// ========================================
// BADGE SIZE
// ========================================

sizeRange.addEventListener("input", () => {
  const size = Number(sizeRange.value);

  previewBadge.style.width = `${size}px`;
  previewBadge.style.height = `${size}px`;
  previewBadge.style.fontSize = `${Math.round(size * 0.63)}px`;
});


// ========================================
// BADGE SPACING
// ========================================

spacingRange.addEventListener("input", () => {
  const spacing = Number(spacingRange.value);

  previewBadge.style.marginLeft = `${spacing}px`;
});


// ========================================
// BADGE BUTTON
// ========================================

badgeButton.addEventListener("click", () => {

  status.textContent = "✓ Badge added to preview";

  setTimeout(() => {
    status.textContent = "";
  }, 2000);

});


// ========================================
// CREATE PNG
// ========================================

function createBadgeCanvas() {

  const name = nameInput.value.trim() || "Harrison";

  const badgeSize = Number(sizeRange.value);
  const spacing = Number(spacingRange.value);

  const fontSize = 42;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `700 ${fontSize}px Arial`;

  const textWidth = ctx.measureText(name).width;

  const paddingLeft = 15;
  const paddingRight = 15;

  const totalWidth =
    paddingLeft +
    textWidth +
    spacing +
    badgeSize +
    paddingRight;

  const totalHeight =
    Math.max(fontSize, badgeSize) + 30;

  canvas.width = Math.ceil(totalWidth);
  canvas.height = Math.ceil(totalHeight);

  // Transparent background
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // ========================================
  // DRAW NAME
  // ========================================

  ctx.font = `700 ${fontSize}px Arial`;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";

  ctx.fillText(
    name,
    paddingLeft,
    totalHeight / 2
  );


  // ========================================
  // BADGE POSITION
  // ========================================

  const centerX =
    paddingLeft +
    textWidth +
    spacing +
    badgeSize / 2;

  const centerY =
    totalHeight / 2;

  const radius =
    badgeSize / 2;


  // ========================================
  // DRAW SCALLOPED BADGE
  // ========================================

  ctx.beginPath();

  const points = 32;

  for (let i = 0; i < points; i++) {

    const angle =
      (Math.PI * 2 * i) / points -
      Math.PI / 2;

    const variation =
      i % 2 === 0
        ? radius
        : radius * 0.87;

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


  // Blue badge
  const gradient =
    ctx.createLinearGradient(
      centerX - radius,
      centerY - radius,
      centerX + radius,
      centerY + radius
    );

  gradient.addColorStop(
    0,
    "#4db7ff"
  );

  gradient.addColorStop(
    0.5,
    "#2297ed"
  );

  gradient.addColorStop(
    1,
    "#087ee0"
  );

  ctx.fillStyle = gradient;

  ctx.fill();


  // ========================================
  // DRAW WHITE CHECK
  // ========================================

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

  ctx.lineWidth =
    Math.max(2, badgeSize * 0.14);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.stroke();


  return canvas;
}


// ========================================
// COPY ACTUAL IMAGE
// ========================================

copyButton.addEventListener("click", async () => {

  const canvas = createBadgeCanvas();

  canvas.toBlob(async (blob) => {

    if (!blob) {
      status.textContent =
        "Could not create badge image.";

      return;
    }

    try {

      // Modern browsers
      if (
        navigator.clipboard &&
        window.ClipboardItem
      ) {

        const item =
          new ClipboardItem({
            "image/png": blob
          });

        await navigator.clipboard.write([
          item
        ]);

        status.textContent =
          "✓ Badge image copied!";

      } else {

        // Fallback
        status.textContent =
          "Image copying isn't supported here. Use Download PNG.";

      }

    } catch (error) {

      console.error(error);

      status.textContent =
        "Copy failed. Use Download PNG.";

    }

    setTimeout(() => {
      status.textContent = "";
    }, 3000);

  }, "image/png");

});


// ========================================
// DOWNLOAD PNG
// ========================================

downloadButton.addEventListener("click", () => {

  const name =
    nameInput.value.trim() || "Harrison";

  const canvas =
    createBadgeCanvas();

  canvas.toBlob((blob) => {

    if (!blob) {

      status.textContent =
        "Could not create image.";

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
