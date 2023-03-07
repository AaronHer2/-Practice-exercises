const download = document.querySelector(".download");
const dark = document.querySelector(".dark");
const light = document.querySelector(".light");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");

dark.addEventListener("input", handleDarkColor);
light.addEventListener("input", handleLightColor);
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);

const defaultQR = "CODIGO QR PREVIO"; //ESTO PARA EL QR DEFAULT 
let colorLight = "#fff",
    colorDark = "#000",
    text = defaultQR,
    size = 400;
//FUNCION PARA DAR COLOR A LA PARTE OSCURA DEL QR
function handleDarkColor(e) {
    colorDark = e.target.value;
    generateQRCode();
}
// FUNCION PARA DAR COLOR A LA PARTE CLARA DEL QR
function handleLightColor(e) {
    colorLight = e.target.value;
    generateQRCode();
}
// FUNCION PARA PODER CREAR LOS NUEVOS CODIGOS QR CON EL TEXTO QUE SE INGRESE
function handleQRText(e) {
    const value = e.target.value;
    text = value;
    if (!value) {
        text = defaultQR;
    }
    generateQRCode();
}
// FUNCION PARA CREAR EL QR CON EL TEXTO QUE SE QUIERA
async function generateQRCode() {
    qrContainer.innerHTML = "";
    new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl(); //PARA PODER HACER LA DESCARGA DEL QR
}
// FUNCION PARA PODER COMPARTIR EL CODIGO QR USANDO EL NAVEGADOR 
async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error) {
            alert("Your browser doesn't support sharing.");
        }
    }, 100);
}
// FUNCION PARA PODER CAMBIAR EL TAMAÑO DEL CODIGO QR -- EL DEFAULT ES DE 400x400px
function handleSize(e) {
    size = e.target.value;
    generateQRCode();
}
// FUNCION PARA PODER DESCARGAR EL CODIGO QR
function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img");
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}

generateQRCode();