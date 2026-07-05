// Nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Enquiry form
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector(".form-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong");
      status.classList.add("success");
      status.textContent =
        "Thanks! We've received your enquiry. We'll call you back within a few hours.";
      form.reset();
    } catch (err) {
      status.classList.add("error");
      status.textContent =
        "Sorry, could not send. Please WhatsApp us at +91 74881 41252.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Enquiry";
    }
  });
});
