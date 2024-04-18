self.onmessage = async (event) => {
  const { image, width, height } = event.data;

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");

  const response = await fetch(image);
  const blob = await response.blob();

  const img = await createImageBitmap(blob);

  context.drawImage(img, 0, 0, width, height);
  
  const blobFromCanvas = await canvas.convertToBlob();
  
  const dataUrl = URL.createObjectURL(blobFromCanvas);
  
  self.postMessage(dataUrl);
};