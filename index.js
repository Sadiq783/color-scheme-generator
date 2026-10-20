const seedColor = document.querySelector("#seed-color");
const colorMode = document.querySelector("#color-mode");
const colorsContainer = document.querySelector("#colors-container");
const colorCodesContainer = document.querySelector("#color-codes-container");

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  renderColors();
});

function renderColors() {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${seedColor.value.replace("#", "")}&count=6&mode=${colorMode.value}`,
  )
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const colorsArr = data.colors;

      let colorHTML = "";
      let colorCodesHTML = "";

      for (const obj of colorsArr) {
        colorHTML += `
                <div class="color-holder" style="background-color: ${obj.hex.value};" data-color-code="${obj.hex.value}"></div>
            `;

        colorCodesHTML += `
                <div class="color-code">${obj.hex.value}</div>
            `;
      }

      colorsContainer.innerHTML = colorHTML;
      colorCodesContainer.innerHTML = colorCodesHTML;
    })
    .catch((err) => {
      console.error("Failed to render colors:", err);
    });
}

renderColors();

function copyColorCode() {
  const feedbackTimers = new WeakMap();

  function showCopied(element) {
    element.style.setProperty("--copy-text", '"Copied!"');

    clearTimeout(feedbackTimers.get(element));
    feedbackTimers.set(
      element,
      setTimeout(() => {
        element.style.removeProperty("--copy-text");
        feedbackTimers.delete(element);
      }, 1000),
    );
  }

  async function copyToClipboard(colorCode, element) {
    try {
      await navigator.clipboard.writeText(colorCode);
      showCopied(element);
    } catch (err) {
      console.error("Failed to copy color code:", err);
    }
  }

  colorCodesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-code")) {
      const colorCode = e.target.textContent;
      const colorHolder = Array.from(colorsContainer.children).find(
        (holder) => holder.dataset.colorCode === colorCode,
      );

      if (colorHolder) {
        copyToClipboard(colorCode, colorHolder);
      }
    }
  });

  colorsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-holder")) {
      copyToClipboard(e.target.dataset.colorCode, e.target);
    }
  });
}

copyColorCode();
