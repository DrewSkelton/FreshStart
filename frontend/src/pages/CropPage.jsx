import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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
          <h3>{item.cropType}</h3>
          <div className={`status-badge ${item.status}`}>
            {item.status}
          </div>
          <div className="Crop-details">
            <p><strong>Area:</strong> {Math.round(item.width * item.height)}m²</p>
            <p><strong>Density:</strong> {item.density} plants/m²</p>
            <p><strong>Planting Date:</strong> {item.plantingDate || 'Not set'}</p>
            <p><strong>Harvest Date:</strong> {item.harvestDate || 'Not set'}</p>
            <p><strong>Irrigation:</strong> {item.irrigation}</p>
            <p><strong>Fertilizer:</strong> {item.fertilizerType}</p>
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
              <h2>{item.cropType} - Notes</h2>
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
  const [crops, setCrops] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch layouts when component mounts
  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:3001/layout/get-layouts")
      .then(response => {
        setLayouts(response.data);
        if (response.data.length > 0 && !selectedLayoutId) {
          setSelectedLayoutId(response.data[0]._id);
        }
      })
      .catch(error => console.error("Error fetching layouts:", error))
      .finally(() => {
        if (!selectedLayoutId) {
          setIsLoading(false);
        }
      });
  }, []);

  // Fetch selected layout and update crops when selectedLayoutId changes
  useEffect(() => {
    if (selectedLayoutId) {
      setIsLoading(true);
      axios.get(`http://localhost:3001/layout/get-layout/${selectedLayoutId}`)
        .then(response => {
          // Transform crop areas into crop entries with default planting info
          const cropAreas = response.data.crop_areas.map(crop => ({
            ...crop,
            status: 'unplanted',
            plantingDate: null,
            harvestDate: null,
            notes: ''
          }));
          setCrops(cropAreas);
        })
        .catch(error => console.error("Error fetching layout:", error))
        .finally(() => setIsLoading(false));
    }
  }, [selectedLayoutId]);

  const handleEditSave = (updatedCrop) => {
    setCrops(crops.map(item => 
      item.id === updatedCrop.id ? updatedCrop : item
    ));
    setEditingCrop(null);

    // Update the layout with the new crop information
    if (selectedLayoutId) {
      const layout = layouts.find(l => l._id === selectedLayoutId);
      if (layout) {
        const updatedLayout = {
          ...layout,
          crop_areas: crops.map(crop => 
            crop.id === updatedCrop.id ? updatedCrop : crop
          )
        };
        
        axios.put(`http://localhost:3001/layout/update-layout/${selectedLayoutId}`, updatedLayout)
          .catch(error => console.error("Error updating layout:", error));
      }
    }
  };

  // Calculate crop statistics
  const stats = useMemo(() => {
    const totalItems = crops.length;
    const unplanted = crops.filter(item => item.status === 'unplanted').length;
    const growing = crops.filter(item => item.status === 'growing').length;
    const harvested = crops.filter(item => item.status === 'harvested').length;

    return {
      totalItems,
      unplanted,
      growing,
      harvested
    };
  }, [crops]);

  if (isLoading) {
    return (
      <div className="Crop-page-wrapper">
        <div className="Crop-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading crops...</p>
          </div>
        </div>
      </div>
    );
  }

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

            <div className="layout-selector">
              <h2>Select Layout</h2>
              <select 
                value={selectedLayoutId || ''} 
                onChange={(e) => setSelectedLayoutId(e.target.value)}
                className="layout-select"
              >
                <option value="">Select a layout...</option>
                {layouts.map(layout => (
                  <option key={layout._id} value={layout._id}>
                    {layout.name}
                  </option>
                ))}
              </select>
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
                </div>
              </div>
            </div>

            <div className="Crop-grid">
              {crops.map(item => (
                <CropCard
                  key={item.id}
                  item={item}
                  onEdit={setEditingCrop}
                />
              ))}
              {crops.length === 0 && (
                <div className="no-crops-message">
                  {selectedLayoutId 
                    ? "No crops found in this layout. Add crops in the Layout Planner." 
                    : "Select a layout to view its crops."}
                </div>
              )}
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
                  status: formData.get('status'),
                  plantingDate: formData.get('plantingDate'),
                  harvestDate: formData.get('harvestDate'),
                  notes: formData.get('notes'),
                };
                handleEditSave(updatedCrop);
              }}>
                <div className="form-group">
                  <label htmlFor="cropType">Crop Type</label>
                  <input
                    type="text"
                    id="cropType"
                    value={editingCrop.cropType}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingCrop.status || 'unplanted'}
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="harvestDate">Harvest Date</label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    defaultValue={editingCrop.harvestDate}
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