const sql = require("mssql/msnodesqlv8");

const config = {
    user: "sa",
    password: "0123456789",
    server: "DESKTOP-EJGUUU4\\SQLEXPRESS",
    database: "print",
    driver: "msnodesqlv8",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Query ของแต่ละปี
const yearlyQuery = `
    SELECT YEAR(Request.deliveryDate) AS Year, 
    SUM(QuotaPrint.black_white) AS TotalBlackWhite, 
    SUM(QuotaPrint.color) AS TotalColor
    FROM QuotaPrint
    INNER JOIN Request ON Request.requestID = QuotaPrint.requestID
    GROUP BY YEAR(Request.deliveryDate)
    ORDER BY Year
`;

// Query ของแต่ละคน
const yearlyByRequesterQuery = `
    SELECT 
    r.requestNo AS requestNo,
    r.requestName AS requestName,
    qp.black_white AS totalBlackWhite,
    qp.color AS totalColor,
    (qp.black_white + qp.color) AS sumAll,
    r.requester AS requester,
    r.divisionName AS divisionName,
    r.deliveryDate AS deliveryDate,
    r.requestDateStart AS dateStart,
    r.requestDateEnd AS dateEnd,
    r.ownerJob AS ownerJob,
    rs.requestStatus AS requestStatus,
    YEAR(r.deliveryDate) AS Year
FROM 
    QuotaPrint qp
INNER JOIN 
    Request r ON r.requestID = qp.requestID
INNER JOIN 
    RequestStatus rs ON rs.requestStatusID = r.requestStatusID
GROUP BY 
    r.requestNo, 
    r.requestName, 
    qp.black_white, 
    qp.color,  
    r.requester, 
    r.divisionName, 
    r.deliveryDate, 
    r.requestDateStart, 
    r.requestDateEnd, 
    r.ownerJob, 
    rs.requestStatus;
`;
// ORDER BY Year DESC, Requester

async function connectAndQuery(query) {
    let pool;
    try {
        pool = await sql.connect(config);
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    } finally {
        if (pool) {
            pool.close();
        }
    }
} 

module.exports.connectAndQuery = connectAndQuery;
module.exports.yearlyQuery = yearlyQuery;
module.exports.yearlyByRequesterQuery = yearlyByRequesterQuery;
