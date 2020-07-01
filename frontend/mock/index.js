const axios = require("axios");

async function fetchPassage() {
    console.log(">>> hello");
    try {
        const res = await axios({
            method: "get",
            url:
                "http://www.easy-mock.com/mock/5ede246cec6f073792b61fa0/example/passage",
            proxy: {
                host: "localhost",
                port: 12639,
            },
        });
        console.log(">>> res is", res);
    } catch (error) {
        console.log(error.message);
    }
}
