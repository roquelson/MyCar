(function (DOM) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via get.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
  var app = (function () {
    return {

      init: function init() {
        this.companyInfo();
        this.initEvents();
        this.initTable();
      },

      initTable: function iniTable() {
        this.getRequest("http://localhost:3000/car", this.fillTable);
      },

      initEvents: function initEvents() {
        var $register = new DOM('[data-js="register"]');
        $register.on('click', app.regiterCars);
      },

      companyInfo: function companyInfo() {
        this.getRequest("company.json", this.getCompanyInfo);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (app.isReady.call(this)) {
          var $companyName = new DOM('[data-js="CompanyName"]');
          var $telephone = new DOM('[data-js="telefone"]');
          var resposta = JSON.parse(this.responseText);
          $companyName.get().innerHTML = resposta.name;
          $telephone.get().innerHTML = '<strong>' + resposta.phone + '</strong>';
        }
      },

      getRequest: function getRequest(url, callback) {
        var get = new XMLHttpRequest();
        get.open('GET', url, true);
        get.send();
        get.addEventListener("readystatechange", callback, false);
      },

      postRequest: function postRequest(message) {
        var post = new XMLHttpRequest();
        post.open('POST', 'http://localhost:3000/car');
        post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        post.send(message);
        if (post.readyState === 4) {
          console.log('Carro Cadastrado')
        }
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      regiterCars: function registerCars(event) {

        var $model = new DOM('[data-js="model"]');
        var $year = new DOM('[data-js="year"]');
        var $plate = new DOM('[data-js="plate"]');
        var $color = new DOM('[data-js="color"]');
        var $image = new DOM('[data-js="image"]');

        app.postRequest(`image=${$image.get().value}&brandModel=${$model.get().value}
        &year=${ $year.get().value}&plate=${$plate.get().value}&color=${$color.get().value})`)
        event.preventDefault();
        app.callTable($model.get().value, $year.get().value,
          $plate.get().value, $color.get().value);

        $image.get().value = '';
        $model.get().value = '';
        $year.get().value = '';
        $plate.get().value = '';
        $color.get().value = '';


      },

      getImagePath: function getImagePath(path) {
        var $image = new DOM('[data-js="image"]');

        if (path)
          return $image.get().value = path;
        return $image.get().value;
      },

      callTable: function callTable() {
        var $table = new DOM('[data-js="table"]');
        var $ImagePath = document.createElement("img");
        var $tr = document.createElement('tr');
        var $td = document.createElement('td');
        var $buttonCancel = document.createElement('button');

        this.setImageProperties($ImagePath, this.getImagePath());
        $td.appendChild($ImagePath);
        $tr.appendChild($td);
        $table.get().appendChild($tr);

        Array.prototype.forEach.call(arguments, function (item) {
          $td = document.createElement('td');
          $td.innerHTML = item;
          $tr.appendChild($td);
          $table.get().appendChild($tr);
        });

        app.setButtonDelete($buttonCancel);

        $buttonCancel.addEventListener('click', function () {
          $table.get().deleteRow($tr.rowIndex);
        })

        $tr.appendChild($buttonCancel);
        $table.get().appendChild($tr);
      },

      fillTable: function fillTable() {
        if (app.isReady.call(this)) {
          var resposta = JSON.parse(this.responseText);

          Array.prototype.forEach.call(resposta, function (item) {
            app.getImagePath(item.image);
            app.callTable(item.brandModel, item.year, item.plate, item.color);
          })
        }
      },

      setButtonDelete: function setButtonDelete(buttonElement) {
        buttonElement.innerHTML = "Deletar"
        buttonElement.style.marginTop = "50px";
        buttonElement.style.padding = "12px 28px"
        buttonElement.style.color = "white"
        buttonElement.style.backgroundColor = "black"
        buttonElement.style.borderRadius = "8px"

      },

      setImageProperties: function setImageProperties(imgElement, url) {
        imgElement.setAttribute("height", "auto");
        imgElement.setAttribute("width", "200");
        imgElement.setAttribute("src", url);
      },

    }
  })();
  app.init();

})(window.DOM);
