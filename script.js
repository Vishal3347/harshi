let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse & Touch move handling
    const moveHandler = (e) => {
      const isTouch = e.type.includes("touch");
      const event = isTouch ? e.touches[0] : e;
      
      if (!this.rotating) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = event.clientX - this.mouseTouchX;
      const dirY = event.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;
      
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse & Touch start event
    const startHandler = (e) => {
      const isTouch = e.type.includes("touch");
      const event = isTouch ? e.touches[0] : e;

      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.mouseTouchX = event.clientX;
      this.mouseTouchY = event.clientY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      if (!isTouch && e.button === 2) {
        this.rotating = true;
      }
    };

    // Mouse & Touch end event
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Add Event Listeners
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });

    paper.addEventListener("mousedown", startHandler);
    paper.addEventListener("touchstart", startHandler, { passive: false });

    window.addEventListener("mouseup", endHandler);
    window.addEventListener("touchend", endHandler);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
