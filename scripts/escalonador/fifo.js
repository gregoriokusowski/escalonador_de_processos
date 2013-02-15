(function(){
  /*
    Algoritmos: FIFO
  */

  var FIFO = function(){
    this._processos = new Array();
    this._processosEmEspera = new Array();
  };

  FIFO.prototype = new Algoritmo();

  FIFO.prototype.nome = function() {
    return "FIFO";
  };

  FIFO.prototype.processa = function() {
    if (this._emExecucao){
      this._emExecucao.ticks(this._emExecucao.ticks()+1);
      if (this._emExecucao.ticks() >= this._emExecucao.tempoDeVida()){
        this._emExecucao.encerra();
        this.buscaProximo();
      }
    }else{
      this.buscaProximo();
    }
  };

  FIFO.prototype.buscaProximo = function() {
    this._emExecucao = this._processos.shift();
    if(this._emExecucao){
      this._emExecucao.estado(Estado.EXECUCAO);
    }
  };

  window.FIFO = FIFO;

})();
