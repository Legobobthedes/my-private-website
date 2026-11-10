
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", function() {
    navigation.classList.toggle("active");
});

const links = navigation.querySelectorAll("a");

links.forEach(function(link) {
    link.addEventListener("click", function() {
        navigation.classList.remove("active");
    });
});

const communityButton = document.getElementById("communityButton");

communityButton.addEventListener("click", function() {
    alert("The private community is coming soon!");
});

// CREATIONS GALLERY

const imageUpload = document.getElementById("imageUpload");
const imageTitle = document.getElementById("imageTitle");
const imageCategory = document.getElementById("imageCategory");
const gallery = document.getElementById("gallery");

let savedImages = [];

try {
    savedImages = JSON.parse(
        localStorage.getItem("myCreations") || "[]"
    );
} catch (error) {
    savedImages = [];
}

function displayImages() {
    gallery.innerHTML = "";

    if (savedImages.length === 0) {
        gallery.innerHTML =
            '<p class="empty-gallery">Your creations will appear here.</p>';
        return;
    }

    savedImages.forEach(function(item, index) {
        const card = document.createElement("div");
        card.className = "gallery-item";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;

        const info = document.createElement("div");
        info.className = "gallery-info";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        const category = document.createElement("p");
        category.textContent = item.category;

        const remove = document.createElement("button");
        remove.className = "delete-image";
        remove.textContent = "Remove";

        remove.addEventListener("click", function() {
            savedImages.splice(index, 1);
            saveImages();
        });

        info.append(heading, category, remove);
        card.append(img, info);
        gallery.appendChild(card);
    });
}

function saveImages() {
    try {
        localStorage.setItem(
            "myCreations",
            JSON.stringify(savedImages)
        );
        displayImages();
    } catch (error) {
        alert("Storage is full. Try removing some images.");
    }
}


imageUpload.addEventListener("change", function() {
    const file = imageUpload.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please choose an image.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("Please choose an image smaller than 10 MB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        const image = new Image();

        image.onload = function() {
            const canvas = document.createElement("canvas");

            const scale = Math.min(
                1,
                1200 / Math.max(image.width, image.height)
            );

            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);

            const context = canvas.getContext("2d");

            context.drawImage(
                image, 0, 0,
                canvas.width, canvas.height
            );

            const compressedImage = canvas.toDataURL(
                "image/jpeg", 0.7
            );

            savedImages.push({
                title: imageTitle.value.trim() || "Untitled",
                category: imageCategory.value,
                image: compressedImage
            });

            saveImages();

            imageTitle.value = "";
            imageUpload.value = "";
        };

        image.onerror = function() {
            alert("Couldn't process that image.");
        };

        image.src = reader.result;
    };

    reader.readAsDataURL(file);
});

displayImages();

// PROFILE PICTURE UPLOAD

const profileUpload = document.getElementById("profileUpload");
const profilePicture = document.getElementById("profilePicture");

const savedProfilePicture = localStorage.getItem("profilePicture");

if (savedProfilePicture) {
    profilePicture.src = savedProfilePicture;
}

profileUpload.addEventListener("change", function() {
    const file = profileUpload.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please choose an image.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("Please choose an image under 10 MB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        const image = new Image();

        image.onload = function() {
            const canvas = document.createElement("canvas");

            canvas.width = 400;
            canvas.height = 400;

            const context = canvas.getContext("2d");

            const size = Math.min(image.width, image.height);
            const x = (image.width - size) / 2;
            const y = (image.height - size) / 2;

            context.drawImage(
                image,
                x, y, size, size,
                0, 0, 400, 400
            );

            const compressed = canvas.toDataURL(
                "image/jpeg", 0.7
            );

            try {
                localStorage.setItem(
                    "profilePicture",
                    compressed
                );

                profilePicture.src = compressed;
                alert("Profile picture updated!");
            } catch (error) {
                alert("Storage is full. Try a smaller image.");
            }
        };

        image.src = reader.result;
    };

    reader.readAsDataURL(file);
});

/* EDIT PROFILE */

const editButton = document.getElementById("editProfile");
const editForm = document.getElementById("editProfileForm");

const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const interestsInput = document.getElementById("interestsInput");

const profileName = document.getElementById("profileName");
const profileBio = document.getElementById("profileBio");
const profileInterests = document.getElementById("profileInterests");

function loadProfile() {
    const profile = JSON.parse(
        localStorage.getItem("myProfile") || "null"
    );

    if (!profile) return;

    profileName.textContent = profile.name;
    profileBio.textContent = profile.bio;

    profileInterests.innerHTML = "";

    profile.interests.forEach(function(item) {
        const span = document.createElement("span");
        span.textContent = item;
        profileInterests.appendChild(span);
    });
}

editButton.addEventListener("click", function() {
    nameInput.value = profileName.textContent;
    bioInput.value = profileBio.textContent;

    interestsInput.value = Array.from(
        profileInterests.querySelectorAll("span")
    ).map(span => span.textContent).join(", ");

    editForm.hidden = false;
});

document.getElementById("saveProfile").addEventListener(
    "click", function() {

    const profile = {
        name: nameInput.value.trim() || "Your Name",
        bio: bioInput.value.trim(),
        interests: interestsInput.value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean)
            .slice(0, 10)
    };

    try {
        localStorage.setItem(
            "myProfile",
            JSON.stringify(profile)
        );

        loadProfile();
        editForm.hidden = true;

    } catch (error) {
        alert("Could not save your profile.");
    }
});

loadProfile();



// SUPABASE CONNECTION

const SUPABASE_URL = "https://nvqdkutjmcdbheanuxgs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_OggF1QMDBthNbfuidQiqbA_h_9HKCEf ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connection initialized!");

const createInviteButton = document.getElementById("createInviteButton");
const inviteEmailInput = document.getElementById("inviteEmail");
const inviteMessage = document.getElementById("inviteMessage");
const invitationList = document.getElementById("invitationList");

if (createInviteButton) {
  createInviteButton.addEventListener("click", async () => {
    const email = inviteEmailInput.value.trim();

    if (!email) {
      inviteMessage.textContent = "Please enter an email address.";
      return;
    }

    createInviteButton.disabled = true;
    inviteMessage.textContent = "Creating invitation...";

    try {
      const { data: { session } } =
        await supabaseClient.auth.getSession();

      if (!session) {
        throw new Error("Please log in first.");
      }

      const { data, error } =
        await supabaseClient.functions.invoke(
          "create-invitation",
          {
            body: { email: email }
          }
        );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      inviteMessage.textContent = "Invitation created successfully!";
      inviteEmailInput.value = "";

      const item = document.createElement("p");
      item.textContent = "Invitation for " + data.invitation.email;
      invitationList.appendChild(item);

    } catch (error) {
      console.error(error);
      inviteMessage.textContent =
        error.message || "Could not create invitation.";
    }

    createInviteButton.disabled = false;
  });
}

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const accountEmail = document.getElementById("accountEmail");
const accountPassword = document.getElementById("accountPassword");
const authMessage = document.getElementById("authMessage");
const adminPanel = document.getElementById("adminPanel");

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    authMessage.textContent = "Logging in...";

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: accountEmail.value.trim(),
        password: accountPassword.value
      });

    if (error) {
      authMessage.textContent = error.message;
      return;
    }

    authMessage.textContent = "Logged in successfully!";

    const isAdmin = data.user.app_metadata?.role === "admin";

    if (adminPanel) {
      adminPanel.hidden = !isAdmin;
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();

    if (adminPanel) {
      adminPanel.hidden = true;
    }

    authMessage.textContent = "You are logged out.";
  });
}
