import p5 from "p5";
import blurFrag from './blur.frag?raw'
import targetFadeFrag from './target_fade.frag?raw'
import borderFadeFrag from './border_fade.frag?raw'
// Parameter definitions moved from main.tsx to here
export const numericParameterDefs = {
  "timeMultiplier": {
    "min": 0,
    "max": 5.0,
    "step": 0.01,
    "defaultValue": 1.0, 
  },
  "particleMaxCount": {
    "min": 10,
    "max": 5000, 
    "step": 10,
    "defaultValue": 1000,
  },
  "particleForceStrength": {
    "min": 0.01,
    "max": 0.5,
    "step": 0.01,
    "defaultValue": 0.1,
  },
  "particleMaxSpeed": {
    "min": 0.5,
    "max": 5,
    "step": 0.1,
    "defaultValue": 2.6,
  },
  "particleTrailWeight": {
    "min": 1,
    "max": 5,
    "step": 0.5,
    "defaultValue": 1,
  },  
  "particleNoiseStrength": {
    "min": 0.0,
    "max": 16.0,
    "step": 0.1,
    "defaultValue": 13.0,
  },
  "particleNoiseOffset": {
    "min": 0.0,
    "max": 6.3,
    "step": 0.1,
    "defaultValue": 4.6,
  },
  "particleTrailFadeStrength": {
    "min": 0.0,
    "max": 0.2,
    "step": 0.0001,
    "defaultValue": 0.003,
  },
  "textSize": {
    "min": 10,
    "max": 200,
    "step": 5,
    "defaultValue": 120,
  },
  "maxWordCount": {
    "min": 1,
    "max": 25,
    "step": 1,
    "defaultValue": 15,
  },
};

export const stanzas = [
  [""],
  ["Antigone"],
  [ "", "", 
    "shaft", "of", "the", "sun", "fairest", "light", "of", "all", "that", "have",
    "dawned", "on", "thebes", "of", "the", "seven", "gates", "you", "have", "shone",
    "forth", "at", "last", "eye", "of", "golden", "day", "advancing", "over", "dirce's",
    "streams", "you", "have", "goaded", "with", "a", "sharper", "bit", "the", "warrior",
    "of", "the", "white", "shield", "who", "came", "from", "argos", "in", "full",
    "armor", "driving", "him", "to", "headlong", "retreat"
  ],
  [ "", "", 
    "he", "set", "out", "against", "our", "land", "because", "of", "the", "strife-filled",
    "claims", "of", "polyneices", "and", "like", "a", "screaming", "eagle", "he", "flew",
    "over", "into", "our", "land", "covered", "by", "his", "snow-white", "wing", "with",
    "a", "mass", "of", "weapons", "and", "crested", "helmets"
  ],
  [ "", "", 
    "he", "paused", "above", "our", "dwellings", "he", "gaped", "around", "our", "sevenfold",
    "portals", "with", "spears", "thirsting", "for", "blood", "but", "he", "left", "before",
    "his", "jaws", "were", "ever", "glutted", "with", "our", "gore", "or", "before",
    "the", "fire-god's", "pine-fed", "flame", "had", "seized", "our", "crown", "of", "towers",
    "so", "fierce", "was", "the", "crash", "of", "battle", "swelling", "about", "his",
    "back", "a", "match", "too", "hard", "to", "win", "for", "the", "rival",
    "of", "the", "dragon"
  ],
  [ "", "", 
    "for", "zeus", "detests", "above", "all", "the", "boasts", "of", "a", "proud",
    "tongue", "and", "when", "he", "saw", "them", "advancing", "in", "a", "swollen",
    "flood", "arrogant", "their", "clanging", "gold", "he", "dashed", "with", "brandished", "fire",
    "one", "who", "was", "already", "starting", "to", "shout", "victory", "when", "he",
    "had", "reached", "our", "ramparts"
  ],
  [ "", "", 
    "staggered", "he", "fell", "to", "the", "earth", "with", "a", "crash", "torch",
    "in", "hand", "a", "man", "possessed", "by", "the", "frenzy", "of", "the",
    "mad", "attack", "who", "just", "now", "was", "raging", "against", "us", "with",
    "the", "blasts", "of", "his", "tempestuous", "hate", "but", "his", "threats", "did",
    "not", "fare", "as", "he", "had", "hoped", "and", "to", "the", "other",
    "enemies", "mighty", "ares", "dispensed", "each", "their", "own", "dooms", "with", "hard",
    "blows", "ares", "our", "mighty", "ally", "at", "the", "turning-point"
  ],
  [ "", "", 
    "for", "the", "seven", "captains", "stationed", "against", "an", "equal", "number", "at",
    "the", "seven", "gates", "left", "behind", "their", "brazen", "arms", "in", "tribute",
    "to", "zeus", "the", "turner", "of", "battle", "all", "but", "the", "accursed",
    "pair", "who", "born", "of", "one", "father", "and", "one", "mother", "set",
    "against", "each", "other", "their", "spears", "both", "victorious", "and", "who", "now",
    "share", "in", "a", "common", "death"
  ],
  [ "", "", 
    "but", "since", "victory", "whose", "name", "is", "glory", "has", "come", "to",
    "us", "smiling", "in", "joy", "equal", "to", "the", "joy", "of", "chariot-rich",
    "thebes", "let", "us", "make", "for", "ourselves", "forgetfulness", "after", "the", "recent",
    "wars", "and", "visit", "all", "the", "temples", "of", "the", "gods", "with",
    "night-long", "dance", "and", "song", "and", "may", "bacchus", "who", "shakes", "the",
    "earth", "of", "thebes", "rule", "our", "dancing"
  ],
  [""]
];

// This type represents the parameter store structure
export type ParameterStore = {
  [K in keyof typeof numericParameterDefs]: number;
};

// Create initialization function here too
export function initParameterStore(): ParameterStore {
  // Initialize from default values in the parameter definitions
  const store = {} as ParameterStore;
  
  Object.entries(numericParameterDefs).forEach(([key, def]) => {
    store[key as keyof ParameterStore] = def.defaultValue;
  });
  
  return store;
}

// Function to convert hex color to vec3
function hexToVec3(hex: string): [number, number, number] {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex string into RGB components
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Convert to 0.0-1.0 range
  return [r / 255, g / 255, b / 255];
}

// This function creates the p5 sketch
export function createSketch(parameterStore: ParameterStore) {
  let currentParams = parameterStore;
  
  return function sketch(p: p5) {
    let font: p5.Font;
    let startTime = p.millis();
    let foreground;
    let particleLayer;

    let blurShader;
    let fadeShader;
    let stanzaIndex = 0;
    let lineWeight = parameterStore.particleTrailWeight;
    let noiseStrength = parameterStore.particleNoiseStrength;
    let noiseOffset = parameterStore.particleNoiseOffset;
    let particleCount = parameterStore.particleMaxCount;
    let forceClearWords = false;
    
    // Add state management
    let currentState = -1;
    let stanzaPosition = -1;
    const states = [

      { backgroundColor: "#2B2B28", foregroundColor: "#F8F8F8", textColor: "#E3B04B", stanza: 1, lineWeight: 1.5, particleCount: 5000, noiseStrength: 3.0, noiseOffset: 0, title: "Antigone" }, // intro
      { backgroundColor: "#2B2B28", foregroundColor: "#F8F8F8", textColor: "#E3B04B", stanza: 2, lineWeight: 1.5, particleCount: 5000, noiseStrength: 3.0, noiseOffset: 0, title: "Stanza 1" }, // white/gold - first stanza
      { backgroundColor: "#3E1414", foregroundColor: "#E3B04B", textColor: "#F8F8F8", stanza: 3, lineWeight: 1, particleCount: 5000, noiseStrength: 3.0, noiseOffset: 4.5, title: "Stanza 2"}, // white text, gold foreground, red background - second stanza
      { backgroundColor: "#2B2B28", foregroundColor: "#E3B04B", textColor: "#2B2B28", stanza: 4, lineWeight: 1, particleCount: 5000, noiseStrength: 13.0, noiseOffset: 4.6, title: "Stanza 3"}, // dark red/gold/black text - third stanza
      { backgroundColor: "#B08000", foregroundColor: "#A31D1D", textColor: "#570F0F", stanza: 5, lineWeight: 1.5, particleCount: 5000, noiseStrength: 5.0, noiseOffset: 0.5, title: "Stanza 4"}, // gold background, red foreground - fourth stanza
      { backgroundColor: "#3E1414", foregroundColor: "#D63447", textColor: "#3E1414", stanza: 6, lineWeight: 1.5, particleCount: 5000, noiseStrength: 13.0, noiseOffset: 4.6, title: "Stanza 5"}, // dark red/light red - fifth stanza
      { backgroundColor: "#2B2B28", foregroundColor: "#A31D1D", textColor: "#2A1A5E", stanza: 7, lineWeight: 2, particleCount: 5000, noiseStrength: 13.0, noiseOffset: 4.6, title: "Stanza 6" }, // dark red/black/purple - sixth stanza  
      { backgroundColor: "#2A1A5E", foregroundColor: "#D63447", textColor: "#E3B04B", stanza: 8, lineWeight: 1.5, particleCount: 5000, noiseStrength: 3.0, noiseOffset: 0.35, title: "Stanza 7" }, // nice yellow/purple/brighter red - last stanza
      { backgroundColor: "#2A1A5E", foregroundColor: "#D63447", textColor: "#E3B04B", stanza: 9, lineWeight: 1, particleCount: 5000, noiseStrength: 13.0, noiseOffset: 4.6, title: "fin" }, // nice yellow/purple/brighter red - outro
  ];

    // let backgroundColor = "#2B2B28";
    // let foregroundColor = "#A31D1D";
    // let textColor = "#6D2323";


    // Add method to advance to next state
    (p as any).nextStanza = () => {
      currentState = (currentState + 1) % states.length;
      const state = states[currentState];
      backgroundColor = state.backgroundColor;
      foregroundColor = state.foregroundColor;
      textColor = state.textColor;
      stanzaIndex = state.stanza;
      stanzaPosition = -1;
      lineWeight = state.lineWeight;
      noiseStrength = state.noiseStrength;
      noiseOffset = state.noiseOffset;
      particleCount = state.particleCount;
      forceClearWords = true;
    };

    interface SimpleParticle {
      pos: p5.Vector;
      vel: p5.Vector;
      acc: p5.Vector;
      prevPos: p5.Vector;
    }
    
    // Array to store particles
    let particles: SimpleParticle[] = [];

    // Create a new particle with vector properties
    function createParticle(x: number, y: number): SimpleParticle {
      const pos = p.createVector(x, y);
      return {
        pos: pos,
        vel: p.createVector(0, 0),
        acc: p.createVector(0, 0),
        prevPos: pos.copy()
      };
    }
    
    // Update particle physics
    function updateParticle(particle: SimpleParticle, flowAngle: number, updateVelocity: boolean = true): void {
      // Save previous position for drawing
      particle.prevPos.set(particle.pos);
      
      // Create a force vector from the flow field angle
      const force = p5.Vector.fromAngle(flowAngle);
      force.mult(parameterStore.particleForceStrength); // Force magnitude from parameters
      
      if (updateVelocity) {
        // Apply force to acceleration
        particle.acc.add(force);
        
        // Update velocity with acceleration
        particle.vel.add(particle.acc);
      
        // Limit velocity to prevent excessive speed - use parameter
        particle.vel.limit(parameterStore.particleMaxSpeed);
      }
      
      // Update position with velocity
      particle.pos.add(particle.vel);
      
      // Reset acceleration for next frame
      particle.acc.mult(0);
      
      // Handle edges by wrapping around
      if (particle.pos.x < 0) {
        particle.pos.x = p.width;
        particle.prevPos.x = p.width;
      }
      if (particle.pos.x > p.width) {
        particle.pos.x = 0;
        particle.prevPos.x = 0;
      }
      if (particle.pos.y < 0) {
        particle.pos.y = p.height;
        particle.prevPos.y = p.height;
      }
      if (particle.pos.y > p.height) {
        particle.pos.y = 0;
        particle.prevPos.y = 0;
      }
    }


    // Expose a method to update parameters
    (p as any).updateParameters = (newParams: ParameterStore) => {
      currentParams = newParams;
    };
   
    p.preload = function() {
      // can preload assets here...
      font = p.loadFont(
        new URL("/public/fonts/inconsolata.otf", import.meta.url).href
      );
    };
    // // very pretty dark red/gold    
    // let backgroundColor = "#3E1414";
    // let foregroundColor = "#E3B04B";
    // let textColor = "#570F0F";

    // dark red/gold/white text - second stanza
    let backgroundColor = states[0].backgroundColor;
    let foregroundColor = states[0].foregroundColor; // 2A1A5E
    let textColor = states[0].textColor;


    // nice yellow/purple    
    // let backgroundColor = "#2A1A5E";
    // let foregroundColor = "#E3B04B";
    // let textColor = "#F8F8F8";

    // nice yellow/purple/brighter red - last stanza
    // let backgroundColor = "#2A1A5E";
    // let foregroundColor = "#D63447";
    // let textColor = "#E3B04B";

    //try the bright red with dark red background, very nice
    // let backgroundColor = "#3E1414";
    // let foregroundColor = "#D63447";
    // let textColor = "#3E1414";

    // gold/red (very nice!)
    // let backgroundColor = "#3E1414";
    // let foregroundColor = "#D63447";
    // let textColor = "#E3B04B";

    // grey/white - intro maybe?
    // let backgroundColor = "#2B2B28";
    // let foregroundColor = "#F8F8F8";
    // let textColor = "#2B2B28";

    // white/gold - first stanza
    // let backgroundColor = "#2B2B28";
    // let foregroundColor = "#F8F8F8";
    // let textColor = "#E3B04B";


    // gold/red (very nice!)
    // let backgroundColor = "#2B2B28";
    // let foregroundColor = "#E3B04B";
    // let textColor = "#570F0F";

    //black/red too gothic
    // let backgroundColor = "#2B2B28";
    // let foregroundColor = "#A31D1D";
    // let textColor = "#6D2323";

    // black on red very cool, legible with weight 3
    // let backgroundColor = "#3E1414";
    // let foregroundColor = "#250C0C";
    // let textColor = "#570F0F";


    p.setup = function() {
      // Keep the fixed dimensions - this is the actual size of your visualization
      p.createCanvas(1200, 600, p.P2D);
      p.frameRate(30);
      // p.pixelDensity(1);
      foreground = p.createGraphics(1200, 600, p.P2D);
      foreground.pixelDensity(1);
      foreground.textFont(font);
      foreground.clear("#000000FF");
      // // Make sure we're using the right coordinate system
      // p.translate(-p.width/2, -p.height/2); // Move to top-left for image drawing
      
      // Fix any potential canvas styling issues
      const canvas = document.querySelector('.p5Canvas');
      if (canvas) {
        (canvas as any).style.margin = '0 auto';
        (canvas as any).style.display = 'block';
      }

      blurShader = (p as any).createFilterShader(blurFrag);
      console.log("blurShader", blurShader);

      fadeShader = (p as any).createFilterShader(borderFadeFrag);
      console.log("fadeShader", fadeShader);

      // draw a black background
      foreground.background(backgroundColor);

      p.background(backgroundColor);
      
    }
    

    let frameCount = 0;
    let prevTime = 0;
    let currentTime = 0;

    let wordCount = 0
    p.draw = function() {
      if (frameCount == 0) {
        foreground.background("#000000FF");
      }
      frameCount++;

      // Make comment match the actual value
      // const frameRate = 30; // Simulate 30fps
      let frameRate = 30
      const deltaTimePerFrame = 1000 / frameRate;
      const currentTime = frameCount * deltaTimePerFrame;

        
      // p.translate(-p.width/2, -p.height/2);

      // let drawFrameInterval = Math.ceil(frameRate * currentParams.timeMultiplier);
      let drawFrameInterval = 20;
      
      if (frameCount % drawFrameInterval == 0) {
        let poemWords = stanzas[stanzaIndex];
        stanzaPosition++;
        if (poemWords.length > 0 && stanzaPosition < poemWords.length) {
          let clearProb = wordCount / parameterStore.maxWordCount;
          if (p.random() < clearProb) {
            foreground.background("#000000FF");
            wordCount = 0;
          } else if (forceClearWords) {
            foreground.background("#000000FF");
            wordCount = 0;
            forceClearWords = false;
          }
  

          let wordIndex = stanzaPosition;
          let word = poemWords[wordIndex];
          let textSize = parameterStore.textSize;
          // compute the bounding box of the text box
          let textBox = font.textBounds(word, 0, 0, textSize);
          console.log("textBox", textBox);
          let textBoxWidth = textBox["w"];
          let textBoxHeight = textBox["h"];
  
  
          // draw text with a 50px border on all sides
          let x = p.random(50, p.width - textBoxWidth - 50);
          let y = p.random(50, p.height - textBoxHeight - 50);
          // p.textFont(font);
          foreground.fill("#FFFFFF");
          // foreground.stroke("#FF0000");
          foreground.textSize(textSize);
          foreground.text(word, x, y + textBoxHeight);
  
          wordCount++;
        }   
      }
      else {
        // p.blendMode(p.ADD);
        // p.image(foreground, 0, 0);


      }
      p.blendMode(p.BLEND);
      fadeShader.setUniform("fadeStrength", parameterStore.particleTrailFadeStrength);
      p.filter(fadeShader);
      // p.filter(p.BLUR,1)
      // blurShader.setUniform("fadeStrength", 0.9998);
      // blurShader.setUniform("texelSize", [1.0, 0.0]);
      // p.filter(blurShader);
      // blurShader.setUniform("texelSize", [0.0, 1.0]);
      // p.filter(blurShader);

      // make sure there are exactly the right number of particles
      // Maximum number of particles - now from parameters
      while (particles.length > particleCount) {
        particles.shift(); // Remove oldest particles if we have too many
      }

      while (particles.length < particleCount) {
        particles.push(createParticle(p.random(0, p.width), p.random(0, p.height)));
      }

      // update the particles
      for (let i = 0; i < particles.length; i++) {
        // calculate the angle of the particle
        let noiseVector = noiseStrength * p.noise(particles[i].pos.x, particles[i].pos.y, currentTime);
        let angle = noiseOffset + noiseVector * Math.PI;
//        let angle = p.map(noiseVector, -1, 1, 0, 2 * Math.PI);
        updateParticle(particles[i], angle);
      }

      foreground.loadPixels();

      // draw the particles
      for (let i = 0; i < particles.length; i++) {
        // console.log("drawing particle", particles[i].pos.x, particles[i].pos.y, particles[i]);
        let pixelIndex = (Math.floor(particles[i].pos.y) * foreground.width + Math.floor(particles[i].pos.x)) * 4;
        // console.log("pixelIndex", pixelIndex);

        let prevPixelIndex = (Math.floor(particles[i].prevPos.y) * foreground.width + Math.floor(particles[i].prevPos.x)) * 4;

        // let foregroundlayerColor = foreground.get(particles[i].pos.x, particles[i].pos.y);
        let foregroundlayerColor = foreground.pixels[pixelIndex] || 0;
        let prevForegroundlayerColor = foreground.pixels[prevPixelIndex] || 0;
        // console.log("foregroundColor", foregroundlayerColor);
        // if (foregroundlayerColor > 0 || prevForegroundlayerColor > 0) {
        if (foregroundlayerColor > 1) {

          // console.log("drawing TEXT particle", particles[i].pos.x, particles[i].pos.y, foregroundColor);
          // p.fill("#441752");
          // p.fill("#FFD500")
          // p.fill("#F95454")
          p.fill(textColor)
          p.circle(particles[i].pos.x, particles[i].pos.y, 1.5 * lineWeight);

        } else {
          // console.log("drawing NORMAL particle");
          p.fill(foregroundColor);
          // p.fill("#9D1B1B")
          p.circle(particles[i].pos.x, particles[i].pos.y, lineWeight);
        // p.stroke("#092734");
        // p.strokeWeight(1);
        // p.line(particles[i].pos.x, particles[i].pos.y, particles[i].prevPos.x, particles[i].prevPos.y);

        }
        p.noStroke();


      }

      // Set the target color uniform using p5's color function
      // const targetColorHex = "#A31D1D"; // Example hex color
      const targetColorHex = backgroundColor;
      const targetColor = p.color(targetColorHex);
      const targetColorVec3 = [p.red(targetColor) / 255, p.green(targetColor) / 255, p.blue(targetColor) / 255];
      fadeShader.setUniform("targetColor", targetColorVec3);

    }
    // console.log("blurShader", blurShader);




  };
}