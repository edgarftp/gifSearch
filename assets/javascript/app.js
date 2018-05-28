$("document").ready(function() {

    var searchArray = ["Deal with it", "Pepe", "Cats", "Shrug"];
    var newSearch = "";
    var randArray=[];
    var randNum;

    function display_btns() {
        $("#btnHolder").empty();
        for (i=0; i<searchArray.length; i++) {
            var newBtn = $("<button>").text(searchArray[i]);
            newBtn.attr("id", i);
            newBtn.attr("class", "btn btn-success m-1 btn-sm gifBtn");
            $("#btnHolder").append(newBtn);
        }
    }

    function rand_num(length,num) {
        randArray=[];
        if (length > num){
            do {
                randNum = Math.floor(Math.random() * length);
                if (randArray.indexOf(randNum)<0) {
                    randArray.push(randNum);
                }
            }
            while(randArray.length<num);
        }else {
            for (i=0; i<length; i++){
                randArray.push(i);
            }
        }
    }

    $("#searchBtn").on("click", function(){
        var newSearch = $("#searchInput").val().trim();
        if (newSearch != ""){
            searchArray.push(newSearch);
            display_btns();
        }
    })
    $("#searchInput").on("keypress", function(e){
        var newSearch = $("#searchInput").val().trim();
        if (newSearch != "" && e.which == 13){
            searchArray.push(newSearch);
            display_btns();
        }
    })

    $("#btnHolder").on("click", ".gifBtn", function(){
        var id = this.id;
        var name = searchArray[id];
        var gif = searchArray[id];
        gif = gif.replace(/\s+/g, '');
        gif = gif.toLowerCase();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        gif + "&api_key=dc6zaTOxFJmzC&limit=20";
        $("#" + this.id).attr("disabled", true);
        $("#" + this.id).animate({opacity: 0.1}, "fast");
        

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            result = response.data;
            rand_num(result.length,4);
            var newRow = $("<div>");
            newRow.addClass("row newRow");
            newRow.attr("id", "newRow" + id);
            var divHeader = $("<div>");
            divHeader.addClass("col-11 d-inline divHeader");
            divHeader.text(name);
            var closeBtn = $("<button>");
            closeBtn.text("x");
            closeBtn.addClass("btn btn-danger btn-sm col-1 d-inline closeBtn");
            closeBtn.attr("data-close", id);
            newRow.append(divHeader);
            newRow.append(closeBtn);

            var divGifHolder= $("<div>");
            divGifHolder.addClass("row col-12 gifRow");
            divGifHolder.attr("id", gif);
            for (i=0; i<randArray.length; i++) {
                var img = $("<img>");
                img.attr("src", result[randArray[i]].images.fixed_width_still.url);
                img.attr("data-still", result[randArray[i]].images.fixed_width_still.url);
                img.attr("data-animate", result[randArray[i]].images.fixed_width.url);
                img.attr("data-state", "still");
                img.attr("id", gif + "-" + i);
                img.addClass("col-3 d-inline gif");
                divGifHolder.append(img);
            }
            newRow.append(divGifHolder);
            $("#gifHolder").append(newRow);
        })

        $(document.body).on("click", ".gif", function(){
           console.log(this);
           var state = $(this).attr("data-state");

           if (state == "still") {
               console.log("hey WAS still");
               $(this).attr("src", $(this).attr("data-animate"));
               $(this).attr("data-state", "animate");
           }else{
                console.log("hey i WAS moving");
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
           }
        })

        $(document.body).on("click", ".closeBtn", function(){
            var id = $(this).attr("data-close");
            $("#" + id).attr("disabled", false);
            $("#" + id).animate({opacity: 1}, "fast");
            $("#newRow" + id).remove();
        }) 
          
        
    })

    display_btns();

});
