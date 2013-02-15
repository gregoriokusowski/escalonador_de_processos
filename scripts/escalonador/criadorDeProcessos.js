(function(){

  var CriadorDeProcessos = function(qtProcessos, percentualIO, temposIO, temposDeVida){
    this._qtProcessos = qtProcessos;
    this._percentualIO = percentualIO;
    this._temposIO = temposIO;
    this._temposParaIO = _.map(this._temposIO, function(tempo){
      return _.map(tempo.split(","), function(n){return new Number(n)});
    });
    this._temposDeVida = temposDeVida;
  };

  CriadorDeProcessos.prototype.tempoDeVida = function() {
    return _.random(new Number(this._temposDeVida[0]), new Number(this._temposDeVida[1]));
  };

  CriadorDeProcessos.prototype.executa = function(escalonador) {
    var numeroDeProcessos = _.random(new Number(this._qtProcessos[0]), new Number(this._qtProcessos[1]));

    var processosIO = this._percentualIO / 100 * numeroDeProcessos;
    var processosCPU = numeroDeProcessos - processosIO;

    var criador = this;
    var escalonador = escalonador;

    _.times(processosCPU, function(){
      setTimeout(function(){
        var processo = new Processo({tempoDeVida:criador.tempoDeVida()});
        escalonador.algoritmo().adiciona(processo);
      }, _.random(0,60000));
    });

    _.times(processosIO, function(){
      setTimeout(function(){
        var processo = new Processo({tempoDeVida:criador.tempoDeVida(), io:true, temposDeIO:criador.temposDeIO()});
        escalonador.algoritmo().adiciona(processo);
      }, _.random(0,60000));
    });

    setTimeout(function(){criador.executa(escalonador);}, 60000);
  };

  CriadorDeProcessos.prototype.cria = function(escalonador) {
    var numeroDeProcessos = _.random(new Number(this._qtProcessos[0]), new Number(this._qtProcessos[1]));

    var processosIO = this._percentualIO / 100 * numeroDeProcessos;
    var processosCPU = numeroDeProcessos - processosIO;

    var criador = this;
    var escalonador = escalonador;

    _.times(processosCPU, function(){
      var processo = new Processo({tempoDeVida:criador.tempoDeVida()});
      escalonador.algoritmo().adiciona(processo);
    });

    _.times(processosIO, function(){
      var processo = new Processo({tempoDeVida:criador.tempoDeVida(), io:true, temposDeIO:criador.temposDeIO()});
      escalonador.algoritmo().adiciona(processo);
    });

    escalonador.atualizaInterface();
  };

  CriadorDeProcessos.prototype.temposDeIO = function() {
    var tempos = this._temposParaIO.shift();
    this._temposParaIO.push(tempos);
    return tempos;
  };

  window.CriadorDeProcessos = CriadorDeProcessos;

})();
