import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField, MenuItem, Chip, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material'
import axios from "axios";
import makeStyles from '@mui/styles/makeStyles';
import { hostname } from "../../hostname";
import Snackbar from '../snackbar';
import MuiAlert from '@mui/material/Alert';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import LayoutTempleAdmin from '../../Layout/LayoutTempleAdmin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import moment from "moment";
import { useHistory } from "react-router-dom";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageUploading from 'react-images-uploading';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TruncateMarkup from 'react-truncate-markup';
import MUIDataTable from "mui-datatables";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function ManageEvent() {
    const theme = useTheme();
    const history = useHistory()
    const [allEventData, setAllEventData] = useState([])
    const temple_id = localStorage.getItem("temple_id")
    const user_id = localStorage.getItem("user_id")
    const [templeName, setTempleName] = useState("")
    const [openAddEventDialog, setOpenAddEventDialog] = useState(false);
    const [openEditEventDialog, setOpenEditEventDialog] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [eventDetail, setEventDetail] = useState([])
    const [images, setImages] = useState([])
    const [openImagePickDialog, setOpenImagePickDialog] = useState(false);
    const [templeEventPicData, setTempleEventPicData] = useState([])
    const [templeData, setTempleData] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const [addTempleEventData, setAddTempleEventData] = useState({
        temple_event_name: "",
        temple_event_description: "",
        temple_event_start_time: moment(new Date()).format("YYYY-MM-DD"),
        temple_event_end_time: moment(new Date()).format("YYYY-MM-DD")
    })

    const [editTempleEventData, setEditTempleEventData] = useState({})

    const [deleteEventDialog, setDeleteEventDialog] = useState(false)
    const [deleteEventData, setDeleteEventData] = useState("")

    const [deleteTempleEventPicDialog, setDeleteTempleEventPicDialog] = useState(false)
    const [deleteTempleEventPicData, setDeleteTempleEventPicData] = useState("")

    const handleDeleteTempleEventPic = async (rowData) => {
        setDeleteTempleEventPicDialog(true);
        setDeleteTempleEventPicData(rowData)
    }

    const handleCloseImagePickDialog = () => {
        setImages([])
        setOpenImagePickDialog(false);
    }

    const onChangeImagePick = (imageList) => {
        setImages(imageList);
    };

    const handleOpenEventDetail = (rowData) => {
        setOpen(true);
        setEventDetail(rowData)
    }
    const handleCloseEventDetail = () => {
        setOpen(false);
    }


    const handleOpenAddEventDialog = () => {
        setOpenAddEventDialog(true);
    };

    const handleCloseAddEventDialog = () => {
        setAddTempleEventData({
            temple_event_start_time: moment(new Date()).format("YYYY-MM-DD"),
            temple_event_end_time: moment(new Date()).format("YYYY-MM-DD")
        })
        setOpenAddEventDialog(false);
    };

    const handleCloseEditEventDialog = () => {
        getAllEventData()
        setOpenEditEventDialog(false);
    };


    const handleOpenEditEventDialog = async (rowData) => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleEventByTempleEventId`,
            data: { temple_event_id: rowData.temple_event_id },
        });

        const resData = res.data
        const temple_event_start_time = resData.temple_event[0].temple_event_start_time
        const temple_event_end_time = resData.temple_event[0].temple_event_end_time

        setEditTempleEventData({
            temple_event_id: rowData.temple_event_id,
            temple_event_name: rowData.temple_event_name,
            temple_event_description: rowData.temple_event_description,
            temple_event_start_time: temple_event_start_time,
            temple_event_end_time: temple_event_end_time,
        })
        setOpenEditEventDialog(true);
        getTempleEventPicByTempleEvenId(rowData.temple_event_id)
    };

    const getAllEventData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleEventByTempleIdAdmin`,
            data: { temple_id: temple_id },
        });

        res.data.map((item) => {
            item.filter_status =
                item.temple_event_status === 0 ? 'รออนุมัติ'
                    : item.temple_event_status === 1 ? 'อนุมัติแล้ว'
                        : item.temple_event_status === 2 ? 'รออนุมัติแก้ไข'
                            : ''
        })
        setTempleName(res.data[0].temple_name)
        setAllEventData(res.data)
    }

    const addEvent = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleEvent`,
            data: {
                temple_id: temple_id,
                temple_event_name: addTempleEventData.temple_event_name,
                temple_event_description: addTempleEventData.temple_event_description,
                temple_event_start_time: addTempleEventData.temple_event_start_time,
                temple_event_end_time: addTempleEventData.temple_event_end_time,
                temple_event_create_by: user_id,
            },
        });

        let resUploadPic = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleEventPic`,
            data: {
                "temple_event_id": res.data.temple_event_id[0],
                "temple_id": temple_id,
                "temple_event_pic_url": images
            },
        });

        if (resUploadPic) {
            resetInputField()
            setImages([])
            setOpenAddEventDialog(false)
            getAllEventData()
            setOpenSnackbar({ status: true, type: "success", msg: "เพิ่มกิจกรรมสำเร็จ" });
        }
    }

    const editEvent = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleEventByTempleEventId`,
            data: {
                temple_event_id: editTempleEventData.temple_event_id,
                temple_event_name: editTempleEventData.temple_event_name,
                temple_event_description: editTempleEventData.temple_event_description,
                temple_event_start_time: editTempleEventData.temple_event_start_time,
                temple_event_end_time: editTempleEventData.temple_event_end_time,
                temple_event_status: 2,
            },
        });

        let resStatusData = res.data.status

        if (resStatusData == "update_success") {
            resetInputField()
            setOpenEditEventDialog(false)
            setOpenSnackbar({ status: true, type: "success", msg: "แก้ไขกิจกรรมสำเร็จ" });
        }
        getAllEventData()

    }

    const handleDeleteEvent = async (rowData) => {
        setDeleteEventDialog(true);
        setDeleteEventData(rowData)
    }

    const deleteEvent = async (temple_event_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleEventByTempleEventId`,
            data: { temple_event_id: temple_event_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "ลบกิจกรรมสำเร็จ" });
        setDeleteEventDialog(false);
        getAllEventData()
    }

    const resetInputField = () => {
        setAddTempleEventData({
            temple_event_start_time: moment(new Date()).format("YYYY-MM-DD"),
            temple_event_end_time: moment(new Date()).format("YYYY-MM-DD")
        })
        setEditTempleEventData({})
    };

    const getTempleEventPicByTempleEvenId = async (eventId) => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleEventPicByTempleEvenId`,
            data: {
                "temple_event_id": eventId
            },
        });
        let resPic = res.data
        setTempleEventPicData(resPic)
    }

    const deletePic = async (temple_event_pic_id, temple_event_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleEventPicByTempleEventPicId`,
            data: { temple_event_pic_id: temple_event_pic_id }
        });
        if (res.data) {
            getTempleEventPicByTempleEvenId(temple_event_id)
            setOpenSnackbar({ status: true, type: "success", msg: "ลบรูปภาพสำเร็จ" });
        }

    }

    const uploadPic = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleEventPic`,
            data: {
                "temple_event_id": editTempleEventData.temple_event_id,
                "temple_id": temple_id,
                "temple_event_pic_url": images
            },
        });
        if (res) {
            await axios({
                method: "put",
                url: `${hostname}/temple/updateTempleEventByTempleEventId`,
                data: {
                    temple_event_id: editTempleEventData.temple_event_id,
                    temple_event_status: 2,
                },
            });

            setOpenImagePickDialog(false)
            await setImages([])
            getTempleEventPicByTempleEvenId(editTempleEventData.temple_event_id)
            getAllEventData()
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มรูปกิจกรรมสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
        }
    }


    const getTempleByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        setTempleData(res.data.temple[0])

        if (res.data.temple[0].temple_status === 0) {
            setOpenSnackbar({ status: true, type: "error", msg: "วัดของคุณยังไม่ได้อนุมัติ โปรดรอผู้ดูแลระบบอนุมัติก่อน" });
        }
    }


    useEffect(() => {
        if (temple_id) {
            getTempleByTempleId()
            getAllEventData()
        }
        if (!temple_id) {
            setOpenSnackbar({ status: true, type: "error", msg: "คุณยังไม่ได้เพิ่มวัด กรุณาเพิ่มวัดก่อน" });
        }

    }, [])


    return <>
        <LayoutTempleAdmin>
            {!temple_id || templeData.temple_status === 0 ? "" :
                <>
                    <Grid container justifyContent="flex-start">
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            sx={{ ml: { md: "20px" }, mt: { md: "20px" }, mb: { xs: "20px", md: "10px" } }}
                            onClick={handleOpenAddEventDialog}>
                            <EventAvailableIcon fontSize="small" style={{ marginRight: "5px" }}></EventAvailableIcon>
                            เพิ่มกิจกรรม
                        </Button>
                    </Grid>

                    <Box justify="center" sx={{ p: { md: '20px' } }} >
                        <MUIDataTable
                            title={`ตารางจัดการกิจกรรมของวัด ${templeName && templeName}`}
                            data={allEventData}
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
                                    name: "temple_event_id",
                                    label: "ลำดับ",
                                    options: {
                                        customBodyRenderLite: (dataIndex) => {
                                            return (<div>{dataIndex + 1}</div>)
                                        }
                                    },
                                },
                                {
                                    name: "temple_event_name",
                                    label: "ชื่อกิจกรรม",
                                },
                                {
                                    name: "temple_event_description",
                                    label: "รายละเอียด",
                                    options: {
                                        customBodyRenderLite: (dataIndex) => {
                                            let rowData = allEventData[dataIndex];
                                            return (
                                                <TruncateMarkup
                                                    lines={2}
                                                    ellipsis={
                                                        <span>
                                                            ...
                                                            {
                                                                <IconButton
                                                                    style={{ padding: '0px', marginLeft: '5px' }}
                                                                    onClick={() => handleOpenEventDetail(rowData)}
                                                                    size="large">
                                                                    <Visibility color='gray' />
                                                                </IconButton>
                                                            }
                                                        </span>
                                                    }
                                                >
                                                    <div>
                                                        {rowData.temple_event_description}
                                                    </div>
                                                </TruncateMarkup>
                                            );
                                        }
                                    }
                                },
                                {
                                    name: "",
                                    label: "รูปกิจกรรม",
                                    options: {
                                        customBodyRenderLite: (dataIndex) => {
                                            let rowData = allEventData[dataIndex];
                                            return (
                                                rowData.temple_event_pic_url == null ? "-" :
                                                    <img style={{ display: 'block', width: "100%" }} src={rowData.temple_event_pic_url} />
                                            )
                                        }
                                    },
                                },
                                {
                                    name: "temple_event_start_time",
                                    label: "วันที่เริ่ม",
                                },
                                {
                                    name: "temple_event_end_time",
                                    label: "วันที่สิ้นสุด",
                                },
                                {
                                    name: "temple_event_create_time",
                                    label: "วันที่สร้าง",
                                },
                                {
                                    name: "filter_status",
                                    label: "สถานะ",
                                    options: {
                                        customBodyRenderLite: (dataIndex) => {
                                            let rowData = allEventData[dataIndex];
                                            return <>
                                                <Chip
                                                    label={rowData.filter_status}
                                                    size="small"
                                                    style={{
                                                        backgroundColor:
                                                            rowData.temple_event_status === 0 ? '#EC7063'
                                                                : rowData.temple_event_status === 1 ? '#58D68D'
                                                                    : rowData.temple_event_status === 2 ? '#ffca28'
                                                                        : ''
                                                        ,
                                                        color: 'white',
                                                    }}
                                                />
                                            </>;
                                        }
                                    }
                                },
                                {
                                    name: "",
                                    label: "จัดการ",
                                    options: {
                                        customBodyRenderLite: (dataIndex) => {
                                            let rowData = allEventData[dataIndex];
                                            return (
                                                <Box sx={{ pr: 5 }}>
                                                    <Grid container columnSpacing={{ md: 5 }}>
                                                        <Grid item md={6}>
                                                            <IconButton
                                                                onClick={() => {
                                                                    handleOpenEditEventDialog(rowData)
                                                                }}
                                                                size="large">
                                                                <Edit fontSize="medium" style={{ color: "#ffa000ff" }} />
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <IconButton
                                                                onClick={() => {
                                                                    handleDeleteEvent(rowData)
                                                                }}
                                                                size="large">
                                                                <Delete fontSize="medium" style={{ color: "#f50057" }} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )
                                        }
                                    }
                                },
                            ]}
                        />
                    </Box>
                </>
            }


            <Dialog
                open={openAddEventDialog}
                onClose={handleCloseAddEventDialog}
                maxWidth="md"
                fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
            >
                <DialogTitle >{"เพิ่มกิจกรรม"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container style={{ marginTop: "2%" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="ชื่อกิจกรรม"
                                        variant="outlined"
                                        required
                                        value={addTempleEventData.temple_event_name}
                                        onChange={(e) => {
                                            setAddTempleEventData({ ...addTempleEventData, temple_event_name: e.target.value })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="วันที่เริ่ม"
                                        style={{ marginRight: "8px" }}
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={addTempleEventData.temple_event_start_time}
                                        onChange={(e) => {
                                            setAddTempleEventData({ ...addTempleEventData, temple_event_start_time: e.target.value })
                                        }}
                                        required
                                    />

                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <TextField
                                        label="วันที่สิ้นสุด"
                                        style={{ marginRight: "8px" }}
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={addTempleEventData.temple_event_end_time}
                                        onChange={(e) => {
                                            setAddTempleEventData({ ...addTempleEventData, temple_event_end_time: e.target.value })
                                        }}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: "2%" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="รายละเอียด"
                                    variant="outlined"
                                    multiline
                                    rows={10}
                                    value={addTempleEventData.temple_event_description}
                                    onChange={(e) => {
                                        setAddTempleEventData({ ...addTempleEventData, temple_event_description: e.target.value })
                                    }}
                                />
                            </Grid>

                            <Typography style={{ marginTop: "3%" }}>เพิ่มรูปภาพกิจกรรม</Typography>

                            <Grid item xs={12}>
                                <Grid item xs={12} style={{ marginTop: "2%" }}>
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
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>

                    <Button onClick={handleCloseAddEventDialog} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={addEvent} variant="contained" color="save"
                        disabled={
                            addTempleEventData.temple_event_name === "" ||
                            addTempleEventData.temple_event_description === ""
                        }>
                        เพิ่มกิจกรรม
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditEventDialog}
                onClose={handleCloseEditEventDialog}
                maxWidth="md"
                fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
            >
                <DialogTitle >{"แก้ไขกิจกรรม"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} >
                                    <TextField
                                        fullWidth
                                        label="ชื่อกิจกรรม"
                                        variant="outlined"
                                        required
                                        value={editTempleEventData.temple_event_name}
                                        onChange={(e) => {
                                            setEditTempleEventData({ ...editTempleEventData, temple_event_name: e.target.value })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <TextField
                                        label="วันที่เริ่ม"
                                        style={{ marginRight: "8px" }}
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        value={editTempleEventData.temple_event_start_time}
                                        onChange={(e) => {
                                            setEditTempleEventData({ ...editTempleEventData, temple_event_start_time: e.target.value })
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />

                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <TextField
                                        label="วันที่สิ้นสุด"
                                        style={{ marginRight: "8px" }}
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        value={editTempleEventData.temple_event_end_time}
                                        onChange={(e) => {
                                            setEditTempleEventData({ ...editTempleEventData, temple_event_end_time: e.target.value })
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="รายละเอียด"
                                    variant="outlined"
                                    multiline
                                    rows={10}
                                    value={editTempleEventData.temple_event_description}
                                    onChange={(e) => {
                                        setEditTempleEventData({ ...editTempleEventData, temple_event_description: e.target.value })
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Grid item xs={5} md={3}>
                                    <Typography>จัดการรูปภาพ</Typography>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setOpenImagePickDialog(true);
                                        }}
                                        style={{ marginTop: "10%", marginBottom: "10%" }}
                                    >
                                        <PhotoLibraryIcon style={{ color: "white", marginRight: "5px" }} />
                                        เพิ่มรูปภาพ
                                    </Button>
                                </Grid>

                                {!templeEventPicData ? "" :
                                    <Box sx={{ mt: 2, px: { md: 2 } }}>
                                        <MUIDataTable
                                            title={"ตารางรูปภาพ"}
                                            data={templeEventPicData}
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
                                                    name: "temple_event_pic_id",
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
                                                            let rowData = templeEventPicData[dataIndex];
                                                            return rowData.temple_event_pic_url == null ? "-" :
                                                                <img style={{ display: 'block', width: "80%" }} src={rowData.temple_event_pic_url} />
                                                        }
                                                    },
                                                },
                                                {
                                                    name: "temple_event_pic_create_time",
                                                    label: "วันที่สร้าง",
                                                },
                                                {
                                                    name: "",
                                                    label: "จัดการ",
                                                    options: {
                                                        customBodyRenderLite: (dataIndex) => {
                                                            let rowData = templeEventPicData[dataIndex];
                                                            return (
                                                                <IconButton
                                                                    onClick={() => {
                                                                        handleDeleteTempleEventPic(rowData)
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
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                    <Button onClick={handleCloseEditEventDialog} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={editEvent} variant="contained" color="save"
                        disabled={
                            editTempleEventData.temple_event_name === "" ||
                            editTempleEventData.temple_event_description === ""
                        }>
                        บันทึก
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                onClose={handleCloseEventDetail}
            >
                <DialogTitle >รายละเอียดกิจกรรม</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        {eventDetail.temple_event_description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" onClick={handleCloseEventDetail} color="primary" autoFocus>
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteEventDialog}
                onClose={() => { setDeleteEventDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบกิจกรรม</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องลบกิจกรรมนี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteEventDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteEvent(deleteEventData.temple_event_id)
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

            <Dialog
                open={deleteTempleEventPicDialog}
                onClose={() => { setDeleteTempleEventPicDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบรูปภาพ</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการรูปภาพนี้ ?</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleEventPicDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deletePic(deleteTempleEventPicData.temple_event_pic_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>


            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />


        </LayoutTempleAdmin>

    </>;
}

export default ManageEvent
