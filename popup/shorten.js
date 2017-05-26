document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("menu-entry")) {
    return;
  }
  if (e.target.classList.contains("pff_gen_priv")) {
    alert("Private");
  } else if (e.target.classList.contains("pff_gen_pub")) {
    alert("Public");
  } else if (e.target.classList.contains("pff_settings")) {
    alert("Settings");
  }
});