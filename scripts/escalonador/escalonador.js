(function(){
  var Escalonador = function(algoritmo){
    this._algoritmo = algoritmo;
    this._quantum = 100;
    this._tempoRodando = 0;
    this._rodando = false;
    this._id = Escalonador.id();

    var template = $("#escalonador-template").html();
    this._domElement = $(_.template(template, {escalonador : this}));
    var domElement = this._domElement;

    var escalonador = this;

    domElement.find(".inicia").click(function(){
      escalonador.inicia();
    });

    domElement.find(".para").click(function(){
      escalonador.para();
      escalonador.atualizaInterface();
    });

    domElement.find(".quantum").val(escalonador.quantum()).change(function(){
      var valor = new Number($(this).val());
      if (valor > 0) {
        escalonador.quantum(valor);
      }
      $(this).val(escalonador.quantum());
    });

    domElement.find(".adiciona-processo").click(function(){
      $('#painel-processos').modal();
      $('#painel-processos').find(".adiciona-processos")
        .unbind("click.escalonador")
        .bind("click.escalonador", function(){
          var numeros = $("#numero-processos").val().split(",");
          var percentualIO = new Number($("#percentual-io").val());
          var tempos = $("#tempos-io").val().split(";");
          var temposDeVida = $("#tempo-de-vida").val().split(",");

          var criador = new CriadorDeProcessos(numeros, percentualIO, tempos, temposDeVida)
          if ($(this).data("now")) {
            criador.cria(escalonador);
          } else {
            criador.executa(escalonador);
          }
          $('#painel-processos').modal('hide');
          escalonador.atualizaInterface();
        });
    });

    $("#escalonadores").prepend(domElement);

  };

  Escalonador._id = 1;
  Escalonador.id = function(){
    return Escalonador._id++;
  };

  Escalonador.prototype.id = function() {
    return this._id;
  };

  Escalonador.prototype.algoritmo = function() {
    return this._algoritmo;
  };

  Escalonador.prototype.descricao = function(descricao) {
    if(descricao != undefined){
      this._descricao = descricao;
    }
    return this._descricao;
  };

  Escalonador.prototype.quantum = function(quantum) {
    if(quantum != undefined){
      this._quantum = quantum;
    }
    return this._quantum;
  };

  Escalonador.prototype.inicia = function() {
    if (!this._rodando){
      this._rodando = true;
      this._domElement.find(".progress").addClass("active");
      this.preparaProximoTick();
    }
  };

  Escalonador.prototype.para = function() {
    this._rodando = false;
    this._domElement.find(".progress").removeClass("active");
  };

  Escalonador.prototype.tick = function() {
    if (this._rodando){
      this._tempoRodando += this.quantum();
      this._algoritmo.processa();
      this.preparaProximoTick();
      this.atualizaInterface();
    }
  };

  Escalonador.prototype.atualizaInterface = function() {
    if(this._domElement != undefined){
      var tbody = this._domElement.find("tbody.processos");
      tbody.empty();
      var template = $("#processo-template").html();
      _.each(this._algoritmo.processos(), function(processo){
        tbody.append(_.template(template, {processo : processo}));
      });

      var tbodyEmEspera = this._domElement.find("tbody.processos-em-espera");
      tbodyEmEspera.empty();
      _.each(this._algoritmo.processosEmEspera(), function(processo){
        tbodyEmEspera.append(_.template(template, {processo : processo}));
      });
    }
  };

  Escalonador.prototype.preparaProximoTick = function() {
    var escalonador = this;
    setTimeout(function(){ escalonador.tick() }, escalonador.quantum());
  };

  window.Escalonador = Escalonador;

})();
