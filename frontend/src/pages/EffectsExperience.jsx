import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { simulationsRegistry } from '../simulations/simulationsRegistry';
import { SimulationEngine } from '../simulations/SimulationEngine';
import { X, Play, Pause, RefreshCw, Maximize2 } from 'lucide-react';
import './Effects.css';

const SimulationCard = ({ sim, onClick }) => {
  return (
    <div 
      className="effect-card" 
      onClick={() => onClick(sim)}
      tabIndex="0"
    >
      <div className="effect-preview-container">
        {/* We use isDetail = false for the gallery preview */}
        <SimulationEngine simulation={sim} isDetail={false} params={sim.defaultParams} />
      </div>
      <div className="effect-card-info">
        <p className="effect-card-category">{sim.category}</p>
        <h3 className="effect-card-title">{sim.title}</h3>
        <p className="effect-card-desc-small">{sim.description}</p>
      </div>
      <div className="effect-card-footer">
        <span>[ LIVE PREVIEW ]</span>
      </div>
    </div>
  );
};

const EffectsExperience = () => {
  const { user } = useContext(AuthContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSim, setSelectedSim] = useState(null);
  const [simParams, setSimParams] = useState({});
  const [simKey, setSimKey] = useState(0); // Used to force reset

  const categories = useMemo(() => {
    const cats = new Set(simulationsRegistry.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredSims = useMemo(() => {
    if (activeCategory === 'All') return simulationsRegistry;
    return simulationsRegistry.filter(e => e.category === activeCategory);
  }, [activeCategory]);

  const openSim = (sim) => {
    setSelectedSim(sim);
    setSimParams(sim.defaultParams || {});
    setSimKey(prev => prev + 1);
  };

  const resetSim = () => {
    setSimKey(prev => prev + 1);
  };

  const handleParamChange = (key, value) => {
    setSimParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div className="effects-page">
      <div className="effects-header">
        <h1>Digital Science Laboratory</h1>
        <p>Explore {simulationsRegistry.length} advanced mathematical and physical simulations.</p>
      </div>

      <div className="effects-category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="effects-gallery-grid">
        {filteredSims.map(sim => (
          <SimulationCard 
            key={sim.id} 
            sim={sim} 
            onClick={openSim} 
          />
        ))}
      </div>

      {selectedSim && (
        <div className="effect-detail-overlay" onClick={() => setSelectedSim(null)}>
          <div className="effect-detail-content lab-view" onClick={(e) => e.stopPropagation()}>
            <div className="effect-detail-header">
              <div className="effect-detail-info">
                <h2>{selectedSim.title}</h2>
                <p className="effect-detail-desc">{selectedSim.description}</p>
                <p style={{ color: 'var(--color-primary-light)', marginTop: '0.5rem', fontWeight: 600 }}>{selectedSim.category}</p>
              </div>
              <button 
                className="btn-close" 
                onClick={() => setSelectedSim(null)}
                aria-label="Close laboratory view"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="lab-workspace">
              <div className="lab-simulation-area">
                <SimulationEngine 
                  key={simKey}
                  simulation={selectedSim} 
                  isDetail={true} 
                  params={simParams} 
                />
              </div>
              
              <div className="lab-controls-panel">
                <h3 className="controls-title">Parameters</h3>
                {Object.keys(simParams).length > 0 ? (
                  <div className="controls-list">
                    {Object.entries(simParams).map(([key, val]) => (
                      <div key={key} className="control-group">
                        <label>{key}</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <input 
                            type="range" 
                            min={val * 0.1} 
                            max={val * 5 || 100} 
                            step={(val * 5 || 100) / 100}
                            value={val} 
                            onChange={(e) => handleParamChange(key, e.target.value)} 
                            style={{ flex: 1 }}
                          />
                          <span style={{ minWidth: '40px', fontSize: '0.85rem' }}>{val.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-controls">Interaction is mouse-driven for this simulation.</p>
                )}

                <div className="lab-actions">
                  <button className="btn btn-outline" onClick={resetSim}>
                    <RefreshCw size={16} style={{ marginRight: '8px' }} /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectsExperience;
