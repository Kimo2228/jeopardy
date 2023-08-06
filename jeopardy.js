

$(document).ready(function () {
    let categories = [];
    let currentCategoryIndex = 0;
    let currentQuestionIndex = 0;

    function loadCategories() {
        $.ajax({
            url: 'http://jservice.io/api/categories',
            data: { count: 6 }, // Load 6 categories
            success: function (data) {
                categories = data;
                loadQuestion();
            }
        });
    }

    function loadQuestion() {
        if (currentCategoryIndex >= categories.length) {
            $('.card-category').text('');
            $('.card-question').text('Game Over. Please reload.');
            $('.card-answer').text('');
            return;
        }

        const categoryId = categories[currentCategoryIndex].id;
        $.ajax({
            url: `http://jservice.io/api/clues?category=${categoryId}`,
            success: function (data) {
                const question = data[currentQuestionIndex];
                $('.card-category').text(categories[currentCategoryIndex].title);
                $('.card-question').text(question.question);
                $('.card-answer').text('');
            }
        });
    }

    function showAnswer() {
        const categoryId = categories[currentCategoryIndex].id;
        $.ajax({
            url: `http://jservice.io/api/clues?category=${categoryId}`,
            success: function (data) {
                const answer = data[currentQuestionIndex].answer;
                $('.card-answer').text(`Answer: ${answer}`).css('color', 'red');
            }
        });
    }

    function restart() {
        currentCategoryIndex = 0;
        currentQuestionIndex = 0;
        $('.card-category').text('');
        $('.card-question').text('');
        $('.card-answer').text('');
    }

    $('#start-button').on('click', function () {
        restart();
        loadCategories();
    });

    $('.jeopardy-card').on('click', function () {
        if(categories.length ==0) return;
        if ($('.card-answer').text() === '') {
            showAnswer();
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex >= 5) { // Load 2 questions, so 5 total (0-4)
                currentCategoryIndex++;
                currentQuestionIndex = 0;
            }
            loadQuestion();
        }
    });

    $('#restart-button').on('click', function () {
        restart();
        loadCategories();
    });
});
