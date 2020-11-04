// const electron = require("electron");
const jquery = require("jquery");
// const { ipcRenderer } = electron;

ipcRenderer.on("chat:NewChatData", (err, data) => {
    console.log(jquery("body"));
    jquery(".chatItem").remove();

    for (let index = 0; index < data.chatArray.length; index++) {
        const element = data.chatArray[index];
        jquery("#chatTable").append("<tr class='chatItem'>    <td>" + index + "</td>    <td>" + element.username + "</td>    <td>" + element.message + "</td><td><button  onclick='ShowConfrim()'>Sil</button></td></tr>");
    }

});

function ShowConfrim() {
    confirm("Silmek istediğine emin misin?");
}