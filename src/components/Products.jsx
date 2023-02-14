import React, { useState, useEffect, Fragment } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, MenuItem, Card } from '@mui/material';
import { fetchData, setData } from '../core/localStorage';
import ReportsDialog from './ReportsDialog';
import { Store } from 'react-notifications-component';

function Products() {
    // Initialize state for storing costs data
    const [costs, setCosts] = useState([]);
    const [rerortsDialogOpen, setRerortsDialogOpen] = useState(false);

    const categories = [
        {
            value: 'groceries',
            label: 'Groceries',
        },
        {
            value: 'personal_care',
            label: 'Personal Care',
        },
        {
            value: 'beverages',
            label: 'Beverages',
        },
        {
            value: 'frozen_foods',
            label: 'Frozen Foods',
        },
        {
            value: 'dairy_products',
            label: 'Dairy Products',
        },
        {
            value: 'meat_and_seafood',
            label: 'Meat and Seafood',
        },
        {
            value: 'fresh_produce',
            label: 'Fresh Produce',
        },
        {
            value: 'household_items',
            label: 'Household Items',
        },
        {
            value: 'other',
            label: 'Other',
        },
    ];


    // Fetch costs data from local storage when the component mounts
    useEffect(() => {
        async function getItem() {
            const storedCosts = await fetchData('costs');
            if (storedCosts) {
                setCosts(JSON.parse(storedCosts));
            }
        }
        getItem()
    }, []);

    // Save costs data to local storage when it updates
    useEffect(() => {
        async function setItem() {
            await setData('costs', JSON.stringify(costs));
        }
        setItem()
    }, [costs.length]);

    const notifyEmptyValue = (valueNames) => {
        Store.addNotification({
            title: 'Error',
            message: `value of ${valueNames.toString()} is missing`,
            type: 'danger',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    }

    // Check if empty value
    const isEmpty = (value) => {
        return value.trim().length === 0
    }

    // Validate form values
    const validateForm = (form) => {
        let missingValues = []
        if (isEmpty(form.elements.name.value)) {
            missingValues.push('name')
        }
        if (isEmpty(form.elements.cost.value)) {
            missingValues.push('cost')
        }
        if (isEmpty(form.elements.description.value)) {
            missingValues.push('description')
        }
        if (missingValues.length) {
            notifyEmptyValue(missingValues)
            return false
        }
        return true
    }

    // Function for adding a new cost item
    const addCost = (event) => {
        event.preventDefault();

        const form = event.target;

        if (validateForm(form)) {
            const cost = {
                name: form.elements.name.value,
                cost: form.elements.cost.value,
                category: form.elements.category.value,
                description: form.elements.description.value,
                createdAt: new Date(),
                isEdit: false
            };
            setCosts([...costs, cost]);
            form.reset();

            Store.addNotification({
                title: 'Product added succesfully!',
                type: 'success',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 2000,
                    onScreen: true
                }
            });
        }
    };

    // Function for deleting a cost item
    const deleteCost = (index) => {
        setCosts(costs.filter((_, i) => i !== index));
        Store.addNotification({
            title: 'Product removed succesfully!',
            type: 'info',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    };

    // Function for editing a cost item
    const editCost = async(index) => {
        if (costs[index].isEdit) {
            Store.addNotification({
                title: 'Product edited succesfully!',
                type: 'info',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 2000,
                    onScreen: true
                }
            });

            await setData('costs', JSON.stringify(costs));
        }

        setCosts(costs.map((cost, i) => (i === index ? { ...cost, isEdit: !cost.isEdit } : cost)));
    };

    const handleChange = (index, name, event) => {
        setCosts(costs.map((cost, i) => (i === index ? { ...cost, [name]: event.target.value } : cost)));
    }

    const rowByStatus = (index, costs, prop, type) => {
        if (costs[index].isEdit) {
            const label = `Edit ${prop}`
            return <TextField
                id='outlined-read-only-input'
                value={costs[index][prop]}
                onChange={(e) => handleChange(index, prop, e)}
                type={type}
                label={label}
                multiline
            />
        } else {
            return <TextField
                id='outlined-read-only-input'
                value={costs[index][prop]}
                type={type}
                InputProps={{
                    readOnly: true,
                }}
                multiline
            />
        }
    }

    const categoryByStatus = (index, costs) => {
        if (costs[index].isEdit) {
            return <TextField
                label='Edit Category'
                variant='outlined'
                margin='normal'
                id='category'
                name='category'
                style={{ margin: '10px' }}
                select
                value={costs[index]['category']}
                onChange={(e) => handleChange(index, 'category', e)}
            >
                {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        } else {
            return <TextField
                id='outlined-read-only-input'
                value={costs[index]['category']}
                select
                InputProps={{
                    readOnly: true,
                }}
            >
                {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        }
    }

    const renderTable = () => {
        if (costs.length) {
            return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {costs.map((cost, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '200px' }}>
                                    {rowByStatus(index, costs, 'name')}
                                </TableCell>
                                <TableCell style={{ width: '200px' }}>
                                    {rowByStatus(index, costs, 'cost', 'number')}
                                </TableCell>
                                <TableCell style={{ width: '120px' }}>
                                    {categoryByStatus(index, costs)}
                                </TableCell>
                                <TableCell style={{ width: '200px' }}>
                                    {rowByStatus(index, costs, 'description', 'text')}
                                </TableCell>
                                <TableCell >
                                    <Button style={{margin:'2px'}} variant='contained' color='error' onClick={() => deleteCost(index)}>Delete</Button>
                                    <Button style={{margin:'2px'}} variant='contained' color='success' onClick={() => editCost(index, cost)}>{costs[index].isEdit ? 'Save' : 'Edit'}</Button>
                                </TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        } else {
            return <h2 style={{display: 'flex', justifyContent:'center'}}>
                No Products
            </h2>
        }
    }

    return (
        <div >
            <div style={{ position: 'fixed', height: '100px', width: '100%' }}>
                <Button
                    style={{ margin: 10, position: 'fixed' }}
                    variant='outlined'
                    onClick={() => setRerortsDialogOpen(true)}>
                    Reports
                </Button>
                <h1 style={{ margin: 10, marginTop: 50, position: 'fixed' }}>
                    Costs Manager
                </h1>
            </div>
            <Box sx={{ boxShadow: 3 }} className='App' style={{ margin: 20, padding: 10, overflow: 'auto', position: 'relative', marginTop: '130px', width: '1100px' }}>
                <ReportsDialog
                    open={rerortsDialogOpen}
                    onClose={() => setRerortsDialogOpen(false)}
                    costs={costs}
                    categories={categories}
                />
                <div style={{ position: 'relative', display:'flex', justifyContent:'center' }}>
                    <form onSubmit={addCost} >
                        <div>
                            <TextField
                                label='Name'
                                variant='outlined'
                                margin='normal'
                                id='name'
                                name='name'
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                label='Cost'
                                variant='outlined'
                                margin='normal'
                                type='number'
                                id='cost'
                                name='cost'
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                label='Category'
                                variant='outlined'
                                margin='normal'
                                id='category'
                                name='category'
                                style={{ margin: '10px' }}
                                select
                                defaultValue='other'
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button variant='contained' color='success' type='submit' style={{ margin: '20px' }}>
                                Add Cost
                            </Button>
                        </div>
                        <div>
                            <TextField
                                label='Description'
                                variant='outlined'
                                margin='normal'
                                id='description'
                                name='description'
                                style={{ margin: '10px', width: 655 }}
                            />
                        </div>
                    </form>
                </div>
                {renderTable()}

            </Box>
        </div >
    );
}

export default Products;