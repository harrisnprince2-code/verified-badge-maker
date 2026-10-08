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

    status
