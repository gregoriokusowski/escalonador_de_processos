(function(){
  var Estado = {
    PRONTO:1,
    EXECUCAO:2,
    SUSPENSO:3,
    FINALIZADO:4
  };

  window.Estado = Estado;

  var Processo = function(parametros){
    if (parametros == undefined) {
      parametros = {};
    }
    this._pid = Processo.pid();
    this._estado = Estado.PRONTO;
    this._ticks = 0;
    this._tempoDeVida = parametros.tempoDeVida || 12; /* em ticks */
    this._io = !!parametros.io;
    this._temposDeIO = parametros.temposDeIO;
    this._tempoEmIO = 0;
  };

  Processo.pid = function(){
    Processo._pid = Processo._pid || 1;
    return Processo._pid++;
  };

  Processo.prototype.pid = function() {
    return this._pid;
  };

  Processo.prototype.tempoDeVida = function() {
    return this._tempoDeVida;
  };

  Processo.prototype.ticks = function(ticks) {
    if(ticks != undefined){
      this._ticks = ticks;
    }
    return this._ticks;
  };

  Processo.prototype.estado = function(estado) {
    if(estado != undefined){
      this._estado = estado;
    }
    return this._estado;
  };

  Processo.prototype.execucao = function() {
    return this.estado() === Estado.EXECUCAO;
  };

  Processo.prototype.encerra = function() {
    this.estado(Estado.FINALIZADO);
  };

  Processo.prototype.iniciaIO = function() {
    this.estado(Estado.SUSPENSO);
  };

  Processo.prototype.encerraIO = function() {
    this.estado(Estado.PRONTO);
  };

  Processo.prototype.classeHtml = function() {
    switch(this.estado()) {
    case Estado.EXECUCAO:
      return "success";
    case Estado.PRONTO:
      return "warning";
    case Estado.SUSPENSO:
      return "error";
    }
  };

  Processo.prototype.deveIniciarIO = function() {
    // Tempos de IO (inicio,tempo,intervalo;...)
    if (!this._io){
      return false;
    }
    /* console.log("inicio " + this._temposDeIO[0] + " tempo " + this._temposDeIO[1] + " intervalo " + this._temposDeIO[2] + " ticks " + this.ticks()); */
    /* Se for o inicio */
    var inicio = this._temposDeIO[0];
    if (inicio === this.ticks()){
      return true;
    }
    /* Se for algum momento onde e iniciado IO */
    var tempo = this._temposDeIO[2];
    var restante = this.ticks() % tempo;
    if (restante === inicio || restante === 0){
      return true;
    }
    return false;
  };

  Processo.prototype.deveEncerrarIO = function() {
    var tempo = this._temposDeIO[1];
    return this._tempoEmIO % tempo === 0;
  };

  Processo.prototype.io = function() {
    this._tempoEmIO++;
  };

  Processo.prototype.eIO = function() {
    return !!this._io;
  };

  Processo.prototype.tempoEmIO = function() {
    return this._tempoEmIO;
  };

  window.Processo = Processo;

})();
