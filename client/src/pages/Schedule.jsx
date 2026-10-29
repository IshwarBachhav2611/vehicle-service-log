
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Schedule.css";
function Schedule() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/services");
        setServices(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load the service schedule. Check your backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduledServices = services
    .filter(
      (service) =>
        service.nextServiceDate || service.nextServiceOdometer != null
    )
    .map((service) => {
      const nextDate = service.nextServiceDate
        ? new Date(service.nextServiceDate)
        : null;

      if (nextDate) {
        nextDate.setHours(0, 0, 0, 0);
      }

      const isOverdue = nextDate && nextDate < today;

      return {
        ...service,
        isOverdue: Boolean(isOverdue),
      };
    })
    .sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) {
        return a.isOverdue ? -1 : 1;
      }

      if (!a.nextServiceDate) return 1;
      if (!b.nextServiceDate) return -1;

      return (
        new Date(a.nextServiceDate) - new Date(b.nextServiceDate)
      );
    });

  const overdueCount = scheduledServices.filter(
    (service) => service.isOverdue
  ).length;

  const upcomingCount = scheduledServices.filter(
    (service) => !service.isOverdue
  ).length;

  const filteredServices = scheduledServices.filter((service) => {
    if (filter === "overdue") return service.isOverdue;
    if (filter === "upcoming") return !service.isOverdue;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="schedule-page">
      <div className="page-toolbar">
        <div>
          <h5>Service Schedule</h5>
          <p>Keep track of upcoming maintenance and overdue services.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="schedule-stats">
        <div className="schedule-stat-card">
          <div>
            <span>All Scheduled Services</span>
            <h3>{loading ? "..." : scheduledServices.length}</h3>
          </div>
          <div className="schedule-stat-icon total-icon">📋</div>
        </div>

        <div className="schedule-stat-card">
          <div>
            <span>Upcoming Services</span>
            <h3>{loading ? "..." : upcomingCount}</h3>
          </div>
          <div className="schedule-stat-icon upcoming-icon">📅</div>
        </div>

        <div className="schedule-stat-card">
          <div>
            <span>Overdue Services</span>
            <h3>{loading ? "..." : overdueCount}</h3>
          </div>
          <div className="schedule-stat-icon overdue-icon">⚠️</div>
        </div>
      </div>

      <div className="content-card">
        <div className="schedule-list-header">
          <div>
            <h5>Maintenance Schedule</h5>
            <p>Service reminders based on your recorded maintenance dates.</p>
          </div>

          <select
            className="form-select schedule-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All Services</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            Loading service schedule...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="dashboard-empty">
            {scheduledServices.length === 0
              ? "No scheduled services found. Add a next service date or odometer reading to a service record."
              : "No services found for this filter."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle schedule-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Last Service</th>
                  <th>Next Service Date</th>
                  <th>Next Odometer</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>
                    <td>
                      <strong>
                        {service.vehicle?.registrationNumber ||
                          "Vehicle unavailable"}
                      </strong>
                      <small className="d-block text-muted">
                        {service.vehicle
                          ? `${service.vehicle.make} ${service.vehicle.model}`
                          : ""}
                      </small>
                    </td>

                    <td>
                      {formatDate(service.serviceDate)}
                    </td>

                    <td>
                      {formatDate(service.nextServiceDate)}
                    </td>

                    <td>
                      {service.nextServiceOdometer != null
                        ? `${Number(
                            service.nextServiceOdometer
                          ).toLocaleString("en-IN")} km`
                        : "Not set"}
                    </td>

                    <td>
                      <span
                        className={`schedule-status ${
                          service.isOverdue
                            ? "status-overdue"
                            : "status-upcoming"
                        }`}
                      >
                        {service.isOverdue ? "Overdue" : "Upcoming"}
                      </span>
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

export default Schedule;
