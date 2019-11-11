import React, { useState, useEffect } from 'react';

import { postData } from '../../utils/network';

import ReactTable from "react-table";
import "react-table/react-table.css";

import {
    Link
} from "react-router-dom";

const ViewExpectedPage = () => {
    const [data, setData] = useState(null);
    const [expected, setExpected] = useState(null);
    const [currentGuests, setCurrentGuests] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!expected) {
                let response = await postData('https://entrance-monitor-server.herokuapp.com/allExpectedGuests');
                setExpected(response.results);
            }
        };
        fetchData();
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!currentGuests) {
                let response = await postData('https://entrance-monitor-server.herokuapp.com/allGuests');
                setCurrentGuests(response.results);
            }
        };
        fetchData();
    });

    if (expected && currentGuests && !data) {
        let currentData = expected.map((g) => {
            return { ...g, arrived: currentGuests.some((cg) => cg['guest_id'] === g['guest_id']) };
        });

        setData(currentData);
    }

    return (
        <div>
            {
                data ?
                    <React.Fragment>
                        <Link to="/"> Add Guest </Link> <br />
                        <Link to="/viewGuests"> View Guests </Link> <br />
                        {/* <Link to="/extras"> Unexpected Guests </Link> <br /> */}

                        <br />

                        <div>
                            Total Guests: {data.filter( (g) => g.arrived).length} / {data.length}
                        </div>

                        <ReactTable
                            data={data}
                            filterable
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
                                            accessor: "guest_id"
                                        },
                                        {
                                            Header: "Name",
                                            accessor: "guest_name"
                                        },
                                        {
                                            Header: "Arrived",
                                            accessor: "arrived",
                                            Cell: row => (
                                                <span>
                                                    <span style={{
                                                        color: row.value ? '#57d500'
                                                                : '#ff2e00',
                                                    }}>
                                                        &#x25cf;
                                                  </span> {
                                                        row.value ? 'Yes'
                                                                : 'No'
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

export default ViewExpectedPage;