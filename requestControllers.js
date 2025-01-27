const db = require('../config/db');
const { error } = require('console');

//  new user request
 const showRequests = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM user_requests');
      if(!data){
        return res.status(404).send({ 
            success: false,
             message: "No Requests Found" 
            });
      }
      res.status(200).send({ 
        success: true, 
        message: "All Requests records",
        data,
     });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            sucess: false,
            message: "Error in Get all Requests Api",
            error:err.message 
        });
    }
 };
 const showRequestsbyid = async (req, res) => {
    try {
        const requestId = req.params.id;
        if (!requestId) {
            return res.status(400).send({
                success: false,
                message: 'Please provide request id',
            });
        }

       
        const query = 'SELECT * FROM user_requests WHERE id = ?';
        const [rows] = await db.query(query, [requestId]);

        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Request not found',
            });
        }

        return res.status(200).send({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        console.error('Error fetching request by ID:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
        });
    }
};


 const createRequest = async (req, res) => {
    const {
        email, action, benefit_id, benefit_name, benefit_description, 
        eligibility_criteria, coverage_amount, start_date, end_date, 
        status, created_at, info
    } = req.body;

   
    if (!email || !action || !benefit_id || !benefit_name || !benefit_description || 
        !eligibility_criteria || !coverage_amount || !start_date || !end_date || 
        !status || !created_at || !info) {
        return res.status(400).send({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    try {
        // Insert all the fields into the database
        const [result] = await db.query(
            `INSERT INTO user_requests 
            (email, action, benefit_id, benefit_name, benefit_description, 
            eligibility_criteria, coverage_amount, start_date, end_date, 
            status, created_at, info) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                email, action, benefit_id, benefit_name, benefit_description, 
                eligibility_criteria, coverage_amount, start_date, end_date, 
                status, created_at, info
            ]
        );

        res.status(201).send({
            success: true,
            message: 'Request created successfully',
            data: {
                id: result.insertId,
                email,
                action,
                benefit_id,
                benefit_name,
                benefit_description,
                eligibility_criteria,
                coverage_amount,
                start_date,
                end_date,
                status,
                created_at,
                info,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating request',
            error: error.message,
        });
    }
};

    
 const deleteRequest = async (req, res) => {
    const requestId = req.params.id;
    if (!requestId) {
        return res.status(400).send({
            success: false,
            message: 'Please provide request id',
        });
    }
    try {
        const [data] = await db.query('DELETE FROM user_requests WHERE id = ?', [requestId]);
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Request not found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Request deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting request',
            error: error.message,
        });
    }
 };


 const updateRequest = async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;

   
    if (!requestId || !status) {
        return res.status(400).send({
            success: false,
            message: 'Request ID and status are required',
        });
    }

    const validStatuses = ['pending', 'approved', 'denied'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({
            success: false,
            message: 'Invalid status value',
        });
    }

    try {
        // Update the request status
        const updateQuery = 'UPDATE user_requests SET status = ? WHERE id = ?';
        await db.query(updateQuery, [status, requestId]);

        res.status(200).send({
            success: true,
            message: 'Request status updated successfully',
        });
    } catch (error) {
        console.error('Error updating request status:', error.message);
        res.status(500).send({
            success: false,
            message: 'Error updating request status',
            error: error.message,
        });
    }
};

 module.exports = { showRequests, showRequestsbyid, createRequest, deleteRequest ,updateRequest };