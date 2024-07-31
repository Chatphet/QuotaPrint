const express = require("express");
const cors = require("cors");
const app = express();
const { connectAndQuery } = require("./sql");
const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

app.use(cors());
const port = 5000;

app.get("/api/list", async function (req, res, next) {
    const year = req.query.year;
    const division = req.query.division;
    const user = req.query.user;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const status = req.query.status;
    const blackWhite = req.query.blackWhite;
    const color = req.query.color;
    
    console.log('Filters received:', { year, division, user, startDate, endDate, status, blackWhite, color });

    let sqlQuery = `SELECT r.*, qp.black_white AS blackWhite,
                            qp.color AS color, 
                            (qp.black_white + qp.color) AS sumRound,
                            SUM(qp.black_white + qp.color) OVER (PARTITION BY r.requester, YEAR(r.deliveryDate)) AS sumUserYear,
                            rs.requestStatus AS requestStatus,
                            rt.requestTypeName,
                            st.subjectTypeName,
                            p.priorityName,
                            YEAR(r.deliveryDate) AS year
                    FROM QuotaPrint qp
                    INNER JOIN Request r ON r.requestID = qp.requestID
                    INNER JOIN RequestType rt ON rt.requestTypeID = r.requestTypeID
                    INNER JOIN SubjectType st ON st.subjectTypeID = r.subjectTypeID
                    INNER JOIN RequestStatus rs ON rs.requestStatusID = r.requestStatusID
                    INNER JOIN Priority p ON p.priorityID = r.priorityID
                    WHERE 1=1`;

    let queryParams = [];
    
    if (year) {
        sqlQuery += ` AND YEAR(r.deliveryDate) = @year`;
        queryParams.push({ name: 'year', type: sql.Int, value: parseInt(year) });
    }

    if (division) {
        sqlQuery += ` AND LOWER(r.divisionName) = LOWER(@division)`;
        queryParams.push({ name: 'division', type: sql.NVarChar, value: division });
    }

    if (user) {
        sqlQuery += ` AND LOWER(r.requester) LIKE '%' + LOWER(@user) + '%'`;
        queryParams.push({ name: 'user', type: sql.NVarChar, value: user });
    }

    if (startDate) {
        sqlQuery += ` AND r.deliveryDate >= @startDate`;
        queryParams.push({ name: 'startDate', type: sql.Date, value: new Date(startDate) });
    }

    if (endDate) {
        sqlQuery += ` AND r.deliveryDate <= @endDate`;
        queryParams.push({ name: 'endDate', type: sql.Date, value: new Date(endDate) });
    }

    if (status) {
        sqlQuery += ` AND LOWER(rs.requestStatus) = LOWER(@status)`;
        queryParams.push({ name: 'status', type: sql.NVarChar, value: status });
    }

    if (blackWhite === 'true') {
        sqlQuery += ` AND qp.black_white > 0`;
    }

    if (color === 'true') {
        sqlQuery += ` AND qp.color > 0`;
    }

    try {
        const data = await connectAndQuery(sqlQuery, queryParams);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/sumYear", async function (req, res, next) {
    try {
        const data = await connectAndQuery(`SELECT YEAR(r.deliveryDate) AS year, 
                                                SUM(qp.black_white) AS totalBlackWhite, 
                                                SUM(qp.color) AS totalColor
                                            FROM
                                                QuotaPrint qp
                                            INNER JOIN
                                                Request r ON r.requestID = qp.requestID
                                            GROUP BY
                                                YEAR(r.deliveryDate)
                                            ORDER BY 
                                                Year;`);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/sumUser", async function (req, res, next) {
    try {
        const data = await connectAndQuery(`SELECT YEAR(r.deliveryDate) AS year, 
                                                r.requester ,
                                                SUM(qp.black_white + qp.color) AS sumUserYear
                                            FROM
                                                QuotaPrint qp
                                            INNER JOIN
                                                Request r ON r.requestID = qp.requestID
                                            GROUP BY
                                                r.requester, YEAR(r.deliveryDate)
                                            ORDER BY
                                                year DESC;`);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/division", async function (req, res, next) {
    try {
        const data = await connectAndQuery(`SELECT r.divisionName
                                            FROM 
                                                Request r
                                            INNER JOIN
	                                            QuotaPrint qp ON qp.requestID = r.requestID
                                            GROUP BY 
                                                r.divisionName
                                            ORDER BY   
                                                r.divisionName ASC;`);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/status", async function (req, res, next) {
    try {
        const data = await connectAndQuery(`SELECT rs.requestStatus
                                            FROM 
                                                RequestStatus rs
                                            GROUP BY 
                                                rs.requestStatus
                                            ORDER BY   
                                                rs.requestStatus ASC;`);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
