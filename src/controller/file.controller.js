const uploadFile = require("../middleware/upload");

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ messange: "Please Upload a File" });
        }

        res.status(200).send({
            messange: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        if (err.code == "LIMIT_FILESIZE") {
            return res.status(500).send({
                message: "File size cannot be large then 2MB!",
            });
        }

        res.status(500).send({
            messange: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFile = (req, res) => {
    const directorPath = __basedir + "/resorces/static/asseets/uploads";

    fs.readdir(directorPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const filename = req.params.name;
    const directoryPath = __basedir + "/resorces/static/asseets/uploads";

    res.download(directoryPath + filename, filename, (err) => {
        if(err){
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFile,
    download
};
