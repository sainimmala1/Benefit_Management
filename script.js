let benefits = [];
document.addEventListener('DOMContentLoaded', fetchBenefits);

function fetchBenefits() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); 

    if(role==='admin'){
        document.getElementById('userside').style.display = 'none';
        document.getElementById('userpara').style.display = 'none';
        document.getElementById('adminside').style.display = 'block';
        document.getElementById('adminpara').style.display = 'block';
        document.getElementById('requestpara').style.display = 'block';
        document.getElementById('requestsTable').style.display = 'block';
        document.getElementById('requests-heading').style.display = 'block';

        fetch('http://localhost:3000/api/v1/user-requests/show',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => {
            const requestsTable = document.getElementById('requestsTable').querySelector('tbody');
            requestsTable.innerHTML = '';

            const data = responseData.data;
            if (data && data.length > 0) {
                data.forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    
                        <td>${request.email}</td>
                        <td>${request.action}</td>
                        <td>${request.benefit_id}</td>
                        <td>${request.benefit_name}</td>
                        <td>${request.benefit_description}</td>
                        <td>${request.eligibility_criteria}</td>
                        <td>${request.coverage_amount}</td>
                        <td>${formatDate(request.start_date)}</td>
                        <td>${formatDate(request.end_date)}</td>
                        <td>${request.status}</td>
                        <td>${formatDate(request.created_at)}</td>
                        <td>${request.info}</td>
                        <td>
                            <span> <button onclick="approveRequest(${request.id})">Approve</button><br>
                             <button onclick="deny(${request.id})">Deny</button>
                            <button onclick="Remove(${request.id})">Remove</button></span>
                        </td>
                    `;
                    requestsTable.appendChild(row);
                });
            } else {
                requestsTable.innerHTML = '<tr><td colspan="8">No requests found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching requests:', error);
        });
    }


    fetch('http://localhost:3000/api/v1/benefits/getall',{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(responseData => {
        const benefitsTable = document.getElementById('benefitsTable').querySelector('tbody');
        benefitsTable.innerHTML = '';

        const data = responseData.data;
        if (data && data.length > 0) {
            benefits = data;

            data.forEach(benefit => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${benefit.id}</td>
                    <td>${benefit.benefit_name}</td>
                    <td>${benefit.description}</td>
                    <td>${benefit.eligibility_criteria}</td>
                    <td>${benefit.coverage_amount}</td>
                    <td>${formatDate(benefit.start_date)}</td>
                    <td>${formatDate(benefit.end_date)}</td>
                    <td>
                        <button onclick="handleAction(${benefit.id}, 'update')">Update</button>
                        <button onclick="handleAction(${benefit.id}, 'delete')">Delete</button>
                    </td>
                `;
                benefitsTable.appendChild(row);
            });
        } else {
            benefitsTable.innerHTML = '<tr><td colspan="8">No benefits found</td></tr>';
        }


    })
    .catch(error => {
        console.error('Error fetching benefits:', error);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function handleAction(id, action) {
    const role = localStorage.getItem('role');

    if (role === 'admin') {
        if (action === 'update') {
            updateBenefit(id);
        } else if (action === 'delete') {
            deleteBenefit(id);
        }
    } else {
        // For non-admin users, show the request form
        document.getElementById('userEmail').value = localStorage.getItem('email');
        document.getElementById('requestAction').value = action;
        document.getElementById('requestBenefitId').value = id;
        document.getElementById('requestBenefitName').value = benefits.find(b => b.id === id).benefit_name;
        document.getElementById('requestDescription').value = benefits.find(b => b.id === id).description;
        document.getElementById('requestEligibilityCriteria').value = benefits.find(b => b.id === id).eligibility_criteria;
        document.getElementById('requestCoverageAmount').value = benefits.find(b => b.id === id).coverage_amount;
        document.getElementById('requestStartDate').value = formatDate(benefits.find(b => b.id === id).start_date);
        document.getElementById('requestEndDate').value = formatDate(benefits.find(b => b.id === id).end_date);
        document.getElementById('requestCreatedAt').value = new Date().toISOString().split('T')[0];

        document.getElementById('requestFormOverlay').style.display = 'flex';
    }
}

document.getElementById('requestForm').onsubmit = function(event) {
    event.preventDefault();
    const email = document.getElementById('userEmail').value;
    const action = document.getElementById('requestAction').value;
    const benefit_id = document.getElementById('requestBenefitId').value;
    const benefit_name = document.getElementById('requestBenefitName').value;
    const benefit_description = document.getElementById('requestDescription').value;
    const eligibility_criteria = document.getElementById('requestEligibilityCriteria').value;
    const coverage_amount = document.getElementById('requestCoverageAmount').value;
    const start_date = document.getElementById('requestStartDate').value;
    const end_date = document.getElementById('requestEndDate').value;
    const status = document.getElementById('requestStatus').value;
    const created_at = document.getElementById('requestCreatedAt').value;
    const info = document.getElementById('information').value;
    fetch('http://localhost:3000/api/v1/user-requests/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            email: email,
            action: action,
            benefit_id: benefit_id,
            benefit_name: benefit_name,
            benefit_description: benefit_description,
            eligibility_criteria: eligibility_criteria,
            coverage_amount: coverage_amount,
            start_date: start_date,
            end_date: end_date,
            status: status,
            created_at: created_at,
            info: info
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Request submitted to admin successfully!.');
            hideRequestForm();
        } else {
            alert('Failed to submit request.');
        }
    })
    .catch(error => {
        console.error('Error submitting request:', error);
    });
};

function hideRequestForm() {
    document.getElementById('requestFormOverlay').style.display = 'none';
}


function showAddBenefitForm() {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
        document.getElementById('userEmail').value = localStorage.getItem('email');
        document.getElementById('requestAction').value = 'add';
        document.getElementById('requestCreatedAt').value = new Date().toISOString().split('T')[0];
          
        document.getElementById('requestFormOverlay').style.display = 'flex';
     } else {
        document.getElementById('overlayAddBenefit').style.display = 'flex';
     }
}

function hideAddBenefitForm() {
    document.getElementById('overlayAddBenefit').style.display = 'none';
}



function submitNewBenefit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('benefitId').value.trim(); 
    const benefitName = document.getElementById('benefitName').value.trim();
    const description = document.getElementById('description').value.trim();
    const eligibilityCriteria = document.getElementById('eligibilityCriteria').value.trim();
    const coverageAmount = document.getElementById('coverageAmount').value.trim();
    const startDate = document.getElementById('startDate').value.trim();
    const endDate = document.getElementById('endDate').value.trim();

    if (id && benefitName && description && eligibilityCriteria && coverageAmount && startDate && endDate) {
        fetch('http://localhost:3000/api/v1/benefits/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,  
                benefit_name: benefitName,
                description: description,
                eligibility_criteria: eligibilityCriteria,
                coverage_amount: coverageAmount,
                start_date: startDate,
                end_date: endDate
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('#addBenefitForm form').reset();
                hideAddBenefitForm();
                fetchBenefits();
            } else {
                alert('Failed to add benefit. ' + (data.message || ''));
            }
        })
        .catch(error => {
            console.error('Error adding benefit:', error);
            alert('An error occurred while adding the benefit.');
        });
    } else {
        alert('All fields are required to add a new benefit.');
    }
}

function updateBenefit(id) {
    const benefit = benefits.find(b => b.id === id);
    if (benefit) {

        document.getElementById('updateBenefitId').value = benefit.id;
        document.getElementById('updateBenefitName').value = benefit.benefit_name;
        document.getElementById('updateDescription').value = benefit.description;
        document.getElementById('updateEligibilityCriteria').value = benefit.eligibility_criteria;
        document.getElementById('updateCoverageAmount').value = benefit.coverage_amount;
        document.getElementById('updateStartDate').value = formatDate(benefit.start_date);
        document.getElementById('updateEndDate').value = formatDate(benefit.end_date);
        document.getElementById('overlayUpdateBenefit').style.display = 'flex';
    } else {
        console.error('Benefit not found:', id);
    }
}

function submitUpdatedBenefit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('updateBenefitId').value.trim();
    const benefitName = document.getElementById('updateBenefitName').value.trim();
    const description = document.getElementById('updateDescription').value.trim();
    const eligibilityCriteria = document.getElementById('updateEligibilityCriteria').value.trim();
    const coverageAmount = document.getElementById('updateCoverageAmount').value.trim();
    const startDate = document.getElementById('updateStartDate').value.trim();
    const endDate = document.getElementById('updateEndDate').value.trim();

    if (id && benefitName && description && eligibilityCriteria && coverageAmount && startDate && endDate) {
        fetch(`http://localhost:3000/api/v1/benefits/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                benefit_name: benefitName,
                description: description,
                eligibility_criteria: eligibilityCriteria,
                coverage_amount: coverageAmount,
                start_date: startDate,
                end_date: endDate
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('overlayUpdateBenefit').style.display = 'none';
                fetchBenefits();
            } else {
                alert('Failed to update benefit.');
            }
        })
        .catch(error => console.error('Error updating benefit:', error));
    } else {
        alert('All fields are required to update the benefit.');
    }
}

function hideUpdateBenefitForm() {
    document.getElementById('overlayUpdateBenefit').style.display = 'none';
}

let benefitIdToDelete = null;

function deleteBenefit(id) {
    benefitIdToDelete = id;
    document.getElementById('overlayDeleteBenefit').style.display = 'flex';
}

document.getElementById('confirmDeleteButton').onclick = function() {
    const token = localStorage.getItem('token');
    if (benefitIdToDelete !== null) {
        fetch(`http://localhost:3000/api/v1/benefits/delete/${benefitIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchBenefits();
                hideDeleteForm();
            } else {
                alert('Failed to delete benefit.');
            }
        })
        .catch(error => console.error('Error deleting benefit:', error));
    }
};

function hideDeleteForm() {
    document.getElementById('overlayDeleteBenefit').style.display = 'none';
}



async function approveRequest(requestId) {
    const token = localStorage.getItem('token');

    try {
        // Fetch the request details
        const response = await fetch(`http://localhost:3000/api/v1/user-requests/show/${requestId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const requestData = await response.json();
        const request = requestData.data;

        if (request) {
            let benefitResponse;

            if (request.action === 'add') {
                // Handle "Add" Action: Create a new benefit
                benefitResponse = await fetch('http://localhost:3000/api/v1/benefits/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: request.benefit_id,
                        benefit_name: request.benefit_name,
                        description: request.benefit_description,
                        eligibility_criteria: request.eligibility_criteria,
                        coverage_amount: request.coverage_amount,
                        start_date: formatDate(request.start_date),
                        end_date: formatDate(request.end_date)
                    })
                });
                
                const data = await benefitResponse.json();
                if (!data.success) {
                    throw new Error('Failed to add benefit or existing data in benefits.');
                }
            } else if (request.action === 'update') {
                // Handle "Update" Action: Update the existing benefit
                benefitResponse = await fetch(`http://localhost:3000/api/v1/benefits/update/${request.benefit_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        benefit_name: request.benefit_name,
                        description: request.benefit_description,
                        eligibility_criteria: request.eligibility_criteria,
                        coverage_amount: request.coverage_amount,
                        start_date: request.start_date,
                        end_date: request.end_date
                    })
                });
                
                const data = await benefitResponse.json();
                if (!data.success) {
                    throw new Error('Failed to update benefit.');
                }
            }
            else if( request.action === 'delete'){
                // Handle "Delete" Action: Delete the existing benefit
                benefitResponse = await fetch(`http://localhost:3000/api/v1/benefits/delete/${request.benefit_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await benefitResponse.json();
                if (!data.success) {
                    throw new Error('Failed to delete benefit.');
                }

            }

            // Update request status to "approved"
            const statusUpdate = await updateRequestStatus(requestId, 'approved');
            if (statusUpdate.success) {
                alert('Benefit processed and request passed the audit successfully.');
                fetchBenefits(); // Refresh the benefits list
            } else {
                alert('Failed to update request status.');
            }
        } else {
            console.error('Request not found:', requestId);
        }
    } catch (error) {
        console.error('Error processing request:', error.message);
        alert('An error occurred while processing the request.');
    }
}
function deny(id) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/user-requests/update/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
            },
        body: JSON.stringify({ status: 'denied' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchBenefits();
        } else {
            alert('Failed to deny request.');
        }
    })
    .catch(error => console.error('Error denying request:', error));
}
 
function  Remove(id) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/user-requests/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchBenefits();
            } else {
                alert('Failed to delete request.');
            }
        })
        .catch(error => console.error('Error deleting request:', error));
}
 
async function updateRequestStatus(requestId, status) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/user-requests/update/${requestId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating request status:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    window.location.href = '/index.html'; 
}

