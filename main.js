const electron = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let chatWindow;
let chatData = {
    chatArray: []
};
app.on('ready', () => {

    mainWindow = new BrowserWindow({
        darkTheme: true,
        title: "Elektron Demo",
        webPreferences: {
            nodeIntegration: true
        },
    });

    console.log(process.platform);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname + "/main.html"), //dirnam uygulama konum
            protocol: "file:", // fiziksel dosya olduğu için
            slashes: true //linux ve windows taksim karakterine göre
        })
    );

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("key:newChat", (err, data) => {
        createChatWindow(data);
    });

    ipcMain.on("key:newMessage", (err, data) => {
        if (data && chatWindow) {
            chatWindow.close();
            chatWindow = null;

            chatData.chatArray.push(data);

            mainWindow.webContents.send("chat:NewChatData", chatData);
        }
    });

    mainWindow.on('close', () => {
        app.quit();
    });
});

const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            { label: "Ekle" },
            { label: "Sil" },
            { label: "Güncelle" },
        ]
    },
    {
        label: "Çıkış",
        accelerator: process.platform == "darwin" ? "Command+Q" : "CTRL+Q",
        role: "quit"
    }
];

if (process.platform == "darwin") {
    mainMenuTemplate.unshift({
        label: app.getName(),
        role: "Demo"
    })
}

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Developer",
            submenu: [
                {
                    label: "Open Tool",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label: "Yenile",
                    role: "reload"
                }
            ]
        }
    )
}

function createChatWindow(username) {
    chatWindow = new BrowserWindow({
        darkTheme: true,
        title: username + " yeni sohbet",
        webPreferences: {
            nodeIntegration: true
        },
        width: 482,
        height: 200,
    });

    chatWindow.loadURL(
        url.format({
            pathname: path.join(__dirname + "/chat.html"), //dirnam uygulama konum
            protocol: "file:", // fiziksel dosya olduğu için
            slashes: true //linux ve windows taksim karakterine göre
        })

    );
}

function GetChatData() {
    return chatData;
}