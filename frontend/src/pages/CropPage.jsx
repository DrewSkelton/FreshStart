import React, { useState, useMemo } from 'react';
import '../styles/crop.css';

const CropCard = ({ item, onEdit }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      <div className="Crop-card">
        <div className="Crop-image">
          <div className="image-placeholder"></div>
        </div>
        <div className="Crop-info">
          <h3>{item.name}</h3>
          <div className={`status-badge ${item.status}`}>
            {item.status.replace('-', ' ')}
          </div>
          <div className="Crop-details">
            <p><strong>Planting Date:</strong> {item.plantingDate}</p>
            <p><strong>Harvest Date:</strong> {item.harvestDate}</p>
            {item.notes && (
              <button 
                className="notes-toggle"
                onClick={() => setShowNotes(true)}
              >
                View Notes
              </button>
            )}
          </div>
          <div className="Crop-actions">
            <button 
              className="action-button edit"
              onClick={() => onEdit(item)}
            >
              Edit
            </button>
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

const CropPage = () => {
  const [editingCrop, setEditingCrop] = useState(null);
  const [Crop, setCrop] = useState([
    {
      id: 1,
      name: 'Corn',
      status: 'unplanted',
      plantingDate: '2025-03-15',
      harvestDate: '2025-09-20',
      image: '/images/corn.jpg',
      notes: 'Planted with hybrid seeds. Requires regular watering.',
    },
    {
      id: 2,
      name: 'Wheat',
      status: 'harvested',
      plantingDate: '2024-10-01',
      harvestDate: '2025-06-15',
      image: '/images/wheat.jpg',
      notes: 'Harvested successfully. Stored in silo 3.',
    },
    {
      id: 3,
      name: 'Soybeans',
      status: 'growing',
      plantingDate: '2025-04-10',
      harvestDate: '2025-10-25',
      image: '/images/soybeans.jpg',
      notes: 'Growing well. No issues reported.',
    },
    {
      id: 4,
      name: 'Tomatoes',
      status: 'unplanted',
      plantingDate: '2025-05-05',
      harvestDate: '2025-08-30',
      image: '/images/tomatoes.jpg',
      notes: 'Planted in greenhouse 2. Requires weekly fertilization.',
    },
  ]);

  const handleEditSave = (updatedCrop) => {
    setCrop(Crop.map(item => 
      item.id === updatedCrop.id ? updatedCrop : item
    ));
    setEditingCrop(null);
  };

  // Calculate Crop statistics
  const stats = useMemo(() => {
    const totalItems = Crop.length;
    const unplanted = Crop.filter(item => item.status === 'unplanted').length;
    const growing = Crop.filter(item => item.status === 'growing').length;
    const harvested = Crop.filter(item => item.status === 'harvested').length;

    return {
      totalItems,
      unplanted,
      growing,
      harvested
    };
  }, [Crop]);

  return (
    <div className="Crop-page-wrapper">
      <div className="Crop-page">
        <div className="Crop-header">
          <h1>Farm Crop Management</h1>
          <p>Manage your crops efficiently!</p>
        </div>

        <div className="Crop-content">
          <aside className="Crop-sidebar">
            <div className="Crop-stats">
              <h2>Crop Overview</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{stats.totalItems}</span>
                  <span className="stat-label">Total Crops</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.unplanted}</span>
                  <span className="stat-label">Unplanted</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.growing}</span>
                  <span className="stat-label">Growing</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.harvested}</span>
                  <span className="stat-label">Harvested</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="Crop-main">
            <div className="Crop-controls">
              <div className="search-box">
                <h2>Search Crops</h2>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Search Crops..."
                    className="search-input"
                  />
                  <button className="add-Crop-button" title="Add New Crop">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="Crop-grid">
              {Crop.map(item => (
                <CropCard
                  key={item.id}
                  item={item}
                  onEdit={setEditingCrop}
                />
              ))}
            </div>
          </main>
        </div>

        {editingCrop && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit Crop</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedCrop = {
                  ...editingCrop,
                  name: formData.get('name'),
                  status: formData.get('status'),
                  plantingDate: formData.get('plantingDate'),
                  harvestDate: formData.get('harvestDate'),
                  notes: formData.get('notes'),
                };
                handleEditSave(updatedCrop);
              }}>
                <div className="form-group">
                  <label htmlFor="name">Crop Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingCrop.name}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingCrop.status}
                    required
                  >
                    <option value="unplanted">Unplanted</option>
                    <option value="growing">Growing</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="plantingDate">Planting Date</label>
                  <input
                    type="date"
                    id="plantingDate"
                    name="plantingDate"
                    defaultValue={editingCrop.plantingDate}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="harvestDate">Harvest Date</label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    defaultValue={editingCrop.harvestDate}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingCrop.notes}
                    placeholder="Add any additional notes about the crop..."
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
                    onClick={() => setEditingCrop(null)}
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

export default CropPage;