import express from "express"


const app = express();


(async () => {

    app.listen(3000, () => {
        console.log("App Started and listening")
    })

})()

