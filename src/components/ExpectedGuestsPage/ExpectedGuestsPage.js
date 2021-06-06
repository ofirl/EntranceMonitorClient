import React, { useState, useEffect } from 'react';

import { postData, SERVER_BASE_URL } from '../../utils/network';

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
                let response = await postData(`${SERVER_BASE_URL}/allExpectedGuests`);
                setExpected(response.results);
            }
        };
        fetchData();
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!currentGuests) {
                let response = await postData(`${SERVER_BASE_URL}/allGuests`);
                setCurrentGuests(response.results);
            }
        };
        fetchData();
    });

    let temp;
    if (expected && currentGuests && !data) {
        let currentData = expected.map((g) => {
            return {
                ...g,
                arrived: currentGuests.some((cg) => cg['guest_id'] === g['guest_id']),
                arrival_time: (temp = currentGuests.find((cg) => g.guest_id === cg.guest_id)) != null ? temp.arrival_time : null,
            };
        });

        setData(currentData);
    }

    return (
        <div>
            {
                data ?
                    <React.Fragment>
                        <Link to="/client/"> Add Guest </Link> <br />
                        <Link to="/client/viewGuests"> View Guests </Link> <br />
                        {/* <Link to="/extras"> Unexpected Guests </Link> <br /> */}

                        <br />

                        <div>
                            Total Guests: {data.filter((g) => g.arrived).length} / {data.length}
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
                                                String(row[filter.id]).startsWith(filter.value)
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
                                        {
                                            Header: "Arrived",
                                            accessor: "arrival_time",
                                            Cell: row => (
                                                <span>
                                                    <span style={{
                                                        color: row.value ? '#57d500'
                                                            : '#ff2e00',
                                                    }}>
                                                        &#x25cf;
                                                  </span> {
                                                        row.value ? 'Yes ' + new Date(row.value).toLocaleTimeString()
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