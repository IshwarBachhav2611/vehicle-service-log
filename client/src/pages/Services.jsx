
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Services.css";
const emptyForm = {
  vehicle: "",
  serviceDate: new Date().toISOString().slice(0, 10),
  serviceType: "General Service",
  description: "",
  odometer: "",
  cost: "",
  nextServiceDate: "",
  nextServiceOdometer: "",
};

function Services() {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [serviceResponse, vehicleResponse] = await Promise.all([
        api.get("/services"),
        api.get("/vehicles"),
      ]);

      setServices(serviceResponse.data);
      setVehicles(vehicleResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load data. Check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setForm({
      ...emptyForm,
      serviceDate: new Date().toISOString().slice(0, 10),
      vehicle: vehicles[0]?._id || "",
    });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setForm({
      vehicle: service.vehicle?._id || service.vehicle || "",
      serviceDate: service.serviceDate
        ? new Date(service.serviceDate).toISOString().slice(0, 10)
        : "",
      serviceType: service.serviceType || "General Service",
      description: service.description || "",
      odometer: service.odometer ?? "",
      cost: service.cost ?? "",
      nextServiceDate: service.nextServiceDate
        ? new Date(service.nextServiceDate).toISOString().slice(0, 10)
        : "",
      nextServiceOdometer: service.nextServiceOdometer ?? "",
    });
    setEditingId(service._id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.vehicle) {
      setError("Please add a vehicle before recording a service.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        odometer: Number(form.odometer),
        cost: Number(form.cost || 0),
        nextServiceOdometer:
          form.nextServiceOdometer === ""
            ? undefined
            : Number(form.nextServiceOdometer),
        nextServiceDate: form.nextServiceDate || undefined,
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        setSuccess("Service record updated successfully.");
      } else {
        await api.post("/services", payload);
        setSuccess("Service record added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save service record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service record?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/services/${service._id}`);
      setSuccess("Service record deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete service record."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredServices = services.filter((service) => {
    const vehicle = service.vehicle;
    const searchText = search.toLowerCase();

    return [
      vehicle?.registrationNumber,
      vehicle?.make,
      vehicle?.model,
      service.serviceType,
      service.description,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="service-page">
      <div className="page-toolbar">
        <div>
          <h5>Service Records</h5>
          <p>Record maintenance history and track service expenses.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddForm}
          disabled={vehicles.length === 0}
        >
          + Add Service
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {vehicles.length === 0 && !loading && (
        <div className="alert alert-warning">
          Add a vehicle first before creating a service record.
        </div>
      )}

      {showForm && (
        <div className="content-card service-form-card">
          <div className="form-heading">
            <h5>{editingId ? "Edit Service Record" : "New Service Record"}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowForm(false)}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Vehicle *</label>
                <select
                  className="form-select"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.registrationNumber} — {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Type *</label>
                <select
                  className="form-select"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option>General Service</option>
                  <option>Oil Change</option>
                  <option>Engine Repair</option>
                  <option>Brake Service</option>
                  <option>Tyre Replacement</option>
                  <option>Battery Service</option>
                  <option>AC Service</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Date *</label>
                <input
                  className="form-control"
                  type="date"
                  name="serviceDate"
                  value={form.serviceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Odometer (km) *</label>
                <input
                  className="form-control"
                  type="number"
                  name="odometer"
                  min="0"
                  value={form.odometer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Cost (₹) *</label>
                <input
                  className="form-control"
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={form.cost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Next Service Date</label>
                <input
                  className="form-control"
                  type="date"
                  name="nextServiceDate"
                  value={form.nextServiceDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Next Service Odometer (km)</label>
                <input
                  className="form-control"
                  type="number"
                  name="nextServiceOdometer"
                  min="0"
                  value={form.nextServiceOdometer}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the work performed or parts replaced..."
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
                    ? "Update Record"
                    : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="service-list-header">
          <div>
            <h5>Maintenance History</h5>
            <span>{services.length} service record(s)</span>
          </div>

          <input
            className="form-control service-search"
            type="search"
            placeholder="Search vehicle or service..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="dashboard-empty">Loading service records...</div>
        ) : filteredServices.length === 0 ? (
          <div className="dashboard-empty">
            {services.length === 0
              ? "No service records found. Add your first service record."
              : "No records match your search."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle service-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th>Odometer</th>
                  <th>Cost</th>
                  <th>Next Service</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>
                    <td>
                      <strong>
                        {service.vehicle?.registrationNumber || "Unavailable"}
                      </strong>
                      <small className="d-block text-muted">
                        {service.vehicle
                          ? `${service.vehicle.make} ${service.vehicle.model}`
                          : ""}
                      </small>
                    </td>
                    <td>{service.serviceType}</td>
                    <td>{formatDate(service.serviceDate)}</td>
                    <td>
                      {Number(service.odometer || 0).toLocaleString("en-IN")} km
                    </td>
                    <td>
                      ₹{Number(service.cost || 0).toLocaleString("en-IN")}
                    </td>
                    <td>{formatDate(service.nextServiceDate)}</td>
                    <td>
                      <div className="service-actions">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditForm(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(service)}
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

export default Services;
