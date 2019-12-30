module.exports = function custom_loader (content) {
    console.log("Custom Loader is working");
    // return content;
    return content.replace("console.log(", "alert(");   // "console.log(" -> "alert("
}