(function(){
  /*
    implementar: processa(); # void
  */

  var Algoritmo = function(){
    this._processos = new Array();
    this._processosEmEspera = new Array();
  };

  Algoritmo.prototype.adiciona = function(processo) {
    this._processos.push(processo);
  };

  Algoritmo.prototype.processos = function() {
    return _.compact(_.union([this._emExecucao], this._processos));
  };

  Algoritmo.prototype.processosEmEspera = function() {
    return this._processosEmEspera;
  };

  Algoritmo.prototype.emExecucao = function(emExecucao) {
    return this._emExecucao;
  };

  window.Algoritmo = Algoritmo;

})();
