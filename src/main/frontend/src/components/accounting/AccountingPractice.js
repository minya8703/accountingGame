import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';
import axios from 'axios';

const AccountingPractice = () => {
    const [practice, setPractice] = useState(null);
    const [open, setOpen] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const fetchPractice = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/accounting/practice/random');
            setPractice(response.data);
            setShowAnswer(false);
        } catch (error) {
            console.error('회계 연습 문제를 불러오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchPractice();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleNext = () => {
        fetchPractice();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
                회계 연습 시작
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>회계 용어 및 분개 연습</DialogTitle>
                <DialogContent>
                    {practice && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                용어: {practice.term}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                정의: {practice.definition}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                예시: {practice.example}
                            </Typography>

                            {showAnswer ? (
                                <>
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                        정답:
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>계정과목</TableCell>
                                                    <TableCell>차변</TableCell>
                                                    <TableCell>대변</TableCell>
                                                    <TableCell>적요</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {practice.journalEntries.map((entry, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{entry.account}</TableCell>
                                                        <TableCell>{entry.debit}</TableCell>
                                                        <TableCell>{entry.credit}</TableCell>
                                                        <TableCell>{entry.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        설명: {practice.explanation}
                                    </Typography>
                                </>
                            ) : (
                                <Button variant="outlined" onClick={handleShowAnswer} sx={{ mt: 2 }}>
                                    정답 보기
                                </Button>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNext}>다음 문제</Button>
                    <Button onClick={handleClose}>닫기</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountingPractice; 