// Interactive Intro for "What is Programming?"

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".concept");
  const infoBox = document.querySelector("#info-box");

  sections.forEach((section) => {
    section.addEventListener("click", () => {
      const concept = section.dataset.concept;
      showInfo(concept);
    });
  });

  function showInfo(concept) {
    let content = "";

    switch (concept) {
      case "variables":
        content = `
          <h2>Variables</h2>
          <p>Think of variables like containers where you store values, just like keeping cookies in a jar.</p>
          <code>let cookies = 10;</code>
        `;
        break;
      case "functions":
        content = `
          <h2>Functions</h2>
          <p>Functions are like recipes. You write steps once and use them again whenever needed.</p>
          <code>function bakeCookies() { console.log("Baking cookies!"); }</code>
        `;
        break;
      case "loops":
        content = `
          <h2>Loops</h2>
          <p>Loops let you repeat actions without rewriting code, like practicing football drills.</p>
          <code>for(let i=0; i<5; i++) { console.log("Practice!"); }</code>
        `;
        break;
      case "fullstack":
        content = `
          <h2>Full Stack Development</h2>
          <p>Full stack is building both the front end (what users see) and the back end (the logic and database).</p>
          <code>// Frontend (React), Backend (Node.js), Database (MongoDB)</code>
        `;
        break;
      default:
        content = `<p>Select a concept to learn more!</p>`;
    }

    infoBox.innerHTML = content;
    infoBox.classList.add("show");
  }
});
