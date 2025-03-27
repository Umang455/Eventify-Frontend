import _ from "lodash";
import React, { useState, useEffect, useRef } from "react";
import { makeStyles, Box, Button, Card, IconButton, CircularProgress } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import BackupIcon from "@material-ui/icons/Backup";
import dynamic from "next/dynamic";
import { Player } from "video-react";
import "node_modules/video-react/dist/video-react.css";
// import { baseUrl } from "../../config/api";

// const PdfViewer = dynamic(() => import("./pdfviewer"), { ssr: false });
const imagePaths = ["jpg", "png", "jpeg", "svg", "gif", "webp"];
const videoPaths = ["mp4", "mkv", "mov", "wmv", "flv", "avi", "avchd"];

const baseUrl = "";
const useStyles = makeStyles({
    input: {
        display: "none",
    },
    button: {
        width: 200,
    },
});

export const FilePicker = (props) => {
    const { buttonLabel, maxFiles, setNewFiles, id, filetype } = props;
    const classes = useStyles();
    const [files, setFiles] = useState(props.files);
    const inputFile = useRef(null);
    useEffect(() => {
        setFiles(props.files);
    }, [props.files]);

    function handleChangeFile(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        let f = {
            name: file.name,
            size: file.size,
            type: file.type,
            path: file,
        };
        let copy = _.isEmpty(files) ? [] : _.clone(files);
        copy.push(f);
        // setFiles(copy);
        setNewFiles(copy);
    }

    function _renderImage(file) {
        let src = "",
            children = null;
        console.log(typeof file);
        if (file?.path && !file.path) {
            children = <BackupIcon />;
        } else if (file?.name && file.name.split(".").pop() === "pdf") {
            children = (
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* <PdfViewer file={file} /> */}
                </Box>
            );
        } else if (file?.type && videoPaths.includes(file.type.split("/").pop().toLowerCase())) {
            var url = URL.createObjectURL(file.path);
            children = <Player playsInline src={url} fluid={false} width={700} height={300} />;
        } else if (typeof file.path === "object") {
            src = URL.createObjectURL(file.path);
            children = (
                <img alt={"image"} src={src} style={{ aspectRation: 1, maxWidth: 350, maxHeight: 200 }} />
            );
        } else if (typeof file === "string") {
            console.log("line 80");
            // || imagePaths.includes(file.split(".").pop().toLowerCase())
            children = (
                <img alt={"image"} src={file} style={{ aspectRation: 1, maxWidth: 350, maxHeight: 200 }} />
            );
        } else if (typeof file === "string") {
            // || videoPaths.includes(file.split(".").pop().toLowerCase())
            children = <Player playsInline src={file} fluid={false} width={700} height={300} />;
        } else if (typeof file === "string") {
            // || file.split(".").pop() === "pdf"
            children = (
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* <PdfViewer file={file} /> */}
                </Box>
            );
        } else {
            src = baseUrl + "/" + file.path;
            children = (
                <img alt={"image"} src={src} style={{ aspectRation: 1, maxWidth: 350, maxHeight: 200 }} />
            );
        }
        return children;
    }

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            margin={"30px 0 0 0"}
        >
            <input
                ref={inputFile}
                className={classes.input}
                // accept={".png,.jpg,.jpeg,.pdf"}
                accept={filetype}
                id={id}
                type="file"
                onChange={handleChangeFile}
            />
            <Button
                variant="contained"
                onClick={() => {
                    if (files && maxFiles && maxFiles <= files.length) {
                        return alert(`Only ${maxFiles} can be uploaded`);
                    }
                    inputFile.current.click();
                }}
                color="primary"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
            >
                {buttonLabel}
            </Button>
            <Box display={"flex"} flexDirection={"row"} margin={2} justifyContent={"center"}>
                {files &&
                    files.map((file, index) => {
                        return (
                            <div key={index}>
                                <Card
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        marginRight: 10,
                                        alignItems: "center",
                                        overflow: "hidden",
                                        justifyContent: "center",
                                        padding: 10,
                                    }}
                                >
                                    <Box flexDirection={"column"}>
                                        <Box
                                            alignItems={"center"}
                                            justifyContent={"flex-end"}
                                            backgroundColor={"green"}
                                            flex={1}
                                            display={"flex"}
                                        >
                                            <IconButton
                                                aria-label="delete"
                                                style={{ alignSelf: "flex-end" }}
                                                onClick={() => {
                                                    let copy = _.clone(files);
                                                    copy.splice(index, 1);
                                                    setFiles(copy);
                                                    setNewFiles(copy);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        {_renderImage(file)}
                                    </Box>
                                </Card>
                            </div>
                        );
                    })}
            </Box>
        </Box>
    );
};
