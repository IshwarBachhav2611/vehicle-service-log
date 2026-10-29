
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Vehicles.css";

const emptyForm = {
  registrationNumber: "",
  make: "",
  model: "",
  year: new Date().getFullYear(),
  vehicleType: "Car",
  fuelType: "Petrol",
  currentOdometer: 0,
};

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load vehicles. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (vehicle) => {
    setForm({
      registrationNumber: vehicle.registrationNumber || "",
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || new Date().getFullYear(),
      vehicleType: vehicle.vehicleType || "Car",
      fuelType: vehicle.fuelType || "Petrol",
      currentOdometer: vehicle.currentOdometer ?? 0,
    });
    setEditingId(vehicle._id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        registrationNumber: form.registrationNumber.trim().toUpperCase(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        currentOdometer: Number(form.currentOdometer),
      };

      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
        setSuccess("Vehicle updated successfully.");
      } else {
        await api.post("/vehicles", payload);
        setSuccess("Vehicle added successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadVehicles();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Delete vehicle ${vehicle.registrationNumber}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/vehicles/${vehicle._id}`);
      setSuccess("Vehicle deleted successfully.");
      await loadVehicles();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete vehicle."
      );
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase();

    return [
      vehicle.registrationNumber,
      vehicle.make,
      vehicle.model,
      vehicle.vehicleType,
      vehicle.fuelType,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="vehicle-page">
      <div className="page-toolbar">
        <div>
          <h5>All Vehicles</h5>
          <p>Manage your registered vehicles and their details.</p>
        </div>

        <button className="btn btn-primary" onClick={openAddForm}>
          + Add Vehicle
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="content-card vehicle-form-card mb-4">
          <div className="form-heading">
            <h5>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowForm(false)}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Registration Number *</label>
                <input
                  className="form-control"
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. MH15AB1234"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Make / Brand *</label>
                <input
                  className="form-control"
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  placeholder="e.g. Honda"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Model *</label>
                <input
                  className="form-control"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="e.g. City"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Manufacturing Year *</label>
                <input
                  className="form-control"
                  type="number"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="form-select"
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                >
                  <option>Car</option>
                  <option>Bike</option>
                  <option>Truck</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Fuel Type</label>
                <select
                  className="form-select"
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>CNG</option>
                  <option>Hybrid</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Current Odometer (km) *
                </label>
                <input
                  className="form-control"
                  type="number"
                  name="currentOdometer"
                  min="0"
                  value={form.currentOdometer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Vehicle"
                    : "Save Vehicle"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="vehicle-list-header">
          <div>
            <h5>Vehicle List</h5>
            <span>{vehicles.length} registered vehicle(s)</span>
          </div>

          <input
            className="form-control vehicle-search"
            type="search"
            placeholder="Search vehicles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="dashboard-empty">Loading vehicles...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="dashboard-empty">
            {vehicles.length === 0
              ? "No vehicles added yet. Click Add Vehicle to get started."
              : "No vehicles match your search."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle vehicle-table">
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Fuel</th>
                  <th>Odometer</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>
                      <strong>{vehicle.registrationNumber}</strong>
                    </td>
                    <td>
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.fuelType}</td>
                    <td>
                      {Number(vehicle.currentOdometer).toLocaleString(
                        "en-IN"
                      )}{" "}
                      km
                    </td>
                    <td>
                      <div className="vehicle-actions">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditForm(vehicle)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(vehicle)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vehicles;
