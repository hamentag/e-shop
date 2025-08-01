// components/ShippingAddrForm.jsx

import React from 'react';

import { US_STATES } from '../utils/constants';

export default function ShippingAddrForm({ formData, handleChange }) {
  return (
    <>
      <h4 className="mt-0">Shipping Information</h4>
      <div className="col-md-4">
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">First name is required</div>
      </div>

      <div className="col-md-4">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Last name is required</div>
      </div>

      <div className="col-md-4">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Valid email required</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">Address required</div>
      </div>

      <div className="col-md-3">
        <label className="form-label">City</label>
        <input
          type="text"
          className="form-control"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">City required</div>
      </div>

      <div className="col-md-2">
        <label className="form-label">State</label>
        <select
          className="form-select"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Choose...</option>
          {US_STATES.map((state, idx) => (
            <option key={idx} value={state.name}>{state.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">State required</div>
      </div>

      <div className="col-md-2">
        <label className="form-label">ZIP</label>
        <input
          type="text"
          className="form-control"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
        />
        <div className="invalid-feedback">ZIP required</div>
      </div>
    </>
  );
}
