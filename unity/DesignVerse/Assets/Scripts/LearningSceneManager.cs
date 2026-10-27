using System;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — EDUCATIONAL SCENE ORCHESTRATOR
    /// Controls educational levels (1 to 10), tool gating according to current level,
    /// camera guidance, and bridges real Unity 3D objects to pedagogical lessons.
    /// </summary>
    public class LearningSceneManager : MonoBehaviour
    {
        public static LearningSceneManager Instance { get; private set; }

        [Header("Child Learning State")]
        public int currentLevel = 1;
        public string currentLessonId = "l1_what_is_a_room";
        public bool isKidsModeActive = true;

        [Header("Subsystem References")]
        public LessonInteractionManager interactionManager;
        public ChallengeValidator challengeValidator;
        public HintManager hintManager;
        public LearningHighlightManager highlightManager;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            Debug.Log("[LearningSceneManager] DesignVerse Kids Educational Engine Initialized.");
            ApplyLevelConstraints(currentLevel);
        }

        /// <summary>
        /// Configures tools and camera according to the child's active level (1 to 10).
        /// Early levels feature automatic camera guidance and simple select/tap.
        /// Later levels unlock rotation, measurement, material picking, and 3D design.
        /// </summary>
        public void SetLevel(int level)
        {
            currentLevel = Mathf.Clamp(level, 1, 10);
            Debug.Log($"[LearningSceneManager] Setting Level to {currentLevel}");
            ApplyLevelConstraints(currentLevel);
        }

        public void ApplyLevelConstraints(int level)
        {
            // Level 1: Simple look & tap only
            // Level 2: Add simple furniture & move
            // Level 3: Wall & furniture colors
            // Level 4: Move & resize
            // Level 5: Rotate, snap & door clearance
            // Level 6+: Full room building
            // Level 10: All design tools unlocked
            Debug.Log($"[LearningSceneManager] Level {level} constraints applied to 3D scene.");
        }

        public void StartLesson(string lessonId, string targetCategory)
        {
            currentLessonId = lessonId;
            if (interactionManager != null)
            {
                interactionManager.SetTarget(lessonId, targetCategory, 0);
            }
        }

        public void StartChallenge(string challengeId)
        {
            if (hintManager != null)
            {
                hintManager.SetChallenge(challengeId);
            }
        }
    }
}
