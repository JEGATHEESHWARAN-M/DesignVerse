/**
 * DESIGNVERSE — VOICE & NATURAL LANGUAGE AI COMMAND ENGINE (STAGE 2)
 * Web Speech Recognition, Spatial Intent Parser, Relative Positioning,
 * and 3D Scene Mutation Engine.
 */

export class VoiceCommandEngine {
  constructor(appState, catalogRef, syncCallback, toastCallback) {
    this.state = appState;
    this.catalog = catalogRef;
    this.syncCallback = syncCallback;
    this.toastCallback = toastCallback;
    this.isListening = false;
    this.recognition = null;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.toastCallback) this.toastCallback('🎙️ Listening for voice command...');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.toastCallback) this.toastCallback(`🗣️ "${transcript}"`);
        this.processCommand(transcript);
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        console.warn('Speech recognition error:', e.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      if (this.toastCallback) this.toastCallback('⚠️ Web Speech API not supported on this device. Type command in text box.');
      return false;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return false;
    } else {
      try {
        this.recognition.start();
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }

  /**
   * Main Intent Parsing & 3D Scene Mutation Loop
   */
  processCommand(text) {
    if (!text || typeof text !== 'string') return;
    const lower = text.toLowerCase().trim();

    // 1. Color / Material Changes (e.g. "change sofa to blue", "make wall white")
    if (lower.includes('color') || lower.includes('to blue') || lower.includes('to red') || lower.includes('to green') || lower.includes('to white') || lower.includes('to dark') || lower.includes('to wood')) {
      if (this.handleColorCommand(lower)) return;
    }

    // 2. Spatial Relative Positioning (e.g. "move table closer to sofa", "move sofa right")
    if (lower.includes('move') || lower.includes('closer') || lower.includes('further') || lower.includes('shift')) {
      if (this.handleSpatialCommand(lower)) return;
    }

    // 2.5. Furniture Rotation in User Needed Directions (e.g. "rotate chair left", "turn sofa 90 degrees", "face table front")
    if (lower.includes('rotate') || lower.includes('turn') || lower.includes('face') || lower.includes('spin')) {
      if (this.handleRotationCommand(lower)) return;
    }

    // 3. AI Style Transformation (e.g. "make it modern", "make it scandinavian", "luxury style")
    if (lower.includes('modern') || lower.includes('scandi') || lower.includes('scandinavian') || lower.includes('luxury') || lower.includes('office')) {
      if (this.handleStyleCommand(lower)) return;
    }

    // 4. Item Insertion or Deletion (e.g. "add lamp", "delete sofa", "remove table")
    if (lower.includes('add') || lower.includes('insert') || lower.includes('delete') || lower.includes('remove')) {
      if (this.handleItemMutationCommand(lower)) return;
    }

    if (this.toastCallback) {
      this.toastCallback(`✨ Recognized: "${text}". Adjusting 3D scene...`);
    }
  }

  handleColorCommand(cmd) {
    let targetColor = '#3A66FF';
    let colorName = 'blue';

    if (cmd.includes('red')) { targetColor = '#ef4444'; colorName = 'red'; }
    else if (cmd.includes('green')) { targetColor = '#22c55e'; colorName = 'green'; }
    else if (cmd.includes('white')) { targetColor = '#ffffff'; colorName = 'white'; }
    else if (cmd.includes('dark') || cmd.includes('black')) { targetColor = '#1e1c24'; colorName = 'dark charcoal'; }
    else if (cmd.includes('gold') || cmd.includes('yellow')) { targetColor = '#FFC800'; colorName = 'gold'; }
    else if (cmd.includes('purple')) { targetColor = '#a855f7'; colorName = 'purple'; }

    // Check if target is wall or specific item
    if (cmd.includes('wall') || cmd.includes('walls')) {
      this.state.room.wallColor = targetColor;
      if (this.syncCallback) this.syncCallback();
      if (this.toastCallback) this.toastCallback(`🎨 Changed room wall paint to ${colorName}`);
      return true;
    }

    // Target specific furniture item (e.g. sofa, chair, table, bed)
    let found = null;
    this.state.items.forEach(item => {
      if (cmd.includes(item.type) || cmd.includes(item.name.toLowerCase())) {
        item.color = targetColor;
        found = item;
      }
    });

    if (found) {
      if (this.syncCallback) this.syncCallback();
      if (this.toastCallback) this.toastCallback(`🎨 Changed ${found.name} color to ${colorName}`);
      return true;
    }

    return false;
  }

  handleSpatialCommand(cmd) {
    // Find subject item (e.g. table, sofa, desk)
    let subject = null;
    this.state.items.forEach(item => {
      if (cmd.includes(item.type) || cmd.includes(item.name.toLowerCase())) {
        subject = item;
      }
    });

    if (!subject && this.state.items.length > 0) {
      subject = this.state.items[0]; // fallback to first item
    }

    if (!subject) return false;

    // Determine direction or target relation
    if (cmd.includes('left')) {
      subject.x = Math.max(-this.state.room.width / 2 + 0.5, subject.x - 0.5);
    } else if (cmd.includes('right')) {
      subject.x = Math.min(this.state.room.width / 2 - 0.5, subject.x + 0.5);
    } else if (cmd.includes('forward') || cmd.includes('front') || cmd.includes('closer')) {
      subject.z = Math.max(-this.state.room.length / 2 + 0.5, subject.z - 0.5);
    } else if (cmd.includes('back') || cmd.includes('backward') || cmd.includes('further')) {
      subject.z = Math.min(this.state.room.length / 2 - 0.5, subject.z + 0.5);
    }

    subject.x = Math.round(subject.x * 10) / 10;
    subject.z = Math.round(subject.z * 10) / 10;

    if (this.syncCallback) this.syncCallback();
    if (this.toastCallback) this.toastCallback(`📍 Moved ${subject.name} to position [${subject.x}m, ${subject.z}m]`);
    return true;
  }

  handleRotationCommand(cmd) {
    let subject = null;
    this.state.items.forEach(item => {
      if (cmd.includes(item.type) || cmd.includes(item.name.toLowerCase())) {
        subject = item;
      }
    });

    if (!subject && this.state.selectedItemId) {
      subject = this.state.items.find(i => i.id === this.state.selectedItemId);
    }
    if (!subject && this.state.items.length > 0) {
      subject = this.state.items[0];
    }
    if (!subject) return false;

    let desc = '';
    if (cmd.includes('front') || cmd.includes('north')) {
      subject.rotation = 0;
      desc = 'facing Front (0°)';
    } else if (cmd.includes('back') || cmd.includes('south')) {
      subject.rotation = Math.PI;
      desc = 'facing Back (180°)';
    } else if (cmd.includes('right') || cmd.includes('east')) {
      subject.rotation = Math.PI / 2;
      desc = 'facing Right (90°)';
    } else if (cmd.includes('left') || cmd.includes('west')) {
      subject.rotation = (3 * Math.PI) / 2;
      desc = 'facing Left (270°)';
    } else if (cmd.includes('180')) {
      subject.rotation = (subject.rotation || 0) + Math.PI;
      desc = '180 degrees';
    } else if (cmd.includes('90')) {
      subject.rotation = (subject.rotation || 0) + Math.PI / 2;
      desc = '90 degrees';
    } else {
      subject.rotation = (subject.rotation || 0) + Math.PI / 4;
      desc = '45 degrees';
    }

    // Normalize rotation [0, 2*PI)
    subject.rotation = ((subject.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    if (this.syncCallback) this.syncCallback();
    if (this.toastCallback) this.toastCallback(`🔄 Rotated ${subject.name} ${desc}`);
    return true;
  }

  handleStyleCommand(cmd) {
    let style = 'modern';
    if (cmd.includes('scandi') || cmd.includes('scandinavian')) style = 'scandi';
    else if (cmd.includes('luxury')) style = 'luxury';
    else if (cmd.includes('office')) style = 'office';

    if (cmd.includes('scandi')) {
      this.state.room.floorType = 'hardwood';
      this.state.room.wallColor = '#f5f5f0';
    } else if (cmd.includes('luxury')) {
      this.state.room.floorType = 'marble';
      this.state.room.wallColor = '#1e1c24';
    } else {
      this.state.room.floorType = 'parquet';
      this.state.room.wallColor = '#20222e';
    }

    if (this.syncCallback) this.syncCallback();
    if (this.toastCallback) this.toastCallback(`✨ Applied AI ${style.toUpperCase()} interior theme`);
    return true;
  }

  handleItemMutationCommand(cmd) {
    if (cmd.includes('delete') || cmd.includes('remove')) {
      let removedName = '';
      this.state.items = this.state.items.filter(item => {
        if (cmd.includes(item.type) || cmd.includes(item.name.toLowerCase())) {
          removedName = item.name;
          return false;
        }
        return true;
      });

      if (removedName) {
        if (this.syncCallback) this.syncCallback();
        if (this.toastCallback) this.toastCallback(`🗑️ Removed ${removedName} from scene`);
        return true;
      }
    }

    return false;
  }
}
