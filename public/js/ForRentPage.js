function displayNumber() {
    let select = document.getElementById("numberSelect");
    let displayBox = document.getElementById("displayBox");
    let totalSaves = document.getElementById("total-saves");
   
    let currentValue = parseInt((actualValue - (actualValue * 5 / 100))) * select.value;
    let lowestPrice = Math.floor(currentValue - (currentValue * select.value / 100));

  let LastHeighestValue = actualValue * select.value;
    displayBox.innerHTML = select.value + " nights ' " + "<b>&#8377; " + lowestPrice.toLocaleString("en-IN") + "/-</b>";
    totalSaves.innerHTML = " save &#8377; " + Math.abs((LastHeighestValue - lowestPrice)).toLocaleString("en-In") + ".";
}

window.onload = function() {
    displayNumber();
}
