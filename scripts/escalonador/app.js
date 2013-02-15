(function(){
  var App = function(){
    this._escalonadores = [];

    $("#cria-escalonador").click(function(){

      var codigoAlgoritmo = $("input.algoritmo-escalonador:checked").val();
      var algoritmo = {"FIFO":new FIFO(), "Round Robin":new RoundRobin()}[codigoAlgoritmo];

      var escalonador = new Escalonador(algoritmo);
      window.app.adiciona(escalonador);
      $('#painel-escalonador').modal('hide');
    });
  };

  App.prototype.adiciona = function(escalonador) {
    this._escalonadores.push(escalonador);
  };

  window.App = App;

  window.app = new App();
})();
