function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function createBlock(ele) {
    var block = document.createElement("div");
    block.className = "infoBlock";
    block.style.backgroundImage = "url(" + ele.urlToImage + ")";

    var textBlock = document.createElement("div");
    textBlock.classList.add("innerBlock", "textBlock");

    if (ele.author !== null) {
        var authorBlock = document.createElement("div");
        authorBlock.classList.add("innerBlock", "authorBlock");
        authorBlock.innerHTML = ele.author;

        block.appendChild(authorBlock);
    }

    var dateBlock = document.createElement("span");
    dateBlock.className = "dateBlock";
    var publishedDate = ele.publishedAt;
    publishedDate = publishedDate.replace("T", " ").replace("Z", "");
    dateBlock.innerHTML = publishedDate;
    textBlock.appendChild(dateBlock);

    var linkElement = document.createElement("a");
    var text = document.createTextNode(ele.title);
    linkElement.className = "textLink";
    linkElement.appendChild(text);
    linkElement.href = ele.url;
    linkElement.target = "_blank";
    textBlock.appendChild(linkElement);

    var descBlock = document.createElement("div");
    descBlock.className = "descBlock";
    descBlock.innerHTML = ele.description;
    textBlock.appendChild(descBlock);
    
    block.appendChild(textBlock);
    
    return block;
}

readTextFile("news.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
    data.articles.forEach(function(element) {
        var div = createBlock(element);
        document.querySelector(".main").appendChild(div);
    });
});

document.querySelector("#addNews").addEventListener("click", function () {
    var inputs = document.querySelectorAll(".content .contentLineInput");
    var dataArray = [];
    var currentDate = new Date();
    var date = {
        fullYear: currentDate.getFullYear(),
        month: currentDate.getMonth()+1,
        date: currentDate.getDate(),
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
        seconds: currentDate.getSeconds()
    }
    for (var key in date) {
        if (key !== "fullYear") {
            if (date[key] < 10) {
                date[key] = '0' + date[key];
            }
        }
    }
    dataArray["publishedAt"] = date.fullYear + "-" + date.month + "-" + date.date + " "
                            + date.hours + ":" + date.minutes + ":" + date.seconds;

    inputs.forEach(function(input) {
        if (input.value !== "") {
            dataArray[input.name] = input.value;
        } else {
            dataArray[input.name] = null;
        }
    });

    if (dataArray["title"] == null || dataArray["description"] == null || dataArray["url"] == null) {
        console.warn("TITLE/DESCRIPTION/URL can't be empty");
        return;
    } else {
        var newDiv = createBlock(dataArray);
        var afterInsertDiv = document.querySelector(".newBlock");
        afterInsertDiv.insertAdjacentElement('afterend', newDiv);

        inputs.forEach(function(input) {
            if (input.name !== "publishedAt") {
                document.querySelector("input[name=" + input.name + "]").value = "";
            }

        });
        document.querySelector(".close").click();
    }
});