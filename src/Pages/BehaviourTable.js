import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableHeaders, setTableHeaders] = useState(["name","behavior"]); // Default headers

  useEffect(() => {
    fetch("http://localhost:5000/get-employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
        toast.success("Employee data fetched successfully!");

        // Dynamically extract custom field names
        const allCustomFields = new Set(tableHeaders);
        data.forEach((employee) => {
          if (employee.customFields) {
            employee.customFields.forEach((field) => {
              allCustomFields.add(field.name.toLowerCase()); // ✅ Ensure lowercase consistency
            });
          }
        });

        setTableHeaders(Array.from(allCustomFields)); // ✅ Update table headers dynamically
      })
      .catch((err) => {
        setError("Failed to fetch data!");
        setLoading(false);
        toast.error("Failed to fetch employee data!");
      });
  }, []);

  // ✅ Function to capitalize first letter of headers
  const formatHeader = (header) => {
    return header.charAt(0).toUpperCase() + header.slice(1);
  };

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (error) return <h3 className="text-center mt-5 text-danger">{error}</h3>;

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-3">Employee Feedback List</h3>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{formatHeader(header)}</th> //{/* ✅ Convert first letter to uppercase */}
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={index}>
                {tableHeaders.map((header, idx) => (
                  <td key={idx}>
                    {header in employee
                      ? employee[header]
                      : employee.customFields?.find((field) => field.name.toLowerCase() === header)?.value || "N/A"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="100%" className="text-center">
                No Employees Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;