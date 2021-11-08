import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Grid, Paper, IconButton, Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import Layout from '../../Layout/Layout';
import image from '../../asset/image.jpeg'
import img from '../../asset/img1.jpeg'
import bg from '../../asset/bg.jpeg'
import pagoda from '../../asset/pagoda.png'
import MaterialTable from "material-table";
import comment from '../../asset/comments.png'
import axios from 'axios';
import { hostname } from '../../hostname';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardActionArea from '@mui/material/CardActionArea';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageUploading from 'react-images-uploading';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import Snackbar from '../snackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MUIDataTable from "mui-datatables";

function TempleReview() {
    const theme = useTheme();
    const history = useHistory();
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const queryParams = new URLSearchParams(window.location.search);
    const temple_id = queryParams.get('temple_id');
    const [reviewData, setReviewData] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openEditReviewDialog, setOpenEditReviewDialog] = useState(false);
    const [openAddReviewDialog, setOpenAddReviewDialog] = useState(false);
    const [TopicReview, setTopicReview] = useState("")
    const [DescriptionReview, setDescriptionReview] = useState("")
    const [IdReview, setIdReview] = useState("")
    const [templeName, setTempleName] = useState("")

    const user_id = localStorage.getItem("user_id")

    const [toppicReviewAdd, setToppicReviewAdd] = useState("")
    const [descriptionReviewAdd, setDescriptionReviewAdd] = useState("")

    const [openDialogRemove, setOpenDialogRemove] = useState(false);

    const [templeReviewPicData, setTempleReviewPicData] = useState(false)
    const [idRemove, setIdRemove] = useState([])

    const [openImagePickDialog, setOpenImagePickDialog] = useState(false);
    const [images, setImages] = useState([])

    const [deleteTempleReviewPicDialog, setDeleteTempleReviewPicDialog] = useState(false)
    const [deleteTempleReviewPicData, setDeleteTempleReviewPicData] = useState("")

    const handleDeleteTempleReviewPic = async (rowData) => {
        setDeleteTempleReviewPicDialog(true);
        setDeleteTempleReviewPicData(rowData)
    }

    const handleClickOpenRemove = (temple_review_id) => {
        setOpenDialogRemove(true);
        setIdRemove(temple_review_id)
    };

    const handleCloseImagePickDialog = () => {
        setImages([])
        setOpenImagePickDialog(false);
    }

    const onChangeImagePick = (imageList) => {
        setImages(imageList);
    };

    const handleCloseRemove = () => {
        setOpenDialogRemove(false);
    };

    const handleClickOpenAddReviewDialog = () => {
        setOpenAddReviewDialog(true);
    };

    const handleCloseAddReviewDialog = () => {
        setToppicReviewAdd("")
        setDescriptionReviewAdd("")
        setOpenAddReviewDialog(false);
    };

    const handleCloseEditReviewDialog = () => {
        setOpenEditReviewDialog(false);
    };

    const handleOpenEditReviewDialog = async (temple_review_id) => {
        let resTempleReview = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewByTempleReviewId`,
            data: {
                temple_review_id: temple_review_id
            },
        });
        const resTempleReviewData = resTempleReview.data.temple_review
        setIdReview(resTempleReviewData[0].temple_review_id)
        setTopicReview(resTempleReviewData[0].temple_review_topic)
        setDescriptionReview(resTempleReviewData[0].temple_review_description)
        setOpenEditReviewDialog(true);
        getTempleReviewPicByTempleReviewId(temple_review_id)

    };

    const uploadPic = async () => {
        let res = axios({
            method: "post",
            url: `${hostname}/temple/addTempleReviewPic`,
            data: {
                "temple_review_id": IdReview,
                "temple_id": temple_id,
                "temple_review_pic_url": images
            },
        });
        if (res) {
            await axios({
                method: "put",
                url: `${hostname}/temple/updateTempleReviewByTempleReviewId`,
                data: {
                    "temple_review_id": IdReview,
                    "temple_review_status": 2
                },
            });

            setOpenImagePickDialog(false)
            await setImages([])
            getTempleReviewPicByTempleReviewId(IdReview)
            getTempleReviewByTempleId()
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มรูปรีวิวสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });


        }

    }

    const addReview = async () => {
        let resAddReview = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleReview`,
            data: {
                "temple_id": temple_id,
                "temple_review_topic": toppicReviewAdd,
                "temple_review_description": descriptionReviewAdd,
                "temple_review_create_by": user_id
            },
        });


        let resUploadPic = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleReviewPic`,
            data: {
                "temple_review_id": resAddReview.data.temple_review_id[0],
                "temple_id": temple_id,
                "temple_review_pic_url": images
            },
        });

        if (resUploadPic) {
            resetInputField();
            setImages([])
            setOpenAddReviewDialog(false)
            setOpenSnackbar({ status: true, type: "warning", msg: "เพิ่มรีวิวสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
            getTempleReviewByTempleId()
        }


    }

    const editReview = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleReviewByTempleReviewId`,
            data: {
                "temple_review_id": IdReview,
                "temple_review_topic": TopicReview,
                "temple_review_description": DescriptionReview,
                "temple_review_status": 2
            },
        });

        if (res.data.status == "update_success") {
            resetInputField();
            setOpenEditReviewDialog(false)
            setOpenSnackbar({ status: true, type: "warning", msg: "แก้ไรรีวิวสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ" });
        }
        getTempleReviewByTempleId()
    }


    const resetInputField = () => {
        setTopicReview("");
        setDescriptionReview("");
        setToppicReviewAdd("")
        setDescriptionReviewAdd("")
    };

    const getTempleReviewByTempleId = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewByTempleId`,
            data: {
                "temple_id": temple_id
            },
        });
        let resData = res.data
        setReviewData(resData)
        if (resData.length !== 0 && resData.length > 0) {
            setReviewData(resData)
            setTempleName(resData[0].temple_name)
        } else {
            setOpenSnackbar({ status: true, type: "error", msg: "ยังไม่มีข้อมูลรีวิวของวัดนี้" });
        }
    }

    const deleteReview = async () => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewByTempleReviewId`,
            data: { temple_review_id: idRemove },
        });
        setOpenDialogRemove(false);
        setOpenSnackbar({ status: true, type: "success", msg: "ลบรีวิวสำเร็จ" });
        // getAllReviewData()
        getTempleReviewByTempleId()

    }


    const getTempleReviewPicByTempleReviewId = async (temple_review_id) => {
        let resTempleReviewPic = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleReviewPicByTempleReviewId`,
            data: {
                "temple_review_id": temple_review_id
            },
        });

        setTempleReviewPicData(resTempleReviewPic.data)
    }

    const deletePic = async (temple_review_pic_id, temple_review_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewPicByTempleReviewPicId`,
            data: { temple_review_pic_id: temple_review_pic_id }
        });
        if (res.data) {
            getTempleReviewPicByTempleReviewId(temple_review_id)
            getTempleReviewByTempleId()
            setOpenSnackbar({ status: true, type: "success", msg: "ลบรูปรีวิวสำเร็จ" });
        }

    }



    useEffect(() => {
        getTempleReviewByTempleId()
    }, [])

    return <>
        <Layout>
            <Grid container justifyContent="center" style={{ marginTop: "2%" }}>
                <Grid item xs={12} md={8} style={{ background: "white", paddingLeft: "3%", paddingRight: "3%", boxShadow: "2px 2px 2px gray", borderRadius: "5px" }}>
                    <Typography variant="h5" sx={{ textAlign: { md: "center", xs: "left" }, padding: "2%", mt: 2 }}>
                        {templeName !== "" ?
                            `รีวิวของ ${templeName} `
                            :
                            `รีวิว `
                        }
                        <Box
                            component="img"
                            sx={{ width: { xs: "9%", md: "5%" }, ml: { md: 1, xs: "2px" } }}
                            alt="logo"
                            src={comment}
                        />
                    </Typography>
                    {!user_id ? "" :
                        <Grid container sx={{ mt: 2 }} justifyContent="flex-end">
                            <Grid item md={2} xs={12} sx={{ textAlign: "right", mb: 4 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    style={{ background: "#6495ED", color: "white" }}
                                    onClick={handleClickOpenAddReviewDialog}
                                >
                                    <RateReviewIcon style={{ marginRight: '6%' }} />
                                    <Typography>เขียนรีวิว</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {reviewData !== 0 && reviewData > 0 ? ""
                        :
                        reviewData.map((data) => (
                            <>
                                <Card sx={{ width: "100%", mb: 2 }} >
                                    <CardHeader
                                        avatar={
                                            <Avatar aria-label="recipe" sx={{ backgroundColor: red[500], }}>
                                                {data.user_firstname}
                                            </Avatar>
                                        }
                                        title={data.user_firstname + "  " + data.user_lastname}
                                        subheader={data.temple_review_create_time}
                                        action={


                                            <>
                                                {user_id == data.user_id ?
                                                    <>
                                                        <Grid container >
                                                            <Grid item xs={5}>
                                                                <IconButton
                                                                    onClick={() => handleOpenEditReviewDialog(data.temple_review_id)}
                                                                    style={{ marginRight: "10%" }}
                                                                    size="large">
                                                                    <EditIcon style={{ color: "orange" }} />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <IconButton onClick={() => handleClickOpenRemove(data.temple_review_id)} size="large">
                                                                    <DeleteIcon color="cancel" />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                    :
                                                    ""
                                                }
                                            </>
                                        }
                                    />
                                    <CardActionArea onClick={() => {
                                        {
                                            history.push('/reviewDetail?temple_review_id=' + data.temple_review_id);
                                        }
                                    }}>
                                        <Grid container justifyContent="center">
                                            <Grid item xs={12}>
                                                {data.temple_review_pic_url == undefined ?
                                                    <CardMedia
                                                        sx={{
                                                            height: "250px",
                                                            paddingTop: '25%',
                                                        }}
                                                        image={"https://doozypos.com/assets/no-image.png"}
                                                        title="Paella dish"
                                                    />
                                                    :
                                                    <CardMedia
                                                        sx={{
                                                            height: "250px",
                                                            paddingTop: '25%',
                                                        }}
                                                        image={data.temple_review_pic_url}
                                                        title="Paella dish"
                                                    />

                                                }
                                            </Grid>
                                        </Grid>
                                        <CardContent>
                                            <Typography variant="body2" style={{ fontSize: '16px' }} color="TextSecondary" component="p">
                                                <b> {data.temple_review_topic}</b>
                                            </Typography>
                                            <Typography variant="body2" style={{ fontSize: '16px' }} color="TextSecondary" component="p">
                                                {data.temple_review_description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions >
                                        <Grid container justifyContent="flex-end" alignItems="flex-end">
                                            <Button size="small" color="primary" onClick={() => {
                                                {
                                                    history.push('/reviewDetail?temple_review_id=' + data.temple_review_id);
                                                }
                                            }}>
                                                <Typography>อ่านรีวิวเพิ่มเติม</Typography>
                                            </Button>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </>
                        ))}

                    <Dialog
                        open={openAddReviewDialog}
                        onClose={handleCloseAddReviewDialog}
                        maxWidth="md"
                        fullWidth
                        fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
                    >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                            เขียนรีวิว
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Grid container >

                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="หัวข้อ"
                                            value={toppicReviewAdd}
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => {

                                                setToppicReviewAdd(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: "2%" }}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="รายละเอียด"
                                            multiline
                                            rows={6}
                                            value={descriptionReviewAdd}
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => {
                                                setDescriptionReviewAdd(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Typography style={{ marginTop: "3%" }}>เพิ่มรูปภาพรีวิว</Typography>
                                    <Grid item xs={12}>
                                        <Grid container>
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
                                                                <Grid item xs={12} md={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={onImageUpload}
                                                                    >
                                                                        <CloudUploadIcon sx={{ color: "white", mr: "5px" }} />
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
                                </Grid>

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                            <Button onClick={handleCloseAddReviewDialog} style={{ color: "#636363" }}>
                                ยกเลิก
                            </Button>
                            <Button
                                variant="contained"
                                onClick={addReview}
                                color="save"
                                disabled={
                                    toppicReviewAdd == "" ? true :
                                        descriptionReviewAdd == "" ? true : false

                                }
                            >
                                เพิ่มรีวิว
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openEditReviewDialog}
                        onClose={handleCloseEditReviewDialog}
                        maxWidth="md"
                        fullWidth
                        fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
                    >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                            แก้ไขรีวิว
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Grid container >
                                    <Grid item xs={12}>
                                        <Typography>หัวข้อรีวิว</Typography>
                                        <TextField
                                            fullWidth
                                            value={TopicReview}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setTopicReview(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: "3%" }}>
                                        <Typography>เนื้อหา</Typography>
                                        <TextField
                                            multiline
                                            rows={6}
                                            fullWidth
                                            value={DescriptionReview}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setDescriptionReview(e.target.value)
                                            }}
                                        />

                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{ marginTop: "3%" }}>
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

                                    {!templeReviewPicData ? "" :
                                        <Box sx={{ mt: 2, px: { md: 2 } }}>
                                            <MUIDataTable
                                                title={"ตารางรูปภาพ"}
                                                data={templeReviewPicData}
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
                                                        name: "temple_review_pic_id",
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
                                                                let rowData = templeReviewPicData[dataIndex];
                                                                return rowData.temple_review_pic_url == null ? "-" :
                                                                    <img style={{ display: 'block', width: "80%" }} src={rowData.temple_review_pic_url} />
                                                            }
                                                        },
                                                    },
                                                    {
                                                        name: "temple_review_pic_create_time",
                                                        label: "วันที่สร้าง",
                                                    },
                                                    {
                                                        name: "",
                                                        label: "จัดการ",
                                                        options: {
                                                            customBodyRenderLite: (dataIndex) => {
                                                                let rowData = templeReviewPicData[dataIndex];
                                                                return (
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            handleDeleteTempleReviewPic(rowData)
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
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                            <Button autoFocus onClick={handleCloseEditReviewDialog} style={{ color: "#636363" }}>
                                ยกเลิก
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => editReview()}
                                color="save"
                                disabled={
                                    TopicReview == "" ? true :
                                        DescriptionReview == "" ? true : false

                                }
                            >
                                บันทึก
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
                        open={openDialogRemove}
                        onClose={handleCloseRemove}

                    >
                        <DialogTitle >ลบรีวิว</DialogTitle>
                        <DialogContent>
                            <DialogContentText >
                                <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้ ?</Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseRemove} style={{ color: "gray" }}>
                                ยกเลิก
                            </Button>
                            <Button onClick={deleteReview} variant="contained" color="cancel" >
                                ตกลง
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>

            <Dialog
                open={deleteTempleReviewPicDialog}
                onClose={() => { setDeleteTempleReviewPicDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบรูปภาพ</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการรูปภาพนี้ ?</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleReviewPicDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deletePic(deleteTempleReviewPicData.temple_review_pic_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>
        </Layout >

        <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />


    </>;
}

export default TempleReview
