import React, { useState, useMemo } from 'react';
import '../styles/EquipmentPage.css';

const EquipmentCard = ({ item, onEdit }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
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
          <button 
            className={`notes-toggle ${showNotes ? 'active' : ''} ${item.notes ? '' : 'hidden'}`}
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          {showNotes && item.notes && (
            <div className="notes-section">
              <p className="notes-content">{item.notes}</p>
            </div>
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
  );
};

const EquipmentPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Compact Tractor',
      category: 'tractors',
      status: 'available',
      maintenance: 'Good',
      lastService: '2024-01-15',
      image: '/images/tractor.jpg',
      notes: 'Regular maintenance completed. New air filter installed.',
    },
    {
      id: 2,
      name: 'Irrigation Pump',
      category: 'irrigation',
      status: 'in-use',
      maintenance: 'Fair',
      lastService: '2024-02-01',
      image: '/images/pump.jpg',
      notes: 'Pressure gauge needs calibration next service.',
    },
    {
      id: 3,
      name: 'Harvester',
      category: 'harvesting',
      status: 'maintenance',
      maintenance: 'Needs Repair',
      lastService: '2023-12-20',
      image: '/images/harvester.jpg',
      notes: 'Belt replacement required. Parts ordered.',
    },
    {
      id: 4,
      name: 'Seeder',
      category: 'planting',
      status: 'available',
      maintenance: 'Good',
      lastService: '2024-01-30',
      image: '/images/seeder.jpg',
      notes: 'Calibrated for corn planting.',
    },
  ]);

  const categories = [
    { id: 'all', name: 'All Equipment' },
    { id: 'tractors', name: 'Tractors & Vehicles' },
    { id: 'irrigation', name: 'Irrigation Systems' },
    { id: 'harvesting', name: 'Harvesting Tools' },
    { id: 'planting', name: 'Planting Equipment' },
    { id: 'fertilizing', name: 'Fertilizing Equipment' },
    { id: 'storage', name: 'Storage Solutions' },
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
              <input
                type="text"
                placeholder="Search equipment..."
                className="search-input"
              />
            </div>
            <button className="add-equipment-button">
              Add New Equipment
            </button>
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
  );
};

export default EquipmentPage;
