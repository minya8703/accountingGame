import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(number);
};

const AccountBalanceList = () => {
    const [accounts, setAccounts] = useState([]);
    const [balances, setBalances] = useState({});
    const [selectedType, setSelectedType] = useState('ASSET');

    useEffect(() => {
        fetchAccounts();
    }, [selectedType]);

    useEffect(() => {
        if (accounts.length > 0) {
            fetchBalances();
        }
    }, [accounts]);

    const fetchAccounts = async () => {
        try {
            const response = await fetch(`/api/accounting/accounts/${selectedType}`);
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('계정 목록 조회 중 오류 발생:', error);
        }
    };

    const fetchBalances = async () => {
        const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        
        const newBalances = {};
        
        for (const account of accounts) {
            try {
                const response = await fetch(
                    `/api/accounting/accounts/${account.id}/balance?startDate=${startDate}&endDate=${endDate}`
                );
                const balance = await response.json();
                newBalances[account.id] = balance;
            } catch (error) {
                console.error(`${account.name} 잔액 조회 중 오류 발생:`, error);
            }
        }
        
        setBalances(newBalances);
    };

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>계정 유형</InputLabel>
                <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <MenuItem value="ASSET">자산</MenuItem>
                    <MenuItem value="LIABILITY">부채</MenuItem>
                    <MenuItem value="EQUITY">자본</MenuItem>
                    <MenuItem value="REVENUE">수익</MenuItem>
                    <MenuItem value="EXPENSE">비용</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {format(new Date(), 'yyyy년 MM월', { locale: ko })} 잔액
            </Typography>
            
            <List>
                {accounts.map((account, index) => (
                    <React.Fragment key={account.id}>
                        <ListItem>
                            <ListItemText
                                primary={account.name}
                                secondary={formatNumber(balances[account.id] || 0)}
                            />
                        </ListItem>
                        {index < accounts.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default AccountBalanceList; 