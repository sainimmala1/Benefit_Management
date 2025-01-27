const { error } = require('console');
const db = require('../config/db');


//getall
const getBenefits = async(req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM benefits');
      if(!data){
        return res.status(404).send({ 
            success: false,
             message: "No Benefits Found" 
            });
      }
      res.status(200).send({ 
        success: true, 
        message: "All Benefits records",
        data,
     });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            sucess: false,
            message: "Error in Get all Benefits Api",
            error:err.message 
        });
    }
};

//specific
const getBenefitById = async(req,res) => {
  try{
      const benefitId = req.params.id;
      if(!benefitId){
          return res.status(400).send({
              success: false,
              message: 'Please provide benefit id',
          });
      }
      const data = await db.query(` SELECT * FROM benefits WHERE id = ?`, [benefitId]);
      if(!data){
          return res.status(404).send({
              success: false,
              message: 'Benefits not found',
          });
      }
      res.status(200).send({
          success: true,
          message: 'Benefit found',
          BenefitDetails: data[0],
      });
  }
  catch (error){
      console.error(error);
      res.status(500).send({
          success: false,
          message: 'Error in Get Benefit By ID API',
          error,
      });
  }
}

//postconst
const createBenefit = async (req, res) => {
  try {
    const { id, benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date } = req.body;

    if (!id || !benefit_name || !description || !eligibility_criteria || !coverage_amount || !start_date || !end_date) {
      return res.status(400).send({
        success: false,
        message: 'Please provide all fields',
      });
    }

    const query = `INSERT INTO benefits (id, benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date) VALUES (?,?,?,?,?,?,?)`;
    const values = [id, benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date];

    const [data] = await db.query(query, values);

    if (!data) {
      return res.status(400).send({
        success: false,
        message: 'Error in inserting Benefit',
      });
    }

    res.status(201).send({
      success: true,
      message: 'New benefit record created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in Create Benefit API',
      error,
    });
  }
};


//update
const updateBenefit = async (req, res) => {
  try {
    const benefitId = req.params.id;
    if (!benefitId) {
      return res.status(400).send({
        success: false,
        message: 'Please provide benefit id',
      });
    }

    const { benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date } = req.body;
    if (!benefit_name || !description || !eligibility_criteria || !coverage_amount || !start_date || !end_date) {
      return res.status(400).send({
        success: false,
        message: 'Please provide all fields',
      });
    }
    // Function to format date to 'YYYY-MM-DD'
    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    const formattedStartDate = formatDate(start_date);
    const formattedEndDate = formatDate(end_date);

    const query = `UPDATE benefits SET benefit_name = ?, description = ?, eligibility_criteria = ?, coverage_amount = ?, start_date = ?, end_date = ? WHERE id = ?`;
    const values = [benefit_name, description, eligibility_criteria, coverage_amount, formattedStartDate, formattedEndDate, benefitId];

    const [data] = await db.query(query, values);

    if (!data) {
      return res.status(400).send({
        success: false,
        message: 'Error in updating benefit',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Benefit record updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in Update Benefit API',
      error,
    });
  }
}

//delete
const deleteBenefit = async (req,res) => {
  try {
      const benefitId = req.params.id;
      if(! benefitId){
          return res.status(400).send({
              success: false,
              message: 'Please provide benefit id',
          });
      }
      const data = await db.query(`DELETE FROM benefits WHERE id = ?`, [benefitId]);
      
      res.status(200).send({
          success: true,
          message: 'Benefit record deleted successfully',
      });
  }
  catch (error) {
      console.error(error);
      res.status(500).send({
          success: false,
          message: 'Error in Delete Benefit API',
          error,
      });
  }
}


module.exports = { getBenefits ,getBenefitById,createBenefit,updateBenefit,deleteBenefit};