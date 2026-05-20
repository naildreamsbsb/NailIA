// script.js
const handPhoto = document.getElementById('handPhoto');
const preview = document.getElementById('preview');
const generateBtn = document.getElementById('generateBtn');
const generatedImage = document.getElementById('generatedImage');
const whatsappBtn = document.getElementById('whatsappBtn');

let selectedFile = null;

// Pré-visualização da mão
handPhoto.addEventListener('change', function() {
  selectedFile = this.files[0];
  if(selectedFile) {
    preview.src = URL.createObjectURL(selectedFile);
    preview.hidden = false;
  }
});

// Função para converter imagem em base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Geração via serverless
generateBtn.addEventListener('click', async function() {
  if (!selectedFile) return alert("Escolha uma foto da mão.");

  const shape = document.getElementById('nailShape').value;
  const color = document.getElementById('nailColor').value;
  const style = document.getElementById('nailStyle').value;

  const prompt = `Transforme esta unha em: formato ${shape}, cor ${color}, estilo ${style}`;

  try {
    const imageBase64 = await fileToBase64(selectedFile);

    const res = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    const data = await res.json();
    generatedImage.src = data.image;
    generatedImage.hidden = false;
    whatsappBtn.hidden = false;

  } catch (err) {
    alert("Erro ao gerar a imagem: " + err.message);
  }
});

// Envio WhatsApp
whatsappBtn.addEventListener('click', function() {
  const phone = 'SEUNUMERO';
  const msg = encodeURIComponent('Quero fazer essa unha! ' + generatedImage.src);
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
});