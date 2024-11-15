import cardTemplate from "@/public/template.png";

export const createCard = ({
  imageUrl,
  name,
  intro,
}: {
  imageUrl: string;
  name: string;
  intro: string;
}) => {
  return new Promise<Blob>(async (resolve, reject) => {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      // Draw the text
      ctx.fillText(name ?? "", 150, 300);

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;
      image.onload = () => {
        const template = new Image();
        template.src = cardTemplate.src;

        template.onload = () => {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(template, 0, 0, 512, 512);
          ctx.drawImage(image, 108, 38, 298, 298);

          // draw text
          ctx.font =
            name.length < 12
              ? "24px Kusanagi"
              : name.length < 18
              ? "18px Kusanagi"
              : name.length < 24
              ? "16px Kusanagi"
              : "10px Kusanagi";
          ctx.fillStyle = "rgba(0, 0, 0)";
          ctx.textAlign = "center";

          ctx.fillText(name, 256, 370);

          ctx.font = "16px Montserrat";
          ctx.textAlign = "center";
          const text = getCanvasText(intro, [], 0);
          text?.forEach((text, i) => {
            ctx.fillText(text, 256, 405 + i * 18);
          });
          ctx.font = "bold 14px Montserrat";
          const formattedDate = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          ctx.textAlign = "center";
          ctx.fillText(formattedDate, 256, 475);

          canvas?.toBlob(async (blob) => {
            if (blob) {
              resolve(blob);
              // resolve(Buffer.from(await blob.arrayBuffer()));
            } else {
              reject({ message: "Failed to create blob" });
            }
          });
        };
      };
    }
  });
};

function getCanvasText(text: string, result: string[], nextIndex: number) {
  const rowTextNum = 35;
  if (!text) return result;

  if (text.length < nextIndex + rowTextNum) {
    result.push(text?.substring(nextIndex));
    return result;
  }

  let index = nextIndex + rowTextNum;

  if (!text.substring(nextIndex + 20, nextIndex + 40).includes(" ")) {
    result.push(text.substring(nextIndex, index));
    return getCanvasText(text, result, index);
  }
  while (text[index] !== " ") {
    index--;
  }
  result.push(text.substring(nextIndex, index));
  return getCanvasText(text, result, index);
}
