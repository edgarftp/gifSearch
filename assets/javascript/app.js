$("document").ready(function () {

    var searchArray = ["Deal with it", "Pepe", "Cats", "Shrug"];
    var newSearch = "";
    var randArray = [];
    var randNum;
    var disabledArray = [];
    var clipboard = new ClipboardJS('.copyBtn');
    clipboard.on('success', function (e) {
        console.log(e);
    });

    function display_btns() {
        $("#btnHolder").empty();
        for (i = 0; i < searchArray.length; i++) {
            var newBtn = $("<button>").text(searchArray[i]);
            newBtn.attr("id", i);
            newBtn.attr("class", "btn btn-success m-1 btn-sm gifBtn");
            $("#btnHolder").append(newBtn);
        }

        for (j = 0; j < disabledArray.length; j++) {
            $("#" + disabledArray[j]).attr("disabled", true);
            $("#" + disabledArray[j]).css("opacity", "0.1");
        }
    }

    function rand_num(length, num) {
        randArray = [];
        if (length > num) {
            do {
                randNum = Math.floor(Math.random() * length);
                if (randArray.indexOf(randNum) < 0) {
                    randArray.push(randNum);
                }
            }
            while (randArray.length < num);
        } else {
            for (i = 0; i < length; i++) {
                randArray.push(i);
            }
        }
    }

    $("#searchBtn").on("click", function () {
        var newSearch = $("#searchInput").val().trim();
        if (newSearch != "") {
            searchArray.push(newSearch);
            display_btns();
            $("#searchInput").val("");
        }
    });
    $("#searchInput").on("keypress", function (e) {
        var newSearch = $("#searchInput").val().trim();
        if (newSearch != "" && e.which == 13) {
            searchArray.push(newSearch);
            display_btns();
            $("#searchInput").val("");
        }
    });

    function display_gif(id) {
        disabledArray.push(id);
        var name = searchArray[id];
        var gif = searchArray[id];
        gif = gif.replace(/\s+/g, '');
        gif = gif.toLowerCase();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            gif + "&api_key=dc6zaTOxFJmzC&limit=20";
        $("#" + id).attr("disabled", true);
        $("#" + id).animate({ opacity: 0.1 }, "fast");

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            result = response.data;
            rand_num(result.length, 4);
            var newRow = $("<div>");
            newRow.addClass("row newRow");
            newRow.attr("id", "newRow" + id);
            var divHeaderRow = $("<div>");
            divHeaderRow.addClass("row col-md-12");
            var newSearchBtn = $("<button>");
            newSearchBtn.text("Search Again");
            newSearchBtn.addClass("btn btn-primary btn-sm col-md-1 d-inline newSearchBtn");
            newSearchBtn.attr("data-research", id);
            var divHeader = $("<div>");
            divHeader.addClass("col-md-10 d-inline divHeader");
            divHeader.text(name);
            var closeBtn = $("<button>");
            closeBtn.text("close");
            closeBtn.addClass("btn btn-danger btn-sm col-md-1 d-inline closeBtn");
            closeBtn.attr("data-close", id);
            divHeaderRow.append(newSearchBtn);
            divHeaderRow.append(divHeader);
            divHeaderRow.append(closeBtn);
            newRow.append(divHeaderRow);

            var divGifHolder = $("<div>");
            divGifHolder.addClass("row col-md-12 gifRow");
            divGifHolder.attr("id", gif);
            for (i = 0; i < randArray.length; i++) {
                var imgBtnHolder = $("<div>");
                imgBtnHolder.addClass("col-md-3 d-inline imgBtnHolder");
                var imgHolder = $("<div>");
                imgHolder.addClass("col-12");
                var img = $("<img>");
                img.attr("src", result[randArray[i]].images.downsized_still.url);
                img.attr("data-still", result[randArray[i]].images.downsized_still.url);
                img.attr("data-animate", result[randArray[i]].images.downsized.url);
                img.attr("data-state", "still");
                img.attr("id", gif + "-" + i);
                img.addClass("col-md-12 gif");
                imgHolder.append(img);
                var copyBtn = $("<button>").text("Copy to Clipboard");
                copyBtn.attr("data-clipboard-text", result[randArray[i]].bitly_gif_url);
                copyBtn.addClass("btn btn-info btn-sm copyBtn col-md-10 d-inline");
                var btnHolder = $("<div>");
                btnHolder.addClass("col-md-12");
                btnHolder.append(copyBtn);
                imgBtnHolder.append(imgHolder);
                imgBtnHolder.append(btnHolder);
                divGifHolder.append(imgBtnHolder);

            }
            newRow.append(divGifHolder);
            $("#gifHolder").prepend(newRow);
        })
    }


    $("#btnHolder").on("click", ".gifBtn", function () {
        var id = this.id;
        display_gif(id);
    });


    $("#gifHolder").on("click", "img", function () {
        var state = $(this).attr("data-state");

        if (state == "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

    $("#gifHolder").on("click", ".closeBtn", function () {
        console.log("closing?");
        var id = $(this).attr("data-close");
        var index = disabledArray.indexOf(id);
        disabledArray.splice(index, 1);
        $("#" + id).attr("disabled", false);
        $("#" + id).animate({ opacity: 1 }, "fast");
        $("#newRow" + id).remove();
    }); 

    $("#gifHolder").on("click", ".newSearchBtn", function () {
        var id = $(this).attr("data-research");
        var gif = searchArray[id];
        gif = gif.replace(/\s+/g, '');
        gif = gif.toLowerCase();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            gif + "&api_key=dc6zaTOxFJmzC&limit=20";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            result = response.data;
            rand_num(result.length, 4);
            for (i=0; i<4; i++){
                console.log(i);
                $("#" + gif + "-" + i).attr("src", result[randArray[i]].images.downsized_still.url);
                $("#" + gif + "-" + i).attr("data-still", result[randArray[i]].images.downsized_still.url);
                $("#" + gif + "-" + i).attr("data-animate", result[randArray[i]].images.downsized.url);
                $("#" + gif + "-" + i).attr("data-state", "still");
            }
        });

    }); 

    display_btns();

});
