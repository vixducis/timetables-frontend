console.log(Array.from(document.getElementsByClassName("block__content")).map(block => {
    const date = "2022-08-20";
    const stage = 14;
    const artist = block.querySelector(".block__title").innerHTML.trim();
    const times = block.querySelector(".block__time").querySelector(".time").innerHTML.split(" - ");
    return stage+","+artist+","+date+" "+times[0]+","+date+" "+times[1];
}).join("\n"));
