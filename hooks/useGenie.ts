import { useCallback, useRef } from 'react';
import html2canvas from 'html2canvas-pro';

interface GenieOptions {
  directions?: ('top' | 'bottom' | 'left' | 'right')[];
  stepQuantum?: number;
  onComplete?: () => void;
}

interface Dimensions {
  w: number;
  h: number;
  t: number;
  l: number;
  b: number;
  r: number;
}

const getClientDimensions = (el: HTMLElement): Dimensions => {
  const rect = el.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    t: rect.top + window.scrollY,
    l: rect.left + window.scrollX,
    b: rect.bottom + window.scrollY,
    r: rect.right + window.scrollX,
  };
};

// Use HTML2Canvas to capture window snapshot without page flashing
export const captureWindowSnapshot = async (element: HTMLElement): Promise<string> => {
  try {
    // 1. Create a deep clone of the original element.
    const clone = element.cloneNode(true) as HTMLElement;

    const redImg = clone.querySelector('img[alt="Close button"]') as HTMLElement | null;
    const yellowImg = clone.querySelector('img[alt="Minimize button"]') as HTMLElement | null;
    const greenImg = clone.querySelector('img[alt="Maximize button"]') as HTMLElement | null;
    
    const header = clone.querySelector('.window-header') as HTMLElement | null;

    // A helper function to create a simple colored circle.
    const createCircle = (color: string) => {
      const circle = document.createElement('div');
      circle.style.width = '12px';
      circle.style.height = '12px';
      circle.style.borderRadius = '9999px';
      circle.style.backgroundColor = color;
      return circle;
    };

    // Replace each <img> with a simple colored div.
    if (redImg && redImg.parentElement) {
      redImg.parentElement.replaceChild(createCircle('#FF5E57'), redImg);
    }
    if (yellowImg && yellowImg.parentElement) {
      yellowImg.parentElement.replaceChild(createCircle('#FFBD2E'), yellowImg);
    }
    if (greenImg && greenImg.parentElement) {
      greenImg.parentElement.replaceChild(createCircle('#28C840'), greenImg);
    }

    // Apply a 'gap' to the parent container to force spacing between the buttons.
    if (header) {
      header.style.gap = '8px'; // This is equivalent to space-x-2 in Tailwind.
    }

    const lockIcon = clone.querySelector('.absolute.left-2.text-gray-500') as HTMLElement | null;
    const addressBar = lockIcon?.parentElement as HTMLElement | null;

    if (lockIcon && addressBar) {
      // 1. Hide the original, problematic icon component.
      lockIcon.style.display = 'none';
      
      // 2. Add a simple, reliable SVG lock icon as a background image.
      addressBar.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>')`;
      addressBar.style.backgroundRepeat = 'no-repeat';
      addressBar.style.backgroundPosition = '8px center'; // Aligns with pl-7
      addressBar.style.backgroundSize = '15px 15px'; // Matches IconLock size
    }
    
    const searchIcon = clone.querySelector('.absolute.left-2') as HTMLElement | null;
    const searchInput = clone.querySelector('input[type="search"]') as HTMLInputElement | null;

    if (searchIcon && searchInput) {
      // 1. Hide the original, problematic icon.
      searchIcon.style.display = 'none';
      searchInput.placeholder = '';
      
      // 2. Add a simple, reliable SVG icon as a background image to the input field.
      searchInput.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>')`;
      searchInput.style.backgroundRepeat = 'no-repeat';
      searchInput.style.backgroundPosition = '8px center'; // Corresponds to 'left-2' and centering
      searchInput.style.backgroundSize = '16px 16px'; // h-4 w-4
    }

    // 2. Style the clone to be OFF-SCREEN but fully rendered.
    clone.style.position = 'fixed';
    clone.style.top = '-9999px'; // Move it far up
    clone.style.left = '-9999px'; // Move it far left
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.height = `${element.offsetHeight}px`;
    clone.style.overflow = 'hidden';
    clone.style.visibility = 'visible'; // Must be visible for html2canvas
    clone.style.opacity = '1';
    clone.style.zIndex = '-1'; // Place it behind everything just in case
    clone.style.pointerEvents = 'none';

    // 3. Append the clone to the document body.
    document.body.appendChild(clone);
    

    // 4. Wait for the next animation frame to ensure the browser has rendered the off-screen clone.
    await new Promise(resolve => requestAnimationFrame(() => resolve(null)));

    // 5. Take the snapshot of the correctly-sized, off-screen clone.
    const canvas = await html2canvas(clone, {
      allowTaint: true,
      useCORS: true,
      scale: 1,
      logging: false,
      backgroundColor: null,
      removeContainer: true,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
      ignoreElements: (el) => {
        return el.classList.contains('bg-\[url') ||
               el.style.backgroundImage.includes('wallpaper') ||
               el.tagName === 'IMG' && el.src.includes('wallpaper');
      },
    });

    // 6. Immediately remove the clone from the DOM.
    document.body.removeChild(clone);

    // 7. Force cleanup of any HTML2Canvas artifacts
    setTimeout(() => {
      const containers = document.querySelectorAll('[class*="html2canvas"]');
      containers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    }, 100);

    return canvas.toDataURL();
  } catch (error) {
    console.warn('HTML2Canvas failed, using fallback:', error);
    
    // ... your fallback method remains the same ...
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const rect = element.getBoundingClientRect();
    
    canvas.width = Math.max(rect.width, 1);
    canvas.height = Math.max(rect.height, 1);
    
    const styles = window.getComputedStyle(element);
    ctx.fillStyle = styles.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
    
    return canvas.toDataURL();
  }
};

class SnapshotGenieEffect {
  private animationDirection: string | null = null;
  private possibleDirections: string[];
  private stepQuantum: number;
  private targetWindow: HTMLElement;
  private genieContainer: HTMLElement;
  private callback?: () => void;
  private animationTarget?: HTMLElement;
  private timeoutTime = 20;

  constructor(targetWindow: HTMLElement, directions: string[], quantum: number, callback?: () => void) {
    this.possibleDirections = directions;
    this.stepQuantum = Math.max(Math.abs(Math.ceil(quantum)), 2);
    this.targetWindow = targetWindow;
    this.genieContainer = document.createElement('div');
    this.genieContainer.className = 'genie-snapshot-container';
    this.genieContainer.style.position = 'fixed';
    this.genieContainer.style.zIndex = '999999'; // Ensure it's above everything
    this.genieContainer.style.pointerEvents = 'none';
    this.genieContainer.style.display = 'block';
    this.genieContainer.style.visibility = 'visible';
    this.genieContainer.style.opacity = '1';
    document.body.appendChild(this.genieContainer);
    this.callback = callback;
  }

  private addTransitionListener(element: HTMLElement, callback: (e: Event) => void) {
    const events = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd'];
    const handler = (e: Event) => {
      events.forEach(event => element.removeEventListener(event, handler));
      callback(e);
    };
    events.forEach(event => element.addEventListener(event, handler));
  }

  private collapseTransitionEvent = (event: Event) => {
    const e = event as TransitionEvent;
    
    switch (e.propertyName) {
      case 'left':
      case 'top':
        const source = this.genieContainer;
        const sourceDim = getClientDimensions(source);
        const targetDim = getClientDimensions(this.animationTarget!);
        const steps = Array.from(source.children) as HTMLElement[];
        const stepQuantum = this.stepQuantum + 1;
        const diffT = stepQuantum - (steps.length - 1) * (1 - stepQuantum) - 1;
        const diffB = stepQuantum + targetDim.h - (steps.length - 1) * (1 - stepQuantum) - 1;
        const diffL = stepQuantum - (steps.length - 1) * (1 - stepQuantum) - 1;
        const diffR = stepQuantum + targetDim.w - (steps.length - 1) * (1 - stepQuantum) - 1;

        switch (this.animationDirection) {
          case 'top':
            for (let i = steps.length - 1; i >= 0; i--) {
              const pos = steps[i].style.backgroundPosition.split(' ');
              const py = parseFloat(pos[1]?.replace('px', '') || '0');
              steps[i].style.backgroundPosition = `0px ${py - diffB}px`;
            }
            break;
          case 'bottom':
            for (let i = 0; i < steps.length; i++) {
              const pos = steps[i].style.backgroundPosition.split(' ');
              const py = parseFloat(pos[1]?.replace('px', '') || '0');
              steps[i].style.backgroundPosition = `0px ${py + diffT}px`;
            }
            break;
          case 'left':
            for (let i = steps.length - 1; i >= 0; i--) {
              const pos = steps[i].style.backgroundPosition.split(' ');
              const px = parseFloat(pos[0]?.replace('px', '') || '0');
              steps[i].style.backgroundPosition = `${px - diffR}px 0px`;
            }
            break;
          case 'right':
            for (let i = 0; i < steps.length; i++) {
              const pos = steps[i].style.backgroundPosition.split(' ');
              const px = parseFloat(pos[0]?.replace('px', '') || '0');
              steps[i].style.backgroundPosition = `${px + diffL}px 0px`;
            }
            break;
        }
        source.className += ' change-pace';
        break;
      case 'background-position':
      case 'background-position-x':
      case 'background-position-y':
        // Animation complete - cleanup
        this.cleanup();
        break;
    }
  };

  private expandTransitionEvent = (event: Event) => {
    const e = event as TransitionEvent;
    const source = (event.target as HTMLElement)?.parentNode as HTMLElement;
    
    switch (e.propertyName) {
      case 'background-position':
      case 'background-position-x':
      case 'background-position-y':
        const steps = Array.from(source.children) as HTMLElement[];
        source.className += ' change-pace';
        
        steps.forEach(step => {
          switch (this.animationDirection) {
            case 'top':
            case 'bottom':
              step.style.width = '100%';
              step.style.left = '0px';
              break;
            case 'left':
            case 'right':
              step.style.height = '100%';
              step.style.top = '0px';
              break;
          }
        });
        break;
      case 'width':
      case 'height':
        // Animation complete - cleanup
        this.cleanup();
        break;
    }
  };

  private cleanup() {
    if (this.genieContainer.parentNode) {
      document.body.removeChild(this.genieContainer);
    }

    // Enhanced cleanup to remove any ghost containers
    setTimeout(() => {
      const allGenieContainers = document.querySelectorAll('.genie-snapshot-container, .genie');
      allGenieContainers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    }, 50);

    // Clean up any leftover styles
    this.targetWindow.style.transform = '';
    this.targetWindow.style.position = '';

    this.callback?.();
  }

  async collapse(targetElement: HTMLElement) {
    // Capture the window snapshot (window will be hidden via isVisible prop)
    const imageDataUrl = await captureWindowSnapshot(this.targetWindow);

    this.animationTarget = targetElement;
    const stepQuantum = this.stepQuantum;
    const windowDim = getClientDimensions(this.targetWindow);
    const targetDim = getClientDimensions(targetElement);

    // Calculate step lengths for each direction
    const stepLengthBottom = Math.ceil((targetDim.t - windowDim.t) / stepQuantum);
    const stepLengthTop = Math.ceil((windowDim.b - targetDim.b) / stepQuantum);
    const stepLengthRight = Math.ceil((targetDim.l - windowDim.l) / stepQuantum);
    const stepLengthLeft = Math.ceil((windowDim.r - targetDim.r) / stepQuantum);

    let stepLengthMax = -1;
    const possibleDirections = this.possibleDirections.length ? this.possibleDirections : ['top', 'bottom', 'right', 'left'];

    // Determine best direction
    if (possibleDirections.includes('bottom') && stepLengthBottom > stepLengthMax) {
      stepLengthMax = stepLengthBottom;
      this.animationDirection = 'bottom';
    }
    if (possibleDirections.includes('top') && stepLengthTop > stepLengthMax) {
      stepLengthMax = stepLengthTop;
      this.animationDirection = 'top';
    }
    if (possibleDirections.includes('left') && stepLengthLeft > stepLengthMax) {
      stepLengthMax = stepLengthLeft;
      this.animationDirection = 'left';
    }
    if (possibleDirections.includes('right') && stepLengthRight > stepLengthMax) {
      stepLengthMax = stepLengthRight;
      this.animationDirection = 'right';
    }

    // Setup collapse animation with the snapshot
    await this.setupCollapseAnimation(windowDim, targetDim, stepQuantum, imageDataUrl);

    this.targetWindow.style.visibility = 'hidden';
  }

  async expand(sourceElement: HTMLElement) {
    // Capture the window snapshot (window is already hidden via isVisible prop)
    const imageDataUrl = await captureWindowSnapshot(this.targetWindow);

    const stepQuantum = this.stepQuantum;
    const sourceDim = getClientDimensions(sourceElement);
    const windowDim = getClientDimensions(this.targetWindow);

    // Calculate step lengths
    const stepLengthBottom = Math.ceil((sourceDim.t - windowDim.t) / stepQuantum);
    const stepLengthTop = Math.ceil((windowDim.b - sourceDim.b) / stepQuantum);
    const stepLengthRight = Math.ceil((sourceDim.l - windowDim.l) / stepQuantum);
    const stepLengthLeft = Math.ceil((windowDim.r - sourceDim.r) / stepQuantum);

    let stepLengthMax = -1;
    const possibleDirections = this.possibleDirections.length ? this.possibleDirections : ['top', 'bottom', 'right', 'left'];

    // Determine best direction
    if (possibleDirections.includes('bottom') && stepLengthBottom > stepLengthMax) {
      stepLengthMax = stepLengthBottom;
      this.animationDirection = 'bottom';
    }
    if (possibleDirections.includes('top') && stepLengthTop > stepLengthMax) {
      stepLengthMax = stepLengthTop;
      this.animationDirection = 'top';
    }
    if (possibleDirections.includes('left') && stepLengthLeft > stepLengthMax) {
      stepLengthMax = stepLengthLeft;
      this.animationDirection = 'left';
    }
    if (possibleDirections.includes('right') && stepLengthRight > stepLengthMax) {
      stepLengthMax = stepLengthRight;
      this.animationDirection = 'right';
    }

    // Setup expand animation with the snapshot
    await this.setupExpandAnimation(sourceDim, windowDim, stepQuantum, imageDataUrl);
  }

  private async setupCollapseAnimation(windowDim: Dimensions, targetDim: Dimensions, stepQuantum: number, imageDataUrl: string) {
    const container = this.genieContainer;
    
    // Setup container exactly like the original
    container.style.width = windowDim.w + 'px';
    container.style.height = windowDim.h + 'px';
    container.style.top = windowDim.t + 'px';
    container.style.left = windowDim.l + 'px';
    container.style.backgroundPosition = '0px -9999px';
    container.style.backgroundImage = `url('${imageDataUrl}')`;
    container.style.backgroundRepeat = 'no-repeat';
    container.style.backgroundSize = `100% ${windowDim.h}px`;
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';

    // Create steps based on direction (following original algorithm exactly)
    let html = '';
    let stepLength = 0;

    switch (this.animationDirection) {
      case 'bottom':
        stepLength = Math.ceil((targetDim.t - windowDim.t) / stepQuantum);

        for (let i = 0; i < stepLength; i++) {
          const top = i * stepQuantum;
          const bgPos = `0px ${-(i + 1) * stepQuantum}px`;
          html += `<div class="genie-step" style="
            left: 0px;
            top: ${top}px;
            width: ${windowDim.w}px;
            height: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            background-size: 100% ${windowDim.h}px;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
        }
        break;
      case 'top':
        stepLength = Math.ceil((windowDim.b - targetDim.b) / stepQuantum);

        for (let i = 0; i < stepLength; i++) {
          const bottom = i * stepQuantum;
          const bgPos = `0px ${windowDim.h - ((stepLength - i) * stepQuantum)}px`;
          html += `<div class="genie-step" style="
            left: 0px;
            bottom: ${bottom}px;
            width: ${windowDim.w}px;
            height: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            background-size: 100% ${windowDim.h}px;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
        }
        break;
      case 'left':
        stepLength = Math.ceil((windowDim.r - targetDim.r) / stepQuantum);

        for (let i = 0; i < stepLength; i++) {
          const right = i * stepQuantum;
          const bgPos = `${windowDim.w - ((stepLength - i) * stepQuantum)}px 0px`;
          html += `<div class="genie-step" style="
            top: 0px;
            right: ${right}px;
            width: ${stepQuantum + 1}px;
            height: ${windowDim.h}px;
            background-position: ${bgPos};
            background-size: ${windowDim.w}px 100%;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
        }
        break;
      case 'right':
        stepLength = Math.ceil((targetDim.l - windowDim.l) / stepQuantum);

        for (let i = 0; i < stepLength; i++) {
          const left = i * stepQuantum;
          const bgPos = `${-(i + 1) * stepQuantum}px 0px`;
          html += `<div class="genie-step" style="
            top: 0px;
            left: ${left}px;
            width: ${stepQuantum + 1}px;
            height: ${windowDim.h}px;
            background-position: ${bgPos};
            background-size: ${windowDim.w}px 100%;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
        }
        break;
    }

    container.innerHTML = html;

    setTimeout(() => {
      // Apply genie curve effect (exact original algorithm)
      const steps = Array.from(container.children) as HTMLElement[];
      const radiansLeft = Math.floor((targetDim.l - windowDim.l) / 2);
      const radiansWidth = Math.floor((targetDim.w - windowDim.w) / 2);
      const rwOffset = radiansWidth - targetDim.w + 1;
      const increase = (Math.PI * 2) / (stepLength * 2);
      let counter = 4.7;

      for (let i = 0; i < steps.length; i++) {
        steps[i].style.left = Math.ceil((Math.sin(counter) * radiansLeft) + radiansLeft) + 'px';
        steps[i].style.width = Math.ceil((Math.sin(counter) * radiansWidth) - rwOffset) + 'px';
        counter += increase;
      }

      // Add transition listener
      if (steps.length > 0) {
        this.addTransitionListener(steps[steps.length - 1], this.collapseTransitionEvent);
      }
      
      container.className += ' collapse';
    }, this.timeoutTime);
  }

  private async setupExpandAnimation(sourceDim: Dimensions, windowDim: Dimensions, stepQuantum: number, imageDataUrl: string) {
    const container = this.genieContainer;
    
    // Setup container
    container.style.width = windowDim.w + 'px';
    container.style.height = windowDim.h + 'px';
    container.style.top = windowDim.t + 'px';
    container.style.left = windowDim.l + 'px';
    container.style.backgroundPosition = '0px 0px';
    // container.style.backgroundImage = `url('${imageDataUrl}')`;
    container.style.backgroundRepeat = 'no-repeat';
    container.style.backgroundSize = `100% ${windowDim.h}px`;
    container.style.display = 'block';
    container.className = 'genie-snapshot-container';

    // Create steps for expand
    let html = '';
    let stepLength = 0;
    let diffT = 0;

    switch (this.animationDirection) {
      case 'bottom':
        stepLength = Math.ceil((sourceDim.t - windowDim.t) / stepQuantum);
        diffT = sourceDim.t - windowDim.t;
        const radiansLeft = Math.floor((sourceDim.l - windowDim.l) / 2);
        const radiansWidth = Math.floor((sourceDim.w - windowDim.w) / 2);
        const rwOffset = radiansWidth - sourceDim.w + 1;
        const increase = (Math.PI * 2) / (stepLength * 2);
        let counter = 4.7;

        for (let i = 0; i < stepLength; i++) {
          const top = i * stepQuantum;
          const bgPos = `0px ${diffT - (i * stepQuantum)}px`;
          const curvedLeft = Math.ceil((Math.sin(counter) * radiansLeft) + radiansLeft);
          const curvedWidth = Math.ceil((Math.sin(counter) * radiansWidth) - rwOffset);

          html += `<div class="genie-step" style="
            top: ${top}px;
            height: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            left: ${curvedLeft}px;
            width: ${curvedWidth}px;
            background-size: 100% ${windowDim.h}px;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
          counter += increase;
        }
        break;
      case 'top':
        stepLength = Math.ceil((windowDim.b - sourceDim.b) / stepQuantum);
        diffT = windowDim.b - sourceDim.b;
        const radiansLeftTop = Math.floor((sourceDim.l - windowDim.l) / 2);
        const radiansWidthTop = Math.floor((sourceDim.w - windowDim.w) / 2);
        const rwOffsetTop = radiansWidthTop - sourceDim.w + 1;
        const increaseTop = (Math.PI * 2) / (stepLength * 2);
        let counterTop = 4.7;

        for (let i = 0; i < stepLength; i++) {
          const bottom = i * stepQuantum;
          const bgPos = `0px ${windowDim.h - diffT + (i * stepQuantum)}px`;
          const curvedLeft = Math.ceil((Math.sin(counterTop) * radiansLeftTop) + radiansLeftTop);
          const curvedWidth = Math.ceil((Math.sin(counterTop) * radiansWidthTop) - rwOffsetTop);

          html += `<div class="genie-step" style="
            bottom: ${bottom}px;
            height: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            left: ${curvedLeft}px;
            width: ${curvedWidth}px;
            background-size: 100% ${windowDim.h}px;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
          counterTop += increaseTop;
        }
        break;
      case 'left':
        stepLength = Math.ceil((windowDim.r - sourceDim.r) / stepQuantum);
        const diffL = windowDim.r - sourceDim.r;
        const radiansTopLeft = Math.floor((sourceDim.t - windowDim.t) / 2);
        const radiansHeightLeft = Math.floor((sourceDim.h - windowDim.h) / 2);
        const rhOffsetLeft = radiansHeightLeft - sourceDim.h + 1;
        const increaseLeft = (Math.PI * 2) / (stepLength * 2);
        let counterLeft = 4.7;

        for (let i = 0; i < stepLength; i++) {
          const right = i * stepQuantum;
          const bgPos = `${windowDim.w - diffL + (i * stepQuantum)}px 0px`;
          const curvedTop = Math.ceil((Math.sin(counterLeft) * radiansTopLeft) + radiansTopLeft);
          const curvedHeight = Math.ceil((Math.sin(counterLeft) * radiansHeightLeft) - rhOffsetLeft);

          html += `<div class="genie-step" style="
            right: ${right}px;
            width: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            top: ${curvedTop}px;
            height: ${curvedHeight}px;
            background-size: ${windowDim.w}px 100%;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
          counterLeft += increaseLeft;
        }
        break;
      case 'right':
        stepLength = Math.ceil((sourceDim.l - windowDim.l) / stepQuantum);
        const diffR = sourceDim.l - windowDim.l;
        const radiansTopRight = Math.floor((sourceDim.t - windowDim.t) / 2);
        const radiansHeightRight = Math.floor((sourceDim.h - windowDim.h) / 2);
        const rhOffsetRight = radiansHeightRight - sourceDim.h + 1;
        const increaseRight = (Math.PI * 2) / (stepLength * 2);
        let counterRight = 4.7;

        for (let i = 0; i < stepLength; i++) {
          const left = i * stepQuantum;
          const bgPos = `${diffR - (i * stepQuantum)}px 0px`;
          const curvedTop = Math.ceil((Math.sin(counterRight) * radiansTopRight) + radiansTopRight);
          const curvedHeight = Math.ceil((Math.sin(counterRight) * radiansHeightRight) - rhOffsetRight);

          html += `<div class="genie-step" style="
            left: ${left}px;
            width: ${stepQuantum + 1}px;
            background-position: ${bgPos};
            top: ${curvedTop}px;
            height: ${curvedHeight}px;
            background-size: ${windowDim.w}px 100%;
            background-image: url('${imageDataUrl}');
            background-repeat: no-repeat;
            position: absolute;
          "></div>`;
          counterRight += increaseRight;
        }
        break;
    }

    container.innerHTML = html;

    // Add transition listener
    const steps = Array.from(container.children) as HTMLElement[];
    if (steps.length > 0) {
      this.addTransitionListener(steps[0], this.expandTransitionEvent);
    }

    setTimeout(() => {
      // Update background positions based on direction
      steps.forEach((step, i) => {
        const pos = step.style.backgroundPosition.split(' ');

        switch (this.animationDirection) {
          case 'bottom':
          case 'top': {
            const py = parseFloat(pos[1]?.replace('px', '') || '0');
            step.style.backgroundPosition = `0px ${py - diffT}px`;
            break;
          }
          case 'left': {
            const px = parseFloat(pos[0]?.replace('px', '') || '0');
            const diffL = windowDim.r - sourceDim.r;
            step.style.backgroundPosition = `${px - diffL}px 0px`;
            break;
          }
          case 'right': {
            const px = parseFloat(pos[0]?.replace('px', '') || '0');
            const diffR = sourceDim.l - windowDim.l;
            step.style.backgroundPosition = `${px - diffR}px 0px`;
            break;
          }
        }
      });

      container.className += ' expand';
    }, this.timeoutTime);
  }
}

export const useGenieEffect = () => {
  const animationRef = useRef<SnapshotGenieEffect | null>(null);

  const genieExpand = useCallback(async (source: HTMLElement, target: HTMLElement, options: GenieOptions = {}) => {
    const { directions = ['bottom'], stepQuantum = 2, onComplete } = options;
    
    if (animationRef.current) {
      animationRef.current = null;
    }

    let callbackCalled = false;
    const callbackDelegate = () => {
      if (callbackCalled) return;
      callbackCalled = true;
      onComplete?.();
    };

    const animation = new SnapshotGenieEffect(target, directions, stepQuantum, callbackDelegate);
    animationRef.current = animation;

    try {
      await animation.expand(source);
    } catch (error) {
      console.error('Genie expand error:', error);
      callbackDelegate();
    }

    // Final cleanup after animation timeout
    setTimeout(() => {
      const ghostContainers = document.querySelectorAll('.genie-snapshot-container, .genie');
      ghostContainers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
      callbackDelegate();
    }, 2000);
  }, []);

  const genieCollapse = useCallback(async (source: HTMLElement, target: HTMLElement, options: GenieOptions = {}) => {
    const { directions = ['bottom'], stepQuantum = 2, onComplete } = options;
    
    if (animationRef.current) {
      animationRef.current = null;
    }

    let callbackCalled = false;
    const callbackDelegate = () => {
      if (callbackCalled) return;
      callbackCalled = true;
      onComplete?.();
    };

    const animation = new SnapshotGenieEffect(source, directions, stepQuantum, callbackDelegate);
    animationRef.current = animation;

    try {
      await animation.collapse(target);
    } catch (error) {
      console.error('Genie collapse error:', error);
      callbackDelegate();
    }

    // Final cleanup after animation timeout
    setTimeout(() => {
      const ghostContainers = document.querySelectorAll('.genie-snapshot-container, .genie');
      ghostContainers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
      callbackDelegate();
    }, 2000);
  }, []);

  const cleanup = useCallback(() => {
    animationRef.current = null;

    // Clean up any leftover genie containers immediately
    const containers = document.querySelectorAll('.genie-snapshot-container, .genie');
    containers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });

    // Additional cleanup after a short delay to catch any lingering elements
    setTimeout(() => {
      const lingering = document.querySelectorAll('.genie-snapshot-container, .genie, [class*="genie"]');
      lingering.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    }, 200);
  }, []);

  return { genieExpand, genieCollapse, cleanup };
};
