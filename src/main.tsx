import p5 from "p5";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createSketch, numericParameterDefs, initParameterStore, ParameterStore } from "./sketch";
import { createSketch as createSketch2, numericParameterDefs as numericParameterDefs2, initParameterStore as initParameterStore2, ParameterStore as ParameterStore2 } from "./reflections";
import { createSketch as createSketch3, numericParameterDefs as numericParameterDefs3, initParameterStore as initParameterStore3, ParameterStore as ParameterStore3 } from "./transparency_test";
import { createSketch as createSketch4, numericParameterDefs as numericParameterDefs4, initParameterStore as initParameterStore4, ParameterStore as ParameterStore4 } from "./melted_text";
import { createSketch as createSketch5, numericParameterDefs as numericParameterDefs5, initParameterStore as initParameterStore5, ParameterStore as ParameterStore5 } from "./red_rain";
import { createSketch as createSketch6, numericParameterDefs as numericParameterDefs6, initParameterStore as initParameterStore6, ParameterStore as ParameterStore6 } from "./white_wing";
// Define sketch types for organization
type SketchType = "default";

// Create a global function to cycle sketches that can be called from outside React
let cycleSketch: () => void = () => {
  if (p5Instance) {
    (p5Instance as any).nextStanza();
  }
};

// Create a map of sketch configurations
const sketchConfigs = {
  default: {
    name: "antigone",
    title: "antigone",
    createSketch: createSketch,
    parameterDefs: numericParameterDefs,
    initStore: initParameterStore
  },
};

// Create initial parameter store
let parameterStore: any = initParameterStore();
let p5Instance: p5;

// Entrypoint code
function main(rootElement: HTMLElement) {
  // First, create a container element for the canvas
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'canvas-container';
  rootElement.appendChild(canvasContainer);
  
  // Create a p5 instance in instance mode, targeting our new container
  p5Instance = new p5(createSketch(parameterStore), canvasContainer);
  
  // Add event listener to ensure proper centering after canvas is created
  setTimeout(() => {
    const canvas = document.querySelector('.p5Canvas');
    if (canvas) {
      // Do minimal styling on the canvas itself
      (canvas as HTMLElement).style.display = 'block';
    }
  }, 100);
}

// Add this function to get initial sketch type from URL
function getInitialSketchType(): SketchType {
  const urlParams = new URLSearchParams(window.location.search);
  const sketchIndex = parseInt(urlParams.get('n') || '0');
  const sketchTypes = Object.keys(sketchConfigs) as SketchType[];
  
  // Ensure the index is valid
  if (sketchIndex >= 0 && sketchIndex < sketchTypes.length) {
    return sketchTypes[sketchIndex];
  }
  return 'default'; // fallback to default if invalid index
}

// Split the React component into two parts: Title and Controls
function TitleComponent() {
  const [sketchType, setSketchType] = useState<SketchType>(getInitialSketchType());
  
  // Add global click handler
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      // Check if the click target is a UI element
      const target = e.target as HTMLElement;
      const isUIElement = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.closest('.controls-panel') || 
        target.classList.contains('next-sketch-button');
      
      // If it's not a UI element, advance to next stanza
      if (!isUIElement) {
        cycleSketch();
      }
    }
    
    // Add event listener
    document.addEventListener('click', handleDocumentClick);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []); // Remove sketchType dependency since we're not changing sketches anymore

  // Get the current title from the sketchConfig
  const currentTitle = sketchConfigs[sketchType].title;

  // Update the document title when the sketch changes
  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  useEffect(() => {
    const config = sketchConfigs[sketchType];
    
    const newParams = config.initStore();
    
    parameterStore = newParams;
    
    if (p5Instance) {
      p5Instance.remove();
    }
    
    p5Instance = new p5(config.createSketch(parameterStore), rootEl!);
    
    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [sketchType]);

  return (
    <div className="title-container">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        {/* {currentTitle} */}
      </h1>
      <h3 className="text-sm font-medium text-center mb-8 text-gray-600">
        
      </h3>
    </div>
  );
}

function TestApp() {
  const [showParams, setShowParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
  });
  
  // Add state for parameter values
  const [paramValues, setParamValues] = useState(parameterStore);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (showParams) {
      url.searchParams.set('debug', 'true');
    } else {
      url.searchParams.delete('debug');
    }
    window.history.replaceState({}, '', url);
  }, [showParams]);

  return (
    <>
      {/* Next Stanza button is now outside the conditional rendering */}
      <button 
        className="next-sketch-button"
        onClick={cycleSketch}
      >
        Next
      </button>

      {/* Only render the controls panel if showParams is true */}
      {showParams && (
        <div className="controls-panel">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setShowParams(!showParams)}
              className="ml-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {showParams ? 'Hide Parameters' : 'Show Parameters'}
            </button>
          </div>
          
          <h2 className="text-xl font-bold mb-6 text-gray-700">Parameters</h2>
          {Object.entries(sketchConfigs.default.parameterDefs).map(([key, value]) => (
            <div key={key} className="mb-4 flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">{key}</label>
              <input
                type="range"
                min={value.min}
                max={value.max}
                step={value.step}
                value={paramValues[key as keyof typeof paramValues]}
                className="flex-grow"
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  const newParams = { ...paramValues, [key]: newValue };
                  setParamValues(newParams);
                  parameterStore[key as keyof typeof parameterStore] = newValue;
                  
                  // Update parameters in the running sketch
                  if (p5Instance) {
                    (p5Instance as any).updateParameters(parameterStore);
                  }
                }}
              />
              <span className="w-16 text-right text-gray-600">
                {paramValues[key as keyof typeof paramValues]}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Render the title component to the title-root div
const titleContainer = document.getElementById("title-root");
if (titleContainer) {
  const titleRoot = createRoot(titleContainer);
  titleRoot.render(<TitleComponent />);
}

// Render the controls to the original react-root div
const container = document.getElementById("react-root");
if (!container) {
  throw new Error("Cannot find element root #react-root");
}
const root = createRoot(container);
root.render(<TestApp />);

// Initialize the P5 instance
const rootEl = document.getElementById("p5-root");
if (!rootEl) {
  throw new Error("Cannot find element root #p5-root");
}
main(rootEl);
