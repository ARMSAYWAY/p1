import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography, IconButton, TextField, Chip, Box, MenuItem, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LayoutTempleAdmin from '../../Layout/LayoutTempleAdmin';
import { hostname } from '../../hostname';
import axios from 'axios';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import Snackbar from '../snackbar';
import ImageUploading from 'react-images-uploading';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CancelIcon from '@mui/icons-material/Cancel';
import MUIDataTable from "mui-datatables";

function ManageTemple() {
    const [templeType, setTempleType] = useState("1");
    const [templeName, setTempleName] = useState("")
    const [templeAddress, setTempleAddress] = useState("")
    const [templeDescription, setTempleDescription] = useState("")
    const user_id = localStorage.getItem("user_id")
    const temple_id = localStorage.getItem('temple_id');
    const [templePicData, setTemplePicData] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [images, setImages] = useState([])
    const [openImagePickDialog, setOpenImagePickDialog] = useState(false);
    const [templeStatus, setTempleStatus] = useState("")

    const [deleteTemplePicDialog, setDeleteTemplePicDialog] = useState(false)
    const [deleteTemplePicData, setDeleteTemplePicData] = useState("")

    const handleDeleteTemplePic = async (rowData) => {
        setDeleteTemplePicDialog(true);
        setDeleteTemplePicData(rowData)
    }

    const handleCloseImagePickDialog = () => {
        setImages([])
        setOpenImagePickDialog(false);
    }

    const onChangeImagePick = (imageList) => {
        setImages(imageList);
    };

    const addTemple = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/addTemple`,
            data: {
                "temple_type_id": templeType,
                "temple_name": templeName,
                "temple_description": templeDescription,
                "temple_address": templeAddress,
                "temple_create_by": user_id,
            },
        });

        if (res.data.status == "add_success") {
            const resTempleId = res.data.temple_id[0]
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มวัดสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
            localStorage.setItem('temple_id', resTempleId)
            getTempleByTempleId(resTempleId)
            getTemplePicByTempleId()
        }
    }

    const updateTemple = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleByTempleId`,
            data: {
                "temple_id": temple_id,
                "temple_type_id": templeType,
                "temple_name": templeName,
                "temple_description": templeDescription,
                "temple_address": templeAddress,
                "temple_status": 2,
            },
        });


        if (res.data.status == "update_success") {
            setOpenSnackbar({ status: true, type: "warning", msg: "แก้ไขวัดสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
            getTempleByTempleId()
        }
    }

    const getTempleByTempleId = async (resTempleId) => {
        if (resTempleId) {
            let res = await axios({
                method: "post",
                url: `${hostname}/temple/getTempleByTempleId`,
                data: {
                    "temple_id": resTempleId
                },
            });

            const templeData = (res.data.temple[0])
            setTempleName(templeData.temple_name)
            setTempleName(templeData.temple_name)
            setTempleAddress(templeData.temple_address)
            setTempleType(templeData.temple_type_id)
            setTempleDescription(templeData.temple_description)
            setTempleStatus(templeData.temple_status)
        } else if (temple_id) {
            let res = await axios({
                method: "post",
                url: `${hostname}/temple/getTempleByTempleId`,
                data: {
                    "temple_id": temple_id
                },
            });

            const templeData = (res.data.temple[0])
            setTempleName(templeData.temple_name)
            setTempleAddress(templeData.temple_address)
            setTempleType(templeData.temple_type_id)
            setTempleDescription(templeData.temple_description)
            setTempleStatus(templeData.temple_status)
        }

    }

    const getTemplePicByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTemplePicByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        if (res.data) {
            setTemplePicData(res.data)
        }
    }

    const uploadPic = async () => {
        let res = axios({
            method: "post",
            url: `${hostname}/temple/addTemplePic`,
            data: {
                "temple_id": temple_id,
                "temple_pic_url": images
            },
        });

        if (res) {
            await axios({
                method: "put",
                url: `${hostname}/temple/updateTempleByTempleId`,
                data: {
                    "temple_id": temple_id,
                    "temple_status": 2,
                },
            });

            getTemplePicByTempleId()
            setOpenImagePickDialog(false)
            await setImages([])
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มรูปวัดสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
        }
    }


    const deletePic = async (temple_pic_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTemplePicByTemplePicId`,
            data: { temple_pic_id: temple_pic_id }
        });
        if (res.data) {
            getTemplePicByTempleId()
            setOpenSnackbar({ status: true, type: "success", msg: "ลบรูปวัดสำเร็จ" });
            setDeleteTemplePicDialog(false);
        }

    }

    useEffect(() => {
        if (temple_id !== null) {
            getTempleByTempleId()
            getTemplePicByTempleId()
        }
    }, [images])

    return <>
        <LayoutTempleAdmin>
            <Grid container justifyContent="center" spacing={2}>
                <Grid item md={10}>
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h5" sx={{ ml: { md: "2%" }, marginTop: "2%", textAlign: "left" }}>
                            รายละเอียดวัดของคุณ
                        </Typography>

                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item >
                                สถานะ :
                                <Chip
                                    label={
                                        templeStatus === "" ? 'ยังไม่มีวัด'
                                            : templeStatus === 0 ? 'รออนุมัติ'
                                                : templeStatus === 1 ? 'อนุมัติแล้ว'
                                                    : templeStatus === 2 ? 'รออนุมัติแก้ไข'
                                                        : ''
                                    }
                                    size="small"
                                    style={{
                                        marginLeft: "5px",
                                        backgroundColor:
                                            templeStatus === 0 ? '#EC7063'
                                                : templeStatus === 1 ? '#58D68D'
                                                    : templeStatus === 2 ? '#ffca28'
                                                        : ''
                                        ,
                                        color: 'white',
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container rowSpacing={1} columnSpacing={5} sx={{ px: { md: 3 } }}>
                            <Grid item md={7} xs={12}>
                                <Typography variant="h6" style={{ textAlign: "left" }}>ชื่อวัด</Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    value={templeName}
                                    placeholder="ชื่อวัด"
                                    onChange={(e) => {
                                        setTempleName(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item md={5} xs={12}>
                                <Typography variant="h6" style={{ textAlign: "left" }}>ประเภทของวัด</Typography>
                                <form Validate autoComplete="off">
                                    <div>
                                        <TextField
                                            select
                                            label="กรุณาเลือกประเภทของวัด"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            value={templeType}
                                            onChange={(e) => {
                                                setTempleType(e.target.value)
                                            }}
                                        >
                                            <MenuItem value={'1'}>วัดทั่วไป</MenuItem>
                                            <MenuItem value={'2'}>วัดป่า</MenuItem>
                                        </TextField>
                                    </div>
                                </form>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ px: { md: 3 }, mt: 1 }}>
                            <Grid item md={12} xs={12}>
                                <Typography variant="h6" style={{ textAlign: "left" }}>ที่อยู่</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={templeAddress}
                                    onChange={(e) => {
                                        setTempleAddress(e.target.value)
                                    }}
                                    placeholder="ที่อยู่"
                                />
                            </Grid>
                        </Grid>

                        <Grid container sx={{ px: { md: 3 }, mt: 1 }}>
                            <Grid item md={12} xs={12}>
                                <Typography variant="h6" style={{ textAlign: "left" }}>รายละเอียดวัด</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={templeDescription}
                                    onChange={(e) => {
                                        setTempleDescription(e.target.value)
                                    }}
                                    placeholder="รายละเอียดวัด"
                                    multiline
                                    rows={20}
                                />
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="center" sx={{ mt: 3 }}>
                            <Grid item md={3} xs={12}>
                                {temple_id == null ?
                                    <Button
                                        variant="contained"
                                        color="add"
                                        disabled={
                                            templeName == "" ? true :
                                                templeDescription == "" ? true :
                                                    templeAddress == "" ? true : false
                                        }
                                        fullWidth
                                        onClick={() => {
                                            addTemple()
                                        }}
                                    >
                                        เพิ่มวัด
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="save"
                                        disabled={
                                            templeName == "" ? true :
                                                templeDescription == "" ? true :
                                                    templeAddress == "" ? true : false
                                        }
                                        onClick={() => {
                                            updateTemple()
                                        }}
                                    >
                                        บันทึก
                                    </Button>
                                }
                            </Grid>
                        </Grid>

                        <Divider sx={{ mt: 4, mb: 3 }} />

                        {!temple_id ? "" :
                            <>
                                <Typography variant="h5" sx={{ ml: { md: "2%" }, marginTop: "2%", textAlign: "left" }}>
                                    จัดการรูปภาพ
                                </Typography>

                                <Grid container sx={{ mt: 3, px: { md: 2 } }} >
                                    <Grid item xs={6} md={3}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                setOpenImagePickDialog(true);
                                            }}
                                        >
                                            <PhotoLibraryIcon style={{ color: "white", marginRight: "5px" }} />
                                            เพิ่มรูปภาพ
                                        </Button>
                                    </Grid>
                                </Grid>

                                {!templePicData ? "" :
                                    <Box sx={{ mt: 3, px: { md: 2 } }}>
                                        <MUIDataTable
                                            title={"ตารางรูปภาพ"}
                                            data={templePicData}
                                            options={{
                                                viewColumns: false,
                                                filter: false,
                                                print: false,
                                                download: false,
                                                selectableRows: false,
                                                textLabels: {
                                                    body: {
                                                        noMatch: "ไม่พบข้อมูล",
                                                    },
                                                },
                                            }}
                                            columns={[
                                                {
                                                    name: "temple_pic_id",
                                                    label: "ลำดับ",
                                                    options: {
                                                        customBodyRenderLite: (dataIndex) => {
                                                            return (<div>{dataIndex + 1}</div>)
                                                        }
                                                    },
                                                },
                                                {
                                                    name: "",
                                                    label: "รูปภาพ",
                                                    options: {
                                                        customBodyRenderLite: (dataIndex) => {
                                                            let rowData = templePicData[dataIndex];
                                                            return rowData.temple_pic_url == null ? "-" :
                                                                <img style={{ display: 'block', width: "80%" }} src={rowData.temple_pic_url} />
                                                        }
                                                    },
                                                },
                                                {
                                                    name: "temple_pic_create_time",
                                                    label: "วันที่สร้าง",
                                                },
                                                {
                                                    name: "",
                                                    label: "จัดการ",
                                                    options: {
                                                        customBodyRenderLite: (dataIndex) => {
                                                            let rowData = templePicData[dataIndex];
                                                            return (
                                                                <IconButton
                                                                    onClick={() => {
                                                                        handleDeleteTemplePic(rowData)
                                                                    }}
                                                                    size="large">
                                                                    <Delete fontSize="medium" style={{ color: "#D9534F" }} />
                                                                </IconButton>
                                                            );
                                                        }
                                                    }
                                                },
                                            ]}
                                        />
                                    </Box>
                                }

                            </>
                        }
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

            <Dialog
                open={deleteTemplePicDialog}
                onClose={() => { setDeleteTemplePicDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบรูปภาพ</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการรูปภาพนี้ ?</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTemplePicDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deletePic(deleteTemplePicData.temple_pic_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={openImagePickDialog}
                onClose={handleCloseImagePickDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle >{"เพิ่มรูปภาพ"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container style={{ marginTop: "2%" }}>
                            <Grid item xs={12}></Grid>

                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChangeImagePick}
                                maxNumber='10'
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageUpdate,
                                    onImageRemove
                                }) => (
                                    <>
                                        <Grid container>
                                            <Grid item>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={onImageUpload}
                                                >
                                                    <CloudUploadIcon style={{ color: "white", marginRight: "5px" }} />
                                                    เลือกรูปภาพ
                                                </Button>
                                            </Grid>
                                            <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 20 }}>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent="flex-start" spacing={1} style={{ textAlign: "left" }}>

                                                        {imageList.map((image, index) => (
                                                            <div key={index}>
                                                                <Grid container justifyContent="flex-end" style={{ marginTop: '30px' }} spacing={1}>

                                                                    {/* <Button
                                                                    variant="contained"
                                                                    style={{ backgroundColor: "#eb3434", color: "#FFFFFF" }}
                                                                    onClick={() => onImageRemove(index)}
                                                                >
                                                                    ลบ
                                                                </Button> */}

                                                                    <CancelIcon style={{ color: "#eb3434" }} onClick={() => onImageRemove(index)}></CancelIcon>

                                                                </Grid>
                                                                <Grid container justifyContent="center" spacing={1} style={{ marginRight: '20px' }} s>
                                                                    <Grid item xs={12} justifyContent="center">
                                                                        <img src={image['data_url']} alt="" width="100" />

                                                                    </Grid>


                                                                </Grid>

                                                            </div>

                                                        ))}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>

                                )}
                            </ImageUploading>

                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                    <Button onClick={handleCloseImagePickDialog} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    {images.length == 0 ? "" :
                        <Button
                            variant="contained"
                            color="save"
                            onClick={() => {
                                uploadPic()
                            }}

                        >
                            อัพโหลด
                        </Button>
                    }
                </DialogActions>
            </Dialog >
        </LayoutTempleAdmin>
    </>;
}

export default ManageTemple
