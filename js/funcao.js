let url = `https://api.openweathermap.org/data/2.5/weather?q=`;
let api = `62061ccf07ad6a9853275cd2c0463a92`;
let diaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
];

Date.prototype.addDays = function (d) {
    return new Date(this.getTime() + d * 86400000); // milliseconds
};

let diasNumeros = [1, 2, 3, 4, 5];

let gravarData = [];

diasNumeros.forEach((item) => {
    gravarData.push(new Date().addDays(item));
});

let gravarDias = [];

gravarData.forEach((item) => {
    gravarDias.push(diaSemana[item.getDay()]);
});

$(".dia").each(function (e) {
    $(this).text(gravarDias[e]);
});

let gravarFormato = [];

gravarData.forEach((item) => {
    gravarFormato.push(item.toISOString().slice(0, 10));
});

function chamarCapitais(valorCapital) {
    let dados = [];

    valorCapital.forEach((element) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element}&appid=${api}&units=metric&lang=pt_br`;

        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                dados.push(data);
                if (dados.length >= 10) {
                    interfaceCapital(dados);
                }
            },
        });
    });
}

function interfaceCapital(val) {
    let str_capital1 = "";
    let str_capital2 = "";
    if ($(window).width() <= 576) {
        val.forEach((item) => {
            str_capital1 += `
            <div class="col-2  mb-3 info">${parseInt(item.main.temp_min)}°</div>
            <div class="col-2 info">${parseInt(item.main.temp_max)}°</div>
            <div class="col-8 info">${item.name}</div>
        `;
        });
        $(".capital1").html("");
        $(".capital1").html(str_capital1);
    } else {
        const capitalArray1 = val.slice(0, 5);
        const capitalArray2 = val.slice(5, 10);

        capitalArray1.forEach((item) => {
            str_capital1 += `
                <div class="col-2  mb-3 info">${parseInt(
                  item.main.temp_min
                )}°</div>
                <div class="col-2 info">${parseInt(item.main.temp_max)}°</div>
                <div class="col-8 info">${item.name}</div>
            `;
        });
        $(".capital1").html("");
        $(".capital1").html(str_capital1);

        capitalArray2.forEach((item) => {
            str_capital2 += `
                <div class="col-2  mb-3 info">${parseInt(
                  item.main.temp_min
                )}°</div>
                <div class="col-2 info">${parseInt(item.main.temp_max)}°</div>
                <div class="col-8 info">${item.name}</div>
            `;
        });

        $(".capital2").html("");
        $(".capital2").html(str_capital2);
    }
    $(".container-spiner").fadeOut();
}

function pegarClima(param) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${api}&units=metric&lang=pt_br`;

    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            if (data.cod === 200) {
                $(".card-header h3").text(`${data["name"]}, ${data["sys"]["country"]}`);
                $(".card-title").text(
                    `${parseInt(data["main"]["temp"])}° ${
            data["weather"][0]["description"]
          }`
                );
                $(".tempMin").text(`${parseInt(data["main"]["temp_min"])}°`);
                $(".tempMax").text(`${parseInt(data["main"]["temp_max"])}°`);
                $(".sensacao").text(`${parseInt(data["main"]["feels_like"])}°`);
                $(".umidade").text(`${parseInt(data["main"]["humidity"])}%`);
                $(".vento").text(`${parseInt(data["wind"]["speed"])}Km/h`);

                dadosCLima(data);
            }
        },
        error: function (error) {
            $(".container-spiner").fadeOut();

            $(".input-group ").after(
                `<div class="alert alert-danger" role="alert">Nenhum clima encontrado!</div>`
            );
            $(".card").slideUp();
            setTimeout(function () {
                $(".alert").remove();
            }, 1500);
        },
    });
}

function infoProximoDias(param) {
    $(".proxMin").each(function (e) {
        $(this).text(`${Math.floor(param[e].main.temp_min)-3 }°`);
    });
    $(".proxMax").each(function (e) {
        $(this).text(`${Math.round(param[e].main.temp_max)+3}°`);
    });
    $(".container-spiner").fadeOut();
}

function dadosCLima(param) {
    let oneCall = `https://api.openweathermap.org/data/2.5/forecast?q=${param["name"]},${param["sys"]["country"]}&appid=${api}&units=metric&lang=pt_br`;

    let arrayDados = [];
    $.ajax({
        url: oneCall,
        dataType: "json",
        success: function (data) {
            gravarFormato.forEach((item) => {
                arrayDados.push(
                    data.list.find((element) => element.dt_txt.includes(`${item}`))
                );

                if (arrayDados.length >= 5) {
                    infoProximoDias(arrayDados);
                    $(".card").slideDown();
                }
            });
        },
    });
}

function climaDados(param) {
    let url = `https://api.hgbrasil.com/weather?key=9aadf9cd&city_name=${param}`

    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            if (data.results.temp) {
                $(".card-title").text(
                    `${parseInt(data.results.temp)}° ${data.results.description}`
                );
                $(".tempMin").text(`${parseInt(data.forecast[0].min)}°`);
                $(".tempMax").text(`${parseInt(data.forecast[0].max)}°`);
                $(".sensacao").text(`${parseInt(data.results.feels_like)}°`);
                $(".umidade").text(`${parseInt(data.results.humidity)}%`);
                $(".vento").text(`${parseInt(data.results.wind_speedy)}`);
                $(".card").slideDown();
            }
        }

    });
}