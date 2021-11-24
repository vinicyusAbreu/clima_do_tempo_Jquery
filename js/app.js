$(document).ready(function () {
    // Initialize the app
    
    let capitais = ['Brasília', 'São Paulo', 'Rio de Janeiro', 'Florianópolis', 'Belo Horizonte', 'Fortaleza', 'Curitiba', 'Manaus', 'Recife', 'Porto Alegre'];

    chamarCapitais(capitais);

    $('form').on('submit', function (e) {
        e.preventDefault();
        let input = $('input').val();

        if (input.trim() != '') {
            pegarClima(input);
            $('.container-spiner').fadeIn();
        }

    });

    $('.bi-x').on('click', ()=>{
        $('.card').slideUp();
    });
});

