import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import JournalEntryForm from './JournalEntryForm';
import AccountBalanceList from './AccountBalanceList';
import AccountingReport from './AccountingReport';

const AccountingDashboard = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const response = await fetch('/api/accounting/report?range=WEEKLY');
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('보고서 조회 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* 회계 보고서 */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>
                            주간 회계 보고서
                        </Typography>
                        <AccountingReport data={reportData} />
                    </Paper>
                </Grid>

                {/* 분개 입력 폼 */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>
                            분개 입력
                        </Typography>
                        <JournalEntryForm onSubmit={fetchReport} />
                    </Paper>
                </Grid>

                {/* 계정 잔액 목록 */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>
                            계정 잔액
                        </Typography>
                        <AccountBalanceList />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AccountingDashboard; 