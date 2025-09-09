import React from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';

import 'react-data-table-component-extensions/dist/index.css';

// import { DataTableExtensions, print } from 'react-data-table-component'

export default function ReactDatatable({ columns, tableData, loading, totalRows, handlePerRowsChange, handlePageChange }) {

    // console.log("totalRows",totalRows);
    columns?.map((column, index) => {
        column.id = index + 1;
        column.responsive = true;
        // column.wrap= true;
        column.maxWidth = "680px";
        if (column.name != 'Status' && column.name != 'Action' && column.name != 'Image') {
            column.export = true;
            column.print = true;
            column.sortable = true;
        } else {
            column.export = false;
            column.print = false;
            column.sortable = false;
        }
    })

    const customStyles = {
        headRow: {
            style: {
                border: 'none',
                background: 'white',
                color: '#fff',
                fontFamily: 'Arial, sans-serif'
            },
        },
        headCells: {
            style: {
                color: 'gray',
                fontSize: '15px',
            },
        },
        rows: {
            style: {
                borderBottomColor: '#FFFFFF',
                borderRadius: '5px',
                outline: '1px solid #FFFFFF',
            },
            highlightOnHoverStyle: {
                backgroundColor: 'transparent',
            },
            even: {
                backgroundColor: 'red', // Change this to your desired color for even rows
            },
        },
        stripedRows: {
            // Define styles for striped rows
            style: {
                backgroundColor: '', // Example background color for striped rows
            },
        },
        pagination: {
            style: {
                border: 'none',
                marginTop: '12px',
            },
        },
        table: {
            style: {
                fontWeight: 600,
                marginTop: '12px',
                width: '100%', // Apply width 100% for the w-100 class
            },
            // Apply styles for additional classes
            classNames: {
                tableCentered: 'table-centered',
                tableStriped: 'table table-striped', // Add the class for striped rows here
                dtResponsive: 'dt-responsive',
                nowrap: 'nowrap',
            },

        },
        searchBar: {
            style: {
                // Customize search bar styles here
                fontSize: '14px',
                color: 'red', // Example color
                borderRadius: '5px', // Example border radius
                backgroundColor: '#f0f0f0', // Example background color
                padding: '8px 10px', // Example padding
            },
            // Apply styles for the search bar input
            inputStyle: {
                // Customize search bar input styles here
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '6px 8px',
            },
        },
    };

    return (
        <>
            <br />
            <DataTableExtensions columns={columns} data={tableData}>
                <DataTable columns={columns} data={tableData} highlightOnHover pagination
                    paginationServer
                    progressPending={loading}
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    customStyles={customStyles}
                />
            </DataTableExtensions>
        </>
    )

}
