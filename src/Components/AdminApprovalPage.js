// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminApprova.css'

// function AdminApprovalPage() {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [requestHistory, setRequestHistory] = useState([]);
//   // Fetch pending requests from the server
//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true); // Set loading to true while fetching data
//       try {
//         const response = await axios.get('http://localhost:8080/admin/requests/pending');
//         setPendingRequests(response.data);
//       } catch (error) {
//         console.error("Error fetching pending requests:", error);
//         alert(`Failed to load pending requests: ${error.response?.data?.message || error.message}`);
//       }
//       setLoading(false); // Stop loading once the data is fetched
//     };
//     fetchRequests();
//   }, []);

//   // Approve a request
//   axios.defaults.withCredentials = true;
//   const approveRequest = async (id) => {
//     try {
//       await axios.post(`http://localhost:8080/admin/requests/approve/${id}`);
//       setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the approved request from the list
//       alert("Request approved!");
//     } catch (error) {
//       alert(`Failed to approve request: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // Reject a request
//   const rejectRequest = async (id) => {
//     try {
//       await axios.post(`http://localhost:8080/admin/requests/reject/${id}`);
//       setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the rejected request from the list
//       alert("Request rejected!");
//     } catch (error) {
//       alert(`Failed to reject request: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <div className='body1'>
//     <div className="container7 mt-5">
//       <h2 className="text-center">Pending Admin Requests</h2>

//       {/* Display a loading spinner while data is being fetched */}
//       {loading ? (
//         <div className="text-center">
//           <div className="spinner-border" role="status">
//             <span className="sr-only">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingRequests.length > 0 ? pendingRequests.map(request => (
//               <tr key={request.id}>
//                 <td>{request.id}</td>
//                 <td>{request.username}</td>
//                 <td>{request.email}</td>
//                 <td>
//                   <button className="btn btn-success me-2" onClick={() => approveRequest(request.id)}>Approve</button>
//                   <button className="btn btn-danger" onClick={() => rejectRequest(request.id)}>Reject</button>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="4" className="text-center">No pending requests</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//     </div>
//   );
// }

// export default AdminApprovalPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminApprova.css';

function AdminApprovalPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch pending requests from the server
  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingPending(true); // Set loading to true while fetching pending requests
      try {
        const response = await axios.get('https://quizapplicationbackend-production.up.railway.app/admin/requests/pending');
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        alert(`Failed to load pending requests: ${error.response?.data?.message || error.message}`);
      }
      setLoadingPending(false); // Stop loading once the data is fetched
    };

    const fetchRequestHistory = async () => {
      setLoadingHistory(true); // Set loading to true while fetching request history
      try {
        const response = await axios.get('https://quizapplicationbackend-production.up.railway.app/admin/requests/history');
        setRequestHistory(response.data);
      } catch (error) {
        console.error("Error fetching request history:", error);
        alert(`Failed to load request history: ${error.response?.data?.message || error.message}`);
      }
      setLoadingHistory(false); // Stop loading once the data is fetched
    };

    fetchRequests();
    fetchRequestHistory();
  }, []);

  // Approve a request
  axios.defaults.withCredentials = true;
  const approveRequest = async (id) => {
    try {
      await axios.post(`https://quizapplicationbackend-production.up.railway.app/admin/requests/approve/${id}`);
      setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the approved request from the list
      alert("Request approved!");
    } catch (error) {
      alert(`Failed to approve request: ${error.response?.data?.message || error.message}`);
    }
  };

  // Reject a request
  const rejectRequest = async (id) => {
    try {
      await axios.post(`https://quizapplicationbackend-production.up.railway.app/admin/requests/reject/${id}`);
      setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove the rejected request from the list
      alert("Request rejected!");
    } catch (error) {
      alert(`Failed to reject request: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className='body1'>
      <div className="container7 mt-5">
        <h2 className="text-center">Pending Admin Requests</h2>

        {/* Display a loading spinner while pending requests are being fetched */}
        {loadingPending ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? pendingRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.username}</td>
                  <td>{request.email}</td>
                  <td>
                    <button className="btn btn-success me-2" onClick={() => approveRequest(request.id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => rejectRequest(request.id)}>Reject</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <h2 className="text-center mt-5">Admin Request History</h2>

        {/* Display a loading spinner while request history is being fetched */}
        {loadingHistory ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestHistory.length > 0 ? requestHistory.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.username}</td>
                  <td>{request.email}</td>
                  <td>{request.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center">No request history available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminApprovalPage;
