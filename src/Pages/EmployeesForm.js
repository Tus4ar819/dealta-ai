import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api"; // Adjust the import path based on your project structure

const EmployeeForm = () => {
  // Define initial form state including all fields
  const initialState = {
    name: "",
    dob: "",
    phone: "",
    email: "",
    skills: "",
    doj: "",
    salary: "",
    feedback: "",
    gender: "", // Added gender field
  };

  const [employeeData, setEmployeeData] = useState(initialState);
  const [customFields, setCustomFields] = useState([]);

  // Handle standard field changes
  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  // Handle dynamic custom field value changes
  const handleCustomChange = (index, e) => {
    let newFields = [...customFields];
    newFields[index].value = e.target.value;
    setCustomFields(newFields);
  };

  // Handle dynamic custom field name changes
  const handleFieldNameChange = (index, e) => {
    let newFields = [...customFields];
    newFields[index].name = e.target.value;
    setCustomFields(newFields);
  };

  // Function to add a new custom field input set
  const addField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  // Submit form data to backend API using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Merge employeeData with customFields array
    const finalData = { ...employeeData, customFields };

    try {
      const response = await api.post("/save-employee", finalData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Employee and feedback saved successfully! 🎉");
        // Clear the form by resetting state
        setEmployeeData(initialState);
        setCustomFields([]);
      } else {
        toast.error("Failed to save employee data! ❌");
      }
    } catch (error) {
      console.error("Error saving employee data:", error);
      toast.error("Failed to save employee data! ❌");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Employee Form</h3>
      <form onSubmit={handleSubmit}>
        {/* Basic Fields */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="form-control"
            value={employeeData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            className="form-control"
            value={employeeData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            placeholder="Enter the date of birth"
            className="form-control"
            value={employeeData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter the phone number"
            className="form-control"
            value={employeeData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter the email"
            className="form-control"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Enter the skills"
            className="form-control"
            value={employeeData.skills}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Joining</label>
          <input
            type="date"
            name="doj"
            placeholder="Enter the date of joining"
            className="form-control"
            value={employeeData.doj}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            name="salary"
            placeholder="Enter the salary"
            className="form-control"
            value={employeeData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <h3 className="text-center">Feedback</h3>
        <div className="mb-3">
          <label className="form-label">Behavior (Rating out of 5)</label>
          <input
            type="number"
            name="feedback"
            placeholder="Give rating out of 5"
            className="form-control"
            value={employeeData.feedback}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dynamic Custom Fields */}
        {customFields.map((field, index) => (
          <div className="mb-3" key={index}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Custom Field Name"
              value={field.name}
              onChange={(e) => handleFieldNameChange(index, e)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Custom Field Value"
              value={field.value}
              onChange={(e) => handleCustomChange(index, e)}
              required
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addField}
        >
          + Add Field
        </button>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Save Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
