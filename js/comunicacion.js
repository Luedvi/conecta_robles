
const EMAILJS_PUBLIC_KEY = "PUBLIC_KEY";     
const EMAILJS_SERVICE_ID = "SERVICE_ID";    
const EMAILJS_TEMPLATE_ID = "TEMPLATE_ID";  

const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const form = $('#contact-form');
const alertBox = $('#alert');
const sendBtn = $('#sendBtn');

function showAlert(msg, ok=true){
  alertBox.textContent = msg;
  alertBox.hidden = false;
  alertBox.classList.toggle('error', !ok);
  if(ok){ window.scrollTo({top:0, behavior:'smooth'}); }
}

function validate(){
  const errors = {};
  const correo = $('#correo').value.trim();
  if(!$('#nombre').value.trim()) errors.nombre = 'Escribe tu nombre.';
  if(!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errors.correo = 'Correo no válido.';
  if(!$('#asunto').value.trim()) errors.asunto = 'Escribe un asunto.';
  if(!$('#mensaje').value.trim()) errors.mensaje = 'Describe tu mensaje.';
  if(!$('#consent').checked) errors.consent = 'Debes aceptar el aviso de privacidad.';

  ['nombre','correo','asunto','mensaje'].forEach(id => {
    const small = document.querySelector(`[data-for="${id}"]`);
    if (small) small.textContent = errors[id] || '';
  });

  return { ok: Object.keys(errors).length === 0, errors };
}

async function sendViaEmailJS(payload){
  if(!window.emailjs || EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY') return false; 
  try{
    const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
    return res && res.status === 200;
  }catch(err){
    console.error('EmailJS error', err);
    return false;
  }
}

function buildPayload(){
  const data = {
    nombre: $('#nombre').value.trim(),
    casa: $('#casa').value.trim(),
    correo: $('#correo').value.trim(),
    asunto: $('#asunto').value.trim(),
    tipo: ($('input[name="tipo"]:checked')||{}).value,
    mensaje: $('#mensaje').value.trim(),
    evidencia: $('#evidencia').value.trim(),
    telefono: $('#telefono').value.trim(),
    fecha_iso: new Date().toISOString()
  };
  return data;
}

function saveLocalCopy(data){
  const key = 'lr_buzon_historial';
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  items.push(data);
  localStorage.setItem(key, JSON.stringify(items));
}

function fallbackMailto(data){
  const to = 'mesa.directiva@losrobles.mx'; 
  const subject = encodeURIComponent(`[${data.tipo}] ${data.asunto} — ${data.nombre}`);
  const body = encodeURIComponent(
    `Nombre: ${data.nombre}\nCasa/Lote: ${data.casa}\nCorreo: ${data.correo}\nTeléfono: ${data.telefono}\nTipo: ${data.tipo}\n\nMensaje:\n${data.mensaje}\n\nEvidencia: ${data.evidencia}\nFecha: ${new Date().toLocaleString('es-MX')}`
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { ok } = validate();
  if(!ok) return;

  sendBtn.disabled = true;
  sendBtn.textContent = 'Enviando…';

  const payload = buildPayload();

  let sent = await sendViaEmailJS(payload);

  if(!sent){
    fallbackMailto(payload);
    sent = true;
  }

  if(sent){
    saveLocalCopy(payload);
    showAlert('¡Mensaje enviado con éxito! Recibirás respuesta por correo.');
    form.reset();
  } else {
    showAlert('No fue posible enviar el mensaje. Intenta de nuevo más tarde.', false);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Enviar mensaje';
});
