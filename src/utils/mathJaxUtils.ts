declare global {
  interface Window {
    MathJax: any;
  }
}

export const renderMathJax = () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise().catch((err: any) => {
      console.error('MathJax rendering error:', err);
    });
  }
};

export const waitForMathJax = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.MathJax) {
      resolve();
    } else {
      const checkMathJax = () => {
        if (window.MathJax) {
          resolve();
        } else {
          setTimeout(checkMathJax, 100);
        }
      };
      checkMathJax();
    }
  });
};