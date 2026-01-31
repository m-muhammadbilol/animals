const elCardTemp = document.getElementById("cardTemplate");
const elContainer = document.getElementById("container");
const elhomeContainer = document.getElementById("homeContainer");
const elcotegory = document.getElementById("cotegory");
const elLoader = document.getElementById("loader");
const elprofile = document.getElementById("profile");
const elUserName = document.getElementById("username");
const elhome = document.getElementById("home");
const eladdForm = document.getElementById("addForm");
const elSelectDiv = document.querySelector(".js-select");
const elAddBtn = document.querySelector(".js-add-btn");
const eladddiv = document.querySelector(".js-add-div");
const elEditBTN = document.querySelector(".js-edit-btn");
const elSubmitBTN = document.getElementById("submitBTn");
const eltoast = document.getElementById("toast");
const eltoastSuccess = document.getElementById("toast-success");
const eltoastWarning = document.getElementById("toast-warning");
const elEditForm = document.getElementById("editForm");
const ellogout = document.getElementById("logout");
const eleditModal = document.getElementById("editModal");
function home() {
  // elSelectDiv.style.display = "inline-block";
  elContainer.style.display = "grid";
  elhomeContainer.classList.add("hidden");
}
function profile() {
  elContainer.style.display = "none";
  // elSelectDiv.style.display = "none";
  elhomeContainer.classList.remove("hidden");
}
home();
const elprofileIMG = document.getElementById("profileIMG");

if (isLogin()) {
  elprofileIMG.innerHTML = `<img src="./img/user.png" alt="" />`;
} else {
  elprofileIMG.innerHTML = `
<div class="relative w-10 h-10 overflow-hidden bg-neutral-secondary-medium rounded-full">
    <svg class="absolute w-12 h-12 text-body-subtle -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
</div>
`;
}
elprofile.addEventListener("click", () => {
  profile();
});
elhome.addEventListener("click", () => {
  home();
});

ellogout.addEventListener("click", () => {
  localStorage.clear("token");
  location.href = "./index.html";
});

let cotegory = [];
function loader(bool) {
  if (bool) {
    elLoader.classList.remove("hidden");
  } else {
    elLoader.classList.add("hidden");
  }
}
loader(true);
fetch("/api/animals")
  .then((res) => res.json())
  .then((res) => {
    // console.log(res.data);
    cotegory = res;
    ui(cotegory);
  })
  .catch(() => {})
  .finally(() => {
    loader(false);
  });

var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

function ui(data, clean = true) {
  if (clean) {
    elContainer.innerHTML = null;
  }
  data.forEach((element) => {
    // console.log(element.name);

    const clone = elCardTemp.content.cloneNode(true);
    clone.querySelector(".js-title").textContent = element.name
      ? element.name
      : "No name";
    // clone.id = element.id;
    clone.querySelector(".js-delete-btn").id = element.id;
    clone.querySelector(".js-edit-btn").id = element.id;

    clone.querySelector(".js-habitat").textContent = element.habitat
      ? element.habitat
      : "No habitat";
    clone.querySelector(".js-category").textContent = element.category
      ? element.category
      : "No category";
    clone.querySelector(".js-soundText").textContent = element.soundText
      ? element.soundText
      : "No soundText";
    if (element.isWild) {
      clone.querySelector(".js-isWild").textContent = "Ha";
    } else {
      clone.querySelector(".js-isWild").textContent = "Yo'q";
    }

    // console.log(clone);

    elContainer.appendChild(clone);
  });
}

elcotegory.addEventListener("change", (e) => {
  let filtere = e.target.value;
  if (filtere === "All") {
    ui(cotegory);
    return;
  }
  let filtered = cotegory.filter(
    (evt) => evt.category?.toLowerCase() == filtere.toLowerCase(),
  );

  ui(filtered);
});

eladdForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formdata = new FormData(eladdForm);
  const result = {};
  formdata.forEach((value, key) => {
    result[key] = value;
    if (value.trim() === "") {
      const clone = eltoastWarning.content.cloneNode(true);
      clone.querySelector(".js-toast").innerText = key + " ni to'ldiring";
      eltoast.append(clone);
      setTimeout(() => {
        eltoast.innerHTML = null;
      }, 3000);
      return;
    }
  });

  addData(result);
});

function addData(data) {
  const tokenK = localStorage.getItem("token");
  fetch("/api/animals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + tokenK,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      eladdForm.reset();
      const clone = eltoastSuccess.content.cloneNode(true);
      clone.querySelector(".js-span").innerText =
        res.data.name + " Omadli Qo'shildi!";
      eltoast.appendChild(clone);
      document.getElementById("crud-modal").classList.add("hidden");
      elAddBtn.focus();
      cotegory.push(res);
      ui(cotegory);
    })
    .catch(() => {
      const clone = eltoastWarning.content.cloneNode(true);
      clone.querySelector(".js-toast").innerText = "Xatolik yuz berdi";
      eltoast.appendChild(clone);
      setTimeout(() => {
        eltoast.innerHTML = null;
      }, 3000);
    });
}

function isLogin() {
  if (localStorage.getItem("token") === null) {
    return false;
  } else {
    return true;
  }
}
const token = localStorage.getItem("token");

// fetch(
//   "https://animals-ar28sldhn-muhammadbilols-projects.vercel.app/api/animals",
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   },
// )
//   .then((res) => {
//     if (!res.ok) throw new Error("Serverdan ruxsat yo'q yoki xato");
//     return res.json();
//   })
//   .then((data) => {
//     cotegory = data;
//     ui(cotegory);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

elAddBtn.addEventListener("click", (e) => {
  const login = isLogin();
  if (login === false) {
    e.preventDefault();
    location.href = "./login.html";
  }
});

elContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("js-delete-btn")) {
    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.innerHTML = `<svg class="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
    if (isLogin()) {
      deleteCard(evt.target.id, evt.target);
    } else {
      location.href = "./login.html";
    }
  }
});

function deleteCard(id, evt) {
  const tokenK = localStorage.getItem("token");
  fetch(`/api/animals?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + tokenK,
    },
  })
    .then((res) => res.text())
    .then((res) => {
      const clone = eltoastSuccess.content.cloneNode(true);
      clone.querySelector(".js-span").innerText = "Malumot O'chirildi!";
      eltoast.appendChild(clone);
      setTimeout(() => {
        eltoast.innerHTML = null;
      }, 3000);
      document.getElementById(id).closest(".qwert").remove();
    })
    .catch(() => {
      const clone = eltoastWarning.content.cloneNode(true);
      clone.querySelector(".js-toast").innerText =
        "Xatolik! Qayta urinib ko'ring.";
      eltoast.appendChild(clone);
      setTimeout(() => {
        eltoast.innerHTML = null;
      }, 4000);
      evt.disabled = false;
    })
    .finally(() => {});
}
let editeddata = null;

elEditForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elEditForm);
  const result = { id: editeddata };

  formData.forEach((value, key) => {
    result[key] = value;
  });

  edit(result);
});

elContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("js-edit-btn")) {
    evt.preventDefault();
    eleditModal.showModal();

    const card = evt.target.closest(".qwert");
    const id = card.querySelector(".js-delete-btn").id;
    const data = cotegory.find((el) => el.id == id);

    editeddata = id;

    elEditForm.name.value = data.name ? data.name : "No Name";
    elEditForm.soundText.value = data.soundText
      ? data.soundText
      : "No SoundText";
    elEditForm.category.value = data.category ? data.category : "No category";
    elEditForm.habitat.value = data.habitat ? data.habitat : "No habitat";
    elEditForm.isWild.value = data.isWild ? data.isWild : "No isWild";
    editeddata = data.id;
    if (isLogin()) {
      edit(evt.target.id, evt.target);
    } else {
      location.href = "./login.html";
    }
  }
});

function edit(editedAnimals) {
  const tokenK = localStorage.getItem("token");
  fetch("/api/animals/" + editedAnimals.id, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + tokenK,
    },
    body: JSON.stringify(editedAnimals),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      ui(cotegory);
      eleditModal.close();

      const clone = eltoastSuccess.content.cloneNode(true);
      clone.querySelector(".js-span").innerText = "Malumot O'zgartirildi!";
      eltoast.appendChild(clone);
      setTimeout(() => {
        eltoast.innerHTML = null;
      }, 3000);
    })
    .catch(() => {
      const clone = eltoastWarning.content.cloneNode(true);
      clone.querySelector(".js-toast").innerText = "Xato: Qayta urinib ko'ring";
      eltoast.appendChild(clone);
      setTimeout(() => (eltoast.innerHTML = null), 3000);
    })
    .finally(() => {});
}
