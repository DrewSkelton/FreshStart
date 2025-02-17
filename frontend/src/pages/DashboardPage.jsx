import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DashboardPage.css"; 
import { getCropColor } from "../components/CropArea";

const DashboardPage = () => {
    const [layouts, setLayouts] = useState([]);
    const [selectedLayoutId, setSelectedLayoutId] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false); 
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showDataView, setShowDataView] = useState(false);
    const [waterTasks, setWaterTasks] = useState([]);
    const [fertTasks, setFertTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        completed: false
    });
    const [todos, setTodos] = useState([
        {
            id: 1,
            title: "Check Irrigation System",
            description: "Inspect sprinklers in Corn field",
            date: "2024-03-20",
            completed: false
        },
        {
            id: 2,
            title: "Fertilizer Application",
            description: "Apply nitrogen fertilizer to Wheat field",
            date: "2024-03-22",
            completed: true
        },
        {
            id: 3,
            title: "Harvest Planning",
            description: "Schedule equipment for tomato harvest",
            date: "2024-03-25",
            completed: false
        }
    ]);

    // Fetch layouts when the component mounts
    useEffect(() => {
        axios.get("http://localhost:3001/layout/get-layouts")
            .then(response => {
                setLayouts(response.data);
                // If there are layouts and no layout is currently selected, select the first one
                if (response.data.length > 0 && !selectedLayoutId) {
                    setSelectedLayoutId(response.data[0]._id);
                }
            })
            .catch(error => console.error("Error fetching layouts:", error));
    }, [selectedLayoutId]);

    // Fetch the selected layout when selectedLayoutId changes
    useEffect(() => {
        if (selectedLayoutId) {
            
            axios.get(`http://localhost:3001/layout/get-layout/${selectedLayoutId}`)
                .then(response => {
                    setSelectedLayout(response.data);
                    console.log("Full layout data:", response.data);
                    console.log("Crop areas:", response.data.crop_areas);
                })
                .catch(error => console.error("Error fetching layout:", error));
        }
    }, [selectedLayoutId]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (selectedLayoutId) {  // Ensure selectedLayoutId exists
                try {
                    const response = await axios.get(`http://localhost:3001/layout/get-layout-tasks/${selectedLayoutId}`);
    
                    // Ensure tasks exist before setting state
                    if (response.data.waterTasks) {
                        setWaterTasks(response.data.waterTasks);
                    }
                    if (response.data.fertTasks) {
                        setFertTasks(response.data.fertTasks);
                    }
    
                    console.log("Water Tasks:", response.data.waterTasks);
                    console.log("Fertilizer Tasks:", response.data.fertTasks);
    
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            }
        };
    
        fetchTasks();
    }, [selectedLayoutId]); 

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTask = (id, e) => {
        e.stopPropagation(); // Prevent task selection when clicking delete
        setTodos(todos.filter(todo => todo.id !== id));
        setSelectedTaskId(null);
    };

    const handleAddTask = () => {
        if (newTask.title.trim() === "") return;
        
        const task = {
            id: Date.now(),
            ...newTask
        };
        
        setTodos([...todos, task]);
        setNewTask({
            title: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            completed: false
        });
        setShowNewTaskModal(false);
    };



    const generateTasks = async () => {
        // setLoading(true);
        // setError(null); // Reset any previous errors
    
        try {
          // Send a GET request to the backend to generate tasks
          const response = await axios.get(`http://localhost:3001/layout/generate-schedule-tasks/${selectedLayoutId}`);
          
          // Handle success (you can show the tasks or any other response)
          console.log('Tasks generated successfully:', response.data);
          // You can trigger state updates here if needed
        } catch (err) {
          console.error('Error generating tasks:', err);
        //   setError('Failed to generate tasks. Please try again.');
        } finally {
        //   setLoading(false); // Stop loading state
        }
      };



    return (
        <div className="layout-wrapper">
        <div className="layout-page">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>
                
                <div className="layout-content">
            {/* Sidebar for Layout List */}
            <div className="layout-list">
                <h2 className="section-title">Saved Layouts</h2>
                <div className="layout-list-content">
                    {layouts.map(layout => (
                        <div 
                            key={layout._id} 
                            className={`layout-card ${selectedLayoutId === layout._id ? "selected" : ""}`}
                            onClick={() => setSelectedLayoutId(layout._id)}
                        >
                            <h3>{layout.name}</h3>
                            <p>Width: {layout.width} | Height: {layout.height}</p>
                        </div>
                    ))}
                    {layouts.length === 0 && (
                        <p className="no-layouts">No layouts saved yet. Create a new layout in the Layout Planner.</p>
                    )}
                </div>
                <button 
                    className="add-layout"
                    onClick={() => window.location.href = '/layout-planning'}
                >
                    <span>+</span> Create New Farm Layout
                </button>
            </div>

            {/* View Layout Panel */}
            <div className="layout-view">
                        <div className="layout-view-header">
                            <h2 className="section-title">Layout Preview</h2>
                            <div className="view-mode-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={showDataView}
                                        onChange={(e) => setShowDataView(e.target.checked)}
                                    />
                                    <div className="slider">
                                        <span className="toggle-label">Layout View</span>
                                        <span className="toggle-label">Data View</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                {selectedLayout ? (
                            <>
                                {showDataView ? (
                                    <div className="layout-stats">
                                        <div className="stat-card">
                                            <h3>Total Area</h3>
                                            <div className="value">{selectedLayout.width * selectedLayout.height}m²</div>
                                            <div className="subtext">Total farm area</div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Crop Areas</h3>
                                            <div className="value">{selectedLayout.crop_areas.length}</div>
                                            <div className="subtext">Different crop sections</div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Utilized Area</h3>
                                            <div className="value">
                                                {Math.round(selectedLayout.crop_areas.reduce((acc, crop) => acc + (crop.width * crop.height), 0))}m²
                                            </div>
                                            <div className="subtext">Total planted area</div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Estimated Total Yield</h3>
                                            <div className="value">
                                                {(() => {
                                                    const yieldEstimates = {
                                                        'Corn': 7.5,      // tons per hectare
                                                        'Wheat': 3.5,     // tons per hectare
                                                        'Tomatoes': 35,   // tons per hectare
                                                        'Potatoes': 25,   // tons per hectare
                                                        'Soybeans': 2.8   // tons per hectare
                                                    };
                                                    
                                                    const totalYield = selectedLayout.crop_areas.reduce((acc, crop) => {
                                                        const areaInHectares = (crop.width * crop.height) / 10000; // convert m² to hectares
                                                        const cropYield = yieldEstimates[crop.cropType] || 0;
                                                        return acc + (areaInHectares * cropYield);
                                                    }, 0);
                                                    
                                                    return selectedLayout.total_yield;
                                                })()}
                                            </div>
                                            <div className="subtext">kg m^2</div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Crop Distribution</h3>
                                            <div className="crop-distribution">
                                                {selectedLayout.crop_areas.reduce((acc, crop) => {
                                                    const existing = acc.find(item => item.type === crop.cropType);
                                                    if (existing) {
                                                        existing.area += crop.width * crop.height;
                                                    } else {
                                                        acc.push({ type: crop.cropType, area: crop.width * crop.height, predictedYield:crop.predictedYield });
                                                    }
                                                    return acc;
                                                }, []).map(crop => (
                                                    <div key={crop.type} className="crop-tag">
                                                        {crop.type} <span className="area">{crop.predictedYield}-kg/m2</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Irrigation Methods</h3>
                                            <div className="method-distribution">
                                                {selectedLayout.crop_areas.reduce((acc, crop) => {
                                                    const existing = acc.find(item => item.method === crop.irrigation);
                                                    if (existing) {
                                                        existing.area += crop.width * crop.height;
                                                    } else {
                                                        acc.push({ method: crop.irrigation, area: crop.width * crop.height });
                                                    }
                                                    return acc;
                                                }, []).map(item => (
                                                    <div key={item.method} className="method-tag">
                                                        {item.method} <span className="area">{Math.round(item.area)}m²</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Fertilizer Types</h3>
                                            <div className="method-distribution">
                                                {selectedLayout.crop_areas.reduce((acc, crop) => {
                                                    const existing = acc.find(item => item.type === crop.fertilizerType);
                                                    if (existing) {
                                                        existing.area += crop.width * crop.height;
                                                    } else {
                                                        acc.push({ type: crop.fertilizerType, area: crop.width * crop.height });
                                                    }
                                                    return acc;
                                                }, []).map(item => (
                                                    <div key={item.type} className="method-tag">
                                                        {item.type} <span className="area">{Math.round(item.area)}m²</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Fertilization Methods</h3>
                                            <div className="method-distribution">
                                                {selectedLayout.crop_areas.reduce((acc, crop) => {
                                                    const existing = acc.find(item => item.method === crop.fertilizerMethod);
                                                    if (existing) {
                                                        existing.area += crop.width * crop.height;
                                                    } else {
                                                        acc.push({ method: crop.fertilizerMethod, area: crop.width * crop.height });
                                                    }
                                                    return acc;
                                                }, []).map(item => (
                                                    <div key={item.method} className="method-tag">
                                                        {item.method} <span className="area">{Math.round(item.area)}m²</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <h3>Crop Area Density</h3>
                                            <div className="method-distribution">
                                                {selectedLayout.crop_areas.reduce((acc, crop) => {
                                                    const existing = acc.find(item => item.type === crop.cropType);
                                                    if (existing) {
                                                        existing.count += 1;
                                                    } else {
                                                        acc.push({ type: crop.cropType, count: 1, density: crop.density });
                                                    }
                                                    return acc;
                                                }, []).map(item => (
                                                    <div key={item.type} className="method-tag">
                                                        {item.type} <span className="area">{item.density}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="layout-canvas-container">
                                        <div className="layout-canvas">
                                            <div style={{
                                                position: "relative",
                                                width: selectedLayout.width,
                                                height: selectedLayout.height,
                                            }}>
                        {selectedLayout.crop_areas.map(crop => (
                            <div
                                key={crop._id}
                                className="crop-area"
                                style={{
                                    width: crop.width,
                                    height: crop.height,
                                    position: "absolute",
                                    left: crop.x,
                                    top: crop.y,
                                                            backgroundColor: getCropColor(crop.cropType),
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                                                            border: "1px solid rgba(67, 135, 59, 0.4)",
                                                            borderRadius: "4px",
                                                        }}
                                                    >
                                                        <p className="crop-type">{crop.cropType}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Select a layout from the list to view its details</p>
                        )}
                    </div>

                    {/* Todo Section */}
                    <div className="todo-section">
                        <h2 className="section-title">To-Do List</h2>
                        {todos.map(todo => (
                            <div 
                                key={todo.id} 
                                className={`todo-item ${selectedTaskId === todo.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTaskId(todo.id === selectedTaskId ? null : todo.id)}
                            >
                                <div 
                                    className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTodo(todo.id);
                                    }}
                                />
                                <div className="todo-content">
                                    <h4>{todo.title}</h4>
                                    <p>{todo.description}</p>
                                    <div className="todo-date">{todo.date}</div>
                                </div>
                                <button 
                                    className="delete-task-button"
                                    onClick={(e) => deleteTask(todo.id, e)}
                                    title="Delete task"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button 
                            className="add-todo"
                            onClick={() => setShowNewTaskModal(true)}
                        >
                            <span>+</span> Add New Task
                        </button>
                    </div>



                    <div className="todo-section">
                            <h2 className="section-title">Tasks List</h2>
                            
                                <>
                                    <div className="tasks-container">
                                        <div className="water-tasks">
                                            <h3>Watering Tasks</h3>
                                            {waterTasks.map(task => (
                                                <div 
                                                    key={task._id}
                                                    className={`task-item ${selectedTaskId === task._id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedTaskId(task._id === selectedTaskId ? null : task._id)}
                                                >
                                                    <div className={`task-status ${task.status}`} />
                                                    <div className="task-content">
                                                        <h4>{task.title}</h4>
                                                        <p>{task.description}</p>
                                                        <div className="task-details">
                                                            <span className="task-date">Date: {task.date}</span>
                                                            <span className="task-time">Time: {task.startTime}</span>
                                                            <span className="task-priority">Priority {task.priority}</span>
                                                        </div>
                                                        <div className="task-specifics">
                                                            <span>Water amount: {task.taskDetails.waterAmount}</span>
                                                            <span>Irrigation: {task.taskDetails.irrigationMethod}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="fertilizer-tasks">
                                            <h3>Fertilizer Tasks</h3>
                                            {fertTasks.map(task => (
                                                <div 
                                                    key={task._id}
                                                    className={`task-item ${selectedTaskId === task._id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedTaskId(task._id === selectedTaskId ? null : task._id)}
                                                >
                                                    <div className={`task-status ${task.status}`} />
                                                    <div className="task-content">
                                                        <h4>{task.title}</h4>
                                                        <p>{task.description}</p>
                                                        <div className="task-details">
                                                            <span className="task-date">Date: {task.date}</span>
                                                            <span className="task-time">Time: {task.startTime}</span>
                                                            <span className="task-priority">Priority {task.priority}</span>
                                                        </div>
                                                        <div className="task-specifics">
                                                            <span>Fertilizer {task.taskDetails.fertilizerType}</span>
                                                            <span>Amount: {task.taskDetails.fertilizerAmount}</span>
                                                            <span>Application: {task.taskDetails.applicationMethod}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        className="generate-tasks-button"
                                        onClick={generateTasks}
                                    >
                                        <span>🔄</span> Generate Schedule Tasks
                                    </button>
                                </>
                            
                        </div>



                    {/* New Task Modal */}
                    {showNewTaskModal && (
                        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
                            <div className="task-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Add New Task</h2>
                                    <button 
                                        className="close-button"
                                        onClick={() => setShowNewTaskModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="modal-content">
                                    <div className="form-group">
                                        <label htmlFor="title">Task Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                            placeholder="Enter task title..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                            placeholder="Enter task description..."
                                            rows="4"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="date">Due Date</label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={newTask.date}
                                            onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        className="save-button"
                                        onClick={handleAddTask}
                                    >
                                        Add Task
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={() => setShowNewTaskModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
