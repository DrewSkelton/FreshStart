import React, { useState, useMemo } from 'react';
import '../styles/EquipmentPage.css';

const EquipmentCard = ({ item, onEdit }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      <div className="equipment-card">
        <div className="equipment-image">
          <div className="image-placeholder"></div>
        </div>
        <div className="equipment-info">
          <h3>{item.name}</h3>
          <div className={`status-badge ${item.status}`}>
            {item.status.replace('-', ' ')}
          </div>
          <div className="equipment-details">
            <p><strong>Maintenance:</strong> {item.maintenance}</p>
            <p><strong>Last Service:</strong> {item.lastService}</p>
            {item.notes && (
              <button 
                className="notes-toggle"
                onClick={() => setShowNotes(true)}
              >
                View Notes
              </button>
            )}
          </div>
          <div className="equipment-actions">
            <button 
              className="action-button edit"
              onClick={() => onEdit(item)}
            >
              Edit
            </button>
            <button className="action-button schedule">Schedule</button>
          </div>
        </div>
      </div>

      {showNotes && (
        <div className="modal-overlay" onClick={() => setShowNotes(false)}>
          <div className="notes-modal" onClick={e => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h2>{item.name} - Notes</h2>
              <button 
                className="close-button"
                onClick={() => setShowNotes(false)}
              >
                ×
              </button>
            </div>
            <div className="notes-modal-content">
              <p>{item.notes}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const EquipmentPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [showNeededEquipment, setShowNeededEquipment] = useState(false);
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Irrigation Pump',
      category: 'irrigation',
      status: 'available',
      maintenance: 'Good',
      lastService: '2024-01-15',
      image: '/images/pump.jpg',
      notes: 'Regular maintenance completed. New filter installed.',
    },
    {
      id: 2,
      name: 'Harvesting Toolkit',
      category: 'tools',
      status: 'in-use',
      maintenance: 'Fair',
      lastService: '2024-02-01',
      image: '/images/tools.jpg',
      notes: 'Complete set of harvesting tools including pruners and shears.',
    },
    {
      id: 3,
      name: 'Fertilizer Spreader',
      category: 'fertilizing',
      status: 'maintenance',
      maintenance: 'Needs Repair',
      lastService: '2023-12-20',
      image: '/images/spreader.jpg',
      notes: 'Calibration needed for optimal spreading pattern.',
    },
    {
      id: 4,
      name: 'Grain Silo',
      category: 'storage',
      status: 'available',
      maintenance: 'Good',
      lastService: '2024-01-30',
      image: '/images/silo.jpg',
      notes: 'Temperature and humidity monitoring system working properly.',
    },
    {
      id: 5,
      name: 'Weather Station',
      category: 'other',
      status: 'in-use',
      maintenance: 'Good',
      lastService: '2024-03-01',
      image: '/images/weather.jpg',
      notes: 'Provides real-time weather data for farm operations.',
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Equipment' },
    { id: 'irrigation', name: 'Irrigation Systems' },
    { id: 'tools', name: 'Tools' },
    { id: 'fertilizing', name: 'Fertilizing Equipment' },
    { id: 'storage', name: 'Storage' },
    { id: 'other', name: 'Other' }
  ];

  const handleEditSave = (updatedEquipment) => {
    setEquipment(equipment.map(item => 
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
    setEditingEquipment(null);
  };

  // Calculate equipment statistics
  const stats = useMemo(() => {
    const totalItems = equipment.length;
    const available = equipment.filter(item => item.status === 'available').length;
    const inUse = equipment.filter(item => item.status === 'in-use').length;
    const maintenance = equipment.filter(item => item.status === 'maintenance').length;

    return {
      totalItems,
      available,
      inUse,
      maintenance
    };
  }, [equipment]);

  return (
    <div className="equipment-page-wrapper">
      <div className="equipment-page">
        <div className="equipment-header">
          <h1>Farm Equipment Management</h1>
          <p>Manage and monitor your farming equipment and tools</p>
        </div>

        <div className="equipment-content">
          <aside className="equipment-sidebar">
            <div className="category-filter">
              <h2>Categories</h2>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="equipment-stats">
              <h2>Equipment Overview</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{stats.totalItems}</span>
                  <span className="stat-label">Total Items</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.available}</span>
                  <span className="stat-label">Available</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.inUse}</span>
                  <span className="stat-label">In Use</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.maintenance}</span>
                  <span className="stat-label">Maintenance</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="equipment-main">
            <div className="equipment-controls">
              <div className="search-box">
                <h2>Search Equipment</h2>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    className="search-input"
                  />
                  <button className="add-equipment-button" title={`Add New ${showNeededEquipment ? 'Needed' : ''} Equipment`}>
                    +
                  </button>
                </div>
              </div>
              <div className="equipment-view-toggle">
                <h2>View Mode</h2>
                <div className="toggle-container">
                  <div className="toggle-labels">
                    <span>Your Equipment</span>
                    <span>Equipment Needed</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showNeededEquipment}
                      onChange={(e) => setShowNeededEquipment(e.target.checked)}
                    />
                    <div className="toggle-slider"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="equipment-grid">
              {equipment.map(item => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  onEdit={setEditingEquipment}
                />
              ))}
            </div>
          </main>
        </div>

        {editingEquipment && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit Equipment</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedEquipment = {
                  ...editingEquipment,
                  name: formData.get('name'),
                  category: formData.get('category'),
                  status: formData.get('status'),
                  maintenance: formData.get('maintenance'),
                  lastService: formData.get('lastService'),
                  notes: formData.get('notes'),
                };
                handleEditSave(updatedEquipment);
              }}>
                <div className="form-group">
                  <label htmlFor="name">Equipment Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingEquipment.name}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingEquipment.category}
                    required
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingEquipment.status}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="maintenance">Maintenance Status</label>
                  <select
                    id="maintenance"
                    name="maintenance"
                    defaultValue={editingEquipment.maintenance}
                    required
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lastService">Last Service Date</label>
                  <input
                    type="date"
                    id="lastService"
                    name="lastService"
                    defaultValue={editingEquipment.lastService}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingEquipment.notes}
                    placeholder="Add any additional notes about the equipment..."
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditingEquipment(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentPage;
