window.app = new Vue({
  el: '#whatsapp',
  data: {
    socket:null,
    user_email:null,
    message:'',
    mensajes:[],
    objIntranet:null,
    PHPController:null,
    mis_clientes:[],
    current_cliente:{
      firstName:'',
      lastName:'',
      numero:''
    },
    isActive: false
  },
  filters: {
    moment: function (date) {
      const date_clean = new Date(date.replace('T',' '));
      // console.log('date_clean',date_clean)
      moment.locale('es');

      return moment(date_clean).calendar();
    }
  }, 
  methods: {
    moment: function () {

      return moment();
    },
    send_message(event){
    	event.preventDefault()
  		console.log("Enviando mensaje");
  		this.socket.emit('new-message', this.message);
  		this.message = '';
  	},
    show_client_message(cliente){
      console.log(event.target)
      console.log(cliente.cliente.cliente_numero);
      console.log(this.$refs['div_'+cliente.cliente.cliente_numero][0].className)
      // document.getElementsByClassName('link') 
      // console.log(window.document.getElementsByClassName('sideBar-body'))

      //quita el resaltado de todas las conversaciones
      const chats_div = window.document.getElementsByClassName('sideBar-body');
      for (var i = chats_div.length - 1; i >= 0; i--) {
        chats_div[i].className = 'row sideBar-body';
      }
      //resalta la conversacion que se clickeo
      this.$refs['div_'+cliente.cliente.cliente_numero][0].className = this.$refs['div_'+cliente.cliente.cliente_numero][0].className + " active_chat";
      // console.log('cliente.mensajes',cliente.mensajes)
      this.mensajes = cliente.mensajes;
      this.current_cliente = {
        firstName:cliente.cliente_data.firstName,
        lastName: cliente.cliente_data.lastName,
        numero:cliente.cliente.cliente_numero
      }
    }
  },
  mounted(){
  	var thisClass = this;
  
    this.PHPController = "./php/controller/controller.admin.usuario.nuevo.php";
    this.objIntranet = new objectIntranet();
    this.objSolicitud;
    
    this.usuario = [{usuario:this.objIntranet.getCookie('usuario'), cookie:this.objIntranet.getCookie('cookieSession')}];
    this.usuario = JSON.stringify(this.usuario);
    this.email = this.objIntranet.getCookie('email');
    this.user_email = this.email;
    // console.log(this.objIntranet.getCookie('usuario'));
    if(!this.email){
      window.location.replace("../index.html");
    }
  	// this.socket = io.connect('http://localhost:8080', { 'forceNew': true });
  	this.socket = io.connect('http://localhost:4000/', { 'forceNew': true });

  	this.socket.on('messages', function(data) {
  	    console.log(data);
  	});
    this.socket.emit('operator-connected', this.objIntranet.getCookie('usuario'));
    this.socket.on('your-clients',function(data){
      console.log('mis clientes',data);
      window.app.mis_clientes = data;
      for (var i = window.app.mis_clientes.length - 1; i >= 0; i--) {
        console.log(window.app.current_cliente)
        if(window.app.current_cliente && window.app.current_cliente.numero && window.app.mis_clientes[i].cliente.cliente_numero == window.app.current_cliente.numero){
          window.app.show_client_message(window.app.mis_clientes[i]);
          document.getElementById( 'conversation' ).scrollHeight();
        }
      }
      
    })
    var date = '2015-04-03';
    var format = 'LLLL';
    var result = moment(date).format(format);
    console.log(result)
  	// this.$http.get('https://google.com',function(response){
  	// 	console.log("response",response)
  	// }).catch(error=>{
  	// 	console.log("error",error)
  	// })
  }
})