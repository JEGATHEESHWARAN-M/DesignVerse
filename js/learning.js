/**
 * DesignVerse Learning Engine — Client-Side Controller
 * Manages player XP, level progression, unlock checking, lesson UI, and tutor hints.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'designverse_learning_state';
  const DEFAULT_STATE = {
    userId: 'learner_' + Math.random().toString(36).substring(2, 9),
    xp: 0,
    level: 1,
    levelTitle: 'Room Explorer',
    badge: '🏠',
    completedLessons: [],
    unlockedFeatures: [
      'upload_photo',
      'view_room_analysis',
      'voice_learning_commands',
      'basic_color_change'
    ]
  };

  class LearningEngineClient {
    constructor() {
      this.state = this.loadState();
      this.levels = [];
      this.currentLesson = null;
      this.init();
    }

    loadState() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
      } catch (e) {
        console.warn('Could not load learning state from localStorage', e);
      }
      return Object.assign({}, DEFAULT_STATE);
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Could not save learning state', e);
      }
      this.renderTopbarBadge();
    }

    async init() {
      // Fetch level info if online, or fallback to embedded levels
      this.levels = [
        { level_id: 1, name: 'Room Explorer', xp_required: 0, badge: '🏠', unlocks: ['upload_photo', 'view_room_analysis', 'basic_color_change'] },
        { level_id: 2, name: 'Space Learner', xp_required: 300, badge: '📐', unlocks: ['move_furniture', 'snap_to_wall', 'basic_2d_editor'] },
        { level_id: 3, name: 'Design Apprentice', xp_required: 700, badge: '✏️', unlocks: ['full_2d_editor', 'add_object', 'rotate_object'] },
        { level_id: 4, name: 'Style Seeker', xp_required: 1500, badge: '🎨', unlocks: ['style_selector', 'ai_style_apply'] },
        { level_id: 5, name: 'Space Shaper', xp_required: 3000, badge: '🏗️', unlocks: ['full_3d_editor', 'orbit_camera', 'object_scale'] },
        { level_id: 6, name: 'Creative Designer', xp_required: 5500, badge: '🤖', unlocks: ['ai_design_generation', 'shopping_recommendations'] },
        { level_id: 7, name: 'Interior Architect', xp_required: 9000, badge: '🏛️', unlocks: ['voice_design_commands', 'walkthrough_mode'] },
        { level_id: 8, name: 'Design Director', xp_required: 14000, badge: '🎬', unlocks: ['multi_room_project', 'export_design'] },
        { level_id: 9, name: 'Design Expert', xp_required: 20000, badge: '⭐', unlocks: ['full_lighting_control', 'advanced_materials'] },
        { level_id: 10, name: 'DesignVerse Master', xp_required: 28000, badge: '🏆', unlocks: ['ALL'] }
      ];

      this.renderTopbarBadge();
      this.injectLearningModal();
      this.setupEventListeners();
    }

    awardXP(amount, reason) {
      this.state.xp += amount;
      this.checkLevelUp();
      this.saveState();
      this.showToast(`+${amount} XP: ${reason}! 🎉`);
    }

    checkLevelUp() {
      let currentLevel = 1;
      let badge = '🏠';
      let title = 'Room Explorer';
      let allUnlocks = new Set();

      for (const lvl of this.levels) {
        if (this.state.xp >= lvl.xp_required) {
          currentLevel = lvl.level_id;
          badge = lvl.badge;
          title = lvl.name;
          lvl.unlocks.forEach(u => allUnlocks.add(u));
        }
      }

      if (currentLevel > this.state.level) {
        this.state.level = currentLevel;
        this.state.badge = badge;
        this.state.levelTitle = title;
        this.state.unlockedFeatures = Array.from(allUnlocks);
        this.showLevelUpModal(currentLevel, title, badge);
      }
    }

    isFeatureUnlocked(featureId) {
      if (this.state.level >= 10) return true;
      return this.state.unlockedFeatures.includes(featureId) || this.state.unlockedFeatures.includes('ALL');
    }

    showLockedFeatureDialog(featureName, requiredLevel) {
      const modal = document.getElementById('dvLearningLockModal');
      if (!modal) return;
      document.getElementById('dvLockFeatureName').textContent = featureName;
      document.getElementById('dvLockReqLevel').textContent = 'Level ' + requiredLevel;
      modal.classList.add('active');
    }

    renderTopbarBadge() {
      let badgeElem = document.getElementById('learningBadgeWidget');
      if (!badgeElem) {
        const topbar = document.querySelector('.topbar-actions') || document.querySelector('.topbar-brand');
        if (topbar) {
          badgeElem = document.createElement('div');
          badgeElem.id = 'learningBadgeWidget';
          badgeElem.className = 'learning-badge-widget';
          badgeElem.innerHTML = `
            <span class="learning-icon">${this.state.badge}</span>
            <div class="learning-info">
              <span class="learning-lvl">Lvl ${this.state.level}</span>
              <span class="learning-xp">${this.state.xp} XP</span>
            </div>
          `;
          badgeElem.addEventListener('click', () => this.openDashboard());
          topbar.prepend(badgeElem);
        }
      } else {
        badgeElem.querySelector('.learning-icon').textContent = this.state.badge;
        badgeElem.querySelector('.learning-lvl').textContent = `Lvl ${this.state.level}`;
        badgeElem.querySelector('.learning-xp').textContent = `${this.state.xp} XP`;
      }
    }

    injectLearningModal() {
      if (document.getElementById('dvLearningHubModal')) return;

      const modalHtml = `
        <div id="dvLearningHubModal" class="learning-modal-overlay">
          <div class="learning-modal-content">
            <div class="learning-modal-header">
              <h2>🎓 Design Academy</h2>
              <button class="close-btn" id="dvCloseLearningHub">&times;</button>
            </div>
            <div class="learning-user-hero">
              <div class="hero-badge">${this.state.badge}</div>
              <div class="hero-details">
                <h3>${this.state.levelTitle} (Level ${this.state.level})</h3>
                <div class="xp-progress-bar">
                  <div class="xp-progress-fill" style="width: ${Math.min(100, (this.state.xp % 1000) / 10)}%"></div>
                </div>
                <p>${this.state.xp} XP Total</p>
              </div>
            </div>
            <div class="learning-curriculum">
              <h4>Active Practice & Missions</h4>
              <div class="lesson-card" data-lesson="l1_what_is_a_room">
                <span class="lesson-status">✨ +50 XP</span>
                <div class="lesson-desc">
                  <strong>What is a Room?</strong>
                  <p>Explore basic boundaries: floor, walls, ceiling.</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.designverseLearning.startLesson('l1_what_is_a_room')">Practice</button>
              </div>
              <div class="lesson-card" data-lesson="l1_first_color_change">
                <span class="lesson-status">🎨 +80 XP</span>
                <div class="lesson-desc">
                  <strong>Color Harmonies</strong>
                  <p>Apply warm and cool tones to room surfaces.</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.designverseLearning.startLesson('l1_first_color_change')">Start</button>
              </div>
            </div>
          </div>
        </div>

        <div id="dvLearningLockModal" class="learning-modal-overlay">
          <div class="learning-modal-content lock-modal">
            <div class="lock-icon">🔒</div>
            <h3 id="dvLockFeatureName">Feature Locked</h3>
            <p>This pro tool unlocks at <strong id="dvLockReqLevel">Level 2</strong>.</p>
            <p class="lock-tip">Complete daily design missions to earn XP and level up!</p>
            <button class="btn btn-primary" id="dvCloseLockModal">Got It</button>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHtml;
      document.body.appendChild(wrapper);

      document.getElementById('dvCloseLearningHub').addEventListener('click', () => {
        document.getElementById('dvLearningHubModal').classList.remove('active');
      });
      document.getElementById('dvCloseLockModal').addEventListener('click', () => {
        document.getElementById('dvLearningLockModal').classList.remove('active');
      });
    }

    openDashboard() {
      const modal = document.getElementById('dvLearningHubModal');
      if (modal) modal.classList.add('active');
    }

    startLesson(lessonId) {
      const modal = document.getElementById('dvLearningHubModal');
      if (modal) modal.classList.remove('active');

      if (lessonId === 'l1_what_is_a_room') {
        this.awardXP(50, 'Completed Lesson: What is a Room');
      } else if (lessonId === 'l1_first_color_change') {
        this.awardXP(80, 'Completed Practice: Color Harmonies');
      }
    }

    showToast(message) {
      let toast = document.getElementById('dvLearningToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dvLearningToast';
        toast.className = 'learning-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    showLevelUpModal(lvl, title, badge) {
      alert(`🎉 LEVEL UP! You reached Level ${lvl}: ${title}! ${badge}\nNew features have been unlocked.`);
    }

    setupEventListeners() {
      // Intercept pro feature clicks if locked
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-feature-lock]');
        if (target) {
          const feat = target.getAttribute('data-feature-lock');
          const reqLvl = parseInt(target.getAttribute('data-req-level') || '2', 10);
          if (!this.isFeatureUnlocked(feat)) {
            e.preventDefault();
            e.stopPropagation();
            this.showLockedFeatureDialog(feat, reqLvl);
          }
        }
      }, true);
    }
  }

  // Expose global client instance
  window.designverseLearning = new LearningEngineClient();
})();
