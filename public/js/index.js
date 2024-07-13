let taxSwitch = document.getElementById("flexSwitchCheckDefault");

document.addEventListener("DOMContentLoaded", () => {
      // Trigger the fade-in effect with a delay
      const boxes = document.querySelectorAll(".do-fade");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("hidden");
            entry.target.classList.add("visible");
            entry.target.style.marginTop = "0.5rem";
          } else {
            entry.target.classList.remove("visible");
            entry.target.style.marginTop = "3rem";
            box.addEventListener('transitionend', () => {
              if (!entry.target.classList.contains('visible')) {
                entery.target.classList.add("hidden");
              }
            }, { once: true });
          }
        });
      });

      boxes.forEach(box => observer.observe(box));
    });

/* tax show switch */
    taxSwitch.addEventListener("click", () => {
      let infoTax = document.getElementsByClassName("tax-info");
      for (let i = 0; i < infoTax.length; i++) {
        if (infoTax[i].classList.contains("show")) {
          infoTax[i].classList.remove("show");
        } else {
          infoTax[i].classList.add("show");
        }
      }
    });
    