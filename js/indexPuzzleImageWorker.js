self.onmessage = (event) => {
  const { image, width, height } = event.data;

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");

  const img = new Image();
  img.src = image;
  img.onload = () => {
    context.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL();
    self.postMessage(dataUrl);
  };
};
