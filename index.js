const content = document.querySelector(".primary-content");
const form = document.querySelector("form");
let user;

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  setLightMode();
}
function setLightMode() {
  document.documentElement.classList.toggle("dark-mode");
  if (document.documentElement.classList.contains("dark-mode")) {
    switchLight.innerHTML = `Light <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g  fill-rule="nonzero"><path d="M13.545 6.455c-.9-.9-2.17-1.481-3.545-1.481a4.934 4.934 0 00-3.545 1.481c-.9.9-1.481 2.17-1.481 3.545 0 1.376.582 2.646 1.481 3.545.9.9 2.17 1.481 3.545 1.481a4.934 4.934 0 003.545-1.481c.9-.9 1.481-2.17 1.481-3.545a4.934 4.934 0 00-1.481-3.545zM10 3.413a.7.7 0 00.688-.688V.688A.7.7 0 0010 0a.7.7 0 00-.688.688v2.037a.7.7 0 00.688.688zM15.635 5.344l1.455-1.455a.67.67 0 000-.952.67.67 0 00-.952 0l-1.455 1.455a.67.67 0 000 .952c.238.264.66.264.952 0zM19.312 9.312h-2.037a.7.7 0 00-.688.688.7.7 0 00.688.688h2.037A.7.7 0 0020 10a.7.7 0 00-.688-.688zM15.608 14.656a.67.67 0 00-.952 0 .67.67 0 000 .952l1.455 1.455a.67.67 0 00.952 0 .67.67 0 000-.952l-1.455-1.455zM10 16.587a.7.7 0 00-.688.688v2.037A.7.7 0 0010 20a.7.7 0 00.688-.688v-2.037a.7.7 0 00-.688-.688zM4.365 14.656L2.91 16.111a.67.67 0 000 .952.67.67 0 00.952 0l1.455-1.455a.67.67 0 000-.952c-.238-.264-.66-.264-.952 0zM3.413 10a.7.7 0 00-.688-.688H.688A.7.7 0 000 10a.7.7 0 00.688.688h2.037A.7.7 0 003.413 10zM4.365 5.344a.67.67 0 00.952 0 .67.67 0 000-.952L3.862 2.937a.67.67 0 00-.952 0 .67.67 0 000 .952l1.455 1.455z"/></g></svg>
    `;
  } else {
    switchLight.innerHTML = `
  Dark <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M19.513 11.397a.701.701 0 00-.588.128 7.496 7.496 0 01-2.276 1.336 7.101 7.101 0 01-2.583.462 7.505 7.505 0 01-5.32-2.209 7.568 7.568 0 01-2.199-5.342c0-.873.154-1.72.41-2.49a6.904 6.904 0 011.227-2.21.657.657 0 00-.102-.924.701.701 0 00-.589-.128C5.32.61 3.427 1.92 2.072 3.666A10.158 10.158 0 000 9.83c0 2.8 1.125 5.342 2.967 7.19a10.025 10.025 0 007.16 2.98c2.353 0 4.527-.822 6.266-2.183a10.13 10.13 0 003.58-5.624.623.623 0 00-.46-.796z" fill-rule="nonzero"/></svg>
    `;
  }
}
switchLight.addEventListener("click", (e) => {
  setLightMode();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("ok");
  searchUser();
});
inputSearch.addEventListener("input", (e) => {
  if (inputSearch.value === "") {
    document.querySelector(" .search-bar span").classList.remove("error");
  }
});

btnSearch.addEventListener("click", () => searchUser);
const searchUser = () => {
  if (inputSearch) {
    console.log(inputSearch.value);
    fetcher(inputSearch.value);
  }
};

const fetcher = async (myUser) => {
  myUser ? myUser : (myUser = "Octocat");
  await fetch(`https://api.github.com/users/${myUser}`)
    .then((res) => res.json())
    .then((data) => (user = data));
  displayUser();
};

fetcher();

const displayUser = () => {
  let bio, location, blog, twitter, company;
  console.log(user);
  if (user.message === "Not Found") {
    console.log("Aucun résulat");
    document.querySelector(" .search-bar span").classList.add("error");
  } else {
    document.querySelector(" .search-bar span").classList.remove("error");
    const dateParser = (date) => {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.toLocaleString("en-US", { month: "short" });
      let year = newDate.getFullYear();
      return `${day} ${month} ${year}`;
    };

    for (i in user) {
      switch (i) {
        case "bio":
          if (user[i] === null) {
            bio = `<p class="unavailable bio">This profile has no bio</p>`;
          } else {
            bio = `<p classe="bio">${user.bio}</p>`;
          }
          break;
        case "location":
          location = isAvailable(user[i], "location", "Not available");
          break;
        case "blog":
          blog = isAvailable(user[i], "website", "Not available", "a");
          break;
        case "twitter_username":
          twitter = isAvailable(user[i], "twitter", "Not available");
          break;
        case "company":
          company = isAvailable(user[i], "company", "Not available");
          break;
        default:
          break;
      }
    }
    content.innerHTML = `
        <img class="imgAvatar" src=${user.avatar_url}>
        <div class="main-header">
                    <h2>${user.name}</h2>
                    <span>@${user.login}</span>
                    <p>Joined ${dateParser(user.created_at)}</p>
          </div>
          <div class="main-content">
            ${bio}
            <ul class="main-body">
              <li>
              <h4>Repos</h4>
              <p>${user.public_repos}</p>
              </li>
              <li>
              <h4>Followers</h4>
              <p>${user.followers}</p>
              </li>
              <li>
              <h4>Following</h4>
              <p>${user.following}</p>
              </li>
            </ul>

            <ul class="main-footer">
            ${location}
            ${blog}
            
            ${twitter}
            ${company}
           
           
          </ul>
          </div>
         
      `;
  }
};

function isAvailable(myUser, img, message, tag = "p") {
  if (myUser === null || myUser === "") {
    return `<li class="unavailable">
    <img src="./assets/img/icon-${img}.svg" alt="icon ${img}">
    <p>${message}</p>
  </li>`;
  } else {
    return `<li>
    <img src="./assets/img/icon-${img}.svg" alt="icon ${img}">
    <${tag}>${myUser}</${tag}>
    </li>`;
  }
}
