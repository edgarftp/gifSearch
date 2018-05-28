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
        var dragZone = $("<div>");
        var imgTrash = $("<img>");
            imgTrash.attr("src", "assets/images/trash.png");
            imgTrash.attr("id", "trashcanImg")
            dragZone.attr("id", "trashcan");
            dragZone.attr("class", "btn btn-danger m-1 col-1 btn-sm  dropzone");
            dragZone.append(imgTrash);
            $("#btnHolder").append(dragZone);
        for (i = 0; i < searchArray.length; i++) {
            var newBtn = $("<button>").text(searchArray[i]);
            newBtn.attr("id", i);
            newBtn.attr("class", "btn btn-success m-1 btn-sm gifBtn draggable");
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
        console.log(id);
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
      $("#btnHolder").on("click",".gifBtn", function() {
          var id = this.id;
          display_gif(id);
          display_btns();
      })
      //------------------------------------------------------------------
      interact('.draggable')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
    
        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          var textEl = event.target.querySelector('p');
    
          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                         Math.pow(event.pageY - event.y0, 2) | 0))
                .toFixed(2) + 'px');
        }
      });
    
      function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';
    
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    
      // this is used later in the resizing and gesture demos
      window.dragMoveListener = dragMoveListener;
        /* The dragging code for '.draggable' from the demo above
        * applies to this demo as well so it doesn't have to be repeated. */

        // enable draggables to be dropped into this
        interact('.dropzone').dropzone({
            // only accept elements matching this CSS selector
            accept: '.draggable',
            // Require a 75% element overlap for a drop to be possible
            overlap: 0.2,
        
            // listen for drop related events:
        
            ondropactivate: function (event) {
            // add active dropzone feedback
            
            event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
            // feedback the possibility of a drop
            console.log("in");
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            draggableElement.classList.remove('btn-success');
            draggableElement.classList.add('btn-danger');
            },
            ondragleave: function (event) {
            // remove the drop feedback style
            console.log("out");
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            event.relatedTarget.classList.remove('btn-danger');
            event.relatedTarget.classList.add('btn-success');
            },
            ondrop: function (event) {
            var id = event.dragEvent.currentTarget.id;
            var index = disabledArray.indexOf(id);
            console.log(id);
            $("#" + id).remove();
            if(index >=0){
                disabledArray.splice(index, 1);
            }
            searchArray.splice(id,1);
            },
            ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
            
            }
        });
      //--------------------------------------------------------------



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

    $("#btnHolder").on("dragstart", ".gifBtn", function(){
        console.log("hey");
    });


    display_btns();
    

});
