(function(){
  /*
    Algoritmos: RoundRobin
  */

  var RoundRobin = function(){
    this._processos = new Array();
    this._processosEmEspera = new Array();
    this._tempoExecucao = new Number($("#tempo-execucao").val());
    this._tempoExecutandoProcessoAtual = 0;
    this._ioParalelo = !!$("#io-paralelo:checked").val();
  };

  RoundRobin.prototype = new Algoritmo();

  RoundRobin.prototype.nome = function() {
    return "Round Robin";
  };

  RoundRobin.prototype.processa = function() {
    this.processaListaEmEspera();
    this.processaListaPrincipal();
  };

  RoundRobin.prototype.processaListaPrincipal = function() {
    if (this._emExecucao){ /* Se ja estiver executando */
      this._emExecucao.ticks(this._emExecucao.ticks()+1);
      this._tempoExecutandoProcessoAtual++;

      if (this._emExecucao.ticks() >= this._emExecucao.tempoDeVida()){
        this._emExecucao.encerra();
        this._emExecucao = null;
        this._tempoExecutandoProcessoAtual = 0;
      }else if(this._emExecucao.deveIniciarIO()){
        this._emExecucao.iniciaIO();
        this._processosEmEspera.push(this._emExecucao);
        this.next();
      }else if(this._tempoExecutandoProcessoAtual >= this._tempoExecucao){
        this._processos.push(this._emExecucao);
        this.next();
      }
    }else{ /* Pega o prox. na fila */
      this.next();
    }
  };

  RoundRobin.prototype.processaListaEmEspera = function() {
    var algoritmo = this;
    if(this._ioParalelo){
      _.each(this._processosEmEspera, function(processo){
        processo.io();
        if(processo.deveEncerrarIO()){
          var index = algoritmo._processosEmEspera.indexOf(processo);
          algoritmo._processosEmEspera.splice(index,1);
          algoritmo._processos.push(processo);
          processo.encerraIO();
        }
      });
    }else{
      var processo = this._processosEmEspera.shift();
      if (processo){
        this._processosEmEspera.unshift(processo);
        processo.io();
        if(processo.deveEncerrarIO()){
          var index = algoritmo._processosEmEspera.indexOf(processo);
          algoritmo._processosEmEspera.splice(index,1);
          algoritmo._processos.push(processo);
          processo.encerraIO();
        }
      }
    }
  };

  RoundRobin.prototype.next = function() {
    this._emExecucao = this._processos.shift();
    this._tempoExecutandoProcessoAtual = 0;
  };

  window.RoundRobin = RoundRobin;

})();
