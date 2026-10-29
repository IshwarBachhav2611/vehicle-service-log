
function StatCard({ title, value, icon, color, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-card-title">{title}</p>
          <h3 className="stat-card-value">{value}</h3>
        </div>

        <div
          className="stat-card-icon"
          style={{
            backgroundColor: `${color}18`,
            color: color,
          }}
        >
          {icon}
        </div>
      </div>

      {description && (
        <p className="stat-card-description">{description}</p>
      )}
    </div>
  );
}

export default StatCard;
