  
exports.messageBuilder = (flashArray) => {
    if (flashArray.length > 0) {
        return flashArray[0];
    } else {
        return null;
    }
}
    