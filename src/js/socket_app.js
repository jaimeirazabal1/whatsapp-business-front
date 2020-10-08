var app = new Vue({
  el: '#whatsapp',
  data: {
    message: 'Hello Vue!'
    socket:null
  },
  mounted(){
  	this.socket = io.connect('http://localhost:8080', { 'forceNew': true });
  	this.$http.get('https://google.com',function(response){
  		console.log("response",response)
  	}).catch(error=>{
  		console.log("error",error)
  	})
  }
})