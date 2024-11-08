import cardTemplate from "@/public/template.png";

export const createCard = ({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) => {
  return new Promise<Buffer>(async (resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      // draw round rect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.roundRect(128, 16, 256, 480, [40]);
      ctx.stroke();

      // Load the custom font
      const font = new FontFace("Kusanagi", 'url("./Kusanagi.otf}")');
      await font.load();

      // Add the font to the document
      document.fonts.add(font);

      // Set the font in the context, and specify the size
      ctx.font = `24px Kusanagi`;

      // Draw the text
      ctx.fillText(name, 150, 300);

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;
      image.onload = () => {
        const template = new Image();
        template.src = cardTemplate.src;
        template.onload = () => {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(template, 0, 0, 512, 512);
          ctx.drawImage(image, 122, 43, 268, 268);

          //draw a bottom line
          ctx.beginPath();
          ctx.moveTo(142, 365);
          ctx.lineTo(370, 365);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(0, 0, 0, 1)";
          ctx.stroke();

          // draw text
          ctx.font =
            name.length < 12
              ? "bold 40px serif"
              : name.length < 18
              ? "bold 32px serif"
              : name.length < 24
              ? "bold 24px serif"
              : "bold 18px serif";
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.textAlign = "center";
          ctx.fillText(name, 256, 360);

          ctx.font = "14px serif";
          ctx.textAlign = "left";
          ctx.fillText("Last Name:", 122, 420);
          ctx.fillText("First Name:", 122, 445);
          ctx.fillText("Birth:", 122, 470);
          ctx.fillText(name.split(".")[1], 190, 420);
          ctx.fillText(name.split(".")[0], 190, 445);
          const formattedDate = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          ctx.fillText(formattedDate, 157, 470);

          canvas?.toBlob(async (blob) => {
            if (blob) {
              resolve(Buffer.from(await blob.arrayBuffer()));
            } else {
              reject({ message: "Failed to create blob" });
            }
          });
        };
      };
    }
  });
};
