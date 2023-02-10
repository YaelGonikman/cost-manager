import React, { useState, useEffect, Fragment } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, MenuItem, Card } from "@mui/material";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { fetchData, setData } from "../core/localStorage";
import ReportsDialog from "./ReportsDialog";

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
            const storedCosts = await fetchData("costs");
            if (storedCosts) {
                setCosts(JSON.parse(storedCosts));
            }
        }
        getItem()
    }, []);

    // Save costs data to local storage when it updates
    useEffect(() => {
        async function setItem() {
            await setData("costs", JSON.stringify(costs));
        }
        setItem()
    }, [costs]);

    // Function for adding a new cost item
    const addCost = (event) => {
        event.preventDefault();
        const form = event.target;
        const cost = {
            name: form.elements.name.value,
            cost: form.elements.cost.value,
            category: form.elements.category.value,
            description: form.elements.description.value,
            createdAt: new Date(Date.now()),
            isEdit: false
        };
        setCosts([...costs, cost]);
        form.reset();
    };

    // Function for deleting a cost item
    const deleteCost = (index) => {
        setCosts(costs.filter((_, i) => i !== index));
    };

    // Function for editing a cost item
    const editCost = (index) => {
        setCosts(costs.map((cost, i) => (i === index ? { ...cost, isEdit: !cost.isEdit } : cost)));
    };

    const handleChange = (index, name, event) => {
        setCosts(costs.map((cost, i) => (i === index ? { ...cost, [name]: event.target.value } : cost)));
    }

    const rowByStatus = (index, costs, prop, type) => {
        if (costs[index].isEdit) {
            const label = `Edit ${prop}`
            return <TextField
                id="outlined-read-only-input"
                value={costs[index][prop]}
                onChange={(e) => handleChange(index, prop, e)}
                type={type}
                label={label}
            />
        } else {
            return <TextField
                id="outlined-read-only-input"
                value={costs[index][prop]}
                label="Read Only"
                type={type}
                InputProps={{
                    readOnly: true,
                }}
            />
        }
    }

    const categoryByStatus = (index, costs) => {
        if (costs[index].isEdit) {
            return <TextField
                label="Edit Category"
                variant="outlined"
                margin="normal"
                id="category"
                name="category"
                style={{ margin: "10px" }}
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
                id="outlined-read-only-input"
                value={costs[index]['category']}
                label="Read Only"
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

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    return (
        <Fragment >
            <div style={{ position: 'fixed', height: '100px', width: '100%' }}>
                <h1 style={{ margin: 10, position: 'fixed' }}>
                    Costs Manager
                </h1>
                <Button
                    style={{ margin: 10, marginTop: 70, position: 'fixed' }}
                    variant="outlined"
                    onClick={() => setRerortsDialogOpen(true)}>
                    Reports
                </Button>
            </div>
            <Card className="App" style={{ margin: 20, padding: 10, overflow: 'auto', position: 'relative', marginTop: '130px' }}>
                <ReportsDialog
                    open={rerortsDialogOpen}
                    onClose={() => setRerortsDialogOpen(false)}
                    costs={costs}
                    categories={categories}
                    HtmlTooltip={HtmlTooltip}
                />
                <div style={{ position: 'relative' }}>
                    <form onSubmit={addCost} >
                        <div>
                            <TextField
                                label="Name"
                                variant="outlined"
                                margin="normal"
                                id="name"
                                name="name"
                                style={{ margin: "10px" }}
                            />
                            <TextField
                                label="Cost"
                                variant="outlined"
                                margin="normal"
                                type="number"
                                id="cost"
                                name="cost"
                                style={{ margin: "10px" }}
                            />
                            <TextField
                                label="Category"
                                variant="outlined"
                                margin="normal"
                                id="category"
                                name="category"
                                style={{ margin: "10px" }}
                                select
                                defaultValue="other"
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button variant="contained" color="primary" type="submit" style={{ margin: "20px" }}>
                                Add Cost
                            </Button>
                        </div>
                        <div>
                            <TextField
                                label="Description"
                                variant="outlined"
                                margin="normal"
                                id="description"
                                name="description"
                                style={{ margin: "10px", width: 630 }}
                            />
                        </div>
                    </form>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {costs.map((cost, index) => (
                                <HtmlTooltip key={index}
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">Description</Typography>
                                            {costs[index]['description']}
                                        </React.Fragment>
                                    }
                                >
                                    <TableRow key={index}>
                                        <TableCell style={{width: '200px'}}>
                                            {rowByStatus(index, costs, "name")}
                                        </TableCell>
                                        <TableCell style={{width: '200px'}}>
                                            {rowByStatus(index, costs, "cost", "number")}
                                        </TableCell>
                                        <TableCell style={{width: '200px'}}>
                                            {categoryByStatus(index, costs)}
                                        </TableCell>
                                        <TableCell >
                                            <Button onClick={() => deleteCost(index)}>Delete</Button>
                                            <Button onClick={() => editCost(index, cost)}>{costs[index].isEdit ? 'Save' : 'Edit'}</Button>
                                        </TableCell>
                                    </TableRow>
                                </HtmlTooltip>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </Fragment>
    );
}

export default Products;