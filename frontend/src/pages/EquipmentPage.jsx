import React, { useState, useMemo, useEffect } from 'react';
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

const NeededEquipmentCard = ({ item, onEdit, onDelete }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleResearch = () => {
    const searchQuery = encodeURIComponent(`${item.name} farm equipment purchasing information price`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const handlePurchase = () => {
    const searchQuery = encodeURIComponent(`${item.name} farm equipment`);
    window.open(`https://www.amazon.com/s?k=${searchQuery}`, '_blank');
  };

  return (
    <>
      <div className="equipment-card needed">
        <div className="equipment-image">
          <div className="image-placeholder"></div>
        </div>
        <div className="equipment-info">
          <div className="card-header">
            <h3>{item.name}</h3>
            <div className="menu-container">
              <button 
                className="menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                ⋮
              </button>
              {showMenu && (
                <div className="menu-dropdown">
                  <button onClick={() => {
                    setShowMenu(false);
                    onEdit(item);
                  }}>
                    Edit
                  </button>
                  <button onClick={() => {
                    setShowMenu(false);
                    onDelete(item.id);
                  }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={`priority-badge ${item.priority}`}>
            {item.priority} priority
          </div>
          <div className="equipment-details">
            <p><strong>Estimated Cost:</strong> {item.estimatedCost}</p>
            {item.notes && (
              <p className="needed-notes">{item.notes}</p>
            )}
          </div>
          <div className="equipment-actions">
            <button 
              className="action-button purchase"
              onClick={handlePurchase}
            >
              Purchase
            </button>
            <button 
              className="action-button research"
              onClick={handleResearch}
            >
              Research
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const EquipmentPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [showNeededEquipment, setShowNeededEquipment] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNeededEquipment, setEditingNeededEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const [neededEquipment, setNeededEquipment] = useState([
    {
      id: 101,
      name: 'Advanced Sprinkler System',
      category: 'irrigation',
      priority: 'high',
      estimatedCost: '$2,500',
      image: '/images/sprinkler.jpg',
      notes: 'Needed for more efficient water distribution in the new field section.',
    },
    {
      id: 102,
      name: 'Precision Seeder',
      category: 'tools',
      priority: 'medium',
      estimatedCost: '$1,800',
      image: '/images/seeder.jpg',
      notes: 'Would improve planting efficiency and seed spacing accuracy.',
    },
    {
      id: 103,
      name: 'Automated Fertilizer System',
      category: 'fertilizing',
      priority: 'high',
      estimatedCost: '$3,200',
      image: '/images/auto-fertilizer.jpg',
      notes: 'Required for precise nutrient application in greenhouse expansion.',
    },
    {
      id: 104,
      name: 'Cold Storage Unit',
      category: 'storage',
      priority: 'medium',
      estimatedCost: '$5,000',
      image: '/images/cold-storage.jpg',
      notes: 'Needed for extending produce shelf life and market flexibility.',
    },
    {
      id: 105,
      name: 'Soil Analysis Kit',
      category: 'other',
      priority: 'low',
      estimatedCost: '$800',
      image: '/images/soil-kit.jpg',
      notes: 'Would help optimize soil management and fertilization strategies.',
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

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditSave = (updatedEquipment) => {
    setEquipment(equipment.map(item => 
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
    setEditingEquipment(null);
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEquipment = {
      id: Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      status: formData.get('status'),
      maintenance: formData.get('maintenance'),
      lastService: formData.get('lastService'),
      notes: formData.get('notes'),
      image: '/images/placeholder.jpg',
    };
    setEquipment([...equipment, newEquipment]);
    setShowAddModal(false);
  };

  const handleAddNeededEquipment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEquipment = {
      id: Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      estimatedCost: formData.get('estimatedCost'),
      notes: formData.get('notes'),
      image: '/images/placeholder.jpg',
    };
    setNeededEquipment([...neededEquipment, newEquipment]);
    setShowAddModal(false);
  };

  // Add delete handler for needed equipment
  const handleDeleteNeededEquipment = (id) => {
    setNeededEquipment(neededEquipment.filter(item => item.id !== id));
  };

  // Add edit handler for needed equipment
  const handleEditNeededEquipment = (updatedEquipment) => {
    setNeededEquipment(neededEquipment.map(item => 
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
    setEditingNeededEquipment(null);
  };

  // Calculate equipment statistics based on current view
  const stats = useMemo(() => {
    if (showNeededEquipment) {
      const totalNeeded = neededEquipment.length;
      const highPriority = neededEquipment.filter(item => item.priority === 'high').length;
      const mediumPriority = neededEquipment.filter(item => item.priority === 'medium').length;
      const lowPriority = neededEquipment.filter(item => item.priority === 'low').length;

      return {
        totalItems: totalNeeded,
        available: highPriority,
        inUse: mediumPriority,
        maintenance: lowPriority
      };
    } else {
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
    }
  }, [equipment, neededEquipment, showNeededEquipment]);

  // Update the stats labels based on view mode
  const getStatLabels = () => {
    if (showNeededEquipment) {
      return {
        total: 'Total Needed',
        available: 'High Priority',
        inUse: 'Medium Priority',
        maintenance: 'Low Priority'
      };
    }
    return {
      total: 'Total Items',
      available: 'Available',
      inUse: 'In Use',
      maintenance: 'Maintenance'
    };
  };

  const statLabels = getStatLabels();

  if (isLoading) {
    return (
      <div className="equipment-page-wrapper">
        <div className="equipment-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading equipment...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <span className="stat-label">{statLabels.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.available}</span>
                  <span className="stat-label">{statLabels.available}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.inUse}</span>
                  <span className="stat-label">{statLabels.inUse}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.maintenance}</span>
                  <span className="stat-label">{statLabels.maintenance}</span>
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
                  <button 
                    className="add-equipment-button" 
                    title={`Add New ${showNeededEquipment ? 'Needed' : ''} Equipment`}
                    onClick={() => setShowAddModal(true)}
                  >
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
              {showNeededEquipment ? (
                neededEquipment
                  .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                  .map(item => (
                    <NeededEquipmentCard 
                      key={item.id} 
                      item={item} 
                      onEdit={setEditingNeededEquipment}
                      onDelete={handleDeleteNeededEquipment}
                    />
                  ))
              ) : (
                equipment
                  .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                  .map(item => (
                    <EquipmentCard
                      key={item.id}
                      item={item}
                      onEdit={setEditingEquipment}
                    />
                  ))
              )}
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

        {/* Add Equipment Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="edit-modal" onClick={e => e.stopPropagation()}>
              <h2>Add New {showNeededEquipment ? 'Needed' : ''} Equipment</h2>
              <form onSubmit={showNeededEquipment ? handleAddNeededEquipment : handleAddEquipment}>
                <div className="form-group">
                  <label htmlFor="name">Equipment Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter equipment name..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {showNeededEquipment ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="priority">Priority Level</label>
                      <select
                        id="priority"
                        name="priority"
                        required
                        defaultValue="medium"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="estimatedCost">Estimated Cost</label>
                      <input
                        type="text"
                        id="estimatedCost"
                        name="estimatedCost"
                        required
                        placeholder="$0.00"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        required
                        defaultValue="available"
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
                        required
                        defaultValue="Good"
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
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder={`Add any additional notes about the ${showNeededEquipment ? 'needed' : ''} equipment...`}
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    Add {showNeededEquipment ? 'Needed' : ''} Equipment
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Needed Equipment Modal */}
        {editingNeededEquipment && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit Needed Equipment</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedEquipment = {
                  ...editingNeededEquipment,
                  name: formData.get('name'),
                  category: formData.get('category'),
                  priority: formData.get('priority'),
                  estimatedCost: formData.get('estimatedCost'),
                  notes: formData.get('notes'),
                };
                handleEditNeededEquipment(updatedEquipment);
              }}>
                <div className="form-group">
                  <label htmlFor="name">Equipment Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingNeededEquipment.name}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingNeededEquipment.category}
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
                  <label htmlFor="priority">Priority Level</label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={editingNeededEquipment.priority}
                    required
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedCost">Estimated Cost</label>
                  <input
                    type="text"
                    id="estimatedCost"
                    name="estimatedCost"
                    defaultValue={editingNeededEquipment.estimatedCost}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingNeededEquipment.notes}
                    placeholder="Add any additional notes about the needed equipment..."
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
                    onClick={() => setEditingNeededEquipment(null)}
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
