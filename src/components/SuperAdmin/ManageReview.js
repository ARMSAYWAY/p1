import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField, MenuItem, Chip, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import axios from "axios";
import { hostname } from "../../hostname";
import Snackbar from '../snackbar';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import TruncateMarkup from 'react-truncate-markup';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MUIDataTable from "mui-datatables";

function ManageReview() {
    const [allReviewData, setAllReviewData] = useState([])
    const [reviewDialog, setReviewDialog] = useState([])
    const [open, setOpen] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [approveReviewDialog, setApproveReviewDialog] = useState(false)
    const [editReviewData, setEditReviewData] = useState("")

    const [deleteTempleReviewDialog, setDeleteTempleReviewDialog] = useState(false)
    const [deleteTempleReviewData, setDeleteTempleReviewData] = useState("")

    const handleOpenReviewDetail = (rowData) => {
        setOpen(true);
        setReviewDialog(rowData)
    };

    const handleCloseReviewDetail = () => {
        setOpen(false);
    };

    const handleApproveReview = async (rowData) => {
        setApproveReviewDialog(true);
        setEditReviewData(rowData)
    }

    const approveReview = async () => {
        let temple_review_status = editReviewData.temple_review_status;
        if (temple_review_status == 0 || temple_review_status == 2) {
            temple_review_status = 1
        }
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTemplereviewByTemplereviewId`,
            data: {
                "temple_review_id": editReviewData.temple_review_id,
                "temple_review_status": temple_review_status,
            },
        });
        setApproveReviewDialog(false)
        setOpenSnackbar({ status: true, type: "success", msg: "อนุมัติรีวิวสำเร็จ" });
        getAllReviewData()
    }

    const getAllReviewData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleReviewAdmin`,
            data: {},
        });

        res.data.map((item) => {
            item.fullname =
                item.user_firstname + " " + item.user_lastname

            item.filter_status =
                item.temple_review_status === 0 ? 'รออนุมัติ'
                    : item.temple_review_status === 1 ? 'อนุมัติแล้ว'
                        : item.temple_review_status === 2 ? 'รออนุมัติแก้ไข'
                            : ''
        })
        setAllReviewData(res.data)
    }

    const handleDeleteTempleReview = async (rowData) => {
        setDeleteTempleReviewDialog(true);
        setDeleteTempleReviewData(rowData)
    }

    const deleteReview = async (temple_review_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewByTempleReviewId`,
            data: { temple_review_id: temple_review_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "ลบรีวิวสำเร็จ" });
        setDeleteTempleReviewDialog(false);
        getAllReviewData()
    }

    useEffect(() => {
        getAllReviewData()
    }, [])

    return <>
        <LayoutSuperAdmin>

            <Box justify="center" sx={{ p: { md: '20px' } }} >
                <MUIDataTable
                    title={"ตารางจัดการรีวิว"}
                    data={allReviewData}
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
                            name: "temple_review_id",
                            label: "ลำดับ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    return (<div>{dataIndex + 1}</div>)
                                }
                            },
                        },
                        {
                            name: "temple_review_topic",
                            label: "ชื่อหัวข้อ",
                        },
                        {
                            name: "temple_review_description",
                            label: "รายละเอียด",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewData[dataIndex];
                                    return (
                                        <TruncateMarkup
                                            lines={2}
                                            ellipsis={
                                                <span>
                                                    ...
                                                    {
                                                        <IconButton
                                                            style={{ padding: '0px', marginLeft: '5px' }}
                                                            onClick={() => handleOpenReviewDetail(rowData)}
                                                            size="large">
                                                            <Visibility color='gray' />
                                                        </IconButton>
                                                    }
                                                </span>
                                            }
                                        >
                                            <div>
                                                {rowData.temple_review_description}
                                            </div>
                                        </TruncateMarkup>
                                    );
                                }
                            }
                        },
                        {
                            name: "",
                            label: "รูปรีวิว",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewData[dataIndex];
                                    return (
                                        rowData.temple_review_pic_url == null ? "-" :
                                            <img style={{ display: 'block', width: "100%" }} src={rowData.temple_review_pic_url} />
                                    )
                                }
                            },
                        },
                        {
                            name: "temple_name",
                            label: "ชื่อวัด",
                        },
                        {
                            name: "fullname",
                            label: "ผู้สร้าง",
                        },
                        {
                            name: "temple_review_create_time",
                            label: "วันที่สร้าง",
                        },
                        {
                            name: "filter_status",
                            label: "สถานะ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewData[dataIndex];
                                    return <>
                                        <Chip
                                            label={rowData.filter_status}
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    rowData.temple_review_status === 0 ? '#EC7063'
                                                        : rowData.temple_review_status === 1 ? '#58D68D'
                                                            : rowData.temple_review_status === 2 ? '#ffca28'
                                                                : ''
                                                ,
                                                color: 'white',
                                            }}
                                        />
                                        {
                                            rowData.temple_review_status == 0 || rowData.temple_review_status == 2 ?
                                                <IconButton
                                                    onClick={() => {
                                                        handleApproveReview(rowData)
                                                    }}
                                                    size="large">
                                                    <AssignmentTurnedInOutlinedIcon fontSize="small" style={{ color: "" }} />
                                                </IconButton>
                                                : ""
                                        }
                                    </>;
                                }
                            }
                        },
                        {
                            name: "",
                            label: "จัดการ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewData[dataIndex];
                                    return <>
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteTempleReview(rowData)
                                            }}
                                            size="large">
                                            <Delete fontSize="medium" style={{ color: "#f50057" }} />
                                        </IconButton>
                                    </>;
                                }
                            }
                        },
                    ]}
                />
            </Box>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

            <Dialog
                open={open}
                onClose={handleCloseReviewDetail}
                maxWidth='lg'
            >
                <DialogTitle >รายละเอียดรีวิว</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <p style={{ textIndent: '2.5em', color: 'black' }}>
                            {reviewDialog.temple_review_description}
                        </p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" onClick={handleCloseReviewDetail} color="primary" autoFocus>
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={approveReviewDialog}
                onClose={() => { setApproveReviewDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ยืนยันการอนุมัติ</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการอนุมัติรายการนี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setApproveReviewDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px" }}
                        color="save"
                        onClick={() => {
                            approveReview(editReviewData.temple_review_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={deleteTempleReviewDialog}
                onClose={() => { setDeleteTempleReviewDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบรีวิว</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องลบรีวิวนี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleReviewDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteReview(deleteTempleReviewData.temple_review_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>

        </LayoutSuperAdmin>
    </>;
}

export default ManageReview
