const express = require('express')
const multiparty = require('multiparty')
const app = express()
const cors = require('cors')
const fs = require('fs')
//const axios = require('axios')
//import fetch from "node-fetch";
app.use(cors())

const exiftool = require("exiftool-vendored").exiftool
//const res = require('express/lib/response')

const exifOrientations = [null, "Horizontal (normal)", "Mirror horizontal", "Rotate 180", "Mirror vertical", "Mirror horizontal and rotate 270 CW", "Rotate 90 CW", "Mirror horizontal and rotate 90 CW", "Rotate 270 CW"]

app.post('/api/removeExif', (request, response) => {
    var form = new multiparty.Form();

    form.parse(request, function (err, fields, files) {
        //console.log(util.inspect({ fields: fields, files: files }));
        //console.log(123)
    });

    form.on('file', function (name, file) {

        var formData = {
            file: {
                value: fs.createReadStream(file.path),
                options: {
                    filename: file.originalFilename
                }
            }
        };
        console.log(formData);

        exiftool.read(formData.file.value.path).then(tags => {
            // https://exiftool.org/TagNames/EXIF.html

            exiftool.deleteAllTags(formData.file.value.path).then(_ => {
                exiftool.write(formData.file.value.path, { Orientation: exifOrientations[tags.Orientation] }).then(_ => {
                    response.sendFile(formData.file.value.path)
                })
            })
        })

    });
})

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})