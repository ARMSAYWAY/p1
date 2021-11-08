import React, { useState, useEffect } from 'react'
import { Button, Grid, Box, TextField, MenuItem, Chip, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import axios from "axios";
import { hostname } from "../../hostname";
import Snackbar from '../snackbar';
import TextTruncate from 'react-text-truncate';
import { Delete, Edit, Visibility } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import TruncateMarkup from 'react-truncate-markup';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MUIDataTable from "mui-datatables";

function ManageComment() {
    const [allReviewCommentData, setAllReviewCommentData] = useState([])
    const [commentDialog, setCommentDialog] = useState([])
    const [open, setOpen] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [approveCommentDialog, setApproveCommentDialog] = useState(false)
    const [editCommentData, setEditCommentData] = useState("")

    const [deleteTempleReviewCommentDialog, setDeleteTempleReviewCommentDialog] = useState(false)
    const [deleteTempleReviewCommentData, setDeleteTempleReviewCommentData] = useState("")

    const handleApproveComment = async (rowData) => {
        setApproveCommentDialog(true);
        setEditCommentData(rowData)
    }

    const approveComment = async () => {
        let temple_review_comment_status = editCommentData.temple_review_comment_status;
        if (temple_review_comment_status == 0 || temple_review_comment_status == 2) {
            temple_review_comment_status = 1
        }
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleReviewCommentByTempleReviewCommentId`,
            data: {
                "temple_review_comment_id": editCommentData.temple_review_comment_id,
                "temple_review_comment_status": temple_review_comment_status,
            },
        });
        setApproveCommentDialog(false)
        setOpenSnackbar({ status: true, type: "success", msg: "อนุมัติคอมเมนต์สำเร็จ" });
        getAllReviewCommentData()
    }

    const handleOpenCommentDetail = (rowData) => {
        setOpen(true);
        setCommentDialog(rowData)
    };

    const handleCloseCommentDetail = () => {
        setOpen(false);
    };

    const getAllReviewCommentData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleReviewComment`,
            data: {},
        });

        res.data.map((item) => {
            item.fullname =
                item.user_firstname + " " + item.user_lastname

            item.filter_status =
                item.temple_review_comment_status === 0 ? 'รออนุมัติ'
                    : item.temple_review_comment_status === 1 ? 'อนุมัติแล้ว'
                        : item.temple_review_comment_status === 2 ? 'รออนุมัติแก้ไข'
                            : ''
        })
        setAllReviewCommentData(res.data)
    }


    const handleDeleteTempleReviewComment = async (rowData) => {
        setDeleteTempleReviewCommentDialog(true);
        setDeleteTempleReviewCommentData(rowData)
    }

    const deleteReviewComment = async (temple_review_comment_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleReviewCommentByTempleReviewCommentId`,
            data: { temple_review_comment_id: temple_review_comment_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "ลบคอมเมนต์สำเร็จ" });
        setDeleteTempleReviewCommentDialog(false);
        getAllReviewCommentData()
    }

    useEffect(() => {
        getAllReviewCommentData()
    }, [])

    return <>
        <LayoutSuperAdmin>

            <Box justify="center" sx={{ p: { md: '20px' } }} >
                <MUIDataTable
                    title={"ตารางจัดการคอมเมนต์"}
                    data={allReviewCommentData}
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
                            name: "temple_review_comment_id",
                            label: "ลำดับ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    return (<div>{dataIndex + 1}</div>)
                                }
                            },
                        },
                        {
                            name: "temple_review_topic",
                            label: "ชื่อรีวิวที่คอมเมนต์",
                        },
                        {
                            name: "temple_name",
                            label: "ชื่อวัดที่คอมเมนต์/รีวิว",
                        },
                        {
                            name: "temple_review_topic",
                            label: "ชื่อรีวิวที่คอมเมนต์",
                        },
                        {
                            name: "temple_review_comment_detail",
                            label: "รายละเอียดคอมเมนต์",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewCommentData[dataIndex];
                                    return (
                                        <TruncateMarkup
                                            lines={2}
                                            ellipsis={
                                                <span>
                                                    ...
                                                    {
                                                        <IconButton
                                                            style={{ padding: '0px', marginLeft: '5px' }}
                                                            onClick={() => handleOpenCommentDetail(rowData)}
                                                            size="large">
                                                            <Visibility color='gray' />
                                                        </IconButton>
                                                    }
                                                </span>
                                            }
                                        >
                                            <div>
                                                {rowData.temple_review_comment_detail}
                                            </div>
                                        </TruncateMarkup>
                                    );
                                }
                            }
                        },
                        {
                            name: "fullname",
                            label: "ผู้คอมเมนต์",
                        },
                        {
                            name: "temple_review_comment_time",
                            label: "วันที่คอมเมนต์",
                        },
                        {
                            name: "filter_status",
                            label: "สถานะ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allReviewCommentData[dataIndex];
                                    return <>
                                        <Chip
                                            label={rowData.filter_status}
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    rowData.temple_review_comment_status === 0 ? '#EC7063'
                                                        : rowData.temple_review_comment_status === 1 ? '#58D68D'
                                                            : rowData.temple_review_comment_status === 2 ? '#ffca28'
                                                                : ''
                                                ,
                                                color: 'white',
                                            }}
                                        />
                                        {
                                            rowData.temple_review_comment_status == 0 || rowData.temple_review_comment_status == 2 ?
                                                <IconButton
                                                    onClick={() => {
                                                        handleApproveComment(rowData)
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
                                    let rowData = allReviewCommentData[dataIndex];
                                    return <>
                                        <IconButton
                                            onClick={() => {
                                                handleDeleteTempleReviewComment(rowData)
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
                onClose={handleCloseCommentDetail}
                maxWidth='lg'
            >
                <DialogTitle >รายละเอียดคอมเมนต์</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <p style={{ textIndent: '2.5em', color: 'black' }}>
                            {commentDialog.temple_review_comment_detail}
                        </p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" onClick={handleCloseCommentDetail} color="primary" autoFocus>
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={approveCommentDialog}
                onClose={() => { setApproveCommentDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ยืนยันการอนุมัติ</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการอนุมัติรายการนี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setApproveCommentDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px" }}
                        color="save"
                        onClick={() => {
                            approveComment(editCommentData.temple_review_comment_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteTempleReviewCommentDialog}
                onClose={() => { setDeleteTempleReviewCommentDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบคอมเมนต์</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องลบคอมเมนต์นี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleReviewCommentDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteReviewComment(deleteTempleReviewCommentData.temple_review_comment_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>
        </LayoutSuperAdmin>
    </>;
}

export default ManageComment
