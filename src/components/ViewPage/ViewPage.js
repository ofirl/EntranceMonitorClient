import React, { useState, useEffect } from 'react';

import { postData, SERVER_BASE_URL } from '../../utils/network';

import ReactTable from "react-table";
import "react-table/react-table.css";

import {
    Link
} from "react-router-dom";

const ViewPage = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!data) {
                let response = await postData(`${SERVER_BASE_URL}/allGuests`);
                setData(response.results);
            }
        };
        fetchData();
    });

    return (
        <div>
            {
                data ?
                    <React.Fragment>
                        <Link to="/client/"> Add Guest </Link> <br />
                        <Link to="/client/viewExpected"> Expected </Link> <br />
                        {/* <Link to="/extras"> Unexpected Guests </Link> <br/> */}

                        <br />

                        <div>
                            Total Guests: {data.length}
                        </div>

                        <ReactTable
                            data={data}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]).includes(filter.value)}
                            columns={[
                                {
                                    Header: "DB Info",
                                    columns: [
                                        {
                                            Header: "ID",
                                            accessor: "id"
                                        },
                                    ]
                                },
                                {
                                    Header: "Guest Info",
                                    columns: [
                                        {
                                            Header: "Personal Number",
                                            accessor: "guest_id",
                                            filterMethod: (filter, row) =>
                                                row[filter.id].startsWith(filter.value)
                                        },
                                        {
                                            Header: "Name",
                                            accessor: "guest_name"
                                        },
                                        {
                                            Header: "Rank",
                                            accessor: "rank"
                                        },
                                        {
                                            Header: "Unit",
                                            accessor: "unit"
                                        },
                                    ]
                                },
                                {
                                    Header: "Arrival Info",
                                    columns: [
                                        {
                                            Header: "Arrival Time",
                                            accessor: "arrival_time",
                                            Cell: row => (
                                                <span>
                                                    {
                                                        row.value ? new Date(row.value).toLocaleTimeString()
                                                            : null
                                                    }
                                                </span>
                                            )
                                        },
                                    ]
                                },
                            ]}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </React.Fragment>
                    : null
            }
        </div>
    );
};

export default ViewPage;