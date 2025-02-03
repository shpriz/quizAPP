function saveStaticDataToFile() {

    var blob = new Blob(["My first txt file."], { type: "text/plain;charset=utf-8" });
    AbortController

    saveAs(blob, "static.txt");
}