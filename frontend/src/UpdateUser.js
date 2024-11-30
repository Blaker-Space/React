import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {
    const [formData, setFormData] = useState({ Name: "", Email: "", Password: "", OrganizationName: "" });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name) newErrors.Name = "Name is required.";
        if (!formData.Email) newErrors.Email = "Email is required.";
        if (!formData.Password) newErrors.Password = "Password is required.";
        if (!formData.OrganizationName) newErrors.OrganizationName = "Organization Name is required.";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios
                .put("http://localhost:8080/update/" + id, formData)
                .then(res => {
                    console.log(res.data);
                    navigate('/');
                })
                .catch(err => {
                    console.error("Error creating user:", err.response || err);
                    setErrors({ server: "Failed to create user. Please try again later." });
                });
        }
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={handleSubmit}>
                    <h2>Update User</h2>

                    <div style={{ marginBottom: "1rem" }} className='mb-2'>
                        <label htmlFor="Name">
                            Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder='Enter your name'
                            className='form-control'
                            type="text"
                            id="Name"
                            name="Name"  // Match the key in formData
                            value={formData.Name}
                            onChange={handleChange}
                            style={{ display: "block", marginTop: "0.5rem" }}
                        />
                        {errors.Name && <span style={{ color: "red" }}>{errors.Name}</span>}
                    </div>

                    <div style={{ marginBottom: "1rem" }} className='mb-2'>
                        <label htmlFor="Email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder='Enter your email address'
                            className='form-control'
                            type="email"
                            id="Email"
                            name="Email"  // Match the key in formData
                            value={formData.Email}
                            onChange={handleChange}
                            style={{ display: "block", marginTop: "0.5rem" }}
                        />
                        {errors.Email && <span style={{ color: "red" }}>{errors.Email}</span>}
                    </div>

                    <div style={{ marginBottom: "1rem" }} className='mb-2'>
                        <label htmlFor="Password">
                            Password <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder='Enter your password'
                            className='form-control'
                            type="password"
                            id="Password"
                            name="Password"  // Match the key in formData
                            value={formData.Password}
                            onChange={handleChange}
                            style={{ display: "block", marginTop: "0.5rem" }}
                        />
                        {errors.Password && <span style={{ color: "red" }}>{errors.Password}</span>}
                    </div>

                    <div style={{ marginBottom: "1rem" }} className='mb-2'>
                        <label htmlFor="OrganizationName">
                            Organization Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            placeholder='Enter the name of your organization'
                            className='form-control'
                            type="text"
                            id="OrganizationName"
                            name="OrganizationName"  // Match the key in formData
                            value={formData.OrganizationName}
                            onChange={handleChange}
                            style={{ display: "block", marginTop: "0.5rem" }}
                        />
                        {errors.OrganizationName && <span style={{ color: "red" }}>{errors.OrganizationName}</span>}
                    </div>

                    <button type="submit" className='btn btn-success' onClick={handleSubmit}>Update</button>
                    {errors.server && (
                        <div style={{ marginTop: "1rem", color: "red" }}>
                            {errors.server}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
