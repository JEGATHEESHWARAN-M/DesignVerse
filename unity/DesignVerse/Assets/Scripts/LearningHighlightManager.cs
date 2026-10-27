using System.Collections.Generic;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — LEARNING HIGHLIGHT MANAGER
    /// Provides pedagogical visual indicators: soft outline glow, animated arrows,
    /// and focus indicators to guide young learners without spoiling solutions.
    /// </summary>
    public class LearningHighlightManager : MonoBehaviour
    {
        public static LearningHighlightManager Instance { get; private set; }

        [Header("Colors")]
        public Color primaryGuidanceColor = new Color(0.23f, 0.40f, 1.0f, 0.8f);    // Playful blue
        public Color successFeedbackColor = new Color(0.02f, 0.84f, 0.63f, 0.8f);   // Bright emerald
        public Color warningAreaColor     = new Color(1.0f, 0.72f, 0.01f, 0.8f);    // Amber warning
        public Color blockedCollisionColor = new Color(1.0f, 0.35f, 0.39f, 0.8f);   // Soft red

        private readonly List<EducationalObject> activeHighlights = new List<EducationalObject>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void HighlightCategory(string category, Color color)
        {
            ClearAllHighlights();
            var objects = FindObjectsOfType<EducationalObject>();
            foreach (var obj in objects)
            {
                if (obj.category.ToLower() == category.ToLower())
                {
                    obj.SetHighlight(true, color);
                    activeHighlights.Add(obj);
                }
            }
        }

        public void HighlightSpecificObject(EducationalObject obj, Color color)
        {
            if (obj != null)
            {
                obj.SetHighlight(true, color);
                activeHighlights.Add(obj);
            }
        }

        public void FlashSuccess(EducationalObject obj)
        {
            if (obj != null)
            {
                HighlightSpecificObject(obj, successFeedbackColor);
                Invoke(nameof(ClearAllHighlights), 1.5f);
            }
        }

        public void ClearAllHighlights()
        {
            foreach (var obj in activeHighlights)
            {
                if (obj != null)
                {
                    obj.SetHighlight(false, Color.white);
                }
            }
            activeHighlights.Clear();
        }
    }
}
