// Script para limpar cookies via DevTools Console
// Copie e cole no Console do navegador (F12)

console.log("🔄 Limpando todas as sessões antigas...");

// Limpar todos os cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Limpar localStorage
localStorage.clear();

// Limpar sessionStorage
sessionStorage.clear();

console.log("✅ Cookies e storage limpos!");
console.log("🔄 Redirecionando para login...");

// Redirecionar para login
setTimeout(() => {
  window.location.href = '/login';
}, 1000);
