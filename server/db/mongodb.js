const mongoose = require('mongoose');

const URI = `mongodb+srv://admin:root1234@cluster-iw.miy9lgu.mongodb.net/Swapster?retryWrites=true&w=majority&appName=Cluster-IW`;

mongoose.connect(URI, {});

const db = mongoose.connection;

db.once('open', () => {
    console.log('Successful connection');
});
