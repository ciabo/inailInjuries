//JavaScript Document
document.addEventListener('DOMContentLoaded',function(){
	console.log('start');
	contacts = document.getElementById('listacontatti');
	contacts.addEventListener('click',function(){
		contacts.style.display = 'block';
	})
})