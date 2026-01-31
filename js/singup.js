const elLoginForm = document.getElementById("loginForm");
const elToastSucces = document.getElementById("toast-success");
const eltoastConteiner = document.getElementById("toastConteiner");
const elSubmitBtn = document.querySelector(".js-submit-btn");

const eltoastWarning = document.getElementById("toast-warning");

elLoginForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(elLoginForm);
  const result = {};
  elSubmitBtn.disabled = true;
  elSubmitBtn.innerHTML = `
      <svg width="18" height="18" class="animate-spin mx-auto"
        viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10"
          stroke="currentColor" stroke-width="4" opacity="0.25"/>
        <path d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor" stroke-width="4"/>
      </svg>
    `;

  formData.forEach((value, key) => {
    if (value.trim() === "") {
      const clone = elToastSucces.cloneNode(true).content;
      clone.querySelector(".js-span").innerText = `${key}  Toldiring!`;
      elSubmitBtn.disabled = false;
      elSubmitBtn.innerHTML = "Sign in";
      eltoastConteiner.append(clone);
      return;
    }
    result[key] = value;
  });

  login(result);
});

function login(data) {
  fetch(
    "https://animals-ar28sldhn-muhammadbilols-projects.vercel.app/api/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      elSubmitBtn.disabled = false;
      elSubmitBtn.innerHTML = "Sign in";
      localStorage.clear("token");

      location.href = "./Login.html";
    })
    .catch(() => {
      const clone = eltoastWarning.cloneNode(true).content;
      elSubmitBtn.disabled = false;
      elSubmitBtn.innerHTML = "Sign in";
      clone.querySelector(".js-toast").innerText = "Parol Yoki Login XATO";
      eltoastConteiner.append(clone);
    });
}
